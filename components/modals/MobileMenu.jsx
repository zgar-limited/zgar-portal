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
                  <path d="M18.77,7.46H14.5v-1.9c0-.85.24-1.27-.75-1.27-1.5V3.96c0-.75-.42-1.26-1.27-1.5H7.89c-.75.24-1.27.75-1.27,1.5v1.1H4.23C3.55,7.46,3,8,3,8.69v6.62C3,16,3.55,15.44,4.23,16.23h1.38v1.9c0,.85.24,1.27.75,1.27,1.5v1.09c0,.75.42,1.26,1.27,1.5h2.06c.75-.24,1.27-.75,1.27-1.5v-1.1h4.23c.68,0,1.23-.54,1.23-1.23V8.69C20,8,19.45,7.46,18.77,7.46z M15.73,15.23v-3.3c0-.75.24-1.27.75-1.27,1.5v1.09c0,.75.42,1.26,1.27,1.5h-2.06c-.75-.24-1.27-.75-1.27-1.5v-1.09c0-.75-.42-1.26-1.27-1.5v3.3c0,.75-.24,1.27.75,1.27,1.5v-1.09c0-.75-.42-1.26-1.27-1.5H15.73z"/>
                </svg>
              </a>
              <a
                href="https://www.instagram.com/zgarofficial/"
                target="_blank"
                className="w-10 h-10 rounded-full bg-gradient-brand flex items-center justify-center text-white hover:shadow-md transition-shadow"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.07 3.646.07 4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-3.646-.07-4.851zm0-2.163c-1.26 0-2.396-.01-3.377-.05-2.784-.13-4.57-1.937-4.7-4.723-.04-1.26-.04-2.389-.04-3.377zM12 16c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4zm4.5-6a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0z"/>
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
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.525.02c1.31-.02 2.61-.08 3.91-.16.95-.1 1.76-.25 2.45-.48 1.14-.39 2.02-1.2 2.3-2.52.12-.47.22-.87.92-1.18 1.51-.23.46-.42.95-.53 1.46-.08.39-.13.8-.13 1.22v4.24c0 .63.13 1.28.18 1.93.15 1.3-.07 2.6-.13 3.89-.2.64-.05 1.27-.13 1.87-.25.9-.18 1.62-.59 2.17-1.41.24-.36.43-.76.63-1.2.77-.28-.09-.59-.15-.92-.17-.29-.02-.59-.02-.88 0-1.3.07-1.93.21-1.33.28-2.14 1.16-2.43 2.69-.06.31-.13.62-.2.94-.25-.66-.1-1.3-.19-1.93-.26-.64-.07-1.27-.13-1.89-.2-.95-.1-1.76-.25-2.44-.48-1.14-.39-2.02-1.2-2.3-2.52-.12-.47-.22-.87-.92-1.18-1.51-.23-.46-.42-.95-.53-1.46-.08-.39-.13-.8-.13-1.22V6.37c0-.63-.13-1.28-.18-1.93-.15-.64.07-1.28.13-1.89.2zm4.05 2.63c-.1.52-.26.9-.79 1.05-1.57.62-.38 1.38-.57 2.07-.57.67 0 1.33.18 1.93.55.59.36.92.88 1.06 1.42.13.51.08 1.02.08 1.53-.03.59-.11 1.05-.34 1.39-.77.33-.43.37-.98.37-1.61v-2.5c0-.64-.04-1.28-.18-1.89-.2-.61-.16-1.24-.37-1.76-.8-.53-.43-.77-.99-.77-1.61 0-.61.24-1.17.77-1.61.53-.43 1.17-.65 1.76-.8.6-.15 1.25-.25 1.87-.33.6-.08 1.22-.12 1.82-.13.61-.02 1.22.03 1.82.13.6.11 1.2.27 1.76.59 1.06.49 1.62 1.55 1.09 2.54-.46.99-1.38 1.48-2.07 1.48-.69 0-1.35-.19-1.93-.55-.58-.36-.95-.89-1.06-1.42-.13-.51-.08-1.02.08-1.53.03-.59.11-1.05.34-1.39.77-.33.43-.37.98-.37 1.61v2.5c0 .64.04 1.28.18 1.89.2.61.16 1.24.37 1.76.8.53.43.77.99.77 1.61 0 .61-.24 1.17-.77 1.61-.53.43-1.17.65-1.76.8-.6.15-1.25.25-1.87.33-.6.08-1.22-.12-1.82-.13-.61.02-1.22-.03-1.82.13z"/>
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
