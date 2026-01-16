import { Link } from "react-router-dom";
import {
  ShieldCheck,
  BookOpenText,
  ArrowLeft,
  Scale,
  Info,
} from "lucide-react";
import { useTranslation } from "react-i18next";

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="card p-6">
      <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-gray-900 text-white">
        <Icon size={22} />
      </div>
      <h3 className="mt-4 font-bold text-lg">{title}</h3>
      <p className="mt-2 text-gray-700 leading-relaxed">{desc}</p>
    </div>
  );
}

function Step({ number, title, desc }) {
  return (
    <div className="flex gap-4">
      <div className="h-10 w-10 rounded-2xl bg-gray-900 text-white flex items-center justify-center font-bold">
        {number}
      </div>
      <div>
        <h4 className="font-bold">{title}</h4>
        <p className="text-gray-700 text-sm mt-1">{desc}</p>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="card p-10">
        <div className="max-w-3xl">
          <h1 className="text-4xl font-extrabold leading-snug">
            {t("home.title")}
          </h1>

          <p className="mt-4 text-gray-700 text-lg leading-relaxed">
            {t("home.subtitle")}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link to="/inheritance" className="btn-primary">
              {t("home.startCase")} <ArrowLeft size={18} />
            </Link>

            <Link to="/assistant" className="btn-secondary">
              {t("home.smartAssistant")} <ArrowLeft size={18} />
            </Link>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm text-gray-500">
            <Info size={16} />
            <span>{t("home.notice")}</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="grid md:grid-cols-3 gap-4">
        <Feature
          icon={Scale}
          title={t("home.features.accuracyTitle")}
          desc={t("home.features.accuracyDesc")}
        />
        <Feature
          icon={BookOpenText}
          title={t("home.features.schoolsTitle")}
          desc={t("home.features.schoolsDesc")}
        />
        <Feature
          icon={ShieldCheck}
          title={t("home.features.clarityTitle")}
          desc={t("home.features.clarityDesc")}
        />
      </section>

      {/* How it works */}
      <section className="card p-8">
        <h2 className="text-2xl font-extrabold mb-6">
          {t("home.howItWorks.title")}
        </h2>

        <div className="grid md:grid-cols-3 gap-6">
          <Step
            number={1}
            title={t("home.howItWorks.step1Title")}
            desc={t("home.howItWorks.step1Desc")}
          />
          <Step
            number={2}
            title={t("home.howItWorks.step2Title")}
            desc={t("home.howItWorks.step2Desc")}
          />
          <Step
            number={3}
            title={t("home.howItWorks.step3Title")}
            desc={t("home.howItWorks.step3Desc")}
          />
        </div>
      </section>

      {/* Footer */}
      <section className="text-center text-sm text-gray-500">
        {t("home.footer")}
      </section>
    </div>
  );
}
