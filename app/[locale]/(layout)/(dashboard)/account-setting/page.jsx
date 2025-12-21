import { Link } from '@/i18n/routing';
import { ChevronRight } from "lucide-react";
import AccountSettings from "@/components/dashboard/AccountSettings";
import React from "react";

export const metadata = {
  title: "账户设置 || Zgar Portal - 专业电子烟电商平台",
  description: "Zgar Portal - 专业的电子烟电商平台，提供账户设置功能",
};

export default function AccountSettingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 面包屑导航 */}
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <nav className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              首页
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/dashboard"
              className="transition-colors hover:text-foreground"
            >
              用户中心
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-foreground font-medium">账户设置</span>
          </nav>
        </div>
      </div>

      {/* 主要内容 */}
      <AccountSettings />
    </div>
  );
}
