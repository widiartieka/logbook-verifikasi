// ---------- Elemen ----------
const form = document.getElementById('submitForm');
const cabangSelect = document.getElementById('cabang');
const cabangCustom = document.getElementById('cabangCustom');
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('fileInput');
const dzText = document.getElementById('dzText');
const submitBtn = document.getElementById('submitBtn');
const statusMsg = document.getElementById('statusMsg');

let selectedFile = null;

// ---------- Kode cabang custom ----------
cabangSelect.addEventListener('change', () => {
  cabangCustom.style.display = cabangSelect.value === '__custom' ? 'block' : 'none';
});
cabangCustom.addEventListener('input', () => {
  cabangCustom.value = cabangCustom.value.toUpperCase();
});

// ---------- Dropzone ----------
dropzone.addEventListener('click', () => fileInput.click());
dropzone.addEventListener('dragover', (e) => { e.preventDefault(); dropzone.classList.add('drag'); });
dropzone.addEventListener('dragleave', () => dropzone.classList.remove('drag'));
dropzone.addEventListener('drop', (e) => {
  e.preventDefault();
  dropzone.classList.remove('drag');
  if (e.dataTransfer.files.length) {
    fileInput.files = e.dataTransfer.files;
    handleFile(e.dataTransfer.files[0]);
  }
});
fileInput.addEventListener('change', () => {
  if (fileInput.files.length) handleFile(fileInput.files[0]);
});

function handleFile(file) {
  if (file.type !== 'application/pdf') {
    dzText.innerHTML = '<span style="color:#C0392B;font-weight:600;">File harus berformat PDF</span>';
    selectedFile = null;
    return;
  }
  selectedFile = file;
  dzText.innerHTML = `<span class="dz-file">✓ ${file.name}</span>`;
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ---------- Submit ----------
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  statusMsg.textContent = '';
  statusMsg.className = 'status-msg';

  const cabang = cabangSelect.value === '__custom' ? cabangCustom.value.trim() : cabangSelect.value;

  if (!cabang || cabang.length < 2) {
    statusMsg.textContent = 'Kode cabang wajib diisi.';
    statusMsg.classList.add('err');
    return;
  }
  if (!selectedFile) {
    statusMsg.textContent = 'Berkas PDF wajib diunggah.';
    statusMsg.classList.add('err');
    return;
  }
  if (!API_URL || API_URL.includes('PASTE_URL')) {
    statusMsg.textContent = 'API_URL belum dikonfigurasi (lihat assets/config.js).';
    statusMsg.classList.add('err');
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = 'Mengirim…';

  try {
    const fileData = await fileToBase64(selectedFile);

    const payload = {
      action: 'submit',
      cabang: cabang,
      namaPic: document.getElementById('namaPic').value.trim(),
      noTelpon: document.getElementById('noTelpon').value.trim(),
      noPaymentRequest: document.getElementById('noPaymentRequest').value.trim(),
      linkPaymentRequest: document.getElementById('linkPaymentRequest').value.trim(),
      fileName: selectedFile.name,
      fileData: fileData
    };

    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // hindari CORS preflight
      body: JSON.stringify(payload)
    });
    const result = await res.json();

    if (result.success) {
      statusMsg.textContent = `Berhasil dikirim. ID: ${result.id}`;
      statusMsg.classList.add('ok');
      form.reset();
      cabangCustom.style.display = 'none';
      dzText.innerHTML = '<strong>Klik untuk pilih file</strong> atau seret PDF ke sini';
      selectedFile = null;
    } else {
      throw new Error(result.error || 'Gagal mengirim data.');
    }
  } catch (err) {
    statusMsg.textContent = 'Gagal: ' + err.message;
    statusMsg.classList.add('err');
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = 'Kirim Berkas';
  }
});
