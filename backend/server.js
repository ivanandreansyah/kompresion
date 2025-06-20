const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const { exec } = require('child_process');
const sharp = require('sharp');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Setup multer for file upload
const upload = multer({ dest: 'uploads/' });

// Kompres endpoint
app.post('/api/kompres', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) return res.status(400).json({ error: 'No file uploaded' });

  const ext = path.extname(file.originalname).toLowerCase();
  let outputPath = '';

  try {
    if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
      // Kompres gambar (gunakan sharp)
      outputPath = file.path + '_compressed' + ext;
      if ([".jpg", ".jpeg"].includes(ext)) {
        await sharp(file.path)
          .jpeg({ quality: 60 })
          .toFile(outputPath);
      } else if (ext === ".png") {
        await sharp(file.path)
          .png({ quality: 60, compressionLevel: 9 })
          .toFile(outputPath);
      } else if (ext === ".webp") {
        await sharp(file.path)
          .webp({ quality: 60 })
          .toFile(outputPath);
      }
    } else if (ext === ".pdf") {
      // Kompres PDF (gunakan Ghostscript via command line jika tersedia)
      outputPath = file.path + '_compressed.pdf';
      // Cek apakah Ghostscript tersedia
      exec('gs --version', (err) => {
        if (err) {
          // Ghostscript tidak ada, fallback: copy file saja
          fs.copyFileSync(file.path, outputPath);
          res.download(outputPath, path.basename(outputPath), (err) => {
            fs.unlinkSync(file.path);
            if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
          });
        } else {
          // Ghostscript tersedia, lakukan kompresi
          const gsCmd = `gs -sDEVICE=pdfwrite -dCompatibilityLevel=1.4 -dPDFSETTINGS=/ebook -dNOPAUSE -dQUIET -dBATCH -sOutputFile=${outputPath} ${file.path}`;
          exec(gsCmd, (err) => {
            if (err) {
              // Jika gagal, fallback copy file
              fs.copyFileSync(file.path, outputPath);
            }
            res.download(outputPath, path.basename(outputPath), (err) => {
              fs.unlinkSync(file.path);
              if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
            });
          });
        }
      });
      return; // Hindari res.download double
    } else if (ext === ".docx") {
      // Kompres DOCX (re-zip atau kompres gambar di dalamnya)
      // TODO: Implementasi kompresi DOCX
      outputPath = file.path + '_compressed.docx';
      fs.copyFileSync(file.path, outputPath); // Placeholder
    } else {
      return res.status(400).json({ error: 'File type not supported' });
    }

    res.download(outputPath, path.basename(outputPath), (err) => {
      fs.unlinkSync(file.path);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    });
  } catch (err) {
    res.status(500).json({ error: 'Processing error', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 