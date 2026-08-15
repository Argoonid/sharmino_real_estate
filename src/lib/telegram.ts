const TELEGRAM_BOT_TOKEN = process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || 'YOUR_BOT_TOKEN';
const TELEGRAM_CHAT_ID = process.env.NEXT_PUBLIC_TELEGRAM_CHAT_ID || 'YOUR_CHAT_ID';

export async function sendTelegramNotification(message: string): Promise<boolean> {
  if (!TELEGRAM_BOT_TOKEN || TELEGRAM_BOT_TOKEN === 'YOUR_BOT_TOKEN') {
    console.log('[Mock Telegram Notification]:\n', message);
    return true;
  }

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'HTML',
        }),
      }
    );
    return response.ok;
  } catch (error) {
    console.error('Ошибка отправки в Telegram:', error);
    return false;
  }
}