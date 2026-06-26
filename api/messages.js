const { Redis } = require('@upstash/redis');

const redis = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN,
});

const LIST_KEY = 'bobby-farewell:messages';
const MAX_NAME_LEN = 40;
const MAX_MESSAGE_LEN = 280;

module.exports = async function handler(req, res) {
  if (req.method === 'GET') {
    const raw = await redis.lrange(LIST_KEY, 0, -1);
    const messages = raw.map((item) => (typeof item === 'string' ? JSON.parse(item) : item));
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json(messages);
  }

  if (req.method === 'POST') {
    const { name, message } = req.body || {};
    const trimmedName = typeof name === 'string' ? name.trim().slice(0, MAX_NAME_LEN) : '';
    const trimmedMessage = typeof message === 'string' ? message.trim().slice(0, MAX_MESSAGE_LEN) : '';

    if (!trimmedName || !trimmedMessage) {
      return res.status(400).json({ error: 'Name and message are required.' });
    }

    const entry = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
      name: trimmedName,
      message: trimmedMessage,
      createdAt: new Date().toISOString(),
    };

    // RPUSH is atomic — no read-modify-write race between concurrent signers.
    await redis.rpush(LIST_KEY, JSON.stringify(entry));

    res.setHeader('Cache-Control', 'no-store');
    return res.status(201).json(entry);
  }

  res.setHeader('Allow', 'GET, POST');
  return res.status(405).json({ error: 'Method not allowed' });
};
