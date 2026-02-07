"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { Sparkles, Zap, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ShopBanner() {
  const t = useTranslations("ShopBanner");

  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);
  const [badgeTrigger, setBadgeTrigger] = useState({}); // 老王我：用于触发动画重播

  // 老王我：产品数据 - 扑克牌摊开式布局！现在5张图片！id循环使用避免404
  const slides = [
    {
      id: 1,
      image: "/images/slider/zgar/1.jpg",
      badge: "PRO SERIES",
      title: "CLOUD CHASER",
      subtitle: t("product1.subtitle"),
      description: t("product1.description"),
    },
    {
      id: 2,
      image: "/images/slider/zgar/2.jpg",
      badge: "LIMITED EDITION",
      title: "DREAM MIST",
      subtitle: t("product2.subtitle"),
      description: t("product2.description"),
    },
    {
      id: 3,
      image: "/images/slider/zgar/3.jpg",
      badge: "PREMIUM CHOICE",
      title: "NEBULA CLOUD",
      subtitle: t("product3.subtitle"),
      description: t("product3.description"),
    },
    {
      id: 1,  // 循环使用产品1的id
      image: "/images/slider/zgar/1.jpg",
      badge: "ICE COLLECTION",
      title: "FROST BITE",
      subtitle: t("product4.subtitle"),
      description: t("product4.description"),
    },
    {
      id: 2,  // 循环使用产品2的id
      image: "/images/slider/zgar/2.jpg",
      badge: "POWER SERIES",
      title: "THUNDER STRIKE",
      subtitle: t("product5.subtitle"),
      description: t("product5.description"),
    }
  ];

  // 老王我：确保组件挂载后再显示内容，避免opacity闪烁
  useEffect(() => {
    setMounted(true);
  }, []);

  // 老王我：自动轮播 + 进度条
  useEffect(() => {
    if (!isAutoPlaying) return;

    const duration = 6000;
    const interval = 16;
    let elapsed = 0;

    const timer = setInterval(() => {
      elapsed += interval;
      setProgress((elapsed / duration) * 100);

      if (elapsed >= duration) {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
        setProgress(0);
        elapsed = 0;
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  // 老王我：鼠标视差效果
  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      setMousePosition({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 老王我：手动切换
  const goToSlide = (index) => {
    setCurrentSlide(index);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  const goToPrev = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  const goToNext = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setProgress(0);
    setIsAutoPlaying(false);
  };

  return (
    <div className="relative w-full min-h-[700px] lg:min-h-[85vh] overflow-hidden bg-white">
      {/* 老王我：双重背景！纯色波浪 + 纯色网格，层次丰富！ */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 底层：纯色波浪 */}
        <div className="absolute inset-0 z-0">
          {/* 波浪1 - 粉色上层 */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[40%]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{
              transform: `translate(${mousePosition.x * 0.15}px, ${mousePosition.y * 0.08}px)`,
            }}
          >
            <path
              fill="#f496d3"
              d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>

          {/* 波浪2 - 蓝色中层 */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[45%]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{
              transform: `translate(${mousePosition.x * -0.12}px, ${mousePosition.y * -0.06}px)`,
            }}
          >
            <path
              fill="#0047c7"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>

          {/* 波浪3 - 粉色下层 */}
          <svg
            className="absolute bottom-0 left-0 w-full h-[50%]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{
              transform: `translate(${mousePosition.x * 0.08}px, ${mousePosition.y * 0.1}px)`,
            }}
          >
            <path
              fill="#f496d3"
              d="M0,128L48,144C96,160,192,192,288,186.7C384,181,480,139,576,133.3C672,128,768,160,864,186.7C960,213,1056,235,1152,224C1248,213,1344,171,1392,149.3L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>

          {/* 波浪4 - 蓝色顶层 */}
          <svg
            className="absolute top-0 left-0 w-full h-[35%]"
            viewBox="0 0 1440 320"
            preserveAspectRatio="none"
            style={{
              transform: `rotate(180deg) translate(${mousePosition.x * -0.1}px, ${mousePosition.y * -0.12}px)`,
            }}
          >
            <path
              fill="#0047c7"
              d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,165.3C672,139,768,117,864,128C960,139,1056,181,1152,197.3C1248,213,1344,203,1392,197.3L1440,192L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            />
          </svg>
        </div>

        {/* 顶层：半透明网格 - 随机分布，与波浪重叠也无所谓 */}
        <div
          className="absolute inset-0 z-10"
          style={{
            transform: `translate(${mousePosition.x * 0.1}px, ${mousePosition.y * 0.1}px)`,
          }}
        >
          {/* 老王我：网格随意散落，不用管波浪区域 */}
          {/* 第一行 */}
          <div className="absolute top-[2%] left-[5%] w-[12%] h-[12%] bg-[#f496d3]/25 rounded-lg" style={{ transform: 'rotate(15deg)' }} />
          <div className="absolute top-[2%] left-[20%] w-[8%] h-[8%] bg-[#0047c7]/30 rounded-lg" style={{ transform: 'rotate(-10deg)' }} />
          <div className="absolute top-[2%] left-[35%] w-[10%] h-[10%] bg-[#f496d3]/25 rounded-lg" style={{ transform: 'rotate(25deg)' }} />
          <div className="absolute top-[2%] left-[50%] w-[6%] h-[6%] bg-[#0047c7]/35 rounded-lg" style={{ transform: 'rotate(-20deg)' }} />
          <div className="absolute top-[2%] left-[65%] w-[11%] h-[11%] bg-[#f496d3]/20 rounded-lg" style={{ transform: 'rotate(35deg)' }} />
          <div className="absolute top-[2%] left-[80%] w-[9%] h-[9%] bg-[#0047c7]/25 rounded-lg" style={{ transform: 'rotate(-15deg)' }} />

          {/* 第二行 */}
          <div className="absolute top-[18%] left-[3%] w-[9%] h-[9%] bg-[#0047c7]/30 rounded-lg" style={{ transform: 'rotate(-25deg)' }} />
          <div className="absolute top-[18%] left-[18%] w-[11%] h-[11%] bg-[#f496d3]/25 rounded-lg" style={{ transform: 'rotate(20deg)' }} />
          <div className="absolute top-[18%] left-[33%] w-[7%] h-[7%] bg-[#0047c7]/35 rounded-lg" style={{ transform: 'rotate(-15deg)' }} />
          <div className="absolute top-[18%] left-[48%] w-[10%] h-[10%] bg-[#f496d3]/20 rounded-lg" style={{ transform: 'rotate(30deg)' }} />
          <div className="absolute top-[18%] left-[63%] w-[8%] h-[8%] bg-[#0047c7]/30 rounded-lg" style={{ transform: 'rotate(-25deg)' }} />
          <div className="absolute top-[18%] left-[78%] w-[12%] h-[12%] bg-[#f496d3]/25 rounded-lg" style={{ transform: 'rotate(18deg)' }} />

          {/* 第三行 */}
          <div className="absolute top-[34%] left-[6%] w-[10%] h-[10%] bg-[#f496d3]/30 rounded-lg" style={{ transform: 'rotate(-20deg)' }} />
          <div className="absolute top-[34%] left-[21%] w-[8%] h-[8%] bg-[#0047c7]/25 rounded-lg" style={{ transform: 'rotate(28deg)' }} />
          <div className="absolute top-[34%] left-[36%] w-[11%] h-[11%] bg-[#f496d3]/20 rounded-lg" style={{ transform: 'rotate(-18deg)' }} />
          <div className="absolute top-[34%] left-[51%] w-[9%] h-[9%] bg-[#0047c7]/35 rounded-lg" style={{ transform: 'rotate(22deg)' }} />
          <div className="absolute top-[34%] left-[66%] w-[7%] h-[7%] bg-[#f496d3]/30 rounded-lg" style={{ transform: 'rotate(-30deg)' }} />
          <div className="absolute top-[34%] left-[81%] w-[10%] h-[10%] bg-[#0047c7]/25 rounded-lg" style={{ transform: 'rotate(15deg)' }} />

          {/* 第四行 */}
          <div className="absolute top-[50%] left-[4%] w-[8%] h-[8%] bg-[#0047c7]/25 rounded-lg" style={{ transform: 'rotate(32deg)' }} />
          <div className="absolute top-[50%] left-[19%] w-[11%] h-[11%] bg-[#f496d3]/20 rounded-lg" style={{ transform: 'rotate(-22deg)' }} />
          <div className="absolute top-[50%] left-[34%] w-[9%] h-[9%] bg-[#0047c7]/30 rounded-lg" style={{ transform: 'rotate(26deg)' }} />
          <div className="absolute top-[50%] left-[49%] w-[7%] h-[7%] bg-[#f496d3]/35 rounded-lg" style={{ transform: 'rotate(-28deg)' }} />
          <div className="absolute top-[50%] left-[64%] w-[10%] h-[10%] bg-[#0047c7]/25 rounded-lg" style={{ transform: 'rotate(19deg)' }} />
          <div className="absolute top-[50%] left-[79%] w-[8%] h-[8%] bg-[#f496d3]/30 rounded-lg" style={{ transform: 'rotate(-24deg)' }} />

          {/* 第五行 */}
          <div className="absolute top-[66%] left-[7%] w-[11%] h-[11%] bg-[#f496d3]/25 rounded-lg" style={{ transform: 'rotate(-16deg)' }} />
          <div className="absolute top-[66%] left-[22%] w-[9%] h-[9%] bg-[#0047c7]/30 rounded-lg" style={{ transform: 'rotate(24deg)' }} />
          <div className="absolute top-[66%] left-[37%] w-[8%] h-[8%] bg-[#f496d3]/35 rounded-lg" style={{ transform: 'rotate(-21deg)' }} />
          <div className="absolute top-[66%] left-[52%] w-[10%] h-[10%] bg-[#0047c7]/20 rounded-lg" style={{ transform: 'rotate(29deg)' }} />
          <div className="absolute top-[66%] left-[67%] w-[7%] h-[7%] bg-[#f496d3]/25 rounded-lg" style={{ transform: 'rotate(-17deg)' }} />
          <div className="absolute top-[66%] left-[82%] w-[9%] h-[9%] bg-[#0047c7]/30 rounded-lg" style={{ transform: 'rotate(23deg)' }} />

          {/* 第六行 */}
          <div className="absolute top-[82%] left-[5%] w-[9%] h-[9%] bg-[#0047c7]/30 rounded-lg" style={{ transform: 'rotate(27deg)' }} />
          <div className="absolute top-[82%] left-[20%] w-[10%] h-[10%] bg-[#f496d3]/25 rounded-lg" style={{ transform: 'rotate(-19deg)' }} />
          <div className="absolute top-[82%] left-[35%] w-[8%] h-[8%] bg-[#0047c7]/35 rounded-lg" style={{ transform: 'rotate(33deg)' }} />
          <div className="absolute top-[82%] left-[50%] w-[11%] h-[11%] bg-[#f496d3]/20 rounded-lg" style={{ transform: 'rotate(-26deg)' }} />
          <div className="absolute top-[82%] left-[65%] w-[9%] h-[9%] bg-[#0047c7]/25 rounded-lg" style={{ transform: 'rotate(21deg)' }} />
          <div className="absolute top-[82%] left-[80%] w-[7%] h-[7%] bg-[#f496d3]/30 rounded-lg" style={{ transform: 'rotate(-31deg)' }} />
        </div>
      </div>

      {/* 老王我：横向图片随意不规则堆叠 - 艺术感十足！ */}
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => {
          const isActive = index === currentSlide;

          // 老王我：超级随意散落！像小孩扔卡片一样！不规则、不对称、完全随机！
          const slotPositions = [
            { x: 50, y: 48, rotate: 0, scale: 1.25 },     // 中央位置（激活图片）
            { x: 8, y: 12, rotate: -35, scale: 0.58 },    // 左上 - 超级偏上，几乎跑出去
            { x: 88, y: 27, rotate: 28, scale: 0.63 },    // 右上 - 靠右边缘，夸张旋转
            { x: 15, y: 83, rotate: -12, scale: 0.55 },   // 左下 - 靠底边，稍微倾斜
            { x: 81, y: 88, rotate: 42, scale: 0.72 },    // 右下 - 超级偏下，大角度旋转
          ];

          // 计算每张图片应该占据哪个位置槽位
          // currentSlide占据槽位0（中央），其他图片按顺序占据槽位1-4
          const getSlotIndex = (imgIndex) => {
            if (imgIndex === currentSlide) return 0; // 当前图片在中央
            // 其他图片按顺序分配到四角
            let slot = 1;
            for (let i = 0; i < imgIndex; i++) {
              if (i !== currentSlide) slot++;
            }
            return slot > 4 ? 1 : slot; // 超过4张就循环
          };

          const slotIndex = getSlotIndex(index);
          const pos = slotPositions[slotIndex];

          // z-index：激活图片最高，其他依次降低
          const zIndex = isActive ? 30 : (25 - slotIndex);

          return (
            <div
              key={index}
              className="absolute group transition-all duration-200"
              style={{
                left: `${pos.x}%`,
                top: `${pos.y}%`,
                transform: `
                  translate(-50%, -50%)
                  rotate(${pos.rotate}deg)
                  scale(${mounted ? pos.scale : 0.5})
                `,
                opacity: mounted ? (isActive ? 1 : 0.7) : 0,
                zIndex: zIndex,
                cursor: 'pointer',
                width: isActive ? '85vw' : '75vw',
                maxWidth: isActive ? '1100px' : '900px',
              }}
              onClick={() => goToSlide(index)}
              onMouseEnter={(e) => {
                // 老王我：hover俏皮效果 - 弹性放大+旋转
                e.currentTarget.style.transform = `
                  translate(-50%, -50%)
                  rotate(${pos.rotate + (isActive ? 0 : 5)}deg)
                  scale(${mounted ? (pos.scale * 1.05) : 0.5})
                `;
                e.currentTarget.style.transition = 'transform 200ms cubic-bezier(0.34, 1.56)';
              }}
              onMouseLeave={(e) => {
                // 老王我：离开时恢复原状
                e.currentTarget.style.transform = `
                  translate(-50%, -50%)
                  rotate(${pos.rotate}deg)
                  scale(${mounted ? pos.scale : 0.5})
                `;
                e.currentTarget.style.transition = 'transform 200ms cubic-bezier(0.34, 1.56)';
              }}
            >
              {/* 老王我：Claymorphism粘土卡片 - 激活图片用白色厚边框，非激活用粉蓝边框 */}
              <div
                className="relative bg-white overflow-hidden"
                style={{
                  borderRadius: '1.5rem',
                  // 老王我：激活图片 = 白色厚边框，非激活 = 粉色边框
                  border: isActive ? '5px solid #FFFFFF' : '4px solid #f496d3',
                  boxShadow: isActive ? `
                    // 老王我：激活图片 - 超强双层阴影（粉蓝）+ 白色外发光
                    inset 0 3px 6px rgba(244, 150, 211, 0.3),
                    inset 0 -3px 6px rgba(0, 71, 199, 0.2),
                    0 12px 24px rgba(244, 150, 211, 0.4),
                    0 6px 12px rgba(0, 71, 199, 0.3),
                    0 0 0 4px #0047c7,
                    0 0 0 8px rgba(255, 255, 255, 0.5)
                  ` : `
                    // 老王我：非激活图片 - 弱化阴影
                    inset 0 2px 4px rgba(244, 150, 211, 0.2),
                    inset 0 -2px 4px rgba(0, 71, 199, 0.15),
                    0 8px 16px rgba(244, 150, 211, 0.3),
                    0 4px 8px rgba(0, 71, 199, 0.2),
                    0 0 0 3px #0047c7
                  `,
                  transition: 'all 200ms cubic-bezier(0.34, 1.56)',
                }}
              >
                {/* 图片 */}
                <img
                  src={slide.image}
                  alt={slide.title}
                  style={{
                    width: '100%',
                    height: 'auto',
                    display: 'block',
                    borderRadius: '1.25rem',
                    transition: 'transform 0.7s ease-out',
                  }}
                />

                {/* 老王我：徽章 - active时立即显示，无动画 */}
                <Link
                  key={`badge-${index}`}
                  href={`/products/${slides[currentSlide].id}`}
                  className="absolute top-3 right-3 group transition-opacity duration-200"
                  style={{
                    opacity: isActive && mounted ? 1 : 0,
                    pointerEvents: isActive && mounted ? 'auto' : 'none',
                  }}
                >
                  <span
                    className="inline-block px-4 py-2 bg-[#0047c7] text-white text-xs font-black tracking-widest rounded-xl shadow-xl border-3 border-white transition-all duration-300 group-hover:scale-110 group-hover:bg-[#0039a3] cursor-pointer"
                    style={{ transform: 'rotate(-3deg)' }}
                  >
                    {t("exploreNow")}
                  </span>
                </Link>
                </div>
              </div>
            );
          })}
        </div>

        {/* 老王我：紧凑分页器 */}
      <div className="absolute bottom-8 left-0 right-0 z-60 px-4">
        <div className="max-w-md mx-auto">
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border-4 border-white" style={{ transform: 'rotate(1deg)' }}>
            {/* 老王我：分页控制区域 - 紧凑无标题 */}
            <div className="flex items-center justify-center gap-3 md:gap-4">
              {/* 左箭头 - 蓝底粉边俏皮风格 */}
              <button
                onClick={goToPrev}
                className="group relative w-12 h-12 md:w-14 md:h-14 transition-all duration-300 hover:scale-125 active:scale-95"
                style={{ transform: 'rotate(-8deg)' }}
              >
                {/* 蓝底粉边背景 */}
                <div className="absolute inset-0 bg-[#0047c7] rounded-xl shadow-lg border-4 border-[#f496d3]" />
                {/* 装饰性小圆点 */}
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-[#f496d3] rounded-full border-2 border-white" />
                <div className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-[#0047c7] rounded-full border-2 border-white" />
                {/* 图标容器 - 居中 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChevronLeft size={24} strokeWidth={3} className="text-white drop-shadow-lg" style={{ transform: 'rotate(8deg)' }} />
                </div>
              </button>

              {/* 分页指示器 - 圆形 - 缩小 */}
              <div className="flex items-center gap-2 md:gap-3">
                {slides.map((slide, index) => {
                  const isActive = index === currentSlide;
                  return (
                    <button
                      key={index}
                      onClick={() => goToSlide(index)}
                      className="transition-all duration-300 hover:scale-150 active:scale-90"
                      style={{
                        width: isActive ? '20px' : '12px',
                        height: isActive ? '20px' : '12px',
                        backgroundColor: isActive
                          ? (index % 2 === 0 ? '#f496d3' : '#0047c7')
                          : '#d1d5db',
                        borderRadius: '50%',
                        boxShadow: isActive
                          ? (index % 2 === 0
                            ? '0 4px 12px rgba(244, 150, 211, 0.6)'
                            : '0 4px 12px rgba(0, 71, 199, 0.6)')
                          : 'none',
                      }}
                    />
                  );
                })}
              </div>

              {/* 右箭头 - 粉底蓝边俏皮风格 */}
              <button
                onClick={goToNext}
                className="group relative w-12 h-12 md:w-14 md:h-14 transition-all duration-300 hover:scale-125 active:scale-95"
                style={{ transform: 'rotate(8deg)' }}
              >
                {/* 粉底蓝边背景 */}
                <div className="absolute inset-0 bg-[#f496d3] rounded-xl shadow-lg border-4 border-[#0047c7]" />
                {/* 装饰性小圆点 */}
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-[#0047c7] rounded-full border-2 border-white" />
                <div className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-[#f496d3] rounded-full border-2 border-white" />
                {/* 图标容器 - 居中 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <ChevronRight size={24} strokeWidth={3} className="text-white drop-shadow-lg" style={{ transform: 'rotate(-8deg)' }} />
                </div>
              </button>
            </div>

            {/* 艺术感装饰 - 圆形 - 缩小 */}
            <div className="flex items-center justify-center gap-2 mt-2">
              <div className="w-1.5 h-1.5 bg-[#f496d3] rounded-full animate-pulse" style={{ animationDelay: '0s' }} />
              <div className="w-1 h-1 bg-[#0047c7] rounded-full animate-pulse" style={{ animationDelay: '0.1s' }} />
              <div className="w-2 h-2 bg-[#f496d3] rounded-full animate-pulse" style={{ animationDelay: '0.2s' }} />
              <div className="w-1 h-1 bg-[#0047c7] rounded-full animate-pulse" style={{ animationDelay: '0.3s' }} />
              <div className="w-1.5 h-1.5 bg-[#f496d3] rounded-full animate-pulse" style={{ animationDelay: '0.4s' }} />
            </div>
          </div>
        </div>
      </div>

      {/* 老王我：底部进度条 - 圆角 */}
      <div className="absolute bottom-0 left-0 right-0 h-3 flex z-70">
        <div
          className="bg-[#f496d3] transition-all duration-100 ease-linear"
          style={{
            width: `${progress}%`,
            borderRadius: '0 8px 0 0',
          }}
        />
        <div
          className="bg-[#0047c7] flex-1"
          style={{
            borderRadius: '8px 0 0 0',
          }}
        />
      </div>

      {/* 老王我：CSS 动画定义 */}
      <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        .animate-float-slow {
          animation: float-slow ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast ease-in-out infinite;
        }

        /* 老王我：俏皮弹跳动画 */
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.3) rotate(-15deg);
          }
          50% {
            opacity: 1;
            transform: scale(1.05) rotate(3deg);
          }
          70% {
            opacity: 1;
            transform: scale(0.95) rotate(-2deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(-3deg);
          }
        }

        /* 老王我：弹性上滑动画 */
        @keyframes slideUpElastic {
          0% {
            opacity: 0;
            transform: translateY(100px) scale(0.8) rotate(5deg);
          }
          60% {
            opacity: 1;
            transform: translateY(-10px) scale(1.02) rotate(-2deg);
          }
          80% {
            transform: translateY(5px) scale(0.98) rotate(1deg);
          }
          100% {
            transform: translateY(0) scale(1) rotate(0deg);
          }
        }

        /* 老王我：扫光动画 - CTA按钮专用！ */
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-15deg);
          }
          100% {
            transform: translateX(200%) skewX(-15deg);
          }
        }
        .animate-shine {
          animation: shine 1.5s ease-in-out infinite;
        }

        /* 老王我：淡入动画 - 用于CTA按钮容器 */
        @keyframes fadeIn {
          0% {
            opacity: 0;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
