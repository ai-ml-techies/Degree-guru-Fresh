import React, { useState } from "react";

export type UniversityLogoId =
  | "amity"
  | "amity-university-online"
  | "manipal"
  | "manipal-university-jaipur"
  | "manipal-university-jaipur-online"
  | "dpu"
  | "dy-patil-university-online"
  | "shoolini"
  | "shoolini-university-online"
  | "cu"
  | "chandigarh-university-online"
  | "lpu"
  | "lpu-online"
  | "nmims"
  | "nmims-online"
  | "jain"
  | "jain-university-online"
  | "amrita"
  | "amrita-ahead-online"
  | "gla"
  | "gla-university-online"
  | "uttaranchal"
  | "uttaranchal-university-online";

interface UniversityLogoProps {
  idOrSlug: string;
  size?: "sm" | "md" | "lg";
  className?: string;
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

  // Match 100% verified real online university logos
  let logo: LogoData | null = null;

  if (norm.includes("amity")) {
    logo = { src: "/logos/amity.png", alt: "Amity University Online" };
  } else if (norm.includes("manipal") && !norm.includes("smu") && !norm.includes("sikkim")) {
    logo = { src: "/logos/manipal.svg", alt: "Online Manipal" };
  } else if (norm.includes("dpu") || norm.includes("patil")) {
    logo = { src: "/logos/dpu.png", alt: "Dr. D.Y. Patil Vidyapeeth Online" };
  } else if (norm.includes("shoolini")) {
    logo = { src: "/logos/shoolini.png", alt: "Shoolini University Online" };
  } else if (norm.includes("chandigarh") || norm === "cu" || norm.includes("cu-online")) {
    logo = { src: "/logos/cu.png", alt: "Chandigarh University Online" };
  } else if (norm.includes("lpu") || norm.includes("lovely")) {
    logo = { src: "/logos/lpu.svg", alt: "LPU Online" };
  } else if (norm.includes("nmims")) {
    logo = { src: "/logos/nmims.png", alt: "NMIMS Global Online" };
  } else if (norm.includes("jain")) {
    logo = { src: "/logos/jain.png", alt: "Jain University Online" };
  } else if (norm.includes("amrita")) {
    logo = { src: "/logos/amrita.svg", alt: "Amrita Ahead Online" };
  } else if (norm.includes("gla")) {
    logo = { src: "/logos/gla.png", alt: "GLA University Online" };
  } else if (norm.includes("uttaranchal")) {
    logo = { src: "/logos/uttaranchal.svg", alt: "Uttaranchal University Online" };
  }

  const containerHeight =
    size === "sm" ? "h-9 px-2" : size === "lg" ? "h-14 px-4" : "h-12 px-3";

  const imgMaxHeight =
    size === "sm" ? "max-h-6" : size === "lg" ? "max-h-10" : "max-h-8";

  // If real logo exists and hasn't errored
  if (logo && !hasError) {
    if (raw) {
      return (
        <img
          src={logo.src}
          alt={logo.alt}
          className={`${imgMaxHeight} w-auto max-w-[90%] object-contain ${className}`}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      );
    }

    return (
      <div
        className={`inline-flex items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-200/80 transition-all duration-200 group-hover:border-primary/40 ${containerHeight} w-full max-w-[200px] ${className}`}
      >
        <img
          src={logo.src}
          alt={logo.alt}
          className={`${imgMaxHeight} w-auto max-w-[88%] object-contain select-none transition-transform duration-200 group-hover:scale-105`}
          onError={() => setHasError(true)}
          loading="lazy"
        />
      </div>
    );
  }

  // Clean fallback for any non-matched university
  const cleanName = idOrSlug
    .replace(/-online$/, "")
    .replace(/-university/, "")
    .replace(/-/g, " ")
    .toUpperCase();

  return (
    <div
      className={`inline-flex items-center justify-center rounded-xl bg-white text-slate-900 shadow-2xs border border-slate-200/80 ${containerHeight} w-full max-w-[200px] ${className}`}
    >
      <span className="text-[11px] font-black tracking-tight truncate px-2">
        {cleanName}
      </span>
    </div>
  );
};

export default UniversityLogo;
