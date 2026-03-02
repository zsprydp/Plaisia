
import React, { useState, useCallback, useMemo, useEffect, useRef } from 'react';
import DOMPurify from 'dompurify';
import { EXAMEN_STEPS, IGNATIAN_JOURNEY, MOODS } from './constants';
import type { ExamenStep, JournalEntries, JournalTag, JournalEntry } from './types';
import StepCard from './components/StepCard';
import NavigationButtons from './components/NavigationButtons';
import { generateReflectionPrompt, summarizeDiscernmentPatterns, generateScriptureSpeech } from './services/geminiService';
import { trackEvent } from './services/analytics';
import { getSession, onAuthStateChange, isSupabaseConfigured } from './services/auth';
import type { User } from './services/auth';
import { loadJournalEntries, saveJournalEntry } from './services/storage';
import { requestNotificationPermission, startReminderCheck } from './services/notifications';
import LoadingSpinner from './components/LoadingSpinner';
import Icon from './components/Icon';
import MoodTracker from './components/MoodTracker';
import AuthModal from './components/AuthModal';
import Onboarding from './components/Onboarding';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';

type UIMode = 'landing' | 'onboarding' | 'dashboard' | 'mood_check_in' | 'daily_practice' | 'discernment' | 'history' | 'privacy' | 'terms';

