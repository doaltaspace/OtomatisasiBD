
// =====================
// Floating Particles Background
// =====================
const Particles = (() => {
  let canvas, ctx, particles = [], raf;
  let lastTime = 0;
  const COUNT = 35;
  const TARGET_FPS = 60;
  const TARGET_FRAME_MS = 1000 / TARGET_FPS;

  function init() {
    canvas = document.getElementById('particles-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resize();
    window.addEventListener('resize', resize);
    for (let i = 0; i < COUNT; i++) particles.push(createParticle());
    lastTime = performance.now();
    loop(lastTime);
  }

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  function createParticle() {
    const shapes = ['cross', 'pill', 'heart', 'drop', 'bandage'];
    const colors = ['#bae6fd', '#c4b5fd', '#a7f3d0', '#fde68a', '#fca5a5', '#7dd3fc'];
    return {
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: 4 + Math.random() * 6,
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
    ctx.lineWidth = 0.7;
    const s = p.size;

    if (p.shape === 'cross') {
      // Medical cross
      const w = s * 0.38;
      ctx.beginPath();
      ctx.roundRect(-w, -s, w * 2, s * 2, 1.5);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.roundRect(-s, -w, s * 2, w * 2, 1.5);
      ctx.fill(); ctx.stroke();
    } else if (p.shape === 'pill') {
      // Capsule
      ctx.beginPath();
      ctx.ellipse(0, 0, s * 1.3, s * 0.55, 0, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.55);
      ctx.lineTo(0, s * 0.55);
      ctx.strokeStyle = p.color;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    } else if (p.shape === 'heart') {
      // Small heart
      ctx.beginPath();
      const hs = s * 0.6;
      ctx.moveTo(0, hs);
      ctx.bezierCurveTo(-hs * 1.5, 0, -hs * 1.5, -hs, 0, -hs * 0.4);
      ctx.bezierCurveTo(hs * 1.5, -hs, hs * 1.5, 0, 0, hs);
      ctx.fill(); ctx.stroke();
    } else if (p.shape === 'drop') {
      // Water/blood drop
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.bezierCurveTo(s * 0.8, -s * 0.2, s * 0.7, s * 0.6, 0, s * 0.8);
      ctx.bezierCurveTo(-s * 0.7, s * 0.6, -s * 0.8, -s * 0.2, 0, -s);
      ctx.fill(); ctx.stroke();
    } else {
      // Bandage (rounded rectangle with dots)
      ctx.beginPath();
      ctx.roundRect(-s * 1.2, -s * 0.45, s * 2.4, s * 0.9, s * 0.3);
      ctx.fill(); ctx.stroke();
      ctx.fillStyle = '#1e293b';
      ctx.globalAlpha = p.opacity * 0.5;
      ctx.beginPath();
      ctx.arc(-s * 0.25, 0, 1, 0, Math.PI * 2);
      ctx.arc(s * 0.25, 0, 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  function loop(now) {
    const elapsed = now - lastTime;
    lastTime = now;
    // delta multiplier: 1.0 at 60fps, 0.5 at 120fps, 2.0 at 30fps, etc.
    // Clamped to avoid jumps when tab regains focus after being hidden
    const dt = Math.min(elapsed / TARGET_FRAME_MS, 3);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.speedX * dt;
      p.y += p.speedY * dt;
      p.rotation += p.rotSpeed * dt;
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
  let lastTime = 0;
  const TARGET_FPS = 60;
  const TARGET_FRAME_MS = 1000 / TARGET_FPS;

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
    if (!running) { running = true; lastTime = performance.now(); loop(lastTime); }
  }

  function loop(now) {
    const elapsed = now - lastTime;
    lastTime = now;
    // delta multiplier: 1.0 at 60fps, 0.5 at 120fps, etc.
    // Clamped to avoid jumps when tab regains focus
    const dt = Math.min(elapsed / TARGET_FRAME_MS, 3);

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces = pieces.filter(p => p.life > 0);
    if (pieces.length === 0) { running = false; return; }
    pieces.forEach(p => {
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.18 * dt; // gravity
      p.rotation += p.rotSpeed * dt;
      p.life -= p.decay * dt;
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

  // Rich layered note with harmonics and smooth envelope
  function note(freq, duration, vol = 0.12, type = "sine", detune = 0) {
    const c = getCtx();
    const t = c.currentTime;
    const osc = c.createOscillator();
    const gain = c.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t);
    if (detune) osc.detune.setValueAtTime(detune, t);
    // Smooth attack-decay envelope
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(vol, t + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
    osc.connect(gain);
    gain.connect(c.destination);
    osc.start(t);
    osc.stop(t + duration);
  }

  // Chord — multiple frequencies at once for a richer sound
  function chord(freqs, duration, vol = 0.08, type = "sine") {
    freqs.forEach((f, i) => note(f, duration, vol, type, i * 3));
  }

  // Arpeggio — notes with stagger for elegant cascading effect
  function arp(freqs, noteDur, stagger, vol = 0.1, type = "sine") {
    const c = getCtx();
    const base = c.currentTime;
    freqs.forEach((freq, i) => {
      const t = base + i * stagger;
      const osc = c.createOscillator();
      const gain = c.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, t);
      osc.detune.setValueAtTime(i * 2, t);
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(vol, t + 0.01);
      gain.gain.setValueAtTime(vol * 0.9, t + noteDur * 0.3);
      gain.gain.exponentialRampToValueAtTime(0.001, t + noteDur);
      osc.connect(gain);
      gain.connect(c.destination);
      osc.start(t);
      osc.stop(t + noteDur);
    });
  }

  // Soft "pop" with noise burst — modern UI feel
  function pop(vol = 0.1) {
    const c = getCtx();
    const t = c.currentTime;
    // Pitched pop
    const osc = c.createOscillator();
    const g = c.createGain();
    osc.frequency.setValueAtTime(1200, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.06);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    osc.connect(g);
    g.connect(c.destination);
    osc.start(t);
    osc.stop(t + 0.08);
  }

  return {
    // Upload: bright rising arpeggio (C5 → E5 → G5 → C6) — celebratory
    upload() { arp([523, 659, 784, 1047], 0.18, 0.06, 0.09); },

    // Remove: quick soft downward pop
    remove() { pop(0.07); },

    // Step change: gentle two-note chime
    step() { arp([698, 880], 0.15, 0.05, 0.08); },

    // Process start: anticipation build — rising chord
    processStart() { chord([440, 554, 659], 0.3, 0.06); arp([659, 880, 1047], 0.2, 0.08, 0.07); },

    // Tick: subtle crisp click — not a boring beep
    tick() { pop(0.06); },

    // Success: satisfying major chord bloom + sparkle arp
    success() {
      chord([523, 659, 784], 0.4, 0.07);
      setTimeout(() => arp([784, 988, 1175, 1568], 0.25, 0.07, 0.06), 150);
    },

    // Error: soft low minor chord — not harsh
    error() { chord([220, 262, 330], 0.35, 0.06, "triangle"); },

    // Warning: gentle two-tone nudge
    warning() { arp([440, 349], 0.2, 0.1, 0.07, "triangle"); },

    // Copy: crisp double tap
    copy() { pop(0.08); setTimeout(() => pop(0.06), 80); },

    // Download: cascading descent — feels like "saving"
    download() { arp([1047, 880, 698, 523], 0.2, 0.06, 0.08); },

    // Info: single clean chime
    info() { note(880, 0.2, 0.08); },
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

  // Diagnostics: reasons when a field is empty
  const diagnostics = {};

  // 1. UNIT_KERJA: value after "Untuk Keperluan" label
  const unitKerjaMatch = normalized.match(
    /Untuk\s+Keperluan\s*:?\s*(.+?)(?=\s*Distribusi\s+Ke|$)/i
  );
  if (unitKerjaMatch) {
    result.UNIT_KERJA = unitKerjaMatch[1].trim();
  } else {
    const hasLabel = /Untuk\s+Keperluan/i.test(normalized);
    diagnostics.UNIT_KERJA = hasLabel
      ? 'Label "Untuk Keperluan" ditemukan, tapi teks setelahnya tidak terbaca — kemungkinan format PDF berbeda atau terpotong.'
      : 'Label "Untuk Keperluan" tidak ditemukan — PDF bukan format Bukti Distribusi standar atau teks gagal diekstrak.';
  }

  // 2. NOMOR_NOTA_DINAS: B/ND-... pattern ending with year
  const notaDinasMatch = normalized.match(
    /B\s*\/\s*ND[\s\-]*[\w\-\/\s]*?\/\s*\d{4}/i
  );
  if (notaDinasMatch) {
    result.NOMOR_NOTA_DINAS = notaDinasMatch[0]
      .replace(/\s*\/\s*/g, "/")
      .replace(/\s*-\s*/g, "-")
      .replace(/\s+/g, "")
      .trim();
  } else {
    const hasKeterangan = /Keterangan/i.test(normalized);
    const hasBND = /B\s*\/\s*ND/i.test(normalized);
    if (!hasKeterangan) {
      diagnostics.NOMOR_NOTA_DINAS = 'Bagian "Keterangan" tidak ditemukan — PDF bukan format BD standar.';
    } else if (!hasBND) {
      diagnostics.NOMOR_NOTA_DINAS = 'Bagian "Keterangan" ada, tapi pola "B/ND-..." tidak ditemukan — format nomor mungkin berbeda.';
    } else {
      diagnostics.NOMOR_NOTA_DINAS = 'Pola "B/ND" ditemukan tapi tidak diakhiri tahun (4 digit) — teks terpotong atau format tidak standar.';
    }
  }

  // 3. TANGGAL_NOTA_DINAS: date after "Tgl" / "Tanggal" in Keterangan section
  //    Supports: "Tgl DD NamaBulan [TA] YYYY", "Tgl DD-MM-YYYY",
  //    or fallback: "B/ND.../YYYY, DD NamaBulan YYYY" (no Tgl prefix)
  const tglNotaMatch = normalized.match(
    /(?:Tanggal|Tgl)\.?\s*,?\s*(\d{1,2}\s+[A-Za-z]+\s+(?:TA\s+)?\d{4})/i
  );
  const tglNotaNumericMatch = !tglNotaMatch && normalized.match(
    /(?:Tanggal|Tgl)\.?\s*,?\s*(\d{1,2})\s*[-\/]\s*(\d{1,2})\s*[-\/]\s*(\d{4})/i
  );
  // Fallback: date after B/ND number + comma (no "Tgl"/"Tanggal" prefix)
  const tglNotaAfterBND = !tglNotaMatch && !tglNotaNumericMatch && normalized.match(
    /B\s*\/\s*ND[\s\-]*[\w\-\/\s]*?\/\s*\d{4}\s*,\s*(\d{1,2}\s+[A-Za-z]+\s+(?:TA\s+)?\d{4})/i
  );
  // Fallback: any "DD MonthName [TA] YYYY" date inside Keterangan line only
  // Uses "Mengetahui" as boundary to avoid capturing dates from signature block
  const tglNotaInKeterangan = !tglNotaMatch && !tglNotaNumericMatch && !tglNotaAfterBND && normalized.match(
    /Keterangan\s*:(?:(?!Mengetahui).)*?(\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|January|February|March|April|May|June|July|August|September|October|November|December)\s+(?:TA\s+)?\d{4})/i
  );
  if (tglNotaMatch) {
    // Strip "TA " (Tahun Anggaran) if present before the year
    const cleanedDate = tglNotaMatch[1].replace(/\bTA\s+/i, '').trim();
    result.TANGGAL_NOTA_DINAS = normalizeDateMonth(cleanedDate);
  } else if (tglNotaNumericMatch) {
    const [, day, month, year] = tglNotaNumericMatch;
    const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"];
    const monthIdx = parseInt(month, 10) - 1;
    if (monthIdx >= 0 && monthIdx < 12) {
      result.TANGGAL_NOTA_DINAS = `${parseInt(day, 10)} ${monthNames[monthIdx]} ${year}`;
    } else {
      result.TANGGAL_NOTA_DINAS = `${day}-${month}-${year}`;
    }
  } else if (tglNotaAfterBND) {
    const cleanedDate = tglNotaAfterBND[1].replace(/\bTA\s+/i, '').trim();
    result.TANGGAL_NOTA_DINAS = normalizeDateMonth(cleanedDate);
  } else if (tglNotaInKeterangan) {
    const cleanedDate = tglNotaInKeterangan[1].replace(/\bTA\s+/i, '').trim();
    result.TANGGAL_NOTA_DINAS = normalizeDateMonth(cleanedDate);
  } else {
    const hasKeterangan = /Keterangan/i.test(normalized);
    if (!hasKeterangan) {
      diagnostics.TANGGAL_NOTA_DINAS = 'Bagian "Keterangan" tidak ditemukan — tidak bisa mengambil tanggal nota dinas.';
    } else {
      // Check if there's only a B/ND number without any date
      const hasBNDOnly = /Keterangan\s*:\s*B\s*\/\s*ND/i.test(normalized);
      if (hasBNDOnly) {
        diagnostics.TANGGAL_NOTA_DINAS = 'Bagian "Keterangan" hanya berisi nomor nota dinas (B/ND) tanpa tanggal — tanggal nota dinas tidak dicantumkan di dokumen ini.';
      } else {
        diagnostics.TANGGAL_NOTA_DINAS = 'Bagian "Keterangan" ada, tapi tidak ada tanggal yang cocok — format mungkin: tanpa "Tgl", tanpa koma, atau tanggal tidak standar.';
      }
    }
  }

  // 4. INFORMASI_BD: value after "Jenis Al Um" label
  const infoBDMatch = normalized.match(
    /Jenis\s+Al\s*\.?\s*Um\s*:?\s*(.+?)(?=\s*Untuk\s+Keperluan|$)/i
  );
  if (infoBDMatch) {
    result.INFORMASI_BD = infoBDMatch[1].trim();
  } else {
    const hasLabel = /Jenis\s+Al/i.test(normalized);
    diagnostics.INFORMASI_BD = hasLabel
      ? 'Label "Jenis Al Um" ditemukan, tapi teks setelahnya tidak terbaca — kemungkinan format berbeda.'
      : 'Label "Jenis Al Um" tidak ditemukan — PDF bukan format Bukti Distribusi standar.';
  }

  // 5. TANGGAL_PEMBUATAN_BD: date in signature block (city, DD Month YYYY)
  const tglBDMatch = normalized.match(
    /(?:Jakarta|Bandung|Surabaya|Semarang|Medan|Makassar|Yogyakarta|Denpasar|Palembang|Pontianak)\s*,\s*(\d{1,2}\s+(?:Januari|Februari|Maret|April|Mei|Juni|Juli|Agustus|September|Oktober|November|Desember|January|February|March|April|May|June|July|August|September|October|November|December)\s+\d{4})/i
  );
  if (tglBDMatch) {
    result.TANGGAL_PEMBUATAN_BD = convertMonthToIndonesian(tglBDMatch[1].trim());
  } else {
    const hasCity = /(?:Jakarta|Bandung|Surabaya|Semarang|Medan|Makassar|Yogyakarta|Denpasar|Palembang|Pontianak)/i.test(normalized);
    if (!hasCity) {
      diagnostics.TANGGAL_PEMBUATAN_BD = 'Nama kota (Jakarta, Bandung, dll) tidak ditemukan di blok tanda tangan — kota belum didukung atau format berbeda.';
    } else {
      diagnostics.TANGGAL_PEMBUATAN_BD = 'Nama kota ditemukan, tapi tanggal setelahnya tidak cocok pola "DD NamaBulan YYYY" — bulan salah eja atau format berbeda.';
    }
  }

  return { result, diagnostics };
}

// Normalize date string: fix typos in month names (e.g. "Desemebr" → "Desember")
function normalizeDateMonth(dateStr) {
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember",
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  // Extract the month word from the date string (between day number and year)
  const parts = dateStr.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (!parts) return dateStr;

  const [, day, rawMonth, year] = parts;
  const lower = rawMonth.toLowerCase();

  // Try exact match first
  const exact = months.find(m => m.toLowerCase() === lower);
  if (exact) return convertMonthToIndonesian(`${day} ${exact} ${year}`);

  // Fuzzy match: find closest month by Levenshtein distance
  let bestMatch = rawMonth;
  let bestDist = Infinity;
  for (const m of months) {
    const d = levenshtein(lower, m.toLowerCase());
    if (d < bestDist) {
      bestDist = d;
      bestMatch = m;
    }
  }
  // Accept fuzzy match if distance is reasonable (max 3 edits)
  if (bestDist <= 3) {
    return convertMonthToIndonesian(`${day} ${bestMatch} ${year}`);
  }
  return dateStr;
}

// Simple Levenshtein distance
function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
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
function showToast(message, type = "info", duration = 3000) {
  const container = document.getElementById("toast-container");

  // Limit visible toasts to 3 — dismiss oldest if over limit
  const existing = container.querySelectorAll('.toast:not(.toast-out)');
  if (existing.length >= 3) {
    existing[0].classList.add('toast-out');
    setTimeout(() => existing[0].remove(), 250);
  }

  const colors = {
    success: "bg-green-100/95 border-green-400",
    error:   "bg-rose-100/95 border-rose-400",
    info:    "bg-sky-100/95 border-sky-400",
    warning: "bg-amber-100/95 border-amber-400",
  };
  const icons = {
    success: "check-circle",
    error:   "alert-circle",
    info:    "info",
    warning: "alert-triangle",
  };

  const toast = document.createElement("div");
  toast.className = `toast relative flex items-center gap-2.5 px-4 py-2.5 rounded-lg border-2 ${colors[type]} shadow-sm font-semibold text-sm text-slate-700 max-w-xs overflow-hidden`;
  toast.style.setProperty('--toast-duration', duration + 'ms');
  toast.innerHTML = `<i data-lucide="${icons[type]}" class="w-4 h-4 shrink-0 stroke-[2.5]"></i><span>${message}</span><div class="toast-progress"></div>`;
  container.appendChild(toast);
  lucide.createIcons({ nodes: [toast] });

  setTimeout(() => {
    toast.classList.add("toast-out");
    setTimeout(() => toast.remove(), 250);
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
window.showEmptyFieldsModal = showEmptyFieldsModal;
window.closeEmptyFieldsModal = closeEmptyFieldsModal;

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
  const percentEl = document.getElementById("processing-percent");
  const tipEl = document.getElementById("processing-tip");

  btnProcess.disabled = true;
  btnProcess.classList.add("opacity-50", "cursor-not-allowed");
  statusDiv.classList.remove("hidden");
  if (progressBar) progressBar.style.width = "0%";
  if (percentEl) percentEl.textContent = "0%";
  SFX.processStart();

  // Cycling tips
  const tips = [
    "Mengekstrak data dari dokumen PDF...",
    "Dokumen sedang dipindai satu per satu",
    "Mengidentifikasi pola data dalam dokumen",
    "Memproses teks dan format tanggal",
    "Mencocokkan data dengan template BD",
    "Setiap halaman diperiksa dengan teliti",
    "Data diekstrak langsung di browser Anda",
    "Tidak ada data yang dikirim ke server",
  ];
  let tipIdx = 0;
  const tipInterval = setInterval(() => {
    tipIdx = (tipIdx + 1) % tips.length;
    if (tipEl) {
      tipEl.style.opacity = '0';
      setTimeout(() => {
        tipEl.textContent = tips[tipIdx];
        tipEl.style.opacity = '1';
      }, 300);
    }
  }, 3500);

  extractedResults = [];
  const total = selectedFiles.length;

  // Pre-load PDF.js
  try {
    await loadPdfJs();
  } catch (e) {
    clearInterval(tipInterval);
    showToast("Gagal memuat library PDF.js. Periksa koneksi internet.", "error", 6000);
    statusDiv.classList.add("hidden");
    btnProcess.disabled = false;
    btnProcess.classList.remove("opacity-50", "cursor-not-allowed");
    return;
  }

  for (let i = 0; i < total; i++) {
    statusText.innerText = `Memproses: ${selectedFiles[i].name}`;
    statusDetail.innerText = `${i} dari ${total} selesai`;
    const pct = Math.round((i / total) * 100);
    if (progressBar) progressBar.style.width = `${pct}%`;
    if (percentEl) {
      percentEl.textContent = pct + '%';
    }

    try {
      const text = await extractTextFromPdf(selectedFiles[i]);

      if (!text.trim()) {
        extractedResults.push({
          filename: selectedFiles[i].name,
          error: "Tidak ada teks yang dapat diekstrak dari PDF ini.",
        });
        continue;
      }

      const { result: data, diagnostics } = extractDataFromText(text);
      // Only play tick sound every 10 files or on last file to avoid spam
      if (total <= 5 || i === total - 1 || (i + 1) % Math.max(1, Math.round(total / 10)) === 0) {
        SFX.tick();
      }

      const hasData = Object.values(data).some((v) => v !== "");
      if (!hasData) {
        extractedResults.push({
          filename: selectedFiles[i].name,
          data: data,
          diagnostics: diagnostics,
          error: "Tidak ada data BD yang ditemukan. Format PDF mungkin berbeda.",
        });
      } else {
        extractedResults.push({
          filename: selectedFiles[i].name,
          data: data,
          diagnostics: diagnostics,
        });
      }
    } catch (e) {
      extractedResults.push({
        filename: selectedFiles[i].name,
        error: `Gagal membaca PDF: ${e.message}`,
      });
    }
  }

  clearInterval(tipInterval);

  if (progressBar) progressBar.style.width = "100%";
  if (percentEl) percentEl.textContent = "100%";
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
// Empty Fields Check Modal
// =====================
function getEmptyFieldsReport() {
  const keys = Object.keys(COLUMN_LABELS);
  const report = [];

  extractedResults.forEach((result, idx) => {
    const emptyFields = [];
    if (result.error && !result.data) {
      emptyFields.push(...keys.map(k => ({
        label: COLUMN_LABELS[k],
        reason: 'PDF gagal diproses — ' + (result.error || 'error tidak diketahui'),
      })));
    } else if (result.data) {
      keys.forEach(k => {
        if (!result.data[k] || result.data[k].trim() === "") {
          emptyFields.push({
            label: COLUMN_LABELS[k],
            reason: (result.diagnostics && result.diagnostics[k]) || 'Pola data tidak ditemukan di teks PDF.',
          });
        }
      });
    }
    if (emptyFields.length > 0) {
      report.push({
        no: idx + 1,
        filename: result.filename,
        emptyFields: emptyFields,
        isError: !!result.error && !result.data,
      });
    }
  });

  return report;
}

function showEmptyFieldsModal() {
  const modal = document.getElementById('empty-fields-modal');
  const inner = document.getElementById('empty-fields-modal-inner');
  const content = document.getElementById('empty-fields-content');
  const summary = document.getElementById('empty-fields-summary');

  const report = getEmptyFieldsReport();
  const totalEmpty = report.length;
  const totalFields = report.reduce((sum, r) => sum + r.emptyFields.length, 0);

  if (totalEmpty === 0) {
    summary.textContent = 'Semua dokumen lengkap — tidak ada data kosong!';
    content.innerHTML = `
      <div class="text-center py-10">
        <div class="w-16 h-16 bg-green-200 border-4 border-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-[3px_3px_0px_0px_#1e293b]">
          <i data-lucide="check-circle" class="w-8 h-8 text-slate-800 stroke-[2.5]"></i>
        </div>
        <p class="text-lg font-bold text-slate-800">Semua Data Lengkap!</p>
        <p class="text-sm text-slate-500 font-medium mt-1">Tidak ditemukan kolom kosong pada semua dokumen.</p>
      </div>
    `;
    SFX.success();
  } else {
    summary.textContent = `${totalEmpty} dokumen bermasalah — total ${totalFields} kolom kosong`;
    SFX.warning();

    let html = '';
    report.forEach(item => {
      const fieldRows = item.emptyFields.map(f =>
        `<div class="flex items-start gap-2 mb-2 last:mb-0">
          <span class="inline-block bg-rose-200 text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg border-2 border-slate-800 shrink-0 mt-0.5">${f.label}</span>
          <span class="text-xs text-slate-600 font-medium leading-relaxed pt-0.5">${f.reason}</span>
        </div>`
      ).join('');

      html += `
        <div class="bg-white border-4 border-slate-800 rounded-2xl p-4 shadow-[3px_3px_0px_0px_#1e293b] empty-field-card">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center">
              <div class="w-8 h-8 ${item.isError ? 'bg-rose-300' : 'bg-amber-200'} border-2 border-slate-800 rounded-lg flex items-center justify-center mr-3 shrink-0">
                <span class="text-xs font-bold text-slate-800">${item.no}</span>
              </div>
              <div>
                <p class="text-sm font-bold text-slate-800">${item.filename}</p>
                <p class="text-xs font-medium text-slate-500 mt-0.5">${item.isError ? 'Gagal diproses' : item.emptyFields.length + ' kolom kosong'}</p>
              </div>
            </div>
            <span class="shrink-0 ${item.isError ? 'bg-rose-300' : 'bg-amber-300'} text-slate-800 text-xs font-bold px-2 py-1 rounded-lg border-2 border-slate-800">
              ${item.isError ? 'Error' : 'Incomplete'}
            </span>
          </div>
          <div class="bg-slate-50 rounded-xl p-3 border-2 border-slate-200">
            ${fieldRows}
          </div>
        </div>
      `;
    });
    content.innerHTML = html;
  }

  // Open modal
  modal.style.display = 'flex';
  requestAnimationFrame(() => {
    modal.classList.remove('opacity-0', 'pointer-events-none');
    inner.style.transform = 'scale(1)';
  });
  lucide.createIcons();
}

function closeEmptyFieldsModal() {
  const modal = document.getElementById('empty-fields-modal');
  const inner = document.getElementById('empty-fields-modal-inner');
  modal.classList.add('opacity-0', 'pointer-events-none');
  inner.style.transform = 'scale(0.9)';
  setTimeout(() => { modal.style.display = 'none'; }, 300);
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

// =====================
// Hidden Photo Easter Egg
// =====================
function initLucyModal() {
  const btn = document.getElementById('lucy-btn');
  const modal = document.getElementById('lucy-modal');
  const inner = document.getElementById('lucy-modal-inner');
  const closeBtn = document.getElementById('lucy-modal-close');
  const photo = document.getElementById('lucy-photo');
  const placeholder = document.getElementById('lucy-placeholder');
  if (!btn || !modal) return;

  // Try loading photo.jpg
  const img = new Image();
  img.onload = () => { photo.src = 'photo.jpg'; photo.classList.remove('hidden'); placeholder.classList.add('hidden'); };
  img.src = 'photo.jpg';

  function openModal() {
    modal.style.display = 'flex';
    requestAnimationFrame(() => {
      modal.classList.remove('opacity-0', 'pointer-events-none');
      inner.style.transform = 'scale(1)';
    });
  }
  function closeModal() {
    modal.classList.add('opacity-0', 'pointer-events-none');
    inner.style.transform = 'scale(0.9)';
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  }

  btn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeModal(); closeEmptyFieldsModal(); } });

  // Empty fields modal: click-outside and Escape
  const emptyModal = document.getElementById('empty-fields-modal');
  if (emptyModal) {
    emptyModal.addEventListener('click', (e) => { if (e.target === emptyModal) closeEmptyFieldsModal(); });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  Particles.init();
  Confetti.init();
  renderStepIndicator();
  initDropZone();
  initButtonEffects();
  initLucyModal();
  lucide.createIcons();
});
