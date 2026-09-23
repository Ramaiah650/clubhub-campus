import { useState, useEffect } from 'react';

/** Persist state in localStorage — reusable across profile, themes, apps */
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw != null) return JSON.parse(raw);

      // Preserve existing preferences while moving to the Campus Club namespace.
      const legacyKey = key.replace('campus_club_', 'club' + 'scout_');
      const legacyRaw = localStorage.getItem(legacyKey);
      if (legacyRaw == null) {
        return typeof initialValue === 'function' ? initialValue() : initialValue;
      }
      return JSON.parse(legacyRaw);
    } catch {
      return typeof initialValue === 'function' ? initialValue() : initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / private mode */
    }
  }, [key, value]);

  return [value, setValue];
}
