import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, AlertTriangle, Download } from "lucide-react";
import { useState, useRef } from "react";
import html2pdf from "html2pdf.js";

/* ================= الأدلة الشرعية المكتوبة ================= */
const EVIDENCE = {
  wife: `
قال الله تعالى:
"وَلَهُنَّ الرُّبُعُ مِمَّا تَرَكْتُمْ إِن لَّمْ يَكُن لَّكُمْ وَلَدٌ ۚ
فَإِن كَانَ لَكُمْ وَلَدٌ فَلَهُنَّ الثُّمُنُ مِمَّا تَرَكْتُمْ"
(سورة النساء: 12)
`,
  mother: `
قال الله تعالى:
"وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ
إِن كَانَ لَهُ وَلَدٌ"
(سورة النساء: 11)
`,
  daughters: `
قال الله تعالى:
"فَإِن كُنَّ نِسَاءً فَوْقَ اثْنَتَيْنِ فَلَهُنَّ ثُلُثَا مَا تَرَكَ
وَإِن كَانَتْ وَاحِدَةً فَلَهَا النِّصْفُ"
(سورة النساء: 11)
`,
  father: `
قال الله تعالى:
"وَلِأَبَوَيْهِ لِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ مِمَّا تَرَكَ
إِن كَانَ لَهُ وَلَدٌ"
(سورة النساء: 11)
`,
  maternalSiblings: `
قال الله تعالى:
"وَإِن كَانَ رَجُلٌ يُورَثُ كَلَالَةً أَوِ امْرَأَةٌ
وَلَهُ أَخٌ أَوْ أُخْتٌ فَلِكُلِّ وَاحِدٍ مِّنْهُمَا السُّدُسُ"
(سورة النساء: 12)
`,
  maleFemale: `
قال الله تعالى:
"يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ
لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ"
(سورة النساء: 11)
`,
  awl: `
قاعدة فقهية:
إذا زادت الفروض عن التركة عُوِّلت المسألة،
فنقص نصيب كل وارث بنسبة الزيادة.
(مذهب الجمهور)
`,
  radd: `
قاعدة فقهية:
يُرَدُّ الباقي على أصحاب الفروض بنسبة فروضهم
ما عدا الزوجين.
(جمهور الفقهاء)
`,
};

