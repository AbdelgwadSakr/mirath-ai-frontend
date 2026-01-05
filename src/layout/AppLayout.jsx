import { Link, NavLink, useNavigate } from "react-router-dom";
import { Home, Calculator, Bot, Languages, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

function NavItem({ to, icon: Icon, children }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition ${
          isActive
            ? "bg-gray-900 text-white"
            : "text-gray-700 hover:bg-white/60"
        }`
      }
    >
      <Icon size={18} />
      {children}
    </NavLink>
  );
}

export default function AppLayout({ children }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const isArabic = i18n.language === "ar";
  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    document.documentElement.lang = isArabic ? "ar" : "en";
    document.documentElement.dir = isArabic ? "rtl" : "ltr";
    localStorage.setItem("lang", isArabic ? "ar" : "en");
  }, [isArabic]);

  const toggleLang = () => {
    i18n.changeLanguage(isArabic ? "en" : "ar");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/60 backdrop-blur border-b border-white/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-lg">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-gray-900 text-white">
              {isArabic ? "م" : "M"}
            </span>
            {t("appName")}
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <NavItem to="/" icon={Home}>{t("nav.home")}</NavItem>
            <NavItem to="/inheritance" icon={Calculator}>{t("nav.inheritance")}</NavItem>
            <NavItem to="/assistant" icon={Bot}>{t("nav.assistant")}</NavItem>
          </nav>

          <div className="flex items-center gap-2">
            {/* Language */}
            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-white/50 bg-white/50 backdrop-blur"
            >
              <Languages size={18} />
              {isArabic ? "EN" : "AR"}
            </button>

            {/* Login / Logout */}
            {isLoggedIn ? (
              <button
                onClick={logout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 text-white"
              >
                <LogIn size={18} />
                {isArabic ? "تسجيل خروج" : "Logout"}
              </button>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-900 text-white"
              >
                <LogIn size={18} />
                {t("nav.login")}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Nav */}
        <div className="md:hidden border-t border-white/40 bg-white/60">
          <div className="max-w-5xl mx-auto px-4 py-2 flex gap-2 overflow-x-auto">
            <NavItem to="/" icon={Home}>{t("nav.home")}</NavItem>
            <NavItem to="/inheritance" icon={Calculator}>{t("nav.inheritance")}</NavItem>
            <NavItem to="/assistant" icon={Bot}>{t("nav.assistant")}</NavItem>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/40 bg-white/50">
        <div className="max-w-5xl mx-auto px-4 py-6 text-sm text-gray-600 flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} {t("appName")}</span>
          <span>{t("footer.note")}</span>
        </div>
      </footer>
    </div>
  );
}
