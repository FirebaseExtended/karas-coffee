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

import React from 'react';
import { ShoppingCartIcon } from '@heroicons/react/outline';
import { Link } from 'react-router-dom';

import { useUser } from '../hooks/useUser';
import { useCart } from '../hooks/useCart';

export function Cart() {
  const user = useUser();
  const { cart } = useCart();

  // Require the user to sign-in to go to the checkout.
  const href = !!user.data ? '/checkout' : '/signin?redirect=/checkout';

  return (
    <Link to={href} className="group relative w-10 h-10 flex items-center justify-center">
      <ShoppingCartIcon className="w-6 h-6 text-gray-600 transition-opacity group-hover:opacity-50" />
      {cart.length > 0 && (
        <span className="absolute text-xs font-medium bottom-0 left-0 w-5 h-5 flex items-center justify-center rounded-full bg-white border border-gray-300">
          {cart.length}
        </span>
      )}
    </Link>
  );
}
