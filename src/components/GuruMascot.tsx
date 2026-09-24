import React from "react";

interface GuruMascotProps {
  size?: number;
  className?: string;
}

/**
 * Guru AI Mascot:
 * Clean, modern minimalist expert mentor figure resonating knowledge and wisdom.
 * Styled in brand purple, warm charcoal, and elegant gold accents — without harsh blue saturation.
 */
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
      aria-label="Guru AI Expert Mentor"
    >
      <defs>
        {/* Soft Warm Knowledge Aura */}
        <radialGradient id="guruCleanAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6528F7" stopOpacity="0" />
        </radialGradient>

        {/* Clean Brand Purple & Charcoal Body */}
        <linearGradient id="guruMentorBody" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#5B21B6" />
        </linearGradient>

        {/* Sleek Minimalist Academic Cap (Deep Obsidian Charcoal) */}
        <linearGradient id="guruCapMinimal" x1="20" y1="12" x2="80" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#27272A" />
          <stop offset="100%" stopColor="#18181B" />
        </linearGradient>

        {/* Pure Gold Accent for Tassel & Specs */}
        <linearGradient id="guruGoldPure" x1="30" y1="25" x2="70" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Soft Warm Minimalist Face Tone */}
        <linearGradient id="guruWarmFace" x1="35" y1="35" x2="65" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#F5F3FF" />
        </linearGradient>
      </defs>

      {/* Subtle Ambient Ring */}
      <circle cx="50" cy="50" r="48" fill="url(#guruCleanAura)" />

      {/* Clean Mentor Circle Base */}
      <circle cx="50" cy="50" r="42" fill="url(#guruMentorBody)" />

      {/* Minimalist Robe / Shoulders */}
      <path
        d="M24 84 C30 70 40 66 50 66 C60 66 70 70 76 84 C68 90 50 92 24 84 Z"
        fill="#18181B"
      />
      {/* Crisp White Collar V-notch */}
      <path d="M43 66 L50 74 L57 66 Z" fill="#FFFFFF" />
      {/* Gold Academic Tie Point */}
      <path d="M48.5 73 L50 83 L51.5 73 Z" fill="url(#guruGoldPure)" />

      {/* Clean Head Silhouette */}
      <path
        d="M33 43 C33 31 67 31 67 43 C67 56 60 65 50 65 C40 65 33 56 33 43 Z"
        fill="url(#guruWarmFace)"
      />

      {/* Minimalist Mortarboard Cap */}
      <ellipse cx="50" cy="30" rx="15" ry="5.5" fill="url(#guruCapMinimal)" />
      {/* Diamond Cap Top */}
      <polygon points="50,16 80,27 50,37 20,27" fill="url(#guruCapMinimal)" stroke="#3F3F46" strokeWidth="0.8" />
      {/* Cap Center Button */}
      <circle cx="50" cy="26.5" r="2.2" fill="url(#guruGoldPure)" />
      {/* Elegant Gold Tassel */}
      <path
        d="M50 26.5 C57 27.5 66 32 67 40"
        stroke="url(#guruGoldPure)"
        strokeWidth="1.8"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="67" cy="41" r="2" fill="url(#guruGoldPure)" />

      {/* Smart Round Glasses (Resonates Wisdom & Knowledge) */}
      <circle cx="41.5" cy="46" r="7" stroke="url(#guruGoldPure)" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.9" />
      <circle cx="58.5" cy="46" r="7.5" stroke="url(#guruGoldPure)" strokeWidth="1.8" fill="#FFFFFF" fillOpacity="0.9" />
      {/* Glasses Bridge */}
      <path d="M48.5 46 C49.5 44.5 50.5 44.5 51.5 46" stroke="url(#guruGoldPure)" strokeWidth="1.8" strokeLinecap="round" />

      {/* Mentor Eyes */}
      <circle cx="41.5" cy="46" r="2.2" fill="#18181B" />
      <circle cx="42.2" cy="45.2" r="0.8" fill="#FFFFFF" />
      <circle cx="58.5" cy="46" r="2.2" fill="#18181B" />
      <circle cx="59.2" cy="45.2" r="0.8" fill="#FFFFFF" />

      {/* Friendly Confident Smile */}
      <path
        d="M45.5 56.5 C47.5 58.5 52.5 58.5 54.5 56.5"
        stroke="#7C3AED"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Spark of Wisdom in top corner */}
      <path
        d="M76 18 L77.5 21.5 L81 23 L77.5 24.5 L76 28 L74.5 24.5 L71 23 L74.5 21.5 Z"
        fill="#FBBF24"
        opacity="0.9"
      />
    </svg>
  );
};
export default GuruMascot;
