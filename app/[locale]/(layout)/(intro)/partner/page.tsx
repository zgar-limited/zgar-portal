import Image from "next/image";
import { Handshake, Globe, Users, Target, Mail } from "lucide-react";

export const metadata = {
  title: "Partner - Zgar 全球合作伙伴",
  description: "成为 Zgar 的合作伙伴，共同开拓全球电子烟市场",
};

export default function PartnerPage() {
  // 老王我：合作伙伴数据 - 按地区分组
  const partnerRegions = [
    {
      region: "Asia",
      label: "亚洲",
      color: "bg-brand-pink",
      textColor: "text-white",
      countries: [
        { code: "my", name: "Malaysia", nameZh: "马来西亚" },
        { code: "id", name: "Indonesia", nameZh: "印度尼西亚" },
        { code: "jp", name: "Japan", nameZh: "日本" },
        { code: "hk", name: "Hong Kong", nameZh: "香港" },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 老王我：Banner - 纯图片，宽屏，高度自动 */}
      <section className="w-full">
        <Image
          src="/images/partner/banner.webp"
          alt="Partner Banner"
          width={1920}
          height={0}
          className="w-full h-auto"
          priority
        />
      </section>

      {/* 老王我：合作伙伴介绍区 */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 md:px-6">
          {/* 标题区 */}
          <div className="text-center mb-16">
            <div className="inline-block bg-brand-blue text-white px-4 py-2 mb-6">
              <span className="font-black text-sm tracking-widest">GLOBAL PARTNERS</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-gray-900 mb-6">
              全球合作伙伴
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
              我们与全球顶尖企业建立战略合作关系，共同开拓电子烟市场，实现共赢发展
            </p>
          </div>

          {/* 老王我：合作伙伴优势 - 四个色块 */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-0 mb-16">
            <div className="bg-brand-pink text-white p-8 text-center">
              <Handshake className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-black mb-2">50+</div>
              <div className="text-sm font-bold">合作伙伴</div>
            </div>
            <div className="bg-brand-blue text-white p-8 text-center">
              <Globe className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-black mb-2">20+</div>
              <div className="text-sm font-bold">覆盖国家</div>
            </div>
            <div className="bg-black text-white p-8 text-center">
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-black mb-2">10+</div>
              <div className="text-sm font-bold">年合作</div>
            </div>
            <div className="bg-gray-900 text-white p-8 text-center">
              <Target className="w-12 h-12 mx-auto mb-4" />
              <div className="text-3xl font-black mb-2">100%</div>
              <div className="text-sm font-bold">满意度</div>
            </div>
          </div>

          {/* 老王我：按地区展示合作伙伴 */}
          {partnerRegions.map((region) => (
            <div key={region.region} className="mb-12">
              {/* 地区标题 */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-2 h-12 ${region.color}`}></div>
                <h2 className="text-3xl md:text-4xl font-black text-gray-900">
                  {region.label}
                </h2>
              </div>

              {/* 国旗网格 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {region.countries.map((country) => (
                  <a
                    key={country.code}
                    href="#"
                    className="group relative flex flex-col items-center gap-4 p-6 bg-white border-2 border-black hover:shadow-lg transition-all duration-200"
                  >
                    {/* 国旗图片 */}
                    <div className="relative w-24 h-16 bg-gray-100">
                      <Image
                        src={`/images/national-flag/${country.code}.svg`}
                        alt={country.name}
                        fill
                        className="object-contain"
                      />
                    </div>

                    {/* 国家名称 */}
                    <div className="text-center">
                      <div className="font-black text-gray-900 text-sm mb-1 group-hover:text-brand-pink transition-colors">
                        {country.nameZh}
                      </div>
                      <div className="text-xs text-gray-500 uppercase">
                        {country.name}
                      </div>
                    </div>

                    {/* 装饰性色块 */}
                    <div className="absolute top-0 right-0 w-0 h-0 border-l-[20px] border-l-transparent border-t-[16px] border-t-brand-pink opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  </a>
                ))}
              </div>
            </div>
          ))}

          {/* 老王我：加入我们 CTA - 二分屏色块 */}
          <div className="grid grid-cols-1 md:grid-cols-2 mt-16">
            {/* 左侧：蓝色块 - 内容 */}
            <div className="bg-brand-blue p-12 md:p-16 flex items-center justify-center">
              <div className="text-center text-white max-w-md">
                <Handshake className="w-16 h-16 mx-auto mb-6" />
                <h2 className="text-4xl md:text-5xl font-black mb-6">
                  成为合作伙伴
                </h2>
                <p className="text-lg md:text-xl font-bold mb-8 opacity-90">
                  加入我们的全球合作伙伴网络，共享资源，共同成长
                </p>
                <div className="space-y-4 text-left">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <p className="font-bold">独家产品代理权</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <p className="font-bold">市场支持与培训</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <p className="font-bold">品牌联合营销</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-white rounded-full mt-2 flex-shrink-0"></div>
                    <p className="font-bold">长期利润分成</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 右侧：粉色块 - CTA */}
            <div className="bg-brand-pink p-12 md:p-16 flex flex-col items-center justify-center text-white">
              <Mail className="w-16 h-16 mb-6" />
              <h3 className="text-2xl md:text-3xl font-black mb-6 text-center">
                立即联系我们
              </h3>
              <p className="text-lg font-bold mb-8 text-center opacity-90">
                提交您的合作意向，我们会在 24 小时内回复
              </p>
              <a
                href="/contact-us"
                className="inline-flex items-center justify-center gap-3 px-8 py-4 bg-white text-black font-black text-lg hover:bg-black hover:text-white transition-all duration-200 w-full md:w-auto"
              >
                <span>联系合作</span>
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
