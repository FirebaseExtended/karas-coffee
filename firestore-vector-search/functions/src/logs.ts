import { obfuscatedConfig } from "./config";
import { logger } from "firebase-functions";

export function init() {
  logger.log("Initializing extension with configuration", obfuscatedConfig);
}
