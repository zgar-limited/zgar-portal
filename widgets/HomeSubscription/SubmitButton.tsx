import React from "react";

type Props = {
  text?: string;
};

const SubmitButton = (props: Props) => {
  return (
    <button
      className="group relative inline-flex items-center justify-center gap-2 h-14 px-8 bg-gradient-to-r from-brand-pink to-brand-blue rounded-r-xl font-bold text-white transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-pink/30 active:translate-y-0"
    >
      <span className="relative z-10">{props.text}</span>
      <svg
        className="w-5 h-5 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 12H19M19 12L12 5M19 12L12 19"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
};

export default SubmitButton;
