import Footer1 from "@/components/footers/Footer1";
import Header1 from "@/components/header/Header1";
import Topbar1 from "@/components/header/Topbar1";
import React from "react";

const PartnerPage = () => {
  return (
    <>
      <Topbar1 containerFull containerFullClass="container-full" />
      <Header1 containerFull parentClass="" />
      <div className="container min-h-[500px]">This is Partner Page</div>
      <Footer1 />
    </>
  );
};

export default PartnerPage;
