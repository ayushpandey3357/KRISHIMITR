import { useNavigate, useLocation } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { lang, toggleLanguage, t } = useLanguage();
  const farmerName = localStorage.getItem("farmerName") || "Farmer";

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-emerald-100 shadow-xs px-6 py-3.5 flex justify-between items-center transition-all">
      {/* Brand Logo */}
      <div
        onClick={() => navigate("/")}
        className="flex items-center gap-2.5 cursor-pointer group"
      >
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-green-500 text-white flex items-center justify-center text-xl shadow-md group-hover:scale-105 transition-transform">
          🌾
        </div>
        <div>
          <h1 className="text-xl font-extrabold bg-gradient-to-r from-emerald-800 to-green-700 bg-clip-text text-transparent">
            {t("brandName")}
          </h1>
          <p className="text-[10px] font-medium text-emerald-600 tracking-wider">
            SMART AGRI AI
          </p>
        </div>
      </div>

      {/* Nav Links */}
      <div className="hidden md:flex items-center gap-1.5 bg-emerald-50/70 p-1.5 rounded-full border border-emerald-100/60">
        <button
          onClick={() => navigate("/dashboard")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
            isActive("/dashboard")
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-emerald-900 hover:bg-emerald-100/60"
          }`}
        >
          {t("navDashboard")}
        </button>
        <button
          onClick={() => navigate("/disease")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
            isActive("/disease")
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-emerald-900 hover:bg-emerald-100/60"
          }`}
        >
          {t("navDisease")}
        </button>
        <button
          onClick={() => navigate("/rainfall")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
            isActive("/rainfall")
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-emerald-900 hover:bg-emerald-100/60"
          }`}
        >
          {t("navRainfall")}
        </button>
        <button
          onClick={() => navigate("/recommendation")}
          className={`px-4 py-1.5 text-sm font-semibold rounded-full transition-all ${
            isActive("/recommendation")
              ? "bg-emerald-600 text-white shadow-xs"
              : "text-emerald-900 hover:bg-emerald-100/60"
          }`}
        >
          {t("navRecommendation")}
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Language Toggle Button */}
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 shadow-xs transition"
          title="Switch Language / भाषा बदलें"
        >
          <span>🌐</span>
          <span>{lang === "hi" ? "English" : "हिंदी"}</span>
        </button>

        {/* Auth / Profile */}
        {localStorage.getItem("farmerName") ? (
          <div
            onClick={() => navigate("/dashboard")}
            className="flex items-center gap-2 cursor-pointer bg-emerald-100/80 hover:bg-emerald-200/80 px-3 py-1.5 rounded-xl border border-emerald-200 transition"
          >
            <div className="w-7 h-7 rounded-lg bg-emerald-700 text-white flex items-center justify-center text-xs font-extrabold">
              {farmerName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-bold text-emerald-900 hidden sm:inline">
              {farmerName}
            </span>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 px-3 py-1.5 rounded-lg transition"
            >
              {t("login")}
            </button>
            <button
              onClick={() => navigate("/signup")}
              className="text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl shadow-xs transition"
            >
              {t("signUp")}
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
