/**
 * Centralized app config. All values from env; no hardcoding.
 */

export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL ?? '',
  telegramBotUsername: import.meta.env.VITE_TELEGRAM_BOT_USERNAME ?? '',
} as const;
