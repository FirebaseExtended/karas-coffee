import { useFunctionsQuery } from '@react-query-firebase/functions';
import { functions } from '../firebase';

export function useSearchTermExtractor(conversation: string) {
  const searchTerm = useFunctionsQuery<
    {
      conversation: string;
    },
    { response: string }
  >(
    ['extractor', conversation],
    functions,
    'ext-firestore-multimodal-genai-generateOnCall',
    {
      conversation,
    },
    {},
    {
      enabled: !!conversation,
    },
  );

  console.log(searchTerm.data);

  return searchTerm;
}
