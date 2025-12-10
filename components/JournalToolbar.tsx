import React from 'react';
import type { JournalTag } from '../types';
import Icon from './Icon';

interface JournalToolbarProps {
    selectedTag: JournalTag | null;
    onTagSelect: (tag: JournalTag) => void;
}

const JournalToolbar: React.FC<JournalToolbarProps> = ({ selectedTag, onTagSelect }) => {
    const baseButtonClass = "flex-1 text-sm font-semibold py-2 px-3 flex items-center justify-center space-x-2 transition-colors duration-200";
    const consolationClass = selectedTag === 'consolation'
        ? "bg-green-600 text-white"
        : "bg-white text-green-700 hover:bg-green-50";
    const desolationClass = selectedTag === 'desolation'
        ? "bg-amber-600 text-white"
        : "bg-white text-amber-700 hover:bg-amber-50";

    return (
        <div className="mt-2 flex rounded-md border border-slate-300 overflow-hidden shadow-sm">
            <button
                onClick={() => onTagSelect('consolation')}
                className={`${baseButtonClass} ${consolationClass}`}
                aria-pressed={selectedTag === 'consolation'}
            >
                <Icon name="Sun" className="w-5 h-5" />
                <span>Consolation</span>
            </button>
            <button
                onClick={() => onTagSelect('desolation')}
                className={`${baseButtonClass} ${desolationClass} border-l border-slate-300`}
                aria-pressed={selectedTag === 'desolation'}
            >
                <Icon name="Cloud" className="w-5 h-5" />
                <span>Desolation</span>
            </button>
        </div>
    );
};

export default JournalToolbar;
