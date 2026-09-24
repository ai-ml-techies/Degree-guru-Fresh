import React from "react";

interface GuruMascotProps {
  size?: number;
  className?: string;
}

export const GuruMascot: React.FC<GuruMascotProps> = ({
  size = 36,
  className = "",
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block shrink-0 select-none ${className}`}
      aria-label="Ask Guru AI Mascot"
    >
      <defs>
        {/* Glow */}
        <radialGradient id="owlAuraGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#6D28D9" stopOpacity="0" />
        </radialGradient>
        {/* Owl Royal Indigo / Violet Plumage */}
        <linearGradient id="owlBodyGrad" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#4F46E5" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#4338CA" />
        </linearGradient>
        {/* Belly Feathers: Ancient Golden Sand */}
        <linearGradient id="owlBellyGrad" x1="35" y1="50" x2="65" y2="85" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF3C7" />
          <stop offset="100%" stopColor="#FDE68A" />
        </linearGradient>
        {/* Gold Trim / Spectacles */}
        <linearGradient id="owlGoldGrad" x1="30" y1="35" x2="70" y2="55" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>
      </defs>

      {/* Subtle Aura */}
      <circle cx="50" cy="50" r="48" fill="url(#owlAuraGrad)" />

      {/* Left & Right Wing Tips */}
      <path d="M16 52 C12 62 18 78 28 84 C24 74 22 62 25 50 Z" fill="#3730A3" />
      <path d="M84 52 C88 62 82 78 72 84 C76 74 78 62 75 50 Z" fill="#3730A3" />

      {/* Ear Tufts (Ancient Indian Horned Owl) */}
      <path d="M26 28 C20 12 32 8 36 22 Z" fill="#4338CA" />
      <path d="M30 24 C26 15 33 12 35 21 Z" fill="#F59E0B" />
      <path d="M74 28 C80 12 68 8 64 22 Z" fill="#4338CA" />
      <path d="M70 24 C74 15 67 12 65 21 Z" fill="#F59E0B" />

      {/* Main Head & Body */}
      <ellipse cx="50" cy="55" rx="34" ry="32" fill="url(#owlBodyGrad)" />

      {/* Soft Cheek Pouches */}
      <ellipse cx="34" cy="50" rx="14" ry="15" fill="#E0E7FF" />
      <ellipse cx="66" cy="50" rx="14" ry="15" fill="#E0E7FF" />

      {/* Ancient Indian Sacred Wisdom Tilak (Third eye / knowledge mark) */}
      <path d="M50 20 C48 24 48 30 50 33 C52 30 52 24 50 20 Z" fill="#EF4444" />
      <circle cx="50" cy="35" r="1.5" fill="#F59E0B" />

      {/* Belly Breast Feathers */}
      <ellipse cx="50" cy="69" rx="19" ry="17" fill="url(#owlBellyGrad)" />
      {/* Feather chevrons */}
      <path d="M44 64 L50 69 L56 64" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <path d="M42 71 L50 77 L58 71" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" fill="none" />

      {/* Big Wise Owl Eyes */}
      <circle cx="36" cy="48" r="9" fill="#1E1B4B" />
      <circle cx="36" cy="48" r="7.5" fill="#0F172A" />
      <circle cx="36" cy="48" r="6" fill="#F59E0B" />
      <circle cx="36" cy="48" r="4.2" fill="#090A0F" />
      <circle cx="34" cy="46" r="1.8" fill="#FFFFFF" />
      <circle cx="38" cy="50" r="0.8" fill="#FFFFFF" />

      <circle cx="64" cy="48" r="9" fill="#1E1B4B" />
      <circle cx="64" cy="48" r="7.5" fill="#0F172A" />
      <circle cx="64" cy="48" r="6" fill="#F59E0B" />
      <circle cx="64" cy="48" r="4.2" fill="#090A0F" />
      <circle cx="62" cy="46" r="1.8" fill="#FFFFFF" />
      <circle cx="66" cy="50" r="0.8" fill="#FFFFFF" />

      {/* Golden Academic Spectacles (Round Specs) */}
      <circle cx="36" cy="48" r="10.5" stroke="url(#owlGoldGrad)" strokeWidth="2.5" fill="none" />
      <circle cx="64" cy="48" r="10.5" stroke="url(#owlGoldGrad)" strokeWidth="2.5" fill="none" />
      {/* Glasses Bridge */}
      <path d="M46.5 48 C48.5 45 51.5 45 53.5 48" stroke="url(#owlGoldGrad)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
      {/* Specs Side Temple Bars */}
      <path d="M25.5 47 L20 46" stroke="url(#owlGoldGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />
      <path d="M74.5 47 L80 46" stroke="url(#owlGoldGrad)" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Beak */}
      <path d="M47 52 C47 52 50 61 50 61 C50 61 53 52 53 52 Z" fill="#D97706" />
      <path d="M48 53 C48 53 50 59 50 59 C50 59 52 53 52 53 Z" fill="#F59E0B" />

      {/* Cute Little Feet / Talons */}
      <ellipse cx="42" cy="86" rx="4" ry="2.5" fill="#F59E0B" />
      <ellipse cx="58" cy="86" rx="4" ry="2.5" fill="#F59E0B" />
    </svg>
  );
};
