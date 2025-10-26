import "../public/scss/main.scss";
// import "photoswipe/dist/photoswipe.css";
// import "rc-slider/assets/index.css";
import "../public/css/tailwind.css"
import "../public/css/harmonyos_sans.css"
import "../public/css/harmonyos_sans_tc.css"

// import DemoModal from "@/components/modals/DemoModal";
import MobileMenu from "@/components/modals/MobileMenu";
import Context from "@/context/Context";
// import ScrollTop from "@/components/common/ScrollTop";
// import GlobalEffectsProvider from "@/components/common/FlobalEffectProvider";
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
        <main id="wrapper" >
          <Context>
            {children}
            {/* <CartModal /> */}
            {/* <CompareColorModal /> */}
            {/* <CompareModal /> */}
            {/* <DemoModal /> */}
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
          {/* <GlobalEffectsProvider /> */}
          {/* <ScrollTop /> */}
        </main>
      </body>
    </html>
  );
}
