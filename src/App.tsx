import React from 'react';
import { Route, Routes } from 'react-router-dom';
import { User } from 'firebase/auth';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { AuthContext, signOut } from './firebase/auth';
import { useUserState } from './hooks/useUser';

import { NotFound } from './routes/NotFound';
import { Login } from './routes/Login';
import { Homepage } from './routes/Homepage';

export type AppProps = {
  initialUser: User | null;
};

export function App(props: AppProps) {
  const user = useUserState(props.initialUser);

  return (
    <AuthContext.Provider value={user}>
      <>
        <Header />
        <main className="mx-auto max-w-8xl px-6">
          <Routes>
            <Route path="/" element={<Homepage />} />
            {!!user && <></>}
            {!user && (
              <>
                <Route path="login" element={<Login />} />
              </>
            )}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </>
    </AuthContext.Provider>
  );
}
