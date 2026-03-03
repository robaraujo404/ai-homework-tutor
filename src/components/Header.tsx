"use client";

import { useTranslations } from "next-intl";
import LocaleSwitcher from "./LocaleSwitcher";
import Link from "next/link";
import { useLocale } from "next-intl";

interface HeaderProps {
  onToggleConfig?: () => void;
  showConfigButton?: boolean;
}

export default function Header({ onToggleConfig, showConfigButton }: HeaderProps) {
  const t = useTranslations("chat");
  const locale = useLocale();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href={`/${locale}`} className="flex items-center gap-2 text-xl font-bold text-gray-900">
          <span>📚</span>
          <span className="hidden sm:inline">{t("title")}</span>
        </Link>

        <div className="flex items-center gap-4">
          <LocaleSwitcher />
          {showConfigButton && (
            <button
              onClick={onToggleConfig}
              className="rounded-full bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200 sm:hidden"
            >
              {t("config_button")}
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
