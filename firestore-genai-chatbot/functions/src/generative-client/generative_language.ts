import {DiscussionClient, Message} from './base_class';
import {v1} from '@google-ai/generativelanguage';
import * as generativeLanguage from '@google-ai/generativelanguage';
import {logger} from 'firebase-functions/v1';
import {GoogleAuth} from 'google-auth-library';

type Part = generativeLanguage.protos.google.ai.generativelanguage.v1.IPart;
type Content =
  generativeLanguage.protos.google.ai.generativelanguage.v1.IContent;

interface GeminiChatOptions {
  history?: Message[];
  model: string;
  temperature?: number;
  candidateCount?: number;
  topP?: number;
  topK?: number;
  maxOutputTokens?: number;
  projectId: string;
  location: string;
  context?: string;
}

type ApiMessage = {
  role: string;
  parts: Part[];
};

enum Role {
  USER = 'user',
  GEMINI = 'model',
}

export class GenerativeLanguageDiscussionClient extends DiscussionClient<
  v1.GenerativeServiceClient,
  GeminiChatOptions,
  ApiMessage
> {
  modelName: string;
  constructor({apiKey, modelName}: {apiKey?: string; modelName: string}) {
    super();
    if (!apiKey) {
      this.client = new v1.GenerativeServiceClient();
    } else {
      const authClient = new GoogleAuth().fromAPIKey(apiKey);
      this.client = new v1.GenerativeServiceClient({
        authClient,
      });
    }
    if (!modelName) {
      throw new Error('Model name required.');
    }
    this.modelName = modelName;
  }

  createApiMessage(
    messageContent: string,
    role: 'user' | 'model' = 'user'
  ): ApiMessage {
    const apiRole = role === 'user' ? Role.USER : Role.GEMINI;
    return {
      role: apiRole,
      parts: [{text: messageContent}],
    };
  }

  async generateResponse(
    history: Message[],
    latestApiMessage: ApiMessage,
    _options: GeminiChatOptions
  ) {
    if (!this.client) {
      throw new Error('Client not initialized.');
    }

    // const chatSession = model.startChat({
    //   history: this.messagesToApi(history),
    //   generationConfig: {
    //     topP: _options.topP,
    //     topK: _options.topK,
    //     temperature: _options.temperature,
    //     maxOutputTokens: _options.maxOutputTokens,
    //     candidateCount: _options.candidateCount,
    //   },
    // });

    let result;
    try {
      result = await this.client.generateContent({
        model: this.modelName,
        contents: [...this.messagesToApi(history), latestApiMessage],
        generationConfig: {
          topP: _options.topP,
          topK: _options.topK,
          temperature: _options.temperature,
          maxOutputTokens: _options.maxOutputTokens,
          candidateCount: _options.candidateCount,
        },
      });
      // result = await chatSession.sendMessage(latestApiMessage.parts[0].text);
    } catch (e) {
      logger.error(e);
      // TODO: the error message provided exposes the API key, so we should handle this/ get the Gemini team to fix it their side.
      throw new Error(
        'Failed to generate response, see function logs for more details.'
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
      safetyMetadata: response.promptFeedback,
      history,
    };
  }

  private messagesToApi(messages: Message[]) {
    const out: Content[] = [];
    for (const message of messages) {
      if (!message.prompt || !message.response) {
        // logs.warnMissingPromptOrResponse(message.path!);
        continue;
      }
      out.push({role: Role.USER, parts: [{text: message.prompt!}]});
      out.push({role: Role.GEMINI, parts: [{text: message.response!}]});
    }
    return out;
  }
}
