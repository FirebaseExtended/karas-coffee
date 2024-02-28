import {fetchCustomHookData} from './custom_hook';
const utils = require('./utils');
const mock = jest.spyOn(utils, 'extractFields');

describe.skip('fetchCustomHookData', () => {
  const globalFetch = global.fetch;

  let mockData = {};
  let mockOK = true;

  beforeEach(() => {
    mockOK = true;
    mockData = {};
    jest.clearAllMocks(); // Clear mocks between tests

    // Mock fetch inside beforeEach to ensure it's reset for each test
    global.fetch = jest.fn().mockImplementation(async () => ({
      ok: mockOK,
      json: async () => mockData,
    }));
  });

  afterAll(() => {
    global.fetch = globalFetch;
  });

  test('successfully fetches and processes data', async () => {
    mockData = {
      field3: 'test',
    };
    const mockConfig = {
      customRagHookUrl: 'http://example.com',
      customRagHookApiKey: 'test-api-key',
      ragHookInputFields: ['field1', 'field2'],
      ragHookOutputFields: ['field3', 'field4'],
    };
    const docData = {field1: 'value1', field2: 'value2'};
    const result = await fetchCustomHookData(docData, mockConfig);

    expect(fetch).toHaveBeenCalledWith(mockConfig.customRagHookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': mockConfig.customRagHookApiKey,
      },
      body: JSON.stringify(docData), // Assuming extractFields returns docData directly in this mock
    });

    expect(mock).toHaveBeenCalledTimes(2); // Called for both input and output processing
    expect(result).toEqual({field3: 'test'}); // Assuming extractFields returns the fetched data directly in this mock
  });

  test('throws error when custom hook URL is not provided', async () => {
    const mockConfig = {
      customRagHookUrl: 'http://example.com',
      customRagHookApiKey: 'test-api-key',
      ragHookInputFields: ['field1', 'field2'],
      ragHookOutputFields: ['field3', 'field4'],
    };
    await expect(
      fetchCustomHookData({}, {...mockConfig, customRagHookUrl: ''})
    ).rejects.toThrow('Custom hook URL is not provided in the configuration.');
  });

  // Test for handling fetch failure due to network error
  test('handles fetch failure due to network error', async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

    const mockConfig = {
      customRagHookUrl: 'http://example.com',
      customRagHookApiKey: 'test-api-key',
      ragHookInputFields: ['field1', 'field2'],
      ragHookOutputFields: ['field3', 'field4'],
    };
    const docData = {field1: 'value1', field2: 'value2'};

    await expect(fetchCustomHookData(docData, mockConfig)).rejects.toThrow(
      'Network error'
    );
  });

  // Test for validating response with `ok` status false
  test('validates response with `ok` status false', async () => {
    mockOK = false; // Simulate an unsuccessful response
    global.fetch = jest.fn().mockImplementation(async () => ({
      ok: mockOK,
      statusText: 'Internal Server Error',
      json: async () => mockData,
    }));

    const mockConfig = {
      customRagHookUrl: 'http://example.com',
      customRagHookApiKey: 'test-api-key',
      ragHookInputFields: ['field1', 'field2'],
      ragHookOutputFields: ['field3', 'field4'],
    };
    const docData = {field1: 'value1', field2: 'value2'};

    await expect(fetchCustomHookData(docData, mockConfig)).rejects.toThrow(
      'Internal Server Error'
    );
  });

  // Test for processing empty or unexpected data returned from the custom hook
  test('processes empty or unexpected data returned from the custom hook', async () => {
    mockData = {}; // Simulate an empty or unexpected response

    const mockConfig = {
      customRagHookUrl: 'http://example.com',
      customRagHookApiKey: 'test-api-key',
      ragHookInputFields: ['field1', 'field2'],
      ragHookOutputFields: ['field3', 'field4'],
    };
    const docData = {field1: 'value1', field2: 'value2'};

    const result = await fetchCustomHookData(docData, mockConfig);

    expect(result).toEqual({}); // Expect an empty object or handle unexpected data gracefully
  });
});
