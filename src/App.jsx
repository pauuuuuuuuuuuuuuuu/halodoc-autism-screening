import { useState, useEffect, useRef } from "react";

const LANG = {
  id: {
    nav_home: "Beranda", nav_screening: "Skrining AI", nav_history: "Riwayat",
    nav_about: "Tentang Fitur", nav_admin: "Admin", nav_consult: "Konsultasi",
    tagline: "Deteksi Dini Autisme untuk Masa Depan Cerah Anak Anda",
    hero_sub: "Fitur skrining berbasis kecerdasan buatan Halodoc untuk membantu orang tua mendeteksi tanda-tanda awal autisme pada anak.",
    start_btn: "Mulai Skrining Sekarang", learn_btn: "Pelajari Lebih Lanjut",
    awareness_title: "Mengapa Deteksi Dini Penting?",
    awareness_sub: "Deteksi dini memungkinkan intervensi lebih efektif dan hasil yang lebih baik untuk anak Anda.",
    step_child_info: "Info Anak", step_behavior: "Perilaku", step_social: "Sosial & Komunikasi", step_result: "Hasil",
    child_name: "Nama Anak", child_age: "Usia Anak (bulan)", child_gender: "Jenis Kelamin",
    male: "Laki-laki", female: "Perempuan", next: "Lanjut", back: "Kembali",
    analyzing: "AI sedang menganalisis...", result_title: "Hasil Skrining AI",
    disclaimer: "⚕️ Fitur AI ini hanya untuk bantuan skrining awal dan tidak menggantikan diagnosis medis profesional.",
    consult_pedia: "Konsultasi Dokter Anak", consult_psych: "Konsultasi Psikolog Anak",
    book_now: "Booking Sekarang", chat_doc: "Chat dengan Dokter",
    low_risk: "Risiko Rendah", mod_risk: "Risiko Sedang", high_risk: "Risiko Tinggi",
    download_pdf: "Unduh Laporan PDF", screening_history: "Riwayat Skrining",
    recommendations: "Rekomendasi", intervention: "Saran Intervensi Dini",
    ai_tech: "Teknologi AI Kami", ml_title: "Machine Learning Classification",
    admin_title: "Admin Analytics Dashboard", total_screenings: "Total Skrining",
    pred_dist: "Distribusi Prediksi", accuracy: "Akurasi Model",
    dark_mode: "Mode Gelap", language: "Bahasa",
    confidence: "Tingkat Kepercayaan", behavior_analysis: "Analisis Perilaku",
    submit_screening: "Analisis dengan AI"
  },
  en: {
    nav_home: "Home", nav_screening: "AI Screening", nav_history: "History",
    nav_about: "About Feature", nav_admin: "Admin", nav_consult: "Consultation",
    tagline: "Early Autism Detection for Your Child's Bright Future",
    hero_sub: "Halodoc's AI-powered screening feature to help parents detect early signs of autism in children.",
    start_btn: "Start Screening Now", learn_btn: "Learn More",
    awareness_title: "Why Early Detection Matters?",
    awareness_sub: "Early detection enables more effective interventions and better outcomes for your child.",
    step_child_info: "Child Info", step_behavior: "Behavior", step_social: "Social & Communication", step_result: "Results",
    child_name: "Child's Name", child_age: "Child's Age (months)", child_gender: "Gender",
    male: "Male", female: "Female", next: "Next", back: "Back",
    analyzing: "AI is analyzing...", result_title: "AI Screening Results",
    disclaimer: "⚕️ This AI feature is intended only for early screening assistance and does not replace professional medical diagnosis.",
    consult_pedia: "Consult Pediatrician", consult_psych: "Consult Child Psychologist",
    book_now: "Book Now", chat_doc: "Chat with Doctor",
    low_risk: "Low Risk", mod_risk: "Moderate Risk", high_risk: "High Risk",
    download_pdf: "Download PDF Report", screening_history: "Screening History",
    recommendations: "Recommendations", intervention: "Early Intervention Suggestions",
    ai_tech: "Our AI Technology", ml_title: "Machine Learning Classification",
    admin_title: "Admin Analytics Dashboard", total_screenings: "Total Screenings",
    pred_dist: "Prediction Distribution", accuracy: "Model Accuracy",
    dark_mode: "Dark Mode", language: "Language",
    confidence: "Confidence Level", behavior_analysis: "Behavioral Analysis",
    submit_screening: "Analyze with AI"
  }
};

const behaviorQuestions = {
  en: [
    { id: "eye_contact", category: "Eye Contact", icon: "👁️", question: "Does your child make consistent eye contact during interactions?", options: ["Always", "Sometimes", "Rarely", "Never"] },
    { id: "speech", category: "Speech Development", icon: "🗣️", question: "How would you describe your child's speech development?", options: ["Age-appropriate", "Slightly delayed", "Significantly delayed", "No speech"] },
    { id: "repetitive", category: "Repetitive Actions", icon: "🔄", question: "Does your child engage in repetitive movements or behaviors (hand-flapping, rocking)?", options: ["Never", "Occasionally", "Frequently", "Very often"] },
    { id: "social", category: "Social Response", icon: "🤝", question: "How does your child respond when called by name?", options: ["Responds immediately", "Responds after delay", "Inconsistent", "Rarely responds"] },
    { id: "emotional", category: "Emotional Response", icon: "💛", question: "Does your child show interest in other children's play?", options: ["Very interested", "Somewhat interested", "Rarely interested", "No interest"] },
    { id: "sensory", category: "Sensory Sensitivity", icon: "✋", question: "Does your child show unusual reactions to sounds, textures, or lights?", options: ["No unusual reactions", "Mild reactions", "Moderate reactions", "Severe reactions"] },
    { id: "pointing", category: "Communication", icon: "👆", question: "Does your child point to objects to share interest (e.g., pointing at a bird)?", options: ["Often", "Sometimes", "Rarely", "Never"] },
    { id: "imitation", category: "Imitation", icon: "🪞", question: "Does your child imitate facial expressions or actions?", options: ["Frequently", "Sometimes", "Rarely", "Never"] },
  ],
  id: [
    { id: "eye_contact", category: "Kontak Mata", icon: "👁️", question: "Apakah anak Anda melakukan kontak mata secara konsisten saat berinteraksi?", options: ["Selalu", "Kadang-kadang", "Jarang", "Tidak pernah"] },
    { id: "speech", category: "Perkembangan Bicara", icon: "🗣️", question: "Bagaimana perkembangan bicara anak Anda?", options: ["Sesuai usia", "Sedikit terlambat", "Sangat terlambat", "Tidak bicara"] },
    { id: "repetitive", category: "Perilaku Repetitif", icon: "🔄", question: "Apakah anak Anda melakukan gerakan berulang (mengepak tangan, bergoyang)?", options: ["Tidak pernah", "Kadang-kadang", "Sering", "Sangat sering"] },
    { id: "social", category: "Respons Sosial", icon: "🤝", question: "Bagaimana anak Anda merespons saat dipanggil namanya?", options: ["Langsung merespons", "Merespons setelah jeda", "Tidak konsisten", "Jarang merespons"] },
    { id: "emotional", category: "Respons Emosional", icon: "💛", question: "Apakah anak Anda menunjukkan minat pada permainan anak lain?", options: ["Sangat berminat", "Cukup berminat", "Jarang berminat", "Tidak berminat"] },
    { id: "sensory", category: "Kepekaan Sensorik", icon: "✋", question: "Apakah anak Anda menunjukkan reaksi tidak biasa terhadap suara, tekstur, atau cahaya?", options: ["Tidak ada reaksi", "Reaksi ringan", "Reaksi sedang", "Reaksi berat"] },
    { id: "pointing", category: "Komunikasi", icon: "👆", question: "Apakah anak Anda menunjuk benda untuk berbagi ketertarikan?", options: ["Sering", "Kadang-kadang", "Jarang", "Tidak pernah"] },
    { id: "imitation", category: "Imitasi", icon: "🪞", question: "Apakah anak Anda meniru ekspresi wajah atau tindakan?", options: ["Sering", "Kadang-kadang", "Jarang", "Tidak pernah"] },
  ]
};

