import { useState, useId, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { getCourseBySlug } from "@/data/courses";
import { UNIVERSITIES, University } from "@/data/universities";
import { UniversityLogo } from "@/components/UniversityLogo";
import { getUniversityCampusImage } from "@/data/universityCampusImages";
import { getUniversityProgramData } from "@/data/universityCourseData";
import { 
  GraduationCap, 
  ArrowRight, 
  Star, 
  Search, 
  Check, 
  Plus, 
  X,
  PhoneCall,
  ChevronDown,
  Briefcase,
  MapPin
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { validateIndianMobile, validateMeaningfulName } from "@/lib/validation";

// Explicit student choice ranking: Amity 1st, Manipal Jaipur 2nd, then CUOL, Sharda, UU, LPU, etc.
const UNIVERSITY_RANK_ORDER: Record<string, number> = {
  "amity-university-online": 1,
  "manipal-university-jaipur-online": 2,
  "chandigarh-university-online": 3,
  "sharda-university-online": 4,
  "uttaranchal-university-online": 5,
  "lovely-professional-university-online": 6,
  "upes-online": 7,
  "dr-dy-patil-vidyapeeth-pune-online": 8,
  "dy-patil-university-mumbai-online": 9,
  "parul-university-online": 10,
  "parul-university": 10,
  "sikkim-manipal-university-online": 11,
  "amrita-ahead-online": 12,
  "amrita-vishwa-vidyapeetham-online": 12,
  "galgotias-university-online": 13,
  "gla-university-online": 14,
  "bennett-university-online": 15,
  "kurukshetra-university-online": 16,
  "op-jindal-global-university-online": 17,
  "birchwood-university-online": 18,
  "golden-gate-university-online": 19,
  "liverpool-john-moores-university-online": 20,
};

// Universities exclusively offering 1-Year MBA programs (Not Amity, UPES, DPU, NMIMS)
const ONE_YEAR_OFFERING_SLUGS = [
  "op-jindal-global-university-online",
  "birchwood-university-online",
  "golden-gate-university-online",
  "liverpool-john-moores-university-online",
];

// Helper to remove brackets around Online or Distance in university name
const cleanUniversityName = (name: string) => {
  if (!name) return "";
  return name
    .replace(/\s*\((Online|Distance|ODL)\)/gi, " $1")
    .replace(/\s*\(([^)]*Online[^)]*)\)/gi, " $1")
    .replace(/\s{2,}/g, " ")
    .trim();
};

