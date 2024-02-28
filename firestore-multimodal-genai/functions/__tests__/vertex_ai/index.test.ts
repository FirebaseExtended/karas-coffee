import * as firebaseFunctionsTest from 'firebase-functions-test';
import * as admin from 'firebase-admin';
import config from '../../src/config';
import {generateText} from '../../src/index';
import {WrappedFunction} from 'firebase-functions-test/lib/v1';
import {Change} from 'firebase-functions/v1';

import {QuerySnapshot} from 'firebase-admin/firestore';
import {expectToProcessCorrectly} from '../util';

process.env.GCLOUD_PROJECT = 'demo-gcp';

process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:8080';

// // We mock out the config here instead of setting environment variables directly
jest.mock('../../src/config', () => ({
  default: {
    googleAi: {
      model: 'gemini-pro',
    },
    vertex: {
      model: 'gemini-pro',
    },
    collectionName: 'generate',
    location: 'us-central1',
    prompt: '{{ instruction }}',
    variableFields: ['instruction'],
    responseField: 'output',
    imageField: 'image',
    projectId: 'demo-test',
    instanceId: 'demo-test',
    provider: 'vertex-ai',
  },
}));

// // mock to check the arguments passed to the annotateVideo function+
const mockGetClient = jest.fn();
const mockGetModel = jest.fn();
const mockGenerateContentStream = jest.fn();

jest.mock('@google-cloud/vertexai', () => {
  return {
    ...jest.requireActual('@google-cloud/vertexai'),
    VertexAI: function mockedClient(args: any) {
      mockGetClient(args);
      return {
        preview: {
          getGenerativeModel: (args: unknown) => {
            mockGetModel(args);
            return {
              generateContentStream: async function mockedStartChat(args: any) {
                mockGenerateContentStream(args);
                return {
                  response: {
                    candidates: [
                      {
                        content: {
                          parts: [
                            {
                              text: 'test response',
                            },
                          ],
                        },
                      },
                    ],
                  },
                };
              },
            };
          },
        },
      };
    },
  };
});

const fft = firebaseFunctionsTest({
  projectId: 'demo-gcp',
});

if (!admin.apps.length) {
  admin.initializeApp({
    projectId: 'demo-gcp',
  });
}

type DocumentReference = admin.firestore.DocumentReference;
type DocumentData = admin.firestore.DocumentData;
type DocumentSnapshot = admin.firestore.DocumentSnapshot<DocumentData>;
type WrappedFirebaseFunction = WrappedFunction<
  Change<DocumentSnapshot | undefined>,
  void
>;
const Timestamp = admin.firestore.Timestamp;

const wrappedGenerateMessage = fft.wrap(
  generateText
) as WrappedFirebaseFunction;

const firestoreObserver = jest.fn((_x: any) => {});
let collectionName: string;

