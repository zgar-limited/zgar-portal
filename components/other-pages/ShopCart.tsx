"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { useContextElement } from "@/context/Context";
import { Link } from '@/i18n/routing';
import { useRouter } from "next/navigation";
import {
  PackagePlus,
  ShoppingCart,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Plus,
  Minus,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import ProductsSelectModal from "../modals/ProductsSelectModal";
import { medusaSDK } from "@/utils/medusa";
import {
  StoreCartResponse,
  StorePaymentCollectionResponse,
  StoreCart,
  StoreProduct,
  CartLineItemDTO,
} from "@medusajs/types";

// Import shadcn components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { InputNumber } from "@/components/ui/input-number";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function ShopCart({
  cart,
  products,
}: {
  cart: StoreCart | null;
  products: StoreProduct[];
}) {
  return <ShopCartContent cart={cart} products={products} />;
}

function ShopCartContent({
  cart,
  products,
}: {
  cart: StoreCart | null;
  products: StoreProduct[];
}) {
  const [showModal, setShowModal] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isDeleting, setIsDeleting] = useState(false);
  const [updatingItems, setUpdatingItems] = useState<string[]>([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState<"success" | "danger">(
    "success"
  );

  const [selectedTotalPrice, setSelectedTotalPrice] = useState(0);
  const [selectedTotalWeight, setSelectedTotalWeight] = useState(0);

  const itemsPerPage = 5;

  const cartProducts = React.useMemo(() => {
    if (!cart?.items || cart.items.length === 0) {
      return [];
    }

    return cart.items.map((item: any, index: number) => ({
      id: item.id,
      variantId: item.variant_id,
      productId: item.product_id,
      title: item.title || item.product?.title || item.product_title || `Product ${index + 1}`,
      variantTitle: item.variant?.title || item.variant_title || "",
      price: item.unit_price || item.price || item.total || 0,
      quantity: item.quantity || 1,
      imgSrc: item.thumbnail ||
               item.product?.thumbnail ||
               item.product?.images?.[0]?.url ||
               `https://picsum.photos/100/100?random=${item.id}`,
      options: item.variant?.options || [],
      metadata: item.metadata || {},
      weight: item.variant?.weight || 0,
    }));
  }, [cart]);

  useEffect(() => {
    const maxPage = Math.ceil(cartProducts.length / itemsPerPage);
    if (currentPage > maxPage && maxPage > 0) {
      setCurrentPage(maxPage);
    } else if (maxPage === 0) {
      setCurrentPage(1);
    }

    setSelectedItems((prev) =>
      prev.filter((id) => cartProducts.some((p) => p.id === id))
    );
  }, [cart?.items, cartProducts, itemsPerPage]);

  useEffect(() => {
    const selectedProducts = cartProducts.filter((p) =>
      selectedItems.includes(p.id)
    );

    const newTotalPrice = selectedProducts.reduce(
      (acc, product) => acc + product.quantity * product.price,
      0
    );
    setSelectedTotalPrice(newTotalPrice);

    const newTotalWeight = selectedProducts.reduce(
      (acc, product) => acc + product.quantity * product.weight,
      0
    );
    setSelectedTotalWeight(newTotalWeight);
  }, [selectedItems, cartProducts]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(cartProducts.map((p) => p.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems([...selectedItems, id]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item !== id));
    }
  };

  const router = useRouter();

  const removeFromCart = async (lineId: string) => {
    if (!cart?.id) return;
    try {
      await medusaSDK.store.cart.deleteLineItem(cart.id, lineId);
      router.refresh();
    } catch (error) {
      console.error("Error removing from cart:", error);
      throw error;
    }
  };

  const updateCartItem = async (lineId: string, quantity: number) => {
    if (!cart?.id) return;
    try {
      await medusaSDK.store.cart.updateLineItem(cart.id, lineId, {
        quantity,
      });
      router.refresh();
    } catch (error) {
      console.error("Error updating cart item:", error);
      throw error;
    }
  };

  const handleBatchDelete = async () => {
    if (selectedItems.length === 0) return;
    if (!cart?.id) return;

    setIsDeleting(true);
    try {
      await medusaSDK.client.fetch(`/store/zgar/cart/delete`, {
        method: "POST",
        body: {
          cart_id: cart.id,
          items: selectedItems,
        },
      });
      router.refresh();
      setSelectedItems([]);
    } catch (error) {
      console.error("Error deleting items:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleRemoveItem = async (id: string) => {
    setUpdatingItems((prev) => [...prev, id]);
    try {
      await removeFromCart(id);
    } catch (error) {
      console.error("Error removing item:", error);
    } finally {
      setUpdatingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleUpdateQuantity = async (id: string, value: number) => {
    setUpdatingItems((prev) => [...prev, id]);
    try {
      await updateCartItem(id, value);
    } catch (error) {
      console.error("Error updating quantity:", error);
    } finally {
      setUpdatingItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleCheckout = async () => {
    if (selectedItems.length === 0) return;
    if (!cart?.id) return;

    setCheckoutLoading(true);

    try {
      const itemsToCheckout: CartLineItemDTO[] = cartProducts
        .filter((p) => selectedItems.includes(p.id))
        .map((p) => ({
          variant_id: p.variantId as string,
          quantity: p.quantity as number,
          metadata: p.metadata as any,
        }));

      // 动态导入服务端方法
      const { completeZgarCartCheckout } = await import("@/data/cart");

      // 调用服务端 checkout 方法，自动包含用户认证信息
      await completeZgarCartCheckout(itemsToCheckout);
    } catch (error: any) {
      console.error("Checkout error:", error);
      setToastMessage(error.message || "Failed to submit order");
      setToastVariant("danger");
      setShowToast(true);
    } finally {
      setCheckoutLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = cartProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(cartProducts.length / itemsPerPage);

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="min-h-screen bg-gray-50/30">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartProducts.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Your cart is empty</h3>
                <p className="text-gray-600 mb-6">Add some products to get started!</p>
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {/* Select All */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Checkbox
                      checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                    <span className="font-medium">Select All ({cartProducts.length} items)</span>
                  </div>
                </CardContent>
              </Card>

              {/* Mobile Cart Items */}
              {currentItems.map((product) => (
                <Card key={product.id} className={`transition-opacity ${updatingItems.includes(product.id) ? 'opacity-50' : ''}`}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox
                        checked={selectedItems.includes(product.id)}
                        onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                        disabled={updatingItems.includes(product.id)}
                        className="mt-1"
                      />

                      <div className="flex-1 min-w-0">
                        <div className="flex space-x-3">
                          <div className="relative">
                            <Image
                              src={product.imgSrc}
                              alt={product.title}
                              width={80}
                              height={80}
                              className="rounded-lg object-cover"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-white shadow-md"
                              onClick={() => handleRemoveItem(product.id)}
                              disabled={updatingItems.includes(product.id)}
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>

                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {product.title}
                            </h3>
                            {product.variantTitle && (
                              <p className="text-sm text-gray-600 mt-1">{product.variantTitle}</p>
                            )}
                            <div className="flex flex-wrap gap-1 mt-2">
                              {product.options.map((option: any) => (
                                <Badge key={option.option_id} variant="secondary" className="text-xs">
                                  {option.value}
                                </Badge>
                              ))}
                            </div>

                            <div className="mt-3 flex items-center justify-between">
                              <div className="flex items-center space-x-1">
                                <span className="text-lg font-bold text-gray-900">${product.price.toFixed(2)}</span>
                                <span className="text-sm text-gray-500">/pcs</span>
                              </div>

                              <div className="flex items-center space-x-2">
                                <div
                                  className={updatingItems.includes(product.id) ? "pointer-events-none opacity-50" : ""}
                                >
                                  <InputNumber
                                    value={product.quantity}
                                    onChange={(value) => handleUpdateQuantity(product.id, value)}
                                    step={50}
                                    min={50}
                                    size="sm"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Mobile Pagination */}
              {totalPages > 1 && (
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Previous
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {currentPage} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        Next
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Mobile Order Summary */}
              <Card className="lg:hidden">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="font-medium">Selected Items</span>
                    <span>{selectedItems.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Subtotal</span>
                    <span className="font-bold">${selectedTotalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Total Weight</span>
                    <span>{selectedTotalWeight} g</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-primary">${selectedTotalPrice.toFixed(2)}</span>
                  </div>

                  <div className="space-y-2 pt-4">
                    <Button
                      onClick={handleCheckout}
                      disabled={selectedItems.length === 0 || checkoutLoading}
                      className="w-full"
                    >
                      {checkoutLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                          Processing...
                        </>
                      ) : (
                        'Proceed to Checkout'
                      )}
                    </Button>

                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        onClick={() => setShowModal(true)}
                        className="w-full"
                      >
                        <PackagePlus className="h-4 w-4 mr-1" />
                        Add Items
                      </Button>

                      {selectedItems.length > 0 && (
                        <Button
                          variant="destructive"
                          onClick={handleBatchDelete}
                          disabled={isDeleting}
                          className="w-full"
                        >
                          {isDeleting ? (
                            <>
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-1" />
                              Deleting...
                            </>
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete ({selectedItems.length})
                            </>
                          )}
                        </Button>
                      )}
                    </div>

                    <Button asChild variant="outline" className="w-full">
                      <Link href="/shop">Continue Shopping</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping Cart</h1>
            <p className="text-gray-600">
              {cartProducts.length} {cartProducts.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartProducts.length === 0 ? (
            <Card className="text-center py-16">
              <CardContent>
                <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-6" />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
                <p className="text-gray-600 mb-8">Add some products to get started!</p>
                <Button asChild size="lg">
                  <Link href="/shop">Continue Shopping</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle>Cart Items ({cartProducts.length})</CardTitle>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          checked={selectedItems.length === cartProducts.length && cartProducts.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                        <span className="text-sm font-medium">Select All</span>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12"></TableHead>
                          <TableHead>Product</TableHead>
                          <TableHead className="text-right">Price</TableHead>
                          <TableHead className="text-right">Weight</TableHead>
                          <TableHead className="text-right">Quantity</TableHead>
                          <TableHead className="text-right">Total</TableHead>
                          <TableHead className="w-12"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {currentItems.map((product) => (
                          <TableRow
                            key={product.id}
                            className={`transition-opacity ${updatingItems.includes(product.id) ? 'opacity-50' : ''}`}
                          >
                            <TableCell>
                              <Checkbox
                                checked={selectedItems.includes(product.id)}
                                onCheckedChange={(checked) => handleSelectItem(product.id, checked as boolean)}
                                disabled={updatingItems.includes(product.id)}
                              />
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center space-x-3">
                                <div className="relative">
                                  <Image
                                    src={product.imgSrc}
                                    alt={product.title}
                                    width={60}
                                    height={60}
                                    className="rounded-lg object-cover"
                                  />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-gray-900 truncate">
                                    {product.title}
                                  </div>
                                  {product.variantTitle && (
                                    <div className="text-sm text-gray-600 mt-1">{product.variantTitle}</div>
                                  )}
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {product.options.map((option: any) => (
                                      <Badge key={option.option_id} variant="secondary" className="text-xs">
                                        {option.value}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-medium">${product.price.toFixed(2)}</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="text-sm">{product.weight} g</div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className={updatingItems.includes(product.id) ? "pointer-events-none opacity-50" : ""}>
                                <InputNumber
                                  value={product.quantity}
                                  onChange={(value) => handleUpdateQuantity(product.id, value)}
                                  step={50}
                                  min={50}
                                  size="sm"
                                />
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="font-bold">
                                ${(product.quantity * product.price).toFixed(2)}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemoveItem(product.id)}
                                disabled={updatingItems.includes(product.id)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>

                    {/* Desktop Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-between mt-6 pt-6 border-t">
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          <ChevronLeft className="h-4 w-4 mr-2" />
                          Previous
                        </Button>
                        <div className="flex items-center space-x-2">
                          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                              key={page}
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => handlePageChange(page)}
                            >
                              {page}
                            </Button>
                          ))}
                        </div>
                        <Button
                          variant="outline"
                          onClick={() => handlePageChange(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}

                    {/* Desktop Action Buttons */}
                    <div className="flex items-center justify-between mt-6 pt-6 border-t">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          onClick={() => setShowModal(true)}
                        >
                          <PackagePlus className="h-4 w-4 mr-2" />
                          Add Products
                        </Button>

                        {selectedItems.length > 0 && (
                          <Button
                            variant="destructive"
                            onClick={handleBatchDelete}
                            disabled={isDeleting}
                          >
                            {isDeleting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                                Deleting...
                              </>
                            ) : (
                              <>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Selected ({selectedItems.length})
                              </>
                            )}
                          </Button>
                        )}
                      </div>

                      <Button variant="outline" asChild>
                        <Link href="/shop">Continue Shopping</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary - Desktop */}
              <div className="lg:col-span-1">
                <Card className="sticky top-8">
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                    <CardDescription>
                      {selectedItems.length} of {cartProducts.length} items selected
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Subtotal</span>
                      <span className="font-bold">${selectedTotalPrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Total Weight</span>
                      <span>{selectedTotalWeight} g</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-lg">
                      <span className="font-bold">Total</span>
                      <span className="font-bold text-primary">${selectedTotalPrice.toFixed(2)}</span>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button
                        onClick={handleCheckout}
                        disabled={selectedItems.length === 0 || checkoutLoading}
                        className="w-full"
                        size="lg"
                      >
                        {checkoutLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                            Processing...
                          </>
                        ) : (
                          'Proceed to Checkout'
                        )}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Products Select Modal */}
      <ProductsSelectModal
        show={showModal}
        onHide={() => setShowModal(false)}
        cart={cart}
        products={products}
      />

      {/* Toast Notification */}
      {showToast && (
        <div className={`fixed top-4 right-4 z-50 max-w-sm rounded-lg shadow-lg p-4 ${
          toastVariant === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
          <div className="flex items-center space-x-3">
            {toastVariant === 'success' ? (
              <CheckCircle2 className="h-5 w-5" />
            ) : (
              <AlertCircle className="h-5 w-5" />
            )}
            <span>{toastMessage}</span>
            <Button
              variant="ghost"
              size="sm"
              className="ml-auto text-white hover:bg-white/20"
              onClick={() => setShowToast(false)}
            >
              ×
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}