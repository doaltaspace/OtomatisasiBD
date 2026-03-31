
// =====================
// Floating Particles Background
// =====================
const Particles = (() => {
  let canvas, ctx, particles = [], raf;
  const COUNT = 35;

  function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < COUNT; i++) particles.push(createParticle());
    loop();
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const shapes = ['circle', 'square', 'triangle'];
    const colors = ['#bae6fd', '#c4b5fd', '#a7f3d0', '#fde68a', '#fca5a5', '#7dd3fc'];
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 3 + Math.random() * 6,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -0.15 - Math.random() * 0.25,
      rotation: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.01,
      opacity: 0.12 + Math.random() * 0.18,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      color: colors[Math.floor(Math.random() * colors.length)],
    };
  }

  function draw(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 0.8;

    if (p.shape === 'circle') {
      ctx.beginPath();
      ctx.arc(0, 0, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    } else if (p.shape === 'square') {
      const s = p.size;
      ctx.beginPath();
      ctx.roundRect(-s, -s, s * 2, s * 2, 2);
      ctx.fill();
      ctx.stroke();
    } else {
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s, s);
      ctx.lineTo(-s, s);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    ctx.restore();
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotSpeed;
      if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;
      draw(p);
    });
    raf = requestAnimationFrame(loop);
  }

  return { init };
})();

// =====================
// Confetti Effect
// =====================
const Confetti = (() => {
  let canvas, ctx, pieces = [], raf, running = false;

  function init() {
    canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
  }

  function resize() {
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function burst(count = 80) {
    pieces = [];
    const colors = ['#1e293b', '#0ea5e9', '#22c55e', '#eab308', '#f97316', '#8b5cf6', '#ec4899'];
    const cx = window.innerWidth / 2;
    const cy = window.innerHeight * 0.35;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 8;
      pieces.push({
        x: cx, y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4,
        size: 4 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.2,
        life: 1,
        decay: 0.008 + Math.random() * 0.008,
        shape: Math.random() > 0.5 ? 'rect' : 'circle',
      });
    }
    if (!running) { running = true; loop(); }
  }

  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter(p => p.life > 0);
    if (pieces.length === 0) { running = false; return; }
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.18; // gravity
      p.rotation += p.rotSpeed;
      p.life -= p.decay;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rotation);
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      } else {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    });
    raf = requestAnimationFrame(loop);
  }

  return { init, burst };
})();

