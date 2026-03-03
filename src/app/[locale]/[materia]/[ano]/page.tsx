import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Header from "@/components/Header";

export const dynamicParams = true;

export async function generateStaticParams() {
  return [];
}

export default async function SEOPage({ params }: { params: Promise<{ locale: string, materia: string, ano: string }> }) {
  const { locale, materia, ano } = await params;
  const t = await getTranslations({ locale });
  
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <Header />
      <main className="flex-1 px-4 py-16 text-center sm:py-24">
        <div className="mx-auto max-w-2xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
            {t(`subjects.${materia}`)} - {t(`grades.${ano}`)}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            {t("landing.description")}
          </p>
          <div className="mt-10">
            <Link
              href={`/${locale}/chat?subject=${materia}&grade=${ano}`}
              className="rounded-full bg-blue-500 px-8 py-4 text-lg font-semibold text-white shadow-sm transition-opacity hover:opacity-90"
            >
              {t("landing.cta")}
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