export default function Results() {
  const navigate = useNavigate();
  const location = useLocation();
  const payload = location.state?.payload;
  if (!payload) return null;

  const pdfRef = useRef(null);

  const num = (v) => Number(v || 0);
  const madhhab = payload.madhhab || "jumhur";

  // إجمالي التركة يعتمد على الاختيارات فقط
  const totalEstate =
    (payload.hasCash ? num(payload.cashAmount) : 0) +
    (payload.hasGold ? num(payload.goldGrams) : 0) +
    (payload.hasRealEstate ? num(payload.realEstateValue) : 0) +
    (payload.hasLand ? num(payload.landValue) : 0);

  const sons = num(payload.sons);
  const daughters = num(payload.daughters);
  const brothers = num(payload.brothers);
  const sisters = num(payload.sisters);
  const maternalBrothers = num(payload.maternalBrothers);
  const maternalSisters = num(payload.maternalSisters);

  const hasFather = !!payload.hasFather;
  const hasMother = !!payload.hasMother;
  const hasGrandfather = !!payload.hasGrandfather;
  const hasDescendants = sons + daughters > 0;

  // ===== Validation بسيط
  const errors = [];
  if (totalEstate <= 0) errors.push("لازم تدخل قيمة للتركة (مال/ذهب/عقار/أرض)");
  if (payload.deceasedGender === "female" && num(payload.wivesCount) > 0)
    errors.push("المتوفاة أنثى → لا يمكن إدخال زوجات");

  const anyHeir =
    num(payload.wivesCount) > 0 ||
    hasFather ||
    hasMother ||
    hasGrandfather ||
    sons + daughters > 0 ||
    brothers + sisters > 0 ||
    maternalBrothers + maternalSisters > 0;

  if (!anyHeir) errors.push("لم يتم إدخال أي ورثة");

  if (errors.length) {
    return (
      <div className="card p-6 space-y-3">
        <div className="flex items-center gap-2 font-bold text-red-600">
          <AlertTriangle /> مشاكل في البيانات
        </div>
        <div className="text-sm text-red-700 space-y-1">
          {errors.map((e, i) => (
            <div key={i}>• {e}</div>
          ))}
        </div>
        <button className="btn-secondary mt-3" onClick={() => navigate(-1)}>
          رجوع
        </button>
      </div>
    );
  }

  let remaining = 1;
  let results = [];

  /* ===== الزوجات ===== */
  if (num(payload.wivesCount) > 0) {
    const share = hasDescendants ? 1 / 8 : 1 / 4;
    remaining -= share;
    results.push({
      heir: num(payload.wivesCount) > 1 ? `الزوجات (${payload.wivesCount})` : "الزوجة",
      share,
      reason: hasDescendants ? "وجود فرع وارث" : "عدم وجود فرع وارث",
      evidence: EVIDENCE.wife,
    });
  }

  /* ===== الأم ===== */
  if (hasMother) {
    const share = hasDescendants ? 1 / 6 : 1 / 3;
    remaining -= share;
    results.push({
      heir: "الأم",
      share,
      reason: hasDescendants ? "وجود فرع وارث" : "عدم وجود فرع وارث",
      evidence: EVIDENCE.mother,
    });
  }

  /* ===== البنات فقط (بدون أبناء) ===== */
  if (sons === 0 && daughters > 0) {
    const share = daughters === 1 ? 1 / 2 : 2 / 3;
    remaining -= share;
    results.push({
      heir: daughters === 1 ? "البنت" : `البنات (${daughters})`,
      share,
      reason: "عدم وجود ابن",
      evidence: EVIDENCE.daughters,
    });
  }

  /* ===== الأب ===== */
  if (hasFather) {
    const share = hasDescendants ? 1 / 6 : remaining;
    remaining -= hasDescendants ? share : remaining;
    results.push({
      heir: "الأب",
      share,
      reason: hasDescendants ? "السدس مع الفرع الوارث" : "يعصب ويأخذ الباقي",
      evidence: EVIDENCE.father,
    });
  }

  /* ===== الأولاد (ابن/بنت) ===== */
  if (hasDescendants && remaining > 0) {
    const units = sons * 2 + daughters; // للذكر مثل حظ الأنثيين
    if (units > 0) {
      if (sons > 0) {
        results.push({
          heir: sons === 1 ? "الابن" : `الأبناء (${sons})`,
          share: remaining * ((sons * 2) / units),
          reason: "تعصيب: للذكر مثل حظ الأنثيين",
          evidence: EVIDENCE.maleFemale,
        });
      }

      if (daughters > 0) {
        results.push({
          heir: daughters === 1 ? "البنت" : `البنات (${daughters})`,
          share: remaining * (daughters / units),
          reason: "تعصيب: للذكر مثل حظ الأنثيين",
          evidence: EVIDENCE.maleFemale,
        });
      }

      remaining = 0;
    }
  }

  /* ===== إخوة لأم ===== */
  const maternalCount = maternalBrothers + maternalSisters;
  const maternalBlocked = hasFather || hasGrandfather || hasDescendants;

  if (!maternalBlocked && maternalCount > 0) {
    const share = maternalCount === 1 ? 1 / 6 : 1 / 3;
    remaining -= share;
    results.push({
      heir: maternalCount === 1 ? "أخ/أخت لأم" : `إخوة لأم (${maternalCount})`,
      share,
      reason: "يرثون عند الكلالة (لا أب/جد ولا فرع وارث)",
      evidence: EVIDENCE.maternalSiblings,
    });
  }

  /* ===== تعصيب الإخوة (لو لا أب ولا جد ولا أبناء) ===== */
  if (!hasFather && !hasGrandfather && sons === 0 && remaining > 0) {
    const units = brothers * 2 + sisters;
    if (units > 0) {
      if (brothers > 0) {
        results.push({
          heir: brothers === 1 ? "الأخ الشقيق" : `الإخوة الأشقاء (${brothers})`,
          share: remaining * ((brothers * 2) / units),
          reason: "تعصيب (للذكر مثل حظ الأنثيين)",
          evidence: EVIDENCE.maleFemale,
        });
      }
      if (sisters > 0) {
        results.push({
          heir: sisters === 1 ? "الأخت الشقيقة" : `الأخوات الشقيقات (${sisters})`,
          share: remaining * (sisters / units),
          reason: "تعصيب مع الإخوة (للذكر مثل حظ الأنثيين)",
          evidence: EVIDENCE.maleFemale,
        });
      }
      remaining = 0;
    }
  }

  if (remaining < 0) remaining = 0;

  /* ===== العَول ===== */
  let totalShares = results.reduce((s, r) => s + r.share, 0);
  if (totalShares > 1 && madhhab !== "hanafi") {
    results = results.map((r) => ({
      ...r,
      share: r.share / totalShares,
      note: "عَول",
      evidence: `${r.evidence}\n\n${EVIDENCE.awl}`,
    }));
    totalShares = 1;
  }

  /* ===== الرد ===== */
  if (totalShares < 1) {
    const raddHeirs = results.filter((r) => !String(r.heir).startsWith("الزوج"));
    if (raddHeirs.length > 0) {
      const raddTotal = raddHeirs.reduce((s, r) => s + r.share, 0);
      const remainder = 1 - totalShares;
      results = results.map((r) =>
        raddHeirs.includes(r)
          ? {
              ...r,
              share: r.share + (r.share / raddTotal) * remainder,
              note: "رَد",
              evidence: `${r.evidence}\n\n${EVIDENCE.radd}`,
            }
          : r
      );
    }
  }

  const [view, setView] = useState("brief");

  const downloadPdf = async () => {
    const element = pdfRef.current;
    if (!element) return;

    const opt = {
      margin: [10, 10, 10, 10],
      filename: "mirath-report.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    await html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="space-y-6">
      {/* الجزء اللي هيتطبع PDF */}
      <div ref={pdfRef} dir="rtl" style={{ fontFamily: "Tahoma, Arial" }} className="space-y-6">
        <div className="card p-6">
          <h1 className="text-2xl font-extrabold">نتيجة تقسيم الميراث</h1>
          <p className="text-gray-600">
            المذهب: {madhhab === "hanafi" ? "حنفي" : "رأي الجمهور"}
          </p>
          <p className="text-gray-600">إجمالي التركة: {totalEstate.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-2">
            تنبيه: هذا ناتج حسابي تعليمي وليس فتوى شرعية.
          </p>
        </div>

        <div className="card p-4 flex gap-3">
          <button onClick={() => setView("brief")} className="btn-secondary">
            مختصر
          </button>
          <button onClick={() => setView("detailed")} className="btn-secondary">
            تفصيلي
          </button>
        </div>

        <div className="card p-6">
          {results.map((r, i) => (
            <div key={i} className="border-b py-4">
              <div className="flex justify-between font-bold">
                <span>{r.heir}</span>
                <span>
                  {(r.share * 100).toFixed(2)}% — {(r.share * totalEstate).toLocaleString()}
                </span>
              </div>

              {view === "detailed" && (
                <div className="mt-3 text-sm space-y-2">
                  <div>
                    <b>السبب:</b> {r.reason}
                  </div>

                  <div className="bg-gray-50 border rounded-xl p-3 whitespace-pre-line leading-relaxed">
                    <b>الدليل الشرعي:</b>
                    <div className="mt-2">{r.evidence}</div>
                  </div>

                  {r.note && <div className="text-amber-600">⚠ {r.note}</div>}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* أزرار خارج الـ PDF */}
      <div className="flex flex-wrap gap-3">
        <button className="btn-primary" onClick={downloadPdf}>
          <Download size={18} /> تحميل PDF
        </button>

        <button className="btn-secondary" onClick={() => navigate("/inheritance")}>
          <RefreshCw size={18} /> مسألة جديدة
        </button>
        <button className="btn-secondary" onClick={() => navigate(-1)}>
          <ArrowLeft size={18} /> رجوع
        </button>
      </div>
    </div>
  );
}