const SFX = (() => {
  let ctx = null;

  function getCtx() {
    if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function play(freq, type, duration, vol = 0.25) {
    const c = getCtx();
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, c.currentTime);
    gain.gain.setValueAtTime(vol, c.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, c.currentTime + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(c.currentTime);
    osc.stop(c.currentTime + duration);
  }

  function sequence(notes, vol = 0.2) {
    const c = getCtx();
    let t = c.currentTime;
    notes.forEach(([freq, type, dur]) => {
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(vol, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + dur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t);
      osc.stop(t + dur);
      t += dur * 0.7;
    });
  }

  return {
    upload() { sequence([[523, "sine", 0.1], [659, "sine", 0.1], [784, "sine", 0.15]]); },
    remove() { play(330, "triangle", 0.12, 0.2); },
    step() { play(600, "sine", 0.08, 0.15); },
    processStart() { sequence([[440, "sine", 0.08], [550, "sine", 0.08], [660, "sine", 0.12]]); },
    tick() { play(880, "sine", 0.05, 0.12); },
    success() { sequence([[523, "sine", 0.1], [659, "sine", 0.1], [784, "sine", 0.12], [1047, "sine", 0.2]]); },
    error() { sequence([[300, "square", 0.15], [200, "square", 0.25]], 0.15); },
    warning() { sequence([[400, "triangle", 0.12], [350, "triangle", 0.15]], 0.15); },
    copy() { sequence([[700, "sine", 0.06], [900, "sine", 0.08]], 0.18); },
    download() { sequence([[440, "sine", 0.08], [554, "sine", 0.08], [659, "sine", 0.1], [880, "sine", 0.15]]); },
    info() { play(700, "sine", 0.1, 0.12); },
  };
})();

let step = 1;
let selectedFiles = [];
let extractedResults = [];

// ---- Kolom mapping: kunci JSON -> kolom Excel ----
const COLUMN_MAP = {
  UNIT_KERJA:           "B",
  NOMOR_NOTA_DINAS:     "C",
  TANGGAL_NOTA_DINAS:   "D",
  INFORMASI_BD:         "E",
  TANGGAL_PEMBUATAN_BD: "F",
};

const COLUMN_LABELS = {
  UNIT_KERJA:           "Unit Kerja",
  NOMOR_NOTA_DINAS:     "Nomor Nota Dinas",
  TANGGAL_NOTA_DINAS:   "Tanggal Nota Dinas",
  INFORMASI_BD:         "Informasi BD",
  TANGGAL_PEMBUATAN_BD: "Tanggal Pembuatan BD",
};

// =====================
// PDF.js Setup
// =====================
const PDFJS_CDN = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.min.mjs";
const PDFJS_WORKER = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.4.168/pdf.worker.min.mjs";

let pdfjsLib = null;

async function loadPdfJs() {
  if (pdfjsLib) return;
  pdfjsLib = await import(PDFJS_CDN);
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS_WORKER;
}

// =====================
// PDF Text Extraction (Client-Side)
// =====================
async function extractTextFromPdf(file) {
  await loadPdfJs();

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  let fullText = "";

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const strings = content.items.map((item) => item.str);
    fullText += strings.join(" ") + "\n";
  }

  return fullText;
}

