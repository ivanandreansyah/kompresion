document.getElementById('lanjutBtn').addEventListener('click', function() {
  document.getElementById('splashPage').style.display = 'none';
  document.getElementById('pilihanPage').style.display = 'flex';
});

document.getElementById('kompresiBtn').addEventListener('click', function() {
  document.getElementById('pilihanPage').style.display = 'none';
  document.getElementById('kompresiPage').style.display = 'flex';
});

document.getElementById('konversiBtn').addEventListener('click', function() {
  document.getElementById('pilihanPage').style.display = 'none';
  document.getElementById('konversiPage').style.display = 'flex';
});

// Kompresi Page Logic
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const dropText = document.getElementById('dropText');
const previewSection = document.getElementById('previewSection');
const imgPreview = document.getElementById('imgPreview');
const compressRange = document.getElementById('compressRange');
const compressValue = document.getElementById('compressValue');
const kompresBtn = document.getElementById('kompresBtn');
const hasilSection = document.getElementById('hasilSection');
const imgHasil = document.getElementById('imgHasil');
const downloadBtn = document.getElementById('downloadBtn');

let selectedFile = null;

// Drag & Drop events Kompresi
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropArea.classList.remove('dragover');
  });
});
dropArea.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  if (files && files[0]) {
    handleFile(files[0]);
  }
});
dropArea.addEventListener('click', () => fileInput.click());
fileInput.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    handleFile(e.target.files[0]);
  }
});

function handleFile(file) {
  const isImage = file.type.startsWith('image/');
  selectedFile = file;
  if (!isImage && !["application/pdf", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"].includes(file.type) && !file.name.endsWith('.pdf') && !file.name.endsWith('.docx')) {
    dropText.textContent = 'File tidak didukung!';
    return;
  }
  if (isImage) {
    const reader = new FileReader();
    reader.onload = function(e) {
      imgPreview.src = e.target.result;
      imgPreview.style.display = '';
      previewSection.style.display = 'block';
      hasilSection.style.display = 'none';
    };
    reader.readAsDataURL(file);
  } else {
    imgPreview.style.display = 'none';
    previewSection.style.display = 'block';
    hasilSection.style.display = 'none';
    // Tampilkan nama file
    dropText.textContent = 'File siap dikompresi: ' + file.name;
  }
}

compressRange.addEventListener('input', function() {
  compressValue.textContent = compressRange.value;
});

kompresBtn.addEventListener('click', async function() {
  if (!selectedFile) return;
  hasilSection.style.display = 'none';
  kompresBtn.disabled = true;
  kompresBtn.textContent = 'Memproses...';

  const formData = new FormData();
  formData.append('file', selectedFile);

  try {
    const response = await fetch('http://localhost:5000/api/kompres', {
      method: 'POST',
      body: formData
    });
    if (!response.ok) throw new Error('Gagal kompresi');
    const blob = await response.blob();
    // Tampilkan hasil
    hasilSection.style.display = 'block';
    if (selectedFile.type.startsWith('image/')) {
      imgHasil.src = URL.createObjectURL(blob);
      imgHasil.style.display = '';
    } else {
      imgHasil.style.display = 'none';
    }
    downloadBtn.href = URL.createObjectURL(blob);
    let ext = selectedFile.name.split('.').pop();
    downloadBtn.download = 'kompresi_' + selectedFile.name.replace(/\.[^.]+$/, '') + '.' + ext;
  } catch (err) {
    alert('Terjadi kesalahan saat kompresi: ' + err.message);
  } finally {
    kompresBtn.disabled = false;
    kompresBtn.textContent = 'Kompres';
  }
});

function showThanksPage() {
  document.getElementById('kompresiPage').style.display = 'none';
  document.getElementById('konversiPage').style.display = 'none';
  document.getElementById('thanksPage').style.display = 'flex';
}

downloadBtn.addEventListener('click', function() {
  setTimeout(() => {
    showThanksPage();
  }, 500);
});

// Konversi Page Logic
const dropAreaKonversi = document.getElementById('dropAreaKonversi');
const fileInputKonversi = document.getElementById('fileInputKonversi');
const dropTextKonversi = document.getElementById('dropTextKonversi');
const previewSectionKonversi = document.getElementById('previewSectionKonversi');
const previewKonversi = document.getElementById('previewKonversi');
const konversiBtnProses = document.getElementById('konversiBtnProses');
const hasilSectionKonversi = document.getElementById('hasilSectionKonversi');
const downloadBtnKonversi = document.getElementById('downloadBtnKonversi');

let selectedFileKonversi = null;
let previewTypeKonversi = null;

['dragenter', 'dragover'].forEach(eventName => {
  dropAreaKonversi.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaKonversi.classList.add('dragover');
  });
});
['dragleave', 'drop'].forEach(eventName => {
  dropAreaKonversi.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
    dropAreaKonversi.classList.remove('dragover');
  });
});
dropAreaKonversi.addEventListener('drop', (e) => {
  const files = e.dataTransfer.files;
  if (files && files[0]) {
    handleFileKonversi(files[0]);
  }
});
dropAreaKonversi.addEventListener('click', () => fileInputKonversi.click());
fileInputKonversi.addEventListener('change', (e) => {
  if (e.target.files && e.target.files[0]) {
    handleFileKonversi(e.target.files[0]);
  }
});

