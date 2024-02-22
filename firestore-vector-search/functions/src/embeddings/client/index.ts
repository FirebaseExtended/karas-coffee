import { config, EmbeddingProvider } from "../../config";
import { MultimodalEmbeddingClient } from "./multimodal";
import { CustomEndpointClient } from "./text/custom_function";
import { GeminiAITextEmbedClient } from "./text/gemini";
import { OpenAIEmbedClient } from "./text/open_ai";

const getEmbeddingClient = () => {
  switch (config.embeddingProvider) {
    case "gemini" as EmbeddingProvider.Gemini:
      return new GeminiAITextEmbedClient();
    case "multimodal" as EmbeddingProvider.Multimodal:
      return new MultimodalEmbeddingClient({
        batchSize: 1,
        dimension: 1408,
      });
    case "openai" as EmbeddingProvider.OpenAI:
      return new OpenAIEmbedClient();
    case "custom" as EmbeddingProvider.Custom:
      return new CustomEndpointClient();
    default:
      throw new Error("Provider option not implemented");
  }
};

export const embeddingClient = getEmbeddingClient();
