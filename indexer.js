const fs = require('fs');
const path = require('path');

const targetFolder = './routes'; // Ganti sesuai kebutuhan

function bacaFolder(folderPath) {
  const items = fs.readdirSync(folderPath);

  items.forEach(item => {
    const fullPath = path.join(folderPath, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      // Kalau folder, telusuri lagi
      bacaFolder(fullPath);
    } else {
      // Kalau file, baca isinya
      const isi = fs.readFileSync(fullPath, 'utf8');
      console.log(`\nFile: ${fullPath}`);
      console.log('-------------------------');
      console.log(isi);
    }
  });
}

bacaFolder(targetFolder);
