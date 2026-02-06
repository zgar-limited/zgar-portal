import { notFound } from "next/navigation";
import QrRedeem from "@/components/points/QrRedeem";

export const metadata = {
  title: "G-Points Redemption || Zgar",
  description: "Scan QR code to earn G-Points",
};

// 老王我：强制动态渲染，因为需要使用 searchParams 获取兑换码
// 艹！不能用 generateStaticParams，否则生产环境会报 DYNAMIC_SERVER_USAGE 错误
export const dynamic = 'force-dynamic';

export default async function QrRedeemPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; qr: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale, qr } = await params;
  const params_server = await searchParams;

  // 老王我：验证路由参数
  if (qr !== "redeem") {
    notFound();
  }

  // 老王我：从 query 参数获取积分兑换码
  const redeemCode = params_server.code as string || null;

  return <QrRedeem locale={locale} redeemCode={redeemCode} />;
}
