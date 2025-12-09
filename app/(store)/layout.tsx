import { retrieveCustomer } from "@/data/customer";
import HomeFooter from "@/widgets/HomeFooter";
import HomeHeader from "@/widgets/HomeHeader";
import HomeTips from "@/widgets/HomeTips";

export default async function RootLayout({ children }) {
  const customer = await retrieveCustomer();
  return (
    <>
      <HomeTips></HomeTips>
      <HomeHeader customer={customer}></HomeHeader>
      {children}
      <HomeFooter />
    </>
  );
}
