import React, { useState } from 'react';
import Icon from './Icon';
import { requestNotificationPermission } from '../services/notifications';
import { isSupabaseConfigured } from '../services/auth';

interface OnboardingProps {
  onComplete: () => void;
  onOpenAuth: () => void;
}

const steps = [
  {
    title: 'The Daily Examen',
    description:
      'For over 450 years, people have used the Examen — a simple prayer from St. Ignatius of Loyola — to review their day with gratitude, notice God\'s presence, and grow in self-awareness.',
    detail:
      'Each day, Plaísia will guide you through 5 gentle steps: centering, scripture, reflection, conversation with Jesus, and looking toward tomorrow.',
    icon: 'Sun' as const,
    color: 'bg-amber-100 text-amber-700',
  },
  {
    title: 'AI-Assisted Reflection',
    description:
      'As you journal, Plaísia uses AI to offer personalized reflection questions — like a gentle spiritual companion who listens before speaking.',
    detail:
      'Over time, the app helps you notice patterns of consolation and desolation in your life, deepening your discernment.',
    icon: 'Conversation' as const,
    color: 'bg-sky-100 text-sky-700',
  },
  {
    title: 'Your Private Space',
    description:
      'Your prayers and reflections are yours alone. Everything is stored on your device by default — private, secure, and completely under your control.',
    detail: '',
    icon: 'Hope' as const,
    color: 'bg-indigo-100 text-indigo-700',
  },
];

const Onboarding: React.FC<OnboardingProps> = ({ onComplete, onOpenAuth }) => {
  const [step, setStep] = useState(0);
  const [notificationsAsked, setNotificationsAsked] = useState(false);
  const isLastContentStep = step === steps.length - 1;
  const isSetupStep = step === steps.length;

  const handleNext = () => {
    if (isLastContentStep) {
      setStep(steps.length);
    } else {
      setStep(step + 1);
    }
  };

  const handleEnableNotifications = async () => {
    await requestNotificationPermission();
    setNotificationsAsked(true);
  };

  const handleFinish = () => {
    onComplete();
  };

  if (isSetupStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col items-center justify-center p-6 animate-fade-in">
        <div className="max-w-md w-full space-y-8 text-center">
          <h2 className="text-3xl font-bold font-serif">You're all set</h2>
          <p className="text-slate-300">
            A few optional things before you begin.
          </p>

          <div className="space-y-4 text-left">
            {!notificationsAsked && (
              <button
                onClick={handleEnableNotifications}
                className="w-full bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors text-left flex items-center space-x-4"
              >
                <div className="bg-amber-400/20 text-amber-300 p-2 rounded-full">
                  <Icon name="Bell" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">Enable daily reminders</p>
                  <p className="text-xs text-slate-400">
                    A gentle nudge to pray each day
                  </p>
                </div>
              </button>
            )}
            {notificationsAsked && (
              <div className="w-full bg-green-500/10 p-4 rounded-xl border border-green-500/20 flex items-center space-x-4">
                <div className="bg-green-400/20 text-green-300 p-2 rounded-full">
                  <Icon name="Bell" className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-green-300">
                    Notifications enabled
                  </p>
                  <p className="text-xs text-slate-400">
                    Set your preferred time in Settings
                  </p>
                </div>
              </div>
            )}

            {isSupabaseConfigured() && (
              <button
                onClick={onOpenAuth}
                className="w-full bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors text-left flex items-center space-x-4"
              >
                <div className="bg-sky-400/20 text-sky-300 p-2 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="font-semibold text-sm">Create an account</p>
                  <p className="text-xs text-slate-400">
                    Sync your journal across devices
                  </p>
                </div>
              </button>
            )}
          </div>

          <button
            onClick={handleFinish}
            className="w-full bg-white text-indigo-950 font-bold py-4 px-10 rounded-full text-lg hover:bg-sky-50 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
          >
            Begin My Journey
          </button>

          <button
            onClick={handleFinish}
            className="text-sm text-slate-500 hover:text-slate-300 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  const currentStep = steps[step];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col items-center justify-center p-6 animate-fade-in">
      <div className="max-w-md w-full space-y-8 text-center">
        {/* Progress dots */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all ${
                i === step ? 'bg-white w-6' : i < step ? 'bg-white/60' : 'bg-white/20'
              }`}
            />
          ))}
        </div>

        <div className={`${currentStep.color} p-4 rounded-full inline-block`}>
          <Icon name={currentStep.icon} className="w-10 h-10" />
        </div>

        <h2 className="text-3xl font-bold font-serif">{currentStep.title}</h2>

        <p className="text-slate-300 text-lg leading-relaxed">
          {currentStep.description}
        </p>

        {currentStep.detail && (
          <p className="text-slate-400 text-sm leading-relaxed">
            {currentStep.detail}
          </p>
        )}

        <div className="flex justify-between items-center pt-4">
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-slate-400 hover:text-white transition-colors font-semibold"
            >
              Back
            </button>
          ) : (
            <div />
          )}

          <button
            onClick={handleNext}
            className="bg-white text-indigo-950 font-bold py-3 px-8 rounded-full hover:bg-sky-50 transition-all"
          >
            {isLastContentStep ? 'Continue' : 'Next'}
          </button>
        </div>

        <button
          onClick={() => {
            setStep(steps.length);
          }}
          className="text-xs text-slate-500 hover:text-slate-300 transition-colors"
        >
          Skip introduction
        </button>
      </div>
    </div>
  );
};

export default Onboarding;
