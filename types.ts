export interface ExamenStep {
    step: number;
    title: string;
    description: string;
    prompt: string;
    icon: 'Gratitude' | 'Review' | 'Focus' | 'Conversation' | 'Hope';
    aiTrigger?: boolean;
    aiPromptSource?: boolean;
}

export type JournalTag = 'consolation' | 'desolation';

export interface JournalEntry {
    text: string;
    tag: JournalTag | null;
    title: string; 
    date: string;
}

export interface JournalEntries {
    [key: string]: JournalEntry;
}

export interface ScripturePassage {
    reference: string;
    version: string;
    text: string;
}

export interface IgnatianWeek {
    week: number;
    title: string;
    lesson: {
      title: string;
      content: string;
    };
    scripture: ScripturePassage;
    examenFocus: string;
}

export interface Mood {
    name: string;
    category: 'pleasant' | 'unpleasant';
    energy: 'high' | 'low';
    color: string;
    size: 'sm' | 'md' | 'lg' | 'xl';
}