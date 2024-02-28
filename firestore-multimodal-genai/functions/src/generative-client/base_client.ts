interface GenerativeResponse {
  candidates: string[];
  safetyMetadata?: {
    blocked: boolean;
    [key: string]: any;
  };
}

export abstract class GenerativeClient<GenerativeRequestOptions, Client> {
  client?: Client;
  constructor() {}

  async generate(
    _promptText: string,
    _options?: GenerativeRequestOptions
  ): Promise<GenerativeResponse> {
    throw new Error('Not implemented');
  }
}