// =====================
// Regex Data Extraction
// =====================
function extractDataFromText(text) {
  // Normalize whitespace: collapse multiple spaces/newlines
  const normalized = text.replace(/\s+/g, " ").trim();

  const result = {
    UNIT_KERJA: "",
    NOMOR_NOTA_DINAS: "",
    TANGGAL_NOTA_DINAS: "",
    INFORMASI_BD: "",
    TANGGAL_PEMBUATAN_BD: "",
  };

  // 1. UNIT_KERJA: value after "Untuk Keperluan" label
  //    Pattern: "Untuk Keperluan" followed by optional ":" then the value
  //    Stops before "Distribusi Ke" or next known label
  const unitKerjaMatch = normalized.match(
    /Untuk\s+Keperluan\s*:?\s*(.+?)(?=\s*Distribusi\s+Ke|$)/i
  );
  if (unitKerjaMatch) {
    result.UNIT_KERJA = unitKerjaMatch[1].trim();
  }

  // 2. NOMOR_NOTA_DINAS: reference number in "Keterangan:" section
  //    Pattern like B/ND-83/XII/2025 or B /ND- 11 / I / 2026 (with spaces)
  //    Tolerates spaces around / and - then normalizes
  const notaDinasMatch = normalized.match(
    /Keterangan\s*:?\s*([A-Z]\s*\/\s*[A-Z]*\s*-?\s*\d+\s*\/\s*[IVXLCDM]+\s*\/\s*\d{4})/i
  );
  if (notaDinasMatch) {
    // Normalize: remove spaces around / and - to produce clean format B/ND-11/I/2026
    result.NOMOR_NOTA_DINAS = notaDinasMatch[1]
      .replace(/\s*\/\s*/g, "/")
      .replace(/\s*-\s*/g, "-")
      .replace(/\s+/g, "")
      .trim();
  }

  // 3. TANGGAL_NOTA_DINAS: date after "Tgl" or "TGL" in Keterangan section
  //    Pattern: "Tgl" / "TGL" followed by a date like "24 Desember 2025"
  const tglNotaMatch = normalized.match(
    /Tgl\.?\s*,?\s*(\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i
  );
  if (tglNotaMatch) {
    result.TANGGAL_NOTA_DINAS = tglNotaMatch[1].trim();
  }

  // 4. INFORMASI_BD: value after "Jenis Al Um" label
  //    Pattern: "Jenis Al Um" (or "Jenis Alum") followed by optional ":" then value
  //    Stops before "Untuk Keperluan" or next label
  const infoBDMatch = normalized.match(
    /Jenis\s+Al\s*\.?\s*Um\s*:?\s*(.+?)(?=\s*Untuk\s+Keperluan|$)/i
  );
  if (infoBDMatch) {
    result.INFORMASI_BD = infoBDMatch[1].trim();
  }

  // 5. TANGGAL_PEMBUATAN_BD: date in signature block
  //    Pattern: "Jakarta, DD Month YYYY" or similar city + date pattern
  const tglBDMatch = normalized.match(
    /(?:Jakarta|Bandung|Surabaya|Semarang|Medan|Makassar|Yogyakarta|Denpasar|Palembang|Pontianak)\s*,\s*(\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i
  );
  if (tglBDMatch) {
    result.TANGGAL_PEMBUATAN_BD = convertMonthToIndonesian(tglBDMatch[1].trim());
  }

  return result;
}

// Convert English month names to Indonesian
function convertMonthToIndonesian(dateStr) {
  const monthMap = {
    'January': 'Januari', 'February': 'Februari', 'March': 'Maret',
    'April': 'April', 'May': 'Mei', 'June': 'Juni',
    'July': 'Juli', 'August': 'Agustus', 'September': 'September',
    'October': 'Oktober', 'November': 'November', 'December': 'Desember'
  };
  return dateStr.replace(/January|February|March|April|May|June|July|August|September|October|November|December/gi, m =>
    monthMap[m.charAt(0).toUpperCase() + m.slice(1).toLowerCase()] || m
  );
}

// =====================
// Toast Notifications
// =====================
function showToast(message, type = "info", duration = 4000) {
  const container = document.getElementById("toast-container");
  const colors = {
    success: "bg-green-300/95 border-slate-800",
    error:   "bg-rose-300/95 border-slate-800",
    info:    "bg-sky-200/95 border-slate-800",
    warning: "bg-amber-300/95 border-slate-800",
  };
  const icons = {
    success: "check-circle",
    error:   "alert-circle",
    info:    "info",
    warning: "alert-triangle",
  };

  const toast = document.createElement("div");
  toast.className = `toast relative flex items-center gap-3 px-5 py-3 rounded-xl border-4 ${colors[type]} shadow-[4px_4px_0px_0px_#1e293b] font-bold text-sm text-slate-800 max-w-sm overflow-hidden`;
  toast.style.setProperty('--toast-duration', duration + 'ms');
  toast.innerHTML = `<i data-lucide="${icons[type]}" class="w-5 h-5 shrink-0 stroke-[3]"></i><span>${message}</span><div class="toast-progress"></div>`;
  container.appendChild(toast);
  lucide.createIcons({ nodes: [toast] });

  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 300);
  }, duration);
}

