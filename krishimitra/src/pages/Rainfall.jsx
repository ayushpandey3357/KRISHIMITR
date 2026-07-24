import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useLanguage } from "../context/LanguageContext";

const SAMPLE_REGIONS = [
  { hi: "उत्तर प्रदेश (गंगीय क्षेत्र)", en: "Uttar Pradesh (Gangetic Plain)" },
  { hi: "पंजाब और हरियाणा", en: "Punjab & Haryana" },
  { hi: "बिहार और बंगाल", en: "Bihar & West Bengal" },
  { hi: "महाराष्ट्र और मध्य प्रदेश", en: "Maharashtra & Madhya Pradesh" },
  { hi: "राजस्थान (शुष्क)", en: "Rajasthan (Arid)" },
  { hi: "दक्षिण भारत (तटीय)", en: "South India (Coastal)" },
];

export default function Rainfall() {
  const { lang, t } = useLanguage();

  const [region, setRegion] = useState(SAMPLE_REGIONS[0].en);
  const [season, setSeason] = useState("Monsoon");
  const [temp, setTemp] = useState(31);
  const [humidity, setHumidity] = useState(78);
  const [pressure, setPressure] = useState(1008);
  const [wind, setWind] = useState(14);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handlePredict = (e) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    setTimeout(() => {
      // Intelligent rule simulation based on inputs
      const humVal = Number(humidity);
      const tempVal = Number(temp);
      const pressVal = Number(pressure);

      let probability = Math.min(
        98,
        Math.max(10, Math.round(humVal * 0.9 + (1020 - pressVal) * 1.5 - tempVal * 0.2))
      );

      let volume = Math.round((probability / 100) * 45 + Math.random() * 10);
      let alertLevel = probability > 75 ? "High" : probability > 45 ? "Moderate" : "Low";

      let recommendationHi = "";
      let recommendationEn = "";

      if (probability > 75) {
        recommendationHi = "भारी बारिश की संभावना! खेत में पानी निकासी (Drainage) का प्रबंधन करें और कीटनाशक छिड़काव स्थगित करें।";
        recommendationEn = "High chance of heavy rain! Manage field drainage and defer chemical spraying.";
      } else if (probability > 40) {
        recommendationHi = "हल्की से मध्यम बारिश की संभावना। सामान्य सिंचाई करें और नमी का ध्यान रखें।";
        recommendationEn = "Moderate rain expected. Proceed with light irrigation and monitor moisture.";
      } else {
        recommendationHi = "बारिश की संभावना कम है। फसलों के लिए कृत्रिम सिंचाई (Irrigation) की योजना बनाएं।";
        recommendationEn = "Low rain probability. Plan artificial irrigation for your crops.";
      }

      setResult({
        probability,
        volume,
        alertLevel,
        recommendationHi,
        recommendationEn,
        forecast: [
          { day: lang === "hi" ? "आज" : "Today", temp: `${tempVal}°C`, condition: probability > 60 ? "🌧️ Rain" : "⛅ Cloudy", rainChance: `${probability}%` },
          { day: lang === "hi" ? "कल" : "Tomorrow", temp: `${tempVal - 1}°C`, condition: "🌧️ Showers", rainChance: `${Math.min(95, probability + 10)}%` },
          { day: lang === "hi" ? "दिन 3" : "Day 3", temp: `${tempVal - 2}°C`, condition: "⛈️ Thunderstorm", rainChance: `${Math.min(90, probability + 5)}%` },
          { day: lang === "hi" ? "दिन 4" : "Day 4", temp: `${tempVal + 1}°C`, condition: "⛅ Partly Cloudy", rainChance: "35%" },
          { day: lang === "hi" ? "दिन 5" : "Day 5", temp: `${tempVal + 2}°C`, condition: "☀️ Sunny", rainChance: "15%" },
        ],
      });
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-6xl mx-auto w-full p-4 sm:p-8 space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-emerald-900 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-[-20px] bottom-[-20px] text-9xl opacity-20 select-none">
            🌧️
          </div>
          <div className="relative z-10 max-w-2xl">
            <span className="bg-blue-500/30 text-blue-200 border border-blue-400/30 px-3.5 py-1 rounded-full text-xs font-bold tracking-wide uppercase">
              {lang === "hi" ? "मौसम एवं वर्षा एआई" : "Weather & Rain AI Engine"}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 mb-2">
              🌧️ {t("predictRainfallTitle")}
            </h1>
            <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
              {t("predictRainfallDesc")}
            </p>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Weather Form */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <span>⚙️</span>
              <span>{lang === "hi" ? "मौसम मापदंड दर्ज करें" : "Enter Weather Parameters"}</span>
            </h2>

            <form onSubmit={handlePredict} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  {lang === "hi" ? "क्षेत्र (Region)" : "Select Region"}
                </label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  {SAMPLE_REGIONS.map((r, idx) => (
                    <option key={idx} value={r.en}>
                      {r[lang]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    {lang === "hi" ? "मौसम (Season)" : "Season"}
                  </label>
                  <select
                    value={season}
                    onChange={(e) => setSeason(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="Monsoon">{lang === "hi" ? "मानसून (Monsoon)" : "Monsoon"}</option>
                    <option value="Rabi">{lang === "hi" ? "सर्दियां (Rabi)" : "Winter (Rabi)"}</option>
                    <option value="Summer">{lang === "hi" ? "गर्मी (Summer)" : "Summer (Zaid)"}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    🌡️ {lang === "hi" ? "तापमान (°C)" : "Temp (°C)"}
                  </label>
                  <input
                    type="number"
                    value={temp}
                    onChange={(e) => setTemp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="10"
                    max="50"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    💧 {lang === "hi" ? "आर्द्रता (%)" : "Humidity (%)"}
                  </label>
                  <input
                    type="number"
                    value={humidity}
                    onChange={(e) => setHumidity(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="10"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                    🧭 {lang === "hi" ? "दबाव (hPa)" : "Pressure (hPa)"}
                  </label>
                  <input
                    type="number"
                    value={pressure}
                    onChange={(e) => setPressure(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    min="950"
                    max="1050"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  💨 {lang === "hi" ? "हवा की गति (km/h)" : "Wind Speed (km/h)"}
                </label>
                <input
                  type="number"
                  value={wind}
                  onChange={(e) => setWind(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl p-3 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  min="0"
                  max="80"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-6 rounded-2xl shadow-md shadow-blue-200 transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{lang === "hi" ? "पूर्वाभास की गणना हो रही है..." : "Calculating Forecast..."}</span>
                  </>
                ) : (
                  <>
                    <span>🌧️</span>
                    <span>{lang === "hi" ? "वर्षा पूर्वानुमान लगाएं" : "Predict Rainfall"}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Forecast Output Side */}
          <div className="lg:col-span-7 space-y-6">
            {result ? (
              <div className="space-y-6 animate-fade-in">
                {/* Result Card */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 p-6 rounded-3xl shadow-sm">
                  <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                    <div>
                      <span className="text-xs font-extrabold text-blue-700 uppercase tracking-widest">
                        {lang === "hi" ? "एआई वर्षा पूर्वानुमान" : "AI Rainfall Estimate"}
                      </span>
                      <h3 className="text-4xl font-extrabold text-blue-950 mt-1">
                        {result.probability}%{" "}
                        <span className="text-lg font-semibold text-blue-700">
                          {lang === "hi" ? "संभावना" : "Probability"}
                        </span>
                      </h3>
                    </div>

                    <div className="bg-white px-5 py-3 rounded-2xl shadow-xs border border-blue-100 text-center">
                      <p className="text-xs text-slate-500 font-bold uppercase">
                        {lang === "hi" ? "अनुमानित वर्षा" : "Est. Rainfall"}
                      </p>
                      <p className="text-2xl font-extrabold text-blue-600">
                        ~{result.volume} mm
                      </p>
                    </div>
                  </div>

                  {/* Advisory */}
                  <div className="bg-white p-5 rounded-2xl border border-blue-100 shadow-xs">
                    <h4 className="text-xs font-extrabold text-indigo-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                      <span>💡</span>
                      <span>{lang === "hi" ? "कृषि सलाह" : "Farming Advisory"}</span>
                    </h4>
                    <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                      {lang === "hi" ? result.recommendationHi : result.recommendationEn}
                    </p>
                  </div>
                </div>

                {/* 5-Day Forecast Grid */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200">
                  <h3 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span>📅</span>
                    <span>{lang === "hi" ? "5-दिवसीय मौसम पूर्वानुमान" : "5-Day Weather Forecast"}</span>
                  </h3>

                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                    {result.forecast.map((fc, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 border border-slate-200 p-3.5 rounded-2xl text-center hover:bg-blue-50/50 hover:border-blue-200 transition"
                      >
                        <p className="text-xs font-bold text-slate-600 mb-1">{fc.day}</p>
                        <p className="text-xl my-1">{fc.condition.split(" ")[0]}</p>
                        <p className="text-xs font-extrabold text-slate-800">{fc.temp}</p>
                        <p className="text-[11px] font-bold text-blue-600 mt-1">{fc.rainChance}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-12 rounded-3xl shadow-sm border border-slate-200 text-center flex flex-col items-center justify-center min-h-[380px]">
                <span className="text-6xl mb-4 animate-bounce">🌩️</span>
                <h3 className="text-xl font-bold text-slate-800 mb-2">
                  {lang === "hi" ? "वर्षा की सटीक भविष्यवाणी पाएं" : "Get Accurate Rainfall Predictions"}
                </h3>
                <p className="text-slate-500 text-sm max-w-md leading-relaxed">
                  {lang === "hi"
                    ? "बाईं ओर मौसम मापदंड दर्ज करें और 'वर्षा पूर्वानुमान लगाएं' बटन पर क्लिक करें।"
                    : "Fill in the weather parameters on the left and click 'Predict Rainfall' to view detailed insights."}
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
