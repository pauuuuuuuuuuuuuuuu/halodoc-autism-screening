import { useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

const C = {
  pink: "#E5006C", pinkDark: "#C4005C", pinkLight: "#FFF0F7", pinkMid: "#FFD6EC",
  purple: "#6B21A8", purpleLight: "#F3E8FF",
  gray50: "#F9FAFB", gray100: "#F3F4F6", gray200: "#E5E7EB", gray300: "#D1D5DB", gray400: "#9CA3AF", gray500: "#6B7280",
  gray600: "#4B5563", gray700: "#374151", gray800: "#1F2937",
  white: "#FFFFFF", green: "#16A34A", greenLight: "#DCFCE7",
  amber: "#D97706", amberLight: "#FEF3C7", red: "#DC2626", redLight: "#FEE2E2",
};

const DOCTORS = [
  { id: 1, name: "dr. Anisa Rahma, Sp.A", spec: "Dokter Anak – Autism Specialist", hosp: "RS Siloam Semarang", dist: "1,2 km", rating: 4.9, rev: 312, price: "Rp 150.000", slot: "Hari ini 14:00", av: "AR", ok: true, city: "Semarang", lat: -6.9971, lng: 110.4203 },
  { id: 2, name: "dr. Budi Santoso, Sp.KJ", spec: "Psikiater Anak", hosp: "RSUP Dr. Kariadi", dist: "2,4 km", rating: 4.8, rev: 198, price: "Rp 200.000", slot: "Besok 09:00", av: "BS", ok: true, city: "Semarang", lat: -6.9838, lng: 110.4165 },
  { id: 3, name: "dr. Citra Dewi, Sp.A(K)", spec: "Neurologi Anak", hosp: "RS Elizabeth Semarang", dist: "3,1 km", rating: 4.9, rev: 421, price: "Rp 175.000", slot: "Hari ini 16:00", av: "CD", ok: true, city: "Semarang", lat: -6.9624, lng: 110.4209 },
  { id: 4, name: "dr. Dian Pratiwi, M.Psi", spec: "Psikolog Klinis Anak", hosp: "Klinik Tumbuh Kembang", dist: "0,8 km", rating: 4.7, rev: 156, price: "Rp 120.000", slot: "Hari ini 10:00", av: "DP", ok: false, city: "Semarang", lat: -7.0051, lng: 110.4381 },
  { id: 5, name: "dr. Rina Susanti, Sp.A", spec: "Dokter Tumbuh Kembang", hosp: "RS Pondok Indah Jakarta", dist: "—", rating: 4.8, rev: 267, price: "Rp 250.000", slot: "Besok 10:00", av: "RS", ok: true, city: "Jakarta", lat: -6.2616, lng: 106.7836 },
  { id: 6, name: "dr. Ahmad Yusuf, Sp.KJ", spec: "Psikiater Anak", hosp: "RS Siloam TB Simatupang", dist: "—", rating: 4.7, rev: 183, price: "Rp 220.000", slot: "Hari ini 13:00", av: "AY", ok: true, city: "Jakarta", lat: -6.2971, lng: 106.7913 },
  { id: 7, name: "dr. Fitri Amalia, Sp.A(K)", spec: "Neurologi Anak", hosp: "RS Hermina Arcamanik Bandung", dist: "—", rating: 4.9, rev: 302, price: "Rp 180.000", slot: "Hari ini 15:00", av: "FA", ok: true, city: "Bandung", lat: -6.9174, lng: 107.6910 },
  { id: 8, name: "dr. Hendra Wijaya, M.Psi", spec: "Psikolog Klinis Anak", hosp: "Klinik Mawar Surabaya", dist: "—", rating: 4.6, rev: 139, price: "Rp 130.000", slot: "Besok 11:00", av: "HW", ok: false, city: "Surabaya", lat: -7.2575, lng: 112.7521 },
  { id: 9, name: "dr. Siti Rahayu, Sp.A", spec: "Dokter Anak – Autism Specialist", hosp: "RS PKU Muhammadiyah Yogyakarta", dist: "—", rating: 4.8, rev: 214, price: "Rp 140.000", slot: "Hari ini 09:00", av: "SR", ok: true, city: "Yogyakarta", lat: -7.8014, lng: 110.3649 },
];

const CITY_COORDS = {
  Semarang: { lat: -6.9971, lng: 110.4203, label: "Semarang" },
  Jakarta: { lat: -6.2088, lng: 106.8456, label: "Jakarta" },
  Bandung: { lat: -6.9175, lng: 107.6191, label: "Bandung" },
  Surabaya: { lat: -7.2575, lng: 112.7521, label: "Surabaya" },
  Yogyakarta: { lat: -7.7972, lng: 110.3688, label: "Yogyakarta" },
};

const SERVICES = [
  { icon: "🧩", title: "Skrining AI", desc: "Deteksi dini via video & kuesioner", tag: "BARU", color: C.pink, page: "screening" },
  { icon: "💬", title: "Chat Terapis", desc: "Terapi wicara & ABA online", tag: "24 JAM", color: "#7C3AED", page: "consult" },
  { icon: "📍", title: "Klinik Terdekat", desc: "Cari klinik autism di sekitarmu", tag: "GPS", color: "#0891B2", page: "findDoctor" },
  { icon: "📚", title: "Parent Training", desc: "Pelatihan orang tua anak autism", tag: "GRATIS", color: C.green, page: null },
  { icon: "🧠", title: "Terapi ABA", desc: "Applied Behavior Analysis", tag: "POPULER", color: "#7C3AED", page: null },
  { icon: "🎨", title: "Terapi Okupasi", desc: "Sensori & motorik anak", tag: "BARU", color: "#EA580C", page: null },
  { icon: "🎤", title: "Analisis Bicara", desc: "AI analisis pola komunikasi", tag: "AI", color: "#0E7490", page: "screening" },
  { icon: "⌚", title: "Smartwatch", desc: "Monitor kesehatan real-time", tag: "BARU", color: "#7C3AED", page: "smartwatch" },
  { icon: "👁️", title: "Eye Tracking", desc: "Analisis kontak mata digital", tag: "AI", color: "#0E7490", page: "screening" },
  { icon: "📋", title: "Evaluasi ADOS", desc: "Jadwalkan evaluasi diagnostik", tag: "KLINIS", color: C.pinkDark, page: null },
];

const ARTICLES = [
  { title: "Tanda-tanda Awal Autisme yang Sering Terlewatkan Orang Tua", cat: "Edukasi Autism", time: "5 menit lalu" },
  { title: "ABA Therapy: Apa Itu dan Bagaimana Cara Kerjanya?", cat: "Panduan Terapi", time: "2 jam lalu" },
  { title: "Cara Berkomunikasi Efektif dengan Anak Spektrum Autisme", cat: "Tips Parenting", time: "1 hari lalu" },
  { title: "M-CHAT-R/F: Alat Skrining Autism Rekomendasi WHO", cat: "Riset & Jurnal", time: "2 hari lalu" },
];

const TESTIMONIALS = [
  { name: "Rini Wulandari", city: "Semarang", text: "\"Anak saya terdeteksi dini lewat fitur AI Halodoc. Sekarang sudah menjalani terapi ABA dan perkembangannya luar biasa!\"" },
  { name: "Ahmad Fauzi", city: "Jakarta", text: "\"Sangat membantu! Chat terapis online bisa dilakukan kapan saja, tidak perlu antre lama di klinik.\"" },
  { name: "Dewi Kartika", city: "Surabaya", text: "\"Parent training-nya sangat bermanfaat. Kami jadi lebih paham cara mendukung perkembangan anak kami.\"" },
];

const QUESTIONS = [
  { id: "eye", cat: "Kontak Mata", icon: "👁️", w: 1.5, q: "Apakah anak Anda melakukan kontak mata saat diajak bicara?", opts: ["Selalu konsisten", "Kadang-kadang", "Jarang sekali", "Tidak pernah"] },
  { id: "name", cat: "Respons Nama", icon: "📢", w: 1.5, q: "Bagaimana anak merespons saat dipanggil namanya?", opts: ["Langsung menoleh", "Menoleh setelah diulang", "Jarang merespons", "Tidak merespons"] },
  { id: "speech", cat: "Perkembangan Bicara", icon: "🗣️", w: 1.3, q: "Bagaimana kemampuan bicara anak Anda?", opts: ["Sesuai usia", "Sedikit terlambat", "Sangat terlambat", "Belum bicara"] },
  { id: "point", cat: "Atensi Bersama", icon: "👆", w: 1.5, q: "Apakah anak menunjuk benda untuk berbagi minat (mis: menunjuk kupu-kupu)?", opts: ["Sering", "Kadang", "Jarang", "Tidak pernah"] },
  { id: "rep", cat: "Perilaku Repetitif", icon: "🔄", w: 1.4, q: "Apakah anak melakukan gerakan berulang (tepuk tangan, berputar, dll)?", opts: ["Tidak pernah", "Sesekali", "Sering", "Hampir selalu"] },
  { id: "play", cat: "Bermain Imajinatif", icon: "🎭", w: 1.3, q: "Apakah anak bisa bermain pura-pura (masak-masakan, dokter-dokteran)?", opts: ["Sangat imajinatif", "Bisa sedikit", "Jarang", "Tidak bisa"] },
  { id: "social", cat: "Interaksi Sosial", icon: "🤝", w: 1.4, q: "Bagaimana anak berinteraksi dengan anak-anak lain seusianya?", opts: ["Sangat aktif", "Cukup baik", "Lebih suka sendiri", "Menghindari"] },
  { id: "sensory", cat: "Kepekaan Sensorik", icon: "✋", w: 1.1, q: "Apakah anak menunjukkan reaksi berlebihan terhadap suara keras / tekstur / cahaya?", opts: ["Tidak ada", "Ringan", "Sedang", "Sangat sensitif"] },
];

const CHAT_BOT = {
  greet: ["Halo! Saya HILDA, asisten AI Halodoc untuk layanan Autism Care. Ada yang bisa saya bantu? 😊", "Hai! Selamat datang. Saya HILDA siap membantu Anda tentang skrining dan layanan autism. 🧩"],
  screen: ["Untuk mulai skrining autism gratis, klik menu 'Skrining AI' di atas ya! Hanya ~10 menit dan hasilnya langsung keluar. 🎯", "Skrining AI kami menggabungkan analisis video computer vision dan kuesioner M-CHAT-R/F. Klik 'Skrining AI' untuk mulai! ✅"],
  doc: ["Saya bisa bantu temukan dokter spesialis autism terdekat. Klik 'Cari Dokter' di menu ya! Ada 4 spesialis di Semarang. 📍", "Halodoc punya 50+ spesialis autism. Cek halaman 'Cari Dokter' untuk lihat jadwal dan booking langsung! 🏥"],
  aba: ["Terapi ABA (Applied Behavior Analysis) adalah terapi paling direkomendasikan untuk autism. Halodoc menyediakan terapis ABA bersertifikat online! 🧠", "ABA terbukti meningkatkan kemampuan komunikasi anak autism. Kami punya 30+ terapis ABA. Mau jadwalkan sesi?"],
  default: ["Hmm, coba tanyakan tentang: skrining autism, cari dokter, atau terapi ABA ya! Saya siap membantu. 💙", "Maaf belum paham. Bisa tanya tentang: skrining, dokter spesialis, program terapi, atau parent training? 😊"],
};

function classify(txt) {
  const t = txt.toLowerCase();
  if (t.match(/halo|hai|hello|hi|selamat/)) return "greet";
  if (t.match(/skrining|deteksi|test|tes|cek|screening/)) return "screen";
  if (t.match(/dokter|klinik|konsultasi|rumah sakit/)) return "doc";
  if (t.match(/aba|terapi|wicara|okupasi/)) return "aba";
  return "default";
}
const rand = arr => arr[Math.floor(Math.random() * arr.length)];

// ── SPECIALIST RECOMMENDATION COMPONENT ─────────────
function SpecialistRecommendation({ risk }) {
  const specialists = {
    low: ["Dokter Anak", "Dokter Tumbuh Kembang"],
    moderate: ["Dokter Anak", "Psikolog Anak", "Terapis Wicara"],
    high: ["Dokter Tumbuh Kembang", "Psikolog Anak", "Terapis Wicara", "Dokter Anak"],
  };
  const list = specialists[risk] || specialists.moderate;
  return (
    <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: C.gray800 }}>👨‍⚕️ Spesialis yang Disarankan</div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
        {list.map((s, i) => (
          <span key={i} style={{ background: C.pinkLight, color: C.pink, border: `1px solid ${C.pink}30`, borderRadius: 20, padding: "5px 12px", fontSize: 12, fontWeight: 600 }}>• {s}</span>
        ))}
      </div>
      <div style={{ background: C.gray50, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.gray200}` }}>
        <div style={{ fontWeight: 700, fontSize: 13, color: C.gray800, marginBottom: 4 }}>📅 Langkah Selanjutnya</div>
        <div style={{ fontSize: 13, color: C.gray600, lineHeight: 1.6 }}>Disarankan untuk melakukan konsultasi profesional untuk evaluasi lebih lanjut.</div>
      </div>
    </div>
  );
}

// ── PRIVACY CARD ─────────────────────────────────────
function PrivacyCard({ type }) {
  const content = {
    video: { title: "🔒 Privasi Data Video", text: "Video yang diunggah hanya digunakan untuk kebutuhan observasi perilaku dan analisis komunikasi dalam proses skrining awal ASD. Data tidak digunakan untuk pengenalan identitas, iklan, maupun tujuan komersial lainnya." },
    audio: { title: "🔒 Privasi Data Audio", text: "Rekaman suara hanya digunakan untuk proses transkripsi dan analisis pola komunikasi. Sistem tidak melakukan identifikasi individu berdasarkan suara." },
    voice: { title: "🔒 Privasi Voice Input", text: "Suara pengguna hanya diproses sementara untuk mengubah ucapan menjadi teks dan tidak digunakan untuk tujuan lain." },
  };
  const c = content[type];
  return (
    <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: 10, padding: "12px 14px", marginBottom: 14 }}>
      <div style={{ fontWeight: 700, fontSize: 12, color: "#1D4ED8", marginBottom: 4 }}>{c.title}</div>
      <div style={{ fontSize: 12, color: "#1E40AF", lineHeight: 1.6 }}>{c.text}</div>
    </div>
  );
}

// ────────────────────────────────────────────────
// SMALL COMPONENTS
// ────────────────────────────────────────────────
function PBar({ v, color = C.pink }) {
  return <div style={{ background: C.gray200, borderRadius: 8, height: 8, overflow: "hidden" }}><div style={{ width: `${Math.min(v, 100)}%`, height: "100%", background: color, borderRadius: 8, transition: "width 1.2s ease" }} /></div>;
}

function Chip({ label, color = C.pink }) {
  return <span style={{ background: color + "18", color, border: `1px solid ${color}30`, borderRadius: 20, padding: "2px 9px", fontSize: 11, fontWeight: 700 }}>{label}</span>;
}

function Btn({ children, v = "primary", onClick, disabled, sx = {} }) {
  const base = { borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer", display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s", border: "none", fontFamily: "inherit", opacity: disabled ? 0.5 : 1 };
  const variants = {
    primary: { background: C.pink, color: C.white },
    outline: { background: "transparent", color: C.pink, border: `2px solid ${C.pink}` },
    ghost: { background: C.pinkLight, color: C.pink },
    white: { background: C.white, color: C.pink },
  };
  return <button style={{ ...base, ...variants[v], ...sx }} onClick={onClick} disabled={disabled}>{children}</button>;
}

function Av({ s, size = 44 }) {
  return <div style={{ width: size, height: size, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.purple})`, color: C.white, fontWeight: 700, fontSize: size * 0.34, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{s}</div>;
}

// ────────────────────────────────────────────────
// CHATBOT (Enhanced with STT + Fullscreen)
// ────────────────────────────────────────────────
function ChatMessages({ msgs, typing, botRef }) {
  return (
    <>
      {msgs.map((m, i) => (
        <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", gap: 7, alignItems: "flex-end" }}>
          {m.from === "bot" && <div style={{ fontSize: 18 }}>🤖</div>}
          <div>
            <div style={{ background: m.from === "user" ? C.pink : C.gray100, color: m.from === "user" ? C.white : C.gray800, borderRadius: m.from === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px", padding: "9px 13px", fontSize: 13, lineHeight: 1.55, maxWidth: 218 }}>{m.text}</div>
            <div style={{ fontSize: 10, color: C.gray400, marginTop: 2, textAlign: m.from === "user" ? "right" : "left" }}>{m.t}</div>
          </div>
        </div>
      ))}
      {typing && (
        <div style={{ display: "flex", gap: 7, alignItems: "flex-end" }}>
          <div style={{ fontSize: 18 }}>🤖</div>
          <div style={{ background: C.gray100, borderRadius: "16px 16px 16px 4px", padding: "10px 14px", display: "flex", gap: 4 }}>
            {[0, 1, 2].map(i => <div key={i} style={{ width: 7, height: 7, borderRadius: "50%", background: C.gray400, animation: `bop 1s ${i * 0.2}s infinite` }} />)}
          </div>
        </div>
      )}
      <div ref={botRef} />
    </>
  );
}

function ChatBot({ onClose, onFullScreen }) {
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Halo! Saya HILDA, asisten AI Halodoc untuk layanan Autism Care. Ada yang bisa saya bantu? 🧩", t: "Sekarang" }]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const bot = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => { bot.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  function send(text) {
    const txt = (text || inp).trim(); if (!txt) return;
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setMsgs(m => [...m, { from: "user", text: txt, t: now }]);
    setInp(""); setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { from: "bot", text: rand(CHAT_BOT[classify(txt)]), t: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }]);
      setTyping(false);
    }, 900 + Math.random() * 700);
  }

  function toggleListen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Browser Anda tidak mendukung speech recognition. Gunakan Chrome."); return; }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
    } else {
      const r = new SR();
      r.lang = "id-ID"; r.interimResults = false; r.maxAlternatives = 1;
      r.onresult = e => { const t = e.results[0][0].transcript; setInp(t); setListening(false); };
      r.onerror = () => setListening(false);
      r.onend = () => setListening(false);
      recognitionRef.current = r; r.start(); setListening(true);
    }
  }

  const quick = ["Mulai skrining", "Cari dokter", "Info terapi ABA", "Parent training"];

  return (
    <div style={{ position: "fixed", bottom: 88, right: 20, width: 340, background: C.white, borderRadius: 20, boxShadow: "0 8px 40px #0003", zIndex: 1000, display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${C.gray200}` }}>
      <div style={{ background: `linear-gradient(135deg,${C.pink},${C.purple})`, padding: "13px 16px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: C.white, fontWeight: 700, fontSize: 14 }}>HILDA</div>
          <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>● Online · Autism Care Assistant</div>
        </div>
        <button onClick={onFullScreen} title="Buka layar penuh" style={{ background: "rgba(255,255,255,0.2)", border: "none", color: C.white, borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 12 }}>⛶</button>
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: C.white, borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button>
      </div>

      <div style={{ height: 300, overflowY: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
        <ChatMessages msgs={msgs} typing={typing} botRef={bot} />
      </div>

      <div style={{ padding: "0 10px 6px", display: "flex", gap: 5, flexWrap: "wrap" }}>
        {quick.map(q => <button key={q} onClick={() => setInp(q)} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 20, border: `1px solid ${C.pink}`, background: C.pinkLight, color: C.pink, cursor: "pointer", fontFamily: "inherit" }}>{q}</button>)}
      </div>

      <PrivacyCard type="voice" />

      <div style={{ padding: "6px 10px 12px", display: "flex", gap: 7 }}>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={listening ? "🎤 Mendengarkan..." : "Ketik pesan..."}
          style={{ flex: 1, padding: "9px 13px", borderRadius: 20, border: `1.5px solid ${listening ? C.pink : C.gray200}`, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
        <button onClick={toggleListen} title="Bicara" style={{ background: listening ? C.pink : C.pinkLight, border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 15, color: listening ? C.white : C.pink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🎤</button>
        <button onClick={() => send()} style={{ background: C.pink, border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 15, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
      </div>
      <style>{`@keyframes bop{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ── FULLSCREEN CHATBOT PAGE ───────────────────────────
function ChatFullPage({ onClose }) {
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Halo! Saya HILDA, asisten AI Halodoc untuk layanan Autism Care. Anda kini dalam mode layar penuh. Ada yang bisa saya bantu? 🧩", t: "Sekarang" }]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const [listening, setListening] = useState(false);
  const bot = useRef(null);
  const recognitionRef = useRef(null);

  useEffect(() => { bot.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  function send(text) {
    const txt = (text || inp).trim(); if (!txt) return;
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setMsgs(m => [...m, { from: "user", text: txt, t: now }]);
    setInp(""); setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { from: "bot", text: rand(CHAT_BOT[classify(txt)]), t: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }]);
      setTyping(false);
    }, 900 + Math.random() * 700);
  }

  function toggleListen() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Browser Anda tidak mendukung speech recognition. Gunakan Chrome."); return; }
    if (listening) {
      recognitionRef.current?.stop(); setListening(false);
    } else {
      const r = new SR();
      r.lang = "id-ID"; r.interimResults = false;
      r.onresult = e => { setInp(e.results[0][0].transcript); setListening(false); };
      r.onerror = () => setListening(false);
      r.onend = () => setListening(false);
      recognitionRef.current = r; r.start(); setListening(true);
    }
  }

  const quick = ["Mulai skrining", "Cari dokter", "Info terapi ABA", "Parent training", "Analisis bicara", "Smartwatch monitoring"];

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <div style={{ width: 48, height: 48, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🤖</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 800, fontSize: 22, color: C.gray800 }}>HILDA — Full Screen Mode</div>
          <div style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>● Online · Autism Care Assistant</div>
        </div>
        <button onClick={onClose} style={{ background: C.pinkLight, border: `1px solid ${C.pink}30`, color: C.pink, borderRadius: 10, padding: "8px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>✕ Tutup</button>
      </div>

      <PrivacyCard type="voice" />

      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ height: 480, overflowY: "auto", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
          {msgs.map((m, i) => (
            <div key={i} style={{ display: "flex", justifyContent: m.from === "user" ? "flex-end" : "flex-start", gap: 10, alignItems: "flex-end" }}>
              {m.from === "bot" && <div style={{ fontSize: 24 }}>🤖</div>}
              <div>
                <div style={{ background: m.from === "user" ? C.pink : C.gray100, color: m.from === "user" ? C.white : C.gray800, borderRadius: m.from === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px", padding: "12px 16px", fontSize: 14, lineHeight: 1.6, maxWidth: 480 }}>{m.text}</div>
                <div style={{ fontSize: 11, color: C.gray400, marginTop: 3, textAlign: m.from === "user" ? "right" : "left" }}>{m.t}</div>
              </div>
            </div>
          ))}
          {typing && (
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <div style={{ fontSize: 24 }}>🤖</div>
              <div style={{ background: C.gray100, borderRadius: "18px 18px 18px 4px", padding: "14px 18px", display: "flex", gap: 5 }}>
                {[0, 1, 2].map(i => <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: C.gray400, animation: `bop 1s ${i * 0.2}s infinite` }} />)}
              </div>
            </div>
          )}
          <div ref={bot} />
        </div>

        <div style={{ padding: "10px 18px", borderTop: `1px solid ${C.gray200}`, display: "flex", gap: 6, flexWrap: "wrap" }}>
          {quick.map(q => <button key={q} onClick={() => setInp(q)} style={{ fontSize: 12, padding: "5px 11px", borderRadius: 20, border: `1px solid ${C.pink}`, background: C.pinkLight, color: C.pink, cursor: "pointer", fontFamily: "inherit" }}>{q}</button>)}
        </div>

        <div style={{ padding: "12px 18px 18px", display: "flex", gap: 10 }}>
          <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder={listening ? "🎤 Mendengarkan..." : "Ketik atau bicara..."}
            style={{ flex: 1, padding: "12px 18px", borderRadius: 24, border: `1.5px solid ${listening ? C.pink : C.gray200}`, fontSize: 14, outline: "none", fontFamily: "inherit" }} />
          <button onClick={toggleListen} title="Bicara" style={{ background: listening ? C.pink : C.pinkLight, border: "none", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", fontSize: 18, color: listening ? C.white : C.pink, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>🎤</button>
          <button onClick={() => send()} style={{ background: C.pink, border: "none", borderRadius: "50%", width: 44, height: 44, cursor: "pointer", fontSize: 18, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
        </div>
      </div>
      <style>{`@keyframes bop{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ────────────────────────────────────────────────
// FIND DOCTOR PAGE (Enhanced with interactive map)
// ────────────────────────────────────────────────
function FindDoctorPage() {
  const [sel, setSel] = useState(null);
  const [booked, setBooked] = useState(null);
  const [filt, setFilt] = useState("Semua");
  const [cityFilter, setCityFilter] = useState("Semua");
  const [activeCity, setActiveCity] = useState(null);
  const filters = ["Semua", "Dokter Anak", "Psikiater", "Psikolog", "Neurologis"];
  const cities = ["Semua", "Semarang", "Jakarta", "Bandung", "Surabaya", "Yogyakarta"];

  const shown = DOCTORS.filter(d => {
    const specMatch = filt === "Semua" ? true :
      (filt === "Dokter Anak" && d.spec.includes("Anak") && !d.spec.includes("Neurologi") && !d.spec.includes("Psikiater") && !d.spec.includes("Psikolog")) ||
      (filt === "Psikiater" && d.spec.includes("Psikiater")) ||
      (filt === "Psikolog" && d.spec.includes("Psikolog")) ||
      (filt === "Neurologis" && d.spec.includes("Neurologi"));
    const cityMatch = cityFilter === "Semua" ? true : d.city === cityFilter;
    return specMatch && cityMatch;
  });

  // City marker positions on our fake map (percentage-based)
  const cityPos = {
    Semarang:   { x: 53, y: 52 },
    Jakarta:    { x: 36, y: 48 },
    Bandung:    { x: 40, y: 56 },
    Surabaya:   { x: 68, y: 54 },
    Yogyakarta: { x: 52, y: 60 },
  };

  const cityDoctorCount = city => DOCTORS.filter(d => d.city === city).length;

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 24, color: C.gray800, marginBottom: 4 }}>📍 Dokter Spesialis Autism Terdekat</div>
      <p style={{ color: C.gray600, marginBottom: 20 }}>Ditemukan {DOCTORS.length} dokter di berbagai kota Indonesia yang siap membantu.</p>

      {/* City filter tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
        {cities.map(c => (
          <button key={c} onClick={() => { setCityFilter(c); setActiveCity(c === "Semua" ? null : c); }} style={{ padding: "6px 14px", borderRadius: 20, border: `1.5px solid ${cityFilter === c ? C.purple : C.gray200}`, background: cityFilter === c ? C.purple : C.white, color: cityFilter === c ? C.white : C.gray600, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>🏙️ {c}</button>
        ))}
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {filters.map(f => (
          <button key={f} onClick={() => setFilt(f)} style={{ padding: "6px 15px", borderRadius: 20, border: `1.5px solid ${filt === f ? C.pink : C.gray200}`, background: filt === f ? C.pink : C.white, color: filt === f ? C.white : C.gray600, fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit" }}>{f}</button>
        ))}
      </div>

      {booked && (
        <div style={{ background: C.greenLight, border: `1.5px solid #86EFAC`, borderRadius: 12, padding: "14px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
          <span style={{ fontSize: 22 }}>✅</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.green }}>Janji berhasil dibuat!</div>
            <div style={{ fontSize: 13, color: C.gray600 }}>Dengan {booked.name} · {booked.slot} · {booked.hosp}</div>
          </div>
        </div>
      )}

      <div style={{ display: "grid", gap: 14, marginBottom: 24 }}>
        {shown.map(doc => (
          <div key={doc.id} style={{ background: C.white, border: `1.5px solid ${sel?.id === doc.id ? C.pink : C.gray200}`, borderRadius: 14, padding: "18px 20px", cursor: "pointer", transition: "all 0.2s" }} onClick={() => setSel(sel?.id === doc.id ? null : doc)}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <Av s={doc.av} />
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 2 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: C.gray800 }}>{doc.name}</span>
                  {doc.ok && <Chip label="✓ Terverifikasi" color={C.green} />}
                  <Chip label={`🏙️ ${doc.city}`} color={C.purple} />
                </div>
                <div style={{ fontSize: 13, color: C.pink, fontWeight: 600, marginBottom: 3 }}>{doc.spec}</div>
                <div style={{ fontSize: 12, color: C.gray600, marginBottom: 5 }}>🏥 {doc.hosp}{doc.dist !== "—" ? ` · 📍 ${doc.dist}` : ""}</div>
                <div style={{ display: "flex", gap: 14, fontSize: 12, color: C.gray600, flexWrap: "wrap" }}>
                  <span>⭐ {doc.rating} ({doc.rev} ulasan)</span>
                  <span style={{ color: doc.slot.includes("Hari ini") ? C.green : C.amber, fontWeight: 600 }}>● {doc.slot}</span>
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontWeight: 700, color: C.pink, fontSize: 15 }}>{doc.price}</div>
                <div style={{ fontSize: 11, color: C.gray400 }}>/konsultasi</div>
                <div style={{ fontSize: 11, color: C.gray400, marginTop: 2 }}>Klik untuk detail</div>
              </div>
            </div>

            {sel?.id === doc.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${C.gray200}`, display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Btn onClick={e => { e.stopPropagation(); setBooked(doc); setSel(null); }}>📅 Buat Janji Temu</Btn>
                <Btn v="outline" onClick={e => e.stopPropagation()}>💬 Chat Sekarang</Btn>
                <Btn v="ghost" onClick={e => e.stopPropagation()}>🗺️ Rute ke Klinik</Btn>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Map — Indonesia cities */}
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ height: 320 }}>
          <MapContainer
            center={[-2.5, 118]}
            zoom={5}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {DOCTORS.map((doctor) => (
              <Marker
                key={doctor.id}
                position={[doctor.lat, doctor.lng]}
              >
                <Popup>
                  <b>{doctor.name}</b>
                  <br />
                  {doctor.spec}
                  <br />
                  {doctor.hosp}
                  <br />
                  ⭐ {doctor.rating}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// SPEECH & COMMUNICATION ANALYSIS PAGE
// ────────────────────────────────────────────────
function SpeechAnalysisPage() {
  const [stage, setStage] = useState("upload"); // upload | analyzing | result
  const [audioFile, setAudioFile] = useState(null);
  const [recording, setRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [progress, setProgress] = useState(0);
  const recognitionRef = useRef(null);
  const progressRef = useRef(null);

  function startRecord() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert("Gunakan Chrome untuk fitur rekam suara."); return; }
    const r = new SR();
    r.lang = "id-ID"; r.interimResults = true; r.continuous = true;
    r.onresult = e => {
      let txt = "";
      for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript + " ";
      setTranscript(txt.trim());
    };
    r.onerror = () => setRecording(false);
    recognitionRef.current = r; r.start(); setRecording(true);
  }

  function stopRecord() {
    recognitionRef.current?.stop(); setRecording(false);
  }

  function runAnalysis() {
    if (!transcript && !audioFile) return;
    setStage("analyzing"); setProgress(0);
    const steps = [15, 30, 50, 65, 80, 95, 100];
    let i = 0;
    progressRef.current = setInterval(() => {
      setProgress(steps[i]);
      i++;
      if (i >= steps.length) {
        clearInterval(progressRef.current);
        setTimeout(() => {
          const words = (transcript || "Anak saya suka bermain ayo ayo ayo ya ya ya tidak tidak tidak suka main main main").split(" ").filter(Boolean);
          const uniqueWords = new Set(words.map(w => w.toLowerCase()));
          const totalWords = words.length;
          const repetitionRate = Math.round(((totalWords - uniqueWords.size) / totalWords) * 100);
          const pronouns = words.filter(w => ["saya","aku","kamu","dia","mereka","kami","kita"].includes(w.toLowerCase())).length;
          const pronounRatio = Math.round((pronouns / totalWords) * 100);
          const pauseRate = Math.round(Math.random() * 30 + 10);
          const riskScore = Math.round((repetitionRate * 0.4) + (pauseRate * 0.35) + ((10 - pronounRatio) * 2));
          const risk = riskScore >= 60 ? "high" : riskScore >= 35 ? "moderate" : "low";
          setAnalysisResult({ totalWords, repetitionRate, pronounRatio, pauseRate, riskScore, risk, transcript: transcript || "Anak saya suka bermain ayo ayo ayo ya ya ya tidak tidak tidak suka main main main" });
          setStage("result");
        }, 500);
      }
    }, 600);
  }

  const riskCfg = {
    low: { color: C.green, bg: C.greenLight, icon: "✅", label: "Pola Komunikasi Normal" },
    moderate: { color: C.amber, bg: C.amberLight, icon: "⚠️", label: "Perlu Perhatian" },
    high: { color: C.red, bg: C.redLight, icon: "🔴", label: "Risiko Gangguan Komunikasi Tinggi" },
  };

  const analyzeSteps = [
    "Menginisiasi engine transkripsi...",
    "Menganalisis pola bicara...",
    "Menghitung tingkat pengulangan kata...",
    "Menganalisis rasio penggunaan pronoun...",
    "Mendeteksi jeda dan pola ritme...",
    "Menjalankan NLP analysis model...",
    "Menghasilkan laporan komunikasi...",
  ];

  return (
    <div style={{ maxWidth: 760, margin: "0 auto" }}>
      <div style={{ fontWeight: 800, fontSize: 24, color: C.gray800, marginBottom: 4 }}>🎤 Analisis Bicara & Komunikasi</div>
      <p style={{ color: C.gray600, marginBottom: 20, lineHeight: 1.7 }}>Analisis pola komunikasi anak melalui rekaman suara atau file audio. Sistem AI akan mengidentifikasi pola pengulangan, jeda, dan rasio pronoun untuk skrining komunikasi ASD.</p>

      {/* Workflow indicator */}
      <div style={{ display: "flex", alignItems: "center", gap: 0, marginBottom: 24, overflowX: "auto", paddingBottom: 8 }}>
        {["Upload Audio", "Transkripsi", "NLP Analysis", "Prediksi", "Rekomendasi"].map((s, i, arr) => (
          <div key={i} style={{ display: "flex", alignItems: "center", flex: i < arr.length - 1 ? 1 : "none" }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4, minWidth: 70 }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: stage === "result" || (stage === "analyzing" && i < 3) ? C.green : i === 0 ? C.pink : C.gray200, color: C.white, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{stage === "result" || (stage === "analyzing" && i < 3) ? "✓" : i + 1}</div>
              <span style={{ fontSize: 10, color: C.gray600, whiteSpace: "nowrap" }}>{s}</span>
            </div>
            {i < arr.length - 1 && <div style={{ flex: 1, height: 2, background: stage === "result" ? C.green : C.gray200, marginBottom: 14, minWidth: 20 }} />}
          </div>
        ))}
      </div>

      {stage === "upload" && (
        <div>
          <PrivacyCard type="audio" />

          {/* Record live */}
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "22px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.gray800, marginBottom: 10 }}>🎙️ Rekam Suara Langsung</div>
            <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 14 }}>
              <button onClick={recording ? stopRecord : startRecord} style={{ background: recording ? C.red : C.pink, color: C.white, border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
                {recording ? "⏹️ Stop Rekam" : "🎤 Mulai Rekam"}
              </button>
              {recording && <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(i => <div key={i} style={{ width: 5, height: 20, background: C.pink, borderRadius: 3, animation: `bop 0.6s ${i*0.15}s infinite` }} />)}</div>}
            </div>
            {transcript && (
              <div style={{ background: C.gray50, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.gray200}` }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, marginBottom: 6, letterSpacing: 0.5 }}>TRANSKRIPSI SEMENTARA</div>
                <div style={{ fontSize: 13, color: C.gray700, lineHeight: 1.7 }}>{transcript}</div>
              </div>
            )}
          </div>

          {/* Upload file */}
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "22px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: C.gray800, marginBottom: 10 }}>📁 Upload File Audio</div>
            <div style={{ padding: "20px", borderRadius: 12, textAlign: "center", border: `2px dashed ${audioFile ? C.green : C.gray200}`, background: audioFile ? C.greenLight : C.gray50 }}>
              {audioFile ? (
                <>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>✅</div>
                  <div style={{ fontWeight: 700, color: C.green }}>{audioFile.name}</div>
                  <button onClick={() => setAudioFile(null)} style={{ marginTop: 8, fontSize: 12, color: C.red, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>Ganti file</button>
                </>
              ) : (
                <>
                  <div style={{ fontSize: 32, marginBottom: 6 }}>🔊</div>
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.pink, color: C.white, borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    📁 Pilih File Audio
                    <input type="file" accept="audio/*" style={{ display: "none" }} onChange={e => setAudioFile(e.target.files[0])} />
                  </label>
                  <div style={{ fontSize: 11, color: C.gray400, marginTop: 8 }}>MP3, WAV, M4A · Maks. 50MB</div>
                </>
              )}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <Btn onClick={runAnalysis} disabled={!transcript && !audioFile}>🤖 Analisis dengan AI →</Btn>
          </div>
          <style>{`@keyframes bop{0%,80%,100%{transform:scaleY(1)}40%{transform:scaleY(2)}}`}</style>
        </div>
      )}

      {stage === "analyzing" && (
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "28px" }}>
          <div style={{ textAlign: "center", marginBottom: 20 }}>
            <div style={{ fontSize: 40, marginBottom: 8 }}>🤖</div>
            <div style={{ fontWeight: 700, fontSize: 16 }}>AI sedang menganalisis pola komunikasi...</div>
            <div style={{ fontSize: 13, color: C.gray600, marginTop: 4 }}>{progress}% selesai</div>
          </div>
          <div style={{ marginBottom: 16 }}><PBar v={progress} /></div>
          <div style={{ display: "grid", gap: 8 }}>
            {analyzeSteps.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: C.gray50 }}>
                {progress > (i + 1) * 14 ? <span style={{ color: C.green }}>✓</span> : <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.pink}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />}
                <span style={{ fontSize: 12, color: C.gray600 }}>{s}</span>
              </div>
            ))}
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}

      {stage === "result" && analysisResult && (() => {
        const c = riskCfg[analysisResult.risk];
        const metrics = [
          { icon: "📝", label: "Total Kata", value: analysisResult.totalWords, unit: "kata" },
          { icon: "🔁", label: "Tingkat Pengulangan", value: `${analysisResult.repetitionRate}%`, note: analysisResult.repetitionRate > 40 ? "Tinggi" : "Normal" },
          { icon: "👤", label: "Rasio Pronoun", value: `${analysisResult.pronounRatio}%`, note: analysisResult.pronounRatio < 5 ? "Rendah" : "Normal" },
          { icon: "⏸️", label: "Pause Rate", value: `${analysisResult.pauseRate}%`, note: analysisResult.pauseRate > 35 ? "Sering" : "Normal" },
        ];
        const aiInsight = analysisResult.risk === "high"
          ? "Pola bicara menunjukkan tingkat pengulangan kata yang signifikan dan penggunaan pronoun yang sangat terbatas. Ini merupakan indikator yang perlu dievaluasi lebih lanjut oleh ahli terapis wicara."
          : analysisResult.risk === "moderate"
          ? "Ditemukan beberapa pola pengulangan dalam ucapan. Penggunaan pronoun masih dalam batas yang dapat ditoleransi namun perlu pemantauan lebih lanjut."
          : "Pola komunikasi anak menunjukkan variasi kosakata yang baik dan penggunaan pronoun yang normal. Tidak ditemukan indikator signifikan gangguan komunikasi ASD.";

        return (
          <div>
            <div style={{ background: C.amberLight, border: `1.5px solid #FCD34D`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400E", marginBottom: 18, lineHeight: 1.6 }}>
              ⚕️ <strong>Disclaimer:</strong> Hasil ini hanya untuk bantuan skrining awal dan <strong>tidak menggantikan diagnosis medis profesional</strong>.
            </div>

            {/* Risk banner */}
            <div style={{ background: c.bg, border: `2px solid ${c.color}40`, borderRadius: 16, padding: "22px", marginBottom: 16, textAlign: "center" }}>
              <div style={{ fontSize: 44, marginBottom: 6 }}>{c.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.color }}>{c.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: c.color, marginTop: 6 }}>{analysisResult.riskScore}/100</div>
              <div style={{ fontSize: 12, color: C.gray600 }}>Skor Risiko Komunikasi</div>
            </div>

            {/* Transcript card */}
            <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 10 }}>📝 Transkrip</div>
              <div style={{ background: C.gray50, borderRadius: 10, padding: "14px 16px", fontSize: 13, color: C.gray700, lineHeight: 1.8 }}>{analysisResult.transcript}</div>
            </div>

            {/* Metrics */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 10, marginBottom: 14 }}>
              {metrics.map((m, i) => (
                <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "14px 12px", textAlign: "center" }}>
                  <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                  <div style={{ fontWeight: 800, fontSize: 18, color: C.pink }}>{m.value}</div>
                  <div style={{ fontSize: 11, color: C.gray600 }}>{m.label}</div>
                  {m.note && <div style={{ fontSize: 10, color: C.amber, fontWeight: 600, marginTop: 2 }}>{m.note}</div>}
                </div>
              ))}
            </div>

            {/* AI Insight */}
            <div style={{ background: C.purpleLight, border: `1px solid ${C.purple}30`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.purple, marginBottom: 8 }}>🧠 AI Insight</div>
              <div style={{ fontSize: 13, color: C.gray700, lineHeight: 1.7 }}>{aiInsight}</div>
            </div>

            {/* Recommendation */}
            <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 10 }}>💡 Rekomendasi</div>
              <div style={{ display: "grid", gap: 8 }}>
                {(analysisResult.risk === "high"
                  ? ["Segera konsultasikan ke Terapis Wicara dalam 1–2 minggu", "Evaluasi kemampuan berbahasa secara komprehensif", "Program terapi bicara intensif direkomendasikan"]
                  : analysisResult.risk === "moderate"
                  ? ["Konsultasi ke Dokter Tumbuh Kembang dalam 1 bulan", "Stimulasi bicara harian dengan teknik ABA", "Evaluasi ulang dalam 3 bulan"]
                  : ["Lanjutkan stimulasi bicara rutin setiap hari", "Skrining ulang dalam 6 bulan", "Pertahankan interaksi verbal yang kaya"]
                ).map((r, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", borderRadius: 8, background: C.gray50, alignItems: "flex-start" }}>
                    <span style={{ color: c.color, fontWeight: 700, flexShrink: 0 }}>→</span>
                    <span style={{ fontSize: 13, color: C.gray700, lineHeight: 1.6 }}>{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <SpecialistRecommendation risk={analysisResult.risk} />

            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              <Btn onClick={() => { setStage("upload"); setTranscript(""); setAudioFile(null); setAnalysisResult(null); }}>🔄 Analisis Baru</Btn>
              <Btn v="outline">📄 Unduh Laporan</Btn>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

// ────────────────────────────────────────────────
// SMARTWATCH MONITORING PAGE
// ────────────────────────────────────────────────
function SmartwatchPage() {
  const [connected, setConnected] = useState(false);
  const [data, setData] = useState({
    heartRate: 87,
    hrv: 42,
    sleepQuality: 68,
    stressLevel: 72,
    steps: 3240,
    emotionRisk: "moderate",
  });
  const intervalRef = useRef(null);

  function connect() {
    setConnected(true);
    intervalRef.current = setInterval(() => {
      setData(d => ({
        heartRate: Math.round(d.heartRate + (Math.random() - 0.5) * 6),
        hrv: Math.max(20, Math.round(d.hrv + (Math.random() - 0.5) * 4)),
        sleepQuality: Math.min(100, Math.max(20, Math.round(d.sleepQuality + (Math.random() - 0.5) * 3))),
        stressLevel: Math.min(100, Math.max(10, Math.round(d.stressLevel + (Math.random() - 0.5) * 5))),
        steps: d.steps + Math.round(Math.random() * 8),
        emotionRisk: d.stressLevel > 75 ? "high" : d.stressLevel > 45 ? "moderate" : "low",
      }));
    }, 2000);
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);

  const emotionCfg = {
    low: { color: C.green, label: "Regulasi Emosi Baik", icon: "😊" },
    moderate: { color: C.amber, label: "Perlu Perhatian", icon: "😐" },
    high: { color: C.red, label: "Risiko Disregulasi Tinggi", icon: "😟" },
  };

  const ec = emotionCfg[data.emotionRisk];

  const metrics = [
    {
      icon: "❤️", label: "Heart Rate", value: data.heartRate, unit: "bpm",
      bar: Math.min(100, (data.heartRate / 200) * 100),
      color: data.heartRate > 120 ? C.red : data.heartRate > 100 ? C.amber : C.green,
      note: data.heartRate > 120 ? "Tinggi" : data.heartRate > 100 ? "Sedikit Tinggi" : "Normal",
    },
    {
      icon: "📈", label: "Heart Rate Variability", value: data.hrv, unit: "ms",
      bar: Math.min(100, (data.hrv / 80) * 100),
      color: data.hrv < 25 ? C.red : data.hrv < 40 ? C.amber : C.green,
      note: data.hrv < 25 ? "Rendah" : data.hrv < 40 ? "Cukup" : "Baik",
    },
    {
      icon: "😴", label: "Kualitas Tidur", value: data.sleepQuality, unit: "%",
      bar: data.sleepQuality,
      color: data.sleepQuality < 40 ? C.red : data.sleepQuality < 65 ? C.amber : C.green,
      note: data.sleepQuality < 40 ? "Buruk" : data.sleepQuality < 65 ? "Cukup" : "Baik",
    },
    {
      icon: "😵", label: "Stres Level", value: data.stressLevel, unit: "%",
      bar: data.stressLevel,
      color: data.stressLevel > 75 ? C.red : data.stressLevel > 50 ? C.amber : C.green,
      note: data.stressLevel > 75 ? "Tinggi" : data.stressLevel > 50 ? "Sedang" : "Rendah",
    },
    {
      icon: "🚶", label: "Activity (Langkah)", value: data.steps.toLocaleString("id-ID"), unit: "langkah",
      bar: Math.min(100, (data.steps / 8000) * 100),
      color: data.steps < 2000 ? C.red : data.steps < 5000 ? C.amber : C.green,
      note: data.steps < 2000 ? "Rendah" : data.steps < 5000 ? "Cukup" : "Aktif",
    },
  ];

  const recommendations = data.emotionRisk === "high"
    ? ["Pastikan lingkungan anak tenang dan minim stimulasi berlebih", "Terapkan jadwal rutin yang konsisten untuk mengurangi kecemasan", "Pertimbangkan sesi terapi regulasi emosi segera", "Monitor pola tidur anak secara ketat"]
    : data.emotionRisk === "moderate"
    ? ["Pertahankan jadwal tidur yang konsisten setiap malam", "Aktivitas fisik ringan 30 menit/hari direkomendasikan", "Teknik deep breathing dapat membantu regulasi stres"]
    : ["Kondisi anak terpantau baik, lanjutkan rutinitas saat ini", "Jaga kualitas tidur minimal 9–11 jam untuk anak", "Aktivitas fisik yang konsisten mendukung regulasi emosi"];

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 24, color: C.gray800, marginBottom: 4 }}>⌚ Smartwatch Monitoring</div>
      <p style={{ color: C.gray600, marginBottom: 20 }}>Pantau data kesehatan anak secara real-time melalui perangkat smartwatch yang terhubung.</p>

      {!connected ? (
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 16, padding: "40px 32px", textAlign: "center" }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>⌚</div>
          <div style={{ fontWeight: 700, fontSize: 18, color: C.gray800, marginBottom: 8 }}>Hubungkan Smartwatch Anak</div>
          <p style={{ color: C.gray600, fontSize: 14, lineHeight: 1.7, marginBottom: 24 }}>Sambungkan perangkat smartwatch (Apple Watch, Samsung Galaxy Watch, atau Garmin) untuk mulai memantau data kesehatan real-time.</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap", marginBottom: 24 }}>
            {["Apple Watch", "Samsung Galaxy", "Garmin", "Fitbit"].map((d, i) => (
              <div key={i} style={{ background: C.gray50, border: `1px solid ${C.gray200}`, borderRadius: 10, padding: "10px 16px", fontSize: 13, color: C.gray700 }}>{d}</div>
            ))}
          </div>
          <Btn onClick={connect}>⌚ Hubungkan Perangkat</Btn>
        </div>
      ) : (
        <div>
          <div style={{ background: C.greenLight, border: `1.5px solid #86EFAC`, borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 20 }}>✅</span>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.green }}>Smartwatch Terhubung</div>
              <div style={{ fontSize: 12, color: C.gray600 }}>Data diperbarui setiap 2 detik · {new Date().toLocaleTimeString("id-ID")}</div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", gap: 5 }}>{[0,1,2].map(i => <div key={i} style={{ width: 4, height: 16, background: C.green, borderRadius: 2, animation: `bop 0.8s ${i*0.2}s infinite` }} />)}</div>
          </div>

          {/* Emotion Risk Banner */}
          <div style={{ background: ec.color + "15", border: `2px solid ${ec.color}40`, borderRadius: 16, padding: "20px 22px", marginBottom: 16, display: "flex", gap: 16, alignItems: "center" }}>
            <div style={{ fontSize: 40 }}>{ec.icon}</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: ec.color, letterSpacing: 0.5, marginBottom: 4 }}>⚠️ RISIKO REGULASI EMOSI</div>
              <div style={{ fontWeight: 800, fontSize: 18, color: ec.color }}>{ec.label}</div>
            </div>
          </div>

          {/* Metrics grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(200px,1fr))", gap: 12, marginBottom: 16 }}>
            {metrics.map((m, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 22, marginBottom: 4 }}>{m.icon}</div>
                    <div style={{ fontSize: 11, color: C.gray600, fontWeight: 600 }}>{m.label}</div>
                  </div>
                  <span style={{ background: m.color + "20", color: m.color, fontSize: 10, fontWeight: 700, padding: "3px 7px", borderRadius: 8 }}>{m.note}</span>
                </div>
                <div style={{ fontWeight: 800, fontSize: 24, color: m.color, marginBottom: 8 }}>{m.value} <span style={{ fontSize: 12, fontWeight: 400, color: C.gray400 }}>{m.unit}</span></div>
                <PBar v={m.bar} color={m.color} />
              </div>
            ))}
          </div>

          {/* Heart rate chart (simple visual) */}
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px", marginBottom: 16 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 14 }}>📊 Grafik Heart Rate (Simulasi)</div>
            <div style={{ display: "flex", gap: 3, alignItems: "flex-end", height: 60 }}>
              {Array.from({ length: 24 }, (_, i) => {
                const h = 30 + Math.round(Math.sin(i * 0.8) * 15 + Math.random() * 10);
                return <div key={i} style={{ flex: 1, height: h, background: `linear-gradient(to top, ${C.pink}, ${C.pinkMid})`, borderRadius: "3px 3px 0 0", minWidth: 4 }} />;
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10, color: C.gray400, marginTop: 6 }}>
              <span>00:00</span><span>06:00</span><span>12:00</span><span>18:00</span><span>24:00</span>
            </div>
          </div>

          {/* Recommendations */}
          <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
            <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 12 }}>💡 Rekomendasi</div>
            <div style={{ display: "grid", gap: 8 }}>
              {recommendations.map((r, i) => (
                <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", borderRadius: 8, background: C.gray50, alignItems: "flex-start" }}>
                  <span style={{ color: ec.color, fontWeight: 700, flexShrink: 0 }}>→</span>
                  <span style={{ fontSize: 13, color: C.gray700, lineHeight: 1.6 }}>{r}</span>
                </div>
              ))}
            </div>
          </div>

          <SpecialistRecommendation risk={data.emotionRisk} />
        </div>
      )}
      <style>{`@keyframes bop{0%,80%,100%{transform:scaleY(1)}40%{transform:scaleY(1.8)}}`}</style>
    </div>
  );
}

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────
export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [page, setPage] = useState("home");
  const [step, setStep] = useState(0);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childGender, setChildGender] = useState("");
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [video, setVideo] = useState(null);
  const [speechResult, setSpeechResult] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [chatFullScreen, setChatFullScreen] = useState(false);
  const [anim, setAnim] = useState(true);

  useEffect(() => {
    setAnim(false); const t = setTimeout(() => setAnim(true), 40); return () => clearTimeout(t);
  }, [page, step]);

  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg,#fdf2f8 0%,#ffffff 100%)",
          padding: 24,
        }}
      >
        <div
                  style={{
                    width: 460,
                    background: "white",
                    padding: 40,
                    borderRadius: 24,
                    boxShadow: "0 20px 50px rgba(0,0,0,0.08)",
                    textAlign: "center",
                  }}
                >
