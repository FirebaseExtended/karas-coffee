import {v1} from '@google-ai/generativelanguage';
import * as generativeLanguage from '@google-ai/generativelanguage';

import {GenerativeClient} from './base_client';
import {logger} from 'firebase-functions/v1';
import {GoogleAuth} from 'google-auth-library';
import {getImageBase64} from './image_utils';
enum Role {
  USER = 'user',
  GEMINI = 'model',
}

// import IPart
type Part = generativeLanguage.protos.google.ai.generativelanguage.v1.IPart;

export class GenerativeLanguageClient extends GenerativeClient<
  any,
  v1.GenerativeServiceClient
> {
  apiKey?: string;
  modelName: string;

  constructor({apiKey, modelName}: {apiKey?: string; modelName: string}) {
    super();
    if (apiKey) {
      const authClient = new GoogleAuth().fromAPIKey(apiKey);
      this.client = new v1.GenerativeServiceClient({
        authClient,
      });
    } else {
      this.client = new v1.GenerativeServiceClient();
    }
    this.modelName = modelName;
  }

  async generate(promptText: string, options: any): Promise<any> {
    if (!this.client) {
      throw new Error('Gemini Client not initialized.');
    }

    const textPart: Part = {
      text: promptText,
    };
    const promptParts: Part[] = [textPart];

    if (this.modelName.includes('gemini-pro-vision')) {
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
      result = await this.client.generateContent({
        model: this.modelName,
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
      });
    } catch (e) {
      logger.error(e);
      // TODO: the error message provided exposes the API key, so we should handle this/ get the Gemini team to fix it their side.
      throw new Error(
        'failed to generate content, see function logs for details'
      );
    }

    const response = result[0];

    if (
      !response.candidates ||
      !Array.isArray(response.candidates) ||
      response.candidates.length === 0
    ) {
      // TODO: handle blocked responses
      throw new Error('No candidates returned');
    }

    const candidates = response.candidates.filter(c => {
      return (
        c &&
        c.content &&
        c.content.parts &&
        c.content.parts.length > 0 &&
        c.content.parts[0].text &&
        typeof c.content.parts[0].text === 'string'
      );
    });

    return {
      response: candidates[0]!.content!.parts![0].text!,
      candidates: candidates?.map(c => c.content!.parts![0].text!) ?? [],
      // TODO: add this as a feature:
      // safetyMetadata: promptFeedback,
    };
  }
}
