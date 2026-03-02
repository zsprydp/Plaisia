import React from 'react';
import Icon from './Icon';

interface PrivacyPolicyProps {
  onBack: () => void;
}

const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ onBack }) => (
  <div className="w-full max-w-3xl mx-auto p-6 animate-fade-in">
    <div className="flex items-center justify-between mb-8">
      <h1 className="text-3xl font-bold text-slate-800 font-serif">Privacy Policy</h1>
      <button onClick={onBack} className="text-slate-500 hover:text-slate-800">
        <Icon name="Close" className="w-8 h-8" />
      </button>
    </div>

    <div className="bg-white rounded-2xl shadow-sm p-6 sm:p-8 prose prose-slate max-w-none">
      <p className="text-sm text-slate-500">Last updated: February 2026</p>

      <h2>Our Commitment</h2>
      <p>
        Plaísia is a prayer app. Your reflections, journal entries, and spiritual life are deeply
        personal. We treat your data with the same reverence we'd treat a conversation in a
        confessional — it is yours, it is private, and we will never exploit it.
      </p>

      <h2>What Data We Collect</h2>

      <h3>Data stored on your device (localStorage)</h3>
      <p>By default, all your data stays on your device and never leaves it:</p>
      <ul>
        <li>Journal entries and reflections</li>
        <li>Consolation/desolation tags</li>
        <li>Daily mood selections</li>
        <li>Reminder time preferences</li>
        <li>Onboarding completion status</li>
      </ul>
      <p>
        This data is stored in your browser's localStorage. It is not encrypted at rest.
        Clearing your browser data will erase it. We cannot access, read, or recover this data.
      </p>

      <h3>Data stored in the cloud (optional)</h3>
      <p>
        If you create an account, your journal entries and preferences are synced to a
        Supabase-hosted PostgreSQL database so you can access them across devices.
        This data is:
      </p>
      <ul>
        <li>Encrypted in transit (TLS/SSL)</li>
        <li>Protected by Row Level Security — only you can access your own entries</li>
        <li>Stored in Supabase's infrastructure (see <a href="https://supabase.com/privacy" target="_blank" rel="noopener noreferrer">Supabase Privacy Policy</a>)</li>
      </ul>

      <h3>Data sent to AI services</h3>
      <p>
        When you use AI features (reflection prompts, discernment analysis, text-to-speech),
        the text of your journal entries is sent to Google's Gemini API for processing.
        This data is:
      </p>
      <ul>
        <li>Sent through our server (never directly from your browser with your API key)</li>
        <li>Not stored by us after the response is returned</li>
        <li>Subject to <a href="https://ai.google.dev/gemini-api/terms" target="_blank" rel="noopener noreferrer">Google's Gemini API Terms of Service</a></li>
      </ul>

      <h3>Third-party services</h3>
      <ul>
        <li><strong>Google Fonts</strong> — loads Merriweather and Source Sans 3 fonts. Google may set cookies. See <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google's Privacy Policy</a>.</li>
        <li><strong>Sentry</strong> (if configured) — collects anonymous error reports to help us fix bugs. No personal data is included.</li>
      </ul>

      <h2>What We Don't Do</h2>
      <ul>
        <li>We do not sell your data. Ever.</li>
        <li>We do not use your journal entries to train AI models.</li>
        <li>We do not track you across websites.</li>
        <li>We do not show ads.</li>
        <li>We respect Do Not Track and Global Privacy Control signals.</li>
      </ul>

      <h2>Your Rights</h2>
      <p>You can:</p>
      <ul>
        <li><strong>Delete your local data</strong> at any time by clearing your browser's localStorage.</li>
        <li><strong>Delete your account</strong> and all cloud data by contacting us or through the app settings (when available).</li>
        <li><strong>Export your data</strong> from the Journal History section.</li>
        <li><strong>Use the app without an account</strong> — all features work in local-only mode.</li>
      </ul>

      <h2>Changes to This Policy</h2>
      <p>
        If we make significant changes, we'll notify you within the app. The "Last updated"
        date at the top reflects the most recent revision.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about your privacy? Reach out to us through the feedback form in the app's
        Settings menu.
      </p>
    </div>
  </div>
);

export default PrivacyPolicy;
