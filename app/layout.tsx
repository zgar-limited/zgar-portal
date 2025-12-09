import "../public/scss/main.scss";

import "../public/css/tailwind.css";
import "../public/css/harmonyos_sans.css";
import "../public/css/harmonyos_sans_tc.css";

import MobileMenu from "@/components/modals/MobileMenu";

import GlobalEffectsProvider from "@/components/common/GlobalEffectProvider";
import QueryContext from "@/context/QueryContext";

import ToastProvider from "@/components/common/ToastProvider";
import HomeHeader from "@/widgets/HomeHeader";

export const metadata = {
  title: "Zgar Vape Website",
  description: "Zgar - Home",
};
export default async function RootLayout({ children }) {
  return (
    <html lang="zh-hant">
      <head></head>
      <body>
        <main id="wrapper">
          <QueryContext>
            <ToastProvider>
              {children}
              <MobileMenu />
            </ToastProvider>
          </QueryContext>

          <GlobalEffectsProvider />
        </main>
      </body>
    </html>
  );
}
