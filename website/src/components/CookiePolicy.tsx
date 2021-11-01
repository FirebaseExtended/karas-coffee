/*
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

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
          This site uses cookies from Google to <br /> deliver its services and to analyze traffic. <br />
          <a
            href="https://policies.google.com/technologies/cookies"
            target="_blank"
            rel="noreferrer"
            className="underline"
          >
            Learn More.
          </a>
        </p>
        <div className="w-32">
          <Button onClick={onAccept}>Ok, Got it</Button>
        </div>
      </div>
    </div>
  );
}
