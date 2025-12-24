"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import {
  Modal,
  Button,
  Spinner,
  Alert,
  Form,
} from "react-bootstrap";
import {
  X,
  Plus,
  Package,
  PackageOpen,
  Edit2,
  Trash2,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Minus,
  Save,
  Send,
  Calculator,
  Archive,
  Inbox,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { medusaSDK } from "@/utils/medusa";
import { HttpTypes } from "@medusajs/types";

// 老王我的类型定义 - 别tm乱传参数
interface PackingRequirementsModalProps {
  show: boolean;
  onHide: () => void;
  orderId: string | null;
  order: HttpTypes.StoreOrder | null;
  initialData?: ShippingMarkGroup[];
}

// 老王我重新设计的分配记录
export interface Allocation {
  itemId: string;      // 商品ID
  quantity: number;    // 分配的数量
}

export interface ShippingMarkGroup {
  id: string;
  name: string;
  description?: string;
  allocations: Allocation[];  // 分配记录列表
}

// 商品分配状态
interface ItemAllocationStatus {
  item: HttpTypes.StoreOrder["items"][number];
  allocations: Map<string, number>;  // groupId -> quantity
  remaining: number;  // 剩余未分配数量
  total: number;  // 总数量
}

// 老王我的默认唛头配置
const DEFAULT_SHIPPING_MARKS: Omit<ShippingMarkGroup, "id" | "allocations">[] = [
  { name: "唛头 A", description: "第一箱商品" },
  { name: "唛头 B", description: "第二箱商品" },
];

export default function PackingRequirementsModal({
  show,
  onHide,
  orderId,
  order,
  initialData = [],
}: PackingRequirementsModalProps) {
  // 唛头分组列表
  const [shippingMarks, setShippingMarks] = useState<ShippingMarkGroup[]>([]);

  // 订单商品及分配状态
  const [itemStatuses, setItemStatuses] = useState<ItemAllocationStatus[]>([]);

  // 选中的商品ID（用于批量分配）
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // 正在编辑的唛头ID
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);

  // 表单状态
  const [editingName, setEditingName] = useState("");
  const [editingDesc, setEditingDesc] = useState("");

  // 提交状态
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // 折叠状态
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());

  // 数量输入状态
  const [quantityInputs, setQuantityInputs] = useState<Record<string, number>>({});

  // 初始化数据
  useEffect(() => {
    if (show && order) {
      // 老王我解析初始数据
      const groups: ShippingMarkGroup[] =
        initialData.length > 0
          ? initialData
          : DEFAULT_SHIPPING_MARKS.map((mark, idx) => ({
              ...mark,
              id: `group-${Date.now()}-${idx}`,
              allocations: [],
            }));

      setShippingMarks(groups);

      // 构建商品分配状态
      const statuses: ItemAllocationStatus[] = order.items.map((item) => {
        const allocations = new Map<string, number>();

        // 统计各唛头的分配数量
        groups.forEach((group) => {
          const allocation = group.allocations.find((a) => a.itemId === item.id);
          if (allocation) {
            allocations.set(group.id, allocation.quantity);
          }
        });

        const allocated = Array.from(allocations.values()).reduce((sum, qty) => sum + qty, 0);

        return {
          item,
          allocations,
          remaining: item.quantity - allocated,
          total: item.quantity,
        };
      });

      setItemStatuses(statuses);
      setSelectedItemId(null);
      setQuantityInputs({});
      setError(null);
      setSuccess(false);
    }
  }, [show, order, initialData]);

  // 获取有剩余的商品
  const itemsWithRemaining = itemStatuses.filter((s) => s.remaining > 0);

  // 新增唛头
  const handleAddGroup = () => {
    const nextIndex = shippingMarks.length;
    const newGroup: ShippingMarkGroup = {
      id: `group-${Date.now()}`,
      name: `唛头 ${String.fromCharCode(65 + nextIndex)}`,
      description: "",
      allocations: [],
    };
    setShippingMarks((prev) => [...prev, newGroup]);
  };

  // 删除唛头
  const handleDeleteGroup = (groupId: string) => {
    // 老王我先把该唛头的商品分配释放回未分配
    setItemStatuses((prev) =>
      prev.map((status) => {
        const released = status.allocations.get(groupId) || 0;
        if (released > 0) {
          const newAllocations = new Map(status.allocations);
          newAllocations.delete(groupId);
          return {
            ...status,
            allocations: newAllocations,
            remaining: status.remaining + released,
          };
        }
        return status;
      })
    );

    setShippingMarks((prev) => prev.filter((g) => g.id !== groupId));
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      next.delete(groupId);
      return next;
    });
  };

  // 开始编辑唛头
  const handleStartEdit = (group: ShippingMarkGroup) => {
    setEditingGroupId(group.id);
    setEditingName(group.name);
    setEditingDesc(group.description || "");
  };

  // 保存唛头编辑
  const handleSaveEdit = (groupId: string) => {
    setShippingMarks((prev) =>
      prev.map((g) =>
        g.id === groupId
          ? { ...g, name: editingName, description: editingDesc }
          : g
      )
    );
    setEditingGroupId(null);
  };

  // 取消编辑
  const handleCancelEdit = () => {
    setEditingGroupId(null);
    setEditingName("");
    setEditingDesc("");
  };

  // 切换折叠状态
  const toggleCollapse = (groupId: string) => {
    setCollapsedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) {
        next.delete(groupId);
      } else {
        next.add(groupId);
      }
      return next;
    });
  };

  // 切换商品选中状态
  const toggleItemSelection = (itemId: string) => {
    if (selectedItemId === itemId) {
      setSelectedItemId(null);
    } else {
      setSelectedItemId(itemId);
      // 初始化数量输入为全部剩余数量
      const status = itemStatuses.find((s) => s.item.id === itemId);
      if (status) {
        setQuantityInputs({ [itemId]: status.remaining });
      }
    }
  };

  // 更新数量输入
  const updateQuantityInput = (itemId: string, quantity: number) => {
    setQuantityInputs((prev) => ({ ...prev, [itemId]: quantity }));
  };

  // 分配商品到唛头
  const allocateToGroup = (itemId: string, groupId: string, quantity: number) => {
    const status = itemStatuses.find((s) => s.item.id === itemId);
    if (!status || quantity <= 0 || quantity > status.remaining) return;

    // 更新商品状态
    setItemStatuses((prev) =>
      prev.map((s) => {
        if (s.item.id === itemId) {
          const newAllocations = new Map(s.allocations);
          const existing = newAllocations.get(groupId) || 0;
          newAllocations.set(groupId, existing + quantity);

          return {
            ...s,
            allocations: newAllocations,
            remaining: s.remaining - quantity,
          };
        }
        return s;
      })
    );

    // 更新唛头分配记录
    setShippingMarks((prev) =>
      prev.map((g) => {
        if (g.id === groupId) {
          const existing = g.allocations.find((a) => a.itemId === itemId);
          if (existing) {
            return {
              ...g,
              allocations: g.allocations.map((a) =>
                a.itemId === itemId
                  ? { ...a, quantity: a.quantity + quantity }
                  : a
              ),
            };
          } else {
            return {
              ...g,
              allocations: [...g.allocations, { itemId, quantity }],
            };
          }
        }
        return g;
      })
    );

    // 清空输入并取消选中
    setQuantityInputs((prev) => {
      const next = { ...prev };
      delete next[itemId];
      return next;
    });
    setSelectedItemId(null);
  };

  // 移除唛头中的商品分配
  const removeAllocation = (itemId: string, groupId: string) => {
    const group = shippingMarks.find((g) => g.id === groupId);
    const allocation = group?.allocations.find((a) => a.itemId === itemId);
    if (!allocation) return;

    // 更新商品状态
    setItemStatuses((prev) =>
      prev.map((s) => {
        if (s.item.id === itemId) {
          const newAllocations = new Map(s.allocations);
          newAllocations.delete(groupId);

          return {
            ...s,
            allocations: newAllocations,
            remaining: s.remaining + allocation.quantity,
          };
        }
        return s;
      })
    );

    // 更新唛头分配记录
    setShippingMarks((prev) =>
      prev.map((g) => ({
        ...g,
        allocations: g.allocations.filter((a) => a.itemId !== itemId),
      }))
    );
  };

  // 生成最终数据并提交
  const handleSubmit = async () => {
    if (!orderId) return;

    // 检查是否所有商品都已分配
    const hasUnallocated = itemStatuses.some((s) => s.remaining > 0);
    if (hasUnallocated) {
      setError("请先将所有商品分配到唛头");
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      // 构建最终数据
      const groupsWithItems: ShippingMarkGroup[] = shippingMarks.map((group) => ({
        ...group,
        allocations: group.allocations,
      }));

      // 提交到后端
      await medusaSDK.client.fetch(
        `/store/zgar/orders/${orderId}/packing-requirement`,
        {
          method: "POST",
          body: JSON.stringify({
            shipping_marks: groupsWithItems,
          }),
        }
      );

      setSuccess(true);
      setTimeout(() => {
        onHide();
      }, 1500);
    } catch (err: any) {
      console.error("保存失败:", err);
      setError(err.message || "保存打包方案失败，请重试");
    } finally {
      setIsSaving(false);
    }
  };

  // 渲染未分配商品卡片
  const renderUnassignedItemCard = (status: ItemAllocationStatus) => {
    const { item, remaining, total } = status;
    const isSelected = selectedItemId === item.id;
    const inputQuantity = quantityInputs[item.id] || remaining;

    return (
      <motion.div
        key={item.id}
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={`
          rounded-xl transition-all duration-200 cursor-pointer
          ${isSelected
            ? "bg-blue-50 dark:bg-blue-900/20 shadow-md border-2 border-blue-500 dark:border-blue-400"
            : "bg-white dark:bg-gray-800 shadow-sm hover:shadow-md border border-gray-200 dark:border-gray-700"
          }
        `}
        onClick={() => toggleItemSelection(item.id)}
      >
        <div className="p-4">
          <div className="flex items-center gap-3">
            {/* 选择指示器 */}
            <div className="flex-shrink-0">
              {isSelected ? (
                <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center shadow-sm">
                  <Check size={14} className="text-white" strokeWidth={3} />
                </div>
              ) : (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 dark:border-gray-600" />
              )}
            </div>

            {/* 商品图片 */}
            <div className="w-14 h-14 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden relative flex-shrink-0">
              <Image
                src={item.thumbnail || "https://placehold.co/100"}
                alt={item.title}
                fill
                className="object-cover"
                sizes="56px"
              />
            </div>

            {/* 商品信息 */}
            <div className="flex-1 min-w-0">
              <div className="text-sm font-semibold text-gray-900 dark:text-white mb-1 truncate">
                {item.title}
              </div>
              <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                {item.variant_title && (
                  <span className="truncate">{item.variant_title}</span>
                )}
                <span className="flex-shrink-0">•</span>
                <span className="flex-shrink-0">
                  总数 <span className="font-medium text-gray-700 dark:text-gray-300">{total}</span>
                  <span className="mx-1">/</span>
                  剩余 <span className="font-bold text-blue-600 dark:text-blue-400">{remaining}</span>
                </span>
              </div>
            </div>

            {/* 右箭头 */}
            {isSelected && (
              <motion.div
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                className="flex-shrink-0 text-blue-500"
              >
                <ChevronDown size={20} strokeWidth={2.5} />
              </motion.div>
            )}
          </div>
        </div>

        {/* 选中后显示分配面板 */}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <div className="px-4 pb-4">
                {/* 数量输入 */}
                <div className="flex items-center gap-3 mb-3">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 flex-shrink-0">
                    <Calculator size={14} />
                    分配数量
                  </label>
                  <div className="flex items-center gap-2 flex-1 max-w-[200px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantityInput(item.id, Math.max(1, inputQuantity - 1));
                      }}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 font-bold text-lg transition-colors"
                    >
                      −
                    </button>
                    <input
                      type="number"
                      min="1"
                      max={remaining}
                      value={inputQuantity}
                      onChange={(e) => updateQuantityInput(item.id, parseInt(e.target.value) || 0)}
                      className="flex-1 h-9 text-center font-semibold text-gray-900 dark:text-white border-2 border-gray-300 dark:border-gray-600 rounded-lg focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        updateQuantityInput(item.id, Math.min(remaining, inputQuantity + 1));
                      }}
                      className="w-9 h-9 flex items-center justify-center rounded-lg bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 font-bold text-lg transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                    / {remaining} 可用
                  </span>
                </div>

                {/* 唛头按钮 */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-1.5 flex-shrink-0">
                    <Send size={14} />
                    分配到
                  </span>
                  {shippingMarks.map((group) => (
                    <Button
                      key={group.id}
                      variant={inputQuantity > 0 && inputQuantity <= remaining ? "primary" : "outline-secondary"}
                      size="sm"
                      className="h-9 px-4 font-medium"
                      onClick={(e) => {
                        e.stopPropagation();
                        allocateToGroup(item.id, group.id, inputQuantity);
                      }}
                      disabled={inputQuantity <= 0 || inputQuantity > remaining}
                    >
                      {group.name}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  // 渲染未分配商品区域
  const renderUnassignedSection = () => {
    const totalRemaining = itemsWithRemaining.reduce((sum, s) => sum + s.remaining, 0);

    return (
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900/50 dark:to-gray-800/50 rounded-2xl p-5 shadow-inner">
        {/* 头部 */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 dark:from-orange-600 dark:to-orange-700 rounded-xl flex items-center justify-center shadow-md">
              <Inbox size={18} className="text-white" strokeWidth={2.5} />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 dark:text-white text-base">
                未分配商品
              </h4>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                {totalRemaining} 件剩余待分配
              </p>
            </div>
          </div>
        </div>

        {itemsWithRemaining.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle size={32} className="text-green-600 dark:text-green-400" strokeWidth={2.5} />
            </div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
              所有商品已分配完成
            </p>
          </div>
        ) : (
          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1.5 custom-scrollbar">
            <AnimatePresence mode="popLayout">
              {itemsWithRemaining.map((status) => (
                <div key={status.item.id}>
                  {renderUnassignedItemCard(status)}
                </div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  // 渲染唛头分组
  const renderShippingMarkGroup = (group: ShippingMarkGroup) => {
    const isEditing = editingGroupId === group.id;
    const isCollapsed = collapsedGroups.has(group.id);

    // 计算该唛头的商品列表
    const groupAllocations = group.allocations
      .map((alloc) => {
        const status = itemStatuses.find((s) => s.item.id === alloc.itemId);
        return status ? { status, quantity: alloc.quantity } : null;
      })
      .filter((a): a is NonNullable<typeof a> => a !== null);

    const totalItems = groupAllocations.reduce((sum, a) => sum + a.quantity, 0);

    return (
      <motion.div
        key={group.id}
        layout
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        {/* 唛头头部 */}
        <div className="p-4 border-b border-gray-100 dark:border-gray-700">
          {isEditing ? (
            <div className="space-y-3">
              <Form.Control
                type="text"
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                placeholder="唛头名称"
                className="text-sm font-medium"
                autoFocus
              />
              <Form.Control
                as="textarea"
                value={editingDesc}
                onChange={(e) => setEditingDesc(e.target.value)}
                placeholder="唛头说明（可选）"
                rows={2}
                className="text-sm"
              />
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleSaveEdit(group.id)}
                  className="flex-1 font-medium h-9"
                >
                  <CheckCircle size={14} className="me-1.5" />
                  保存
                </Button>
                <Button
                  variant="light"
                  size="sm"
                  onClick={handleCancelEdit}
                  className="flex-1 font-medium h-9"
                >
                  取消
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
                  <Archive size={18} className="text-white" strokeWidth={2.5} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-gray-900 dark:text-white truncate">
                      {group.name}
                    </h4>
                    <span className="text-xs font-semibold px-2 py-0.5 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 rounded-full flex-shrink-0">
                      {totalItems} 件
                    </span>
                  </div>
                  {group.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                      {group.description}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-1 flex-shrink-0">
                <Button
                  variant="light"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => toggleCollapse(group.id)}
                  title={isCollapsed ? "展开" : "折叠"}
                >
                  {isCollapsed ? (
                    <ChevronDown size={16} className="text-gray-500" strokeWidth={2.5} />
                  ) : (
                    <ChevronUp size={16} className="text-gray-500" strokeWidth={2.5} />
                  )}
                </Button>

                <Button
                  variant="light"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-lg flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700"
                  onClick={() => handleStartEdit(group)}
                  title="编辑"
                >
                  <Edit2 size={14} className="text-gray-500" strokeWidth={2.5} />
                </Button>

                <Button
                  variant="light"
                  size="sm"
                  className="w-8 h-8 p-0 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={() => handleDeleteGroup(group.id)}
                  title="删除"
                >
                  <Trash2 size={14} className="text-red-500" strokeWidth={2.5} />
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* 唛头内容区 */}
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="p-4 min-h-[100px]">
                {groupAllocations.length === 0 ? (
                  <div className="h-28 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex flex-col items-center justify-center text-gray-400 dark:text-gray-600 bg-gray-50/50 dark:bg-gray-900/30">
                    <PackageOpen size={32} className="mb-2 opacity-40" strokeWidth={2} />
                    <p className="text-xs font-medium">点击左侧商品分配到此处</p>
                  </div>
                ) : (
                  <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1.5 custom-scrollbar">
                    <AnimatePresence mode="popLayout">
                      {groupAllocations.map(({ status, quantity }) => (
                        <motion.div
                          key={status.item.id}
                          layout
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 8 }}
                          transition={{ duration: 0.15, ease: "easeOut" }}
                          className="flex items-center gap-3 p-3.5 bg-gradient-to-r from-gray-50 to-white dark:from-gray-900/50 dark:to-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 transition-colors"
                        >
                          <div className="w-12 h-12 bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden relative flex-shrink-0 shadow-inner">
                            <Image
                              src={status.item.thumbnail || "https://placehold.co/100"}
                              alt={status.item.title}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-semibold text-gray-900 dark:text-white truncate mb-1">
                              {status.item.title}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {status.item.variant_title}
                            </div>
                          </div>

                          <div className="flex items-center gap-2.5 flex-shrink-0">
                            <div className="px-3 py-1.5 bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl shadow-sm">
                              <span className="text-sm font-bold text-white">
                                × {quantity}
                              </span>
                            </div>
                            <Button
                              variant="light"
                              size="sm"
                              className="w-7 h-7 p-0 rounded-lg flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                              onClick={() => removeAllocation(status.item.id, group.id)}
                              title="移除"
                            >
                              <X size={12} className="text-red-500" strokeWidth={2.5} />
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="border-0 shadow-2xl rounded-3xl overflow-hidden"
      size="xl"
    >
      <Modal.Header closeButton className="pb-4 border-bottom-0 px-6 pt-6">
        <Modal.Title className="h5 fw-bold d-flex align-items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-600 dark:to-blue-700 rounded-xl d-flex align-items-center justify-center shadow-lg">
            <Package size={20} className="text-white" strokeWidth={2.5} />
          </div>
          <span className="text-lg">打包要求管理</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-6">
        {error && (
          <Alert
            variant="danger"
            className="gap-2 py-3 d-flex align-items-center small mb-4 rounded-xl border-0"
          >
            <X size={18} strokeWidth={2.5} />
            <span className="font-medium">{error}</span>
          </Alert>
        )}

        {success ? (
          <div className="py-12 text-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full d-flex align-items-center justify-center mx-auto mb-4"
            >
              <CheckCircle size={40} className="text-green-600 dark:text-green-400" strokeWidth={2.5} />
            </motion.div>
            <h6 className="fw-bold text-green-600 dark:text-green-400 text-lg mb-2">保存成功!</h6>
            <p className="text-sm text-gray-500 dark:text-gray-400">打包方案已成功提交</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* 左侧：未分配商品 */}
            <div>{renderUnassignedSection()}</div>

            {/* 右侧：唛头分组 */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-gray-900 dark:text-white text-base flex items-center gap-2.5">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 dark:from-purple-600 dark:to-purple-700 rounded-lg flex items-center justify-center">
                    <Archive size={16} className="text-white" strokeWidth={2.5} />
                  </div>
                  唛头分组
                </h4>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={handleAddGroup}
                  className="text-sm font-medium h-9 px-4 d-flex align-items-center gap-1.5 rounded-xl"
                >
                  <Plus size={15} strokeWidth={2.5} />
                  新增唛头
                </Button>
              </div>

              <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1.5 custom-scrollbar">
                <AnimatePresence mode="popLayout">
                  {shippingMarks.map((group) => renderShippingMarkGroup(group))}
                </AnimatePresence>

                {shippingMarks.length === 0 && (
                  <div className="text-center py-12 px-6 bg-gray-50 dark:bg-gray-900/30 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
                    <Archive size={48} className="mx-auto mb-3 text-gray-400 dark:text-gray-600 opacity-50" strokeWidth={2} />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4">还没有唛头分组</p>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={handleAddGroup}
                      className="rounded-xl font-medium h-10 px-5"
                    >
                      <Plus size={15} strokeWidth={2.5} className="me-1.5" />
                      新增唛头
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      <Modal.Footer className="border-top-0 pt-0 px-6 pb-6">
        <div className="flex gap-3 w-full">
          <Button
            variant="light"
            onClick={onHide}
            className="flex-1 h-11 font-semibold rounded-xl"
            disabled={isSaving}
          >
            取消
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            className="flex-1 h-11 font-semibold rounded-xl flex items-center justify-center gap-2"
            disabled={isSaving || itemStatuses.some((s) => s.remaining > 0)}
          >
            {isSaving ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
                <span>保存中...</span>
              </>
            ) : (
              <>
                <Save size={18} strokeWidth={2.5} />
                <span>保存打包方案</span>
              </>
            )}
          </Button>
        </div>
      </Modal.Footer>

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(156, 163, 175, 0.7);
        }
        .custom-scrollbar.dark::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }
        .custom-scrollbar.dark::-webkit-scrollbar-thumb:hover {
          background: rgba(75, 85, 99, 0.7);
        }
      `}</style>
    </Modal>
  );
}
