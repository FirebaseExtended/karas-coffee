import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { useUser } from './hooks/useUser';

import { NotFound } from './routes/NotFound';
import { SignIn } from './routes/SignIn';
import { Homepage } from './routes/Homepage';
import { Checkout } from './routes/Checkout/Checkout';
import { AccountOutlet } from './routes/Account';
import { Product } from './routes/Product';
import { Overview } from './routes/Account/Overview';
import { Subscription } from './routes/Account/Subscription';
import { Orders } from './routes/Account/Orders';
import { ForgotPassword } from './routes/ForgotPassword';
import { Register } from './routes/Register';
import { Shop } from './routes/Shop';
import { ContentList, ContentOutlet } from './routes/Content';
import { Content } from './routes/Content/Content';
import { Shipping } from './routes/Checkout/Shipping';

export function App() {
  const user = useUser();

  if (user.isLoading) {
    return <div />;
  }

  return (
    <>
      <Header />
      <main className="mx-auto max-w-7xl md:px-6">
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="shop" element={<Shop />} />
          <Route path="product/:id" element={<Product />} />
          <Route path="content" element={<ContentOutlet />}>
            <Route index element={<ContentList />} />
            <Route path=":id" element={<Content />} />
          </Route>
          {!!user.data && (
            <>
              <Route path="account" element={<AccountOutlet />}>
                <Route index element={<Overview />} />
                <Route path="subscription" element={<Subscription />} />
                <Route path="orders" element={<Orders />} />
              </Route>
              <Route path="checkout" element={<Checkout />} />
              <Route path="checkout/shipping" element={<Shipping />} />
            </>
          )}
          {!user.data && (
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
  );
}
