/** Single responsibility: approval card data from AI */
export interface ApprovalCard {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  context: string;
  /** For detail view */
  contextSummary?: string;
  metrics?: Record<string, string>;
  stakeholders?: string[];
  confidence?: number;
  timeline?: string;
  createdAt: string;
}

/** What each swipe direction does (configurable in Settings) */
export type SwipeAction = 'approve' | 'reject' | 'human_review' | 'snooze' | 'dismiss';

export interface GestureSettings {
  swipeRight: SwipeAction;
  swipeLeft: SwipeAction;
  swipeUp: SwipeAction;
  swipeDown: SwipeAction;
}

export const DEFAULT_GESTURE_SETTINGS: GestureSettings = {
  swipeRight: 'approve',
  swipeLeft: 'reject',
  swipeUp: 'human_review',
  swipeDown: 'snooze',
};

export const GESTURE_SETTINGS_KEY = 'openclaw_gesture_settings';
