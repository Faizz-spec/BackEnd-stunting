// lihat-file.js
const fs = require('fs');
const path = require('path');

const skipContent = ['.h5', '.jpg', '.jpeg', '.png', '.gif', '.exe', '.pdf', '.zip', '.rar', '.ico'];

function renderLihatFile(req, res) {
  const baseDir = path.resolve(__dirname, '../');
  const items = fs.readdirSync(baseDir);
  const folders = items.filter(item => fs.statSync(path.join(baseDir, item)).isDirectory());

  function getFilesInside(folder) {
    const full = path.join(baseDir, folder);
    const children = fs.readdirSync(full);
    return children.filter(child => {
      const p = path.join(full, child);
      return fs.statSync(p).isFile();
    });
  }

  const folderList = folders.map(folder => {
    const files = getFilesInside(folder).map(f => `
      <div style="margin-left:20px;">
        <label>
          <input type="checkbox" name="file" value="${folder}/${f}"> 📄 ${f}
        </label>
      </div>
    `).join('');

    return `
      <div class="folder-item">
        <label>
          <input type="checkbox" class="folder-check" data-folder="${folder}" onchange="checkFolder(this)">
          <button type="button" onclick="toggle('${folder}')">▶ ${folder}</button>
        </label>
        <div id="child-${folder}" style="display:none; margin-left:10px;">
          ${files}
        </div>
      </div>
    `;
  }).join('');

res.send(`
  <div class="explorer-wrapper">
    <div id="sidebar">
      <h3>📁 <span style="color: #e67e22;">Folder Tersedia</span></h3>
      ${folderList}
      <button onclick="jalankan()">🧠 Jalankan</button>
    </div>
    <div id="output-area">
      <h3>📄 Hasil Index</h3>
      <div id="hasil"></div>
    </div>
  </div>

  <script>
    function toggle(folder) {
      const el = document.getElementById('child-' + folder);
      el.style.display = (el.style.display === 'none') ? 'block' : 'none';
    }

    function checkFolder(checkbox) {
      const folder = checkbox.getAttribute('data-folder');
      const children = document.querySelectorAll('#child-' + folder + ' input[type=checkbox]');
      children.forEach(cb => cb.checked = checkbox.checked);
    }

    async function jalankan() {
      const selectedFiles = [...document.querySelectorAll('input[name=file]:checked')].map(cb => cb.value);
      const res = await fetch('/files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ files: selectedFiles })
      });

      const hasil = document.getElementById('hasil');
      hasil.innerHTML = '';

      if (res.status !== 200) {
        hasil.innerHTML = '<p style="color:red;">❌ Gagal membaca file</p>';
        return;
      }

      const data = await res.json();
      data.forEach(file => {
        const el = document.createElement('div');
        el.innerHTML = '<h4>📄 ' + file.path + '</h4>' +
          '<pre><code>' + escapeHtml(file.content) + '</code></pre>';
        hasil.appendChild(el);
      });
    }

    function escapeHtml(text) {
      return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
    }
  </script>
`);

}

function handleFiles(req, res) {
  const fileList = req.body.files;
  if (!Array.isArray(fileList)) {
    return res.status(400).json({ error: 'Daftar file tidak valid' });
  }

  const baseDir = path.resolve(__dirname, '../');
  const result = [];

  for (const relativePath of fileList) {
    const fullPath = path.resolve(baseDir, relativePath);
    const ext = path.extname(fullPath).toLowerCase();

    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isFile()) continue;

    if (skipContent.includes(ext)) {
      result.push({ path: fullPath, content: '[❌ Konten file tidak ditampilkan (bukan file kode)]' });
    } else {
      const isi = fs.readFileSync(fullPath, 'utf8');
      result.push({ path: fullPath, content: isi });
    }
  }

  res.json(result);
}

module.exports = { renderLihatFile, handleFiles };
