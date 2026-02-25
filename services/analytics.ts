type EventName =
  | 'journey_started'
  | 'mood_selected'
  | 'examen_step_completed'
  | 'prayer_completed'
  | 'discernment_viewed'
  | 'speech_played'
  | 'journal_entry_saved';

interface AnalyticsEvent {
  name: EventName;
  props?: Record<string, string | number | boolean>;
}

const isDoNotTrack =
  typeof navigator !== 'undefined' &&
  (navigator.doNotTrack === '1' || (navigator as any).globalPrivacyControl);

const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;

export function trackEvent(name: EventName, props?: AnalyticsEvent['props']) {
  if (isDoNotTrack || !endpoint) {
    if (import.meta.env.DEV) {
      console.log('[analytics]', name, props ?? '');
    }
    return;
  }

  const payload: AnalyticsEvent = { name, props };

  try {
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint, JSON.stringify(payload));
    } else {
      fetch(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
        keepalive: true,
      }).catch(() => {});
    }
  } catch {
    // Analytics should never break the app
  }
}
