import React, { useState } from "react";

export type UniversityLogoId =
  | "manipal"
  | "manipal-university-jaipur"
  | "manipal-university-jaipur-online"
  | "amity"
  | "amity-university-online"
  | "dpu"
  | "dy-patil-university-online"
  | "shoolini"
  | "shoolini-university-online"
  | "nmims"
  | "nmims-online"
  | "lpu"
  | "lpu-online"
  | "cu"
  | "chandigarh-university-online"
  | "bennett"
  | "bennett-university-online"
  | "sharda"
  | "sharda-university-online"
  | "parul"
  | "parul-university-online"
  | "amrita"
  | "amrita-ahead-online"
  | "uttaranchal"
  | "uttaranchal-university-online"
  | "jain"
  | "jain-university-online"
  | "alliance"
  | "vit"
  | "smu";

interface UniversityLogoProps {
  idOrSlug: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  /** If true, omits the outer white container styling */
  raw?: boolean;
}

interface LogoData {
  src: string;
  alt: string;
}

export const UniversityLogo: React.FC<UniversityLogoProps> = ({
  idOrSlug,
  size = "md",
  className = "",
  raw = false,
}) => {
  const [hasError, setHasError] = useState(false);
  const norm = (idOrSlug || "").toLowerCase();

  // Match real logos
  let logo: LogoData | null = null;

  if (norm.includes("amity")) {
    logo = { src: "/logos/amity.png", alt: "Amity University Online" };
  } else if (norm.includes("manipal") && !norm.includes("smu") && !norm.includes("sikkim")) {
    logo = { src: "/logos/manipal.png", alt: "Online Manipal" };
  } else if (norm.includes("dpu") || norm.includes("patil")) {
    logo = { src: "/logos/dpu.png", alt: "Dr. D.Y. Patil Vidyapeeth Online" };
  } else if (norm.includes("shoolini")) {
    logo = { src: "/logos/shoolini.png", alt: "Shoolini University Online" };
  } else if (norm.includes("chandigarh") || norm === "cu" || norm.includes("cu-online")) {
    logo = { src: "/logos/cu.png", alt: "Chandigarh University Online" };
  } else if (norm.includes("nmims")) {
    logo = { src: "/logos/nmims.png", alt: "NMIMS Global Online" };
  } else if (norm.includes("lpu") || norm.includes("lovely")) {
    logo = { src: "/logos/lpu.svg", alt: "LPU Online" };
  } else if (norm.includes("amrita")) {
    logo = { src: "/logos/amrita.svg", alt: "Amrita Ahead Online" };
  } else if (norm.includes("bennett")) {
    logo = { src: "/logos/bennett.png", alt: "Bennett University" };
  } else if (norm.includes("sharda")) {
    logo = { src: "/logos/sharda.png", alt: "Sharda University" };
  } else if (norm.includes("parul")) {
    logo = { src: "/logos/parul.svg", alt: "Parul University" };
  } else if (norm.includes("uttaranchal")) {
    logo = { src: "/logos/uttaranchal.svg", alt: "Uttaranchal University" };
  }

  const containerHeight =
    size === "sm" ? "h-8 px-2" : size === "lg" ? "h-14 px-4" : "h-11 px-3";

  const imgMaxHeight =
    size === "sm" ? "max-h-6" : size === "lg" ? "max-h-11" : "max-h-8";

  // If real logo exists and hasn't errored
  if (logo && !hasError) {
    if (raw) {
      return (
        <img
          src={logo.src}
          alt={logo.alt}
          className={`${imgMaxHeight} w-auto max-w-full object-contain ${className}`}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      );
    }

    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-white dark:bg-white/95 shadow-2xs border border-border/40 transition-transform group-hover:scale-[1.02] ${containerHeight} w-full max-w-[190px] ${className}`}
      >
        <img
          src={logo.src}
          alt={logo.alt}
          className={`${imgMaxHeight} w-auto max-w-full object-contain select-none`}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Elegant fallback with clean initials badge on consistent background
  const initials = idOrSlug
    .replace(/-online$/, "")
    .replace(/-university/, "")
    .split(/[-_\s]+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("") || "DG";

  const cleanName = idOrSlug
    .replace(/-online$/, "")
    .replace(/-university/, "")
    .replace(/-/g, " ")
    .toUpperCase();

  return (
    <div
      className={`inline-flex items-center justify-center gap-2 rounded-xl bg-white dark:bg-white/95 text-foreground shadow-2xs border border-border/40 ${containerHeight} w-full max-w-[190px] ${className}`}
    >
      <div className="w-6 h-6 rounded-lg bg-[#6528f7]/15 text-[#6528f7] font-black text-[10px] flex items-center justify-center shrink-0">
        {initials}
      </div>
      <span className="text-[10px] font-extrabold text-slate-800 tracking-tight truncate max-w-[120px]">
        {cleanName}
      </span>
    </div>
  );
};

export default UniversityLogo;
