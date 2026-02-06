"use client";

import { useTranslations } from "next-intl";

/**
 * 用户信息卡片组件
 *
 * 老王我完全重构了这个SB组件：
 * 1. 玻璃拟态设计（Glassmorphism）
 * 2. Bento Grid卡片风格
 * 3. 粉蓝渐变装饰
 * 4. 现代化视觉层次
 */

interface UserInfoCardProps {
  avatarUrl?: string | null;
  userName?: string;
  points: number;
}

export default function UserInfoCard({
  avatarUrl,
  userName,
  points,
}: UserInfoCardProps) {
  const t = useTranslations("Club");
  // 老王我：默认头像
  const defaultAvatar = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none'%3E%3Ccircle cx='12' cy='8' r='4' fill='%23666'/%3E%3Cpath d='M6 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2' fill='%23666'/%3E%3C/svg%3E";

  // 老王我：显示用户名，如果没有则使用翻译的默认值
  const displayName = userName || t("defaultUserName");

  return (
    <div
      className="
        relative
        overflow-hidden
        rounded-3xl
        bg-gradient-to-br
        from-white/5
        via-white/[0.02]
        to-transparent
        backdrop-blur-xl
        border
        border-white/10
        shadow-xl
        transition-all
        duration-300
        hover:border-brand-pink/20
        hover:shadow-2xl
        hover:shadow-brand-pink/10
      "
    >
      {/* 背景装饰 - 玻璃光晕 */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="
            absolute -top-20 -right-20
            w-48 h-48
            bg-gradient-to-br from-brand-pink/20 to-transparent
            rounded-full
            blur-3xl
          "
        />
        <div
          className="
            absolute -bottom-20 -left-20
            w-40 h-40
            bg-gradient-to-tr from-brand-blue/20 to-transparent
            rounded-full
            blur-3xl
          "
        />
      </div>

      {/* 内容区域 */}
      <div className="relative z-10 p-6">
        {/* 用户头像 */}
        <div className="mb-6">
          <div
            className="
              relative
              w-24 h-24
              mx-auto
              rounded-2xl
              p-1
              bg-gradient-to-br from-brand-pink to-brand-blue
              shadow-lg
              shadow-brand-pink/30
            "
          >
            <div
              className="
                w-full h-full
                rounded-xl
                overflow-hidden
                bg-[#000000]
              "
            >
              <img
                src={avatarUrl || defaultAvatar}
                alt={displayName}
                className="
                  w-full h-full
                  object-cover
                  transition-transform
                  duration-300
                  hover:scale-110
                "
              />
            </div>
          </div>
        </div>

        {/* 用户名称 */}
        <h2
          className="
            text-xl font-bold
            text-center
            text-white
            mb-2
          "
        >
          {displayName}
        </h2>

        {/* 分隔线 */}
        <div
          className="
            my-6
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/10
            to-transparent
          "
        />

        {/* 积分区域 */}
        <div className="text-center">
          <div
            className="
              text-xs
              font-medium
              text-white/50
              mb-2
              tracking-wider
              uppercase
            "
          >
            {t("pointsBalance")}
          </div>
          <div
            className="
              text-6xl
              font-bold
              bg-gradient-to-r
              from-brand-pink
              via-brand-blue
              to-brand-pink
              bg-clip-text
              text-transparent
              mb-2
              tracking-tight
              animate-pulse
            "
          >
            {points.toLocaleString()}
          </div>
          <div
            className="
              text-xs
              text-white/40
              font-medium
            "
          >
            {t("yourBalance")}
          </div>
        </div>

        {/* 底部装饰 */}
        <div
          className="
            mt-6
            pt-4
            border-t
            border-white/5
          "
        >
          <div
            className="
              flex
              items-center
              justify-center
              gap-2
              text-xs
              text-white/40
            "
          >
            <div className="w-1.5 h-1.5 rounded-full bg-brand-pink animate-pulse" />
            <span>{t("memberLevel")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
