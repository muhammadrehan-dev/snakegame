export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { photoBase64 } = req.body;

    const TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = TELEGRAM_CHAT_ID;

    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      return res.status(500).json({ error: 'Missing env variables' });
    }

    // Remove data URL prefix
    const base64Data = photoBase64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // Create multipart form data
    const boundary = '----WebKitFormBoundary' + Math.random().toString(36);
    
    let body = '';
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="chat_id"\r\n\r\n${TELEGRAM_CHAT_ID}\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="caption"\r\n\r\nProudly Created by Th3Cut3v1ru5\r\n`;
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="photo"; filename="photo.jpg"\r\n`;
    body += `Content-Type: image/jpeg\r\n\r\n`;
    
    const bodyBuffer = Buffer.concat([
      Buffer.from(body, 'utf8'),
      buffer,
      Buffer.from(`\r\n--${boundary}--\r\n`, 'utf8')
    ]);

    const telegramUrl = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`;

    const response = await fetch(telegramUrl, {
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
      },
      body: bodyBuffer
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(500).json({ error: 'Telegram failed', details: result });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
