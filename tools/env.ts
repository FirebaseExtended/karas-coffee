import { config, DotenvParseOutput } from 'dotenv';

interface Env extends DotenvParseOutput {
  STRIPE_SECRET_KEY: string;
}

export const env: Env = config().parsed as Env;
