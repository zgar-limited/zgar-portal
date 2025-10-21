import "../public/scss/main.scss";
import "photoswipe/dist/photoswipe.css";
import "rc-slider/assets/index.css";
import "../public/css/tailwind.css"
import "../public/css/harmonyos_sans.css"
import "../public/css/harmonyos_sans_tc.css"

import CartModal from "@/components/modals/CartModal";
import CompareColorModal from "@/components/modals/CompareColorModal";
import CompareModal from "@/components/modals/CompareModal";
import DemoModal from "@/components/modals/DemoModal";
import MobileMenu from "@/components/modals/MobileMenu";
import QuestionModal from "@/components/modals/QuestionModal";
import QuickViewModal from "@/components/modals/QuickViewModal";
import SearchModal from "@/components/modals/SearchModal";
import ShareModal from "@/components/modals/ShareModal";
import ShipAndDaliveryModal from "@/components/modals/ShipAndDaliveryModal";
import SizeGuideModal from "@/components/modals/SizeGuideModal";
import ToolbarModal from "@/components/modals/ToolbarModal";
import Context from "@/context/Context";
import ScrollTop from "@/components/common/ScrollTop";
import GlobalEffectsProvider from "@/components/common/FlobalEffectProvider";
import NewsLetterModal from "@/components/modals/NewsLetterModal";
export const metadata = {
  title: "Zgar Vape Website",
  description: "Zgar - Home",
};
export default function RootLayout({ children }) {
  return (
    <html lang="zh-hant">
      <head>
        
      </head>
      <body>
        <main id="wrapper">
          <Context>
            {children}
            {/* <CartModal /> */}
            {/* <CompareColorModal /> */}
            {/* <CompareModal /> */}
            <DemoModal />
            <MobileMenu />
            {/* <QuestionModal /> */}
            {/* <QuickViewModal /> */}
            {/* <SearchModal /> */}
            {/* <ShareModal /> */}
            {/* <ShipAndDaliveryModal /> */}
            {/* <SizeGuideModal /> */}
            {/* <ToolbarModal /> */}
            {/* <NewsLetterModal /> */}
          </Context>
          <GlobalEffectsProvider />
          <ScrollTop />
        </main>
      </body>
    </html>
  );
}