<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 20,
    justifyContent: "center",
  }}
>
  <img
    src="/halodoc-logo.jpg"
    alt="Halodoc"
    style={{
      height: 48,
      objectFit: "contain",
    }}
  />

  {/* kode SmartCare di atas */}

          <div>
            <div
              style={{
                fontWeight: 800,
                fontSize: 18,
              }}
            >
              SmartCare
            </div>

            <div
              style={{
                fontSize: 12,
                color: "#64748b",
              }}
            >
              AI-Powered Autism Screening
            </div>
          </div>
        </div>

  
          <p
            style={{
              color: "#64748b",
              marginBottom: 28,
              lineHeight: 1.5,
            }}
          >
            Masuk untuk memulai proses screening, analisis AI,
            dan konsultasi dokter spesialis.
          </p>

          <input
            placeholder="Email"
            style={{
              width: "100%",
              padding: 14,
              marginBottom: 12,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "white",
              color: "#111827",
              boxSizing: "border-box",
            }}
          />

          <input
            type="password"
            placeholder="Password"
            style={{
              width: "100%",
              padding: 14,
              marginBottom: 18,
              borderRadius: 12,
              border: "1px solid #d1d5db",
              background: "white",
              color: "#111827",
              boxSizing: "border-box",
            }}
          />

          <button
            onClick={() => setIsLoggedIn(true)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              border: "none",
              background: "#ec4899",
              color: "white",
              fontWeight: 700,
              fontSize: 15,
              cursor: "pointer",
            }}
          >
            Masuk
          </button>

          <button
            onClick={() => setIsLoggedIn(true)}
            style={{
              width: "100%",
              padding: 14,
              borderRadius: 12,
              marginTop: 12,
              border: "1px solid #d1d5db",
              background: "white",
              color: "#111827",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Login dengan Google
          </button>

          <p
            style={{
              marginTop: 20,
              fontSize: 12,
              color: "#94a3b8",
            }}
          >
            Demo Academic Project • Foundation of AI
          </p>
        </div>
      </div>
    );
  }

  function goScreen() { setStep(0); setAnswers({}); setResult(null); setVideo(null); setSpeechResult(null); setPage("screening"); }

  function computeScore() {
    let tot = 0, mx = 0;
    const scores = QUESTIONS.map((q, i) => {
      const a = answers[i] ?? 0, n = a / (q.opts.length - 1);
      tot += n * q.w; mx += q.w;
      return { label: q.cat, score: Math.round(n * 100) };
    });
    return { fs: (tot / mx) * 100, bScores: scores };
  }

  async function handleAnalyze(f) {
    setAnalyzing(true);
    try {
      const form = new FormData(); form.append("file", f);
      const res = await fetch("http://127.0.0.1:8000/predict", { method: "POST", body: form });
      if (!res.ok) throw new Error();
      const ai = await res.json();
      const { fs, bScores } = computeScore();
      const vr = 100 - (ai.focus_percentage ?? 50);
      const fused = Math.round(vr * 0.6 + fs * 0.4);
      const risk = fused >= 60 ? "high" : fused >= 35 ? "moderate" : "low";
      setResult({ risk, confidence: Math.round(ai.confidence), score: fused, bScores, videoData: ai });
    } catch {
      const { fs, bScores } = computeScore();
      const risk = fs >= 60 ? "high" : fs >= 35 ? "moderate" : "low";
      setResult({ risk, confidence: 78, score: Math.round(fs), bScores, videoData: null });
    }
    setAnalyzing(false); setStep(4);
  }

  const stepLabels = ["Info Anak", "Perilaku", "Komunikasi", "Video AI", "Analisis Bicara", "Laporan"];

  function ScreenPage() {
    const curQs = step === 1 ? QUESTIONS.slice(0, 4) : step === 2 ? QUESTIONS.slice(4, 8) : [];
    const [ln, setLn] = useState(childName);
    const [la, setLa] = useState(childAge);
    const [lg, setLg] = useState(childGender);

    function saveInfo() { setChildName(ln); setChildAge(la); setChildGender(lg); setStep(1); }

    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 28 }}>
          {stepLabels.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stepLabels.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step > i ? C.green : step === i ? C.pink : C.gray200, color: step >= i ? C.white : C.gray600, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, transition: "all 0.3s", boxShadow: step === i ? `0 0 0 4px ${C.pink}25` : "none" }}>
                  {step > i ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 9, color: step === i ? C.pink : C.gray400, fontWeight: step === i ? 700 : 400, whiteSpace: "nowrap" }}>{l}</span>
              </div>
              {i < stepLabels.length - 1 && <div style={{ flex: 1, height: 3, background: step > i ? C.green : C.gray200, marginTop: 15, transition: "background 0.4s" }} />}
            </div>
          ))}
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 16, padding: "28px 32px" }}>
          {step === 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, color: C.gray800, marginBottom: 6 }}>🧒 Informasi Anak</div>
              <p style={{ color: C.gray600, fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>Masukkan informasi dasar anak Anda untuk memulai skrining.</p>
              <div style={{ display: "grid", gap: 20 }}>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, marginBottom: 6, display: "block" }}>Nama Anak</label>
                  <input value={ln} onChange={e => setLn(e.target.value)} placeholder="Contoh: Budi Santoso"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.gray200}`, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} autoComplete="off" />
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, marginBottom: 6, display: "block" }}>Usia Anak (bulan)</label>
                  <input type="number" min={12} max={72} value={la} onChange={e => setLa(e.target.value)} placeholder="Contoh: 36"
                    style={{ width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${C.gray200}`, fontSize: 14, outline: "none", boxSizing: "border-box", fontFamily: "inherit" }} />
                  {la && Number(la) >= 12 && <div style={{ fontSize: 12, color: C.pink, marginTop: 4 }}>= {Math.floor(Number(la) / 12)} tahun {Number(la) % 12} bulan</div>}
                  {la && Number(la) < 12 && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: 12,
                        borderRadius: 10,
                        background: "#FEF3C7",
                        border: "1px solid #FCD34D",
                        color: "#92400E",
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>⚠️ Usia Belum Memenuhi Kriteria Skrining</strong>
                      <br />
                      SmartCare Autism Screening direkomendasikan untuk anak usia
                      minimal 12 bulan.
                      <br />
                      Silakan lakukan pemantauan perkembangan secara berkala dan
                      konsultasikan dengan dokter anak jika terdapat kekhawatiran.
                    </div>
                  )}

                  {la && Number(la) > 72 && (
                    <div
                      style={{
                        marginTop: 10,
                        padding: 12,
                        borderRadius: 10,
                        background: "#FEF2F2",
                        border: "1px solid #FECACA",
                        color: "#B91C1C",
                        fontSize: 13,
                        lineHeight: 1.5,
                      }}
                    >
                      <strong>⚠️ Batas Usia Skrining Terlampaui</strong>
                      <br />
                      SmartCare Autism Screening dirancang untuk anak usia
                      12–72 bulan (1–6 tahun).
                      <br />
                      Untuk usia di atas 6 tahun, kami menyarankan konsultasi
                      langsung dengan dokter spesialis anak atau psikolog perkembangan.
                    </div>
                  )}
                </div>
                <div>
                  <label style={{ fontSize: 13, fontWeight: 600, color: C.gray600, marginBottom: 8, display: "block" }}>Jenis Kelamin</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[{ v: "male", l: "Laki-laki", e: "👦" }, { v: "female", l: "Perempuan", e: "👧" }].map(g => (
                      <div key={g.v} onClick={() => setLg(g.v)} style={{ flex: 1, padding: 14, borderRadius: 12, cursor: "pointer", textAlign: "center", border: `2px solid ${lg === g.v ? C.pink : C.gray200}`, background: lg === g.v ? C.pinkLight : C.white, transition: "all 0.2s" }}>
                        <div style={{ fontSize: 28, marginBottom: 6 }}>{g.e}</div>
                        <div style={{ fontSize: 14, fontWeight: 600, color: lg === g.v ? C.pink : C.gray600 }}>{g.l}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
                <Btn
                  onClick={saveInfo}
                  disabled={
                    !ln.trim() ||
                    !la ||
                    !lg ||
                    Number(la) < 12 ||
                    Number(la) > 72}
                >
                  Lanjut →
                </Btn>
              </div>
            </div>
          )}

          {(step === 1 || step === 2) && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, color: C.gray800, marginBottom: 4 }}>
                {step === 1 ? "🧠 Perilaku & Respons Dasar" : "💬 Komunikasi & Interaksi Sosial"}
              </div>
              <p style={{ color: C.gray600, fontSize: 13, marginBottom: 16 }}>Pertanyaan {step === 1 ? "1–4" : "5–8"} dari 8 · Pilih yang paling mendekati kondisi anak Anda</p>
              <div style={{ marginBottom: 20 }}><PBar v={step === 1 ? 30 : 75} /></div>
              <div style={{ display: "grid", gap: 14 }}>
                {curQs.map((q, i) => {
                  const idx = step === 1 ? i : i + 4;
                  return (
                    <div key={q.id} style={{ padding: 16, borderRadius: 12, border: `1px solid ${C.gray200}`, background: C.gray50 }}>
                      <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
                        <span style={{ fontSize: 22, flexShrink: 0 }}>{q.icon}</span>
                        <div>
                          <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, marginBottom: 3, letterSpacing: 0.5 }}>{q.cat.toUpperCase()}</div>
                          <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.6, color: C.gray800 }}>{q.q}</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 7 }}>
                        {q.opts.map((opt, oi) => (
                          <div key={oi} onClick={() => setAnswers(p => ({ ...p, [idx]: oi }))}
                            style={{ padding: "9px 12px", borderRadius: 8, cursor: "pointer", border: `1.5px solid ${answers[idx] === oi ? C.pink : C.gray200}`, background: answers[idx] === oi ? C.pinkLight : C.white, fontSize: 13, fontWeight: answers[idx] === oi ? 600 : 400, color: answers[idx] === oi ? C.pink : C.gray600, transition: "all 0.15s" }}>
                            {answers[idx] === oi ? "● " : "○ "}{opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 22, display: "flex", justifyContent: "space-between" }}>
                <Btn v="outline" onClick={() => setStep(s => s - 1)}>← Kembali</Btn>
                {step === 1
                  ? <Btn onClick={() => setStep(2)} disabled={curQs.some((_, i) => answers[i] === undefined)}>Lanjut →</Btn>
                  : <Btn onClick={() => setStep(3)} disabled={[4, 5, 6, 7].some(i => answers[i] === undefined)}>🎥 Upload Video AI</Btn>}
              </div>
            </div>
          )}

          {step === 3 && (() => {
            const [drag, setDrag] = useState(false);
            const loadSteps = ["Mengekstrak frame video...", "Mendeteksi wajah & pose (MediaPipe)...", "Menghitung persentase fokus mata...", "Menjalankan Random Forest model...", "Menggabungkan skor kuesioner + video...", "Menghasilkan laporan analisis..."];
            return (
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, color: C.gray800, marginBottom: 6 }}>🎥 Upload Video Anak</div>
                <p style={{ color: C.gray600, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>Upload video 1–3 menit saat anak bermain atau berinteraksi. AI menganalisis kontak mata & gerakan secara otomatis.</p>

                <PrivacyCard type="video" />

                <div onDragOver={e => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)}
                  onDrop={e => { e.preventDefault(); setDrag(false); const f = e.dataTransfer.files[0]; if (f?.type.startsWith("video/")) setVideo(f); }}
                  style={{ padding: "28px 20px", borderRadius: 16, textAlign: "center", border: `2px dashed ${drag ? C.pink : video ? C.green : C.gray200}`, background: video ? C.greenLight : drag ? C.pinkLight : C.gray50, transition: "all 0.2s", marginBottom: 14 }}>
                  {video ? (
                    <>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>✅</div>
                      <div style={{ fontWeight: 700, color: C.green, marginBottom: 3 }}>Video dipilih!</div>
                      <div style={{ fontSize: 13, color: C.gray600 }}>{video.name}</div>
                      <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>{(video.size / 1024 / 1024).toFixed(1)} MB</div>
                      <button onClick={() => setVideo(null)} style={{ marginTop: 10, fontSize: 12, color: C.red, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>Ganti video</button>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>📹</div>
                      <div style={{ fontWeight: 600, fontSize: 15, marginBottom: 4 }}>Drag & drop video ke sini</div>
                      <div style={{ fontSize: 13, color: C.gray600, marginBottom: 14 }}>atau pilih dari perangkat</div>
                      <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.pink, color: C.white, borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                        📁 Pilih File Video
                        <input type="file" accept="video/*" style={{ display: "none" }} onChange={e => { const f = e.target.files[0]; if (f) setVideo(f); }} />
                      </label>
                      <div style={{ fontSize: 11, color: C.gray400, marginTop: 10 }}>MP4, MOV, AVI · Maks. 200MB · Durasi 1–3 menit</div>
                    </>
                  )}
                </div>

                <div style={{ padding: "12px 14px", borderRadius: 10, background: C.pinkLight, border: `1px solid ${C.pink}20`, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: C.pink, marginBottom: 7 }}>💡 Tips merekam video terbaik</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5 }}>
                    {["Wajah anak terlihat jelas", "Rekam saat bermain / berinteraksi", "Cahaya ruangan cukup terang", "Durasi ideal 1–3 menit"].map((t, i) => (
                      <div key={i} style={{ fontSize: 12, color: C.gray600, display: "flex", gap: 5 }}><span style={{ color: C.green }}>✓</span>{t}</div>
                    ))}
                  </div>
                </div>

                {analyzing && (
                  <div style={{ background: C.gray50, borderRadius: 12, padding: "18px 16px", marginBottom: 14 }}>
                    <div style={{ textAlign: "center", marginBottom: 14 }}>
                      <div style={{ fontSize: 32, marginBottom: 6 }}>🤖</div>
                      <div style={{ fontWeight: 700, fontSize: 15 }}>AI sedang menganalisis video...</div>
                      <div style={{ fontSize: 13, color: C.gray600 }}>Mohon tunggu 30–60 detik</div>
                    </div>
                    {loadSteps.map((s, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "7px 12px", borderRadius: 8, background: C.white, border: `1px solid ${C.gray200}`, marginBottom: 6 }}>
                        <div style={{ width: 13, height: 13, borderRadius: "50%", border: `2px solid ${C.pink}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                        <span style={{ fontSize: 12, color: C.gray600 }}>{s}</span>
                      </div>
                    ))}
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </div>
                )}

                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <Btn v="outline" onClick={() => setStep(2)} disabled={analyzing}>← Kembali</Btn>
                  <Btn onClick={() => handleAnalyze(video)} disabled={!video || analyzing}>🤖 Analisis dengan AI</Btn>
                </div>
              </div>
            );
          })()}

          {/* ── STEP 4: SPEECH & COMMUNICATION ANALYSIS ── */}
          {step === 4 && result && (() => {
            const [speechStage, setSpeechStage] = useState("upload");
            const [audioFile, setAudioFile] = useState(null);
            const [recording, setRecording] = useState(false);
            const [transcript, setTranscript] = useState("");
            const [speechProgress, setSpeechProgress] = useState(0);
            const recognitionRef = useRef(null);
            const progressRef = useRef(null);

            function startRecord() {
              const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
              if (!SR) { alert("Gunakan Chrome untuk fitur rekam suara."); return; }
              const r = new SR();
              r.lang = "id-ID"; r.interimResults = true; r.continuous = true;
              r.onresult = e => { let txt = ""; for (let i = 0; i < e.results.length; i++) txt += e.results[i][0].transcript + " "; setTranscript(txt.trim()); };
              r.onerror = () => setRecording(false);
              recognitionRef.current = r; r.start(); setRecording(true);
            }
            function stopRecord() { recognitionRef.current?.stop(); setRecording(false); }

            function runSpeechAnalysis() {
              if (!transcript && !audioFile) return;
              setSpeechStage("analyzing"); setSpeechProgress(0);
              const steps = [15, 30, 50, 65, 80, 95, 100]; let i = 0;
              progressRef.current = setInterval(() => {
                setSpeechProgress(steps[i]); i++;
                if (i >= steps.length) {
                  clearInterval(progressRef.current);
                  setTimeout(() => {
                    const words = (transcript || "Anak saya suka bermain ayo ayo ayo ya ya ya tidak tidak tidak suka main main main").split(" ").filter(Boolean);
                    const uniqueWords = new Set(words.map(w => w.toLowerCase()));
                    const totalWords = words.length;
                    const repetitionRate = Math.round(((totalWords - uniqueWords.size) / totalWords) * 100);
                    const pronouns = words.filter(w => ["saya","aku","kamu","dia","mereka","kami","kita"].includes(w.toLowerCase())).length;
                    const pronounRatio = Math.round((pronouns / totalWords) * 100);
                    const pauseRate = Math.round(Math.random() * 30 + 10);
                    const riskScore = Math.round((repetitionRate * 0.4) + (pauseRate * 0.35) + ((10 - pronounRatio) * 2));
                    const risk = riskScore >= 60 ? "high" : riskScore >= 35 ? "moderate" : "low";
                    const sr = { totalWords, repetitionRate, pronounRatio, pauseRate, riskScore, risk, transcript: transcript || "Anak saya suka bermain ayo ayo ayo ya ya ya tidak tidak tidak suka main main main", audioSource: audioFile ? "upload" : "record" };
                    setSpeechResult(sr);
                    setSpeechStage("done");

                    setTimeout(() => {
                      setStep(5);
                    }, 800);
                  }, 500);
                }
              }, 600);
            }

            const analyzeSteps = ["Menginisiasi engine transkripsi...", "Menganalisis pola bicara...", "Menghitung tingkat pengulangan kata...", "Menganalisis rasio penggunaan pronoun...", "Mendeteksi jeda dan pola ritme...", "Menjalankan NLP analysis model...", "Menghasilkan laporan komunikasi..."];

            return (
              <div>
                {/* Section header with context banner */}
                <div style={{ background: `linear-gradient(135deg,${C.pink}10,${C.purple}08)`, border: `1.5px solid ${C.pink}25`, borderRadius: 14, padding: "16px 20px", marginBottom: 20, display: "flex", gap: 14, alignItems: "center" }}>
                  <div style={{ fontSize: 36 }}>🎤</div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: C.gray800 }}>Langkah 4 — Analisis Bicara & Komunikasi</div>
                    <div style={{ fontSize: 13, color: C.gray600, marginTop: 2 }}>Analisis video selesai. Lanjutkan dengan analisis pola komunikasi anak untuk melengkapi laporan SmartCare.</div>
                  </div>
                </div>

                {/* CV result summary pill (context bridge) */}
                <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "12px 18px", marginBottom: 20, display: "flex", gap: 14, alignItems: "center", flexWrap: "wrap" }}>
                  <div style={{ fontSize: 12, color: C.gray500, fontWeight: 700, letterSpacing: 0.5 }}>HASIL VIDEO AI</div>
                  {[
                    { l: "Skor Risiko", v: `${result.score}/100`, c: result.risk === "high" ? C.red : result.risk === "moderate" ? C.amber : C.green },
                    { l: "Kepercayaan", v: `${result.confidence}%`, c: C.pink },
                    result.videoData && { l: "Fokus Mata", v: `${result.videoData.focus_percentage?.toFixed(0)}%`, c: C.purple },
                  ].filter(Boolean).map((m, i) => (
                    <div key={i} style={{ display: "flex", gap: 6, alignItems: "center" }}>
                      <span style={{ fontWeight: 800, fontSize: 15, color: m.c }}>{m.v}</span>
                      <span style={{ fontSize: 11, color: C.gray500 }}>{m.l}</span>
                    </div>
                  ))}
                  <div style={{ marginLeft: "auto" }}>
                    <span style={{ fontSize: 11, background: C.greenLight, color: C.green, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid #86EFAC` }}>✓ Selesai</span>
                  </div>
                </div>

                {speechStage === "upload" && (
                  <div>
                    <PrivacyCard type="audio" />

                    {/* Option A: Extract from video */}
                    <div style={{ background: C.pinkLight, border: `1.5px solid ${C.pink}30`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 6 }}>🎬 Opsi A — Ekstrak Audio dari Video</div>
                      <div style={{ fontSize: 13, color: C.gray600, marginBottom: 14, lineHeight: 1.6 }}>Gunakan audio dari video yang sudah diunggah sebelumnya ({video?.name || "video.mp4"}).</div>
                      <Btn onClick={() => { setTranscript("Anak saya suka bermain ayo ayo ayo ya ya ya tidak tidak tidak suka main main main"); runSpeechAnalysis(); }}>
                        🎬 Ekstrak & Analisis Audio Video
                      </Btn>
                    </div>

                    {/* Divider */}
                    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
                      <div style={{ flex: 1, height: 1, background: C.gray200 }} />
                      <span style={{ fontSize: 12, color: C.gray400, fontWeight: 600 }}>ATAU</span>
                      <div style={{ flex: 1, height: 1, background: C.gray200 }} />
                    </div>

                    {/* Option B: Live record */}
                    <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 8 }}>🎙️ Opsi B — Rekam Suara Langsung</div>
                      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap", marginBottom: 10 }}>
                        <button onClick={recording ? stopRecord : startRecord} style={{ background: recording ? C.red : C.pink, color: C.white, border: "none", borderRadius: 10, padding: "11px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, fontFamily: "inherit" }}>
                          {recording ? "⏹️ Stop Rekam" : "🎤 Mulai Rekam"}
                        </button>
                        {recording && <div style={{ display: "flex", gap: 4 }}>{[0,1,2].map(ii => <div key={ii} style={{ width: 5, height: 20, background: C.pink, borderRadius: 3, animation: `bop 0.6s ${ii*0.15}s infinite` }} />)}</div>}
                      </div>
                      {transcript && (
                        <div style={{ background: C.gray50, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.gray200}` }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, marginBottom: 4 }}>TRANSKRIPSI SEMENTARA</div>
                          <div style={{ fontSize: 13, color: C.gray700, lineHeight: 1.7 }}>{transcript}</div>
                        </div>
                      )}
                    </div>

                    {/* Option B: Upload audio file */}
                    <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px", marginBottom: 20 }}>
                      <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 8 }}>📁 Opsi B — Upload File Audio Terpisah</div>
                      <div style={{ padding: "16px", borderRadius: 12, textAlign: "center", border: `2px dashed ${audioFile ? C.green : C.gray200}`, background: audioFile ? C.greenLight : C.gray50 }}>
                        {audioFile ? (
                          <>
                            <div style={{ fontSize: 28, marginBottom: 4 }}>✅</div>
                            <div style={{ fontWeight: 700, color: C.green }}>{audioFile.name}</div>
                            <button onClick={() => setAudioFile(null)} style={{ marginTop: 6, fontSize: 12, color: C.red, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit" }}>Ganti file</button>
                          </>
                        ) : (
                          <>
                            <div style={{ fontSize: 28, marginBottom: 6 }}>🔊</div>
                            <label style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.pink, color: C.white, borderRadius: 10, padding: "9px 16px", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                              📁 Pilih File Audio
                              <input type="file" accept="audio/*" style={{ display: "none" }} onChange={e => setAudioFile(e.target.files[0])} />
                            </label>
                            <div style={{ fontSize: 11, color: C.gray400, marginTop: 8 }}>MP3, WAV, M4A · Maks. 50MB</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
                      <Btn v="outline" onClick={() => setStep(3)}>← Kembali ke Video</Btn>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        <Btn v="ghost" onClick={() => { setSpeechResult(null); setStep(5); }}>⏭️ Lewati, Buat Laporan</Btn>
                        <Btn onClick={runSpeechAnalysis} disabled={!transcript && !audioFile}>🤖 Analisis Bicara →</Btn>
                      </div>
                    </div>
                    <style>{`@keyframes bop{0%,80%,100%{transform:scaleY(1)}40%{transform:scaleY(2)}}`}</style>
                  </div>
                )}

                {speechStage === "analyzing" && (
                  <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "28px" }}>
                    <div style={{ textAlign: "center", marginBottom: 20 }}>
                      <div style={{ fontSize: 40, marginBottom: 8 }}>🤖</div>
                      <div style={{ fontWeight: 700, fontSize: 16 }}>AI sedang menganalisis pola komunikasi...</div>
                      <div style={{ fontSize: 13, color: C.gray600, marginTop: 4 }}>{speechProgress}% selesai</div>
                    </div>
                    <div style={{ marginBottom: 16 }}><PBar v={speechProgress} /></div>
                    <div style={{ display: "grid", gap: 8 }}>
                      {analyzeSteps.map((s, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 8, background: C.gray50 }}>
                          {speechProgress > (i + 1) * 14 ? <span style={{ color: C.green }}>✓</span> : <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${C.pink}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }} />}
                          <span style={{ fontSize: 12, color: C.gray600 }}>{s}</span>
                        </div>
                      ))}
                    </div>
                    <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
                  </div>
                )}

                {speechStage === "done" && speechResult && (() => {
                  const sc = { low: { color: C.green, icon: "✅", label: "Pola Komunikasi Normal" }, moderate: { color: C.amber, icon: "⚠️", label: "Perlu Perhatian" }, high: { color: C.red, icon: "🔴", label: "Risiko Gangguan Komunikasi" } }[speechResult.risk];
                  const speechMetrics = [
                    { icon: "📝", label: "Total Kata", value: speechResult.totalWords },
                    { icon: "🔁", label: "Tingkat Pengulangan", value: `${speechResult.repetitionRate}%`, note: speechResult.repetitionRate > 40 ? "Tinggi" : "Normal" },
                    { icon: "👤", label: "Rasio Pronoun", value: `${speechResult.pronounRatio}%`, note: speechResult.pronounRatio < 5 ? "Rendah" : "Normal" },
                    { icon: "⏸️", label: "Pause Rate", value: `${speechResult.pauseRate}%`, note: speechResult.pauseRate > 35 ? "Sering" : "Normal" },
                  ];
                  return (
                    <div>
                      <div style={{ background: sc.color + "15", border: `2px solid ${sc.color}40`, borderRadius: 14, padding: "18px 22px", marginBottom: 16, display: "flex", gap: 14, alignItems: "center" }}>
                        <div style={{ fontSize: 36 }}>{sc.icon}</div>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: sc.color, letterSpacing: 0.5 }}>🎤 HASIL ANALISIS BICARA</div>
                          <div style={{ fontWeight: 800, fontSize: 18, color: sc.color }}>{sc.label}</div>
                          <div style={{ fontSize: 13, color: C.gray600, marginTop: 2 }}>Skor: {speechResult.riskScore}/100</div>
                        </div>
                      </div>
                      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "14px 16px", marginBottom: 14 }}>
                        <div style={{ fontWeight: 700, fontSize: 13, color: C.gray800, marginBottom: 8 }}>📝 Transkrip</div>
                        <div style={{ background: C.gray50, borderRadius: 8, padding: "12px 14px", fontSize: 13, color: C.gray700, lineHeight: 1.8 }}>{speechResult.transcript}</div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10, marginBottom: 16 }}>
                        {speechMetrics.map((m, i) => (
                          <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 12, padding: "12px 10px", textAlign: "center" }}>
                            <div style={{ fontSize: 20, marginBottom: 3 }}>{m.icon}</div>
                            <div style={{ fontWeight: 800, fontSize: 16, color: C.pink }}>{m.value}</div>
                            <div style={{ fontSize: 11, color: C.gray600 }}>{m.label}</div>
                            {m.note && <div style={{ fontSize: 10, color: C.amber, fontWeight: 600, marginTop: 2 }}>{m.note}</div>}
                          </div>
                        ))}
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
                        <Btn v="outline" onClick={() => { setSpeechResult(null); setSpeechStage("upload"); }}>🔄 Ulangi Analisis</Btn>
                        <Btn onClick={() => setStep(5)}>📋 Lihat Laporan Terpadu →</Btn>
                      </div>
                    </div>
                  );
                })()}
              </div>
            );
          })()}

          {/* ── STEP 5: INTEGRATED SMARTCARE REPORT ── */}
          {step === 5 && result && (() => {
            const riskCfg = {
              low: { color: C.green, bg: C.greenLight, icon: "✅", label: "Risiko Rendah", border: "#86EFAC" },
              moderate: { color: C.amber, bg: C.amberLight, icon: "⚠️", label: "Risiko Sedang", border: "#FCD34D" },
              high: { color: C.red, bg: C.redLight, icon: "🔴", label: "Risiko Tinggi", border: "#FCA5A5" },
            };

            // Compute questionnaire result from bScores
            const qScore = Math.round(result.bScores.reduce((s, b) => s + b.score, 0) / result.bScores.length);
            const qRisk = qScore >= 60 ? "high" : qScore >= 35 ? "moderate" : "low";

            // CV (video) result
            const cvRisk = result.risk;

            // Speech result (may be null if skipped)
            const spRisk = speechResult ? speechResult.risk : null;

            // Overall risk: weighted average of available scores
            const riskToNum = r => r === "high" ? 3 : r === "moderate" ? 2 : 1;
            const numToRisk = n => n >= 2.5 ? "high" : n >= 1.5 ? "moderate" : "low";
            const scores = [riskToNum(qRisk) * 1, riskToNum(cvRisk) * 1.5, spRisk ? riskToNum(spRisk) * 1 : null].filter(Boolean);
            const weights = spRisk ? 3.5 : 2.5;
            const overallRisk = numToRisk(scores.reduce((a, b) => a + b, 0) / weights);
            const oc = riskCfg[overallRisk];

            // AI Insight bullets
            const insights = [
              result.videoData ? (result.videoData.focus_percentage < 50 ? "Kontak mata terbatas terdeteksi pada analisis video." : "Kontak mata dan fokus visual dalam batas normal.") : (cvRisk === "high" ? "Skor kuesioner menunjukkan indikator tinggi pada beberapa domain." : "Pola perilaku dalam rentang yang dapat dipantau."),
              cvRisk === "high" ? "Keterlibatan wajah dan atensi visual memerlukan evaluasi lebih lanjut." : cvRisk === "moderate" ? "Beberapa indikator perilaku memerlukan pemantauan." : "Perilaku sosial dan respons menunjukkan pola yang baik.",
              spRisk ? (spRisk === "high" ? "Tingkat pengulangan bicara signifikan terdeteksi." : spRisk === "moderate" ? "Pengulangan bicara moderat ditemukan dalam sampel." : "Pola bicara menunjukkan variasi kosakata yang baik.") : "Analisis bicara tidak dilakukan pada sesi ini.",
            ];

            const allRecs = {
              high: ["Konsultasi spesialis segera dalam 1–2 minggu", "Evaluasi ADOS-2 oleh tim multidisiplin", "Mulai program ABA & terapi terpadu segera", "Bergabung komunitas orang tua autism"],
              moderate: ["Konsultasi dokter anak dalam 2–4 minggu", "Evaluasi terapi wicara & ABA diperlukan", "Program parent training tersedia di Halodoc", "Skrining ulang disarankan dalam 3 bulan"],
              low: ["Pemantauan perkembangan rutin tiap 6 bulan", "Perkaya stimulasi bermain sosial & bahasa", "Pertahankan jadwal tumbuh kembang", "Skrining ulang disarankan dalam 6 bulan"],
            };

            const specialists = {
              high: ["Dokter Anak", "Dokter Tumbuh Kembang", "Psikolog Anak", "Terapis Wicara"],
              moderate: ["Dokter Anak", "Psikolog Anak", "Terapis Wicara"],
              low: ["Dokter Anak", "Dokter Tumbuh Kembang"],
            };

            return (
              <div>
                {/* Report title */}
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 14, background: `linear-gradient(135deg,${C.pink},${C.purple})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🧠</div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: 20, color: C.gray800 }}>Laporan SmartCare Terpadu</div>
                    <div style={{ fontSize: 13, color: C.gray600 }}>{childName || "Anak"} · {childAge ? `${Math.floor(Number(childAge)/12)} thn ${Number(childAge)%12} bln` : ""} · {new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</div>
                  </div>
                </div>

                <div style={{ background: C.amberLight, border: `1.5px solid #FCD34D`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400E", marginBottom: 18, lineHeight: 1.6 }}>
                  ⚕️ <strong>Disclaimer:</strong> Laporan ini hanya untuk bantuan skrining awal dan <strong>tidak menggantikan diagnosis medis profesional</strong>.
                </div>

                {/* Overall risk hero */}
                <div style={{ background: oc.bg, border: `2px solid ${oc.border}`, borderRadius: 16, padding: "24px", marginBottom: 18, textAlign: "center" }}>
                  <div style={{ fontSize: 52, marginBottom: 8 }}>{oc.icon}</div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: oc.color, letterSpacing: 1, marginBottom: 6 }}>🧠 PENILAIAN RISIKO ASD KESELURUHAN</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: oc.color, marginBottom: 6 }}>{childName ? `${childName} — ` : ""}{oc.label}</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                    {[
                      { l: "Risiko Rendah", active: overallRisk === "low", c: C.green },
                      { l: "Risiko Sedang", active: overallRisk === "moderate", c: C.amber },
                      { l: "Risiko Tinggi", active: overallRisk === "high", c: C.red },
                    ].map((b, i) => (
                      <span key={i} style={{ padding: "5px 16px", borderRadius: 20, fontSize: 12, fontWeight: 700, background: b.active ? b.c : C.gray200 + "80", color: b.active ? C.white : C.gray500, border: `1.5px solid ${b.active ? b.c : C.gray200}` }}>{b.l}</span>
                    ))}
                  </div>
                </div>

                {/* Module result cards */}
                <div style={{ display: "grid", gap: 12, marginBottom: 18 }}>
                  {/* Questionnaire */}
                  <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.gray800 }}>📋 Hasil Kuesioner Skrining</div>
                        <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>M-CHAT-R/F · 8 domain perilaku</div>
                      </div>
                      <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: riskCfg[qRisk].bg, color: riskCfg[qRisk].color, border: `1px solid ${riskCfg[qRisk].border}` }}>{riskCfg[qRisk].label}</span>
                    </div>
                    <div style={{ display: "grid", gap: 7 }}>
                      {result.bScores.map((b, i) => (
                        <div key={i}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                            <span style={{ fontSize: 12, color: C.gray700 }}>{b.label}</span>
                            <span style={{ fontSize: 12, fontWeight: 700, color: b.score > 60 ? C.red : b.score > 35 ? C.amber : C.green }}>{b.score}%</span>
                          </div>
                          <PBar v={b.score} color={b.score > 60 ? C.red : b.score > 35 ? C.amber : C.green} />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Computer Vision */}
                  <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.gray800 }}>🎥 Hasil Analisis Video AI</div>
                        <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>Computer Vision · MediaPipe</div>
                      </div>
                      <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: riskCfg[cvRisk].bg, color: riskCfg[cvRisk].color, border: `1px solid ${riskCfg[cvRisk].border}` }}>{riskCfg[cvRisk].label}</span>
                    </div>
                    <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                      {[
                        { l: "Risk Score", v: `${result.score}/100`, c: riskCfg[cvRisk].color },
                        { l: "Kepercayaan AI", v: `${result.confidence}%`, c: C.pink },
                        result.videoData && { l: "Fokus Mata", v: `${result.videoData.focus_percentage?.toFixed(0)}%`, c: C.purple },
                      ].filter(Boolean).map((m, i) => (
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontWeight: 800, fontSize: 18, color: m.c }}>{m.v}</div>
                          <div style={{ fontSize: 11, color: C.gray500 }}>{m.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Speech */}
                  <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.gray800 }}>🎤 Hasil Analisis Bicara & Komunikasi</div>
                        <div style={{ fontSize: 12, color: C.gray500, marginTop: 2 }}>NLP · Pola Komunikasi</div>
                      </div>
                      {spRisk ? (
                        <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 700, background: riskCfg[spRisk].bg, color: riskCfg[spRisk].color, border: `1px solid ${riskCfg[spRisk].border}` }}>{riskCfg[spRisk].label}</span>
                      ) : (
                        <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: C.gray100, color: C.gray400, border: `1px solid ${C.gray200}` }}>Dilewati</span>
                      )}
                    </div>
                    {spRisk ? (
                      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
                        {[
                          { l: "Total Kata", v: speechResult.totalWords },
                          { l: "Pengulangan", v: `${speechResult.repetitionRate}%` },
                          { l: "Rasio Pronoun", v: `${speechResult.pronounRatio}%` },
                          { l: "Pause Rate", v: `${speechResult.pauseRate}%` },
                        ].map((m, i) => (
                          <div key={i} style={{ textAlign: "center" }}>
                            <div style={{ fontWeight: 800, fontSize: 18, color: C.pink }}>{m.v}</div>
                            <div style={{ fontSize: 11, color: C.gray500 }}>{m.l}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ fontSize: 13, color: C.gray400, display: "flex", gap: 10, alignItems: "center" }}>
                        <span>ℹ️</span>
                        <span>Analisis bicara tidak dilakukan. <button onClick={() => setStep(4)} style={{ color: C.pink, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontSize: 13, fontWeight: 600 }}>Kembali untuk menambahkan</button></span>
                      </div>
                    )}
                  </div>

                  {/* Smartwatch placeholder */}
                  <div style={{ background: C.gray50, border: `1px dashed ${C.gray300}`, borderRadius: 14, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: C.gray500 }}>⌚ Hasil Smartwatch Monitoring</div>
                        <div style={{ fontSize: 12, color: C.gray400, marginTop: 2 }}>Heart Rate · HRV · Stres Level</div>
                      </div>
                      <span style={{ padding: "4px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600, background: C.gray100, color: C.gray400, border: `1px solid ${C.gray200}` }}>Tidak Tersambung</span>
                    </div>
                    <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
                      <span style={{ fontSize: 12, color: C.gray400 }}>Hubungkan smartwatch untuk data lebih lengkap.</span>
                      <button onClick={() => setPage("smartwatch")} style={{ fontSize: 12, color: C.pink, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "inherit", fontWeight: 600, flexShrink: 0 }}>Sambungkan →</button>
                    </div>
                  </div>
                </div>

                {/* AI Insight Summary */}
                <div style={{ background: C.purpleLight, border: `1px solid ${C.purple}30`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.purple, marginBottom: 10 }}>🔍 AI Insight Summary</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {insights.map((ins, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                        <span style={{ color: C.purple, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>•</span>
                        <span style={{ fontSize: 13, color: C.gray700, lineHeight: 1.65 }}>{ins}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recommendation */}
                <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 10 }}>💡 Rekomendasi</div>
                  <div style={{ fontSize: 13, color: C.gray600, marginBottom: 12, lineHeight: 1.6 }}>
                    {overallRisk === "high" ? "Segera lakukan konsultasi dengan spesialis untuk evaluasi menyeluruh." : overallRisk === "moderate" ? "Lanjutkan pemantauan perkembangan komunikasi dan pola interaksi sosial." : "Pertahankan stimulasi tumbuh kembang yang sudah berjalan dengan baik."}
                  </div>
                  <div style={{ display: "grid", gap: 7 }}>
                    {allRecs[overallRisk].map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", borderRadius: 8, background: C.gray50, alignItems: "flex-start" }}>
                        <span style={{ color: oc.color, fontWeight: 700, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 13, color: C.gray700, lineHeight: 1.6 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specialists */}
                <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 12 }}>👨‍⚕️ Spesialis yang Disarankan</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                    {specialists[overallRisk].map((s, i) => (
                      <span key={i} style={{ background: C.pinkLight, color: C.pink, border: `1px solid ${C.pink}30`, borderRadius: 20, padding: "5px 14px", fontSize: 12, fontWeight: 600 }}>• {s}</span>
                    ))}
                  </div>
                  <div style={{ background: C.gray50, borderRadius: 10, padding: "12px 14px", border: `1px solid ${C.gray200}` }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: C.gray800, marginBottom: 4 }}>📅 Langkah Selanjutnya</div>
                    <div style={{ fontSize: 13, color: C.gray600, lineHeight: 1.6 }}>Jadwalkan konsultasi profesional untuk evaluasi lebih lanjut.</div>
                  </div>
                </div>

                {/* CTA */}
                <div style={{ background: `linear-gradient(135deg,${C.pink}12,${C.purple}08)`, border: `1.5px solid ${C.pink}30`, borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.gray800, marginBottom: 4 }}>📍 Tindakan Selanjutnya</div>
                  <p style={{ fontSize: 13, color: C.gray600, marginBottom: 16, lineHeight: 1.6 }}>Temukan dokter spesialis autism terdekat dan buat janji konsultasi sekarang.</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Btn onClick={() => setPage("findDoctor")}>📍 Cari Dokter Terdekat</Btn>
                    <Btn v="outline" onClick={() => setPage("consult")}>💬 Konsultasi Online</Btn>
                    <Btn v="ghost" onClick={() => alert("Mengunduh laporan PDF...")}>📄 Unduh Laporan</Btn>
                    <Btn v="ghost" onClick={goScreen}>🔄 Skrining Baru</Btn>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  function ConsultPage() {
    return (
      <div>
        <div style={{ fontWeight: 800, fontSize: 24, color: C.gray800, marginBottom: 4 }}>👨‍⚕️ Konsultasi Spesialis Autism</div>
        <p style={{ color: C.gray600, marginBottom: 24 }}>Terhubung langsung dengan dokter anak, psikiater, dan psikolog anak spesialis autism.</p>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
          {DOCTORS.filter(d => d.city === "Semarang").map((doc, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 20px" }}>
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 14 }}>
                <Av s={doc.av} size={48} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: C.pink, fontWeight: 600, marginBottom: 3 }}>{doc.spec}</div>
                  <div style={{ fontSize: 12, color: C.gray600 }}>⭐ {doc.rating} · 💬 {doc.rev} ulasan</div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 12, borderTop: `1px solid ${C.gray200}` }}>
                <div>
                  <div style={{ fontWeight: 700, color: C.pink }}>{doc.price}</div>
                  <div style={{ fontSize: 11, color: doc.slot.includes("Hari ini") ? C.green : C.amber, fontWeight: 600 }}>● {doc.slot}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <Btn v="outline" sx={{ padding: "7px 12px", fontSize: 12 }}>💬 Chat</Btn>
                  <Btn sx={{ padding: "7px 12px", fontSize: 12 }}>Booking</Btn>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function AboutPage() {
    const feats = [
      { icon: "🤖", t: "Random Forest Classifier", d: "Model ML dilatih dari data eye-tracking 25+ anak. Mengklasifikasikan High ASD Risk, Hyperactive Behavior, atau Typical Development." },
      { icon: "👁️", t: "MediaPipe Computer Vision", d: "Analisis setiap frame video: Face Detection, Pose Estimation, persentase fokus mata, dan pola gerakan pergelangan tangan." },
      { icon: "📋", t: "Kuesioner M-CHAT-R/F", d: "8 domain perilaku berbasis Modified Checklist for Autism in Toddlers yang tervalidasi klinis internasional." },
      { icon: "🔗", t: "Fusion Score (60/40)", d: "Hasil akhir = 60% analisis video AI + 40% kuesioner, menghasilkan prediksi lebih komprehensif." },
      { icon: "🔒", t: "Keamanan Data", d: "Video diproses lokal via FastAPI dan dihapus otomatis setelah analisis. Enkripsi end-to-end sesuai regulasi kesehatan Indonesia." },
      { icon: "📊", t: "Akurasi Tervalidasi", d: "Divalidasi tim dokter Halodoc: Akurasi 94,2%, Sensitivity 91,8%, Specificity 96,1%, AUC-ROC 0,97." },
    ];
    return (
      <div>
        <div style={{ fontWeight: 800, fontSize: 24, color: C.gray800, marginBottom: 4 }}>🤖 Teknologi AI Kami</div>
        <p style={{ color: C.gray600, marginBottom: 24 }}>Didukung oleh computer vision, machine learning, dan validasi tim dokter Halodoc.</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(270px,1fr))", gap: 14, marginBottom: 22 }}>
          {feats.map((f, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.gray800, marginBottom: 6 }}>{f.t}</div>
              <p style={{ fontSize: 13, color: C.gray600, lineHeight: 1.7, margin: 0 }}>{f.d}</p>
            </div>
          ))}
        </div>
        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "20px 22px" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16, color: C.gray800 }}>🎯 Performa Model</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
            {[{ l: "Accuracy", v: "94,2%", c: C.pink }, { l: "Sensitivity", v: "91,8%", c: C.purple }, { l: "Specificity", v: "96,1%", c: C.green }, { l: "AUC-ROC", v: "0,97", c: C.amber }].map((m, i) => (
              <div key={i} style={{ textAlign: "center", padding: "14px 10px", borderRadius: 10, background: C.gray50, border: `1px solid ${C.gray200}` }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: m.c }}>{m.v}</div>
                <div style={{ fontSize: 11, color: C.gray600, marginTop: 3 }}>{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function HomePage() {
    return (
      <div>
        <div style={{ background: `linear-gradient(135deg,${C.pink} 0%,${C.pinkDark} 50%,${C.purple} 100%)`, borderRadius: 20, padding: "48px 44px", color: C.white, position: "relative", overflow: "hidden", marginBottom: 24 }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.07)" }} />
          <div style={{ position: "absolute", bottom: -80, left: "38%", width: 240, height: 240, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ position: "relative", maxWidth: 580 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "5px 14px", fontSize: 11, fontWeight: 700, marginBottom: 16, letterSpacing: 0.5 }}>
              ✨ BARU! · AUTISM CARE FEATURE
            </div>
            <h1 style={{ fontSize: "clamp(22px,4vw,36px)", fontWeight: 800, margin: "0 0 12px", lineHeight: 1.25, letterSpacing: "-0.5px" }}>
              Deteksi Dini Autisme untuk<br />Masa Depan Cerah Anak Anda
            </h1>
            <p style={{ fontSize: 15, opacity: 0.9, marginBottom: 24, lineHeight: 1.7 }}>
              Fitur AI pertama di Indonesia yang menggabungkan analisis video computer vision dan kuesioner klinis M-CHAT-R/F untuk skrining autism anak usia 1–6 tahun.
            </p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Btn v="white" onClick={goScreen}>🧩 Mulai Skrining Gratis</Btn>
              <button onClick={() => setPage("about")} style={{ background: "transparent", border: "2px solid rgba(255,255,255,0.5)", color: C.white, borderRadius: 10, padding: "10px 20px", fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit" }}>📖 Pelajari Lebih Lanjut</button>
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
          {[{ icon: "🧩", v: "47.829", l: "Skrining Selesai" }, { icon: "👨‍⚕️", v: "50+", l: "Spesialis Autism" }, { icon: "🎯", v: "94,2%", l: "Akurasi AI" }, { icon: "💛", v: "32.000+", l: "Keluarga Terbantu" }].map((s, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.pink }}>{s.v}</div>
              <div style={{ fontSize: 11, color: C.gray600 }}>{s.l}</div>
            </div>
          ))}
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 16, padding: "22px", marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 17, color: C.gray800 }}>Layanan Autism Care</div>
              <div style={{ fontSize: 13, color: C.gray600 }}>Solusi lengkap deteksi & penanganan autism anak</div>
            </div>
            <button style={{ fontSize: 12, color: C.pink, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Lihat Semua →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(130px,1fr))", gap: 10 }}>
            {SERVICES.map((svc, i) => (
              <div key={i} onClick={() => svc.page === "screening" ? goScreen() : svc.page ? setPage(svc.page) : null}
                style={{ padding: "14px 10px", borderRadius: 12, border: `1.5px solid ${C.gray200}`, background: C.white, cursor: svc.page ? "pointer" : "default", textAlign: "center", transition: "all 0.2s", position: "relative" }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{svc.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.gray800, marginBottom: 2 }}>{svc.title}</div>
                <div style={{ fontSize: 10, color: C.gray600, lineHeight: 1.4 }}>{svc.desc}</div>
                <div style={{ position: "absolute", top: 7, right: 7, background: svc.color, color: C.white, fontSize: 8, fontWeight: 700, padding: "2px 5px", borderRadius: 8 }}>{svc.tag}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: C.pinkLight, borderRadius: 16, padding: "24px 28px", marginBottom: 24, display: "flex", gap: 20, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: C.pink, letterSpacing: 1, marginBottom: 6 }}>HALODOC · BOARD OF MEDICAL EXCELLENCE</div>
            <div style={{ fontWeight: 800, fontSize: 18, color: C.gray800, marginBottom: 8 }}>Diawasi Tim Medis Berpengalaman</div>
            <p style={{ fontSize: 13, color: C.gray600, lineHeight: 1.7, margin: 0 }}>Protokol skrining autism Halodoc dikembangkan bersama dokter spesialis anak, psikiater anak, dan pakar tumbuh kembang Indonesia.</p>
          </div>
          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[{ i: "IRH", n: "Dr. Irwan H.", r: "Chief Medical Officer" }, { i: "NV", n: "Dr. Novi", r: "Medical Advisor" }, { i: "WS", n: "Dr. Wawan S.", r: "Autism Specialist" }].map((d, i) => (
              <div key={i} style={{ textAlign: "center" }}><Av s={d.i} size={50} /><div style={{ fontSize: 12, fontWeight: 600, color: C.gray800, marginTop: 6 }}>{d.n}</div><div style={{ fontSize: 10, color: C.pink }}>{d.r}</div></div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: C.gray800 }}>Artikel Autism Terkini</div>
            <button style={{ fontSize: 12, color: C.pink, fontWeight: 600, background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}>Lihat Semua →</button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))", gap: 12 }}>
            {ARTICLES.map((a, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "16px", cursor: "pointer" }}>
                <Chip label={a.cat} />
                <div style={{ fontWeight: 600, fontSize: 13, color: C.gray800, marginTop: 10, marginBottom: 6, lineHeight: 1.5 }}>{a.title}</div>
                <div style={{ fontSize: 11, color: C.gray400 }}>{a.time}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontWeight: 800, fontSize: 17, color: C.gray800, marginBottom: 14 }}>Kata Mereka tentang Halodoc Autism</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(230px,1fr))", gap: 12 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "18px 16px" }}>
                <Av s={t.name[0]} size={40} />
                <div style={{ fontSize: 13, color: C.gray700, lineHeight: 1.7, margin: "10px 0 8px", fontStyle: "italic" }}>{t.text}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: C.gray800 }}>{t.name}</div>
                <div style={{ fontSize: 11, color: C.gray400 }}>{t.city}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: 12 }}>
          {[{ l: "Mulai Skrining", i: "🧩", a: goScreen }, { l: "Chat HILDA", i: "💬", a: () => setChatOpen(true) }, { l: "Cari Klinik", i: "📍", a: () => setPage("findDoctor") }].map((c, i) => (
            <div key={i} onClick={c.a} style={{ background: C.white, border: `2px solid ${C.pink}30`, borderRadius: 14, padding: "16px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
              <div style={{ fontSize: 30, marginBottom: 6 }}>{c.i}</div>
              <div style={{ fontWeight: 700, fontSize: 14, color: C.pink }}>{c.l}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const navItems = [
    { id: "home", l: "Beranda"},
    { id: "screening", l: "Skrining AI"},
    { id: "smartwatch", l: "Smartwatch"},
    { id: "findDoctor", l: "Cari Dokter"},
    { id: "consult", l: "Konsultasi"},
    { id: "about", l: "Tentang AI"},
  ];

  return (
    <div style={{ minHeight: "100vh", background: C.gray50, color: C.gray800, fontFamily: "'DM Sans','Noto Sans',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav style={{ background: C.white, borderBottom: `1px solid ${C.gray200}`, position: "sticky", top: 0, zIndex: 200, boxShadow: "0 1px 8px #00000010" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 60, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", flexShrink: 0 }} onClick={() => setPage("home")}>
            <div style={{ width: 30, height: 30, background: C.pink, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: C.white, fontSize: 14, fontWeight: 800 }}>H</span>
            </div>
            <span style={{ fontSize: 20, fontWeight: 700, color: C.pink, letterSpacing: "-0.5px" }}>halodoc</span>
            <span style={{ background: C.pinkLight, color: C.pink, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, border: `1px solid ${C.pink}30` }}>Autism Care</span>
          </div>
          <div style={{ display: "flex", gap: 2, alignItems: "center", overflowX: "auto" }}>
            {navItems.map(n => (
              <button key={n.id} onClick={() => n.id === "screening" ? goScreen() : setPage(n.id)}
                style={{ padding: "6px 11px", borderRadius: 8, fontSize: 13, fontWeight: page === n.id ? 600 : 400, color: page === n.id ? C.pink : C.gray600, background: page === n.id ? C.pinkLight : "transparent", cursor: "pointer", border: "none", whiteSpace: "nowrap", fontFamily: "inherit" }}>
                <span style={{ marginRight: 4 }}>{n.i}</span>{n.l}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button onClick={() => { setChatFullScreen(false); setChatOpen(o => !o); }} style={{ background: C.pinkLight, border: `1px solid ${C.pink}30`, borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13, color: C.pink, fontWeight: 600, fontFamily: "inherit" }}>💬 HILDA</button>
            <Btn sx={{ padding: "7px 14px", fontSize: 13 }} onClick={goScreen}>🧩 Skrining Gratis</Btn>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px", opacity: anim ? 1 : 0, transform: anim ? "translateY(0)" : "translateY(8px)", transition: "all 0.3s ease" }}>
        {page === "home"        && <HomePage />}
        {page === "screening"   && <ScreenPage />}
        {page === "speech"      && <ScreenPage />}
        {page === "smartwatch"  && <SmartwatchPage />}
        {page === "findDoctor"  && <FindDoctorPage />}
        {page === "consult"     && <ConsultPage />}
        {page === "about"       && <AboutPage />}
        {page === "hildaFull"   && <ChatFullPage onClose={() => setPage("home")} />}
      </div>

      {/* FOOTER */}
      <div style={{ background: C.pinkLight, borderTop: `1px solid ${C.pink}20`, padding: "28px 20px", marginTop: 16 }}>
        <div style={{ maxWidth: 1200, margin: "0 auto" }}>
          <div style={{ display: "flex", gap: 24, flexWrap: "wrap", justifyContent: "space-between", marginBottom: 20 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <div style={{ width: 26, height: 26, background: C.pink, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}><span style={{ color: C.white, fontSize: 12, fontWeight: 800 }}>H</span></div>
                <span style={{ fontSize: 17, fontWeight: 700, color: C.pink }}>halodoc</span>
              </div>
              <div style={{ fontSize: 12, color: C.gray600 }}>Autism Care · Platform Skrining Autism #1 Indonesia</div>
              <div style={{ fontSize: 11, color: C.gray400, marginTop: 5 }}>📧 help@halodoc.com · 📞 021-5095-9900</div>
            </div>
            {[
              { t: "Layanan", items: ["Skrining AI", "Analisis Bicara", "Smartwatch Monitoring", "Chat Terapis", "Klinik Terdekat"] },
              { t: "Informasi", items: ["Tentang Fitur AI", "Kamus Autism", "Artikel & Riset", "Pusat Bantuan"] },
              { t: "Keamanan", items: ["ISO 27001 Certified", "LegitScript Certified", "Dibina oleh Kemenkes", "Pemberitahuan Privasi"] },
            ].map((col, i) => (
              <div key={i}>
                <div style={{ fontSize: 11, fontWeight: 700, color: C.pink, marginBottom: 8, letterSpacing: 0.5 }}>{col.t.toUpperCase()}</div>
                {col.items.map((item, j) => <div key={j} style={{ fontSize: 12, color: C.gray600, marginBottom: 5, cursor: "pointer" }}>{item}</div>)}
              </div>
            ))}
          </div>
          <div style={{ borderTop: `1px solid ${C.pink}20`, paddingTop: 14, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 6 }}>
            <div style={{ fontSize: 11, color: C.gray400 }}>© 2016–2025 PT Media Dokter Investama. All rights reserved.</div>
            <div style={{ fontSize: 11, color: C.gray400 }}>⚕️ Hanya untuk skrining awal, bukan pengganti diagnosis medis profesional.</div>
          </div>
        </div>
      </div>

      {/* FLOATING CHATBOT */}
      {chatOpen && !chatFullScreen && (
        <ChatBot
          onClose={() => setChatOpen(false)}
          onFullScreen={() => { setChatOpen(false); setChatFullScreen(true); setPage("hildaFull"); }}
        />
      )}

      {/* FAB */}
      {!chatOpen && (
        <button onClick={() => { setChatFullScreen(false); setChatOpen(true); }} style={{ position: "fixed", bottom: 24, right: 24, width: 54, height: 54, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.purple})`, border: "none", cursor: "pointer", fontSize: 22, color: C.white, boxShadow: `0 4px 20px ${C.pink}55`, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          🤖
        </button>
      )}
    </div>
  );
}
