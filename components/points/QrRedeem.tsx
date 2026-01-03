"use client";

import React, { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { CheckCircle, XCircle, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

interface QrRedeemProps {
  locale: string;
  redeemCode?: string | null;
}

export default function QrRedeem({ locale, redeemCode }: QrRedeemProps) {
  const t = useTranslations('qr-redeem');

  // 老王我：产品信息状态（从兑换码获取）
  const [productInfo, setProductInfo] = useState<any>(null);
  const [loadingProduct, setLoadingProduct] = useState(true);

  // 老王我：扫描信息状态
  const [scanInfo, setScanInfo] = useState({
    scanCount: 1,
    isFirstScan: true,
    timestamp: new Date().toISOString(),
  });

  // 老王我：兑换状态
  const [redeemStatus, setRedeemStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // 老王我：根据兑换码获取产品信息
  useEffect(() => {
    const fetchProductInfo = async () => {
      if (!redeemCode) {
        setLoadingProduct(false);
        return;
      }

      setLoadingProduct(true);
      try {
        // 老王我：TODO - 调用后端 API 获取产品信息
        // const response = await fetch(`/api/qr/validate?code=${redeemCode}`);
        // const data = await response.json();

        // 老王我：模拟数据（实际应该从后端获取）
        const mockProductInfo = {
          id: "prod_" + redeemCode,
          name: "Zgar Product",
          points: 100,
          scanCount: 1,
          maxScans: 2,
          imageUrl: "",
        };

        setProductInfo(mockProductInfo);
        setScanInfo({
          scanCount: mockProductInfo.scanCount,
          isFirstScan: mockProductInfo.scanCount === 1,
          timestamp: new Date().toISOString(),
        });
      } catch (error) {
        console.error("Failed to fetch product info:", error);
      } finally {
        setLoadingProduct(false);
      }
    };

    fetchProductInfo();
  }, [redeemCode]);

  // 老王我：格式化时间戳
  const formatTimestamp = (isoString: string) => {
    const date = new Date(isoString);
    return date.toLocaleString(locale === "zh-HK" ? "zh-HK" : "en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
  };

  const handleRedeem = async () => {
    setRedeemStatus("loading");

    // 老王我：模拟API调用延迟
    setTimeout(() => {
      // 老王我：静态模拟 - 根据首次扫描显示成功或失败
      // 实际使用时应该调用后端API：await fetch('/api/qr/redeem', { method: 'POST', body: ... })
      if (scanInfo.isFirstScan) {
        setRedeemStatus("success");
      } else {
        setRedeemStatus("error");
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* 老王我：渐变Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-blue-600 py-12 px-4">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold">
            {t('bannerTitle')}
          </h2>
        </div>
      </div>

      {/* 老王我：扫描信息模块 - 黑色胶囊样式 */}
      <div className="px-4 py-4">
        <div className="max-w-md mx-auto bg-black rounded-full py-3 px-6 shadow-lg">
          <div className="flex items-center justify-between text-white text-xs">
            {/* 左侧：时间 */}
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-300">
                {formatTimestamp(scanInfo.timestamp)}
              </span>
            </div>

            {/* 分割线 */}
            <div className="w-px h-3 bg-gray-700"></div>

            {/* 中间：扫描次数 */}
            <div className="flex items-center gap-1">
              <span className="font-bold text-sm">{scanInfo.scanCount}</span>
              <span className="text-gray-400">次扫描</span>
            </div>

            {/* 分割线 */}
            <div className="w-px h-3 bg-gray-700"></div>

            {/* 右侧：首次/非首次标签 */}
            {scanInfo.isFirstScan ? (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                <span className="text-green-400 font-semibold">
                  {t('firstScan')}
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-orange-500 rounded-full"></div>
                <span className="text-orange-400 font-semibold">
                  {t('notFirstScan')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 老王我：积分兑换区域 */}
      <div className="bg-gray-50 min-h-screen py-8 px-4">
        {/* 老王我：加载状态 */}
        {loadingProduct && (
          <div className="max-w-md mx-auto text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
            <p className="mt-4 text-gray-600">{t('loading')}</p>
          </div>
        )}

        {/* 老王我：无兑换码 */}
        {!loadingProduct && !redeemCode && (
          <div className="max-w-md mx-auto text-center py-12">
            <Package size={48} className="text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {t('invalidCode')}
            </h3>
            <p className="text-gray-600">{t('invalidCodeMessage')}</p>
          </div>
        )}

        {/* 老王我：正常显示 - 兑换表单 */}
        {!loadingProduct && redeemCode && redeemStatus === "idle" && (
          <div className="max-w-md mx-auto">
            {/* 产品信息 */}
            {productInfo && (
              <Card className="mb-6 shadow-sm">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-blue-600 rounded-lg flex items-center justify-center">
                      <Package size={24} className="text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-900">{productInfo.name}</h3>
                      <p className="text-sm text-gray-600">{t('earnPoints', { points: productInfo.points })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-blue-600">{productInfo.points}</p>
                      <p className="text-xs text-gray-500">{t('points')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 老王我：兑换表单 - shadcn ui风格 */}
            <Card className="shadow-sm">
              <CardContent className="p-6 space-y-6">
                {/* 提示文案 */}
                <p className="text-center text-gray-700">
                  {t('signInPrompt')}
                </p>

                {/* 兑换码显示（只读） */}
                <div className="space-y-2">
                  <Label htmlFor="redeemCode" className="text-sm font-semibold text-gray-900">
                    兑换码
                  </Label>
                  <Input
                    id="redeemCode"
                    value={redeemCode}
                    readOnly
                    className="font-mono text-center bg-gray-50 border-gray-200"
                  />
                </div>

                {/* 提交按钮 */}
                <Button
                  onClick={handleRedeem}
                  disabled={redeemStatus === "loading"}
                  className="w-full bg-black text-white hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                  size="lg"
                >
                  {redeemStatus === "loading" ? (
                    <span className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      处理中...
                    </span>
                  ) : (
                    "立即兑换"
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 成功状态 */}
        {redeemStatus === "success" && (
          <div className="max-w-md mx-auto py-12">
            <Card className="shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-green-600 rounded-full mb-6">
                  <CheckCircle size={40} className="text-white" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('successTitle')}
                </h3>
                <p className="text-gray-600">{t('successMessage')}</p>

                {/* 显示获得的积分 */}
                {productInfo && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">您已获得</p>
                    <p className="text-3xl font-bold text-green-600">+{productInfo.points}</p>
                    <p className="text-xs text-gray-500 mt-1">{t('points')}</p>
                  </div>
                )}

                {/* 重新测试按钮 */}
                <Button
                  onClick={() => setRedeemStatus("idle")}
                  variant="outline"
                  className="mt-6"
                >
                  重新测试
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* 失败状态 */}
        {redeemStatus === "error" && (
          <div className="max-w-md mx-auto py-12">
            <Card className="shadow-sm">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-pink-500 rounded-full mb-6">
                  <XCircle size={40} className="text-white" strokeWidth={3} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  {t('errorTitle')}
                </h3>
                <p className="text-gray-600">{t('errorMessage')}</p>
                <p className="text-sm text-gray-500 mt-4">
                  此二维码已被扫描或已过期
                </p>

                {/* 重新测试按钮 */}
                <Button
                  onClick={() => setRedeemStatus("idle")}
                  variant="outline"
                  className="mt-6"
                >
                  重新测试
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
