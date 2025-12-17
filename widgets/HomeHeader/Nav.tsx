import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Box, Zap, Layers, Info, Newspaper, Handshake, UserPlus } from "lucide-react";

export default function Nav() {
  const t = useTranslations("Navigation");
  
  return (
    <>
      <li className="menu-item">
        <Link href="/" className="item-link" style={{ fontSize: '17px', fontWeight: 'bold' }}>
          {t("home")}
          {/* <i className="icon icon-caret-down" /> */}
        </Link>
        {/* <div className="sub-menu mega-menu mega-home">
          <div className="container">
            <div className="row-demo">
              {demoItems.slice(0, 12).map((item, index) => (
                <div className="demo-item" key={index}>
                  <Link href={item.href} className="demo-img">
                    <Image
                      alt="Demo"
                      src={item.src}
                      width={item.width || 401}
                      height={item.height || 520}
                      className="lazyload"
                    />
                    {item.isNew && (
                      <div className="demo-label">
                        <span>New</span>
                      </div>
                    )}
                  </Link>
                  <Link
                    href={item.href}
                    className={`demo-name ${item.isNew ? "link" : ""}`}
                  >
                    {item.label}
                  </Link>
                </div>
              ))}
            </div>
            <div className="text-center">
              <a
                href="#modalDemo"
                data-bs-toggle="modal"
                className="tf-btn animate-btn"
              >
                View all demos (20)
              </a>
            </div>
          </div>
        </div> */}
      </li>
      <li className="menu-item position-relative">
        <Link href="/shop" className="item-link" style={{ fontSize: '17px', fontWeight: 'bold' }}>
          {t("products")}
          <i className="icon icon-caret-down" />
        </Link>
        <div className="sub-menu" style={{ left: '0', minWidth: '260px', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
          <ul className="sub-menu_list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' }}>
            <li>
              <Link href="/shop?category=close-pod" className="sub-menu_link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px', fontWeight: '500' }}>
                <Box size={18} color="black" />
                {t("products_sub.close_pod")}
              </Link>
            </li>
            <li>
              <Link href="/shop?category=disposable" className="sub-menu_link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px', fontWeight: '500' }}>
                <Zap size={18} color="black" />
                {t("products_sub.disposable")}
              </Link>
            </li>
            <li>
              <Link href="/shop?category=open-system" className="sub-menu_link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px', fontWeight: '500' }}>
                <Layers size={18} color="black" />
                {t("products_sub.open_system")}
              </Link>
            </li>
          </ul>
        </div>
        {/* <div className="sub-menu mega-menu">
          <div className="container">
            <div className="row">
              {shopPages.map((col, index) => (
                <div className="col-2" key={index}>
                  <div className="mega-menu-item">
                    <h4 className="menu-heading">{col.heading}</h4>
                    <ul className="sub-menu_list">
                      {col.items.map((item, i) => (
                        <li key={i}>
                          <Link href={item.href} className="sub-menu_link">
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}

              <div className="col-6">
                <ul className="list-hor">
                  {bannerItems.map((banner, i) => (
                    <li className="wg-cls hover-img" key={i}>
                      <Link href={banner.href} className="image img-style">
                        <Image
                          src={banner.imgSrc}
                          alt="Collection"
                          className="lazyload"
                          width={672}
                          height={952}
                        />
                      </Link>
                      <div className="cls-content">
                        <h4 className="tag_cls">{banner.tag}</h4>
                        <span className="br-line type-vertical" />
                        <Link href={banner.href} className="tf-btn-line">
                          Shop now
                        </Link>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div> */}
      </li>
      <li className="menu-item position-relative">
        <Link href="/about-us" className="item-link" style={{ fontSize: '17px', fontWeight: 'bold' }}>
          {t("about")}
          <i className="icon icon-caret-down" />
        </Link>
        <div className="sub-menu" style={{ left: '0', minWidth: '240px', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
          <ul className="sub-menu_list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' }}>
            <li>
              <Link href="/about-us" className="sub-menu_link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px', fontWeight: '500' }}>
                <Info size={18} color="black" />
                {t("about_sub.about_us")}
              </Link>
            </li>
            {/* <li>
              <Link href="/blog" className="sub-menu_link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px', fontWeight: '500' }}>
                <Newspaper size={18} color="black" />
                {t("about_sub.blog_news")}
              </Link>
            </li> */}
            <li>
              <Link href="/partner" className="sub-menu_link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px', fontWeight: '500' }}>
                <Handshake size={18} color="black" />
                {t("about_sub.partners")}
              </Link>
            </li>
          </ul>
        </div>
      </li>
      <li className="menu-item position-relative">
        <Link href="/contact-us" className="item-link" style={{ fontSize: '17px', fontWeight: 'bold' }}>
          {t("contact")}
          <i className="icon icon-caret-down" />
        </Link>
        <div className="sub-menu" style={{ left: '0', minWidth: '300px', borderRadius: '12px', padding: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', border: '1px solid #f0f0f0' }}>
          <ul className="sub-menu_list" style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '0' }}>
            <li>
              <Link href="/register" className="sub-menu_link" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 16px', borderRadius: '8px', transition: 'all 0.2s', fontSize: '15px', fontWeight: '500' }}>
                <UserPlus size={18} color="black" />
                {t("contact_sub.wholesaler")}
              </Link>
            </li>
          </ul>
        </div>
      </li>
      <li className="menu-item position-relative">
        <Link href="/care" className="item-link" style={{ fontSize: '17px', fontWeight: 'bold' }}>
          {t("care")}
        </Link>
      </li>
      <li className="menu-item">
        <Link href="/verify-guide" className="item-link" style={{ fontSize: '17px', fontWeight: 'bold' }}>
          {t("authentication")}
        </Link>
      </li>

      <li>
        <div className="animated-border-box radius-style-2">
          <Link className="tp-btn-gradient sm p-relative" href="/register">
            {t("club")}
          </Link>
        </div>
      </li>
    </>
  );
}
