import {GoogleGenerativeAI, Part} from '@google/generative-ai';
import {GenerativeClient} from './base_client';
import {logger} from 'firebase-functions/v1';
import {getImageBase64} from './image_utils';
enum Role {
  USER = 'user',
  GEMINI = 'model',
}

export class GeminiGenerativeClient extends GenerativeClient<
  any,
  GoogleGenerativeAI
> {
  apiKey: string;
  modelName: string;

  constructor({apiKey, modelName}: {apiKey: string; modelName: string}) {
    super();
    this.apiKey = apiKey;
    this.client = new GoogleGenerativeAI(this.apiKey);
    this.modelName = modelName;
  }

  async generate(promptText: string, options: any): Promise<any> {
    if (!this.client) {
      throw new Error('Gemini Client not initialized.');
    }

    const model = this.client.getGenerativeModel({
      model: this.modelName,
    });
    const textPart: Part = {
      text: promptText,
    };
    const promptParts: Part[] = [textPart];

    if (this.modelName === 'gemini-pro-vision') {
      if (!options.image) {
        throw new Error('Gemini Pro Vision selected, but missing Image Field');
      }

      const base64String = await getImageBase64(options.image, 'google-ai');

      const imagePart = {
        inlineData: {
          mimeType: 'image/png',
          data: base64String,
        },
      };

      promptParts.push(imagePart);
    }
    let result;
    try {
      result = await model.generateContent({
        contents: [
          {
            role: Role.USER,
            parts: promptParts,
          },
        ],
        generationConfig: {
          topK: options.topK,
          topP: options.topP,
          temperature: options.temperature,
          candidateCount: options.candidateCount,
          maxOutputTokens: options.maxOutputTokens,
        },
        safetySettings: options.safetySettings,
      });
    } catch (e) {
      logger.error(e);
      // TODO: the error message provided exposes the API key, so we should handle this/ get the Gemini team to fix it their side.
      throw new Error(
        'failed to generate content, see function logs for details'
      );
    }

    const candidates =
      result.response.candidates?.map(c => c.content.parts[0].text) || [];

    if (!candidates || candidates.length === 0) {
      // TODO: handle blocked responses
      throw new Error('No candidates returned');
    }
    const firstCandidate = candidates[0];

    return {
      response: firstCandidate!,
      candidates: candidates,
      // TODO: add this as a feature:
      // safetyMetadata: promptFeedback,
    };
  }
}
