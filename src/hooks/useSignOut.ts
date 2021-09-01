import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';

export function useSignOut() {
  const navigate = useNavigate();

  return useCallback(() => {
    auth.signOut().then(() => {
      navigate('/');
    });
  }, []);
}
