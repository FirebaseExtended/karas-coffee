import { onSnapshot, Query, queryEqual } from 'firebase/firestore';
import { useEffect, useReducer } from 'react';
import { useMemoCompare } from './useMemoCompare';

type State<T = any> =
  | {
      status: 'loading';
      data: undefined;
      error: undefined;
      isSuccess: false;
      isError: false;
      isLoading: true;
    }
  | {
      status: 'success';
      data: T;
      error: undefined;
      isSuccess: true;
      isError: false;
      isLoading: false;
    }
  | {
      status: 'error';
      data: undefined;
      error: Error;
      isSuccess: false;
      isError: true;
      isLoading: false;
    };

type Action = { type: 'loading' } | { type: 'success'; payload: any } | { type: 'error'; payload: Error };

const initialState: State = {
  status: 'loading',
  data: undefined,
  error: undefined,
  isLoading: true,
  isError: false,
  isSuccess: false,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return initialState;
    case 'success':
      return {
        status: 'success',
        data: action.payload,
        error: undefined,
        isLoading: false,
        isError: false,
        isSuccess: true,
      };
    case 'error':
      return {
        status: 'error',
        data: undefined,
        error: action.payload,
        isLoading: false,
        isError: true,
        isSuccess: false,
      };
    default:
      return state;
  }
}

export function useQuery<T>(query: Query) {
  const [state, dispatch] = useReducer(reducer, query, () => initialState);

  const queryCached = useMemoCompare<Query>(query, (prevQuery) => {
    if (!prevQuery) return false;
    return queryEqual(query, prevQuery);
  });

  useEffect(() => {
    if (!queryCached) {
      return;
    }

    dispatch({ type: 'loading' });

    return onSnapshot(query, {
      error: (error) => dispatch({ type: 'error', payload: error }),
      next: (snapshot) => {
        dispatch({ type: 'success', payload: snapshot.docs.map((doc) => doc.data()) });
      },
    });
  }, [queryCached]);

  return state as State<T>;
}
