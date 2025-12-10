
import React, { useRef, useEffect } from 'react';

interface JournalTextareaProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
}

const JournalTextarea: React.FC<JournalTextareaProps> = ({ id, value, onChange }) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto'; // Reset height
            textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
        }
    }, [value]);


  return (
    <textarea
      ref={textareaRef}
      id={id}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full p-3 bg-white border border-slate-300 rounded-md focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-shadow duration-200 text-base text-slate-700 resize-none overflow-hidden min-h-[120px]"
      placeholder="Your thoughts and feelings..."
      rows={5}
    />
  );
};

export default JournalTextarea;
