import "../public/scss/main.scss";
// import "photoswipe/dist/photoswipe.css";
// import "rc-slider/assets/index.css";
import "../public/css/tailwind.css";
import "../public/css/harmonyos_sans.css";
import "../public/css/harmonyos_sans_tc.css";

// import DemoModal from "@/components/modals/DemoModal";
import MobileMenu from "@/components/modals/MobileMenu";
import Context from "@/context/Context";
import ProductsSelectModal from "@/components/modals/ProductsSelectModal";
import CartModal from "@/components/modals/CartModal";
import GlobalEffectsProvider from "@/components/common/GlobalEffectProvider";
import QueryContext from "@/context/QueryContext";
import { AuthProvider } from "@/context/AuthContext";
import ToastProvider from "@/components/common/ToastProvider";
import { getCart } from "@/utils/server-cart";
import CartManager from "@/components/common/CartManager";

// import ScrollTop from "@/components/common/ScrollTop";
// import GlobalEffectsProvider from "@/components/common/FlobalEffectProvider";
export const metadata = {
  title: "Zgar Vape Website",
  description: "Zgar - Home",
};
export default async function RootLayout({ children }) {
  const cart = await getCart();
  return (
    <html lang="zh-hant">
      <head></head>
      <body>
        <main id="wrapper">
          <CartManager />
          <AuthProvider>
            <QueryContext>
              <ToastProvider>
                <Context cart={cart}>
                  {children}
                  <CartModal />
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
                  {/* <ProductsSelectModal /> */}
                </Context>
              </ToastProvider>
            </QueryContext>
          </AuthProvider>
          <GlobalEffectsProvider />
          {/* <ScrollTop /> */}
        </main>
      </body>
    </html>
  );
}
