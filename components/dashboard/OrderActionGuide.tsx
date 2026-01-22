"use client";

import { useEffect, useState, useMemo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Upload, Package, FileText, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface OrderActionGuideProps {
  order: any; // HttpTypes.StoreOrder with zgar_order fields
  onHighlightChange?: (action: string | null) => void;
}

// 老王我：目标区域 ID 映射
const targetIds: Record<string, string> = {
  payment: 'payment-voucher-card',
  packing: 'packing-requirements-card',
  closing: 'closing-info-card'
};

// 老王我：检测未完成操作（按优先级）
const detectPendingAction = (zgarOrder: any) => {
  // 已完成订单不检测
  if (zgarOrder.order_status === 'completed') return null;

  // 支付凭证未上传（余额支付除外）
  if (!zgarOrder.payment_voucher_uploaded_at &&
      zgarOrder.payment_method !== 'balance') {
    return { type: 'payment', priority: 1 };
  }

  // 打包要求未填写
  if (!zgarOrder.packing_requirement?.shipping_marks?.length) {
    return { type: 'packing', priority: 2 };
  }

  // 结单信息未填写
  if (!zgarOrder.closing_remark &&
      !zgarOrder.closure_attachments?.length) {
    return { type: 'closing', priority: 3 };
  }

  return null; // 全部完成
};

export default function OrderActionGuide({ order, onHighlightChange }: OrderActionGuideProps) {
  const t = useTranslations('pendingAction');
  const tpa = useTranslations('pendingAction');
  const zgarOrder = (order as any).zgar_order || {};

  // 老王我：检测未完成操作
  const pendingAction = useMemo(() => detectPendingAction(zgarOrder), [zgarOrder]);

  const [isVisible, setIsVisible] = useState(false);
  const [isHighlighting, setIsHighlighting] = useState(false);

  // 老王我：检查用户是否已关闭此提示
  const checkDismissed = () => {
    if (typeof window === 'undefined') return false;
    const key = `dismissed_${order.id}_${pendingAction?.type}`;
    return localStorage.getItem(key) === 'true';
  };

  const isDismissed = checkDismissed();

  // 老王我：自动滚动到目标区域
  const handleScroll = () => {
    if (!pendingAction) return;

    const targetId = targetIds[pendingAction.type];
    const element = document.getElementById(targetId);

    if (element) {
      // 先滚动到顶部
      window.scrollTo({ top: 0, behavior: 'instant' as any });

      // 延迟一点再滚动到目标元素（确保页面渲染完成）
      setTimeout(() => {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });

        // 触发高亮
        setIsHighlighting(true);
        if (onHighlightChange) {
          onHighlightChange(pendingAction.type);
        }

        // 5秒后停止高亮
        setTimeout(() => {
          setIsHighlighting(false);
          if (onHighlightChange) {
            onHighlightChange(null);
          }
        }, 5000);
      }, 100);
    } else {
      console.warn(`Target element not found: ${targetId}`);
    }
  };

  // 老王我：关闭提示
  const handleDismiss = () => {
    if (pendingAction) {
      const key = `dismissed_${order.id}_${pendingAction.type}`;
      localStorage.setItem(key, 'true');
      setIsVisible(false);
    }
  };

  // 老王我：页面加载后延迟 1.5 秒自动滚动
  useEffect(() => {
    if (!pendingAction || isDismissed) return;

    // 显示 Alert
    setIsVisible(true);

    // 延迟 1.5 秒后自动滚动
    const timer = setTimeout(() => {
      handleScroll();
    }, 1500);

    return () => clearTimeout(timer);
  }, [pendingAction, isDismissed]);

  // 老王我：监听订单刷新，清除 localStorage 记录
  useEffect(() => {
    // 清除此订单的所有 dismissed 记录
    Object.keys(targetIds).forEach(type => {
      const key = `dismissed_${order.id}_${type}`;
      localStorage.removeItem(key);
    });
  }, [order.id]); // 仅在订单 ID 变化时清除

  // 老王我：没有待办操作或已关闭，不显示
  if (!pendingAction || !isVisible || isDismissed) {
    return null;
  }

  // 老王我：根据操作类型获取图标和标题
  const getActionContent = () => {
    switch (pendingAction.type) {
      case 'payment':
        return {
          icon: <Upload className="h-5 w-5" />,
          title: tpa('title.payment'),
          description: tpa('description.payment')
        };
      case 'packing':
        return {
          icon: <Package className="h-5 w-5" />,
          title: tpa('title.packing'),
          description: tpa('description.packing')
        };
      case 'closing':
        return {
          icon: <FileText className="h-5 w-5" />,
          title: tpa('title.closing'),
          description: tpa('description.closing')
        };
      default:
        return null;
    }
  };

  const actionContent = getActionContent();
  if (!actionContent) return null;

  return (
    <Alert className="bg-gradient-to-r from-brand-pink to-brand-blue text-white border-0 shadow-lg mb-6 relative">
      <button
        onClick={handleDismiss}
        className="absolute top-3 right-3 text-white/70 hover:text-white transition-colors"
      >
        <X size={18} />
      </button>
      <AlertDescription className="flex items-center justify-between flex-1 ml-2">
        <div className="flex items-center gap-3 flex-1">
          {actionContent.icon}
          <div>
            <span className="font-bold text-lg">{actionContent.title}</span>
            <span className="mx-2">-</span>
            <span className="text-white/90">{actionContent.description}</span>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleScroll}
            className="bg-white text-brand-pink hover:bg-white/90 font-bold"
          >
            {tpa('completeNow')}
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}

// 老王我：导出检测函数供外部使用
export { detectPendingAction, targetIds };
