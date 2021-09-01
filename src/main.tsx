import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import 'tailwindcss/tailwind.css';

import { App } from './App';
import { getUserOnce } from './firebase/auth';

getUserOnce().then((user) => {
  ReactDOM.render(
    <React.StrictMode>
      <BrowserRouter>
        <App initialUser={user} />
      </BrowserRouter>
    </React.StrictMode>,
    document.getElementById('root'),
  );
});
