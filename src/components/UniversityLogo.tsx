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
  } else if (norm.includes("smu") || norm.includes("sikkim-manipal")) {
    logo = { src: "/logos/smu.png", alt: "Sikkim Manipal University Online" };
  } else if (norm.includes("manipal") || norm.includes("muj")) {
    logo = { src: "/logos/manipal.svg", alt: "Online Manipal (MUJ)" };
  } else if (norm.includes("dpu") || norm.includes("patil")) {
    logo = { src: "/logos/dpu.png", alt: "Dr. D.Y. Patil Vidyapeeth Online" };
  } else if (norm.includes("shoolini")) {
    logo = { src: "/logos/shoolini.png", alt: "Shoolini University Online" };
  } else if (norm.includes("chandigarh") || norm === "cu" || norm.includes("cuol") || norm.includes("cu-online")) {
    logo = { src: "/logos/cu.png", alt: "Chandigarh University Online" };
  } else if (norm.includes("lpu") || norm.includes("lovely")) {
    logo = { src: "/logos/lpu.svg", alt: "LPU Online" };
  } else if (norm.includes("nmims")) {
    logo = { src: "/logos/nmims.png", alt: "NMIMS Global Online" };
  } else if (norm.includes("jain")) {
    logo = { src: "/logos/jain.png", alt: "Jain University Online" };
  } else if (norm.includes("amrita") || norm.includes("avv")) {
    logo = { src: "/logos/amrita.svg", alt: "Amrita Ahead Online" };
  } else if (norm.includes("gla")) {
    logo = { src: "/logos/gla.png", alt: "GLA University Online" };
  } else if (norm.includes("uttaranchal") || norm === "uu" || norm.includes("uu-online")) {
    logo = { src: "/logos/uttaranchal.svg", alt: "Uttaranchal University Online" };
  } else if (norm.includes("bennett")) {
    logo = { src: "/logos/bennett.png", alt: "Bennett University Online" };
  } else if (norm.includes("sharda")) {
    logo = { src: "/logos/sharda.png", alt: "Sharda University Online" };
  } else if (norm.includes("parul")) {
    logo = { src: "/logos/parul.png", alt: "Parul University Online" };
  } else if (norm.includes("galgotias")) {
    logo = { src: "/logos/galgotias.png", alt: "Galgotias University Online" };
  } else if (norm.includes("christ")) {
    logo = { src: "/logos/christ.png", alt: "Christ University Online" };
  } else if (norm.includes("adtu") || norm.includes("assam")) {
    logo = { src: "/logos/adtu.svg", alt: "Assam Down Town University Online" };
  } else if (norm.includes("alliance")) {
    logo = { src: "/logos/alliance.webp", alt: "Alliance University Online" };
  } else if (norm.includes("vit") || norm.includes("vellore")) {
    logo = { src: "/logos/vit.svg", alt: "VIT Online" };
  } else if (norm.includes("kuk") || norm.includes("kurukshetra")) {
    logo = { src: "/logos/kuk.png", alt: "Kurukshetra University Online" };
  } else if (norm.includes("vgu") || norm.includes("vivekanand")) {
    logo = { src: "/logos/vgu.png", alt: "Vivekananda Global University Online" };
  } else if (norm.includes("andhra") || norm.includes("anu")) {
    logo = { src: "/logos/andhra.webp", alt: "Andhra University Online" };
  } else if (norm.includes("ccs") || norm.includes("chaudhary")) {
    logo = { src: "/logos/ccsu.png", alt: "Chaudhary Charan Singh University" };
  } else if (norm.includes("ddu") || norm.includes("deen") || norm.includes("gorakhpur")) {
    logo = { src: "/logos/ddu.png", alt: "DDU Gorakhpur University Online" };
  } else if (norm.includes("upes")) {
    logo = { src: "/logos/upes.png", alt: "UPES Online" };
  } else if (norm.includes("jindal") || norm.includes("opj")) {
    logo = { src: "/logos/opjindal.png", alt: "OP Jindal Global University" };
  }

  const containerHeight =
    size === "sm" ? "h-14 px-3" : size === "lg" ? "h-18 px-5" : "h-16 px-4";

  const imgMaxHeight =
    size === "sm" ? "max-h-9" : size === "lg" ? "max-h-12" : "max-h-10";

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
        className={`inline-flex items-center justify-center rounded-xl bg-white shadow-2xs border border-slate-200/80 transition-all duration-200 group-hover:border-primary/40 ${containerHeight} w-full max-w-[260px] overflow-hidden ${className}`}
      >
        <img
          src={logo.src}
          alt={logo.alt}
          className={`${imgMaxHeight} w-auto max-w-[90%] object-contain select-none transition-transform duration-200 group-hover:scale-105`}
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
