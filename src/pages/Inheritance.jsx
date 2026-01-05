import { useMemo, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import {
  Coins,
  Landmark,
  Home,
  Gem,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

/* ---------- UI Helpers ---------- */
function StepPill({ active, done, title, index }) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={[
          "h-9 w-9 rounded-2xl flex items-center justify-center font-bold text-sm border",
          done
            ? "bg-green-600 text-white border-green-600"
            : active
            ? "bg-gray-900 text-white border-gray-900"
            : "bg-white/60 text-gray-700 border-white/50",
        ].join(" ")}
      >
        {done ? <CheckCircle2 size={18} /> : index}
      </div>
      <div className="hidden sm:block">
        <div className={active ? "font-bold" : "font-semibold text-gray-700"}>
          {title}
        </div>
      </div>
    </div>
  );
}

function ToggleCard({ icon: Icon, title, subtitle, checked, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "text-left w-full card p-5 transition",
        checked ? "ring-2 ring-gray-900/80" : "hover:bg-white/80",
      ].join(" ")}
    >
      <div className="flex items-start gap-3">
        <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
          <Icon size={20} />
        </div>
        <div className="flex-1">
          <div className="font-extrabold">{title}</div>
          <div className="text-sm text-gray-700 mt-1">{subtitle}</div>
        </div>
        <div
          className={[
            "h-6 w-6 rounded-lg border flex items-center justify-center",
            checked
              ? "bg-gray-900 border-gray-900 text-white"
              : "bg-white/60 border-white/60",
          ].join(" ")}
        >
          {checked ? "✓" : ""}
        </div>
      </div>
    </button>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-semibold text-gray-800">{label}</label>
      {children}
    </div>
  );
}

function Input({ value, onChange, type = "number", placeholder }) {
  return (
    <input
      type={type}
      className="w-full rounded-2xl border border-white/50 bg-white/60 px-4 py-3 outline-none"
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      min="0"
    />
  );
}

function Select({ value, onChange, children }) {
  return (
    <select
      className="w-full rounded-2xl border border-white/50 bg-white/60 px-4 py-3 outline-none"
      value={String(value)}
      onChange={onChange}
    >
      {children}
    </select>
  );
}

