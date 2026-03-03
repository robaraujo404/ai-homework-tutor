"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "next/navigation";

export default function LocaleSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const handleLocaleChange = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
  };

  const locales = [
    { code: "pt-br", label: "🇧🇷 Português" },
    { code: "en", label: "🇺🇸 English" },
    { code: "es", label: "🇪🇸 Español" },
  ];

  return (
    <div className="flex gap-4">
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => handleLocaleChange(l.code)}
          className={`text-sm ${
            locale === l.code ? "font-bold text-gray-900" : "text-gray-400"
          } transition-colors hover:text-gray-600`}
        >
          {l.label}
        </button>
      ))}
    </div>
  );
}