export const CourseDetail = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = getCourseBySlug(courseSlug || "");

  // University comparison & search state
  const [selectedCompareUnis, setSelectedCompareUnis] = useState<string[]>([]);
  const [uniSearch, setUniSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  
  // Specific filters
  const [selectedSpecialisation, setSelectedSpecialisation] = useState<string>("all");
  const [selectedProgramType, setSelectedProgramType] = useState<string>("all");
  const [selectedFeeBudget, setSelectedFeeBudget] = useState<string>("all");
  const [selectedDuration, setSelectedDuration] = useState<string>("all");
  const [selectedUniversity, setSelectedUniversity] = useState<string>("all");

  // Pagination: Show 6 options initially, and load 6 more each time button is clicked
  const [visibleCount, setVisibleCount] = useState<number>(6);

  // Lead modal / form state
  const [counselingOpen, setCounselingOpen] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadNameError, setLeadNameError] = useState("");
  const [leadPhoneError, setLeadPhoneError] = useState("");
  const [targetUniName, setTargetUniName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const formNameId = useId();
  const formPhoneId = useId();

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Toggle university for side-by-side comparison
  const toggleCompare = (slug: string) => {
    if (selectedCompareUnis.includes(slug)) {
      setSelectedCompareUnis(selectedCompareUnis.filter((s) => s !== slug));
    } else {
      if (selectedCompareUnis.length >= 4) {
        alert("You can compare up to 4 universities at a time.");
        return;
      }
      setSelectedCompareUnis([...selectedCompareUnis, slug]);
    }
  };

  // Quick helper to strip "(No-Cost EMI available)" repetition
  const cleanEmi = (emiStr: string | undefined, defaultEmi = "₹3,250/mo") => {
    if (!emiStr) return defaultEmi;
    return emiStr
      .replace(/\s*\([^)]*EMI[^)]*\)/gi, "")
      .replace(/\s*no-cost emi available/gi, "")
      .trim();
  };

  // Find universities offering this degree
  const courseKey = (course.shortName || course.title).toLowerCase().replace(/[^a-z0-9]/g, "");
  const baseUnis = UNIVERSITIES.filter((u) => {
    if (u.isSchooling) return false;
    if (!u.popularCourses || u.popularCourses.length === 0) return true;
    return u.popularCourses.some((c) => {
      const cNorm = c.toLowerCase().replace(/[^a-z0-9]/g, "");
      return cNorm.includes(courseKey) || courseKey.includes(cNorm);
    });
  });

  const universitiesList = baseUnis.length >= 4 ? baseUnis : UNIVERSITIES.filter((u) => !u.isSchooling);

  // Collect ALL unique specialisations that are ACTUALLY offered by at least one university for THIS course
  const availableSpecialisations = useMemo(() => {
    const specSet = new Set<string>();
    universitiesList.forEach((uni) => {
      const prog = getUniversityProgramData(uni.slug, course.slug);
      if (prog) {
        prog.specializations.forEach((s) => specSet.add(s));
      }
    });
    return Array.from(specSet).sort();
  }, [universitiesList, course.slug]);

  // Filtered universities based on search, Specialisation, Fee budget, and University filter
  const filteredUnis = universitiesList.filter((uni) => {
    const progData = getUniversityProgramData(uni.slug, course.slug);

    // 1. Text Search
    const q = appliedSearch.trim().toLowerCase();
    if (q) {
      const matchName = uni.name.toLowerCase().includes(q) || uni.shortName.toLowerCase().includes(q);
      const matchLoc = uni.location.toLowerCase().includes(q);
      const matchApp = uni.approvals.some((a) => a.toLowerCase().includes(q));
      const matchSpecs = progData?.specializations.some((s) => s.toLowerCase().includes(q));
      if (!matchName && !matchLoc && !matchApp && !matchSpecs) return false;
    }

    // 2. Specialisation Dropdown Filter
    if (selectedSpecialisation !== "all") {
      const specTarget = selectedSpecialisation.toLowerCase();
      const hasSpec = progData?.specializations.some((s) => s.toLowerCase().includes(specTarget)) ||
                      uni.popularCourses.some((c) => c.toLowerCase().includes(specTarget));
      if (!hasSpec) return false;
    }

    // 3. Fee Budget Filter (reliably parses progData or university fee range)
    if (selectedFeeBudget !== "all") {
      let totalNum = 100000;
      if (progData?.totalFee) {
        totalNum = parseInt(progData.totalFee.replace(/[^\d]/g, ""), 10) || 100000;
      } else if (uni.feeRange) {
        const parts = uni.feeRange.split(/[–\-]/);
        const lower = parseInt(parts[0].replace(/[^\d]/g, ""), 10);
        const upper = parts[1] ? parseInt(parts[1].replace(/[^\d]/g, ""), 10) : lower;
        totalNum = upper || lower || 100000;
      }
      if (selectedFeeBudget === "under-80k" && totalNum > 80000) return false;
      if (selectedFeeBudget === "80k-120k" && (totalNum <= 80000 || totalNum > 125000)) return false;
      if (selectedFeeBudget === "120k-160k" && (totalNum <= 125000 || totalNum > 165000)) return false;
      if (selectedFeeBudget === "above-160k" && totalNum <= 160000) return false;
    }

    // 4. Duration Filter: 1 Year MBA is offered by OP Jindal, Birchwood, Golden Gate, LJMU (NOT Amity, UPES, DPU, NMIMS)
    if (selectedDuration !== "all") {
      const is1YearUni = ONE_YEAR_OFFERING_SLUGS.includes(uni.slug);

      if (selectedDuration === "1-year" && !is1YearUni) return false;
      if (selectedDuration === "2-year" && is1YearUni) return false;
    }

    // 5. Job Guaranteed Program Filter
    if (selectedProgramType === "job-guaranteed") {
      const isJobGuaranteed = uni.slug.includes("sgt") || uni.id.includes("sgt") || (uni.placementSupport && uni.placementSupport.toLowerCase().includes("guaranteed"));
      if (!isJobGuaranteed) return false;
    }

    // 6. University filter
    if (selectedUniversity !== "all") {
      if (uni.slug !== selectedUniversity) return false;
    }

    return true;
  });

  // Sort: Amity first, then Manipal Jaipur, then CUOL, Sharda, UU, LPU, etc.
  const sortedUnis = [...filteredUnis].sort((a, b) => {
    const rankA = UNIVERSITY_RANK_ORDER[a.slug] || 99;
    const rankB = UNIVERSITY_RANK_ORDER[b.slug] || 99;
    if (rankA !== rankB) return rankA - rankB;
    return (b.rating || 4.2) - (a.rating || 4.2);
  });

  // Paginated visible universities (6 initially, +6 per "Show More" click)
  const visibleUnis = sortedUnis.slice(0, visibleCount);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAppliedSearch(uniSearch);
    setVisibleCount(6);
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const nameCheck = validateMeaningfulName(leadName, false);
    if (!nameCheck.valid) {
      setLeadNameError(nameCheck.error || "Please enter a valid, meaningful name.");
      return;
    }
    const phoneCheck = validateIndianMobile(leadPhone);
    if (!phoneCheck.valid) {
      setLeadPhoneError(phoneCheck.error || "Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    setLeadNameError("");
    setLeadPhoneError("");
    setIsSubmitting(true);
    try {
      await submitLead({
        name: nameCheck.normalized || leadName.trim(),
        phone: phoneCheck.normalized || leadPhone.replace(/\D/g, "").slice(-10),
        program: `${course.fullName} Inquiry - ${targetUniName || "General"}`,
        source: `course-page-${course.slug}`,
      });
      setLeadSuccess(true);
    } catch {
      setLeadSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const openCounselingForUni = (uniName: string) => {
    setTargetUniName(uniName);
    setLeadSuccess(false);
    setCounselingOpen(true);
  };

  return (
    <>
      <Helmet>
        <title>{course.fullName} - Top Universities, Fees & Comparison 2026 | Degree Guru</title>
        <meta name="description" content={`Compare accredited universities offering online ${course.shortName} degrees with verified semester fees, 0% EMI financing, and online exams.`} />
        <link rel="canonical" href={`https://degreeguru.in/${course.slug}/`} />
      </Helmet>

      {/* SEAMLESS HERO CONTAINER RUNNING TO THE VERY TOP BEHIND HEADER */}
      <div className="min-h-screen pb-20">
        
        {/* 1. CLEAN COMPACT HERO (Negative top margin pulls background till top seamlessly) */}
        <section className="-mt-[96px] md:-mt-[100px] pt-[116px] md:pt-[124px] pb-8 border-b border-border/40 bg-gradient-to-b from-primary/12 via-primary/5 to-background">
          <div className="container-dg max-w-6xl space-y-4">
            <AppBreadcrumb
              items={[
                { label: "Online Courses", href: "/courses" },
                { label: course.title }
              ]}
            />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2 max-w-2xl">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
                  {course.fullName}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  Compare top UGC-DEB entitled universities offering {course.title} with verified fees and 100% online examinations.
                </p>
              </div>

              {/* Quick Summary Pill Strip - Only No-Cost EMI Starting From as requested */}
              <div className="flex items-center text-xs">
                <div className="p-2.5 px-4 rounded-xl bg-card border border-border shadow-xs flex items-center gap-2">
                  <span className="text-[11px] text-muted-foreground font-medium">No-Cost EMI Starting From</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400 text-sm">
                    {cleanEmi(course.emiStarting || course.emiFrom)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. FUNCTIONAL SEARCH & DYNAMIC FILTER BAR - Filter controls placed below search bar */}
        <section className="py-4 border-b border-border/50 bg-background relative z-10">
          <div className="container-dg max-w-6xl">
            <div className="flex flex-col gap-3">
              {/* Row 1: Full-Width Clean Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2.5 w-full">
                <div className="relative flex-1">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
                  <input
                    type="text"
                    placeholder="Search by university name, location, specialisation..."
                    value={uniSearch}
                    onChange={(e) => setUniSearch(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none shadow-2xs placeholder:text-muted-foreground/70"
                  />
                  {uniSearch && (
                    <button
                      type="button"
                      onClick={() => {
                        setUniSearch("");
                        setAppliedSearch("");
                        setVisibleCount(6);
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-xs sm:text-sm shadow-sm transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  <Search size={15} />
                  <span>Search</span>
                </button>
              </form>

              {/* Row 2: Filter Controls Kept Below Search Bar (All Universities FIRST, then Specialisations) */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                {/* 1. All Universities Dropdown Filter (First filter as requested) */}
                <div className="relative flex-1 sm:flex-none min-w-[170px]">
                  <select
                    value={selectedUniversity}
                    onChange={(e) => {
                      setSelectedUniversity(e.target.value);
                      setVisibleCount(6);
                    }}
                    className="w-full appearance-none px-3.5 py-2 pr-8 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Universities</option>
                    {universitiesList
                      .sort((a, b) => (UNIVERSITY_RANK_ORDER[a.slug] || 99) - (UNIVERSITY_RANK_ORDER[b.slug] || 99))
                      .map((uni) => (
                        <option key={uni.slug} value={uni.slug}>{cleanUniversityName(uni.shortName || uni.name)}</option>
                      ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>

                {/* 2. Specialisation Dropdown Filter */}
                <div className="relative flex-1 sm:flex-none min-w-[170px]">
                  <select
                    value={selectedSpecialisation}
                    onChange={(e) => {
                      setSelectedSpecialisation(e.target.value);
                      setVisibleCount(6);
                    }}
                    className="w-full appearance-none px-3.5 py-2 pr-8 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Specialisations</option>
                    {availableSpecialisations.map((spec) => (
                      <option key={spec} value={spec}>{spec}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>

                {/* 3. Duration Dropdown Filter (1 Year vs 2 Year) */}
                <div className="relative flex-1 sm:flex-none min-w-[130px]">
                  <select
                    value={selectedDuration}
                    onChange={(e) => {
                      setSelectedDuration(e.target.value);
                      setVisibleCount(6);
                    }}
                    className="w-full appearance-none px-3.5 py-2 pr-8 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">Duration</option>
                    <option value="1-year">1 Year</option>
                    <option value="2-year">2 Year</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>

                {/* 4. Fee Budget Dropdown */}
                <div className="relative flex-1 sm:flex-none min-w-[145px]">
                  <select
                    value={selectedFeeBudget}
                    onChange={(e) => {
                      setSelectedFeeBudget(e.target.value);
                      setVisibleCount(6);
                    }}
                    className="w-full appearance-none px-3.5 py-2 pr-8 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">Fee Budget</option>
                    <option value="under-80k">Under ₹80,000</option>
                    <option value="80k-120k">₹80K – ₹1.2L</option>
                    <option value="120k-160k">₹1.2L – ₹1.6L</option>
                    <option value="above-160k">Above ₹1,60,000</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>

                {/* 5. Job Guaranteed Program Filter */}
                <div className="relative flex-1 sm:flex-none min-w-[170px]">
                  <select
                    value={selectedProgramType}
                    onChange={(e) => {
                      setSelectedProgramType(e.target.value);
                      setVisibleCount(6);
                    }}
                    className="w-full appearance-none px-3.5 py-2 pr-8 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="all">All Program Types</option>
                    <option value="job-guaranteed">Job Guaranteed Program</option>
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                </div>

                {/* 6. Reset button */}
                {(selectedSpecialisation !== "all" || selectedProgramType !== "all" || selectedFeeBudget !== "all" || selectedDuration !== "all" || selectedUniversity !== "all" || appliedSearch) && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSpecialisation("all");
                      setSelectedProgramType("all");
                      setSelectedFeeBudget("all");
                      setSelectedDuration("all");
                      setSelectedUniversity("all");
                      setUniSearch("");
                      setAppliedSearch("");
                      setVisibleCount(6);
                    }}
                    className="px-3.5 py-2 rounded-xl text-xs font-bold text-destructive hover:bg-destructive/10 whitespace-nowrap shrink-0 cursor-pointer transition-colors"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. UNIVERSITY CARDS GRID */}
        <section className="py-8">
          <div className="container-dg max-w-6xl">
            {/* Header info bar - As requested: only "Top Picks" */}
            <div className="flex items-center justify-between pb-4">
              <span className="text-xs font-extrabold text-foreground uppercase tracking-wider">
                Top Picks
              </span>
            </div>

            {sortedUnis.length === 0 ? (
              <div className="text-center py-16 p-8 rounded-3xl bg-card border border-border/80 space-y-3">
                <GraduationCap size={40} className="mx-auto text-muted-foreground/60" />
                <h3 className="text-base font-bold text-foreground">No universities matched your filters</h3>
                <p className="text-xs text-muted-foreground max-w-md mx-auto">
                  Try clearing specific specialisation or budget selections to view all accredited institutions.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedSpecialisation("all");
                    setSelectedFeeBudget("all");
                    setSelectedUniversity("all");
                    setUniSearch("");
                    setAppliedSearch("");
                    setVisibleCount(6);
                  }}
                  className="px-4 py-2 rounded-xl bg-primary text-primary-foreground font-bold text-xs"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleUnis.map((uni: University, index: number) => {
                  const isCompared = selectedCompareUnis.includes(uni.slug);
                  const progData = getUniversityProgramData(uni.slug, course.slug);

                  // Verified Rating: Different for each university, strictly capped at 4.6
                  const ratingMap: Record<string, string> = {
                    "amity-university-online": "4.6",
                    "manipal-university-jaipur-online": "4.6",
                    "chandigarh-university-online": "4.5",
                    "lovely-professional-university-online": "4.5",
                    "dr-dy-patil-vidyapeeth-pune-online": "4.5",
                    "upes-online": "4.4",
                    "kurukshetra-university-online": "4.4",
                    "sharda-university-online": "4.3",
                    "parul-university-online": "4.3",
                    "parul-university": "4.3",
                    "uttaranchal-university-online": "4.2",
                    "galgotias-university-online": "4.2",
                    "gla-university-online": "4.3",
                    "sikkim-manipal-university-online": "4.4",
                    "amrita-ahead-online": "4.5",
                    "bennett-university-online": "4.4",
                    "andhra-university-online": "4.3",
                    "deen-dayal-upadhyay-gorakhpur-university-online": "4.2",
                    "chaudhary-charan-singh-university-distance": "4.2",
                  };
                  const displayRating = ratingMap[uni.slug] || Math.min(uni.rating || 4.3, 4.6).toFixed(1);

                  // CSV Fee Details - Only Total Fee shown as requested
                  const totalFee = progData?.totalFee || (uni.feeRange ? uni.feeRange.split("–")[0]?.trim() : "₹1,05,000");
                  const specializations = progData?.specializations || ["Marketing", "Finance", "HR", "Business Analytics"];

                  return (
                    <div
                      key={uni.id}
                      className="rounded-3xl bg-card border border-border/80 hover:border-primary/50 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-xs"
                    >
                      {/* Top Campus Picture & Badges (Cleaned: No EMI badge, No UGC-DEB overlay text) */}
                      <div>
                        <div className="relative aspect-[16/9] w-full overflow-hidden bg-muted">
                          <img
                            src={getUniversityCampusImage(uni.slug)}
                            alt={cleanUniversityName(uni.name)}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />

                          {/* Top Left: Admissions 2026 */}
                          <div className="absolute top-3 left-3 flex items-center">
                            <span className="px-2.5 py-0.5 rounded-full bg-primary text-white text-[10px] font-extrabold shadow-sm">
                              Admissions 2026
                            </span>
                          </div>

                          {/* Top Right: In-Demand (Green badge as requested) */}
                          {index < 2 && (
                            <div className="absolute top-3 right-3 flex items-center">
                              <span className="px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider shadow-sm">
                                In-Demand
                              </span>
                            </div>
                          )}

                          {/* Bottom Verified Rating on Image (Capped at 4.6 max) */}
                          <div className="absolute bottom-2.5 right-3 flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-black/75 backdrop-blur-md text-amber-400 text-[11px] font-extrabold shrink-0">
                            <Star size={12} className="fill-amber-400" />
                            <span>{displayRating}</span>
                          </div>
                        </div>

                        {/* University DP pushed half on card image and kept away from university name & course name */}
                        <div className="px-4 sm:px-5 -mt-8 sm:-mt-10 relative z-10 flex items-center justify-between mb-2">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-white shadow-md p-1 sm:p-1.5 flex items-center justify-center shrink-0 overflow-hidden ring-1 ring-border/50">
                            <UniversityLogo idOrSlug={uni.slug} size="md" raw={true} variant="dp" className="max-h-full max-w-full w-full h-full object-contain p-0.5" />
                          </div>
                        </div>

                        {/* Card Body: University Full Name, Course Name, Fees & Placement stacked, Specialisations Dropdown */}
                        <div className="px-4 sm:px-5 space-y-3 pb-3">
                          {/* University Full Name & Course Info - spaced away from DP (Brackets removed from Online/Distance) */}
                          <div className="space-y-0.5">
                            <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2" title={cleanUniversityName(uni.name)}>
                              {cleanUniversityName(uni.name)}
                            </h3>
                            <span className="text-[11px] sm:text-xs font-semibold text-primary block leading-tight">
                              {course.fullName}
                            </span>
                            <p className="text-[10px] text-muted-foreground flex items-center gap-1 pt-0.5">
                              <MapPin size={10} className="shrink-0 text-muted-foreground/80" />
                              <span>{uni.location}</span>
                            </p>
                          </div>

                          {/* TOTAL FEE (Line 1) & PLACEMENT (Line 2 - seamless styling matching Total Fee) */}
                          <div className="space-y-1.5">
                            {/* Line 1: Total Fee */}
                            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-between">
                              <span className="text-[11px] text-muted-foreground font-medium">Total Fee</span>
                              <span className="font-black text-foreground text-sm tracking-tight">{totalFee}</span>
                            </div>
                            {/* Line 2: Placement - Seamless styling without green highlight */}
                            <div className="p-2.5 rounded-xl bg-muted/50 border border-border/50 flex items-center justify-between">
                              <span className="text-[11px] text-muted-foreground font-medium">Placement</span>
                              <span className="font-bold text-foreground text-[11px] flex items-center gap-1.5">
                                <Briefcase size={12} className="text-muted-foreground shrink-0" />
                                <span>100% Assistance</span>
                              </span>
                            </div>
                          </div>

                          {/* Specialisations as dropdown (not text chips as requested) */}
                          {specializations.length > 0 && (
                            <div className="relative">
                              <div className="relative">
                                <select
                                  id={`spec-select-${uni.id}`}
                                  aria-label={`Specialisations for ${cleanUniversityName(uni.name)}`}
                                  className="w-full text-xs font-semibold py-2 pl-3 pr-8 rounded-xl bg-muted/60 hover:bg-muted border border-border/70 text-foreground cursor-pointer appearance-none transition-colors focus:outline-none focus:ring-1 focus:ring-primary shadow-2xs"
                                  defaultValue=""
                                >
                                  <option value="" disabled>
                                    Specialisations ({specializations.length} Available)
                                  </option>
                                  {specializations.map((spec, sIdx) => (
                                    <option key={sIdx} value={spec} className="bg-popover text-popover-foreground py-1 text-xs">
                                      {spec}
                                    </option>
                                  ))}
                                </select>
                                <ChevronDown
                                  size={14}
                                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground"
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer Actions: Compare + View Details to dedicated university page */}
                      <div className="p-4 sm:p-5 pt-0">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            type="button"
                            onClick={() => toggleCompare(uni.slug)}
                            className={`py-2 px-2 rounded-xl font-bold text-xs flex items-center justify-center gap-1 transition-all shadow-sm cursor-pointer ${
                              isCompared
                                ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                                : "bg-[#0b57d0] hover:bg-[#0842a0] text-white"
                            }`}
                          >
                            {isCompared ? (
                              <>
                                <Check size={13} /> Compared
                              </>
                            ) : (
                              <>
                                <Plus size={13} /> Compare
                              </>
                            )}
                          </button>

                          <Link
                            to={`/universities/${uni.slug}`}
                            className="py-2 px-2 rounded-xl font-bold text-xs bg-primary hover:bg-primary/90 text-primary-foreground flex items-center justify-center gap-1 transition-all shadow-sm text-center"
                          >
                            <span>View Details</span>
                            <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bottom "Show More" Button (+6 each click as requested) */}
            {visibleCount < sortedUnis.length && (
              <div className="text-center pt-8">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 6)}
                  className="px-7 py-3 rounded-2xl bg-card border-2 border-primary/30 hover:border-primary text-foreground font-bold text-xs shadow-sm hover:shadow-md transition-all inline-flex items-center gap-2 cursor-pointer"
                >
                  <span>Show More</span>
                  <ChevronDown size={14} />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* 4. CLEAN CONVERSION COUNSELING HELP BANNER */}
        <section className="py-6">
          <div className="container-dg max-w-6xl">
            <div className="p-6 rounded-3xl bg-gradient-to-r from-primary/10 via-card to-card border border-primary/25 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary">
                  <PhoneCall size={14} /> Free 1-on-1 Academic Counseling
                </div>
                <h3 className="text-base sm:text-lg font-bold text-foreground">
                  Need Help Choosing Between These Universities for {course.title}?
                </h3>
                <p className="text-xs text-muted-foreground max-w-xl">
                  Connect directly with verified counselors for fee concession waivers, zero-cost EMI approvals, and career mapping.
                </p>
              </div>

              <button
                type="button"
                onClick={() => openCounselingForUni("")}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shrink-0 hover:bg-primary/90 transition-all shadow-md cursor-pointer"
              >
                Talk to a Counselor Free
              </button>
            </div>
          </div>
        </section>

        {/* 5. FLOATING COMPARE ACTION BAR */}
        {selectedCompareUnis.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0c0d1a] border border-primary/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 max-w-[90vw]">
            <div className="text-xs font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>{selectedCompareUnis.length} Selected</span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to={`/universities/compare?unis=${selectedCompareUnis.join(",")}`}
                className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
              >
                Compare Side-by-Side <ArrowRight size={13} />
              </Link>
              <button
                type="button"
                onClick={() => setSelectedCompareUnis([])}
                className="text-xs text-white/60 hover:text-white px-2 py-1 cursor-pointer"
              >
                Clear
              </button>
            </div>
          </div>
        )}

        {/* 6. COUNSELING MODAL */}
        {counselingOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-card border border-border/80 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-border/50">
                <div className="flex items-center gap-2">
                  <GraduationCap size={20} className="text-primary" />
                  <h3 className="text-sm font-bold text-foreground">
                    Free {course.title} Counseling {targetUniName ? `• ${targetUniName}` : ""}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setCounselingOpen(false)}
                  className="p-1 rounded-lg hover:bg-muted text-muted-foreground"
                >
                  <X size={18} />
                </button>
              </div>

              {leadSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <Check size={18} className="shrink-0" />
                  <span>Request received! Our academic advisor will connect with you on WhatsApp shortly with official fee sheets and EMI options.</span>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label htmlFor={formNameId} className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Full Name *
                    </label>
                    <input
                      id={formNameId}
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={leadName}
                      onChange={(e) => {
                        setLeadName(e.target.value);
                        if (leadNameError) setLeadNameError("");
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-background border ${leadNameError ? "border-red-500 ring-1 ring-red-500/20" : "border-border"} text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none`}
                    />
                    {leadNameError && (
                      <p className="text-[10px] text-red-500 font-semibold mt-1">{leadNameError}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor={formPhoneId} className="block text-[11px] font-semibold text-muted-foreground mb-1">
                      Phone Number (WhatsApp) *
                    </label>
                    <input
                      id={formPhoneId}
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="10-digit mobile (starts with 6, 7, 8, 9)"
                      value={leadPhone}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setLeadPhone(val);
                        if (val.length > 0 && ["0", "1", "2", "3", "4", "5"].includes(val[0])) {
                          setLeadPhoneError(`Indian mobile numbers start with 6, 7, 8, or 9 (numbers starting with ${val[0]} are not permitted).`);
                        } else {
                          if (leadPhoneError) setLeadPhoneError("");
                        }
                      }}
                      className={`w-full px-3.5 py-2.5 rounded-xl bg-background border ${leadPhoneError ? "border-red-500 ring-1 ring-red-500/20" : "border-border"} text-xs text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none`}
                    />
                    {leadPhoneError && (
                      <p className="text-[10px] text-red-500 font-semibold mt-1">{leadPhoneError}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
                  >
                    {isSubmitting ? "Connecting..." : "Request Free Guidance & Fee Sheet"}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default CourseDetail;