describe('generateMessage', () => {
  let unsubscribe: (() => void) | undefined;

  // clear firestore
  beforeEach(async () => {
    await fetch(
      `http://${process.env.FIRESTORE_EMULATOR_HOST}/emulator/v1/projects/demo-gcp/databases/(default)/documents`,
      {method: 'DELETE'}
    );
    jest.clearAllMocks();
    const randomInteger = Math.floor(Math.random() * 1000000);
    collectionName = config.collectionName.replace(
      '{discussionId}',
      randomInteger.toString()
    );

    // set up observer on collection
    unsubscribe = admin
      .firestore()
      .collection(collectionName)
      .onSnapshot((snap: QuerySnapshot) => {
        /** There is a bug on first init and write, causing the the emulator to the observer is called twice
         * A snapshot is registered on the first run, this affects the observer count
         * This is a workaround to ensure the observer is only called when it should be
         */
        if (snap.docs.length) firestoreObserver(snap);
      });
  });
  afterEach(() => {
    if (unsubscribe && typeof unsubscribe === 'function') {
      unsubscribe();
    }
    jest.clearAllMocks();
  });

  test('should not run if the prompt field is not set', async () => {
    const notMessage = {
      notPrompt: 'hello chat bison',
    };
    // Make a write to the collection. This won't trigger our wrapped function as it isn't deployed to the emulator.
    const ref = await admin
      .firestore()
      .collection(collectionName)
      .add(notMessage);

    await simulateFunctionTriggered(wrappedGenerateMessage)(ref);

    await expectNoOp();
  });

  test('should not run if the prompt field is empty', async () => {
    const notMessage = {
      prompt: '',
    };

    const ref = await admin
      .firestore()
      .collection(collectionName)
      .add(notMessage);

    await simulateFunctionTriggered(wrappedGenerateMessage)(ref);

    await expectNoOp();
  });

  test('should not run if the prompt field is not a string', async () => {
    const notMessage = {
      instruction: 123,
    };

    const ref = await admin
      .firestore()
      .collection(collectionName)
      .add(notMessage);

    await simulateFunctionTriggered(wrappedGenerateMessage)(ref);

    const firestoreCallData = firestoreObserver.mock.calls.map(call => {
      return call[0].docs[0].data();
    });

    expect(firestoreCallData.length).toEqual(3);

    expect(firestoreCallData[0]).toEqual({
      ...notMessage,
    });
    expect(firestoreCallData[1]).toEqual({
      ...notMessage,
      status: {
        state: 'PROCESSING',
        startTime: expect.any(Timestamp),
        updateTime: expect.any(Timestamp),
      },
    });

    expect(firestoreCallData[2]).toEqual({
      ...notMessage,
      status: {
        state: 'ERRORED',
        error:
          'An error occurred while processing the provided message, Error substituting variable "instruction" variables into prompt. All variable fields must be strings',
        startTime: expect.any(Timestamp),
        updateTime: expect.any(Timestamp),
        completeTime: expect.any(Timestamp),
      },
    });

    await expectNoOp();
  });

  test('should run when given createTime', async () => {
    const message = {
      instruction: 'hello gemini',
      createTime: Timestamp.now(),
    };
    const ref = await admin.firestore().collection(collectionName).add(message);

    await simulateFunctionTriggered(wrappedGenerateMessage)(ref);

    expect(firestoreObserver).toHaveBeenCalledTimes(3);

    const firestoreCallData = firestoreObserver.mock.calls.map(call =>
      call[0].docs[0].data()
    );

    expectToProcessCorrectly(firestoreCallData, message, 'test response');

    expect(mockGetClient).toHaveBeenCalledTimes(1);

    expect(mockGetModel).toHaveBeenCalledTimes(1);
    expect(mockGetModel).toHaveBeenCalledWith({model: config.vertex.model});

    expect(mockGenerateContentStream).toHaveBeenCalledTimes(1);
    expect(mockGenerateContentStream).toHaveBeenCalledWith({
      contents: [
        {
          parts: [
            {
              text: 'hello gemini',
            },
          ],
          role: 'user',
        },
      ],
      generation_config: {
        top_k: undefined,
        top_p: undefined,
        temperature: undefined,
        candidate_count: undefined,
        max_output_tokens: undefined,
      },
    });
  });

  test('should run when not given createTime', async () => {
    const message = {
      instruction: 'hello gemini',
    };

    // Make a write to the collection. This won't trigger our wrapped function as it isn't deployed to the emulator.
    const ref = await admin.firestore().collection(collectionName).add(message);

    const beforeOrderField = await simulateFunctionTriggered(
      wrappedGenerateMessage
    )(ref);

    await simulateFunctionTriggered(wrappedGenerateMessage)(
      ref,
      beforeOrderField
    );

    // we expect the firestore observer to be called 4 times total.
    expect(firestoreObserver).toHaveBeenCalledTimes(3);

    const firestoreCallData = firestoreObserver.mock.calls.map(call => {
      return call[0].docs[0].data();
    });

    expectToProcessCorrectly(firestoreCallData, message, 'test response');

    // // verify SDK is called with expected arguments
    // we expect the mock API to be called once
    expect(mockGetClient).toHaveBeenCalledTimes(1);

    expect(mockGetModel).toHaveBeenCalledTimes(1);
    expect(mockGetModel).toBeCalledWith({model: config.vertex.model});

    expect(mockGenerateContentStream).toHaveBeenCalledTimes(1);
    expect(mockGenerateContentStream).toHaveBeenCalledWith({
      contents: [
        {
          parts: [
            {
              text: 'hello gemini',
            },
          ],
          role: 'user',
        },
      ],
      generation_config: {
        top_k: undefined,
        top_p: undefined,
        temperature: undefined,
        candidate_count: undefined,
        max_output_tokens: undefined,
      },
      safety_settings: undefined,
    });
  });
});

const simulateFunctionTriggered =
  (wrappedFunction: WrappedFirebaseFunction) =>
  async (ref: DocumentReference, before?: DocumentSnapshot) => {
    const data = (await ref.get()).data() as {[key: string]: unknown};
    const beforeFunctionExecution = fft.firestore.makeDocumentSnapshot(
      data,
      `${collectionName}/${ref.id}`
    ) as DocumentSnapshot;
    const change = fft.makeChange(before, beforeFunctionExecution);
    await wrappedFunction(change);
    return beforeFunctionExecution;
  };

const expectNoOp = async () => {
  await new Promise(resolve => setTimeout(resolve, 100));
  expect(mockGetModel).toHaveBeenCalledTimes(0);
};
