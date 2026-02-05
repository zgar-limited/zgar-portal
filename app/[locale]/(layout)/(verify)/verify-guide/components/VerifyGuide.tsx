/**
 * 防伪查询指南静态页面组件
 *
 * 官网直接访问时显示的静态指南内容
 */

'use client';

import Image from 'next/image';

/**
 * 防伪查询指南组件
 *
 * 展示防伪查询的步骤说明图片
 */
export function VerifyGuide() {
  return (
    <>
      {/* 标题图片 */}
      <Image
        className="w-full h-auto"
        src="/images/guide/detail_pc_zh/title.webp"
        alt="防伪查询指南"
        width={2880}
        height={290}
        priority
      />

      {/* 步骤图片 */}
      <div className="container mt-[24px] space-y-[24px]">
        {[1, 2, 3, 4].map((step) => {
          return (
            <Image
              key={step}
              className="block w-[calc(100%-24px)] h-auto mx-auto"
              src={`/images/guide/detail_pc_zh/${step}.webp`}
              alt={`防伪查询步骤 ${step}`}
              width={1442}
              height={684}
            />
          );
        })}
      </div>

      {/* 结尾图片 */}
      <Image
        className="w-full h-auto mt-[24px]"
        src="/images/guide/detail_pc_zh/end.webp"
        alt="防伪查询指南"
        width={2880}
        height={290}
      />
    </>
  );
}
