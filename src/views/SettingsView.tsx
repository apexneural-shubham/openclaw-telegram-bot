import type { GestureSettings, SwipeAction } from '../types';
import type { useGestureSettings } from '../hooks/useGestureSettings';
import './SettingsView.css';

const SWIPE_OPTIONS: { value: SwipeAction; label: string }[] = [
  { value: 'approve', label: 'Approve' },
  { value: 'reject', label: 'Reject' },
  { value: 'human_review', label: 'Human review' },
  { value: 'snooze', label: 'Snooze' },
  { value: 'dismiss', label: 'Dismiss' },
];

const DIRECTION_LABELS: Record<keyof GestureSettings, string> = {
  swipeRight: 'Swipe right',
  swipeLeft: 'Swipe left',
  swipeUp: 'Swipe up',
  swipeDown: 'Swipe down',
};

interface SettingsViewProps {
  gestureSettings: ReturnType<typeof useGestureSettings>;
}

/**
 * Configure what each swipe direction means globally.
 * Changes apply immediately to the Approvals tab.
 */
export function SettingsView({ gestureSettings }: SettingsViewProps) {
  const { settings, setSettings } = gestureSettings;

  const update = (key: keyof GestureSettings, value: SwipeAction) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="settings-view">
      <header className="settings-header">
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">Configure swipe gestures for the Approvals tab.</p>
      </header>
      <div className="settings-content">
        <section className="settings-section">
          <h2 className="settings-section-title">Swipe directions</h2>
          {(Object.keys(settings) as (keyof GestureSettings)[]).map((key) => (
            <div key={key} className="settings-row">
              <label className="settings-label">{DIRECTION_LABELS[key]}</label>
              <select
                className="settings-select"
                value={settings[key]}
                onChange={(e) => update(key, e.target.value as SwipeAction)}
                aria-label={`${DIRECTION_LABELS[key]} action`}
              >
                {SWIPE_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </section>
        <p className="settings-hint">
          Changes take effect immediately in Approvals. Chat is for conversation; decisions happen in Approvals.
        </p>
      </div>
    </div>
  );
}
