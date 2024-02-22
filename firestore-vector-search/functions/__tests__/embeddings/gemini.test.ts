import { GeminiAITextEmbedClient } from "../../src/embeddings/client/text/gemini";
// import { config } from "../../src/config";

// mock config
// jest.mock("../../src/config", () => ({
//   ...jest.requireActual("../../src/config"),
//   geminiApiKey: "test-api-key",
// }));

describe("GenerativeAIPalmEmbedClient", () => {
  let embedClient;

  beforeEach(() => {
    embedClient = new GeminiAITextEmbedClient();
  });

  describe("initialize", () => {
    test("should properly initialize the client", async () => {
      await embedClient.initialize();

      expect(embedClient.client).toBeDefined();
      //   expect(GoogleGenerativeAI).toHaveBeenCalledWith(config.geminiApiKey);
    });
  });

  describe("getEmbeddings", () => {
    test("should return embeddings for a batch of text", async () => {
      const mockEmbedContent = jest
        .fn()
        .mockResolvedValue({ embedding: [1, 2, 3] });
      embedClient.client = {
        getGenerativeModel: jest.fn(() => ({
          embedContent: mockEmbedContent,
        })),
      };

      const batch = ["text1", "text2"];
      const results = await embedClient.getEmbeddings(batch);

      expect(mockEmbedContent).toHaveBeenCalledTimes(batch.length);
      expect(results).toEqual([[1, 2, 3], [1, 2, 3]]);
    });

    test("should throw an error if the embedding process fails", async () => {
      embedClient.client = {
        getGenerativeModel: jest.fn(() => ({
          embedContent: jest
            .fn()
            .mockRejectedValue(new Error("Embedding failed")),
        })),
      };

      await expect(embedClient.getEmbeddings(["text"])).rejects.toThrow(
        "Error with embedding"
      );
    });
  });
});
