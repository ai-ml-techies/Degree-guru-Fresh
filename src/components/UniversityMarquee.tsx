import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Award } from "lucide-react";
import { UniversityLogo } from "@/components/UniversityLogo";
import { useLeadGate } from "@/context/LeadGateContext";

interface UniversityTickerItem {
  id: string;
  name: string;
  slug: string;
  tagline: string;
}

const ROW_1: UniversityTickerItem[] = [
  { id: "manipal", name: "Manipal University Jaipur", slug: "manipal-university-jaipur-online", tagline: "NAAC A+ • UGC-DEB • WES" },
  { id: "amity", name: "Amity University Online", slug: "amity-university-online", tagline: "QS Top Ranked • NAAC A+" },
  { id: "nmims", name: "NMIMS Global Access", slug: "nmims-online", tagline: "Category-1 Autonomy • SVKM" },
  { id: "alliance", name: "Alliance University Online", slug: "alliance-university-online", tagline: "AACSB Member • NIRF Top 100" },
  { id: "lpu", name: "Lovely Professional University", slug: "lpu-online", tagline: "NIRF Top 50 • NAAC A++" },
  { id: "cu", name: "Chandigarh University", slug: "chandigarh-university-online", tagline: "NAAC A+ • QS Ranked" },
  { id: "shoolini", name: "Shoolini University Online", slug: "universities", tagline: "THE World Ranked • NAAC A+" },
  { id: "vit", name: "VIT Online", slug: "universities", tagline: "NAAC A++ • NIRF Top 10" },
];

const ROW_2: UniversityTickerItem[] = [
  { id: "dpu", name: "Dr. D.Y. Patil Vidyapeeth", slug: "dy-patil-university-online", tagline: "NAAC A++ • NIRF Ranked" },
  { id: "bennett", name: "Bennett University", slug: "bennett-university-online", tagline: "Times Group • AICTE" },
  { id: "sharda", name: "Sharda University", slug: "sharda-university-online", tagline: "NAAC A+ • Global Alumni" },
  { id: "parul", name: "Parul University", slug: "parul-university-online", tagline: "NAAC A++ • 100+ Hiring" },
  { id: "amrita", name: "Amrita Ahead", slug: "amrita-ahead-online", tagline: "NIRF Top 10 • Grade A++" },
  { id: "vgu", name: "Vivekananda Global University", slug: "universities", tagline: "NAAC A+ • UGC Approved" },
  { id: "smu", name: "Sikkim Manipal University", slug: "universities", tagline: "UGC-DEB • Pioneer in Distance" },
  { id: "uttaranchal", name: "Uttaranchal University", slug: "uttaranchal-university-online", tagline: "NAAC A+ • UGC Entitled" },
];

export const UniversityMarquee = () => {
  const navigate = useNavigate();
  const { requireContact } = useLeadGate();

  const handleUniversityClick = (e: React.MouseEvent, slug: string, name: string) => {
    e.preventDefault();
    // Non-mandatory removable popup for university browsing
    requireContact(
      () => {
        navigate(slug === "universities" ? "/universities" : `/universities/${slug}`);
      },
      name,
      false // removable popup!
    );
  };

  return (
    <section className="py-12 md:py-16 overflow-hidden relative border-y border-border/40 bg-card/30">
      {/* Soft Ambient Background Glow */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-full pointer-events-none opacity-40 dark:opacity-20"
        style={{
          background: "radial-gradient(ellipse at center, hsl(var(--primary) / 0.12), transparent 70%)",
        }}
      />

      <div className="container-dg mb-8 text-center max-w-2xl">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
          <ShieldCheck size={14} /> 50+ UGC-DEB & AICTE Approved Institutions
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-foreground">
          Top UGC-Recognized Universities
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">
          Explore authentic degrees, syllabus, and transparent fee structures from India's highest-accredited universities.
        </p>
      </div>

      <div className="space-y-4 relative">
        {/* Left & Right gradient edge masks for seamless entry/exit */}
        <div className="absolute inset-y-0 left-0 w-24 sm:w-40 z-10 pointer-events-none bg-gradient-to-r from-background via-background/80 to-transparent" />
        <div className="absolute inset-y-0 right-0 w-24 sm:w-40 z-10 pointer-events-none bg-gradient-to-l from-background via-background/80 to-transparent" />

        {/* Row 1: Smooth Hardware-Accelerated Infinite Scrolling */}
        <div className="overflow-hidden">
          <div className="marquee">
            {[...ROW_1, ...ROW_1].map((u, i) => (
              <a
                key={`logo-r1-${u.id}-${i}`}
                href={u.slug === "universities" ? "/universities" : `/universities/${u.slug}`}
                onClick={(e) => handleUniversityClick(e, u.slug, u.name)}
                className="marquee-pill group inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-card border border-border/70 hover:border-primary/60 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <div className="shrink-0">
                  <UniversityLogo idOrSlug={u.id} size="md" />
                </div>
                <div className="h-6 w-px bg-border/60" />
                <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  {u.tagline}
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Row 2: Reverse Direction */}
        <div className="overflow-hidden">
          <div className="marquee marquee-reverse">
            {[...ROW_2, ...ROW_2].map((u, i) => (
              <a
                key={`logo-r2-${u.id}-${i}`}
                href={`/universities/${u.slug}`}
                onClick={(e) => handleUniversityClick(e, u.slug, u.name)}
                className="marquee-pill group inline-flex items-center gap-4 px-6 py-3 rounded-2xl bg-card border border-border/70 hover:border-primary/60 shadow-sm whitespace-nowrap cursor-pointer"
              >
                <div className="shrink-0">
                  <UniversityLogo idOrSlug={u.id} size="md" />
                </div>
                <div className="h-6 w-px bg-border/60" />
                <span className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors">
                  {u.tagline}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UniversityMarquee;
