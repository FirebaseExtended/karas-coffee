import React, { useEffect, useState } from 'react';
import { Button } from './Button';

export function CookiePolicy() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!window.localStorage.getItem('cookiePolicy')) {
      setIsOpen(true);
    }
  }, []);

  function onAccept() {
    window.localStorage.setItem('cookiePolicy', 'accepted');
    setIsOpen(false);
  }

  if (!isOpen) {
    return <></>;
  }

  return (
    <div className="fixed bottom-0 left-0 m-12 rounded bg-black p-6 text-white text-sm">
      <div className="flex items-center space-x-12">
        <p>
          This site uses cookies from Google to <br /> deliver its services and to analyze traffic.
        </p>
        <div className="w-32">
          <Button onClick={onAccept}>Ok, Got it</Button>
        </div>
      </div>
    </div>
  );
}
