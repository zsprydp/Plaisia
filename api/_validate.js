const MAX_TEXT_LENGTH = 5000;
const MAX_ENTRIES = 100;

export function validateText(text, fieldName = 'text') {
  if (typeof text !== 'string') {
    return `${fieldName} must be a string.`;
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return `${fieldName} exceeds maximum length of ${MAX_TEXT_LENGTH} characters.`;
  }
  return null;
}

export function validateEntries(entries) {
  if (!entries || typeof entries !== 'object') {
    return 'entries must be an object.';
  }

  const keys = Object.keys(entries);
  if (keys.length > MAX_ENTRIES) {
    return `Too many entries (max ${MAX_ENTRIES}).`;
  }

  for (const key of keys) {
    const entry = entries[key];
    if (entry.text && entry.text.length > MAX_TEXT_LENGTH) {
      return `Entry "${key}" exceeds maximum text length.`;
    }
  }

  return null;
}

export function sanitizeText(text) {
  if (typeof text !== 'string') return '';
  return text.slice(0, MAX_TEXT_LENGTH).trim();
}
