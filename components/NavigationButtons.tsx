import React from 'react';

interface NavigationButtonsProps {
  onPrev: () => void;
  onNext: () => void;
  onHome?: () => void;
  isFirstStep: boolean;
  isLastStep?: boolean;
  nextButtonText?: string;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  onPrev,
  onNext,
  onHome,
  isFirstStep,
  isLastStep,
  nextButtonText = 'Next'
}) => {
  return (
    <div className="flex justify-between items-center mt-8">
      {onHome ? (
         <button
            onClick={onHome}
            className="text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors"
          >
            Dashboard
          </button>
      ) : (
        <button
            onClick={onPrev}
            disabled={isFirstStep}
            className="text-slate-600 font-semibold py-2 px-4 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
            Previous
        </button>
      )}
      
      {nextButtonText && (
        <button
            onClick={onNext}
            className="bg-sky-700 text-white font-bold py-2 px-6 rounded-lg hover:bg-sky-800 transition-colors shadow-md"
        >
            {nextButtonText}
        </button>
      )}
    </div>
  );
};

export default NavigationButtons;