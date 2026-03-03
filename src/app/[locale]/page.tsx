import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";
import Header from "@/components/Header";

const SUBJECTS = [
  { value: "matematica", icon: "📐" },
  { value: "portugues", icon: "📖" },
  { value: "ciencias", icon: "🌿" },
  { value: "historia", icon: "📜" },
  { value: "geografia", icon: "🗺️" },
  { value: "ingles", icon: "🌎" },
  { value: "outro", icon: "✏️" },
];

export default function LandingPage() {
  const t = useTranslations("landing");
  const subT = useTranslations("subjects");
  const locale = useLocale();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-4 py-16 text-center sm:py-24">
          <div className="mx-auto max-w-2xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              {t("title")}
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              {t("description")}
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-4">
              <Link
                href={`/${locale}/chat`}
                className="rounded-full bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
              >
                {t("cta")}
              </Link>
              <span className="text-sm text-gray-400">{t("no_signup")}</span>
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="bg-gray-50 px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl">
            <h2 className="text-center text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("how_title")}
            </h2>
            <div className="mt-16 grid grid-cols-1 gap-12 sm:grid-cols-3">
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                  ❓
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{t("step1_title")}</h3>
                <p className="mt-2 text-gray-600">{t("step1_desc")}</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                  🔍
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{t("step2_title")}</h3>
                <p className="mt-2 text-gray-600">{t("step2_desc")}</p>
              </div>
              <div className="text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-4xl shadow-sm">
                  ⭐
                </div>
                <h3 className="mt-6 text-xl font-bold text-gray-900">{t("step3_title")}</h3>
                <p className="mt-2 text-gray-600">{t("step3_desc")}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Subjects */}
        <section className="px-4 py-16 sm:py-24">
          <div className="mx-auto max-w-7xl text-center">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              {t("subjects_title")}
            </h2>
            <div className="mt-12 flex flex-wrap justify-center gap-4">
              {SUBJECTS.map((subject) => (
                <Link
                  key={subject.value}
                  href={`/${locale}/chat?subject=${subject.value}`}
                  className="flex items-center gap-2 rounded-full border border-gray-300 bg-white px-6 py-3 text-lg font-medium text-gray-700 transition-colors hover:border-gray-400"
                >
                  <span>{subject.icon}</span>
                  {subT(subject.value)}
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-gray-100 py-12 text-center text-sm text-gray-400">
        <p>{t("footer")}</p>
      </footer>
    </div>
  );
}