// =====================
// Step Indicator
// =====================
function renderStepIndicator() {
  const indicator = document.getElementById("step-indicator");
  const steps = [
    { num: 1, label: "Unggah PDF", color: "bg-sky-300", ringColor: "text-sky-400", icon: `<svg class="w-5 h-5 step-icon" viewBox="0 0 20 20" fill="none"><path d="M10 14V4" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/><path d="M6 8l4-4 4 4" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M3 14v2a1 1 0 001 1h12a1 1 0 001-1v-2" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/></svg>` },
    { num: 2, label: "Proses", color: "bg-amber-300", ringColor: "text-amber-400", icon: `<svg class="w-5 h-5 step-icon" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="3" stroke="#1e293b" stroke-width="2"/><path d="M10 1v2M10 17v2M1 10h2M17 10h2M4.2 4.2l1.4 1.4M14.4 14.4l1.4 1.4M4.2 15.8l1.4-1.4M14.4 5.6l1.4-1.4" stroke="#1e293b" stroke-width="1.8" stroke-linecap="round"/></svg>` },
    { num: 3, label: "Hasil & Unduh", color: "bg-green-300", ringColor: "text-green-400", icon: `<svg class="w-5 h-5 step-icon" viewBox="0 0 20 20" fill="none"><path d="M6 10l3 3 5-6" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="10" cy="10" r="8" stroke="#1e293b" stroke-width="2"/></svg>` },
  ];

  let html = '<div class="step-group flex items-center">';
  steps.forEach((s, i) => {
    const isActive = step >= s.num;
    const isCurrent = step === s.num;
    const isCompleted = step > s.num;

    const dotClasses = [
      'step-dot',
      'w-12 h-12 rounded-full flex items-center justify-center border-4 border-slate-800 font-bold text-lg',
      isActive ? `${s.color} text-slate-800 shadow-[3px_3px_0px_0px_#1e293b]` : 'bg-white/80 text-slate-400',
      isCurrent ? `current active ${s.ringColor}` : '',
      isCompleted ? 'completed' : '',
    ].join(' ');

    const labelClasses = [
      'step-label',
      isActive ? 'active-label text-slate-800' : 'text-slate-400',
      isCurrent ? 'current-label' : '',
    ].join(' ');

    html += `
      <div class="step-item">
        <div class="${dotClasses}" style="animation-delay: ${i * 0.12}s">
          ${isActive ? s.icon : `<span class="step-num">${s.num}</span>`}
        </div>
        <span class="${labelClasses}">${s.label}</span>
      </div>
    `;

    if (i < steps.length - 1) {
      const filled = step > s.num;
      html += `
        <div class="step-connector ${filled ? 'filled' : ''} w-10 sm:w-20 h-2 bg-slate-200 mx-3 sm:mx-5 rounded-full border-2 border-slate-800/10" style="transition-delay: ${i * 0.15}s">
          <div class="step-connector-fill rounded-full" style="transition-delay: ${i * 0.2}s"></div>
        </div>
      `;
    }
  });
  html += '</div>';
  indicator.innerHTML = html;
}

// =====================
// Step Navigation
// =====================
function changeStep(newStep) {
  SFX.step();
  step = newStep;

  document.getElementById("step-1-container").classList.toggle("hidden", step !== 1);
  document.getElementById("step-1-container").classList.toggle("block", step === 1);

  document.getElementById("step-2-container").classList.toggle("hidden", step !== 2);
  document.getElementById("step-2-container").classList.toggle("block", step === 2);

  document.getElementById("step-3-container").classList.toggle("hidden", step !== 3);
  document.getElementById("step-3-container").classList.toggle("block", step === 3);

  renderStepIndicator();
  lucide.createIcons();
}

function resetToUpload() {
  selectedFiles = [];
  extractedResults = [];
  document.getElementById("file-input").value = "";
  changeStep(1);
}

// Expose to global scope for onclick handlers in HTML
window.resetToUpload = resetToUpload;
window.processFiles = processFiles;
window.downloadExcel = downloadExcel;
window.copyToClipboard = copyToClipboard;
window.removeFile = removeFile;

// =====================
// File Upload Handling
// =====================
function initDropZone() {
  const dropZone = document.getElementById("drop-zone");
  const fileInput = document.getElementById("file-input");

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("drag-over");
  });

  dropZone.addEventListener("dragleave", () => {
    dropZone.classList.remove("drag-over");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("drag-over");
    const files = Array.from(e.dataTransfer.files).filter((f) =>
      f.name.toLowerCase().endsWith(".pdf")
    );
    if (files.length > 0) {
      selectedFiles = files;
      SFX.upload();
      changeStep(2);
      renderFileList();
    } else {
      showToast("Hanya file PDF yang diterima.", "warning");
    }
  });

  fileInput.addEventListener("change", (e) => {
    const files = Array.from(e.target.files).filter((f) =>
      f.name.toLowerCase().endsWith(".pdf")
    );
    if (files.length > 0) {
      selectedFiles = files;
      SFX.upload();
      changeStep(2);
      renderFileList();
    }
  });
}

