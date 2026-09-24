import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ACTIVE_ONLINE_UNIVERSITIES, 
  EXECUTIVE_PARTNERS, 
  INCLUDED_PARTNERS, 
  OFFLINE_UNIVERSITY,
  BOSSE_INSTITUTION,
  UniversityData
} from "@/data/universities";
import { UniversityLogo } from "@/components/UniversityLogo";
import { useLeadGate } from "@/context/LeadGateContext";
import { 
  Building2, 
  Search, 
  ShieldCheck, 
  GraduationCap, 
  ArrowRight, 
  MapPin, 
  Award,
  Filter,
  Layers
} from "lucide-react";

export const UniversitiesIndex = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMode, setFilterMode] = useState<string>("All");
  const navigate = useNavigate();
  const { requireContact } = useLeadGate();

  const handleUniClick = (slug: string, name: string) => {
    requireContact(() => {
      navigate(`/universities/${slug}`);
    }, name);
  };

  const allUniversities: UniversityData[] = [
    ...ACTIVE_ONLINE_UNIVERSITIES,
    ...EXECUTIVE_PARTNERS,
    ...INCLUDED_PARTNERS,
  ];

  const filtered = allUniversities.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.popularPrograms.some((p) => p.toLowerCase().includes(searchTerm.toLowerCase()));

    if (filterMode === "All") return matchesSearch;
    if (filterMode === "Online") return matchesSearch && u.mode.toLowerCase().includes("online");
    if (filterMode === "Executive") return matchesSearch && u.mode.toLowerCase().includes("executive");
    return matchesSearch;
  });

  return (
    <>
      <Helmet>
        <title>Accredited Universities Directory - Online Degrees & Partners | Degree Guru</title>
        <meta
          name="description"
          content="Browse UGC-DEB, AICTE & NAAC A++ accredited online universities. Compare fees, EMI plans, popular courses, and admission procedures across top Indian & global institutions."
        />
        <link rel="canonical" href="https://degreeguru.in/universities/" />
      </Helmet>

      <div className="container-dg py-8 md:py-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <ShieldCheck size={14} /> 100% Verified Accredited Institutions
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Best Online Universities
          </h1>
        </div>

        {/* Search & Tabs */}
        <div className="max-w-4xl mx-auto space-y-4 mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search universities by name, state, or course (e.g. Manipal, NMIMS, Amity, Online MBA)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {["All", "Online", "Executive"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setFilterMode(tab)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    filterMode === tab
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab} Institutions
                </button>
              ))}
            </div>

            <Link
              to="/universities/compare"
              className="px-3.5 py-1.5 rounded-lg bg-card border border-border text-xs font-bold text-foreground hover:bg-muted flex items-center gap-1.5 shadow-sm"
            >
              <Layers size={14} /> Compare Universities Side-by-Side
            </Link>
          </div>
        </div>

        {/* University Cards Grid - Compact & Sleek */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {filtered.map((uni) => (
            <div
              key={uni.id}
              className="p-4 sm:p-4.5 rounded-2xl bg-card border border-border/70 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[9px] font-extrabold uppercase tracking-wide">
                    {uni.mode === "Online Partner" ? "Online" : uni.mode}
                  </span>
                  <span className="text-[10px] font-semibold text-muted-foreground flex items-center gap-1">
                    <Award size={12} className="text-amber-500 shrink-0" /> {uni.accreditation}
                  </span>
                </div>

                <div className="flex items-start gap-3">
                  <div className="shrink-0 w-full flex items-center justify-center">
                    <UniversityLogo idOrSlug={uni.slug} size="sm" className="max-w-full w-full" />
                  </div>
                </div>

                <p className="text-[11px] text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                  {uni.overview}
                </p>

                {/* Popular courses */}
                <div className="mt-2.5 pt-2 border-t border-border/40">
                  <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Popular Online Programs:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {uni.popularPrograms.slice(0, 4).map((prog, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 rounded bg-muted text-[9px] font-medium text-foreground/80">
                        {prog}
                      </span>
                    ))}
                    {uni.popularPrograms.length > 4 && (
                      <span className="px-1.5 py-0.5 rounded bg-muted/60 text-[9px] font-medium text-muted-foreground">
                        +{uni.popularPrograms.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-2.5 border-t border-border/40 flex items-center justify-between">
                <div>
                  <span className="text-[9px] text-muted-foreground block">Fee Starts At</span>
                  <div className="text-xs font-extrabold text-foreground">{uni.feesRange.split(" - ")[0]}</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleUniClick(uni.slug, uni.name)}
                  className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                >
                  <span>View</span> <ArrowRight size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Separated Offline University Section (Prompt Rule #18) */}
        <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-card to-card border border-amber-500/30">
          <div className="max-w-3xl">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-xs font-bold uppercase">
              Offline Campus Education
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-3">
              M.K. University, Patan — Offline Campus Programs
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2 leading-relaxed">
              Degree Guru maintains a dedicated offline university relationship for students seeking traditional classroom on-campus learning in Patan, Gujarat. This option is strictly separated from online degree programs.
            </p>
            <div className="pt-4">
              <Link
                to="/offline-courses"
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs sm:text-sm inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                Explore M.K. University Offline Courses <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default UniversitiesIndex;
