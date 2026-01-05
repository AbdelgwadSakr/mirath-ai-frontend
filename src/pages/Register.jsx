import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { User, Mail, Lock, ArrowLeft } from "lucide-react";
import { useState } from "react";
import api from "../api/apiClient";

export default function Register() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/register", {
        fullName,
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.errors?.join?.("\n") ||
        (isArabic ? "حدث خطأ أثناء إنشاء الحساب" : "Error creating account");

      alert(msg);
    }
  };

  return (
    <div className="max-w-xl mx-auto card p-8">
      <h1 className="text-2xl font-extrabold">
        {isArabic ? "إنشاء حساب" : "Create Account"}
      </h1>
      <p className="mt-2 text-gray-700">
        {isArabic
          ? "أنشئ حسابًا جديدًا لاستخدام النظام."
          : "Create a new account to use the system."}
      </p>

      <form onSubmit={onSubmit} className="mt-6 space-y-4">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            {isArabic ? "الاسم الكامل" : "Full name"}
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/50 bg-white/60 backdrop-blur px-3 py-2">
            <User size={18} className="text-gray-500" />
            <input
              className="w-full bg-transparent outline-none"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            {isArabic ? "البريد الإلكتروني" : "Email"}
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/50 bg-white/60 backdrop-blur px-3 py-2">
            <Mail size={18} className="text-gray-500" />
            <input
              className="w-full bg-transparent outline-none"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-sm font-medium text-gray-700">
            {isArabic ? "كلمة المرور" : "Password"}
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-2xl border border-white/50 bg-white/60 backdrop-blur px-3 py-2">
            <Lock size={18} className="text-gray-500" />
            <input
              className="w-full bg-transparent outline-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary w-full justify-center">
          {isArabic ? "إنشاء الحساب" : "Create"} <ArrowLeft size={18} />
        </button>

        <div className="text-sm text-gray-700 flex items-center justify-between">
          <span>
            {isArabic ? "لديك حساب؟" : "Have an account?"}{" "}
            <Link to="/login" className="font-semibold hover:underline">
              {isArabic ? "تسجيل الدخول" : "Login"}
            </Link>
          </span>

          <Link to="/" className="hover:underline">
            {isArabic ? "العودة للرئيسية" : "Back home"}
          </Link>
        </div>
      </form>
    </div>
  );
}
