"use client";
import { Link } from '@/i18n/routing';
import { X, Home, Box, Info, Handshake, Heart, Shield, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function MobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="xl:hidden p-2 -m-2 text-gray-700 hover:text-brand-blue transition-colors rounded-lg hover:bg-gray-50"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 xl:hidden"
          onClick={closeMenu}
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out xl:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Menu</h2>
          <button
            onClick={closeMenu}
            className="p-2 -m-2 text-gray-700 hover:text-brand-blue transition-colors rounded-lg hover:bg-gray-50"
          >
            <X size={24} />
          </button>
        </div>

        {/* Menu Items */}
        <div className="p-6 overflow-y-auto" style={{ height: 'calc(100vh - 180px)' }}>
          <ul className="space-y-2">
            <li>
              <Link
                href="/"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-brand hover:text-white transition-all duration-300 font-medium"
              >
                <Home size={20} className="text-brand-blue" />
                <span>Home</span>
              </Link>
            </li>

            <li>
              <Link
                href="/shop"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-brand hover:text-white transition-all duration-300 font-medium"
              >
                <Box size={20} className="text-brand-pink" />
                <span>Products</span>
              </Link>
            </li>

            <li>
              <Link
                href="/verify-guide"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-brand hover:text-white transition-all duration-300 font-medium"
              >
                <Shield size={20} className="text-brand-blue" />
                <span>Authentication</span>
              </Link>
            </li>

            <li>
              <Link
                href="/care"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-brand hover:text-white transition-all duration-300 font-medium"
              >
                <Heart size={20} className="text-brand-pink" />
                <span>Care</span>
              </Link>
            </li>

            <li>
              <Link
                href="/view-cart"
                onClick={closeMenu}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 hover:bg-gradient-brand hover:text-white transition-all duration-300 font-medium"
              >
                <ShoppingCart size={20} className="text-brand-blue" />
                <span>View Cart</span>
              </Link>
            </li>
          </ul>

          {/* CTA Button */}
          <div className="mt-6">
            <Link
              href="/club"
              onClick={closeMenu}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-brand text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
            >
              <span>★</span>
              <span>Join Club</span>
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-100 bg-gray-50">
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 mb-3">Follow us</p>
            <div className="flex gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white hover:shadow-md transition-shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/zgarofficial/"
                target="_blank"
                className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white hover:shadow-md transition-shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white hover:shadow-md transition-shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              <a
                href="https://www.tiktok.com/"
                target="_blank"
                className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white hover:shadow-md transition-shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 448 512">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Language Select */}
          <div className="text-sm text-gray-600">
            Language
          </div>
        </div>
      </div>
    </>
  );
}