// =====================
// File List (Step 2)
// =====================
function renderFileList() {
  const countEl = document.getElementById("file-count");
  countEl.innerText = `${selectedFiles.length} File`;
  countEl.classList.add('pulse');
  setTimeout(() => countEl.classList.remove('pulse'), 400);

  const list = document.getElementById("file-list");
  list.innerHTML = selectedFiles
    .map((file, idx) => {
      const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return `
      <div class="file-item flex items-center justify-between p-4 bg-white/80 backdrop-blur-sm border-4 border-slate-800 rounded-2xl shadow-[4px_4px_0px_0px_#1e293b]" style="animation-delay: ${idx * 60}ms">
        <div class="flex items-center overflow-hidden">
          <div class="w-10 h-10 bg-sky-200 border-2 border-slate-800 rounded-full flex items-center justify-center mr-3 shrink-0">
            <svg class="w-5 h-5" viewBox="0 0 20 20" fill="none"><rect x="3" y="2" width="10" height="14" rx="2" stroke="#1e293b" stroke-width="2" fill="#e0f2fe"/><path d="M13 2v4h4" stroke="#1e293b" stroke-width="2" stroke-linecap="round"/><rect x="3" y="2" width="14" height="16" rx="2" stroke="#1e293b" stroke-width="2" fill="none"/><path d="M7 10h6M7 13h4" stroke="#1e293b" stroke-width="1.5" stroke-linecap="round"/></svg>
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-bold text-slate-800 truncate">${file.name}</p>
            <p class="text-xs font-bold text-slate-500 mt-1">${sizeMB} MB</p>
          </div>
        </div>
        <button onclick="removeFile(${idx})" class="file-remove-btn w-8 h-8 bg-white border-2 border-slate-800 rounded-lg flex items-center justify-center text-slate-800 ml-2 shrink-0">
          <i data-lucide="x" class="w-4 h-4 stroke-[3]"></i>
        </button>
      </div>
    `;
    })
    .join("");
  lucide.createIcons();
}

function removeFile(idx) {
  SFX.remove();
  selectedFiles = selectedFiles.filter((_, i) => i !== idx);
  if (selectedFiles.length === 0) {
    resetToUpload();
  } else {
    renderFileList();
  }
}

// =====================
// Process Files (Client-Side)
// =====================
async function processFiles() {
  if (selectedFiles.length === 0) return;

  const btnProcess = document.getElementById("btn-process");
  const statusDiv = document.getElementById("processing-status");
  const statusText = document.getElementById("processing-text");
  const statusDetail = document.getElementById("processing-detail");
  const progressBar = document.getElementById("processing-bar");

  btnProcess.disabled = true;
  btnProcess.classList.add("opacity-50", "cursor-not-allowed");
  statusDiv.classList.remove("hidden");
  if (progressBar) progressBar.style.width = "0%";
  SFX.processStart();

  extractedResults = [];
  const total = selectedFiles.length;

  // Pre-load PDF.js
  try {
    await loadPdfJs();
  } catch (e) {
    showToast("Gagal memuat library PDF.js. Periksa koneksi internet.", "error", 6000);
    statusDiv.classList.add("hidden");
    btnProcess.disabled = false;
    btnProcess.classList.remove("opacity-50", "cursor-not-allowed");
    return;
  }

  for (let i = 0; i < total; i++) {
    statusText.innerText = `Memproses: ${selectedFiles[i].name}`;
    statusDetail.innerText = `${i} dari ${total} selesai`;
    if (progressBar) progressBar.style.width = `${((i) / total) * 100}%`;

    try {
      const text = await extractTextFromPdf(selectedFiles[i]);

      if (!text.trim()) {
        extractedResults.push({
          filename: selectedFiles[i].name,
          error: "Tidak ada teks yang dapat diekstrak dari PDF ini.",
        });
        continue;
      }

      const data = extractDataFromText(text);
      SFX.tick();

      const hasData = Object.values(data).some((v) => v !== "");
      if (!hasData) {
        extractedResults.push({
          filename: selectedFiles[i].name,
          data: data,
          error: "Tidak ada data BD yang ditemukan. Format PDF mungkin berbeda.",
        });
      } else {
        extractedResults.push({
          filename: selectedFiles[i].name,
          data: data,
        });
      }
    } catch (e) {
      extractedResults.push({
        filename: selectedFiles[i].name,
        error: `Gagal membaca PDF: ${e.message}`,
      });
    }
  }

  if (progressBar) progressBar.style.width = "100%";
  statusDetail.innerText = `${total} dari ${total} selesai`;

  // Short delay so the user sees 100%
  await new Promise(r => setTimeout(r, 400));

  statusDiv.classList.add("hidden");
  btnProcess.disabled = false;
  btnProcess.classList.remove("opacity-50", "cursor-not-allowed");

  const successCount = extractedResults.filter((r) => r.data && !r.error).length;
  if (successCount > 0) {
    SFX.success();
    Confetti.burst(100);
    showToast(`${successCount} dari ${total} dokumen berhasil diproses`, "success");
  } else {
    SFX.error();
    showToast("Tidak ada data yang berhasil diekstrak.", "error");
  }

  changeStep(3);
  renderResultsTable();
}

