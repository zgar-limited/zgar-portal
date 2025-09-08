import { useEffect } from "react";

export default function LayoutHandler({
  activeLayout,
  setActiveLayout,
  maxLayout,
}) {
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1200 && window.innerWidth > 767) {
        setActiveLayout((pre) => (pre > 3 ? 3 : pre));
      } else if (window.innerWidth < 768) {
        setActiveLayout((pre) => (pre > 2 ? 2 : pre));
      }
    };
    handleResize();
    // Add the resize event listener
    window.addEventListener("resize", handleResize);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures this runs only once
  const visibilityMap = {
    2: "",
    3: "d-none d-md-flex",
    4: "d-none d-xl-flex",
    5: "d-none d-xxl-flex",
    6: "d-none d-xxl-flex",
  };

  const layoutOptions = Array.from({ length: maxLayout - 1 }, (_, i) => i + 2);
  return (
    <>
      {layoutOptions.map((num) => (
        <li
          key={num}
          onClick={() => setActiveLayout(num)}
          className={`tf-view-layout-switch sw-layout-${num} ${
            visibilityMap[num] || ""
          } ${activeLayout === num ? "active" : ""}`}
          data-value-layout={`tf-col-${num}`}
        >
          <i className={`icon-grid-${num}`} />
        </li>
      ))}
      <li className="br-line type-vertical" />
      <li
        className={`tf-view-layout-switch sw-layout-list list-layout  ${
          activeLayout === 1 ? "active" : ""
        }`}
        data-value-layout="list"
        onClick={() => setActiveLayout(1)}
      >
        <i className="icon-list" />
      </li>
    </>
  );
}
