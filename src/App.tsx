import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { User } from 'firebase/auth';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { AuthContext } from './firebase/auth';
import { useUserState } from './hooks/useUser';

import { NotFound } from './routes/NotFound';
import { SignIn } from './routes/SignIn';
import { Homepage } from './routes/Homepage';
import { Checkout } from './routes/Checkout';
import { Account } from './routes/Account';
import { Product } from './routes/Product';
import { Overview } from './routes/Account/Overview';
import { Subscription } from './routes/Account/Subscription';
import { Orders } from './routes/Account/Orders';
import { ForgotPassword } from './routes/ForgotPassword';
import { Register } from './routes/Register';
import { Shop } from './routes/Shop';
import { CartProvider } from './components/Cart';

export type AppProps = {
  initialUser: User | null;
};

export function App(props: AppProps) {
  const user = useUserState(props.initialUser);
  console.log({ user });
  return (
    <AuthContext.Provider value={user}>
      <CartProvider>
        <>
          <Header />
          <main className="mx-auto max-w-7xl md:px-6">
            <Routes>
              <Route path="/" element={<Homepage />} />
              <Route path="shop" element={<Shop />} />
              <Route path="product/:id" element={<Product />} />
              {!!user && (
                <>
                  <Route path="account" element={<Account />}>
                    <Route path="/" element={<Overview />} />
                    <Route path="subscription" element={<Subscription />} />
                    <Route path="orders" element={<Orders />} />
                  </Route>
                  <Route path="checkout" element={<Checkout />} />
                </>
              )}
              {!user && (
                <>
                  <Route path="signin" element={<SignIn />} />
                  <Route path="register" element={<Register />} />
                  <Route path="forgot-password" element={<ForgotPassword />} />
                </>
              )}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </>
      </CartProvider>
    </AuthContext.Provider>
  );
}