// =====================
// Results Table (Step 3)
// =====================
function renderResultsTable() {
  const keys = Object.keys(COLUMN_LABELS);
  const successCount = extractedResults.filter((r) => r.data && !r.error).length;

  document.getElementById("summary-text").innerText =
    `${successCount} dari ${extractedResults.length} dokumen berhasil diekstrak`;

  // Headers
  const headers = document.getElementById("table-headers");
  headers.innerHTML =
    `<th class="p-4 whitespace-nowrap border-r-4 border-slate-800">No</th>` +
    `<th class="p-4 whitespace-nowrap border-r-4 border-slate-800">Sumber File</th>` +
    keys
      .map(
        (k) =>
          `<th class="p-4 whitespace-nowrap border-r-4 border-slate-800">${COLUMN_LABELS[k]}</th>`
      )
      .join("") +
    `<th class="p-4 whitespace-nowrap text-center">Status</th>`;

  // Body
  const tbody = document.getElementById("table-body");
  tbody.innerHTML = extractedResults
    .map((result, idx) => {
      const hasError = !!result.error && !result.data;
      let rowHtml = `
      <tr class="hover:bg-sky-50 transition-colors">
        <td class="p-4 text-sm text-center border-r-4 border-slate-800">${idx + 1}</td>
        <td class="p-4 text-sm text-slate-800 border-r-4 border-slate-800">
          <div class="flex items-center">
            <div class="w-6 h-6 bg-sky-200 border-2 border-slate-800 rounded-full flex items-center justify-center mr-3 shrink-0">
              <i data-lucide="file-text" class="w-3 h-3 text-slate-800"></i>
            </div>
            <span class="truncate max-w-[200px]">${result.filename}</span>
          </div>
        </td>
    `;

      keys.forEach((key) => {
        const value = hasError ? null : result.data?.[key];
        if (value) {
          rowHtml += `<td class="p-4 text-sm border-r-4 border-slate-800">${value}</td>`;
        } else {
          rowHtml += `
          <td class="p-4 text-sm border-r-4 border-slate-800">
            <span class="text-slate-800 bg-rose-200 px-2 py-1 rounded-lg text-xs font-bold border-2 border-slate-800">
              ${hasError ? "Error" : "Kosong"}
            </span>
          </td>`;
        }
      });

      const isSuccess = result.data && !result.error;
      rowHtml += `
        <td class="p-4 text-center">
          ${
            isSuccess
              ? `<span class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-green-300 text-slate-800 border-2 border-slate-800">
                  <i data-lucide="check-circle" class="w-3.5 h-3.5 mr-1.5 stroke-[3]"></i> Berhasil
                 </span>`
              : `<span class="inline-flex items-center px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-300 text-slate-800 border-2 border-slate-800" title="${result.error || ''}">
                  <i data-lucide="alert-circle" class="w-3.5 h-3.5 mr-1.5 stroke-[3]"></i> Gagal
                 </span>`
          }
        </td>
      </tr>`;
      return rowHtml;
    })
    .join("");

  lucide.createIcons();
}

