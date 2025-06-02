const express = require('express');
const router = express.Router();

router.post('/api/gpt-chat', async (req, res) => {
  const { message } = req.body;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer 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"
      },
      body: JSON.stringify({
        model: "gpt-4.1",
        messages: [{ role: "user", content: message }]
      })
    });

    const json = await response.json();
    const reply = json.choices?.[0]?.message?.content || "❌ Tidak ada balasan dari GPT";

    res.json({ reply });
  } catch (err) {
    console.error('❌ Error GPT:', err.message);
    res.status(500).json({ reply: '❌ Terjadi error saat menghubungi GPT API' });
  }
});

module.exports = router;
