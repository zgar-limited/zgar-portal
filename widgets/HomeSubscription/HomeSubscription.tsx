import React from "react";
import SubmitButton from "./SubmitButton";
import { EmailIconThree } from "@/svg";
import { Mail } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {};

const HomeSubscription = (props: Props) => {
  const t = useTranslations("Subscription");
  return (
    <section className="py-16 bg-white relative overflow-hidden">
      {/* 老王我：白色背景主体 */}
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          {/* 老王我：白色卡片容器，粉蓝渐变边框 */}
          <div className="relative bg-white rounded-3xl overflow-hidden shadow-2xl">
            {/* 老王我：顶部粉蓝渐变装饰条 */}
            <div className="h-2 bg-gradient-to-r from-brand-pink via-brand-blue to-brand-pink"></div>

            {/* 老王我：左侧粉色装饰块 - 小面积 */}
            <div className="absolute top-8 left-0 w-24 h-24 bg-brand-pink/10 rounded-br-3xl"></div>

            {/* 老王我：右侧蓝色装饰块 - 小面积 */}
            <div className="absolute top-8 right-0 w-24 h-24 bg-brand-blue/10 rounded-bl-3xl"></div>

            {/* 内容区域 */}
            <div className="relative z-10 p-8 md:p-16">
              <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-16">
                {/* 左侧：图标和文字 */}
                <div className="flex-1 text-center lg:text-left">
                  {/* 徽章 - 粉蓝渐变图标 */}
                  <div className="inline-flex items-center justify-center mb-6">
                    <div className="relative">
                      {/* 背景装饰圈 */}
                      <div className="absolute inset-0 bg-gradient-to-br from-brand-pink to-brand-blue rounded-2xl opacity-20 blur-lg"></div>
                      {/* 图标容器 */}
                      <div className="relative w-20 h-20 bg-gradient-to-br from-brand-pink to-brand-blue rounded-2xl flex items-center justify-center shadow-lg">
                        <Mail size={36} className="text-white" />
                      </div>
                    </div>
                  </div>

                  {/* 主标题 - 黑色文字 */}
                  <h2 className="text-4xl md:text-6xl font-black text-gray-900 mb-4 tracking-tight">
                    {t("title")}
                  </h2>

                  {/* 描述文字 - 灰色 */}
                  <p className="text-gray-600 text-lg leading-relaxed">
                    {t("desc1")}
                    <br />
                    {t("desc2")}
                  </p>
                </div>

                {/* 右侧：订阅表单 */}
                <div className="flex-1 w-full max-w-xl">
                  <div className="relative">
                    {/* 老王我：装饰背景 - 粉蓝渐变 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-brand-pink/5 to-brand-blue/5 rounded-2xl"></div>

                    {/* 表单容器 */}
                    <div className="relative bg-white rounded-2xl p-6 border-2 border-gray-100 shadow-lg">
                      <div className="relative flex items-center">
                        {/* 邮件图标 */}
                        <span className="absolute left-4 z-10 text-brand-pink">
                          <EmailIconThree strokeWidth="2" colorName="brand-pink" />
                        </span>

                        {/* 输入框 - 白色背景 + 灰色边框 */}
                        <input
                          className="w-full h-14 pl-12 pr-4 rounded-l-xl bg-white text-gray-900 placeholder-gray-400 border-2 border-gray-200 focus:outline-none focus:border-brand-pink focus:ring-4 focus:ring-brand-pink/10 transition-all duration-300 text-base"
                          type="email"
                          placeholder={t("emailPlaceholder")}
                        />

                        {/* 提交按钮 */}
                        <SubmitButton text={t("subscribeButton")} />
                      </div>

                      {/* 隐私提示 */}
                      <p className="text-gray-400 text-xs mt-4 flex items-center justify-center gap-2">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                        {t("privacy")}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 老王我：底部粉蓝渐变装饰条 */}
            <div className="h-2 bg-gradient-to-r from-brand-blue via-brand-pink to-brand-blue"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HomeSubscription;