const App: React.FC = () => {
  const [uiMode, setUiMode] = useState<UIMode>('landing');
  const [journalEntries, setJournalEntries] = useState<JournalEntries>({});
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auth state
  const [user, setUser] = useState<User | null>(null);
  const [showAuth, setShowAuth] = useState(false);

  // Journey state
  const [currentJourneyWeekIndex, setCurrentJourneyWeekIndex] = useState(0);
  const [currentDailyStepIndex, setCurrentDailyStepIndex] = useState(0);
  const [dailyMood, setDailyMood] = useState<string | null>(null);
  
  // Audio state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoadingSpeech, setIsLoadingSpeech] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);

  // Discernment state
  const [discernmentSummary, setDiscernmentSummary] = useState<string>('');

  // Settings & Reminders state
  const [showSettings, setShowSettings] = useState(false);
  const [reminderTime, setReminderTime] = useState<string>('');
  
  const currentWeekData = useMemo(() => IGNATIAN_JOURNEY[currentJourneyWeekIndex], [currentJourneyWeekIndex]);
  // Steps: 0=Centering, 1=Scripture, 2...=Examen
  const totalDailySteps = EXAMEN_STEPS.length + 2; 
  
  const taggedEntries = useMemo(() => (Object.values(journalEntries) as JournalEntry[]).filter(j => j && j.tag), [journalEntries]);

  // Auth initialization
  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    getSession().then((session) => {
      setUser(session?.user ?? null);
    });

    const subscription = onAuthStateChange((session) => {
      setUser(session?.user ?? null);
    });

    return () => { subscription.unsubscribe(); };
  }, []);

  // Load data on mount (and when user changes)
  useEffect(() => {
    const savedMoodData = localStorage.getItem('plaisia_daily_mood');
    const hasOnboarded = localStorage.getItem('plaisia_onboarded');
    const savedReminderTime = localStorage.getItem('plaisia_reminder_time');

    if (hasOnboarded) {
        setUiMode('dashboard');
    }

    if (savedReminderTime) {
        setReminderTime(savedReminderTime);
    }

    if (savedMoodData) {
      try {
        const { mood, date } = JSON.parse(savedMoodData);
        const today = new Date().toDateString();
        if (date === today) {
          setDailyMood(mood);
        } else {
            localStorage.removeItem('plaisia_daily_mood');
        }
      } catch (e) {
        console.error("Failed to parse saved mood", e);
      }
    }

    loadJournalEntries(user?.id).then((entries) => {
      setJournalEntries(entries);
    });
  }, [user?.id]);

  // Save journal entries whenever they change
  useEffect(() => {
      if (Object.keys(journalEntries).length > 0) {
          localStorage.setItem('plaisia_journal_entries', JSON.stringify(journalEntries));
      }
  }, [journalEntries]);

  // Check for reminders every minute (via service worker when available)
  useEffect(() => {
    if (!reminderTime) return;
    const cleanup = startReminderCheck(reminderTime);
    return cleanup;
  }, [reminderTime]);

  // Stop speech when component unmounts or mode changes
  useEffect(() => {
      return () => {
          stopAudio();
          if (audioContextRef.current) {
              audioContextRef.current.close();
          }
      };
  }, [uiMode]);

  const stopAudio = () => {
      if (audioSourceRef.current) {
          try {
              audioSourceRef.current.stop();
          } catch (e) {
              // Ignore errors if already stopped
          }
          audioSourceRef.current = null;
      }
      setIsSpeaking(false);
  };

  const handleSetMode = (mode: UIMode) => {
      setError(null);
      stopAudio();
      setUiMode(mode);
  }

  const handleGetStarted = () => {
      trackEvent('journey_started');
      handleSetMode('onboarding');
  }

  const handleOnboardingComplete = () => {
      localStorage.setItem('plaisia_onboarded', 'true');
      handleSetMode('dashboard');
  }

  const beginPrayerJourney = () => {
    setError(null);
    handleSetMode('mood_check_in');
  }

  const handleMoodSelected = (mood: string) => {
    setDailyMood(mood);
    localStorage.setItem('plaisia_daily_mood', JSON.stringify({
        mood,
        date: new Date().toDateString()
    }));
    trackEvent('mood_selected', { mood });
    startDailyPractice();
  }

  const startDailyPractice = () => {
      setCurrentDailyStepIndex(0); // Starts at Centering
      setAiPrompt(null);
      handleSetMode('daily_practice');
  }

  const toggleSpeech = async (text: string) => {
      if (isSpeaking) {
          stopAudio();
          return;
      }

      setIsLoadingSpeech(true);
      setError(null);

      try {
          // Initialize AudioContext on user interaction
          if (!audioContextRef.current) {
              audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
          }

          if (audioContextRef.current.state === 'suspended') {
              await audioContextRef.current.resume();
          }

          const base64Audio = await generateScriptureSpeech(text);
          if (!base64Audio) throw new Error("No audio returned");

          const audioBuffer = await pcmToAudioBuffer(
              base64ToBytes(base64Audio),
              audioContextRef.current,
              24000,
              1
          );

          const source = audioContextRef.current.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(audioContextRef.current.destination);
          
          source.onended = () => {
              setIsSpeaking(false);
          };

          audioSourceRef.current = source;
          source.start();
          setIsSpeaking(true);

      } catch (err) {
          console.error("Speech error:", err);
          setError("Could not play audio. Please try again.");
      } finally {
          setIsLoadingSpeech(false);
      }
  };

  const handleNextDailyStep = useCallback(async () => {
    setError(null);
    stopAudio();

    if (currentDailyStepIndex < totalDailySteps) {
      const nextStepIndex = currentDailyStepIndex + 1;
      
      if (nextStepIndex >= totalDailySteps) {
          trackEvent('prayer_completed', { week: currentWeekData.week });
          handleSetMode('dashboard');
          return;
      }
        
      // 0=Centering, 1=Scripture, 2=ExamenStep1...
      const isExamenStep = nextStepIndex > 1; 

      if (isExamenStep) {
          const examenStepIndex = nextStepIndex - 2; 
          const examenStep = EXAMEN_STEPS[examenStepIndex];
          
          if (examenStep && examenStep.aiTrigger) {
            const previousStepIndex = nextStepIndex - 1;
            // The journal key for the PREVIOUS step (to reflect on)
            // If previous was Scripture (index 1), key is scripture.
            // If previous was Examen 1 (index 2), key is E0.
            let sourceJournalEntry = '';
            
            if (previousStepIndex === 1) {
                 sourceJournalEntry = journalEntries[`W${currentWeekData.week}-scripture`]?.text || '';
            } else {
                 sourceJournalEntry = journalEntries[`W${currentWeekData.week}-E${previousStepIndex - 2}`]?.text || '';
            }

            if (sourceJournalEntry.trim().length > 10) {
              setIsLoadingAI(true);
              try {
                const prompt = await generateReflectionPrompt(sourceJournalEntry);
                setAiPrompt(prompt);
              } catch (err) {
                setError('Could not generate a reflection prompt. Please try again.');
                console.error(err);
              } finally {
                setIsLoadingAI(false);
              }
            } else {
                setAiPrompt(null);
            }
          }
      } else {
          setAiPrompt(null);
      }

      setCurrentDailyStepIndex(nextStepIndex);
    }
  }, [currentDailyStepIndex, journalEntries, currentWeekData.week, totalDailySteps]);

  const handlePrevDailyStep = () => {
    if (currentDailyStepIndex > 0) {
        setError(null);
        setAiPrompt(null);
        stopAudio();
        setCurrentDailyStepIndex(currentDailyStepIndex - 1);
    }
  };
  
  const handleJournalChange = (key: string, text: string, title: string) => {
    const entry = {
      ...journalEntries[key],
      text,
      title,
      date: new Date().toISOString(),
    };
    setJournalEntries(prev => ({ ...prev, [key]: entry }));
    saveJournalEntry(key, entry, user?.id);
  };

  const handleTagChange = (key: string, tag: JournalTag | null) => {
      setJournalEntries(prev => {
          const currentEntry = prev[key] || { text: '', title: '', date: new Date().toISOString(), tag: null };
          const updated = { ...currentEntry, tag: currentEntry.tag === tag ? null : tag };
          saveJournalEntry(key, updated, user?.id);
          return { ...prev, [key]: updated };
      });
  };

  const handleGetDiscernmentSummary = async () => {
      trackEvent('discernment_viewed');
      setIsLoadingAI(true);
      setError(null);
      setDiscernmentSummary('');
      try {
          const summary = await summarizeDiscernmentPatterns(journalEntries);
          setDiscernmentSummary(summary);
      } catch (err) {
          setError('Could not generate a discernment summary. Please try again.');
          console.error(err);
      } finally {
          setIsLoadingAI(false);
      }
  }

  const handleReminderChange = async (time: string) => {
      if (!time) {
          setReminderTime('');
          localStorage.removeItem('plaisia_reminder_time');
          return;
      }

      const granted = await requestNotificationPermission();
      if (!granted) {
          alert('We need notification permissions to send you daily reminders.');
          return;
      }

      setReminderTime(time);
      localStorage.setItem('plaisia_reminder_time', time);
  };

  // Share Logic
  const handleShareEntry = async (entry: JournalEntry) => {
      const textToShare = `${entry.title}\n${new Date(entry.date).toLocaleDateString()}\n\n${entry.text}`;
      
      if (navigator.share) {
          try {
              await navigator.share({
                  title: 'Plaísia Journal Entry',
                  text: textToShare,
              });
          } catch (err) {
              if ((err as Error).name !== 'AbortError') {
                console.error('Error sharing:', err);
              }
          }
      } else {
          try {
              await navigator.clipboard.writeText(textToShare);
              alert('Entry copied to clipboard.');
          } catch (err) {
              console.error('Failed to copy:', err);
          }
      }
  };

  const renderSettingsModal = () => {
      if (!showSettings) return null;

      return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-fade-in">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden">
                  <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-slate-800 flex items-center">
                          <Icon name="Settings" className="w-5 h-5 mr-2 text-slate-500" />
                          Settings
                      </h3>
                      <button onClick={() => setShowSettings(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                          <Icon name="Close" className="w-6 h-6" />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                      <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                              <Icon name="Bell" className="w-4 h-4 mr-2 text-sky-600" />
                              Daily Reminder
                          </label>
                          <p className="text-xs text-slate-500 mb-3">Set a time to receive a gentle nudge to pray.</p>
                          <input 
                              type="time" 
                              value={reminderTime} 
                              onChange={(e) => handleReminderChange(e.target.value)}
                              className="block w-full px-4 py-3 rounded-lg border border-slate-300 text-slate-700 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all"
                          />
                          {!reminderTime && <p className="text-xs text-slate-400 mt-2 italic">Reminders are currently off.</p>}
                          {reminderTime && <p className="text-xs text-green-600 mt-2 font-medium">Reminders set for {reminderTime} daily.</p>}
                      </div>

                      <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center">
                              <Icon name="Conversation" className="w-4 h-4 mr-2 text-sky-600" />
                              Give Feedback
                          </label>
                          <p className="text-xs text-slate-500 mb-3">Help us improve Plaísia with your thoughts.</p>
                          <a
                              href="https://forms.gle/placeholder"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block px-4 py-2 bg-sky-50 text-sky-700 rounded-lg text-sm font-semibold hover:bg-sky-100 transition-colors border border-sky-200"
                          >
                              Open Feedback Form
                          </a>
                      </div>

                      <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                           <h4 className="text-sm font-bold text-slate-700 mb-2">About Privacy</h4>
                           <p className="text-xs text-slate-500 leading-relaxed">
                               Plaísia stores all your journal entries and settings locally on your device. We do not track you or store your personal prayers on any server.
                           </p>
                           <div className="flex space-x-4 mt-3">
                               <button onClick={() => { setShowSettings(false); handleSetMode('privacy'); }} className="text-xs text-sky-600 hover:text-sky-800 underline">Privacy Policy</button>
                               <button onClick={() => { setShowSettings(false); handleSetMode('terms'); }} className="text-xs text-sky-600 hover:text-sky-800 underline">Terms of Service</button>
                           </div>
                      </div>
                  </div>
                  
                  <div className="p-4 bg-slate-50 border-t border-slate-100 text-right">
                      <button 
                          onClick={() => setShowSettings(false)}
                          className="bg-slate-800 text-white font-semibold py-2 px-6 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                          Done
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const renderLanding = () => (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white flex flex-col items-center justify-center p-6 animate-fade-in relative overflow-hidden">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 opacity-20 pointer-events-none">
              <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
              <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse" style={{animationDelay: '2s'}}></div>
          </div>

          <div className="z-10 max-w-4xl mx-auto text-center space-y-8">
              <div className="mb-8">
                  <h1 className="text-6xl md:text-7xl font-bold font-serif mb-4 tracking-tight">Plaísia</h1>
                  <p className="text-xl md:text-2xl text-slate-300 font-light max-w-2xl mx-auto">
                      A gentle, daily guide for prayer and discernment in a noisy world.
                  </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 text-left max-w-3xl mx-auto mb-12">
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                      <Icon name="Sun" className="w-8 h-8 text-amber-300 mb-4" />
                      <h3 className="text-lg font-bold mb-2">Daily Examen</h3>
                      <p className="text-slate-300 text-sm">Review your day with gratitude and notice where God was present.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                      <Icon name="Conversation" className="w-8 h-8 text-sky-300 mb-4" />
                      <h3 className="text-lg font-bold mb-2">Imaginative Prayer</h3>
                      <p className="text-slate-300 text-sm">Engage with Scripture deeply using your imagination and senses.</p>
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/10">
                      <Icon name="Focus" className="w-8 h-8 text-indigo-300 mb-4" />
                      <h3 className="text-lg font-bold mb-2">Discernment</h3>
                      <p className="text-slate-300 text-sm">Identify patterns of consolation and desolation with gentle AI guidance.</p>
                  </div>
              </div>

              <button 
                  onClick={handleGetStarted}
                  className="bg-white text-indigo-950 font-bold py-4 px-10 rounded-full text-lg hover:bg-sky-50 hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
              >
                  Begin Your Journey
              </button>

              {/* How it works */}
              <div className="mt-16 pt-12 border-t border-white/10 max-w-2xl mx-auto">
                  <h2 className="text-xl font-semibold text-slate-400 uppercase tracking-widest mb-8">How it works</h2>
                  <div className="space-y-6 text-left">
                      {[
                        { num: '1', text: 'Check in with how you\'re feeling today' },
                        { num: '2', text: 'Breathe, center yourself, and read Scripture' },
                        { num: '3', text: 'Journal your reflections with AI-guided prompts' },
                        { num: '4', text: 'Notice patterns of God\'s presence over time' },
                      ].map(({ num, text }) => (
                        <div key={num} className="flex items-center space-x-4">
                          <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-bold text-sky-300 shrink-0">{num}</span>
                          <p className="text-slate-300">{text}</p>
                        </div>
                      ))}
                  </div>
              </div>

              {/* Testimonial */}
              <div className="mt-12 max-w-lg mx-auto">
                  <blockquote className="text-slate-400 italic text-lg leading-relaxed">
                      "The Examen is the most important prayer of your day."
                  </blockquote>
                  <p className="text-slate-500 text-sm mt-2">— St. Ignatius of Loyola</p>
              </div>

              <div className="mt-8 flex flex-col items-center space-y-2">
                  <p className="text-xs text-slate-500">Your journal data is stored locally on your device for privacy.</p>
                  <p className="text-xs text-slate-600">Works offline · No account required · Free</p>
                  <div className="flex space-x-4 mt-2">
                      <button onClick={() => handleSetMode('privacy')} className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">Privacy Policy</button>
                      <button onClick={() => handleSetMode('terms')} className="text-xs text-slate-500 hover:text-slate-300 underline transition-colors">Terms of Service</button>
                  </div>
              </div>
          </div>
      </div>
  );

  const renderDashboard = () => {
    // Check if it is evening (after 6 PM) and no mood logged yet (indicates no prayer done)
    const isEvening = new Date().getHours() >= 18;
    const needsEveningNudge = isEvening && !dailyMood;

    return (
    <div className="text-center p-8 max-w-3xl mx-auto animate-fade-in w-full">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-4xl font-bold text-slate-700">Plaísia</h1>
            <div className="flex items-center space-x-4">
                 <button onClick={() => setShowAuth(true)} className="text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center p-2 rounded-full hover:bg-slate-100" title={user ? 'Account' : 'Sign In'}>
                     {user ? (
                       <span className="w-5 h-5 bg-sky-600 text-white rounded-full text-xs flex items-center justify-center font-bold">{user.email?.[0]?.toUpperCase()}</span>
                     ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                         <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                       </svg>
                     )}
                 </button>
                 <button onClick={() => setShowSettings(true)} className="text-slate-400 hover:text-slate-600 transition-colors flex items-center justify-center p-2 rounded-full hover:bg-slate-100" title="Settings">
                     <Icon name="Settings" className="w-5 h-5" />
                 </button>
                 <button onClick={() => handleSetMode('history')} className="text-slate-500 hover:text-sky-700 transition-colors flex items-center space-x-1 font-semibold text-sm">
                     <Icon name="History" className="w-5 h-5" />
                     <span className="hidden sm:inline">History</span>
                 </button>
            </div>
        </div>
        
        {needsEveningNudge && (
            <div className="mb-6 bg-indigo-900 text-white p-4 rounded-xl shadow-lg flex items-center justify-between animate-fade-in border border-indigo-700">
                <div className="flex items-center text-left">
                    <div className="bg-indigo-800 p-2 rounded-full mr-3">
                        <Icon name="Bell" className="w-5 h-5 text-indigo-200" />
                    </div>
                    <div>
                        <p className="font-bold text-sm">The day is drawing to a close.</p>
                        <p className="text-xs text-indigo-200">Take a moment to reflect before you rest.</p>
                    </div>
                </div>
                <button 
                    onClick={beginPrayerJourney}
                    className="bg-white text-indigo-900 text-xs font-bold px-3 py-2 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                    Begin Now
                </button>
            </div>
        )}

        <p className="text-lg text-slate-600 mb-6 text-left">Welcome back. The journey continues.</p>

        {dailyMood && (
             <div className="mb-8 inline-block px-4 py-2 bg-blue-50 text-blue-800 rounded-full text-sm font-semibold border border-blue-100 animate-fade-in">
                 You are arriving today feeling <span className="font-bold">{dailyMood}</span>
             </div>
        )}

        <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full text-left mb-8 border-t-4 border-sky-600">
            <div className="flex justify-between items-start mb-2">
                <p className="text-sm font-semibold text-sky-700 uppercase tracking-wide">Current Week {currentWeekData.week}</p>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-4 font-serif">{currentWeekData.title}</h2>
            
            <div className="prose prose-slate max-w-none">
                <h3 className="text-xl font-bold text-slate-700">{currentWeekData.lesson.title}</h3>
                <p className="text-slate-600 leading-relaxed">{currentWeekData.lesson.content}</p>
            </div>
             <div className="mt-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                <h4 className="font-semibold text-slate-700 flex items-center"><Icon name="Focus" className="w-4 h-4 mr-2" /> This Week's Focus</h4>
                <p className="text-slate-600 italic mt-1">{currentWeekData.examenFocus}</p>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button onClick={beginPrayerJourney} className="bg-sky-700 text-white font-bold py-4 px-6 rounded-lg hover:bg-sky-800 transition-colors shadow-md text-lg flex items-center justify-center">
                 <Icon name="Sun" className="w-6 h-6 mr-2" />
                {dailyMood ? "Continue Prayer" : "Begin Today's Prayer"}
            </button>
            <button onClick={() => handleSetMode('discernment')} className="bg-indigo-700 text-white font-bold py-4 px-6 rounded-lg hover:bg-indigo-800 transition-colors shadow-md text-lg flex items-center justify-center">
                <Icon name="Cloud" className="w-6 h-6 mr-2" />
                Discernment Patterns
            </button>
        </div>
        {import.meta.env.DEV && (
        <div className="mt-8 border-t border-slate-200 pt-4">
            <button 
                onClick={() => setCurrentJourneyWeekIndex(prev => (prev + 1) % IGNATIAN_JOURNEY.length)}
                className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
            >
                (Dev: Advance to Week {(currentJourneyWeekIndex + 1) % IGNATIAN_JOURNEY.length + 1})
            </button>
        </div>
        )}
    </div>
  )};

  const renderHistory = () => {
      const historyEntries = (Object.entries(journalEntries) as [string, JournalEntry][])
        .filter(([_, entry]) => entry.text.trim().length > 0)
        .sort((a, b) => new Date(b[1].date).getTime() - new Date(a[1].date).getTime());

      return (
          <div className="w-full max-w-3xl mx-auto p-4 animate-fade-in">
              <div className="flex items-center justify-between mb-8">
                  <h2 className="text-3xl font-bold text-slate-800">Journal History</h2>
                  <button onClick={() => handleSetMode('dashboard')} className="text-slate-500 hover:text-slate-800">
                      <Icon name="Close" className="w-8 h-8" />
                  </button>
              </div>
              
              {historyEntries.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                      <Icon name="BookOpen" className="w-16 h-16 text-slate-200 mx-auto mb-4" />
                      <p className="text-slate-500">No journal entries yet. Your journey begins today.</p>
                  </div>
              ) : (
                  <div className="space-y-4">
                      {historyEntries.map(([key, entry]) => (
                          <div key={key} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow border-l-4 border-sky-200">
                              <div className="flex justify-between items-start mb-2">
                                  <div>
                                      <h3 className="font-bold text-slate-700">{entry.title}</h3>
                                      <span className="text-xs text-slate-400">{new Date(entry.date).toLocaleDateString()}</span>
                                  </div>
                                  <button onClick={() => handleShareEntry(entry)} className="text-slate-400 hover:text-sky-600 transition-colors p-2 rounded-full hover:bg-slate-50" title="Share Entry">
                                      <Icon name="Share" className="w-5 h-5" />
                                  </button>
                              </div>
                              <p className="text-slate-600 whitespace-pre-wrap">{entry.text}</p>
                              {entry.tag && (
                                  <div className={`mt-3 inline-flex items-center px-2 py-1 rounded text-xs font-semibold ${entry.tag === 'consolation' ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
                                      <Icon name={entry.tag === 'consolation' ? 'Sun' : 'Cloud'} className="w-3 h-3 mr-1" />
                                      {entry.tag.charAt(0).toUpperCase() + entry.tag.slice(1)}
                                  </div>
                              )}
                          </div>
                      ))}
                  </div>
              )}
          </div>
      )
  }

  const renderMoodCheckIn = () => {
      return (
          <div className="w-full h-full flex flex-col items-center justify-center relative animate-fade-in">
              <button
                  onClick={() => handleSetMode('dashboard')}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10 p-2"
                  aria-label="Close mood tracker"
              >
                  <Icon name="Close" className="w-8 h-8" />
              </button>
              <div className="w-full max-w-4xl mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold text-slate-100 mb-8">How are you arriving to prayer?</h2>
                <MoodTracker moods={MOODS} onSelectMood={handleMoodSelected} />
              </div>
          </div>
      )
  };
  
  const renderDailyPractice = () => {
    // Step 0: Centering
    if (currentDailyStepIndex === 0) {
        return (
            <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in text-center px-6">
                 <h2 className="text-2xl font-serif text-slate-600 mb-12">Be still and know that I am God.</h2>
                 
                 {/* Breathing Animation Circle */}
                 <div className="relative flex items-center justify-center mb-12">
                     <div className="w-64 h-64 bg-sky-200/30 rounded-full absolute animate-ping-slow"></div>
                     <div className="w-48 h-48 bg-sky-300/40 rounded-full absolute animate-breathe"></div>
                     <div className="w-32 h-32 bg-sky-100 rounded-full flex items-center justify-center shadow-inner z-10">
                         <span className="text-sky-800 font-semibold tracking-widest text-sm uppercase">Breathe</span>
                     </div>
                 </div>

                 <p className="text-slate-500 max-w-md mb-12">Take a few deep breaths. Match your breathing to the circle. Inhale as it expands, exhale as it contracts. Arrive here.</p>
                 
                 <button 
                    onClick={handleNextDailyStep}
                    className="text-slate-600 border border-slate-300 px-8 py-2 rounded-full hover:bg-white hover:text-sky-700 transition-all"
                 >
                     I am ready
                 </button>
            </div>
        )
    }

    // Step 1: Scripture
    if (currentDailyStepIndex === 1) {
        const journalKey = `W${currentWeekData.week}-scripture`;
        const journalEntry = journalEntries[journalKey];
        return (
             <div className="w-full max-w-2xl mx-auto px-4">
               <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full transition-all duration-300 animate-fade-in">
                    <div className="flex items-center space-x-4 mb-4">
                        <div className="bg-teal-100 text-teal-700 p-3 rounded-full">
                            <Icon name="Review" className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                           <h2 className="text-2xl font-bold text-slate-800">Imaginative Prayer</h2>
                           <p className="text-sm font-semibold text-slate-500">{currentWeekData.scripture.version} {currentWeekData.scripture.reference}</p>
                        </div>
                         <button 
                            onClick={() => toggleSpeech(currentWeekData.scripture.text)}
                            disabled={isLoadingSpeech}
                            className={`p-2 rounded-full transition-colors ${isSpeaking ? 'bg-rose-100 text-rose-600' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'} ${isLoadingSpeech ? 'opacity-50 cursor-wait' : ''}`}
                            title={isSpeaking ? "Stop Reading" : "Read Aloud"}
                        >
                            {isLoadingSpeech ? <LoadingSpinner /> : <Icon name={isSpeaking ? "Stop" : "Speaker"} className="w-6 h-6" />}
                        </button>
                    </div>

                    {dailyMood && (
                        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 text-blue-800 rounded-r-lg">
                            <p className="text-sm">You're coming to prayer feeling <strong>{dailyMood}</strong>. God meets you here.</p>
                        </div>
                    )}
                    
                    <div className="prose prose-slate max-w-none max-h-60 overflow-y-auto p-4 bg-slate-50 rounded-lg mb-6 leading-loose text-lg font-serif text-slate-700">
                        <p>{currentWeekData.scripture.text}</p>
                    </div>
                     <StepCard
                        step={{
                            title: 'Your Reflection', icon: 'Conversation',
                            description: 'Read the passage slowly. Place yourself in the scene. What do you see, hear, or feel? Speak with Jesus about what comes to mind.',
                            prompt: 'Journal your thoughts, feelings, or prayers in response to this scripture.'
                        }}
                        journalText={journalEntry?.text || ''}
                        onJournalChange={(text) => handleJournalChange(journalKey, text, `Scripture: ${currentWeekData.scripture.version} ${currentWeekData.scripture.reference}`)}
                        journalTag={journalEntry?.tag || null}
                        onTagChange={(tag) => handleTagChange(journalKey, tag)}
                        focusPrompt={`This week's focus: ${currentWeekData.examenFocus}`}
                    />
               </div>
               <NavigationButtons
                  onPrev={handlePrevDailyStep}
                  onNext={handleNextDailyStep}
                  isFirstStep={false} 
                  onHome={() => setUiMode('dashboard')}
                  nextButtonText="Begin Examen"
                />
          </div>
        )
    }

    // Step 2+: Examen
    const examenStepIndex = currentDailyStepIndex - 2;
    const currentStep: ExamenStep = EXAMEN_STEPS[examenStepIndex];
    const journalKey = `W${currentWeekData.week}-E${examenStepIndex}`;
    const journalEntry = journalEntries[journalKey];
    
    return (
      <div className="w-full max-w-2xl mx-auto px-4">
        <StepCard
            step={currentStep}
            stepIndex={examenStepIndex}
            totalSteps={EXAMEN_STEPS.length}
            journalText={journalEntry?.text || ''}
            onJournalChange={(text) => handleJournalChange(journalKey, text, `Examen: ${currentStep.title}`)}
            journalTag={journalEntry?.tag || null}
            onTagChange={(tag) => handleTagChange(journalKey, tag)}
            isLoadingAI={isLoadingAI && currentStep.aiPromptSource === true}
            aiPrompt={aiPrompt}
            focusPrompt={`This week's focus: ${currentWeekData.examenFocus}`}
        />
        {error && <p className="text-center text-red-500 mt-2">{error}</p>}
        <NavigationButtons
          onPrev={handlePrevDailyStep}
          onNext={handleNextDailyStep}
          isFirstStep={false}
          onHome={() => setUiMode('dashboard')}
          nextButtonText={currentDailyStepIndex === totalDailySteps - 1 ? "Finish" : "Next"}
        />
      </div>
    );
  };
    
  const renderDiscernmentTool = () => {
      return (
          <div className="w-full max-w-2xl mx-auto px-4">
              <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full transition-all duration-300 animate-fade-in">
                  <div className="flex items-center space-x-4 mb-4">
                      <div className="bg-indigo-100 text-indigo-700 p-3 rounded-full">
                          <Icon name="Focus" className="w-6 h-6" />
                      </div>
                      <div>
                          <h2 className="text-2xl font-bold text-slate-800">Discernment Patterns</h2>
                          <p className="text-sm font-semibold text-slate-500">Noticing God's Movements</p>
                      </div>
                  </div>
                  <p className="text-slate-600 mb-6 text-base">Here you can see your journal entries tagged with consolation or desolation. When you're ready, ask the AI assistant to help you notice patterns.</p>
                  
                  {isLoadingAI && (
                      <div className="flex justify-center items-center my-8">
                          <LoadingSpinner />
                          <span className="ml-3 text-slate-600">Finding patterns...</span>
                      </div>
                  )}

                  {discernmentSummary && !isLoadingAI && (
                       <div className="my-4 p-4 bg-indigo-50 border-l-4 border-indigo-400 text-indigo-900 rounded-r-lg animate-fade-in prose prose-slate">
                           <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(discernmentSummary.replace(/\n/g, '<br />')) }} />
                           <p className="text-xs text-right mt-2 opacity-70">- AI Assisted Reflection</p>
                       </div>
                  )}

                  {error && <p className="text-center text-red-500 my-4">{error}</p>}
                  
                  <button onClick={handleGetDiscernmentSummary} disabled={isLoadingAI || taggedEntries.length < 3}
                      className="w-full bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg hover:bg-indigo-800 transition-colors shadow-md disabled:bg-slate-400 disabled:cursor-not-allowed">
                      {taggedEntries.length < 3 ? `Need ${3 - taggedEntries.length} more tagged entries` : "Summarize Patterns"}
                  </button>

                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                          <h3 className="text-lg font-bold text-green-700 flex items-center mb-2"><Icon name="Gratitude" className="w-5 h-5 mr-2" /> Consolation</h3>
                          <div className="space-y-3 h-48 overflow-y-auto pr-2">
                              {(Object.values(journalEntries) as JournalEntry[]).filter(j => j && j.tag === 'consolation').map((j, i) => (
                                  <div key={i} className="p-3 bg-green-50 rounded-lg border border-green-200">
                                      <p className="text-sm text-slate-700 italic">"{j.text}"</p>
                                      <p className="text-xs text-slate-500 mt-1 text-right">{j.title}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                       <div>
                          <h3 className="text-lg font-bold text-amber-700 flex items-center mb-2"><Icon name="Hope" className="w-5 h-5 mr-2" /> Desolation</h3>
                          <div className="space-y-3 h-48 overflow-y-auto pr-2">
                              {(Object.values(journalEntries) as JournalEntry[]).filter(j => j && j.tag === 'desolation').map((j, i) => (
                                  <div key={i} className="p-3 bg-amber-50 rounded-lg border border-amber-200">
                                      <p className="text-sm text-slate-700 italic">"{j.text}"</p>
                                      <p className="text-xs text-slate-500 mt-1 text-right">{j.title}</p>
                                  </div>
                              ))}
                          </div>
                      </div>
                  </div>

              </div>
              <NavigationButtons onNext={() => {}} isFirstStep={true} onPrev={() => {}} onHome={() => setUiMode('dashboard')} />
          </div>
      )
  }

  const renderContent = () => {
      switch (uiMode) {
          case 'landing': return renderLanding();
          case 'onboarding': return (
            <Onboarding
              onComplete={handleOnboardingComplete}
              onOpenAuth={() => setShowAuth(true)}
            />
          );
          case 'mood_check_in': return renderMoodCheckIn();
          case 'daily_practice': return renderDailyPractice();
          case 'discernment': return renderDiscernmentTool();
          case 'history': return renderHistory();
          case 'privacy': return <PrivacyPolicy onBack={() => handleSetMode('landing')} />;
          case 'terms': return <TermsOfService onBack={() => handleSetMode('landing')} />;
          case 'dashboard':
          default:
              return renderDashboard();
      }
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center transition-all duration-500 ${uiMode === 'mood_check_in' || uiMode === 'landing' || uiMode === 'onboarding' ? 'bg-slate-900' : 'bg-slate-50 text-slate-800'}`}>
      {renderContent()}
      {renderSettingsModal()}
      <AuthModal
        isOpen={showAuth}
        onClose={() => setShowAuth(false)}
        user={user}
        onAuthChange={() => loadJournalEntries(user?.id).then(setJournalEntries)}
      />
    </div>
  );
};

// Audio Helper Functions
function base64ToBytes(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function pcmToAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

export default App;
