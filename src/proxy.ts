import createMiddleware from "next-intl/middleware";

export default createMiddleware({
  locales: ["pt-br", "en", "es"],
  defaultLocale: "pt-br",
});

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
