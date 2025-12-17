"use client";

import React, { useState } from "react";
import Sidebar from "./Sidebar";
import AccountEditModal from "./AccountEditModal";
import { useQuery } from "@tanstack/react-query";
import { medusaSDK } from "@/utils/medusa";
import { Spinner } from "react-bootstrap";
import { StoreCustomerAddress } from "@medusajs/types";
// import { toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

export default function Addressess() {
  const [editing, setEditing] = useState<Partial<StoreCustomerAddress> | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const { data: addresses, isLoading, refetch } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => {
      const res = await medusaSDK.client.fetch(`/store/customers/me/addresses`, {
        method: "GET",
      });
      return (res as any).addresses;
    },
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

  const saveAddress = async (form: any) => {
    try {
      if (isCreating) {
        await medusaSDK.client.fetch(`/store/customers/me/addresses`, {
          method: "POST",
          body: form,
        });
        // toast.success("Address added successfully");
      } else {
        if (!form.id) return;
        const { id, created_at, updated_at, customer_id, ...updateData } = form;
        await medusaSDK.client.fetch(`/store/customers/me/addresses/${id}`, {
          method: "POST",
          body: updateData,
        });
        // toast.success("Address updated successfully");
      }
      setEditing(null);
      refetch();
    } catch (error) {
      console.error("Error saving address:", error);
      // toast.error("Failed to save address");
    }
  };

  const deleteAddress = async (id: string) => {
    if (!confirm("Are you sure you want to delete this address?")) return;
    try {
      await medusaSDK.client.fetch(`/store/customers/me/addresses/${id}`, {
        method: "DELETE",
      });
      // toast.success("Address deleted successfully");
      refetch();
    } catch (error) {
      console.error("Error deleting address:", error);
      // toast.error("Failed to delete address");
    }
  };

  return (
    <>
      <section className="flat-spacing">
        <div className="container">
          <div className="row">
            <div className="col-xl-3 d-none d-xl-block">
              <Sidebar />
            </div>

            <div className="col-xl-9">
              <div className="my-account-content">
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
            </div>
          </div>
        </div>
      </section>

      <AccountEditModal editing={editing} onSave={saveAddress} isCreating={isCreating} />
    </>
  );
}
