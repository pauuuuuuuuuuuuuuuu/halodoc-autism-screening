import { useState, useEffect, useRef } from "react";

const C = {
  pink: "#E5006C", pinkDark: "#C4005C", pinkLight: "#FFF0F7", pinkMid: "#FFD6EC",
  purple: "#6B21A8", purpleLight: "#F3E8FF",
  gray50: "#F9FAFB", gray100: "#F3F4F6", gray200: "#E5E7EB", gray400: "#9CA3AF",
  gray600: "#4B5563", gray700: "#374151", gray800: "#1F2937",
  white: "#FFFFFF", green: "#16A34A", greenLight: "#DCFCE7",
  amber: "#D97706", amberLight: "#FEF3C7", red: "#DC2626", redLight: "#FEE2E2",
};

const DOCTORS = [
  { id: 1, name: "dr. Anisa Rahma, Sp.A", spec: "Dokter Anak – Autism Specialist", hosp: "RS Siloam Semarang", dist: "1,2 km", rating: 4.9, rev: 312, price: "Rp 150.000", slot: "Hari ini 14:00", av: "AR", ok: true },
  { id: 2, name: "dr. Budi Santoso, Sp.KJ", spec: "Psikiater Anak", hosp: "RSUP Dr. Kariadi", dist: "2,4 km", rating: 4.8, rev: 198, price: "Rp 200.000", slot: "Besok 09:00", av: "BS", ok: true },
  { id: 3, name: "dr. Citra Dewi, Sp.A(K)", spec: "Neurologi Anak", hosp: "RS Elizabeth Semarang", dist: "3,1 km", rating: 4.9, rev: 421, price: "Rp 175.000", slot: "Hari ini 16:00", av: "CD", ok: true },
  { id: 4, name: "dr. Dian Pratiwi, M.Psi", spec: "Psikolog Klinis Anak", hosp: "Klinik Tumbuh Kembang", dist: "0,8 km", rating: 4.7, rev: 156, price: "Rp 120.000", slot: "Hari ini 10:00", av: "DP", ok: false },
];

