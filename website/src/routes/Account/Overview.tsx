import React, { useRef, useState } from 'react';
import { User, RecaptchaVerifier, ConfirmationResult } from 'firebase/auth';

import { auth } from '../../firebase';
import { Button } from '../../components/Button';
import { useUser } from '../../hooks/useUser';
import { Input } from '../../components/Form';
import { useQueryClient } from 'react-query';
import { useAuthLinkWithPhoneNumber, useAuthReload, useAuthSignOut } from '@react-query-firebase/auth';
import { useNavigate } from 'react-router';

export function Overview() {
  const navigate = useNavigate();

  const signOut = useAuthSignOut(auth, {
    onSuccess() {
      navigate('/');
    },
  });

  const user = useUser();
  const data = user.data!;

  return (
    <div className="max-w-xl mx-auto mt-12">
      <div className="border rounded p-6">
        <h1 className="font-bold text-2xl">Your Account</h1>
        <ul className="mt-4 space-y-2 text-sm">
          <li>User ID: {data.uid}</li>
          <li>Display Name: {data.displayName}</li>
          <li>Email Address: {data.email || 'N/A'}</li>
          <li>Email Verified: {data.emailVerified ? 'Yes' : 'No'}</li>
          {/* Disabled for demo <PhoneNumber user={data} /> */}
        </ul>
        <div className="mt-4">
          <Button onClick={() => signOut.mutate()} loading={signOut.isLoading}>
            Sign Out
          </Button>
        </div>
      </div>
    </div>
  );
}

type Method = null | 'phone-number' | 'code';

function PhoneNumber({ user }: { user: User }) {
  const client = useQueryClient();
  const container = useRef<HTMLDivElement>(null);
  const [method, setMethod] = useState<Method>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const reload = useAuthReload();

  const linkPhoneNumber = useAuthLinkWithPhoneNumber({
    onSuccess(result) {
      confirmation.current = result;
      setMethod('code');
    },
  });

  const verifier = useRef<RecaptchaVerifier>();
  const confirmation = useRef<ConfirmationResult>();

  // Create and render a RecaptchaVerifier instance
  // when the user wants to link the phone number.
  function onVerify() {
    verifier.current = new RecaptchaVerifier(
      container.current!,
      {
        size: 'normal',
        callback: async () => {
          // On success, set the method to allow the user to enter a phone number:
          setMethod('phone-number');
        },
      },
      auth,
    );

    verifier.current.render();
  }

  async function onConfirmCode() {
    if (!verificationCode) {
      return;
    }

    try {
      const credential = await confirmation.current!.confirm(verificationCode);
      await reload.mutateAsync(credential.user);
      client.setQueryData('user', credential.user);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (e: any) {
      setError(e.message);
    }
  }

  if (user.phoneNumber) {
    return <li>Phone Number: {user.phoneNumber}</li>;
  }

  return (
    <li>
      <div role="button" onClick={() => onVerify()} className="font-bold hover:underline">
        Link your phone number &rarr;
      </div>
      <div className="mt-4">
        {(!method || method === 'phone-number') && <div id="recaptcha-container" ref={container} />}
        {method === 'phone-number' && (
          <div className="flex space-x-4">
            <div>
              <Input
                id="phone-number"
                label="Please enter your phone number"
                placeholder="+1 650-555-1234"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
            </div>
            <div className="flex items-end justify-end">
              <Button
                onClick={() =>
                  linkPhoneNumber.mutate({
                    user,
                    phoneNumber,
                    appVerifier: verifier.current!,
                  })
                }
              >
                Submit
              </Button>
            </div>
          </div>
        )}
        {method === 'code' && (
          <div className="flex space-x-4">
            <div>
              <Input
                id="code"
                label="Please enter the verification code"
                placeholder="123456"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
              />
            </div>
            <div className="flex items-end justify-end">
              <Button onClick={() => onConfirmCode()}>Verify</Button>
            </div>
          </div>
        )}
      </div>
      {!!error && <div className="mt-4 text-red-500 text-xs">{error}</div>}
    </li>
  );
}
