import React from "react";

interface GuruMascotProps {
  size?: number;
  className?: string;
}

/**
 * Guru AI Mascot:
 * A modern, minimalist expert figure resonating knowledge, wisdom, and academic mentorship.
 * Features a sleek geometric silhouette with a minimalist graduation mortarboard,
 * gold tassel, smart round spectacles, a confident mentor smile, and a subtle knowledge spark.
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
      aria-label="Guru AI Expert Mascot"
    >
      <defs>
        {/* Modern Violet/Indigo Glow */}
        <radialGradient id="guruAura" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4F46E5" stopOpacity="0" />
        </radialGradient>

        {/* Head / Body Gradient */}
        <linearGradient id="guruBody" x1="20" y1="20" x2="80" y2="90" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#6366F1" />
          <stop offset="50%" stopColor="#4F46E5" />
          <stop offset="100%" stopColor="#3730A3" />
        </linearGradient>

        {/* Cap Slate / Deep Navy Gradient */}
        <linearGradient id="guruCap" x1="25" y1="10" x2="75" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#1E1B4B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Gold Tassel & Specs Gradient */}
        <linearGradient id="guruGold" x1="30" y1="30" x2="70" y2="60" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        {/* Face Tone: Minimalist Modern Ivory */}
        <linearGradient id="guruFace" x1="35" y1="35" x2="65" y2="70" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="100%" stopColor="#FEF3C7" />
        </linearGradient>
      </defs>

      {/* Subtle Aura */}
      <circle cx="50" cy="50" r="48" fill="url(#guruAura)" />

      {/* Outer Mentor Base Shape */}
      <circle cx="50" cy="50" r="44" fill="url(#guruBody)" />

      {/* Minimalist Expert Shoulders & Collar */}
      <path
        d="M22 84 C28 68 40 64 50 64 C60 64 72 68 78 84 C68 91 50 93 22 84 Z"
        fill="#1E1B4B"
      />
      {/* Crisp White Shirt Collar Notch */}
      <path d="M44 64 L50 72 L56 64 Z" fill="#FFFFFF" />
      {/* Gold Academic Tie Accent */}
      <path d="M48 71 L50 82 L52 71 Z" fill="url(#guruGold)" />

      {/* Expert Face Shape */}
      <path
        d="M32 42 C32 30 68 30 68 42 C68 56 61 66 50 66 C39 66 32 56 32 42 Z"
        fill="url(#guruFace)"
      />

      {/* Minimalist Academic Mortarboard Cap */}
      {/* Skull Cap Base */}
      <ellipse cx="50" cy="30" rx="16" ry="6" fill="url(#guruCap)" />
      {/* Diamond Top Cap Plane */}
      <polygon points="50,15 82,27 50,37 18,27" fill="url(#guruCap)" stroke="#312E81" strokeWidth="1" />
      {/* Cap Center Button */}
      <circle cx="50" cy="26" r="2.2" fill="url(#guruGold)" />
      {/* Gold Tassel String & Bob */}
      <path d="M50 26 C58 27 68 32 69 40" stroke="url(#guruGold)" strokeWidth="1.8" strokeLinecap="round" fill="none" />
      <polygon points="67,39 71,39 72,45 66,45" fill="url(#guruGold)" />

      {/* Smart Round Spectacles (Knowledge Resonance) */}
      <circle cx="41" cy="46" r="7.5" stroke="url(#guruGold)" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.8" />
      <circle cx="59" cy="46" r="7.5" stroke="url(#guruGold)" strokeWidth="2" fill="#FFFFFF" fillOpacity="0.8" />
      {/* Spectacles Bridge */}
      <path d="M48.5 46 C49.5 44.5 50.5 44.5 51.5 46" stroke="url(#guruGold)" strokeWidth="2" strokeLinecap="round" />
      {/* Minimal Specs Temples */}
      <path d="M33.5 45.5 L30 44" stroke="url(#guruGold)" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M66.5 45.5 L70 44" stroke="url(#guruGold)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Confident, Focused Eyes Behind Specs */}
      <circle cx="41" cy="46" r="3" fill="#0F172A" />
      <circle cx="40" cy="45" r="1" fill="#FFFFFF" />
      <circle cx="59" cy="46" r="3" fill="#0F172A" />
      <circle cx="58" cy="45" r="1" fill="#FFFFFF" />

      {/* Subtle Eyebrows */}
      <path d="M36 39 C38 37 43 37 45 39" stroke="#4B5563" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M55 39 C57 37 62 37 64 39" stroke="#4B5563" strokeWidth="1.6" strokeLinecap="round" />

      {/* Friendly, Assured Mentor Smile */}
      <path d="M44 56 C47 59 53 59 56 56" stroke="#92400E" strokeWidth="2" strokeLinecap="round" fill="none" />

      {/* Spark of Knowledge (Star in top right) */}
      <path
        d="M82 18 L83.5 22 L87.5 23.5 L83.5 25 L82 29 L80.5 25 L76.5 23.5 L80.5 22 Z"
        fill="url(#guruGold)"
      />
    </svg>
  );
};

export default GuruMascot;
