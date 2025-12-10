import React from 'react';
import type { ExamenStep, JournalTag } from '../types';
import Icon from './Icon';
import JournalTextarea from './JournalTextarea';
import LoadingSpinner from './LoadingSpinner';
import JournalToolbar from './JournalToolbar';

interface StepCardProps {
  step: Omit<ExamenStep, 'step'> & { step?: number };
  stepIndex?: number;
  totalSteps?: number;
  journalText: string;
  onJournalChange: (text: string) => void;
  journalTag?: JournalTag | null;
  onTagChange?: (tag: JournalTag) => void;
  isLoadingAI?: boolean;
  aiPrompt?: string | null;
  focusPrompt?: string;
}

const StepCard: React.FC<StepCardProps> = ({
  step,
  stepIndex,
  totalSteps,
  journalText,
  onJournalChange,
  journalTag,
  onTagChange,
  isLoadingAI,
  aiPrompt,
  focusPrompt
}) => {
  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-lg w-full transition-all duration-300 animate-fade-in">
        <div className="flex items-start justify-between mb-4">
            <div className='flex items-center space-x-4'>
                 <div className="bg-sky-100 text-sky-700 p-3 rounded-full">
                    <Icon name={step.icon} className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-slate-800">{step.title}</h2>
                    {stepIndex !== undefined && totalSteps !== undefined && (
                         <p className="text-sm font-semibold text-slate-500">EXAMEN STEP {stepIndex + 1} OF {totalSteps}</p>
                    )}
                </div>
            </div>
        </div>
      
      <p className="text-slate-600 mb-4 text-base">{step.description}</p>
      
      {focusPrompt && (
          <div className="mb-4 p-3 bg-slate-100 border-l-4 border-slate-400 text-slate-700 rounded-r-lg">
              <p className="text-sm italic">{focusPrompt}</p>
          </div>
      )}

      <div className="bg-slate-50 p-4 rounded-lg">
        <label htmlFor={`journal-${step.step}`} className="block text-md font-semibold text-slate-700 mb-2">{step.prompt}</label>
        
        {isLoadingAI && (
            <div className='flex items-center space-x-2 text-slate-500'>
                <LoadingSpinner />
                <span>Generating a reflection prompt...</span>
            </div>
        )}

        {!isLoadingAI && aiPrompt && (
            <div className="my-4 p-3 bg-sky-50 border-l-4 border-sky-400 text-sky-800 rounded-r-lg animate-fade-in">
                <p className="font-semibold italic">"{aiPrompt}"</p>
                <p className="text-xs text-right mt-1 opacity-70">- AI Assisted Prompt</p>
            </div>
        )}

        <JournalTextarea
          id={`journal-${step.step}`}
          value={journalText}
          onChange={onJournalChange}
        />

        {onTagChange && (
            <JournalToolbar 
                selectedTag={journalTag || null}
                onTagSelect={onTagChange}
            />
        )}
      </div>
    </div>
  );
};

export default StepCard;