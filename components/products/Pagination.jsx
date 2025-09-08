"use client";

import React, { useState } from "react";

export default function Pagination({
  totalPages = 5,

  onPageChange,
  currentPage,
  setCurrentPage,
}) {
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange?.(page); // optional callback
    }
  };

  return (
    <>
      {totalPages ? (
        <>
          {/* Previous */}
          <button
            className="pagination-item h6 direct"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <i className="icon icon-caret-left" />
          </button>

          {/* Page Numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) =>
            pageNum === currentPage ? (
              <span key={pageNum} className="pagination-item h6 active">
                {pageNum}
              </span>
            ) : (
              <button
                key={pageNum}
                className="pagination-item h6"
                onClick={() => goToPage(pageNum)}
              >
                {pageNum}
              </button>
            )
          )}

          {/* Next */}
          <button
            className="pagination-item h6 direct"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <i className="icon icon-caret-right" />
          </button>
        </>
      ) : (
        ""
      )}
    </>
  );
}
