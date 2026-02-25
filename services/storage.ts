import { supabase, isSupabaseConfigured } from './supabase';
import type { JournalEntries, JournalEntry } from '../types';

const LOCAL_KEYS = {
  journal: 'plaisia_journal_entries',
  mood: 'plaisia_daily_mood',
  onboarded: 'plaisia_onboarded',
  reminder: 'plaisia_reminder_time',
  weekIndex: 'plaisia_week_index',
} as const;

function getLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function setLocal(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

// ── Journal entries ──

export async function loadJournalEntries(userId?: string): Promise<JournalEntries> {
  if (supabase && userId) {
    try {
      const { data, error } = await supabase
        .from('journal_entries')
        .select('*')
        .eq('user_id', userId);

      if (error) throw error;

      const entries: JournalEntries = {};
      for (const row of data ?? []) {
        entries[row.entry_key] = {
          text: row.text,
          title: row.title,
          date: row.date,
          tag: row.tag,
        };
      }

      setLocal(LOCAL_KEYS.journal, entries);
      return entries;
    } catch (err) {
      console.error('Failed to load from Supabase, using local cache:', err);
    }
  }

  return getLocal<JournalEntries>(LOCAL_KEYS.journal, {});
}

export async function saveJournalEntry(
  key: string,
  entry: JournalEntry,
  userId?: string
) {
  if (supabase && userId) {
    try {
      await supabase.from('journal_entries').upsert(
        {
          user_id: userId,
          entry_key: key,
          text: entry.text,
          title: entry.title,
          date: entry.date,
          tag: entry.tag,
        },
        { onConflict: 'user_id,entry_key' }
      );
    } catch (err) {
      console.error('Failed to save to Supabase:', err);
    }
  }
}

// ── User preferences ──

export async function loadPreferences(userId?: string) {
  if (supabase && userId) {
    try {
      const { data } = await supabase
        .from('user_preferences')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (data) {
        return {
          reminderTime: data.reminder_time ?? '',
          weekIndex: data.week_index ?? 0,
        };
      }
    } catch {
      // Fall through to local
    }
  }

  return {
    reminderTime: localStorage.getItem(LOCAL_KEYS.reminder) ?? '',
    weekIndex: parseInt(localStorage.getItem(LOCAL_KEYS.weekIndex) ?? '0', 10),
  };
}

export async function savePreference(
  key: 'reminder_time' | 'week_index',
  value: string | number,
  userId?: string
) {
  if (key === 'reminder_time') {
    localStorage.setItem(LOCAL_KEYS.reminder, String(value));
  } else {
    localStorage.setItem(LOCAL_KEYS.weekIndex, String(value));
  }

  if (supabase && userId) {
    try {
      await supabase.from('user_preferences').upsert(
        { user_id: userId, [key]: value },
        { onConflict: 'user_id' }
      );
    } catch (err) {
      console.error('Failed to save preference to Supabase:', err);
    }
  }
}

export { isSupabaseConfigured };