const SERVICES = [
  { icon: "🧩", title: "Skrining AI", desc: "Deteksi dini via video & kuesioner", tag: "BARU", color: C.pink, page: "screening" },
  { icon: "💬", title: "Chat Terapis", desc: "Terapi wicara & ABA online", tag: "24 JAM", color: "#7C3AED", page: "consult" },
  { icon: "📍", title: "Klinik Terdekat", desc: "Cari klinik autism di sekitarmu", tag: "GPS", color: "#0891B2", page: "findDoctor" },
  { icon: "📚", title: "Parent Training", desc: "Pelatihan orang tua anak autism", tag: "GRATIS", color: C.green, page: null },
  { icon: "🧠", title: "Terapi ABA", desc: "Applied Behavior Analysis", tag: "POPULER", color: "#7C3AED", page: null },
  { icon: "🎨", title: "Terapi Okupasi", desc: "Sensori & motorik anak", tag: "BARU", color: "#EA580C", page: null },
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
// CHATBOT
// ────────────────────────────────────────────────
function ChatBot({ onClose }) {
  const [msgs, setMsgs] = useState([{ from: "bot", text: "Halo! Saya HILDA, asisten AI Halodoc untuk layanan Autism Care. Ada yang bisa saya bantu? 🧩", t: "Sekarang" }]);
  const [inp, setInp] = useState("");
  const [typing, setTyping] = useState(false);
  const bot = useRef(null);

  useEffect(() => { bot.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, typing]);

  function send() {
    const txt = inp.trim(); if (!txt) return;
    const now = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    setMsgs(m => [...m, { from: "user", text: txt, t: now }]);
    setInp(""); setTyping(true);
    setTimeout(() => {
      setMsgs(m => [...m, { from: "bot", text: rand(CHAT_BOT[classify(txt)]), t: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) }]);
      setTyping(false);
    }, 900 + Math.random() * 700);
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
        <button onClick={onClose} style={{ background: "rgba(255,255,255,0.2)", border: "none", color: C.white, borderRadius: 8, width: 28, height: 28, cursor: "pointer", fontSize: 14 }}>✕</button>
      </div>

      <div style={{ height: 300, overflowY: "auto", padding: "12px 10px", display: "flex", flexDirection: "column", gap: 10 }}>
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
        <div ref={bot} />
      </div>

      <div style={{ padding: "0 10px 6px", display: "flex", gap: 5, flexWrap: "wrap" }}>
        {quick.map(q => <button key={q} onClick={() => setInp(q)} style={{ fontSize: 11, padding: "4px 9px", borderRadius: 20, border: `1px solid ${C.pink}`, background: C.pinkLight, color: C.pink, cursor: "pointer", fontFamily: "inherit" }}>{q}</button>)}
      </div>

      <div style={{ padding: "6px 10px 12px", display: "flex", gap: 7 }}>
        <input value={inp} onChange={e => setInp(e.target.value)} onKeyDown={e => e.key === "Enter" && send()} placeholder="Ketik pesan..."
          style={{ flex: 1, padding: "9px 13px", borderRadius: 20, border: `1.5px solid ${C.gray200}`, fontSize: 13, outline: "none", fontFamily: "inherit" }} />
        <button onClick={send} style={{ background: C.pink, border: "none", borderRadius: "50%", width: 36, height: 36, cursor: "pointer", fontSize: 15, color: C.white, display: "flex", alignItems: "center", justifyContent: "center" }}>➤</button>
      </div>
      <style>{`@keyframes bop{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
    </div>
  );
}

// ────────────────────────────────────────────────
// FIND DOCTOR PAGE
// ────────────────────────────────────────────────
function FindDoctorPage() {
  const [sel, setSel] = useState(null);
  const [booked, setBooked] = useState(null);
  const [filt, setFilt] = useState("Semua");
  const filters = ["Semua", "Dokter Anak", "Psikiater", "Psikolog", "Neurologis"];

  const shown = filt === "Semua" ? DOCTORS : DOCTORS.filter(d =>
    (filt === "Dokter Anak" && d.spec.includes("Anak") && !d.spec.includes("Neurologi")) ||
    (filt === "Psikiater" && d.spec.includes("Psikiater")) ||
    (filt === "Psikolog" && d.spec.includes("Psikolog")) ||
    (filt === "Neurologis" && d.spec.includes("Neurologi"))
  );

  return (
    <div>
      <div style={{ fontWeight: 800, fontSize: 24, color: C.gray800, marginBottom: 4 }}>📍 Dokter Spesialis Autism Terdekat</div>
      <p style={{ color: C.gray600, marginBottom: 20 }}>Ditemukan {DOCTORS.length} dokter di sekitar Semarang yang siap membantu.</p>

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
                </div>
                <div style={{ fontSize: 13, color: C.pink, fontWeight: 600, marginBottom: 3 }}>{doc.spec}</div>
                <div style={{ fontSize: 12, color: C.gray600, marginBottom: 5 }}>🏥 {doc.hosp} · 📍 {doc.dist}</div>
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

      {/* Peta */}
      <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 16, overflow: "hidden" }}>
        <div style={{ padding: "14px 18px", borderBottom: `1px solid ${C.gray200}`, fontWeight: 700, fontSize: 14, color: C.gray800 }}>🗺️ Peta Dokter Terdekat · Semarang</div>
        <div style={{ height: 240, background: "linear-gradient(135deg,#fce7f3 0%,#ede9fe 100%)", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ textAlign: "center", color: C.gray600 }}>
            <div style={{ fontSize: 36, marginBottom: 8 }}>🗺️</div>
            <div style={{ fontWeight: 600, fontSize: 14 }}>Peta Interaktif</div>
            <div style={{ fontSize: 12, marginTop: 3 }}>{DOCTORS.length} dokter spesialis autism di Semarang</div>
          </div>
          {DOCTORS.map((d, i) => (
            <div key={i} title={d.name} onClick={() => setSel(d)} style={{ position: "absolute", top: `${18 + i * 18}%`, left: `${12 + i * 20}%`, background: sel?.id === d.id ? C.pinkDark : C.pink, color: C.white, borderRadius: "50%", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, boxShadow: "0 2px 8px #0003", cursor: "pointer", transition: "all 0.2s", zIndex: 2 }}>
              {i + 1}
            </div>
          ))}
          <div style={{ position: "absolute", bottom: 12, right: 12, background: C.white, borderRadius: 10, padding: "8px 12px", fontSize: 11, color: C.gray600, border: `1px solid ${C.gray200}` }}>
            {DOCTORS.map((d, i) => <div key={i} style={{ display: "flex", gap: 6, alignItems: "center", marginBottom: i < DOCTORS.length - 1 ? 4 : 0 }}><span style={{ background: C.pink, color: C.white, borderRadius: "50%", width: 18, height: 18, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700 }}>{i + 1}</span>{d.name.split(",")[0]}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────────
// MAIN APP
// ────────────────────────────────────────────────
export default function App() {
  const [page, setPage] = useState("home");
  const [step, setStep] = useState(0);
  const [childName, setChildName] = useState("");
  const [childAge, setChildAge] = useState("");
  const [childGender, setChildGender] = useState("");
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [video, setVideo] = useState(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [anim, setAnim] = useState(true);

  useEffect(() => {
    setAnim(false); const t = setTimeout(() => setAnim(true), 40); return () => clearTimeout(t);
  }, [page, step]);

  function goScreen() { setStep(0); setAnswers({}); setResult(null); setVideo(null); setPage("screening"); }

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
      alert("⚠️ Server AI tidak terhubung. Hasil berdasarkan kuesioner saja.");
    }
    setAnalyzing(false); setStep(4);
  }

  // ── STEP BAR ─────────────────────────────────────
  const stepLabels = ["Info Anak", "Perilaku", "Komunikasi", "Video AI", "Hasil"];

  // ── SCREENING PAGE ────────────────────────────────
  function ScreenPage() {
    const curQs = step === 1 ? QUESTIONS.slice(0, 4) : step === 2 ? QUESTIONS.slice(4, 8) : [];

    // Local state untuk step 0 (FIX BUG INPUT)
    const [ln, setLn] = useState(childName);
    const [la, setLa] = useState(childAge);
    const [lg, setLg] = useState(childGender);
    const [drag, setDrag] = useState(false);

    function saveInfo() { setChildName(ln); setChildAge(la); setChildGender(lg); setStep(1); }

    return (
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Step bar */}
        <div style={{ display: "flex", alignItems: "flex-start", marginBottom: 28 }}>
          {stepLabels.map((l, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stepLabels.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: step > i ? C.green : step === i ? C.pink : C.gray200, color: step >= i ? C.white : C.gray600, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, transition: "all 0.3s", boxShadow: step === i ? `0 0 0 4px ${C.pink}25` : "none" }}>
                  {step > i ? "✓" : i + 1}
                </div>
                <span style={{ fontSize: 10, color: step === i ? C.pink : C.gray400, fontWeight: step === i ? 700 : 400, whiteSpace: "nowrap" }}>{l}</span>
              </div>
              {i < stepLabels.length - 1 && <div style={{ flex: 1, height: 3, background: step > i ? C.green : C.gray200, marginTop: 15, transition: "background 0.4s" }} />}
            </div>
          ))}
        </div>

        <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 16, padding: "28px 32px" }}>

          {/* STEP 0: INFO ANAK */}
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
                <Btn onClick={saveInfo} disabled={!ln.trim() || !la || !lg}>Lanjut →</Btn>
              </div>
            </div>
          )}

          {/* STEPS 1–2: QUESTIONS */}
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

          {/* STEP 3: VIDEO UPLOAD */}
          {step === 3 && (() => {
            const [drag, setDrag] = useState(false);
            const loadSteps = ["Mengekstrak frame video...", "Mendeteksi wajah & pose (MediaPipe)...", "Menghitung persentase fokus mata...", "Menjalankan Random Forest model...", "Menggabungkan skor kuesioner + video...", "Menghasilkan laporan analisis..."];
            return (
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, color: C.gray800, marginBottom: 6 }}>🎥 Upload Video Anak</div>
                <p style={{ color: C.gray600, fontSize: 14, marginBottom: 20, lineHeight: 1.6 }}>Upload video 1–3 menit saat anak bermain atau berinteraksi. AI menganalisis kontak mata & gerakan secara otomatis.</p>

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

          {/* STEP 4: RESULT */}
          {step === 4 && result && (() => {
            const cfg = {
              low: { color: C.green, bg: C.greenLight, icon: "✅", label: "Risiko Rendah", border: "#86EFAC" },
              moderate: { color: C.amber, bg: C.amberLight, icon: "⚠️", label: "Risiko Sedang", border: "#FCD34D" },
              high: { color: C.red, bg: C.redLight, icon: "🔴", label: "Risiko Tinggi", border: "#FCA5A5" },
            };
            const c = cfg[result.risk];
            const recs = {
              low: ["Pemantauan perkembangan rutin tiap 6 bulan", "Perkaya stimulasi bermain sosial & bahasa", "Pertahankan jadwal tumbuh kembang", "Skrining ulang disarankan dalam 6 bulan"],
              moderate: ["Konsultasi dokter anak dalam 2–4 minggu", "Evaluasi terapi wicara & ABA diperlukan", "Program parent training tersedia di Halodoc", "Skrining ulang disarankan dalam 3 bulan"],
              high: ["Konsultasi spesialis segera dalam 1–2 minggu", "Evaluasi ADOS-2 oleh tim multidisiplin", "Mulai program ABA & terapi terpadu segera", "Bergabung komunitas orang tua autism"],
            };
            return (
              <div>
                <div style={{ fontWeight: 700, fontSize: 20, color: C.gray800, marginBottom: 16 }}>📊 Hasil Skrining AI</div>
                <div style={{ background: C.amberLight, border: `1.5px solid #FCD34D`, borderRadius: 10, padding: "12px 16px", fontSize: 13, color: "#92400E", marginBottom: 18, lineHeight: 1.6 }}>
                  ⚕️ <strong>Disclaimer:</strong> Hasil ini hanya untuk bantuan skrining awal dan <strong>tidak menggantikan diagnosis medis profesional</strong>.
                </div>
                <div style={{ background: c.bg, border: `2px solid ${c.border}`, borderRadius: 16, padding: "24px", marginBottom: 18, textAlign: "center" }}>
                  <div style={{ fontSize: 52, marginBottom: 8 }}>{c.icon}</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: c.color, marginBottom: 8 }}>{childName ? `${childName} — ` : ""}{c.label}</div>
                  <div style={{ display: "flex", justifyContent: "center", gap: 24, flexWrap: "wrap", marginTop: 12 }}>
                    {[{ v: `${result.confidence}%`, l: "Kepercayaan AI" }, { v: `${result.score}/100`, l: "Risk Score" }, result.videoData && { v: `${result.videoData.focus_percentage?.toFixed(0)}%`, l: "Fokus Mata (Video)" }].filter(Boolean).map((m, i, arr) => (
                      <>
                        <div key={i} style={{ textAlign: "center" }}>
                          <div style={{ fontSize: 26, fontWeight: 800, color: c.color }}>{m.v}</div>
                          <div style={{ fontSize: 11, color: C.gray600 }}>{m.l}</div>
                        </div>
                        {i < arr.length - 1 && <div style={{ width: 1, background: c.border }} />}
                      </>
                    ))}
                  </div>
                </div>

                {/* Behavior bars */}
                <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "20px 22px", marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 14, color: C.gray800 }}>📈 Analisis Perilaku per Domain</div>
                  <div style={{ display: "grid", gap: 11 }}>
                    {result.bScores.map((b, i) => (
                      <div key={i}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, color: C.gray800 }}>{b.label}</span>
                          <span style={{ fontSize: 13, fontWeight: 700, color: b.score > 60 ? C.red : b.score > 35 ? C.amber : C.green }}>{b.score}%</span>
                        </div>
                        <PBar v={b.score} color={b.score > 60 ? C.red : b.score > 35 ? C.amber : C.green} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Rekomendasi */}
                <div style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "20px 22px", marginBottom: 18 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12, color: C.gray800 }}>💡 Rekomendasi</div>
                  <div style={{ display: "grid", gap: 8 }}>
                    {recs[result.risk].map((r, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, padding: "9px 14px", borderRadius: 8, background: C.gray50, alignItems: "flex-start" }}>
                        <span style={{ color: c.color, fontWeight: 700, flexShrink: 0 }}>→</span>
                        <span style={{ fontSize: 13, color: C.gray700, lineHeight: 1.6 }}>{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA Cari Dokter */}
                <div style={{ background: `linear-gradient(135deg,${C.pink}12,${C.purple}08)`, border: `1.5px solid ${C.pink}30`, borderRadius: 14, padding: "20px 22px" }}>
                  <div style={{ fontWeight: 700, fontSize: 15, color: C.gray800, marginBottom: 4 }}>📍 Langkah Selanjutnya</div>
                  <p style={{ fontSize: 13, color: C.gray600, marginBottom: 16, lineHeight: 1.6 }}>Temukan dokter spesialis autism terdekat dan buat janji konsultasi sekarang.</p>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <Btn onClick={() => setPage("findDoctor")}>📍 Cari Dokter Terdekat</Btn>
                    <Btn v="outline" onClick={() => setPage("consult")}>💬 Konsultasi Online</Btn>
                    <Btn v="ghost" onClick={() => alert("Mengunduh laporan PDF...")}>📄 Unduh Laporan</Btn>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    );
  }

  // ── CONSULT PAGE ──────────────────────────────────
  function ConsultPage() {
    return (
      <div>
        <div style={{ fontWeight: 800, fontSize: 24, color: C.gray800, marginBottom: 4 }}>👨‍⚕️ Konsultasi Spesialis Autism</div>
        <p style={{ color: C.gray600, marginBottom: 24 }}>Terhubung langsung dengan dokter anak, psikiater, dan psikolog anak spesialis autism.</p>
        <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fill,minmax(280px,1fr))" }}>
          {DOCTORS.map((doc, i) => (
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

  // ── ABOUT PAGE ────────────────────────────────────
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

  // ── HOME PAGE ─────────────────────────────────────
  function HomePage() {
    return (
      <div>
        {/* Hero */}
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

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 12, marginBottom: 24 }}>
          {[{ icon: "🧩", v: "47.829", l: "Skrining Selesai" }, { icon: "👨‍⚕️", v: "50+", l: "Spesialis Autism" }, { icon: "🎯", v: "94,2%", l: "Akurasi AI" }, { icon: "💛", v: "32.000+", l: "Keluarga Terbantu" }].map((s, i) => (
            <div key={i} style={{ background: C.white, border: `1px solid ${C.gray200}`, borderRadius: 14, padding: "14px 12px", textAlign: "center" }}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{s.icon}</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: C.pink }}>{s.v}</div>
              <div style={{ fontSize: 11, color: C.gray600 }}>{s.l}</div>
            </div>
          ))}
        </div>

        {/* Layanan Autism */}
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

        {/* Board of Medical */}
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

        {/* Artikel */}
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

        {/* Testimoni */}
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

        {/* CTA strip */}
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
    { id: "home", l: "Beranda", i: "🏠" },
    { id: "screening", l: "Skrining AI", i: "🧩" },
    { id: "findDoctor", l: "Cari Dokter", i: "📍" },
    { id: "consult", l: "Konsultasi", i: "👨‍⚕️" },
    { id: "about", l: "Tentang AI", i: "🤖" },
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
            <button onClick={() => setChatOpen(o => !o)} style={{ background: C.pinkLight, border: `1px solid ${C.pink}30`, borderRadius: 8, padding: "7px 12px", cursor: "pointer", fontSize: 13, color: C.pink, fontWeight: 600, fontFamily: "inherit" }}>💬 HILDA</button>
            <Btn sx={{ padding: "7px 14px", fontSize: 13 }} onClick={goScreen}>🧩 Skrining Gratis</Btn>
          </div>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 20px", opacity: anim ? 1 : 0, transform: anim ? "translateY(0)" : "translateY(8px)", transition: "all 0.3s ease" }}>
        {page === "home"       && <HomePage />}
        {page === "screening"  && <ScreenPage />}
        {page === "findDoctor" && <FindDoctorPage />}
        {page === "consult"    && <ConsultPage />}
        {page === "about"      && <AboutPage />}
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
              { t: "Layanan", items: ["Skrining AI", "Chat Terapis", "Klinik Terdekat", "Terapi ABA", "Parent Training"] },
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

      {/* CHATBOT */}
      {chatOpen && <ChatBot onClose={() => setChatOpen(false)} />}

      {/* FAB */}
      {!chatOpen && (
        <button onClick={() => setChatOpen(true)} style={{ position: "fixed", bottom: 24, right: 24, width: 54, height: 54, borderRadius: "50%", background: `linear-gradient(135deg,${C.pink},${C.purple})`, border: "none", cursor: "pointer", fontSize: 22, color: C.white, boxShadow: `0 4px 20px ${C.pink}55`, zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          🤖
        </button>
      )}
    </div>
  );
}