// =====================
// Copy to Clipboard (tab-separated for spreadsheet paste)
// =====================
function copyToClipboard() {
  if (extractedResults.length === 0) return;

  const keys = Object.keys(COLUMN_MAP);
  const lines = extractedResults.map((result) => {
    const cells = [];
    keys.forEach((k) => cells.push(result.data?.[k] || ""));
    return cells.join("\t");
  });

  const text = lines.join("\n");
  const btn = document.getElementById("btn-copy");

  navigator.clipboard.writeText(text).then(() => {
    SFX.copy();
    btn.classList.add("success-flash");
    setTimeout(() => btn.classList.remove("success-flash"), 500);
    showToast("Data berhasil di-copy! Silakan paste di Excel.", "success");
  }).catch(() => {
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    SFX.copy();
    btn.classList.add("success-flash");
    setTimeout(() => btn.classList.remove("success-flash"), 500);
    showToast("Data berhasil di-copy! Silakan paste di Excel.", "success");
  });
}

// =====================
// Download Excel (SheetJS)
// =====================
function downloadExcel() {
  if (extractedResults.length === 0) return;

  const keys = Object.keys(COLUMN_MAP);
  const wb = XLSX.utils.book_new();

  // Build rows: Column A = No, B-F = data fields
  const wsData = [];

  // Header row
  const headerRow = ["No"];
  keys.forEach((k) => headerRow.push(COLUMN_LABELS[k]));
  wsData.push(headerRow);

  // Data rows
  extractedResults.forEach((result, idx) => {
    const row = [idx + 1];
    keys.forEach((k) => {
      row.push(result.data?.[k] || "");
    });
    wsData.push(row);
  });

  const ws = XLSX.utils.aoa_to_sheet(wsData);

  // Set column widths
  ws["!cols"] = [
    { wch: 5 },  // A: No
    { wch: 40 }, // B: Unit Kerja
    { wch: 25 }, // C: Nomor Nota Dinas
    { wch: 22 }, // D: Tanggal Nota Dinas
    { wch: 30 }, // E: Informasi BD
    { wch: 22 }, // F: Tanggal Pembuatan BD
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Data BD");

  const now = new Date();
  const dateStr = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  XLSX.writeFile(wb, `Data_BD_${dateStr}.xlsx`);
  SFX.download();
  const btn = document.getElementById("btn-download");
  btn.classList.add("success-flash");
  setTimeout(() => btn.classList.remove("success-flash"), 500);
  showToast("File Excel berhasil diunduh!", "success");
}

// =====================
// Init
// =====================
// =====================
// Interactive Button Ripple & Bounce
// =====================
function initButtonEffects() {
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.btn-neo');
    if (!btn) return;

    // Create ripple from click position
    const rect = btn.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 2;
    const ripple = document.createElement('span');
    ripple.className = 'btn-ripple';
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
    btn.appendChild(ripple);
    ripple.addEventListener('animationend', () => ripple.remove());

    // Bounce-back after press
    btn.classList.remove('btn-bounce');
    void btn.offsetWidth; // force reflow
    btn.classList.add('btn-bounce');
    btn.addEventListener('animationend', function handler() {
      btn.classList.remove('btn-bounce');
      btn.removeEventListener('animationend', handler);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  Particles.init();
  Confetti.init();
  renderStepIndicator();
  initDropZone();
  initButtonEffects();
  lucide.createIcons();
});
