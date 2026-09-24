import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { UniversityLogo } from "@/components/UniversityLogo";
import { useLeadGate } from "@/context/LeadGateContext";

export interface UniversityShowcaseItem {
  id: string;
  name: string;
  coursesCount: number;
  location: string;
  slug: string;
}

const TOP_UNIVERSITIES: UniversityShowcaseItem[] = [
  {
    id: "amity",
    name: "Amity University Online",
    coursesCount: 14,
    location: "Noida, Uttar Pradesh",
    slug: "amity-university-online",
  },
  {
    id: "manipal",
    name: "Online Manipal (MUJ)",
    coursesCount: 12,
    location: "Jaipur, Rajasthan",
    slug: "manipal-university-jaipur-online",
  },
  {
    id: "dpu",
    name: "DPU Centre for Online Learning",
    coursesCount: 7,
    location: "Pune, Maharashtra",
    slug: "dy-patil-university-online",
  },
  {
    id: "shoolini",
    name: "Shoolini University Online",
    coursesCount: 12,
    location: "Solan, Himachal Pradesh",
    slug: "universities",
  },
  {
    id: "cu",
    name: "Chandigarh University Online",
    coursesCount: 12,
    location: "Ludhiana, Punjab",
    slug: "chandigarh-university-online",
  },
  {
    id: "lpu",
    name: "LPU Online",
    coursesCount: 13,
    location: "Jalandhar, Punjab",
    slug: "lpu-online",
  },
  {
    id: "nmims",
    name: "SVKM's NMIMS Global Online",
    coursesCount: 6,
    location: "Mumbai, Maharashtra",
    slug: "nmims-online",
  },
  {
    id: "jain",
    name: "Jain University Online",
    coursesCount: 10,
    location: "Bengaluru, Karnataka",
    slug: "universities",
  },
  {
    id: "amrita",
    name: "Amrita Ahead Online",
    coursesCount: 8,
    location: "Coimbatore, Tamil Nadu",
    slug: "amrita-ahead-online",
  },
  {
    id: "gla",
    name: "GLA University Online",
    coursesCount: 10,
    location: "Mathura, Uttar Pradesh",
    slug: "gla-university-online",
  },
  {
    id: "uttaranchal",
    name: "Uttaranchal University Online",
    coursesCount: 6,
    location: "Dehradun, Uttarakhand",
    slug: "uttaranchal-university-online",
  },
  {
    id: "manipal",
    name: "Sikkim Manipal University Online",
    coursesCount: 8,
    location: "Gangtok, Sikkim",
    slug: "universities",
  },
];

export const UniversitiesGridShowcase: React.FC = () => {
  const navigate = useNavigate();
  const { requireContact } = useLeadGate();

  const handleCardClick = (e: React.MouseEvent, u: UniversityShowcaseItem) => {
    e.preventDefault();
    // For universities: non-mandatory / removable popup as requested by user
    requireContact(
      () => {
        navigate(u.slug === "universities" ? "/universities" : `/universities/${u.slug}`);
      },
      u.name,
      false // removable popup!
    );
  };

  return (
    <section className="py-16 md:py-20 border-b border-border/50 bg-background">
      <div className="container-dg space-y-10">
        {/* Header matching Screenshot 3 */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#6528f7]/10 text-primary text-xs font-bold">
            <span role="img" aria-label="university">🏫</span> 100+ Online Universities
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Find Best <span className="text-primary">Online Degree Universities</span>
          </h2>
        </div>

        {/* 6-column grid on desktop, 3-col on tablet, 2-col on mobile */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {TOP_UNIVERSITIES.map((u) => (
            <a
              key={u.id}
              href={u.slug === "universities" ? "/universities" : `/universities/${u.slug}`}
              onClick={(e) => handleCardClick(e, u)}
              className="group flex flex-col items-center justify-between text-center p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer min-h-[190px] relative hover:-translate-y-0.5"
            >
              {/* Logo Area */}
              <div className="w-full h-14 flex items-center justify-center p-1">
                <UniversityLogo idOrSlug={u.id} size="md" />
              </div>

              {/* Course Count & Name */}
              <div className="space-y-1 w-full my-auto">
                <span className="text-xs font-extrabold text-foreground block tracking-tight">
                  {u.coursesCount} Courses
                </span>
                <h3 className="text-[11px] font-semibold text-muted-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight px-1">
                  {u.name}
                </h3>
              </div>

              {/* Location with Pin */}
              <div className="pt-2 border-t border-border/40 w-full flex items-center justify-center gap-1 text-[10px] text-muted-foreground font-medium truncate">
                <MapPin size={11} className="text-primary shrink-0" />
                <span className="truncate">{u.location}</span>
              </div>
            </a>
          ))}
        </div>

        {/* View More Universities CTA */}
        <div className="text-center pt-2">
          <Link
            to="/universities"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#6528f7]/10 hover:bg-[#6528f7]/20 text-primary font-extrabold text-xs tracking-wider uppercase transition-colors"
          >
            VIEW MORE UNIVERSITIES <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
};
export default UniversitiesGridShowcase;
