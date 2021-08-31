import React from 'react';
import { Route, Routes } from 'react-router-dom';

import { Header } from './components/Header';
import { Footer } from './components/Footer';

import { NotFound } from './routes/NotFound';

export function App() {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-8xl px-6">
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
