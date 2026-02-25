import React from 'react';
import * as Sentry from '@sentry/react';
import Icon from './Icon';

interface FallbackProps {
  error: Error;
  resetError: () => void;
}

const ErrorFallback: React.FC<FallbackProps> = ({ error, resetError }) => (
  <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-md text-center">
      <div className="bg-red-100 text-red-600 p-3 rounded-full inline-block mb-4">
        <Icon name="Close" className="w-8 h-8" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2 font-serif">
        Something went wrong
      </h2>
      <p className="text-slate-600 mb-6">
        An unexpected error occurred. Your journal data is safe in your browser.
      </p>
      {import.meta.env.DEV && (
        <pre className="text-xs text-left bg-slate-100 p-3 rounded-lg mb-6 overflow-auto max-h-32 text-red-700">
          {error.message}
        </pre>
      )}
      <button
        onClick={resetError}
        className="bg-sky-700 text-white font-bold py-3 px-8 rounded-lg hover:bg-sky-800 transition-colors"
      >
        Try Again
      </button>
    </div>
  </div>
);

export const AppErrorBoundary: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <Sentry.ErrorBoundary
    fallback={({ error, resetError }) => (
      <ErrorFallback
        error={error as Error}
        resetError={resetError}
      />
    )}
  >
    {children}
  </Sentry.ErrorBoundary>
);
