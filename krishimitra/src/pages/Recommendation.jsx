import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const SOIL_TYPES = [
  { hi: "दोमट मिट्टी (Loam Soil)", en: "Loam Soil" },
  { hi: "जलोढ़ मिट्टी (Alluvial Soil)", en: "Alluvial Soil" },
  { hi: "काली मिट्टी (Black Cotton Soil)", en: "Black Soil" },
  { hi: "लाल व पीली मिट्टी (Red Soil)", en: "Red Soil" },
  { hi: "बलुई मिट्टी (Sandy Soil)", en: "Sandy Soil" },
  { hi: "चिकनी मिट्टी (Clay Soil)", en: "Clay Soil" },
];

export default function Recommendation() {
  const { lang, t } = useLanguage();

  const [nitrogen, setNitrogen] = useState(90);
  const [phosphorus, setPhosphorus] = useState(42);
  const [potassium, setPotassium] = useState(43);
  const [ph, setPh] = useState(6.5);
  const [soilType, setSoilType] = useState("Loam Soil");
  const [season, setSeason] = useState("Kharif");

  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState(null);

  const handleRecommend = (e) => {
    e.preventDefault();
    setLoading(true);
    setRecommendations(null);

    setTimeout(() => {
      const n = Number(nitrogen);
      const p = Number(phosphorus);
      const k = Number(potassium);

      let cropList = [];

      if (season === "Kharif") {
        if (n > 80 && p > 35) {
          cropList = [
            {
              name: { hi: "धान / चावल (Rice/Paddy)", en: "Paddy (Rice)" },
              icon: "🌾",
              match: 96,
              yieldPerAcre: "22-26 Quintal",
              waterReq: { hi: "उच्च (1200-1400 mm)", en: "High (1200-1400 mm)" },
              npkRatio: "120:60:40 kg/ha",
              profitScore: "High ⭐⭐⭐⭐⭐",
              desc: {
                hi: "आपकी मिट्टी में नाइट्रोजन एवं फास्फोरस की अच्छी मात्रा धान की उच्च पैदावार के लिए आदर्श है।",
                en: "High nitrogen and phosphorus content in your soil is optimal for high paddy yields.",
              },
            },
            {
              name: { hi: "मक्का (Maize)", en: "Maize (Corn)" },
              icon: "🌽",
              match: 89,
              yieldPerAcre: "18-22 Quintal",
              waterReq: { hi: "मध्यम (500-600 mm)", en: "Medium (500-600 mm)" },
              npkRatio: "100:50:30 kg/ha",
              profitScore: "Very High ⭐⭐⭐⭐⭐",
              desc: {
                hi: "मक्का दोमट एवं जलोढ़ मिट्टी में उत्कृष्ट व्यावसायिक लाभ प्रदान करता है।",
                en: "Maize offers excellent commercial returns in loam and alluvial soils.",
              },
            },
            {
              name: { hi: "कपास (Cotton)", en: "Cotton" },
              icon: "☁️",
              match: 82,
              yieldPerAcre: "10-14 Quintal",
              waterReq: { hi: "मध्यम (600-800 mm)", en: "Medium (600-800 mm)" },
              npkRatio: "90:45:45 kg/ha",
              profitScore: "High ⭐⭐⭐⭐",
              desc: {
                hi: "काली या दोमट मिट्टी में उच्च पोटेशियम के साथ कपास की अच्छी उपज होती है।",
                en: "Good cotton yields with balanced potassium in black or loamy soil.",
              },
            },
          ];
        } else {
          cropList = [
            {
              name: { hi: "अरहर / तूर (Pigeon Pea)", en: "Pigeon Pea (Arhar)" },
              icon: "🫘",
              match: 94,
              yieldPerAcre: "8-12 Quintal",
              waterReq: { hi: "कम (350-450 mm)", en: "Low (350-450 mm)" },
              npkRatio: "20:50:20 kg/ha",
              profitScore: "Very High ⭐⭐⭐⭐⭐",
              desc: {
                hi: "दलहनी फसल अरहर वायुमंडलीय नाइट्रोजन स्थिरीकरण करती है और कम उर्वरक में अच्छा लाभ देती है।",
                en: "Leguminous crop fixing nitrogen naturally, ideal for lower fertilizer inputs.",
              },
            },
            {
              name: { hi: "बाजरा (Pearl Millet)", en: "Pearl Millet (Bajra)" },
              icon: "🌾",
              match: 88,
              yieldPerAcre: "12-15 Quintal",
              waterReq: { hi: "बहुत कम (250-350 mm)", en: "Very Low (250-350 mm)" },
              npkRatio: "60:30:20 kg/ha",
              profitScore: "High ⭐⭐⭐⭐",
              desc: {
                hi: "कम बारिश और कम उपजाऊ मिट्टी के लिए सबसे टिकाऊ विकल्प।",
                en: "Most resilient crop for low rainfall and moderate soil fertility.",
              },
            },
          ];
        }
      } else {
        // Rabi
        cropList = [
          {
            name: { hi: "गेहूँ (Wheat)", en: "Wheat" },
            icon: "🌾",
            match: 95,
            yieldPerAcre: "20-24 Quintal",
            waterReq: { hi: "मध्यम (450-550 mm)", en: "Medium (450-550 mm)" },
            npkRatio: "120:60:40 kg/ha",
            profitScore: "Very High ⭐⭐⭐⭐⭐",
            desc: {
              hi: "रबी की मुख्य फसल। उत्तम तापमान और नाइट्रोजन स्तर के कारण बम्पर पैदावार संभव।",
              en: "Premier Rabi cereal. Optimal temperature & nitrogen promises bumper yields.",
            },
          },
          {
            name: { hi: "सरसों (Mustard)", en: "Mustard" },
            icon: "🌼",
            match: 91,
            yieldPerAcre: "8-11 Quintal",
            waterReq: { hi: "कम (250-350 mm)", en: "Low (250-350 mm)" },
            npkRatio: "80:40:40 kg/ha",
            profitScore: "High ⭐⭐⭐⭐⭐",
            desc: {
              hi: "तेलहन फसल जो कम सिंचाई में उत्कृष्ट बाजार मूल्य और लाभ देती है।",
              en: "High-value oilseed crop yielding strong market returns with minimal irrigation.",
            },
          },
          {
            name: { hi: "चना (Chickpea)", en: "Chickpea (Gram)" },
            icon: "🫘",
            match: 86,
            yieldPerAcre: "10-14 Quintal",
            waterReq: { hi: "कम (250-300 mm)", en: "Low (250-300 mm)" },
            npkRatio: "20:50:20 kg/ha",
            profitScore: "High ⭐⭐⭐⭐",
            desc: {
              hi: "मिट्टी के स्वास्थ्य में सुधार करने वाली एवं कम पानी में उगने वाली रबी दाल।",
              en: "Soil-enriching legume crop thriving under minimal watering.",
            },
          },
        ];
      }

      setRecommendations(cropList);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-8">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-emerald-900 via-teal-900 to-green-800 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-20 select-none">
            🌱
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="bg-emerald-500/30 text-emerald-200 border border-emerald-400/30 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              {lang === "hi" ? "मृदा एवं फसल अनुशंसा एआई" : "Soil & Crop Match Engine"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-2">
              🌱 {t("cropRecTitle")}
            </h1>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              {t("cropRecDesc")}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Form Side */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>🧪</span>
              <span>{lang === "hi" ? "मिट्टी (NPK) एवं मौसम विवरण" : "Soil NPK & Climate Data"}</span>
            </h2>

            <form onSubmit={handleRecommend} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  🌾 {lang === "hi" ? "फसल का मौसम" : "Cropping Season"}
                </label>
                <select
                  value={season}
                  onChange={(e) => setSeason(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  <option value="Kharif">{lang === "hi" ? "खरीफ (जून - अक्टूबर)" : "Kharif (Monsoon)"}</option>
                  <option value="Rabi">{lang === "hi" ? "रबी (नवंबर - अप्रैल)" : "Rabi (Winter)"}</option>
                  <option value="Zaid">{lang === "hi" ? "जायद (मार्च - जून)" : "Zaid (Summer)"}</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  🏔️ {lang === "hi" ? "मिट्टी का प्रकार (Soil Type)" : "Soil Type"}
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {SOIL_TYPES.map((st, idx) => (
                    <option key={idx} value={st.en}>
                      {st[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-extrabold text-emerald-800 uppercase mb-1">
                    N ({lang === "hi" ? "नाइट्रोजन" : "Nitrogen"})
                  </label>
                  <input
                    type="number"
                    value={nitrogen}
                    onChange={(e) => setNitrogen(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="kg/ha"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-blue-800 uppercase mb-1">
                    P ({lang === "hi" ? "फास्फोरस" : "Phos."})
                  </label>
                  <input
                    type="number"
                    value={phosphorus}
                    onChange={(e) => setPhosphorus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="kg/ha"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-extrabold text-amber-800 uppercase mb-1">
                    K ({lang === "hi" ? "पोटेशियम" : "Potassium"})
                  </label>
                  <input
                    type="number"
                    value={potassium}
                    onChange={(e) => setPotassium(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-sm font-bold text-center focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    placeholder="kg/ha"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  ⚖️ {lang === "hi" ? "मिट्टी का पीएच स्तर (pH Level)" : "Soil pH Level"}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="4.5"
                    max="9.0"
                    step="0.1"
                    value={ph}
                    onChange={(e) => setPh(e.target.value)}
                    className="flex-1 accent-emerald-600"
                  />
                  <span className="w-12 text-center py-1 bg-emerald-100 font-extrabold text-emerald-900 rounded-lg text-sm">
                    {ph}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{lang === "hi" ? "सर्वश्रेष्ठ फसलें खोजी जा रही हैं..." : "Matching Best Crops..."}</span>
                  </>
                ) : (
                  <>
                    <span>🌱</span>
                    <span>{lang === "hi" ? "सर्वश्रेष्ठ फसल सुझाव प्राप्त करें" : "Get Crop Recommendations"}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Side */}
          <div className="lg:col-span-7 space-y-4">
            {recommendations ? (
              <div className="space-y-4 animate-fade-in">
                <h3 className="text-lg font-bold text-slate-800 flex items-center justify-between">
                  <span>🎯 {lang === "hi" ? "अनुशंसित फसलें (Top Matched Crops)" : "Top Recommended Crops"}</span>
                  <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
                    {recommendations.length} {lang === "hi" ? "विकल्प उपलब्ध" : "Matches Found"}
                  </span>
                </h3>

                {recommendations.map((crop, idx) => (
                  <div
                    key={idx}
                    className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-emerald-300 transition-all group"
                  >
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                          {crop.icon}
                        </div>
                        <div>
                          <h4 className="text-xl font-extrabold text-slate-900">
                            {crop.name[lang]}
                          </h4>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-md">
                            {crop.profitScore}
                          </span>
                        </div>
                      </div>

                      <div className="bg-emerald-600 text-white px-3.5 py-1.5 rounded-2xl font-extrabold text-sm shadow-xs">
                        {crop.match}% {lang === "hi" ? "उपयुक्त" : "Match"}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 mb-4 leading-relaxed font-medium">
                      {crop.desc[lang]}
                    </p>

                    <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-2xl border border-slate-100 text-center">
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                          {lang === "hi" ? "अनुमानित पैदावार" : "Est. Yield"}
                        </p>
                        <p className="text-xs font-extrabold text-slate-800 mt-0.5">
                          {crop.yieldPerAcre}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                          {lang === "hi" ? "जल आवश्यकता" : "Water Req."}
                        </p>
                        <p className="text-xs font-extrabold text-blue-700 mt-0.5">
                          {crop.waterReq[lang]}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase">
                          {lang === "hi" ? "संतुलित NPK" : "NPK Ratio"}
                        </p>
                        <p className="text-xs font-extrabold text-emerald-800 mt-0.5">
                          {crop.npkRatio}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center min-h-[380px]">
                <span className="text-6xl mb-4 animate-bounce">🌾</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {lang === "hi" ? "अपनी ज़मीन की क्षमता पहचानें" : "Discover Crop Suitability"}
                </h3>
                <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                  {lang === "hi"
                    ? "बाईं ओर अपनी मिट्टी का NPK मान और मौसम चुनें, फिर 'सर्वश्रेष्ठ फसल सुझाव' बटन पर क्लिक करें।"
                    : "Enter your soil NPK values and season on the left to receive AI-powered crop recommendations."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
