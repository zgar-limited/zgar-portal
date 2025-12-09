import { retrieveCart } from "@/data/cart";
import { retrieveCustomer } from "@/data/customer";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";

export default async function RootLayout({ children }) {
  const customer = await retrieveCustomer();
  const cart = await retrieveCart()
  
  
  return (
    <>
      <HomeTips></HomeTips>
      <HomeHeader cart={cart} customer={customer}></HomeHeader>
      {children}
      <HomeFooter />
    </>
  );
}
