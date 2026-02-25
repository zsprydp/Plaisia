export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;

  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;

  const permission = await Notification.requestPermission();
  return permission === 'granted';
}

export function scheduleLocalReminder(time: string) {
  if (!time || !('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }

  localStorage.setItem('plaisia_reminder_time', time);
}

export async function showNotification(title: string, body: string) {
  if (Notification.permission !== 'granted') return;

  if ('serviceWorker' in navigator) {
    const registration = await navigator.serviceWorker.ready;
    registration.showNotification(title, {
      body,
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: 'plaisia-reminder',
    } as NotificationOptions);
  } else {
    new Notification(title, { body, icon: '/icon-192.png' });
  }
}

export function startReminderCheck(reminderTime: string) {
  if (!reminderTime) return () => {};

  const interval = setInterval(() => {
    const now = new Date();
    const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    if (currentTime === reminderTime) {
      const lastNotified = localStorage.getItem('plaisia_last_notified');
      const today = new Date().toDateString();

      if (lastNotified !== today) {
        showNotification('Plaísia', "It's time for your daily prayer and reflection.");
        localStorage.setItem('plaisia_last_notified', today);
      }
    }
  }, 60000);

  return () => clearInterval(interval);
}