/* ---------- Page ---------- */
export default function Inheritance() {
  const { i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const navigate = useNavigate();

  const steps = useMemo(
    () => [
      { key: "estate", title: isArabic ? "معلومات التركة" : "Estate" },
      { key: "heirs", title: isArabic ? "الورثة" : "Heirs" },
      { key: "school", title: isArabic ? "المذهب والحساب" : "Madhhab & Calculate" },
    ],
    [isArabic]
  );

  const [step, setStep] = useState(0);

  /* ---------- Assets ---------- */
  const [hasCash, setHasCash] = useState(true);
  const [hasGold, setHasGold] = useState(false);
  const [hasRealEstate, setHasRealEstate] = useState(false);
  const [hasLand, setHasLand] = useState(false);

  const [cashAmount, setCashAmount] = useState("");
  const [goldGrams, setGoldGrams] = useState("");
  const [realEstateValue, setRealEstateValue] = useState("");
  const [landValue, setLandValue] = useState("");

  /* ---------- Heirs ---------- */
  const [deceasedGender, setDeceasedGender] = useState("male");
  const [wivesCount, setWivesCount] = useState(0);

  const [sons, setSons] = useState(0);
  const [daughters, setDaughters] = useState(0);

  const [hasFather, setHasFather] = useState(false);
  const [hasMother, setHasMother] = useState(false);
  const [hasGrandfather, setHasGrandfather] = useState(false);

  const [brothers, setBrothers] = useState(0);
  const [sisters, setSisters] = useState(0);

  // إخوة لأم
  const [maternalBrothers, setMaternalBrothers] = useState(0);
  const [maternalSisters, setMaternalSisters] = useState(0);

  /* ---------- Madhhab ---------- */
  const [madhhab, setMadhhab] = useState("jumhur");

  // حماية: لو المتوفى أنثى → مفيش زوجات
  useEffect(() => {
    if (deceasedGender === "female" && wivesCount !== 0) setWivesCount(0);
  }, [deceasedGender, wivesCount]);

  const onCalculate = () => {
    const payload = {
      hasCash,
      cashAmount: hasCash ? cashAmount : "0",

      hasGold,
      goldGrams: hasGold ? goldGrams : "0",

      hasRealEstate,
      realEstateValue: hasRealEstate ? realEstateValue : "0",

      hasLand,
      landValue: hasLand ? landValue : "0",

      deceasedGender,
      wivesCount: deceasedGender === "male" ? wivesCount : 0,

      sons,
      daughters,

      hasFather,
      hasMother,
      hasGrandfather: hasFather ? false : hasGrandfather, // لو الأب موجود الجد مش هيبقى مهم

      brothers,
      sisters,

      maternalBrothers,
      maternalSisters,

      madhhab,
    };

    navigate("/results", { state: { payload } });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="card p-8">
        <h1 className="text-3xl font-extrabold">
          {isArabic ? "تقسيم الميراث" : "Inheritance Distribution"}
        </h1>
        <div className="mt-4 flex gap-3">
          {steps.map((s, idx) => (
            <StepPill
              key={s.key}
              index={idx + 1}
              title={s.title}
              active={idx === step}
              done={idx < step}
            />
          ))}
        </div>
      </div>

      {/* Step 1: Estate */}
      {step === 0 && (
        <div className="card p-6 space-y-4">
          <ToggleCard
            icon={Coins}
            title={isArabic ? "مال" : "Cash"}
            subtitle={isArabic ? "مبلغ نقدي" : "Cash amount"}
            checked={hasCash}
            onClick={() => setHasCash(!hasCash)}
          />
          {hasCash && (
            <Field label={isArabic ? "مبلغ المال" : "Cash amount"}>
              <Input value={cashAmount} onChange={(e) => setCashAmount(e.target.value)} placeholder="150000" />
            </Field>
          )}

          <ToggleCard
            icon={Gem}
            title={isArabic ? "ذهب" : "Gold"}
            subtitle={isArabic ? "بالجرام (أو قيمة تقديرية)" : "In grams (or value)"}
            checked={hasGold}
            onClick={() => setHasGold(!hasGold)}
          />
          {hasGold && (
            <Field label={isArabic ? "قيمة/وزن الذهب" : "Gold grams/value"}>
              <Input value={goldGrams} onChange={(e) => setGoldGrams(e.target.value)} placeholder="100" />
            </Field>
          )}

          <ToggleCard
            icon={Home}
            title={isArabic ? "عقارات" : "Real estate"}
            subtitle={isArabic ? "قيمة تقديرية" : "Estimated value"}
            checked={hasRealEstate}
            onClick={() => setHasRealEstate(!hasRealEstate)}
          />
          {hasRealEstate && (
            <Field label={isArabic ? "قيمة العقارات" : "Real estate value"}>
              <Input value={realEstateValue} onChange={(e) => setRealEstateValue(e.target.value)} placeholder="500000" />
            </Field>
          )}

          <ToggleCard
            icon={Landmark}
            title={isArabic ? "أراضي" : "Land"}
            subtitle={isArabic ? "قيمة تقديرية" : "Estimated value"}
            checked={hasLand}
            onClick={() => setHasLand(!hasLand)}
          />
          {hasLand && (
            <Field label={isArabic ? "قيمة الأراضي" : "Land value"}>
              <Input value={landValue} onChange={(e) => setLandValue(e.target.value)} placeholder="300000" />
            </Field>
          )}
        </div>
      )}

      {/* Step 2: Heirs */}
      {step === 1 && (
        <div className="card p-6 space-y-4">
          <Field label={isArabic ? "نوع المتوفى" : "Deceased gender"}>
            <Select value={deceasedGender} onChange={(e) => setDeceasedGender(e.target.value)}>
              <option value="male">{isArabic ? "ذكر" : "Male"}</option>
              <option value="female">{isArabic ? "أنثى" : "Female"}</option>
            </Select>
          </Field>

          <Field label={isArabic ? "عدد الزوجات (لو المتوفى ذكر)" : "Wives count (male only)"}>
            <Input value={wivesCount} onChange={(e) => setWivesCount(+e.target.value)} placeholder="0" />
            {deceasedGender === "female" && (
              <div className="text-xs text-gray-500">المتوفاة أنثى → عدد الزوجات = 0 تلقائيًا</div>
            )}
          </Field>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={isArabic ? "عدد الأبناء الذكور" : "Sons"}>
              <Input value={sons} onChange={(e) => setSons(+e.target.value)} placeholder="0" />
            </Field>

            <Field label={isArabic ? "عدد البنات" : "Daughters"}>
              <Input value={daughters} onChange={(e) => setDaughters(+e.target.value)} placeholder="0" />
            </Field>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <Field label={isArabic ? "الأب موجود؟" : "Father alive?"}>
              <Select value={hasFather} onChange={(e) => setHasFather(e.target.value === "true")}>
                <option value="false">{isArabic ? "لا" : "No"}</option>
                <option value="true">{isArabic ? "نعم" : "Yes"}</option>
              </Select>
            </Field>

            <Field label={isArabic ? "الأم موجودة؟" : "Mother alive?"}>
              <Select value={hasMother} onChange={(e) => setHasMother(e.target.value === "true")}>
                <option value="false">{isArabic ? "لا" : "No"}</option>
                <option value="true">{isArabic ? "نعم" : "Yes"}</option>
              </Select>
            </Field>

            <Field label={isArabic ? "الجد موجود؟ (لو لا يوجد أب)" : "Grandfather? (if no father)"}>
              <Select
                value={hasFather ? false : hasGrandfather}
                onChange={(e) => setHasGrandfather(e.target.value === "true")}
              >
                <option value="false">{isArabic ? "لا" : "No"}</option>
                <option value="true">{isArabic ? "نعم" : "Yes"}</option>
              </Select>
              {hasFather && <div className="text-xs text-gray-500">وجود الأب يحجب الجد</div>}
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={isArabic ? "عدد الإخوة الأشقاء" : "Full brothers"}>
              <Input value={brothers} onChange={(e) => setBrothers(+e.target.value)} placeholder="0" />
            </Field>

            <Field label={isArabic ? "عدد الأخوات الشقيقات" : "Full sisters"}>
              <Input value={sisters} onChange={(e) => setSisters(+e.target.value)} placeholder="0" />
            </Field>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <Field label={isArabic ? "عدد الإخوة لأم" : "Maternal brothers"}>
              <Input value={maternalBrothers} onChange={(e) => setMaternalBrothers(+e.target.value)} placeholder="0" />
            </Field>

            <Field label={isArabic ? "عدد الأخوات لأم" : "Maternal sisters"}>
              <Input value={maternalSisters} onChange={(e) => setMaternalSisters(+e.target.value)} placeholder="0" />
            </Field>
          </div>
        </div>
      )}

      {/* Step 3: Madhhab */}
      {step === 2 && (
        <div className="card p-6 space-y-4">
          <Field label={isArabic ? "المذهب" : "Madhhab"}>
            <Select value={madhhab} onChange={(e) => setMadhhab(e.target.value)}>
              <option value="jumhur">{isArabic ? "رأي الجمهور" : "Jumhur"}</option>
              <option value="hanafi">Hanafi</option>
              <option value="maliki">Maliki</option>
              <option value="shafii">Shafi'i</option>
              <option value="hanbali">Hanbali</option>
            </Select>
          </Field>

          <button onClick={onCalculate} className="btn-primary w-full">
            {isArabic ? "احسب الميراث" : "Calculate"}
          </button>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className="btn-secondary"
          disabled={step === 0}
        >
          <ArrowRight size={18} /> {isArabic ? "رجوع" : "Back"}
        </button>
        <button
          onClick={() => setStep((s) => Math.min(2, s + 1))}
          className="btn-primary"
          disabled={step === 2}
        >
          {isArabic ? "التالي" : "Next"} <ArrowLeft size={18} />
        </button>
      </div>
    </div>
  );
}
