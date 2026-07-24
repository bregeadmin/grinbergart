module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.status(204).end(); return; }
  if (req.method !== 'POST') { res.status(405).json({ error: 'POST only' }); return; }
  try {
    let body = req.body;
    if (typeof body === 'string') { try { body = JSON.parse(body); } catch (e) { body = {}; } }
    const image = body && body.image;
    if (!image) { res.status(400).json({ error: 'no image' }); return; }
    const key = process.env.VISION_KEY;
    if (!key) { res.status(500).json({ error: 'VISION_KEY not set' }); return; }
    const r = await fetch('https://vision.googleapis.com/v1/images:annotate?key=' + key, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        requests: [{
          image: { content: image },
          features: [{ type: 'TEXT_DETECTION' }],
          imageContext: { languageHints: ['ka', 'en', 'ru'] }
        }]
      })
    });
    const data = await r.json();
    const resp0 = data && data.responses && data.responses[0];
    if (data.error || (resp0 && resp0.error)) {
      res.status(502).json({ error: ((data.error || resp0.error).message) || 'vision error' });
      return;
    }
    const text = (resp0 && resp0.fullTextAnnotation && resp0.fullTextAnnotation.text) || '';
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
