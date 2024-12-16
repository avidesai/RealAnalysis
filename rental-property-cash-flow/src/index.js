// /src/index.js

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById('root'));

if (!process.env.REACT_APP_BACKEND_URL) {
  console.error('Missing REACT_APP_BACKEND_URL in environment variables!');
}


root.render(
  <React.StrictMode>
    <AuthProvider> {/* Wrap the App component with AuthProvider */}
      <App />
    </AuthProvider>
  </React.StrictMode>
);
