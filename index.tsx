
import React from 'react';
import ReactDOM from 'react-dom/client';
import './styles/index.css';
import { initSentry } from './services/sentry';
import { AppErrorBoundary } from './components/ErrorBoundary';
import App from './App';

initSentry();

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </React.StrictMode>
);
