function renderNgodingAI(req, res) {
  const html = `
    <style>
      body { background-color: #1e1e1e; color: white; font-family: monospace; }
      .chat-wrapper { max-width: 700px; margin: 0 auto; padding: 2em; }
      .chat-box { background: #2a2a2a; padding: 1em; border-radius: 8px; margin-bottom: 1em; white-space: pre-wrap; }
      .user { color: #00c3ff; }
      .assistant { color: #66ff66; }
      textarea { width: 100%; padding: 10px; font-family: monospace; background: #111; color: white; border: 1px solid #444; border-radius: 4px; }
      button { background: #00c3ff; color: black; padding: 10px 16px; border: none; margin-top: 10px; border-radius: 4px; cursor: pointer; }
    </style>

    <div class="chat-wrapper">
      <div id="chat-log"></div>
      <form onsubmit="sendPrompt(event)">
        <textarea id="prompt" rows="3" placeholder="Tanyakan apa saja..."></textarea>
        <button type="submit">💬 Kirim</button>
      </form>
    </div>

    <script>
      const chatLog = document.getElementById('chat-log');

      async function sendPrompt(e) {
        e.preventDefault();
        const prompt = document.getElementById('prompt').value;
        if (!prompt.trim()) return;

        // Tampilkan prompt user
        chatLog.innerHTML += '<div class="chat-box user">🧑 ' + prompt + '</div>';
        document.getElementById('prompt').value = '';

        // Kirim ke backend
        const res = await fetch('/api/gpt-chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: prompt })
        });

        const data = await res.json();
        chatLog.innerHTML += '<div class="chat-box assistant">🤖 ' + data.reply + '</div>';
        chatLog.scrollTop = chatLog.scrollHeight;
      }
    </script>
  `;
  res.send(html);
}

module.exports = { renderNgodingAI };
