"use client";

import React, { useState } from "react";
// 老王我移除 Sidebar import，因为已经在 layout 中了
import AccountEditModal from "./AccountEditModal";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { StoreCustomerAddress } from "@medusajs/types";
import { getAddresses, createAddress, updateAddress, deleteAddress } from "@/data/addresses";
import type { Address } from "@/data/addresses/types";

export default function Addressess() {
  const [editing, setEditing] = useState<Partial<StoreCustomerAddress> | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const queryClient = useQueryClient();

  // 老王我：直接调用 server 函数获取地址列表
  const { data: addresses, isLoading } = useQuery({
    queryKey: ["addresses"],
    queryFn: () => getAddresses(),
    enabled: true,
  });

  const openEdit = (addr: any) => {
    setEditing(addr);
    setIsCreating(false);
  };

  const openCreate = () => {
    setEditing({
      first_name: "",
      last_name: "",
      company: "",
      address_1: "",
      address_2: "",
      city: "",
      postal_code: "",
      province: "",
      country_code: "",
      phone: "",
    });
    setIsCreating(true);
  };

  // 老王我：创建地址mutation
  const createMutation = useMutation({
    mutationFn: (data: Address) => createAddress(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setEditing(null);
    },
  });

  // 老王我：更新地址mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Address }) =>
      updateAddress(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
      setEditing(null);
    },
  });

  // 老王我：删除地址mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAddress(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["addresses"] });
    },
  });

  const saveAddress = async (form: any) => {
    if (isCreating) {
      // 老王我：创建地址
      await createMutation.mutateAsync(form as Address);
    } else {
      // 老王我：更新地址
      if (!form.id) return;
      const { id, created_at, updated_at, customer_id, ...updateData } = form;
      await updateMutation.mutateAsync({ id, data: updateData as Address });
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    await deleteMutation.mutateAsync(id);
  };

  return (
    <>
      {/* 老王我移除外层 Bootstrap 布局和 Sidebar，因为 layout 已经提供了 */}
      <div className="my-account-content space-y-6">
                <div className="mb-4 d-flex justify-content-between align-items-center">
                  <h2 className="mb-0 account-title type-semibold">My Address</h2>
                  <button
                    data-bs-target="#editAddress"
                    data-bs-toggle="modal"
                    className="tf-btn btn-fill animate-hover-btn rounded-pill"
                    onClick={openCreate}
                  >
                    Add New Address
                  </button>
                </div>

                <div className="row g-4">
                  {isLoading ? (
                    <div className="py-5 text-center col-12">
                      <Spinner animation="border" variant="secondary" />
                    </div>
                  ) : addresses?.length === 0 ? (
                    <div className="py-5 text-center col-12 text-muted">
                      No addresses found. Add one to get started.
                    </div>
                  ) : (
                    addresses?.map((addr: any) => (
                      <div key={addr.id} className="col-md-6">
                        <div className="p-4 transition-all border-0 shadow-xs card h-100 rounded-4 position-relative hover-shadow">
                          <div className="mb-3 d-flex justify-content-between align-items-start">
                            <h5 className="mb-0 fw-semibold text-truncate pe-3">
                              {addr.company || `${addr.first_name} ${addr.last_name}`}
                            </h5>
                            {/* <span className="px-3 badge bg-light text-dark rounded-pill">
                              Address
                            </span> */}
                          </div>

                          <div className="mb-4">
                            <p className="mb-1 text-muted">
                              {addr.first_name} {addr.last_name}
                            </p>
                            <p className="mb-1 text-muted">
                              {addr.address_1}
                              {addr.address_2 && `, ${addr.address_2}`}
                            </p>
                            <p className="mb-1 text-muted">
                              {addr.city}, {addr.province} {addr.postal_code}
                            </p>
                            <p className="mb-2 text-muted text-uppercase">
                              {addr.country_code}
                            </p>
                            {addr.phone && (
                              <p className="mb-0 text-muted small">
                                <i className="icon-phone me-2"></i>
                                {addr.phone}
                              </p>
                            )}
                          </div>

                          <div className="gap-3 pt-3 mt-auto d-flex border-top">
                            <button
                              data-bs-target="#editAddress"
                              data-bs-toggle="modal"
                              className="gap-1 p-0 btn btn-link text-decoration-none text-dark fw-medium d-flex align-items-center"
                              onClick={() => openEdit(addr)}
                            >
                              <i className="icon-edit-3"></i> Edit
                            </button>
                            <button
                              className="gap-1 p-0 btn btn-link text-decoration-none text-danger fw-medium d-flex align-items-center"
                              onClick={() => deleteAddress(addr.id)}
                            >
                              <i className="icon-trash-2"></i> Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
      </div>

      <AccountEditModal editing={editing} onSave={saveAddress} isCreating={isCreating} />
    </>
  );
}
