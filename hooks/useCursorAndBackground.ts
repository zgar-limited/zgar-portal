"use client";
import { useEffect } from 'react';
import { cursorAnimation } from '@/plugins';

type CursorConfig = {
  bgColor?: 'white' | 'black' | 'custom' | string; 
  customClass?: string;
};

export const useCursorAndBackground = (config: CursorConfig = {}) => {
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Base cursor class
    document.body.classList.add("tp-magic-cursor");

    // Handle background color and classes
    if (config.bgColor) {
      document.body.style.backgroundColor = `${config.bgColor}`;
    } 
    if (config.customClass) {
      document.body.classList.add(config.customClass);
    }

    // Add cursor elements to DOM
    const cursorHtml = `
      <div class="tp-cursor"></div>
      <div class="tp-cursor-effect"></div>
    `;
    document.body.insertAdjacentHTML('beforeend', cursorHtml);

    // Initialize animation after a small delay to ensure DOM is ready
    setTimeout(() => {
      cursorAnimation();
    }, 50);

    // Cleanup function
    return () => {
      document.body.classList.remove("tp-magic-cursor");
      
      // Remove cursor elements
      document.querySelectorAll('.tp-cursor, .tp-cursor-effect').forEach(el => el.remove());
      
      // Remove background classes if they exist
      ["cursor-white-bg", "cursor-black-bg"].forEach(className => {
        document.body.classList.remove(className);
      });
      
      // Remove custom class if it exists
      if (config.customClass) {
        document.body.classList.remove(config.customClass);
      }
      
      // Reset background color if it was set
      if (config.bgColor) {
        document.body.style.backgroundColor = '';
      }
    };
  }, [config.bgColor, config.customClass]);
};