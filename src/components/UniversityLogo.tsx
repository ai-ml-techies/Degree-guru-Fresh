import React from "react";

export type UniversityLogoId =
  | "manipal"
  | "manipal-university-jaipur"
  | "manipal-university-jaipur-online"
  | "amity"
  | "amity-university-online"
  | "nmims"
  | "nmims-online"
  | "lpu"
  | "lpu-online"
  | "cu"
  | "chandigarh-university-online"
  | "dpu"
  | "dy-patil-university-online"
  | "bennett"
  | "bennett-university-online"
  | "sharda"
  | "sharda-university-online"
  | "parul"
  | "parul-university-online"
  | "upgrad"
  | "upgrad-partners"
  | "amrita"
  | "amrita-ahead-online"
  | "gla"
  | "gla-university-online"
  | "uttaranchal"
  | "uttaranchal-university-online"
  | "jain"
  | "jain-university-online"
  | "smu";

interface UniversityLogoProps {
  idOrSlug: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  idOrSlug,
  size = "md",
  className = "",
}) => {
  const norm = idOrSlug.toLowerCase().replace(/-online$/, "").replace(/-university/, "");

  const heightClass =
    size === "sm" ? "h-6" : size === "lg" ? "h-11" : "h-8";

  // 1. Online Manipal
  if (norm.includes("manipal") && !norm.includes("smu")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="17" fill="#FFF4EB" stroke="#F58220" strokeWidth="1.5" />
          <path d="M18 5L20.5 13H28.5L22 17.5L24.5 25.5L18 21L11.5 25.5L14 17.5L7.5 13H15.5L18 5Z" fill="#F58220" />
          <circle cx="18" cy="18" r="4.5" fill="#FFFFFF" />
          <circle cx="18" cy="18" r="2.5" fill="#E65100" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-[9px] font-bold text-[#F58220] tracking-wider uppercase">ONLINE</span>
          <span className="text-xs font-black tracking-tight text-foreground">MANIPAL</span>
        </div>
      </div>
    );
  }

  // 2. Amity University Online
  if (norm.includes("amity")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 38" fill="none" className={`${heightClass} w-auto aspect-[36/38] shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <path d="M18 2L33 7V19C33 28 26 34 18 36C10 34 3 28 3 19V7L18 2Z" fill="#002147" />
          <path d="M18 5L30 9V18.5C30 25.5 24.5 30.5 18 32.5C11.5 30.5 6 25.5 6 18.5V9L18 5Z" fill="#003366" stroke="#FDB813" strokeWidth="1.2" />
          {/* Torch flame & laurel in gold */}
          <path d="M18 10C18 10 21 14 20 16.5C19.2 18.5 16.8 18.5 16 16.5C15 14 18 10 18 10Z" fill="#FDB813" />
          <path d="M15.5 19H20.5L19.5 24H16.5L15.5 19Z" fill="#FDB813" />
          <circle cx="18" cy="27" r="1.5" fill="#FDB813" />
        </svg>
        <div className="flex flex-col text-left leading-tight select-none">
          <span className="text-[11px] font-black text-foreground tracking-tight">AMITY</span>
          <span className="text-[8.5px] font-bold text-[#00478F] dark:text-purple-400 tracking-wider">UNIVERSITY ONLINE</span>
        </div>
      </div>
    );
  }

  // 3. NMIMS Global (SVKM's)
  if (norm.includes("nmims")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="7" fill="#9D1C24" />
          <path d="M7 11C7 8.5 9 6.5 11.5 6.5H24.5C27 6.5 29 8.5 29 11V25C29 27.5 27 29.5 24.5 29.5H11.5C9 29.5 7 27.5 7 25V11Z" stroke="#FFFFFF" strokeWidth="1.2" fill="none" />
          <path d="M11 23V13L15.5 20L20 13V23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M21.5 23V13H24.5" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">NMIMS</span>
          <span className="text-[8.5px] font-bold text-[#9D1C24] dark:text-rose-400 tracking-wider uppercase">CDOE • GLOBAL</span>
        </div>
      </div>
    );
  }

  // 4. LPU Online
  if (norm.includes("lpu") || norm.includes("lovely")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#F37021" />
          {/* Flame gears */}
          <circle cx="18" cy="18" r="9" fill="#FFFFFF" />
          <path d="M18 10C15 14 15 17 18 21C21 17 21 14 18 10Z" fill="#F37021" />
          <circle cx="18" cy="18" r="3" fill="#D84315" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">LPU <span className="text-[#F37021]">Online</span></span>
          <span className="text-[8px] font-semibold text-muted-foreground uppercase tracking-wider">Distance & Online Edu</span>
        </div>
      </div>
    );
  }

  // 5. Chandigarh University (CU Online)
  if (norm.includes("cu") || norm.includes("chandigarh")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="6" fill="#C8102E" />
          <path d="M13 13C10.5 15.5 10.5 20.5 13 23C15.5 25.5 20 25.5 22.5 23" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M23 13V19C23 21 21 23 19 23" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <div className="flex flex-col text-left leading-tight select-none">
          <span className="text-[11px] font-black tracking-tight text-foreground">CHANDIGARH</span>
          <span className="text-[8px] font-bold text-[#C8102E] dark:text-red-400 tracking-wider">UNIVERSITY ONLINE</span>
        </div>
      </div>
    );
  }

  // 6. DPU (Dr. D.Y. Patil Vidyapeeth Pune)
  if (norm.includes("dpu") || norm.includes("patil")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3L32 9V19C32 26.5 26 32 18 34C10 32 4 26.5 4 19V9L18 3Z" fill="#5C0632" stroke="#E6A15C" strokeWidth="1.2" />
          <circle cx="18" cy="18" r="8" fill="#7A0C43" stroke="#E6A15C" strokeWidth="0.8" />
          <text x="18" y="21" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontWeight="bold" fontFamily="sans-serif">DPU</text>
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">DY PATIL</span>
          <span className="text-[8px] font-bold text-[#7A0C43] dark:text-pink-400 tracking-wider">ONLINE LEARNING</span>
        </div>
      </div>
    );
  }

  // 7. Bennett University
  if (norm.includes("bennett")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#003366" />
          <path d="M7 18L18 7L29 18L18 29L7 18Z" fill="#C4122F" />
          <circle cx="18" cy="18" r="5" fill="#FFFFFF" />
          <circle cx="18" cy="18" r="2.5" fill="#003366" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">BENNETT</span>
          <span className="text-[8px] font-bold text-[#C4122F] dark:text-rose-400 tracking-wider">THE TIMES GROUP</span>
        </div>
      </div>
    );
  }

  // 8. Sharda University
  if (norm.includes("sharda")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3L31 8V18C31 25.5 25.5 31 18 33C10.5 31 5 25.5 5 18V8L18 3Z" fill="#0A3871" />
          <path d="M18 7L28 11V18C28 23.5 23.5 28 18 30C12.5 28 8 23.5 8 18V11L18 7Z" fill="#15539E" />
          <polygon points="18,12 19.5,15.5 23,16 20.5,18.5 21,22 18,20 15,22 15.5,18.5 13,16 16.5,15.5" fill="#FFC107" />
        </svg>
        <div className="flex flex-col text-left leading-tight select-none">
          <span className="text-[11px] font-black text-foreground tracking-tight">SHARDA</span>
          <span className="text-[8px] font-bold text-[#0A3871] dark:text-purple-400 tracking-wider uppercase">BEYOND BOUNDARIES</span>
        </div>
      </div>
    );
  }

  // 9. Parul University
  if (norm.includes("parul")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="30" height="30" rx="7" fill="#8C1D40" />
          <circle cx="18" cy="18" r="8" fill="#FFC627" />
          <path d="M15 13H19C20.5 13 21.5 14 21.5 15.5C21.5 17 20.5 18 19 18H15V23" stroke="#8C1D40" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">PARUL</span>
          <span className="text-[8px] font-bold text-[#8C1D40] dark:text-rose-400 tracking-wider uppercase">ONLINE LEARNING</span>
        </div>
      </div>
    );
  }

  // 10. upGrad
  if (norm.includes("upgrad")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 100 30" fill="none" className={`${heightClass} w-auto`} xmlns="http://www.w3.org/2000/svg">
          <path d="M4 16c0 4.4 2.8 7 6.5 7s6.5-2.6 6.5-7V5h-3.2v11c0 2.2-1.3 3.6-3.3 3.6s-3.3-1.4-3.3-3.6V5H4v11z" fill="#EB3A34" />
          <path d="M21 11h3.2v1.2c.8-1 2-1.5 3.6-1.5 3.2 0 5.6 2.6 5.6 6.1s-2.4 6.1-5.6 6.1c-1.6 0-2.8-.5-3.6-1.5V27H21V11zm3.2 5.8c0 2 1.4 3.4 3.2 3.4s3.2-1.4 3.2-3.4-1.4-3.4-3.2-3.4-3.2 1.4-3.2 3.4z" fill="#EB3A34" />
          <path d="M42 17.5c0 3.2-2.4 5.5-5.6 5.5-3.6 0-6-2.6-6-6.3s2.4-6.3 6-6.3c3 0 5.2 2 5.5 4.7h-3.1c-.2-1.5-1.2-2.4-2.4-2.4-2 0-3 1.6-3 4s1 4 3 4c1.4 0 2.4-.8 2.6-2H36.5v-2.2H42v2z" fill="#111827" className="dark:fill-white" />
          <path d="M45 12.5h3v1.6c.6-1.2 1.8-1.8 3-1.8v3.2c-.3 0-.6-.1-1-.1-1.8 0-2.8 1.2-3 3v4.6h-3v-10.5z" fill="#111827" className="dark:fill-white" />
          <path d="M57 12.5h3v9.5H57v-1.2c-.8 1-2 1.5-3.6 1.5-3 0-5.4-2.2-5.4-5.2s2.5-5.2 5.6-5.2c1.4 0 2.6.5 3.4 1.2v-.6zm-3.2 3.4c-1.6 0-2.8 1-2.8 2.8s1.2 2.8 2.8 2.8 3-1 3-2.8-1.2-2.8-3-2.8z" fill="#111827" className="dark:fill-white" />
          <path d="M68 6v6c.8-.8 2-1.4 3.4-1.4 3 0 5.4 2.4 5.4 5.8s-2.4 5.8-5.4 5.8c-1.4 0-2.6-.6-3.4-1.4V22H65V6h3zm0 10.8c0 1.8 1.2 3.2 3 3.2s3-1.4 3-3.2-1.2-3.2-3-3.2-3 1.4-3 3.2z" fill="#111827" className="dark:fill-white" />
        </svg>
      </div>
    );
  }

  // 11. Amrita Ahead
  if (norm.includes("amrita")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="6" fill="#881B43" />
          <circle cx="18" cy="18" r="8" fill="#FFFFFF" stroke="#D4AF37" strokeWidth="1" />
          <path d="M18 12C16 15 16 18 18 21C20 18 20 15 18 12Z" fill="#881B43" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">AMRITA</span>
          <span className="text-[8px] font-bold text-[#881B43] dark:text-pink-400 tracking-wider uppercase">AHEAD ONLINE</span>
        </div>
      </div>
    );
  }

  // 12. GLA University
  if (norm.includes("gla")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="30" height="30" rx="6" fill="#006837" />
          <path d="M12 12H24V16H16V20H22V24H12V12Z" fill="#FFFFFF" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">GLA</span>
          <span className="text-[8px] font-bold text-[#006837] dark:text-emerald-400 tracking-wider uppercase">ONLINE UNIVERSITY</span>
        </div>
      </div>
    );
  }

  // 13. Uttaranchal University
  if (norm.includes("uttaranchal")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#0D3880" />
          <path d="M10 24L18 8L26 24H10Z" fill="#F37021" />
          <circle cx="18" cy="18" r="4" fill="#FFFFFF" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-[11px] font-black tracking-tight text-foreground">UTTARANCHAL</span>
          <span className="text-[8px] font-bold text-[#F37021] tracking-wider uppercase">ONLINE DEGREE</span>
        </div>
      </div>
    );
  }

  // 14. Alliance University Online
  if (norm.includes("alliance")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#0B2545" />
          <path d="M18 6L28 12V20C28 26 23 29 18 31C13 29 8 26 8 20V12L18 6Z" fill="#134074" stroke="#EE964B" strokeWidth="1.2" />
          <path d="M18 10L22 22H14L18 10Z" fill="#EE964B" />
          <circle cx="18" cy="16" r="2" fill="#FFFFFF" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">ALLIANCE</span>
          <span className="text-[8px] font-bold text-[#134074] dark:text-purple-400 tracking-wider uppercase">UNIVERSITY ONLINE</span>
        </div>
      </div>
    );
  }

  // 15. Vivekananda Global University (VGU)
  if (norm.includes("vgu") || norm.includes("vivekananda")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#8B1E1E" />
          <circle cx="18" cy="18" r="12" fill="#A82828" stroke="#F4C430" strokeWidth="1" />
          <path d="M18 9V27M9 18H27M12 12L24 24M12 24L24 12" stroke="#F4C430" strokeWidth="1.5" strokeLinecap="round" />
          <circle cx="18" cy="18" r="4" fill="#FFFFFF" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">VGU</span>
          <span className="text-[8px] font-bold text-[#8B1E1E] dark:text-rose-400 tracking-wider uppercase">VIVEKANANDA GLOBAL</span>
        </div>
      </div>
    );
  }

  // 16. Shoolini University Online
  if (norm.includes("shoolini")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="7" fill="#C41E3A" />
          <path d="M18 7L24 16H12L18 7Z" fill="#FFFFFF" />
          <path d="M18 15L27 27H9L18 15Z" fill="#FFD700" />
          <circle cx="18" cy="21" r="2.5" fill="#C41E3A" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">SHOOLINI</span>
          <span className="text-[8px] font-bold text-[#C41E3A] dark:text-rose-400 tracking-wider uppercase">UNIVERSITY ONLINE</span>
        </div>
      </div>
    );
  }

  // 17. VIT Online (Vellore Institute of Technology)
  if (norm.includes("vit") || norm.includes("vellore")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <path d="M18 3L32 8V18C32 26 25 31 18 33C11 31 4 26 4 18V8L18 3Z" fill="#002D62" />
          <path d="M11 14L18 25L25 14H20.5L18 19L15.5 14H11Z" fill="#EAAA00" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">VIT</span>
          <span className="text-[8px] font-bold text-[#002D62] dark:text-purple-400 tracking-wider uppercase">ONLINE LEARNING</span>
        </div>
      </div>
    );
  }

  // 18. Sikkim Manipal University Online (SMU)
  if (norm.includes("smu") || norm.includes("sikkim")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#F58220" />
          <circle cx="18" cy="18" r="11" fill="#FFFFFF" />
          <path d="M13 18C13 15.2 15.2 13 18 13C20.8 13 23 15.2 23 18C23 20.8 20.8 23 18 23" stroke="#003366" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">SMU</span>
          <span className="text-[8px] font-bold text-[#F58220] tracking-wider uppercase">SIKKIM MANIPAL</span>
        </div>
      </div>
    );
  }

  // 19. Assam Down Town University
  if (norm.includes("assam") || norm.includes("adtu")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <circle cx="18" cy="18" r="16" fill="#0C2340" />
          <circle cx="18" cy="18" r="12" fill="#1D428A" stroke="#FFC72C" strokeWidth="1" />
          <path d="M18 9L23 23H13L18 9Z" fill="#FFC72C" />
          <circle cx="18" cy="18" r="3" fill="#FFFFFF" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">ASSAM DTU</span>
          <span className="text-[8px] font-bold text-[#1D428A] dark:text-purple-400 tracking-wider uppercase">DOWN TOWN UNIV</span>
        </div>
      </div>
    );
  }

  // 20. Jain University Online
  if (norm.includes("jain")) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`}>
        <svg viewBox="0 0 36 36" fill="none" className={`${heightClass} w-auto aspect-square shrink-0`} xmlns="http://www.w3.org/2000/svg">
          <rect x="2" y="2" width="32" height="32" rx="6" fill="#1C2D5A" />
          <circle cx="18" cy="18" r="9" fill="#E82430" />
          <path d="M18 11V25M14 22L18 25L22 22" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div className="flex flex-col text-left leading-none select-none">
          <span className="text-xs font-black tracking-tight text-foreground">JAIN</span>
          <span className="text-[8px] font-bold text-[#E82430] tracking-wider uppercase">ONLINE DEEMED UNIV</span>
        </div>
      </div>
    );
  }

  // Default fallback authentic seal
  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`${heightClass} aspect-square rounded-lg bg-primary/15 text-primary border border-primary/30 flex items-center justify-center font-black text-xs shrink-0`}>
        {idOrSlug.substring(0, 2).toUpperCase()}
      </div>
      <div className="flex flex-col text-left leading-none select-none">
        <span className="text-xs font-bold text-foreground capitalize truncate max-w-[140px]">
          {idOrSlug.replace(/-/g, " ")}
        </span>
        <span className="text-[8px] text-muted-foreground uppercase font-semibold">UGC-DEB Verified</span>
      </div>
    </div>
  );
};
export default UniversityLogo;
