import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { User } from 'firebase/auth';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { AuthContext, signOut } from './firebase/auth';
import { useUser } from './hooks/useUser';

import { NotFound } from './routes/NotFound';
import { Login } from './routes/Login';

export type AppProps = {
  initialUser: User | null;
};

export function App(props: AppProps) {
  const user = useUser(props.initialUser);

  return (
    <AuthContext.Provider value={user}>
      <>
        <Header />
        <main className="mx-auto max-w-8xl px-6">
          <Routes>
            {!!user && <></>}
            {!user && (
              <>
                <Route path="login" element={<Login />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <hr />
          <button onClick={signOut}>Sign Out</button>
        </main>
        <Footer />
      </>
    </AuthContext.Provider>
  );
}
