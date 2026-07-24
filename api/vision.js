// Serverless-функция Vercel: принимает фото чека (base64), отправляет в Google Gemini
// и возвращает структурированный чек: магазин, дата, позиции [{name, qty, price}], итог.
// Ключ Gemini берётся из переменной окружения GEMINI_KEY — в приложении ключа нет.
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

    const key = process.env.GEMINI_KEY;
    if (!key) { res.status(500).json({ error: 'GEMINI_KEY not set' }); return; }

    const PROMPT = 'You are a receipt parser. Read this store receipt (it may be in Georgian, Russian or English) and return ONLY JSON with this shape: {"store":string,"date":string (YYYY-MM-DD) or "","currency":string,"items":[{"name":string,"qty":number,"price":number}],"total":number}. "price" is the line total for that item in the receipt currency. Include only actual purchased goods/products. EXCLUDE subtotal, VAT/tax, total, amount paid, change, discounts, loyalty points. Keep item names in their original language. If quantity is not shown use 1. Numbers must be plain numbers with a dot decimal separator and no currency symbols.';

    const r = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=' + key, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: PROMPT }, { inline_data: { mime_type: 'image/jpeg', data: image } }] }],
        generationConfig: { response_mime_type: 'application/json', temperature: 0 }
      })
    });
    const data = await r.json();
    if (data.error) { res.status(502).json({ error: data.error.message || 'gemini error' }); return; }
    let out = { items: [], total: 0 };
    try { out = JSON.parse(data.candidates[0].content.parts[0].text); } catch (e) { out = { items: [], total: 0 }; }
    res.status(200).json(out);
  } catch (e) {
    res.status(500).json({ error: String(e) });
  }
};
