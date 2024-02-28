import * as logFunctions from './logs'; // Adjust the path to where your functions are located
import {logger} from 'firebase-functions';
import config from './__mocks__/config';

jest.mock('firebase-functions', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    log: jest.fn(),
  },
}));

describe('Log Functions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('init logs correct information', () => {
    logFunctions.init(config);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining('Initialized with config')
    );

    const obfuscatedConfig = {
      ...config,
      apiKey: '[REDACTED]',
    };
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(JSON.stringify(obfuscatedConfig))
    );
  });

  test('missingField logs correct information', () => {
    logFunctions.missingField('field', 'path');
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        "Missing ordering field 'field' on document 'path'"
      )
    );
  });

  test('receivedAPIResponse logs correct information', () => {
    logFunctions.receivedAPIResponse('path', 100);
    expect(logger.info).toHaveBeenCalledWith(
      expect.stringContaining(
        "[firestore-multimodal-genai] Received API response for document 'path' in 100ms"
      )
    );
  });

  test('errorCallingGLMAPI logs correct error message', () => {
    const error = new Error('Test Error');
    logFunctions.errorCallingGLMAPI('path', error);
    expect(logger.error).toHaveBeenCalledWith(
      expect.stringContaining("Error calling Gemini API for document 'path'")
    );
  });

  test('usingADC logs correct message', () => {
    logFunctions.usingADC();
    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining(
        'no API key provided, using application default credentials.'
      )
    );
  });

  test('usingAPIKey logs correct message', () => {
    logFunctions.usingAPIKey();
    expect(logger.log).toHaveBeenCalledWith(
      expect.stringContaining('using API key provided.')
    );
  });
});