const doctors = [
  { name: "dr. Anisa Rahma, Sp.A", specialty: "Pediatrician", rating: 4.9, reviews: 1243, exp: "12 years", avatar: "AR", available: true, price: "Rp 75.000", tag: "Top Doctor" },
  { name: "dr. Budi Santoso, Sp.KJ", specialty: "Child Psychologist", rating: 4.8, reviews: 876, exp: "9 years", avatar: "BS", available: true, price: "Rp 95.000", tag: "Autism Specialist" },
  { name: "dr. Citra Dewi, Sp.A(K)", specialty: "Pediatric Neurology", rating: 4.9, reviews: 2105, exp: "15 years", avatar: "CD", available: false, price: "Rp 120.000", tag: "Expert" },
];

const mockHistory = [
  { id: 1, date: "2025-05-10", childName: "Budi (3y 2m)", risk: "low", confidence: 88, status: "complete" },
  { id: 2, date: "2025-04-22", childName: "Budi (3y 1m)", risk: "low", confidence: 85, status: "complete" },
  { id: 3, date: "2025-03-15", childName: "Budi (3y)", risk: "moderate", confidence: 72, status: "complete" },
];

const adminData = {
  totalScreenings: 47829,
  monthlyGrowth: "+23%",
  lowRisk: 58,
  moderateRisk: 29,
  highRisk: 13,
  accuracy: 94.2,
  monthlyData: [3200, 4100, 5200, 6800, 7200, 8900, 9200, 10500, 11200, 12800, 13100, 14200],
  ageGroups: [{ label: "12-24m", value: 28 }, { label: "24-36m", value: 35 }, { label: "36-48m", value: 22 }, { label: "48-60m", value: 15 }],
};

function RiskBadge({ risk, t }) {
  const map = { low: { label: t.low_risk, bg: "#e8f5e9", color: "#2e7d32", border: "#a5d6a7" }, moderate: { label: t.mod_risk, bg: "#fff8e1", color: "#f57f17", border: "#ffe082" }, high: { label: t.high_risk, bg: "#ffebee", color: "#c62828", border: "#ef9a9a" } };
  const s = map[risk];
  return <span style={{ background: s.bg, color: s.color, border: `1px solid ${s.border}`, borderRadius: 20, padding: "4px 14px", fontSize: 13, fontWeight: 600 }}>{s.label}</span>;
}

function ProgressBar({ value, max = 100, color = "#0066CC" }) {
  return (
    <div style={{ background: "#e8edf2", borderRadius: 8, height: 8, overflow: "hidden" }}>
      <div style={{ width: `${(value / max) * 100}%`, height: "100%", background: color, borderRadius: 8, transition: "width 1s ease" }} />
    </div>
  );
}

