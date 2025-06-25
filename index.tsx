
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { HashRouter } from 'react-router-dom';
import './i18n'; // Import i18n configuration

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <React.Suspense fallback={<div className="flex justify-center items-center h-screen w-screen text-xl" style={{backgroundColor: '#004040', color: '#FFDF00'}}>Loading translations...</div>}>
      <HashRouter>
        <App />
      </HashRouter>
    </React.Suspense>
  </React.StrictMode>
);