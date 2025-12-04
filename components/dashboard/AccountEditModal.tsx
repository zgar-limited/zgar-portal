"use client";

import React, { useEffect, useState } from "react";

import { StoreCustomerAddress } from "@medusajs/types";

export default function AccountEditModal({
  editing,
  onSave,
  isCreating,
}: {
  editing: Partial<StoreCustomerAddress> | null;
  onSave: (form: any) => void;
  isCreating: boolean;
}) {
  const [form, setForm] = useState<Partial<StoreCustomerAddress> | null>(null);

  useEffect(() => {
    setForm(editing);
  }, [editing]);

  // Keep an empty shell so Bootstrap can always target #editAddress
  if (!form) {
    return (
      <div
        className="modal modalCentered fade modal-edit_address"
        id="editAddress"
        aria-hidden="true"
        tabIndex={-1}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content"></div>
        </div>
      </div>
    );
  }

  const handleChange = (key: keyof StoreCustomerAddress) => (e: any) => {
    const value = e.target.value;
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = () => {
    if (
      !form.first_name?.trim() ||
      !form.last_name?.trim() ||
      !form.address_1?.trim() ||
      !form.city?.trim() ||
      !form.postal_code?.trim() ||
      !form.country_code?.trim()
    ) {
      alert("Please fill in all required fields.");
      return;
    }
    onSave(form);
  };

  return (
    <div
      className="modal modalCentered fade modal-edit_address"
      id="editAddress"
      tabIndex={-1}
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-heading">
            <h2 className="fw-normal">
              {isCreating ? "Add New Address" : "Edit Address"}
            </h2>
            <span
              className="icon-close icon-close-popup"
              data-bs-dismiss="modal"
            />
          </div>

          <form
            className="form-edit_address"
            onSubmit={(e) => {
              e.preventDefault();
              handleSave();
            }}
          >
            <div className="form_content">
              <div className="row">
                <div className="col-6">
                  <fieldset>
                    <label className="mb-2">First Name *</label>
                    <input
                      type="text"
                      placeholder="First Name"
                      required
                      value={form.first_name || ""}
                      onChange={handleChange("first_name")}
                    />
                  </fieldset>
                </div>
                <div className="col-6">
                  <fieldset>
                    <label className="mb-2">Last Name *</label>
                    <input
                      type="text"
                      placeholder="Last Name"
                      required
                      value={form.last_name || ""}
                      onChange={handleChange("last_name")}
                    />
                  </fieldset>
                </div>
              </div>

              <fieldset>
                <label className="mb-2">Company</label>
                <input
                  type="text"
                  placeholder="Company (Optional)"
                  value={form.company || ""}
                  onChange={handleChange("company")}
                />
              </fieldset>

              <fieldset>
                <label className="mb-2">Address 1 *</label>
                <input
                  type="text"
                  placeholder="Address Line 1"
                  required
                  value={form.address_1 || ""}
                  onChange={handleChange("address_1")}
                />
              </fieldset>

              <fieldset>
                <label className="mb-2">Address 2</label>
                <input
                  type="text"
                  placeholder="Address Line 2 (Optional)"
                  value={form.address_2 || ""}
                  onChange={handleChange("address_2")}
                />
              </fieldset>

              <div className="row">
                <div className="col-6">
                  <fieldset>
                    <label className="mb-2">City *</label>
                    <input
                      type="text"
                      placeholder="City"
                      required
                      value={form.city || ""}
                      onChange={handleChange("city")}
                    />
                  </fieldset>
                </div>
                <div className="col-6">
                  <fieldset>
                    <label className="mb-2">Postal Code *</label>
                    <input
                      type="text"
                      placeholder="Postal Code"
                      required
                      value={form.postal_code || ""}
                      onChange={handleChange("postal_code")}
                    />
                  </fieldset>
                </div>
              </div>

              <div className="row">
                <div className="col-6">
                  <fieldset>
                    <label className="mb-2">Province</label>
                    <input
                      type="text"
                      placeholder="Province/State"
                      value={form.province || ""}
                      onChange={handleChange("province")}
                    />
                  </fieldset>
                </div>
                <div className="col-6">
                  <fieldset>
                    <label className="mb-2">Country Code *</label>
                    <input
                      type="text"
                      placeholder="Country Code (e.g. us, ca)"
                      required
                      value={form.country_code || ""}
                      onChange={handleChange("country_code")}
                      maxLength={2}
                    />
                  </fieldset>
                </div>
              </div>

              <fieldset>
                <label className="mb-2">Phone</label>
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={form.phone || ""}
                  onChange={handleChange("phone")}
                />
              </fieldset>

              <button
                type="submit"
                className="tf-btn animate-btn"
                data-bs-dismiss="modal"
              >
                {isCreating ? "Add Address" : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
