/**
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { EmbedClient } from "../base_class";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { config } from "../../../config";

export class GeminiAITextEmbedClient extends EmbedClient {
  client: GoogleGenerativeAI | undefined;

  constructor() {
    super({ batchSize: 100, dimension: 768 });
  }

  async initialize() {
    await super.initialize();
    if (!this.client) {
      this.client = new GoogleGenerativeAI(config.geminiApiKey);
    }
  }

  async getEmbeddings(batch: string[]) {
    const model = this.client.getGenerativeModel({ model: "embedding-001" });

    const requests = batch.map((text) => ({
      content: {
        parts: [
          {
            text,
          },
        ],
        role: "user",
      },
    }));

    try {
      const result = await model.batchEmbedContents({
        requests,
      });

      const values = result.embeddings.map((r) => r.values);

      return values;
    } catch (e) {
      console.error("Error fetching embeddings:", e);
      throw new Error("Error with embedding");
    }
  }
}
