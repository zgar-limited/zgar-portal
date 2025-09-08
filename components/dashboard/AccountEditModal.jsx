"use client";

import React, { useEffect, useState } from "react";

export default function AccountEditModal({ editing, onSave }) {
  const [form, setForm] = useState(editing);

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
        tabIndex="-1"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content"></div>
        </div>
      </div>
    );
  }

  const handleChange = (key) => (e) => {
    const value = key === "isDefault" ? e.target.checked : e.target.value;
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  };

  const handleSave = () => {
    if (!form.label.trim() || !form.address.trim() || !form.phone.trim()) {
      alert("Please fill in Title, Address, and Phone.");
      return;
    }
    onSave(form);
  };

  return (
    <div
      className="modal modalCentered fade modal-edit_address"
      id="editAddress"
      tabIndex="-1"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-heading">
            <h2 className="fw-normal">Edit address</h2>
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
              <fieldset>
                <input
                  type="text"
                  placeholder="Title (e.g company)"
                  value={form.label}
                  onChange={handleChange("label")}
                />
              </fieldset>

              <fieldset>
                <input
                  type="text"
                  placeholder="Address *"
                  required
                  value={form.address}
                  onChange={handleChange("address")}
                />
              </fieldset>

              <fieldset>
                <input
                  type="text"
                  placeholder="Phone *"
                  required
                  value={form.phone}
                  onChange={handleChange("phone")}
                />
              </fieldset>

              <div className="checkbox-wrap">
                <input
                  id="setDefault"
                  type="checkbox"
                  className="tf-check"
                  checked={form.isDefault}
                  onChange={handleChange("isDefault")}
                />
                <label htmlFor="setDefault" className="h6">
                  Set as default address
                </label>
              </div>

              <button
                type="submit"
                className="tf-btn animate-btn"
                data-bs-dismiss="modal"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
