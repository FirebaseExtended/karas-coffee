export default {
  vertex: {
    model: 'gemini-pro',
  },
  googleAi: {
    model: 'gemini-pro',
    apiKey: 'test-api-key',
  },
  location: 'us-central1',
  projectId: 'text-project-id',
  instanceId: 'text-instance-id',
  collectionName: 'discussions',
  prompt: 'test prompt',
  responseField: 'output',
  candidateCount: 1,
  provider: 'vertex-ai',
  apiKey: process.env.API_KEY,
  bucketName: 'demo-gcp.appspot.com',
  imageField: 'image',
  customRagHookUrl: 'https://www.test.com',
  ragHookInputFields: ['test'],
  ragHookOutputFields: ['foo'],
};
