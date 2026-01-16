import { BookOpen, Scale, AlertCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

function RuleCard({ title, children, icon: Icon }) {
  return (
    <div className="card p-6 space-y-3">
      <div className="flex items-center gap-2 font-bold text-lg">
        <Icon size={20} />
        <span>{title}</span>
      </div>
      <div className="text-gray-700 leading-relaxed text-sm">
        {children}
      </div>
    </div>
  );
}

export default function InheritanceRules() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="card p-8">
        <h1 className="text-3xl font-extrabold">
          {t("rules.title")}
        </h1>
        <p className="mt-3 text-gray-700 text-lg">
          {t("rules.subtitle")}
        </p>
      </div>

      {/* What is inheritance */}
      <RuleCard icon={BookOpen} title={t("rules.whatIs.title")}>
        {t("rules.whatIs.desc")}
      </RuleCard>

      {/* Fixed shares */}
      <RuleCard icon={Scale} title={t("rules.fard.title")}>
        <ul className="list-disc pr-6 space-y-1">
          <li>{t("rules.fard.mother")}</li>
          <li>{t("rules.fard.father")}</li>
          <li>{t("rules.fard.spouse")}</li>
          <li>{t("rules.fard.daughters")}</li>
        </ul>
      </RuleCard>

      {/* Asabah */}
      <RuleCard icon={Scale} title={t("rules.asabah.title")}>
        {t("rules.asabah.desc")}
      </RuleCard>

      {/* Blocking */}
      <RuleCard icon={AlertCircle} title={t("rules.blocking.title")}>
        <ul className="list-disc pr-6 space-y-1">
          <li>{t("rules.blocking.father")}</li>
          <li>{t("rules.blocking.sons")}</li>
        </ul>
      </RuleCard>

      {/* Awl & Radd */}
      <RuleCard icon={Scale} title={t("rules.awlRadd.title")}>
        <p>{t("rules.awlRadd.awl")}</p>
        <p className="mt-2">{t("rules.awlRadd.radd")}</p>
      </RuleCard>

      {/* Notice */}
      <div className="text-sm text-gray-500 text-center">
        {t("rules.notice")}
      </div>
    </div>
  );
}