function handleFileKonversi(file) {
  if (!(file.type.startsWith('image/') || file.type === 'text/plain')) {
    dropTextKonversi.textContent = 'File harus gambar atau teks (.txt)!';
    return;
  }
  selectedFileKonversi = file;
  previewSectionKonversi.style.display = 'block';
  hasilSectionKonversi.style.display = 'none';
  previewKonversi.innerHTML = '';
  if (file.type.startsWith('image/')) {
    const reader = new FileReader();
    reader.onload = function(e) {
      const img = document.createElement('img');
      img.src = e.target.result;
      previewKonversi.appendChild(img);
      previewTypeKonversi = 'image';
    };
    reader.readAsDataURL(file);
  } else if (file.type === 'text/plain') {
    const reader = new FileReader();
    reader.onload = function(e) {
      const pre = document.createElement('pre');
      pre.textContent = e.target.result;
      previewKonversi.appendChild(pre);
      previewTypeKonversi = 'text';
    };
    reader.readAsText(file);
  }
}

konversiBtnProses.addEventListener('click', async function() {
  if (!selectedFileKonversi) return;
  hasilSectionKonversi.style.display = 'block';

  // Gunakan jsPDF
  const jsPDF = window.jspdf.jsPDF;
  const doc = new jsPDF();

  if (previewTypeKonversi === 'image') {
    // Gambar ke PDF
    const reader = new FileReader();
    reader.onload = function(e) {
      const imgData = e.target.result;
      // Hitung ukuran gambar agar proporsional di PDF
      const img = new window.Image();
      img.onload = function() {
        const pdfWidth = doc.internal.pageSize.getWidth();
        const pdfHeight = doc.internal.pageSize.getHeight();
        let imgWidth = img.width;
        let imgHeight = img.height;
        // Skala agar muat di halaman
        const scale = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight, 1);
        imgWidth *= scale;
        imgHeight *= scale;
        const x = (pdfWidth - imgWidth) / 2;
        const y = (pdfHeight - imgHeight) / 2;
        doc.addImage(imgData, 'JPEG', x, y, imgWidth, imgHeight);
        const pdfBlob = doc.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        downloadBtnKonversi.href = url;
        downloadBtnKonversi.download = 'konversi.pdf';
      };
      img.src = imgData;
    };
    reader.readAsDataURL(selectedFileKonversi);
  } else if (previewTypeKonversi === 'text') {
    // Teks ke PDF
    const reader = new FileReader();
    reader.onload = function(e) {
      const text = e.target.result;
      doc.setFont('helvetica');
      doc.setFontSize(12);
      const lines = doc.splitTextToSize(text, 180);
      doc.text(lines, 15, 20);
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      downloadBtnKonversi.href = url;
      downloadBtnKonversi.download = 'konversi.pdf';
    };
    reader.readAsText(selectedFileKonversi);
  }
});

downloadBtnKonversi.addEventListener('click', function() {
  setTimeout(() => {
    showThanksPage();
  }, 500);
});

document.getElementById('kembaliBtn').addEventListener('click', function() {
  document.getElementById('thanksPage').style.display = 'none';
  document.getElementById('splashPage').style.display = 'flex';
}); 