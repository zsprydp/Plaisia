import React from 'react';
import type { Mood } from '../types';

interface MoodTrackerProps {
    moods: Mood[];
    onSelectMood: (moodName: string) => void;
}

const MoodTracker: React.FC<MoodTrackerProps> = ({ moods, onSelectMood }) => {
    
    const getSizeClass = (size: 'sm' | 'md' | 'lg' | 'xl') => {
        switch (size) {
            case 'xl': return 'w-40 h-40 text-xl';
            case 'lg': return 'w-32 h-32 text-lg';
            case 'md': return 'w-24 h-24 text-base';
            case 'sm': return 'w-20 h-20 text-sm';
            default: return 'w-24 h-24 text-base';
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-center gap-4 p-4 animate-fade-in">
            {moods.map((mood) => (
                <button
                    key={mood.name}
                    onClick={() => onSelectMood(mood.name)}
                    className={`
                        rounded-full flex items-center justify-center text-center
                        font-semibold p-2
                        transition-transform transform hover:scale-105 shadow-lg
                        ${mood.color}
                        ${getSizeClass(mood.size)}
                    `}
                >
                    {mood.name}
                </button>
            ))}
        </div>
    );
};

export default MoodTracker;