function loadPage(page) {
  const content = document.getElementById('content');
  content.innerHTML = '<p>Loading...</p>';

  if (page === 'home') {
    content.innerHTML = `
      <h2>Selamat datang di Aplikasi Explorer</h2>
      <p>Pilih menu di atas untuk mulai.</p>
    `;
  } else if (page === 'database') {
    fetch('/lihat-database')
      .then(res => res.text())
      .then(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach(script => script.remove());

        content.innerHTML = tempDiv.innerHTML;

        scripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.classList.add('dynamic-script');
          newScript.textContent = script.textContent;
          document.body.appendChild(newScript);
        });
      })
      .catch(err => {
        content.innerHTML = '<p style="color:red;">Gagal memuat info database</p>';
      });

  } else if (page === 'lihat-file') {
    fetch('/lihat-file')
      .then(res => res.text())
      .then(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach(script => script.remove());

        content.innerHTML = tempDiv.innerHTML;

        document.querySelectorAll('script.dynamic-script').forEach(s => s.remove());

        scripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.classList.add('dynamic-script');
          if (script.src) {
            newScript.src = script.src;
          } else {
            newScript.textContent = script.textContent;
          }
          document.body.appendChild(newScript);
        });
      })
      .catch(err => {
        content.innerHTML = '<p style="color:red;">Gagal memuat halaman.</p>';
      });

  } else if (page === 'ngoding-AI') {
    fetch('/ngoding-ai')
      .then(res => res.text())
      .then(html => {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;

        const scripts = tempDiv.querySelectorAll('script');
        scripts.forEach(script => script.remove());

        content.innerHTML = tempDiv.innerHTML;

        scripts.forEach(script => {
          const newScript = document.createElement('script');
          newScript.classList.add('dynamic-script');
          newScript.textContent = script.textContent;
          document.body.appendChild(newScript);
        });
      })
      .catch(err => {
        content.innerHTML = '<p style="color:red;">❌ Gagal memuat halaman AI</p>';
      });
  }
}
