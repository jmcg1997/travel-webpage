import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { AuthProvider } from './context/AuthContext.jsx';
import { Toaster } from 'react-hot-toast';

// Entry point of the React application
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Provide global authentication context */}
    <AuthProvider>
      <App />
      {/* Global toast notification system */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '8px',
            background: '#333',
            color: '#fff',
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