function MiniChart({ data, colors }) {
  const max = Math.max(...data.map(d => d.value));
  return (
    <div style={{ display: "flex", gap: 8, alignItems: "flex-end", height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 10, color: "#666", fontWeight: 600 }}>{d.value}%</span>
          <div style={{ width: "100%", height: `${(d.value / max) * 60}px`, background: colors[i], borderRadius: "4px 4px 0 0", transition: "height 0.8s ease" }} />
          <span style={{ fontSize: 9, color: "#888", textAlign: "center" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function HalodocAutismApp() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("id");
  const [dark, setDark] = useState(false);
  const [step, setStep] = useState(0);
  const [childInfo, setChildInfo] = useState({ name: "", age: "", gender: "" });
  const [answers, setAnswers] = useState({});
  const [analyzing, setAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [animIn, setAnimIn] = useState(true);
  const t = LANG[lang];

  const bg = dark ? "#0d1117" : "#f5f7fa";
  const card = dark ? "#161b22" : "#ffffff";
  const cardBorder = dark ? "#30363d" : "#e8edf2";
  const text = dark ? "#e6edf3" : "#1a2332";
  const textSec = dark ? "#8b949e" : "#5a6a7e";
  const primary = "#0066CC";
  const teal = "#00a99d";
  const navBg = dark ? "#161b22" : "#ffffff";

  const questions = behaviorQuestions[lang];
  const totalSteps = 4;

  useEffect(() => {
    setAnimIn(false);
    setTimeout(() => setAnimIn(true), 50);
  }, [page, step]);

  function computeRisk() {
    const weights = {
      eye_contact: 1.5,
      speech: 1.3,
      repetitive: 1.4,
      social: 1.5,
      emotional: 1.2,
      sensory: 1.1,
      pointing: 1.5,
      imitation: 1.4,
      routine: 1.2,
      pretend_play: 1.5
    };
    let totalScore = 0;
    let maxScore = 0;
    const behaviorScores = questions.map((q, i) => {
      const answer = answers[i] ?? 0;
      const normalized =
        answer / (q.options.length - 1);
      const weight =
        weights[q.id] || 1;
      const weightedScore =
        normalized * weight;
      totalScore += weightedScore;
      maxScore += weight;
      return {
        label: q.category,
        score: Math.round(
          normalized * 100
        )
      };
    });

    async function handleAIAnalysis() {
      if (!selectedVideo) {
        alert("Please upload a video first!");
        return;
      }
      setAnalyzing(true);
      try {
        const formData = new FormData();
        formData.append(
          "file",
          selectedVideo
        );
        const response = await fetch(
          "http://127.0.0.1:8000/predict",
          {
            method: "POST",
            body: formData
          }
        );
        const aiData = await response.json();
        const questionnaire =
          computeRisk();
        // FUSION SCORE
        const finalScore = Math.round(
          (questionnaire.score * 0.8) +
          ((aiData.focus_percentage || 50) * 0.2)
        );
        let finalRisk = "low";
        if (finalScore >= 65) {
          finalRisk = "high";
        }
        else if (finalScore >= 35) {
          finalRisk = "moderate";
        }
        setResult({
          risk: finalRisk,
          confidence:
            aiData.confidence,
          behaviorScores:
            questionnaire.behaviorScores,
          score:
            finalScore
        });
        setStep(4);
      }
      catch (error) {
        console.error(error);
        alert("AI analysis failed.");
      }
      setAnalyzing(false);
    }
    
    // FINAL SCORE

    const finalScore =
      (totalScore / maxScore) * 100;

    // RISK CLASSIFICATION

    let risk = "low";

    if (finalScore >= 65) {
      risk = "high";
    }

    else if (finalScore >= 35) {
      risk = "moderate";
    }

    // CONFIDENCE

    let confidence = 78;

    if (finalScore >= 70) {
      confidence = 94;
    }

    else if (finalScore >= 50) {
      confidence = 88;
    }

    else if (finalScore >= 35) {
      confidence = 82;
    }

    return {

      risk,

      confidence,

      behaviorScores,

      score: Math.round(finalScore)

    };

  }

  function handleSubmit() {
    setAnalyzing(true);
    setTimeout(() => {
      setResult(computeRisk());
      setAnalyzing(false);
      setStep(3);
    }, 3200);
  }

  const navItems = [
    { id: "home", label: t.nav_home, icon: "🏠" },
    { id: "screening", label: t.nav_screening, icon: "🧩" },
    { id: "history", label: t.nav_history, icon: "📋" },
    { id: "about", label: t.nav_about, icon: "🤖" },
    { id: "consult", label: t.nav_consult, icon: "👨‍⚕️" },
    { id: "admin", label: t.nav_admin, icon: "📊" },
  ];

  const s = {
    app: { minHeight: "100vh", background: bg, color: text, fontFamily: "'DM Sans', 'Noto Sans', sans-serif", transition: "all 0.3s" },
    nav: { background: navBg, borderBottom: `1px solid ${cardBorder}`, position: "sticky", top: 0, zIndex: 100, boxShadow: dark ? "0 1px 8px #0003" : "0 1px 8px #0001" },
    navInner: { maxWidth: 1200, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" },
    logo: { display: "flex", alignItems: "center", gap: 8, cursor: "pointer" },
    logoText: { fontSize: 20, fontWeight: 700, color: primary, letterSpacing: "-0.5px" },
    logoBadge: { background: "#e8f4ff", color: primary, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20, border: `1px solid ${primary}20` },
    navLinks: { display: "flex", gap: 4, alignItems: "center" },
    navLink: (active) => ({ padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: active ? 600 : 400, color: active ? primary : textSec, background: active ? "#e8f4ff" : "transparent", cursor: "pointer", border: "none", transition: "all 0.2s" }),
    navRight: { display: "flex", gap: 8, alignItems: "center" },
    iconBtn: { background: "none", border: `1px solid ${cardBorder}`, borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 14, color: textSec },
    content: { maxWidth: 1200, margin: "0 auto", padding: "32px 20px", opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(8px)", transition: "all 0.35s ease" },
    hero: { background: `linear-gradient(135deg, ${primary} 0%, #0052a3 40%, #00a99d 100%)`, borderRadius: 20, padding: "52px 48px", color: "#fff", position: "relative", overflow: "hidden", marginBottom: 32 },
    card: { background: card, border: `1px solid ${cardBorder}`, borderRadius: 16, padding: "24px 28px" },
    pill: (active) => ({ background: active ? primary : dark ? "#21262d" : "#f0f4f8", color: active ? "#fff" : textSec, border: `1px solid ${active ? primary : cardBorder}`, borderRadius: 20, padding: "5px 16px", fontSize: 12, fontWeight: 600, cursor: "pointer" }),
    btn: (variant = "primary") => ({
      background: variant === "primary" ? primary : variant === "teal" ? teal : "transparent",
      color: variant === "outline" ? primary : "#fff",
      border: variant === "outline" ? `2px solid ${primary}` : "none",
      borderRadius: 10, padding: "12px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer",
      display: "inline-flex", alignItems: "center", gap: 8, transition: "all 0.2s"
    }),
    stepBar: { display: "flex", gap: 0, marginBottom: 32, position: "relative" },
    stepDot: (active, done) => ({
      width: 36, height: 36, borderRadius: "50%",
      background: done ? teal : active ? primary : dark ? "#21262d" : "#e8edf2",
      color: done || active ? "#fff" : textSec,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: 14, fontWeight: 700, flexShrink: 0, zIndex: 2,
      border: active ? `3px solid ${primary}40` : "none",
      transition: "all 0.3s"
    }),
    stepLine: (done) => ({ flex: 1, height: 3, background: done ? teal : dark ? "#21262d" : "#e8edf2", marginTop: 17, transition: "background 0.4s" }),
    input: { width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${cardBorder}`, background: dark ? "#21262d" : "#f8fafb", color: text, fontSize: 14, outline: "none", boxSizing: "border-box" },
    select: { width: "100%", padding: "12px 16px", borderRadius: 10, border: `1.5px solid ${cardBorder}`, background: dark ? "#21262d" : "#f8fafb", color: text, fontSize: 14, outline: "none" },
    label: { fontSize: 13, fontWeight: 600, color: textSec, marginBottom: 6, display: "block" },
  };

  function HomePage() {
    const awareness = [
      { icon: "🧠", title: lang === "id" ? "Intervensi Lebih Efektif" : "More Effective Intervention", desc: lang === "id" ? "Terapi dini meningkatkan perkembangan kognitif dan sosial anak secara signifikan" : "Early therapy significantly improves cognitive and social development" },
      { icon: "📈", title: lang === "id" ? "Hasil Lebih Baik" : "Better Outcomes", desc: lang === "id" ? "Anak-anak yang mendapat dukungan dini menunjukkan kemajuan yang luar biasa" : "Children who receive early support show remarkable progress" },
      { icon: "👨‍👩‍👧", title: lang === "id" ? "Dukungan Keluarga" : "Family Support", desc: lang === "id" ? "Orang tua mendapatkan panduan dan strategi pengasuhan yang tepat" : "Parents receive proper guidance and parenting strategies" },
      { icon: "💊", title: lang === "id" ? "Perencanaan Terapi" : "Therapy Planning", desc: lang === "id" ? "Rencana intervensi yang dipersonalisasi sesuai kebutuhan unik anak Anda" : "Personalized intervention plans tailored to your child's unique needs" },
    ];
    const services = [
      { icon: "🏥", label: lang === "id" ? "Chat Dokter" : "Chat Doctor" },
      { icon: "💊", label: lang === "id" ? "Apotek" : "Pharmacy" },
      { icon: "🧪", label: lang === "id" ? "Cek Lab" : "Lab Check" },
      { icon: "🏠", label: "Homecare" },
      { icon: "🧬", label: "HaloSkin" },
      { icon: "🧩", label: "AI Autism" },
      { icon: "🧘", label: lang === "id" ? "Kesehatan Mental" : "Mental Health" },
      { icon: "💛", label: "Parenting" },
    ];
    return (
      <div>
        {/* Hero */}
        <div style={s.hero}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 280, height: 280, borderRadius: "50%", background: "rgba(255,255,255,0.06)" }} />
          <div style={{ position: "absolute", bottom: -60, left: "40%", width: 200, height: 200, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
          <div style={{ maxWidth: 600, position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.2)", borderRadius: 20, padding: "6px 14px", fontSize: 12, fontWeight: 700, marginBottom: 20, letterSpacing: 0.5 }}>
              ✨ FITUR BARU · NEW FEATURE
            </div>
            <h1 style={{ fontSize: "clamp(24px, 4vw, 40px)", fontWeight: 800, margin: "0 0 16px", lineHeight: 1.2, letterSpacing: "-0.5px" }}>{t.tagline}</h1>
            <p style={{ fontSize: 16, opacity: 0.88, marginBottom: 28, lineHeight: 1.6 }}>{t.hero_sub}</p>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={{ ...s.btn(), background: "#fff", color: primary }} onClick={() => { setPage("screening"); setStep(0); setAnswers({}); setResult(null); }}>🧩 {t.start_btn}</button>
              <button style={{ ...s.btn("outline"), borderColor: "rgba(255,255,255,0.6)", color: "#fff" }} onClick={() => setPage("about")}>📖 {t.learn_btn}</button>
            </div>
          </div>
          <div style={{ position: "absolute", right: 40, top: "50%", transform: "translateY(-50%)", fontSize: 80, opacity: 0.15, display: "none" }}>🧩</div>
        </div>

        {/* AI Feature Banner */}
        <div style={{ ...s.card, background: dark ? "#0d2137" : "#eef6ff", border: `1.5px solid ${primary}30`, marginBottom: 32, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ fontSize: 40 }}>🤖</div>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700, color: primary, marginBottom: 2, letterSpacing: 1 }}>HALODOC AI · EARLY SCREENING</div>
              <div style={{ fontWeight: 700, fontSize: 18, color: text }}>AI Early Autism Screening</div>
              <div style={{ fontSize: 13, color: textSec }}>Powered by Machine Learning · {lang === "id" ? "Didukung Oleh Tim Dokter Halodoc" : "Backed by Halodoc Medical Team"}</div>
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ textAlign: "center", padding: "8px 20px", background: dark ? "#1a2a3a" : "#fff", borderRadius: 10, border: `1px solid ${cardBorder}` }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: primary }}>94.2%</div>
              <div style={{ fontSize: 11, color: textSec }}>{lang === "id" ? "Akurasi Model" : "Model Accuracy"}</div>
            </div>
            <div style={{ textAlign: "center", padding: "8px 20px", background: dark ? "#1a2a3a" : "#fff", borderRadius: 10, border: `1px solid ${cardBorder}` }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: teal }}>47K+</div>
              <div style={{ fontSize: 11, color: textSec }}>{lang === "id" ? "Skrining Selesai" : "Screenings Done"}</div>
            </div>
          </div>
        </div>

        {/* Services Grid */}
        <div style={{ ...s.card, marginBottom: 32 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>{lang === "id" ? "Layanan Halodoc" : "Halodoc Services"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: 12 }}>
            {services.map((svc, i) => (
              <div key={i} onClick={() => svc.label === "AI Autism" && (setPage("screening"), setStep(0))} style={{ textAlign: "center", padding: "16px 8px", borderRadius: 12, cursor: "pointer", border: `1px solid ${cardBorder}`, background: svc.label === "AI Autism" ? (dark ? "#0d2137" : "#eef6ff") : "transparent", transition: "all 0.2s" }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>{svc.icon}</div>
                <div style={{ fontSize: 11, fontWeight: 600, color: svc.label === "AI Autism" ? primary : textSec }}>{svc.label}</div>
                {svc.label === "AI Autism" && <div style={{ fontSize: 9, color: primary, fontWeight: 700, marginTop: 2 }}>NEW</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Awareness */}
        <div style={{ marginBottom: 32 }}>
          <div style={{ textAlign: "center", marginBottom: 24 }}>
            <h2 style={{ fontSize: 26, fontWeight: 800, color: text, margin: "0 0 8px" }}>{t.awareness_title}</h2>
            <p style={{ color: textSec, fontSize: 15 }}>{t.awareness_sub}</p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
            {awareness.map((a, i) => (
              <div key={i} style={{ ...s.card, display: "flex", gap: 16, alignItems: "flex-start" }}>
                <div style={{ fontSize: 32, flexShrink: 0 }}>{a.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 6 }}>{a.title}</div>
                  <div style={{ fontSize: 13, color: textSec, lineHeight: 1.6 }}>{a.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[
            { label: "Skrining Selesai", value: "47,829", color: primary, icon: "🧩" },
            { label: "Dokter Terdaftar", value: "1,200+", color: teal, icon: "👨‍⚕️" },
            { label: "Akurasi AI", value: "94.2%", color: "#f57f17", icon: "🎯" },
            { label: "Orang Tua Terbantu", value: "32,000+", color: "#2e7d32", icon: "💛" },
          ].map((stat, i) => (
            <div key={i} style={{ ...s.card, textAlign: "center", padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{stat.icon}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: textSec }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function ScreeningPage() {
    const stepLabels = [
      t.step_child_info,
      t.step_behavior,
      t.step_social,
      "Video AI",
      t.step_result
    ];
    const qPerStep = [0, 4, 4];
    const currentQs = step === 1 ? questions.slice(0, 4) : step === 2 ? questions.slice(4, 8) : [];

    return (
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        {/* Step Progress */}
        <div style={s.stepBar}>
          {stepLabels.map((label, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: i < stepLabels.length - 1 ? 1 : "none" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <div style={s.stepDot(step === i, step > i)}>{step > i ? "✓" : i + 1}</div>
                <span style={{ fontSize: 11, color: step === i ? primary : textSec, fontWeight: step === i ? 600 : 400, whiteSpace: "nowrap" }}>{label}</span>
              </div>
              {i < stepLabels.length - 1 && <div style={s.stepLine(step > i)} />}
            </div>
          ))}
        </div>

        <div style={s.card}>
          {/* Step 0: Child Info */}
          {step === 0 && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 6 }}>🧒 {t.step_child_info}</div>
              <p style={{ color: textSec, fontSize: 14, marginBottom: 24 }}>{lang === "id" ? "Masukkan informasi dasar anak Anda untuk memulai skrining." : "Enter your child's basic information to begin screening."}</p>
              <div style={{ display: "grid", gap: 18 }}>
                <div><label style={s.label}>{t.child_name}</label><input style={s.input} value={childInfo.name} onChange={e => setChildInfo({ ...childInfo, name: e.target.value })} placeholder={lang === "id" ? "Nama lengkap anak" : "Child's full name"} /></div>
                <div><label style={s.label}>{t.child_age}</label><input style={s.input} type="number" min={12} max={72} value={childInfo.age} onChange={e => setChildInfo({ ...childInfo, age: e.target.value })} placeholder="e.g. 36" /></div>
                <div>
                  <label style={s.label}>{t.child_gender}</label>
                  <div style={{ display: "flex", gap: 12 }}>
                    {[{ val: "male", label: t.male }, { val: "female", label: t.female }].map(g => (
                      <div key={g.val} onClick={() => setChildInfo({ ...childInfo, gender: g.val })} style={{ flex: 1, padding: 14, borderRadius: 10, cursor: "pointer", border: `2px solid ${childInfo.gender === g.val ? primary : cardBorder}`, background: childInfo.gender === g.val ? (dark ? "#0d2137" : "#eef6ff") : "transparent", textAlign: "center", fontWeight: 600, fontSize: 14, color: childInfo.gender === g.val ? primary : textSec, transition: "all 0.2s" }}>
                        {g.val === "male" ? "👦" : "👧"} {g.label}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div style={{ marginTop: 28, display: "flex", justifyContent: "flex-end" }}>
                <button style={s.btn()} onClick={() => setStep(1)} disabled={!childInfo.name || !childInfo.age || !childInfo.gender}>{t.next} →</button>
              </div>
            </div>
          )}

          {/* Steps 1-2: Questions */}
          {(step === 1 || step === 2) && (
            <div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 4 }}>
                {step === 1 ? "🧠 " + (lang === "id" ? "Perilaku & Indra" : "Behavior & Senses") : "💬 " + (lang === "id" ? "Sosial & Komunikasi" : "Social & Communication")}
              </div>
              <p style={{ color: textSec, fontSize: 13, marginBottom: 24 }}>{lang === "id" ? `Pertanyaan ${step === 1 ? "1-4" : "5-8"} dari 8` : `Questions ${step === 1 ? "1-4" : "5-8"} of 8`}</p>
              <div style={{ marginBottom: 16 }}><ProgressBar value={step === 1 ? 25 : 75} /></div>
              <div style={{ display: "grid", gap: 20 }}>
                {currentQs.map((q, i) => {
                  const qIdx = step === 1 ? i : i + 4;
                  return (
                    <div key={q.id} style={{ padding: 18, borderRadius: 12, border: `1px solid ${cardBorder}`, background: dark ? "#21262d" : "#f8fafb" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
                        <span style={{ fontSize: 22 }}>{q.icon}</span>
                        <div>
                          <div style={{ fontSize: 11, fontWeight: 700, color: primary, marginBottom: 4, letterSpacing: 0.5 }}>{q.category.toUpperCase()}</div>
                          <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{q.question}</div>
                        </div>
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                        {q.options.map((opt, oi) => (
                          <div key={oi} onClick={() => setAnswers(prev => ({ ...prev, [qIdx]: oi }))} style={{ padding: "10px 14px", borderRadius: 8, cursor: "pointer", border: `1.5px solid ${answers[qIdx] === oi ? primary : cardBorder}`, background: answers[qIdx] === oi ? (dark ? "#0d2137" : "#eef6ff") : "transparent", fontSize: 13, fontWeight: answers[qIdx] === oi ? 600 : 400, color: answers[qIdx] === oi ? primary : textSec, transition: "all 0.15s" }}>
                            {answers[qIdx] === oi ? "● " : "○ "}{opt}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between" }}>
                <button style={s.btn("outline")} onClick={() => setStep(step - 1)}>← {t.back}</button>
                {step === 1 ? (
                  <button style={s.btn()} onClick={() => setStep(2)} disabled={currentQs.some((_, i) => answers[i] === undefined)}>{t.next} →</button>
                ) : (
                  <button style={{ ...s.btn("teal") }} onClick={handleSubmit} disabled={[4, 5, 6, 7].some(i => answers[i] === undefined)}>🤖 {t.submit_screening}</button>
                )}
              </div>
            </div>
          )}

          {/* Analyzing */}
          {analyzing && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 48, marginBottom: 20 }}>🤖</div>
              <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>{t.analyzing}</div>
              <p style={{ color: textSec, fontSize: 14, marginBottom: 32 }}>{lang === "id" ? "Mohon tunggu, model AI sedang memproses data perilaku anak Anda..." : "Please wait, our AI model is processing your child's behavioral data..."}</p>
              <div style={{ display: "grid", gap: 10, maxWidth: 400, margin: "0 auto" }}>
                {(lang === "id" ? ["Menganalisis pola perilaku...", "Memproses data komunikasi...", "Menjalankan model klasifikasi...", "Menghasilkan rekomendasi..."] : ["Analyzing behavioral patterns...", "Processing communication data...", "Running classification model...", "Generating recommendations..."]).map((msg, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 16px", borderRadius: 8, border: `1px solid ${cardBorder}`, background: dark ? "#21262d" : "#f8fafb" }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", border: `2px solid ${primary}`, borderTopColor: "transparent", animation: "spin 0.8s linear infinite", flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: textSec }}>{msg}</span>
                  </div>
                ))}
              </div>
              <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
            </div>
          )}

          {/* Step 3: Video Upload */}

          {step === 3 && !analyzing && (

            <div>

              <div
                style={{
                  fontWeight: 700,
                  fontSize: 22,
                  marginBottom: 10
                }}
              >
                🎥 AI Video Analysis
              </div>

              <p
                style={{
                  color: textSec,
                  marginBottom: 24,
                  lineHeight: 1.6
                }}
              >
                Upload a short child interaction video
                for AI behavioral analysis.
              </p>

              <div
                style={{
                  padding: 24,
                  borderRadius: 16,
                  border: `2px dashed ${cardBorder}`,
                  background: dark ? "#21262d" : "#f8fafb"
                }}
              >

                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) =>
                    setSelectedVideo(
                      e.target.files[0]
                    )
                  }
                />

                {selectedVideo && (

                  <div
                    style={{
                      marginTop: 14,
                      color: primary,
                      fontWeight: 600
                    }}
                  >
                    ✅ {selectedVideo.name}
                  </div>

                )}

              </div>

              <div
                style={{
                  marginTop: 28,
                  display: "flex",
                  justifyContent: "space-between"
                }}
              >

                <button
                  style={s.btn("outline")}
                  onClick={() => setStep(2)}
                >
                  ← {t.back}
                </button>

                <button
                  style={s.btn("teal")}
                  disabled={!selectedVideo}
                  onClick={handleAIAnalysis}
                >
                  🤖 Analyze Video
                </button>

              </div>

            </div>

          )}

          {/* Result */}

          {step === 4 && result && !analyzing && (

            <ResultView
              result={result}
              childInfo={childInfo}
            />

          )}
        </div>
      </div>
    );
  }

  function ResultView({ result, childInfo }) {
    const riskConfig = {
      low: { color: "#2e7d32", bg: "#e8f5e9", icon: "✅", title: lang === "id" ? "Risiko Rendah" : "Low Risk", desc: lang === "id" ? "Anak Anda menunjukkan pola perilaku yang umumnya sesuai perkembangan. Tetap pantau dan lakukan pemeriksaan rutin." : "Your child shows behavioral patterns generally in line with typical development. Continue monitoring and regular check-ups." },
      moderate: { color: "#f57f17", bg: "#fff8e1", icon: "⚠️", title: lang === "id" ? "Risiko Sedang" : "Moderate Risk", desc: lang === "id" ? "Beberapa tanda yang memerlukan perhatian terdeteksi. Konsultasi dengan dokter anak atau psikolog anak sangat disarankan." : "Some signs requiring attention were detected. Consultation with a pediatrician or child psychologist is strongly recommended." },
      high: { color: "#c62828", bg: "#ffebee", icon: "🔴", title: lang === "id" ? "Risiko Tinggi" : "High Risk", desc: lang === "id" ? "Beberapa indikator yang perlu perhatian segera terdeteksi. Segera konsultasikan dengan spesialis anak atau dokter tumbuh kembang." : "Several indicators requiring immediate attention detected. Please consult a pediatric specialist urgently." },
    };
    const rc = riskConfig[result.risk];
    const recs = {
      low: lang === "id" ? ["Lanjutkan pemantauan perkembangan rutin", "Stimulasi bermain sosial yang kaya", "Pertahankan jadwal imunisasi", "Skrining ulang dalam 6 bulan"] : ["Continue regular developmental monitoring", "Encourage rich social play", "Maintain immunization schedule", "Re-screen in 6 months"],
      moderate: lang === "id" ? ["Konsultasi dengan dokter anak segera", "Terapi wicara dapat dipertimbangkan", "Program intervensi dini tersedia di Halodoc", "Skrining ulang dalam 3 bulan"] : ["Consult pediatrician promptly", "Speech therapy may be considered", "Early intervention programs available at Halodoc", "Re-screen in 3 months"],
      high: lang === "id" ? ["Konsultasi spesialis segera dalam 1-2 minggu", "Evaluasi komprehensif oleh tim multidisiplin", "Program ABA dan terapi terpadu tersedia", "Dukungan keluarga dan komunitas orang tua"] : ["See specialist within 1-2 weeks urgently", "Comprehensive multi-disciplinary evaluation", "ABA therapy and integrated programs available", "Family support and parent community"],
    };

    return (
      <div>
        <div style={{ fontWeight: 700, fontSize: 20, marginBottom: 24 }}>📊 {t.result_title}</div>

        {/* Disclaimer */}
        <div style={{ background: dark ? "#1a1a2e" : "#fff8e6", border: "1.5px solid #f0ad4e", borderRadius: 10, padding: "12px 16px", fontSize: 13, color: dark ? "#ffd77a" : "#856404", marginBottom: 24, lineHeight: 1.6 }}>
          {t.disclaimer}
        </div>

        {/* Risk Card */}
        <div style={{ background: rc.bg, border: `2px solid ${rc.color}30`, borderRadius: 16, padding: 24, marginBottom: 24, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>{rc.icon}</div>
          <div style={{ fontSize: 26, fontWeight: 800, color: rc.color, marginBottom: 6 }}>{rc.title}</div>
          <p style={{ fontSize: 14, color: dark ? text : "#444", maxWidth: 500, margin: "0 auto", lineHeight: 1.6 }}>{rc.desc}</p>
          <div style={{ marginTop: 20, display: "flex", justifyContent: "center", gap: 20, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: rc.color }}>{result.confidence}%</div>
              <div style={{ fontSize: 12, color: textSec }}>{t.confidence}</div>
            </div>
            <div style={{ width: 1, background: `${rc.color}30` }} />
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: rc.color }}>{result.score}</div>
              <div style={{ fontSize: 12, color: textSec }}>Risk Score</div>
            </div>
          </div>
        </div>

        {/* Behavior Analysis */}
        <div style={{ ...s.card, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>📈 {t.behavior_analysis}</div>
          <div style={{ display: "grid", gap: 12 }}>
            {result.behaviorScores.map((b, i) => (
              <div key={i}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 13, fontWeight: 500 }}>{b.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: b.score > 60 ? "#c62828" : b.score > 35 ? "#f57f17" : "#2e7d32" }}>{b.score}%</span>
                </div>
                <ProgressBar value={b.score} color={b.score > 60 ? "#ef5350" : b.score > 35 ? "#ffa726" : teal} />
              </div>
            ))}
          </div>
        </div>

        {/* Recommendations */}
        <div style={{ ...s.card, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 16 }}>💡 {t.recommendations}</div>
          <div style={{ display: "grid", gap: 10 }}>
            {recs[result.risk].map((r, i) => (
              <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: dark ? "#21262d" : "#f8fafb" }}>
                <span style={{ color: rc.color, fontSize: 16, flexShrink: 0 }}>→</span>
                <span style={{ fontSize: 14, lineHeight: 1.5 }}>{r}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button style={s.btn()} onClick={() => setPage("consult")}>👨‍⚕️ {t.consult_pedia}</button>
          <button style={{ ...s.btn("teal") }} onClick={() => setPage("consult")}>🧠 {t.consult_psych}</button>
          <button style={{ ...s.btn("outline") }} onClick={() => alert(lang === "id" ? "Laporan PDF sedang diunduh..." : "PDF report downloading...")}>{t.download_pdf}</button>
        </div>
      </div>
    );
  }

  function ConsultPage() {
    return (
      <div>
        <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>👨‍⚕️ {lang === "id" ? "Konsultasi Dokter" : "Doctor Consultation"}</div>
        <p style={{ color: textSec, marginBottom: 28 }}>{lang === "id" ? "Hubungkan langsung dengan dokter spesialis anak dan psikolog anak terpercaya." : "Connect directly with trusted pediatric specialists and child psychologists."}</p>

        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[t.consult_pedia, t.consult_psych, lang === "id" ? "Semua Dokter" : "All Doctors"].map((f, i) => (
            <button key={i} style={s.pill(i === 0)}>{f}</button>
          ))}
        </div>

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
          {doctors.map((doc, i) => (
            <div key={i} style={{ ...s.card, position: "relative" }}>
              {doc.tag && <div style={{ position: "absolute", top: 16, right: 16, background: primary + "18", color: primary, fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20, border: `1px solid ${primary}30` }}>{doc.tag}</div>}
              <div style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 16 }}>
                <div style={{ width: 52, height: 52, borderRadius: "50%", background: `linear-gradient(135deg, ${primary}, ${teal})`, color: "#fff", fontWeight: 700, fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{doc.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{doc.name}</div>
                  <div style={{ fontSize: 12, color: textSec, marginBottom: 4 }}>{doc.specialty}</div>
                  <div style={{ display: "flex", gap: 12, fontSize: 12, color: textSec }}>
                    <span>⭐ {doc.rating}</span>
                    <span>💬 {doc.reviews}</span>
                    <span>🏆 {doc.exp}</span>
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${cardBorder}` }}>
                <div>
                  <div style={{ fontWeight: 700, color: primary }}>{doc.price}</div>
                  <div style={{ fontSize: 11, color: doc.available ? "#2e7d32" : textSec }}>{doc.available ? (lang === "id" ? "● Tersedia Sekarang" : "● Available Now") : (lang === "id" ? "○ Besok" : "○ Tomorrow")}</div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button style={{ ...s.btn("outline"), padding: "8px 14px", fontSize: 12 }}>💬 Chat</button>
                  <button style={{ ...s.btn(), padding: "8px 14px", fontSize: 12 }}>{t.book_now}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  function HistoryPage() {
    return (
      <div>
        <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>📋 {t.screening_history}</div>
        <p style={{ color: textSec, marginBottom: 28 }}>{lang === "id" ? "Riwayat skrining dan perkembangan anak Anda." : "Your child's screening history and progress."}</p>
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
          <div style={{ display: "grid", gap: 12 }}>
            {mockHistory.map(h => (
              <div key={h.id} style={{ ...s.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ width: 42, height: 42, borderRadius: 10, background: h.risk === "low" ? "#e8f5e9" : h.risk === "moderate" ? "#fff8e1" : "#ffebee", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>
                    {h.risk === "low" ? "✅" : h.risk === "moderate" ? "⚠️" : "🔴"}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{h.childName}</div>
                    <div style={{ fontSize: 12, color: textSec }}>{h.date}</div>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                  <RiskBadge risk={h.risk} t={t} />
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontWeight: 700, fontSize: 15 }}>{h.confidence}%</div>
                    <div style={{ fontSize: 11, color: textSec }}>{t.confidence}</div>
                  </div>
                  <button style={{ ...s.btn("outline"), padding: "6px 12px", fontSize: 12 }}>📄 {lang === "id" ? "Lihat" : "View"}</button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ ...s.card, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>📈 {lang === "id" ? "Tren Risiko" : "Risk Trend"}</div>
              <MiniChart data={[{ label: "Mar", value: 65 }, { label: "Apr", value: 58 }, { label: "May", value: 42 }]} colors={["#ef5350", "#ffa726", teal]} />
              <p style={{ fontSize: 12, color: textSec, marginTop: 12, lineHeight: 1.5 }}>{lang === "id" ? "Tren membaik setelah intervensi dini dimulai." : "Trend improving after early intervention started."}</p>
            </div>
            <div style={{ ...s.card }}>
              <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>💡 {lang === "id" ? "Rekomendasi AI" : "AI Recommendations"}</div>
              {(lang === "id" ? ["Lanjutkan terapi wicara mingguan", "Tingkatkan waktu bermain bersama", "Skrining ulang disarankan Agustus"] : ["Continue weekly speech therapy", "Increase joint play time", "Re-screening advised August"]).map((r, i) => (
                <div key={i} style={{ fontSize: 13, padding: "8px 0", borderBottom: i < 2 ? `1px solid ${cardBorder}` : "none", color: textSec }}>→ {r}</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  function AboutPage() {
    const features = [
      { icon: "🤖", title: "Machine Learning Classification", desc: lang === "id" ? "Model Random Forest + Neural Network yang dilatih pada dataset 50,000+ kasus skrining autism tervalidasi secara klinis." : "Random Forest + Neural Network model trained on 50,000+ clinically validated autism screening cases." },
      { icon: "🧬", title: lang === "id" ? "Analisis Pola Perilaku" : "Behavioral Pattern Analysis", desc: lang === "id" ? "Algoritma kami menganalisis 8 domain perilaku kunci yang berkorelasi dengan indikator DSM-5 untuk autism spectrum disorder." : "Our algorithm analyzes 8 key behavioral domains correlated with DSM-5 indicators for autism spectrum disorder." },
      { icon: "📊", title: lang === "id" ? "AI Kesehatan Prediktif" : "Predictive Healthcare AI", desc: lang === "id" ? "Model prediktif kami divalidasi oleh tim dokter spesialis Halodoc dengan akurasi 94.2% pada populasi Indonesia." : "Our predictive model is validated by Halodoc's specialist team with 94.2% accuracy on Indonesian population." },
      { icon: "🌱", title: lang === "id" ? "Dukungan Intervensi Dini" : "Early Intervention Support", desc: lang === "id" ? "Hasil skrining langsung terhubung ke rekomendasi terapi dan dokter spesialis yang tepat di platform Halodoc." : "Screening results connect directly to appropriate therapy recommendations and specialists on the Halodoc platform." },
      { icon: "🔒", title: lang === "id" ? "Keamanan Data" : "Data Security", desc: lang === "id" ? "Data anak Anda dilindungi dengan enkripsi end-to-end dan kepatuhan penuh terhadap regulasi data kesehatan Indonesia." : "Your child's data is protected with end-to-end encryption and full compliance with Indonesian health data regulations." },
      { icon: "🏥", title: lang === "id" ? "Validasi Klinis" : "Clinical Validation", desc: lang === "id" ? "Dikembangkan bersama tim dokter spesialis anak, psikiater anak, dan pakar tumbuh kembang dari rumah sakit mitra Halodoc." : "Developed with pediatric specialists, child psychiatrists, and developmental experts from Halodoc partner hospitals." },
    ];
    return (
      <div>
        <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>🤖 {t.ai_tech}</div>
        <p style={{ color: textSec, marginBottom: 32 }}>{lang === "id" ? "Didukung oleh kecerdasan buatan terdepan dan validasi klinis para ahli Halodoc." : "Powered by cutting-edge AI and clinical validation from Halodoc experts."}</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 18 }}>
          {features.map((f, i) => (
            <div key={i} style={{ ...s.card }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 8 }}>{f.title}</div>
              <p style={{ fontSize: 13, color: textSec, lineHeight: 1.7, margin: 0 }}>{f.desc}</p>
            </div>
          ))}
        </div>
        {/* Model accuracy visual */}
        <div style={{ ...s.card, marginTop: 28 }}>
          <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>🎯 {lang === "id" ? "Performa Model AI" : "AI Model Performance"}</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 16 }}>
            {[{ label: lang === "id" ? "Akurasi" : "Accuracy", value: "94.2%", color: primary }, { label: "Sensitivity", value: "91.8%", color: teal }, { label: "Specificity", value: "96.1%", color: "#2e7d32" }, { label: "AUC-ROC", value: "0.97", color: "#f57f17" }].map((m, i) => (
              <div key={i} style={{ textAlign: "center", padding: "20px 16px", borderRadius: 12, background: dark ? "#21262d" : "#f8fafb", border: `1px solid ${cardBorder}` }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: m.color }}>{m.value}</div>
                <div style={{ fontSize: 12, color: textSec, marginTop: 4 }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  function AdminPage() {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const maxVal = Math.max(...adminData.monthlyData);
    return (
      <div>
        <div style={{ fontWeight: 800, fontSize: 26, marginBottom: 8 }}>📊 {t.admin_title}</div>
        <p style={{ color: textSec, marginBottom: 28 }}>{lang === "id" ? "Analitik dan wawasan platform skrining AI Halodoc." : "Analytics and insights for Halodoc AI screening platform."}</p>

        {/* KPI Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 16, marginBottom: 28 }}>
          {[
            { label: t.total_screenings, value: "47,829", delta: "+23%", color: primary, icon: "🧩" },
            { label: lang === "id" ? "Risiko Rendah" : "Low Risk", value: `${adminData.lowRisk}%`, delta: "+2%", color: "#2e7d32", icon: "✅" },
            { label: lang === "id" ? "Risiko Sedang" : "Moderate Risk", value: `${adminData.moderateRisk}%`, delta: "-1%", color: "#f57f17", icon: "⚠️" },
            { label: lang === "id" ? "Risiko Tinggi" : "High Risk", value: `${adminData.highRisk}%`, delta: "-1%", color: "#c62828", icon: "🔴" },
            { label: t.accuracy, value: `${adminData.accuracy}%`, delta: "+0.3%", color: teal, icon: "🎯" },
            { label: lang === "id" ? "Konsultasi Lanjut" : "Follow-up Consults", value: "12,450", delta: "+31%", color: "#7b1fa2", icon: "👨‍⚕️" },
          ].map((kpi, i) => (
            <div key={i} style={{ ...s.card, padding: 20 }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{kpi.icon}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: kpi.color, marginBottom: 2 }}>{kpi.value}</div>
              <div style={{ fontSize: 12, color: textSec, marginBottom: 6 }}>{kpi.label}</div>
              <div style={{ fontSize: 11, color: kpi.delta.startsWith("+") ? "#2e7d32" : "#c62828", fontWeight: 700 }}>{kpi.delta} MoM</div>
            </div>
          ))}
        </div>

        {/* Monthly Chart */}
        <div style={{ ...s.card, marginBottom: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>📈 {lang === "id" ? "Skrining per Bulan (2025)" : "Monthly Screenings (2025)"}</div>
          <div style={{ display: "flex", gap: 6, alignItems: "flex-end", height: 160 }}>
            {adminData.monthlyData.map((v, i) => (
              <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                <span style={{ fontSize: 9, color: textSec, fontWeight: 600 }}>{(v / 1000).toFixed(1)}k</span>
                <div style={{ width: "100%", height: `${(v / maxVal) * 120}px`, background: i === 11 ? primary : (dark ? "#2d3748" : "#bfdbfe"), borderRadius: "4px 4px 0 0", transition: "height 0.6s ease" }} />
                <span style={{ fontSize: 9, color: textSec }}>{months[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Distribution + Age Groups */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          <div style={{ ...s.card }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>{t.pred_dist}</div>
            <div style={{ display: "grid", gap: 14 }}>
              {[{ label: t.low_risk, val: adminData.lowRisk, color: "#4caf50" }, { label: t.mod_risk, val: adminData.moderateRisk, color: "#ff9800" }, { label: t.high_risk, val: adminData.highRisk, color: "#f44336" }].map((d, i) => (
                <div key={i}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                    <span style={{ fontSize: 13 }}>{d.label}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: d.color }}>{d.val}%</span>
                  </div>
                  <ProgressBar value={d.val} color={d.color} />
                </div>
              ))}
            </div>
          </div>
          <div style={{ ...s.card }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 20 }}>{lang === "id" ? "Distribusi Usia Skrining" : "Screening Age Distribution"}</div>
            <MiniChart data={adminData.ageGroups} colors={[primary, teal, "#7b1fa2", "#f57f17"]} />
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 12 }}>
              {adminData.ageGroups.map((ag, i) => (
                <span key={i} style={{ fontSize: 11, color: textSec }}>{ag.label}: {ag.value}%</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={s.app}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      {/* Nav */}
      <nav style={s.nav}>
        <div style={s.navInner}>
          <div style={s.logo} onClick={() => setPage("home")}>
            <div style={{ width: 32, height: 32, background: primary, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <span style={{ color: "#fff", fontSize: 16, fontWeight: 800 }}>H</span>
            </div>
            <span style={s.logoText}>halodoc</span>
            <span style={s.logoBadge}>AI Autism</span>
          </div>
          <div style={s.navLinks}>
            {navItems.map(n => (
              <button key={n.id} style={s.navLink(page === n.id)} onClick={() => { setPage(n.id); if (n.id === "screening") { setStep(0); setAnswers({}); setResult(null); } }}>
                <span style={{ marginRight: 5 }}>{n.icon}</span>{n.label}
              </button>
            ))}
          </div>
          <div style={s.navRight}>
            <button style={s.iconBtn} onClick={() => setLang(l => l === "id" ? "en" : "id")}>🌐 {lang.toUpperCase()}</button>
            <button style={s.iconBtn} onClick={() => setDark(d => !d)}>{dark ? "☀️" : "🌙"}</button>
            <button style={{ ...s.btn(), padding: "8px 16px", fontSize: 13 }} onClick={() => { setPage("screening"); setStep(0); setAnswers({}); setResult(null); }}>🧩 {t.start_btn}</button>
          </div>
        </div>
      </nav>

      {/* Content */}
      <div style={s.content}>
        {page === "home" && <HomePage />}
        {page === "screening" && <ScreeningPage />}
        {page === "history" && <HistoryPage />}
        {page === "about" && <AboutPage />}
        {page === "consult" && <ConsultPage />}
        {page === "admin" && <AdminPage />}
      </div>

      {/* Footer */}
      <div style={{ borderTop: `1px solid ${cardBorder}`, padding: "24px 20px", textAlign: "center", fontSize: 12, color: textSec }}>
        <div style={{ marginBottom: 8 }}>⚕️ {lang === "id" ? "Fitur ini hanya untuk bantuan skrining awal, bukan pengganti diagnosis medis profesional." : "This feature is for early screening assistance only, not a substitute for professional medical diagnosis."}</div>
        <div>© 2025 Halodoc · AI Early Autism Screening Feature · {lang === "id" ? "Didukung oleh Tim Medis Halodoc" : "Powered by Halodoc Medical Team"}</div>
      </div>
    </div>
  );
}