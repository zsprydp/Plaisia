import React, { useState } from 'react';
import { signIn, signUp, signOut, isSupabaseConfigured } from '../services/auth';
import type { User } from '../services/auth';
import Icon from './Icon';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onAuthChange: () => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, user, onAuthChange }) => {
  const [mode, setMode] = useState<'sign_in' | 'sign_up'>('sign_in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  if (!isSupabaseConfigured()) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-slate-800">Account Sync</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <Icon name="Close" className="w-6 h-6" />
            </button>
          </div>
          <p className="text-slate-600 text-sm mb-4">
            Cloud sync is not configured yet. Your journal data is safely stored in your browser.
          </p>
          <p className="text-slate-500 text-xs">
            To enable cloud sync, the app administrator needs to configure Supabase.
          </p>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === 'sign_up') {
        await signUp(email, password);
        setSuccess('Check your email to confirm your account.');
      } else {
        await signIn(email, password);
        onAuthChange();
        onClose();
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    onAuthChange();
    onClose();
  };

  if (user) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-slate-800">Your Account</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <Icon name="Close" className="w-6 h-6" />
            </button>
          </div>
          <p className="text-slate-600 mb-1 text-sm">Signed in as</p>
          <p className="font-semibold text-slate-800 mb-6">{user.email}</p>
          <p className="text-xs text-green-600 mb-6">Your journal is synced to the cloud.</p>
          <button
            onClick={handleSignOut}
            className="w-full bg-slate-200 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-300 transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="text-xl font-bold text-slate-800">
            {mode === 'sign_in' ? 'Sign In' : 'Create Account'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <Icon name="Close" className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <p className="text-sm text-slate-600 mb-2">
            {mode === 'sign_in'
              ? 'Sign in to sync your journal across devices.'
              : 'Create an account to sync your journal across devices.'}
          </p>

          {error && (
            <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">{error}</div>
          )}
          {success && (
            <div className="bg-green-50 text-green-700 p-3 rounded-lg text-sm">{success}</div>
          )}

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-700 text-white font-bold py-3 rounded-lg hover:bg-sky-800 transition-colors disabled:opacity-50"
          >
            {loading ? 'Please wait...' : mode === 'sign_in' ? 'Sign In' : 'Create Account'}
          </button>

          <button
            type="button"
            onClick={() => {
              setMode(mode === 'sign_in' ? 'sign_up' : 'sign_in');
              setError(null);
              setSuccess(null);
            }}
            className="w-full text-sm text-slate-500 hover:text-sky-700 transition-colors"
          >
            {mode === 'sign_in'
              ? "Don't have an account? Create one"
              : 'Already have an account? Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
