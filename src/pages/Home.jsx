import { Link } from "react-router-dom";
import { ShieldCheck, BookOpenText, Globe2, ArrowLeft } from "lucide-react";
import { useTranslation } from "react-i18next";

function Feature({ icon: Icon, title, desc }) {
  return (
    <div className="card p-6">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gray-900 text-white">
        <Icon size={20} />
      </div>
      <h3 className="mt-4 font-bold text-lg">{title}</h3>
      <p className="mt-2 text-gray-700">{desc}</p>
    </div>
  );
}

export default function Home() {
  const { t } = useTranslation();

  return (
    <div className="space-y-8">
      <section className="card p-8">
        <h1 className="text-3xl font-extrabold leading-snug">
          {t("home.title")}
        </h1>
        <p className="mt-3 text-gray-700 text-lg">
          {t("home.subtitle")}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Link to="/inheritance" className="btn-primary">
            {t("home.startCase")} <ArrowLeft size={18} />
          </Link>
          <Link to="/assistant" className="btn-secondary">
            {t("home.smartAssistant")} <ArrowLeft size={18} />
          </Link>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-4">
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
        <Feature
          icon={Globe2}
          title={t("home.features.scaleTitle")}
          desc={t("home.features.scaleDesc")}
        />
      </section>
    </div>
  );
}
