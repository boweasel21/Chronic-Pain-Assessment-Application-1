/**
 * Application Entry Point
 * Initializes React application and mounts to DOM
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@styles/global.css';

/**
 * Get root element from DOM
 */
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Failed to find the root element. ' +
      'Make sure your index.html contains a <div id="root"></div> element.'
  );
}

/**
 * Create React root and render application
 */
const root = ReactDOM.createRoot(rootElement);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
