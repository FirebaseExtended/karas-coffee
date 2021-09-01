import { UserCredential } from 'firebase/auth';
import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { signInWithGitHub, signInWithGoogle } from '../firebase/auth';

export function Login() {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const redirect = params.get('redirect');

  function handleOAuth(fn: () => Promise<UserCredential>) {
    fn()
      .then(() => {
        navigate(redirect || '/');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  return (
    <div>
      <h1>Login</h1>
      <div>
        <form>
          <div>
            <label>Email Address</label>
            <input type="text" value="" />
          </div>
          <div>
            <label>Password</label>
            <input type="password" value="" />
          </div>
        </form>
        <hr />
        <button onClick={() => handleOAuth(signInWithGoogle)}>Login with Google</button>
        <br />
        <button onClick={() => handleOAuth(signInWithGitHub)}>Login with GitHub</button>
        <br />
      </div>
    </div>
  );
}
