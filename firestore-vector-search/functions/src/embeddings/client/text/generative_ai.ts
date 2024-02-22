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

import { performance } from "perf_hooks";
import { EmbedClient } from "../base_class";
import { v1beta3 } from "@google-ai/generativelanguage";
import { GoogleAuth } from "google-auth-library";
const { TextServiceClient } = v1beta3;

export class GenerativeAIPalmEmbedClient extends EmbedClient {
  client: InstanceType<typeof TextServiceClient> | undefined;

  constructor() {
    super({ batchSize: 100, dimension: 768 });
  }

  async initialize() {
    await super.initialize();
    if (!this.client) {
      const t0 = performance.now();

      const auth = new GoogleAuth({
        scopes: [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/generative-language",
        ],
      });

      this.client = new TextServiceClient({ auth });

      const duration = performance.now() - t0;

      console.log(
        `Initialized Generative PaLM Client. This took ${duration}ms`
      );
    }
  }

  async getEmbeddings(batch: string[]): Promise<number[][]> {
    const request = {
      model: "models/embedding-gecko-001",
      texts: batch,
    };

    const [response] = await this.client.batchEmbedText(request);

    const { embeddings } = response;
    // TODO: do we need to check the value exists here?
    return embeddings.map((e) => e.value);
  }
}
