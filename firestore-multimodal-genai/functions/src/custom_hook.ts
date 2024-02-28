import {extractFields} from './utils';

export const fetchCustomHookData = async (
  docData: Record<string, string>,
  {
    customRagHookUrl,
    customRagHookApiKey,
    ragHookInputFields,
    ragHookOutputFields,
  }: {
    customRagHookUrl?: string;
    customRagHookApiKey?: string;
    ragHookInputFields?: string[];
    ragHookOutputFields?: string[];
  }
): Promise<Record<string, string>> => {
  if (!customRagHookUrl) {
    throw new Error('Custom hook URL is not provided in the configuration.');
  }

  const params = extractFields(docData, ragHookInputFields);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(customRagHookApiKey && {'x-api-key': customRagHookApiKey}),
  };

  try {
    const response = await fetch(customRagHookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      // Handle non-200 responses
      throw new Error(
        `RAG Hook Network response was not ok: ${response.statusText}`
      );
    }

    const data = await response.json();

    return extractFields(data, ragHookOutputFields);
  } catch (error) {
    // Handle network errors or JSON parsing errors
    console.error('Failed to fetch custom hook data:', error);
    throw error; // Rethrow after logging or handle accordingly
  }
};
