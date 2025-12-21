"use client";

import React, { useState, useTransition } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {
  Plus,
  Edit,
  Trash2,
  MapPin,
  Phone,
  Building,
  User,
  Loader2
} from "lucide-react";
import { HttpTypes } from "@medusajs/types";
import AddressForm from "./AddressForm";
import { cn } from "@/lib/utils";

interface AddressesClientProps {
  customer: HttpTypes.StoreCustomer;
  addresses: HttpTypes.StoreCustomerAddress[];
}

export default function AddressesClient({ customer, addresses: initialAddresses }: AddressesClientProps) {
  const [addresses, setAddresses] = useState<HttpTypes.StoreCustomerAddress[]>(initialAddresses);
  const [editingAddress, setEditingAddress] = useState<HttpTypes.StoreCustomerAddress | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);

  const handleCreateAddress = () => {
    setEditingAddress(null);
    setIsCreating(true);
  };

  const handleEditAddress = (address: HttpTypes.StoreCustomerAddress) => {
    setEditingAddress(address);
    setIsCreating(false);
  };

  const handleDeleteAddress = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!addressToDelete) return;

    startTransition(async () => {
      try {
        const response = await fetch(`/store/customers/me/addresses/${addressToDelete}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          setAddresses(prev => prev.filter(addr => addr.id !== addressToDelete));
          setDeleteDialogOpen(false);
          setAddressToDelete(null);
        }
      } catch (error) {
        console.error('Error deleting address:', error);
      }
    });
  };

  const handleAddressSaved = (address: HttpTypes.StoreCustomerAddress, isCreate: boolean) => {
    if (isCreate) {
      setAddresses(prev => [...prev, address]);
    } else {
      setAddresses(prev => prev.map(addr => addr.id === address.id ? address : addr));
    }
    setIsCreating(false);
    setEditingAddress(null);
  };

  const handleCloseDialog = () => {
    setIsCreating(false);
    setEditingAddress(null);
  };

  const getAddressDisplay = (address: HttpTypes.StoreCustomerAddress) => {
    const parts = [
      address.company,
      `${address.first_name} ${address.last_name}`,
      address.address_1,
      address.address_2,
      `${address.city}, ${address.province} ${address.postal_code}`,
      address.country_code?.toUpperCase()
    ].filter(Boolean);

    return parts.join(', ');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* 侧边栏 */}
          <div className="lg:col-span-1">
            <Sidebar customer={customer} />
          </div>

          {/* 主内容区 */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* 页面标题 */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight">地址管理</h1>
                  <p className="text-muted-foreground">管理您的收货地址信息</p>
                </div>
                <Dialog open={isCreating || !!editingAddress} onOpenChange={handleCloseDialog}>
                  <DialogTrigger asChild>
                    <Button className="gap-2">
                      <Plus size={16} />
                      <span className="hidden sm:inline">添加地址</span>
                      <span className="sm:hidden">添加</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {isCreating ? '添加新地址' : '编辑地址'}
                      </DialogTitle>
                    </DialogHeader>
                    <AddressForm
                      address={editingAddress}
                      isCreating={isCreating}
                      onSave={handleAddressSaved}
                      onCancel={handleCloseDialog}
                    />
                  </DialogContent>
                </Dialog>
              </div>

              {/* 地址列表 */}
              {addresses.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MapPin className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h3 className="text-lg font-medium mb-2">暂无收货地址</h3>
                    <p className="text-muted-foreground mb-4">
                      添加您的第一个收货地址，方便购物结算
                    </p>
                    <Button onClick={handleCreateAddress} variant="outline" className="gap-2">
                      <Plus size={16} />
                      添加地址
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((address) => (
                    <Card key={address.id} className="relative group hover:shadow-md transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="space-y-1 flex-1 min-w-0">
                            <CardTitle className="text-base truncate">
                              {address.company || `${address.first_name} ${address.last_name}`}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                              {address.is_default_shipping && (
                                <Badge variant="default" className="text-xs">
                                  默认收货地址
                                </Badge>
                              )}
                              {address.is_default_billing && (
                                <Badge variant="secondary" className="text-xs">
                                  默认账单地址
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {/* 地址详情 */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {address.first_name} {address.last_name}
                            </span>
                          </div>
                          {address.company && (
                            <div className="flex items-center gap-2">
                              <Building size={14} className="text-muted-foreground" />
                              <span className="text-muted-foreground">{address.company}</span>
                            </div>
                          )}
                          <div className="flex items-start gap-2">
                            <MapPin size={14} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                            <div className="text-muted-foreground space-y-1">
                              <div>{address.address_1}</div>
                              {address.address_2 && <div>{address.address_2}</div>}
                              <div>
                                {address.city}, {address.province} {address.postal_code}
                              </div>
                              <div className="uppercase">{address.country_code}</div>
                            </div>
                          </div>
                          {address.phone && (
                            <div className="flex items-center gap-2">
                              <Phone size={14} className="text-muted-foreground" />
                              <span className="text-muted-foreground">{address.phone}</span>
                            </div>
                          )}
                        </div>

                        <Separator />

                        {/* 操作按钮 */}
                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditAddress(address)}
                            className="flex-1 gap-1"
                          >
                            <Edit size={14} />
                            <span>编辑</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                            className="gap-1 text-destructive hover:text-destructive"
                          >
                            <Trash2 size={14} />
                            <span>删除</span>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 删除确认对话框 */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除地址</AlertDialogTitle>
            <AlertDialogDescription>
              您确定要删除这个地址吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  删除中...
                </>
              ) : (
                "确认删除"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}