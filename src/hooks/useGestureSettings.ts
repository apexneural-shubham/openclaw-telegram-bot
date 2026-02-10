import { useState, useCallback, useEffect } from 'react';
import type { GestureSettings } from '../types';
import { DEFAULT_GESTURE_SETTINGS, GESTURE_SETTINGS_KEY } from '../types';

function loadSettings(): GestureSettings {
  try {
    const raw = localStorage.getItem(GESTURE_SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<GestureSettings>;
      return { ...DEFAULT_GESTURE_SETTINGS, ...parsed };
    }
  } catch {
    // ignore
  }
  return { ...DEFAULT_GESTURE_SETTINGS };
}

function saveSettings(settings: GestureSettings): void {
  localStorage.setItem(GESTURE_SETTINGS_KEY, JSON.stringify(settings));
}

/**
 * Persisted gesture settings. Changes apply immediately to Approvals tab.
 */
export function useGestureSettings() {
  const [settings, setSettingsState] = useState<GestureSettings>(loadSettings);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === GESTURE_SETTINGS_KEY && e.newValue) {
        try {
          setSettingsState({ ...DEFAULT_GESTURE_SETTINGS, ...JSON.parse(e.newValue) });
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setSettings = useCallback((next: GestureSettings | ((prev: GestureSettings) => GestureSettings)) => {
    setSettingsState((prev) => {
      const nextSettings = typeof next === 'function' ? next(prev) : next;
      saveSettings(nextSettings);
      return nextSettings;
    });
  }, []);

  return { settings, setSettings };
}
