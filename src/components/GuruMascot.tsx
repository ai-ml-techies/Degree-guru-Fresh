import React from "react";

interface GuruMascotProps {
  size?: number;
  className?: string;
  expression?: "happy" | "thinking" | "waving";
}

export const GuruMascot: React.FC<GuruMascotProps> = ({
  size = 32,
  className = "",
  expression = "happy",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
    >
      <defs>
        {/* Glow & Gradients */}
        <linearGradient id="guruFaceGrad" x1="16" y1="18" x2="48" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FFF2D6" />
          <stop offset="1" stopColor="#FED7AA" />
        </linearGradient>

        <linearGradient id="guruCapGrad" x1="10" y1="12" x2="54" y2="24" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6D28D9" />
          <stop offset="0.5" stopColor="#7C3AED" />
          <stop offset="1" stopColor="#4C1D95" />
        </linearGradient>

        <linearGradient id="guruRobeGrad" x1="14" y1="50" x2="50" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#4338CA" />
        </linearGradient>

        <linearGradient id="guruGoldGrad" x1="32" y1="16" x2="52" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FDE047" />
          <stop offset="1" stopColor="#EAB308" />
        </linearGradient>
      </defs>

      {/* Robe / Collar */}
      <path
        d="M16 52C16 46 23 44 32 44C41 44 48 46 48 52V62H16V52Z"
        fill="url(#guruRobeGrad)"
      />
      {/* Golden V-Neck stole */}
      <path
        d="M26 44L32 53L38 44"
        stroke="url(#guruGoldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Head / Face */}
      <circle cx="32" cy="34" r="16" fill="url(#guruFaceGrad)" />

      {/* Soft Rosy Cheeks */}
      <circle cx="23" cy="38" r="2.5" fill="#FCA5A5" opacity="0.6" />
      <circle cx="41" cy="38" r="2.5" fill="#FCA5A5" opacity="0.6" />

      {/* Friendly Eyes */}
      <ellipse cx="26" cy="33" rx="2.5" ry="3.5" fill="#1E1B4B" />
      <circle cx="25" cy="32" r="1" fill="#FFFFFF" />

      <ellipse cx="38" cy="33" rx="2.5" ry="3.5" fill="#1E1B4B" />
      <circle cx="37" cy="32" r="1" fill="#FFFFFF" />

      {/* Academic Smart Glasses */}
      <circle cx="26" cy="33" r="5" stroke="#7C3AED" strokeWidth="1.5" fill="none" opacity="0.85" />
      <circle cx="38" cy="33" r="5" stroke="#7C3AED" strokeWidth="1.5" fill="none" opacity="0.85" />
      <path d="M31 33H33" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round" />

      {/* Warm Smile */}
      <path
        d="M28 40C29.5 42 34.5 42 36 40"
        stroke="#9A3412"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Graduation Cap (Mortarboard) - Diamond Shape */}
      <polygon
        points="32,6 56,15 32,24 8,15"
        fill="url(#guruCapGrad)"
        filter="drop-shadow(0px 2px 3px rgba(0,0,0,0.2))"
      />
      {/* Cap Skull Base */}
      <path
        d="M20 19.5V25C20 28.5 25.5 30 32 30C38.5 30 44 28.5 44 25V19.5"
        fill="#5B21B6"
      />

      {/* Cap Button on top */}
      <ellipse cx="32" cy="15" rx="2" ry="1.2" fill="url(#guruGoldGrad)" />

      {/* Cap Tassel Ribbon */}
      <path
        d="M32 15C36 15 47 18 47 24"
        stroke="url(#guruGoldGrad)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      {/* Hanging Golden Tassel Fringe */}
      <rect x="45.5" y="24" width="3" height="6" rx="1.2" fill="url(#guruGoldGrad)" />

      {/* Little Sparkle of Wisdom */}
      <path
        d="M52 8L53 11L56 12L53 13L52 16L51 13L48 12L51 11Z"
        fill="#FDE047"
        opacity="0.9"
      />
    </svg>
  );
};

export default GuruMascot;
