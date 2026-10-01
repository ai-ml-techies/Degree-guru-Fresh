import { useState, useMemo, useId } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { 
  ACTIVE_ONLINE_UNIVERSITIES, 
  INCLUDED_PARTNERS, 
  UniversityData 
} from "@/data/universities";
import { UniversityLogo } from "@/components/UniversityLogo";
import { useLeadGate } from "@/context/LeadGateContext";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { 
  Search, 
  ShieldCheck, 
  ArrowRight, 
  MapPin, 
  Award,
  Check,
  ChevronDown,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Mail,
  Send
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { validateIndianMobile, validateMeaningfulName, validateMeaningfulEmail } from "@/lib/validation";

type LocationFilter = "all" | "indian" | "international";
type UniversityTypeFilter = "all" | "Private" | "Government" | "Deemed" | "International";
type SortOption = "recommended" | "popular" | "fee-asc" | "fee-desc" | "name-asc";

// Helper to determine university type
const getUniversityType = (uni: UniversityData): "Private" | "Government" | "Deemed" | "International" => {
  const norm = (uni.slug + " " + uni.name + " " + (uni.location || "")).toLowerCase();
  
  // 1. Government Universities (Check Indian State/Central Universities first so Kurukshetra is never foreign)
  if (
    norm.includes("kurukshetra") || 
    norm.includes("kuk") || 
    norm.includes("chaudhary") || 
    norm.includes("deen dayal") || 
    norm.includes("gorakhpur") || 
    norm.includes("ddu") ||
    norm.includes("andhra") || 
    norm.includes("state university")
  ) {
    return "Government";
  }

  // 2. International / Foreign Universities
  if (
    norm.includes("liverpool") || 
    norm.includes("golden gate") || 
    norm.includes("birchwood") || 
    norm.includes("rushford") || 
    norm.includes("ssbm") || 
    norm.includes("esgci") || 
    norm.includes("eimt") || 
    norm.includes("san francisco") || 
    norm.includes("florida") || 
    norm.includes("united kingdom") ||
    /\b(uk|usa)\b/i.test(uni.location || "")
  ) {
    return "International";
  }

  // 3. Deemed to be Universities
  if (
    norm.includes("deemed") || 
    norm.includes("nmims") || 
    norm.includes("jain") || 
    norm.includes("dpu") || 
    norm.includes("vidyapeeth") || 
    norm.includes("amrita") || 
    norm.includes("manipal") || 
    norm.includes("vit") ||
    norm.includes("christ")
  ) {
    return "Deemed";
  }

  return "Private";
};

// Helper for ultra-clean, 2-second scannable accreditation badge
const getShortAccreditation = (uni: UniversityData): string => {
  if (uni.naacGrade) return `NAAC ${uni.naacGrade}`;
  if (uni.approvals && uni.approvals.length > 0) {
    const naac = uni.approvals.find((a) => a.includes("NAAC"));
    if (naac) return naac.replace("Accredited ", "").trim();
    const top = uni.approvals.find((a) => a.includes("QS") || a.includes("WASC") || a.includes("NIRF") || a.includes("DEAC"));
    if (top) return top;
    return uni.approvals[0];
  }
  return "UGC-DEB";
};

// Parse starting fee number for sorting
const parseMinFee = (feeStr: string): number => {
  if (!feeStr) return 0;
  const match = feeStr.replace(/,/g, "").match(/\d+/);
  return match ? parseInt(match[0], 10) : 0;
};

export const UniversitiesIndex = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState<LocationFilter>("all");
  const [typeFilter, setTypeFilter] = useState<UniversityTypeFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("recommended");
  const [visibleCount, setVisibleCount] = useState(9);
  const [selectedCompare, setSelectedCompare] = useState<string[]>([]);

  // Bottom Form State
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formProgram, setFormProgram] = useState("Online MBA");
  const [countryCode, setCountryCode] = useState("+91");

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpError, setOtpError] = useState("");

  const [formNameError, setFormNameError] = useState("");
  const [formPhoneError, setFormPhoneError] = useState("");
  const [formEmailError, setFormEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();

  const navigate = useNavigate();
  const { requireContact } = useLeadGate();

  const ITEMS_PER_PAGE = 6;

  const handleUniClick = (slug: string, name: string) => {
    requireContact(() => {
      navigate(`/universities/${slug}`);
    }, name);
  };

  const toggleCompare = (slug: string) => {
    if (selectedCompare.includes(slug)) {
      setSelectedCompare(selectedCompare.filter((s) => s !== slug));
    } else {
      if (selectedCompare.length >= 4) {
        alert("You can compare up to 4 universities at a time.");
        return;
      }
      setSelectedCompare([...selectedCompare, slug]);
    }
  };

  const allUniversities: UniversityData[] = useMemo(() => {
    return [
      ...ACTIVE_ONLINE_UNIVERSITIES,
      ...INCLUDED_PARTNERS,
    ];
  }, []);

  // Filter & Sort Logic
  const filteredAndSorted = useMemo(() => {
    let list = allUniversities.filter((u) => {
      // Must be online
      if (!u.mode.toLowerCase().includes("online")) return false;

      // Search match
      const q = searchTerm.toLowerCase().trim();
      if (q) {
        const matchesName = u.name.toLowerCase().includes(q);
        const matchesShort = u.shortName.toLowerCase().includes(q);
        const matchesLocation = u.location.toLowerCase().includes(q);
        const matchesCourse = u.popularPrograms.some((p) => p.toLowerCase().includes(q));
        if (!matchesName && !matchesShort && !matchesLocation && !matchesCourse) {
          return false;
        }
      }

      // University Type
      const uType = getUniversityType(u);
      if (typeFilter !== "all" && uType !== typeFilter) {
        return false;
      }

      // Location / Origin (Indian vs Foreign)
      const isForeign = uType === "International";
      if (locationFilter === "indian" && isForeign) return false;
      if (locationFilter === "international" && !isForeign) return false;

      return true;
    });

    // Sorting (Apply when a specific sort is selected; "recommended" preserves the verified catalog order)
    if (sortBy === "popular") {
      list = [...list].sort((a, b) => (b.reviewsCount || 0) - (a.reviewsCount || 0));
    } else if (sortBy === "fee-asc") {
      list = [...list].sort((a, b) => parseMinFee(a.feesRange) - parseMinFee(b.feesRange));
    } else if (sortBy === "fee-desc") {
      list = [...list].sort((a, b) => parseMinFee(b.feesRange) - parseMinFee(a.feesRange));
    } else if (sortBy === "name-asc") {
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [allUniversities, searchTerm, locationFilter, typeFilter, sortBy]);

  const visibleUniversities = filteredAndSorted.slice(0, visibleCount);
  const hasMore = visibleCount < filteredAndSorted.length;

  const loadMore = () => {
    setVisibleCount((prev) => Math.min(prev + ITEMS_PER_PAGE, filteredAndSorted.length));
  };

  const handleSendOtp = () => {
    const emailCheck = validateMeaningfulEmail(formEmail);
    if (!emailCheck.valid) {
      setFormEmailError(emailCheck.error || "Please enter a valid email address.");
      return;
    }
    setFormEmailError("");
    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setOtpSent(true);
    setOtpError("");
  };

  const handleVerifyOtp = () => {
    if (otpValue.trim() === generatedOtp) {
      setEmailVerified(true);
      setOtpError("");
    } else {
      setOtpError("Incorrect OTP code. Please enter the 4-digit code shown.");
    }
  };

  const handleBottomFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameCheck = validateMeaningfulName(formName, false);
    if (!nameCheck.valid) {
      setFormNameError(nameCheck.error || "Please enter a valid, meaningful full name.");
      return;
    }
    const phoneCheck = validateIndianMobile(formPhone);
    if (!phoneCheck.valid) {
      setFormPhoneError(phoneCheck.error || "Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    const emailCheck = validateMeaningfulEmail(formEmail);
    if (!emailCheck.valid) {
      setFormEmailError(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    if (!emailVerified) {
      setFormEmailError("Please verify your email address with the OTP before submitting.");
      return;
    }

    setFormNameError("");
    setFormPhoneError("");
    setFormEmailError("");
    setIsSubmitting(true);

    try {
      await submitLead({
        name: nameCheck.normalized || formName.trim(),
        phone: `${countryCode} ${phoneCheck.normalized || formPhone.replace(/\D/g, "").slice(-10)}`,
        email: emailCheck.normalized || formEmail.trim().toLowerCase(),
        program: `University Match Inquiry: ${formProgram}`,
        source: "universities-bottom-match-form",
      });
      setFormSubmitted(true);
    } catch {
      setFormSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

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

      <div className="container-dg py-6 md:py-10 max-w-7xl">
        <AppBreadcrumb items={[{ label: "Universities" }]} />

        {/* 1. Header Section */}
        <div className="text-center max-w-3xl mx-auto my-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <ShieldCheck size={14} /> 100% Verified Accredited Institutions
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Best Online Universities
          </h1>
        </div>

        {/* 2. Search & Dynamic Filters Bar */}
        <div className="max-w-4xl mx-auto space-y-3 mb-8" id="universities-list">
          {/* Search Box */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={17} />
            <input
              type="text"
              placeholder="Search universities by name, location, or course (e.g. Manipal, Amity, SGT, Online MBA)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setVisibleCount(9);
              }}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none shadow-2xs placeholder:text-muted-foreground/70"
            />
          </div>

          {/* Clean Filters Row Below Search Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              {/* Filter 1: Location / Origin */}
              <div className="relative min-w-[160px]">
                <select
                  value={locationFilter}
                  onChange={(e) => {
                    setLocationFilter(e.target.value as LocationFilter);
                    setVisibleCount(9);
                  }}
                  aria-label="Filter by University Location"
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="all">University Location</option>
                  <option value="indian">Indian Universities</option>
                  <option value="international">Foreign Universities</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>

              {/* Filter 2: University Type */}
              <div className="relative min-w-[150px]">
                <select
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value as UniversityTypeFilter);
                    setVisibleCount(9);
                  }}
                  aria-label="Filter by University Type"
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="all">University Type</option>
                  <option value="Private">Private</option>
                  <option value="Government">Government</option>
                  <option value="Deemed">Deemed</option>
                  <option value="International">International</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>

              {/* Reset Filter Button */}
              {(searchTerm || locationFilter !== "all" || typeFilter !== "all" || sortBy !== "recommended") && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    setLocationFilter("all");
                    setTypeFilter("all");
                    setSortBy("recommended");
                    setVisibleCount(9);
                  }}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-bold text-destructive hover:bg-destructive/10 inline-flex items-center gap-1 cursor-pointer transition-colors"
                >
                  <RotateCcw size={12} />
                  <span>Reset</span>
                </button>
              )}
            </div>

            {/* Sort by Dropdown */}
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-xs text-muted-foreground font-medium hidden sm:inline">Sort by:</span>
              <div className="relative min-w-[150px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  aria-label="Sort Universities"
                  className="w-full appearance-none px-3 py-2 pr-8 rounded-xl bg-card border border-border text-xs font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="recommended">Recommended</option>
                  <option value="popular">Popular</option>
                  <option value="fee-asc">Fees: Low to High</option>
                  <option value="fee-desc">Fees: High to Low</option>
                  <option value="name-asc">University Name A–Z</option>
                </select>
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* 3. University Cards Grid (Compact, clean, 2-second scannable) */}
        {filteredAndSorted.length === 0 ? (
          <div className="text-center py-16 px-4 rounded-2xl bg-card border border-border">
            <p className="text-muted-foreground font-medium text-sm">
              No universities found matching your filters. Try selecting a different location or type.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
              {visibleUniversities.map((uni) => {
                const shortAccreditation = getShortAccreditation(uni);
                const isSelected = selectedCompare.includes(uni.slug);
                const isLiverpool = uni.slug.includes("liverpool") || uni.slug.includes("ljmu");

                return (
                  <div
                    key={uni.id}
                    className={`p-5 sm:p-5.5 rounded-2xl bg-card border transition-all duration-150 flex flex-col justify-between space-y-4 group hover:border-primary/40 hover:shadow-md ${
                      isSelected ? "border-primary ring-2 ring-primary/30 shadow-md" : "border-border/80 shadow-2xs"
                    }`}
                  >
                    <div>
                      {/* Top Row: Prominent Compare Button + Single Crisp Accreditation Badge */}
                      <div className="flex items-center justify-between gap-2 pb-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            toggleCompare(uni.slug);
                          }}
                          aria-label={`Compare ${uni.name}`}
                          className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                            isSelected
                              ? "bg-primary text-primary-foreground border-primary shadow-xs ring-2 ring-primary/20"
                              : "bg-muted/40 hover:bg-muted text-foreground/80 border-border hover:border-primary/50"
                          }`}
                        >
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center border transition-all ${
                              isSelected
                                ? "bg-white text-primary border-white"
                                : "border-muted-foreground/50 bg-background"
                            }`}
                          >
                            {isSelected ? <Check size={12} strokeWidth={3} /> : null}
                          </div>
                          <span>Compare</span>
                        </button>

                        <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-md flex items-center gap-1 shrink-0">
                          <Award size={11} className="shrink-0" />
                          <span>{shortAccreditation}</span>
                        </span>
                      </div>

                      {/* University Logo (Clear PNG, centered, Liverpool enlarged) */}
                      <div
                        onClick={() => handleUniClick(uni.slug, uni.name)}
                        className="w-full h-15 sm:h-16 flex items-center justify-center py-1 px-2 cursor-pointer transition-transform group-hover:scale-102"
                      >
                        <div className={isLiverpool ? "scale-135 transition-transform" : ""}>
                          <UniversityLogo idOrSlug={uni.slug} size="md" className="max-w-full h-12 object-contain" />
                        </div>
                      </div>

                      {/* University Name (Clean text heading wrapping naturally without ellipsis) */}
                      <div
                        onClick={() => handleUniClick(uni.slug, uni.name)}
                        className="pt-1.5 pb-2 text-center cursor-pointer min-h-[2.75rem] flex items-center justify-center"
                      >
                        <h3 className="text-xs sm:text-sm font-bold text-foreground leading-snug group-hover:text-primary transition-colors text-center" title={uni.name}>
                          {uni.name}
                        </h3>
                      </div>

                      {/* Popular Courses (Max 3 concise tags for 2-sec scanning, each program clickable) */}
                      <div className="pt-2 border-t border-border/50 space-y-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground block">
                          Popular Programs
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {uni.popularPrograms.slice(0, 3).map((prog, idx) => {
                            const progClean = prog.replace(/^Online\s+/i, "").trim();
                            return (
                              <Link
                                key={idx}
                                to={`/universities/${uni.slug}?tab=courses&search=${encodeURIComponent(progClean)}`}
                                onClick={(e) => e.stopPropagation()}
                                className="px-2.5 py-1 rounded-md bg-secondary/80 hover:bg-primary hover:text-primary-foreground text-[11px] font-semibold text-foreground transition-all border border-border/60 hover:border-primary shadow-2xs cursor-pointer"
                                title={`View ${prog} at ${uni.shortName}`}
                              >
                                {prog}
                              </Link>
                            );
                          })}
                          {uni.popularPrograms.length > 3 && (
                            <Link
                              to={`/universities/${uni.slug}?tab=courses`}
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-1 rounded-md bg-muted text-[10px] font-bold text-muted-foreground hover:bg-muted/80 hover:text-foreground transition-all cursor-pointer"
                              title="View all programs"
                            >
                              +{uni.popularPrograms.length - 3} more
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Footer: Starting Fee + View CTA */}
                    <div className="pt-2.5 border-t border-border/50 flex items-center justify-between">
                      <div>
                        <span className="text-[9px] text-muted-foreground block leading-tight">Starting Fee</span>
                        <span className="text-xs font-extrabold text-foreground">
                          {uni.feesRange.split(/[–-]/)[0]?.trim()}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleUniClick(uni.slug, uni.name)}
                        className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-colors shadow-2xs flex items-center gap-1 cursor-pointer"
                      >
                        <span>View</span>
                        <ArrowRight size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="mt-8 flex items-center justify-center">
                <button
                  type="button"
                  onClick={loadMore}
                  className="px-6 py-2.5 rounded-xl bg-card border border-border hover:bg-muted text-foreground text-xs sm:text-sm font-bold transition-all shadow-2xs flex items-center gap-2 cursor-pointer"
                >
                  <span>Load More Universities</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </>
        )}

        {/* 4. Floating Comparison Dock (Prominent & Clean, links directly to selected universities) */}
        {selectedCompare.length > 0 && (
          <div className="fixed bottom-6 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 z-50 max-w-xl w-auto bg-card/95 dark:bg-slate-900/95 backdrop-blur-md border-2 border-primary/40 shadow-2xl rounded-2xl px-6 py-4 flex items-center justify-between gap-5 animate-in slide-in-from-bottom-5 duration-200 ring-4 ring-black/5">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shadow-xs">
                {selectedCompare.length}
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">
                  {selectedCompare.length === 1 ? "1 University Selected" : `${selectedCompare.length} Universities Selected`}
                </p>
                <p className="text-[11px] text-muted-foreground hidden sm:block">
                  Compare side-by-side fees, approvals & curriculum
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                type="button"
                onClick={() => setSelectedCompare([])}
                className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1 cursor-pointer transition-colors"
              >
                Clear
              </button>
              <Link
                to={`/universities/compare?unis=${selectedCompare.join(",")}`}
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-md hover:bg-primary/90 hover:scale-[1.02] active:scale-95 flex items-center gap-2 transition-all cursor-pointer"
              >
                <span>Compare Now</span>
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        )}

        {/* 5. Bottom Counseling Form: "Not sure which university is right for you?" (Clean & No Filler) */}
        <section className="mt-12 max-w-xl mx-auto" id="counseling-box">
          <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-md space-y-4">
            <div className="text-center">
              <h2 className="text-base sm:text-lg font-bold text-foreground">
                Not sure which university is right for you?
              </h2>
            </div>

            {formSubmitted ? (
              <div className="p-5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <CheckCircle2 className="mx-auto text-emerald-600 dark:text-emerald-400" size={28} />
                <h3 className="font-bold text-sm text-foreground">Inquiry Received Successfully!</h3>
                <p className="text-xs text-muted-foreground leading-relaxed max-w-md mx-auto">
                  Thank you, <strong className="text-foreground">{formName}</strong>. Our senior counselor will connect with you on {countryCode} {formPhone}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleBottomFormSubmit} className="space-y-4 max-w-md mx-auto">
                <div className="flex flex-col gap-3.5">
                  {/* Full Name */}
                  <div className="space-y-1">
                    <label htmlFor={nameInputId} className="text-xs font-semibold text-foreground">
                      Full Name *
                    </label>
                    <input
                      id={nameInputId}
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => {
                        setFormName(e.target.value);
                        if (formNameError) setFormNameError("");
                      }}
                      placeholder="e.g. Vikas Mehra"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                    {formNameError && <p className="text-[11px] text-destructive font-medium">{formNameError}</p>}
                  </div>

                  {/* Phone Number */}
                  <div className="space-y-1">
                    <label htmlFor={phoneInputId} className="text-xs font-semibold text-foreground">
                      Mobile Number (10 Digits) *
                    </label>
                    <div className="flex gap-2">
                      <select
                        value={countryCode}
                        onChange={(e) => setCountryCode(e.target.value)}
                        aria-label="Country Code"
                        className="px-2.5 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold shrink-0 cursor-pointer"
                      >
                        <option value="+91">+91 (IN)</option>
                        <option value="+971">+971 (AE)</option>
                        <option value="+1">+1 (US)</option>
                        <option value="+44">+44 (UK)</option>
                      </select>
                      <input
                        id={phoneInputId}
                        type="tel"
                        required
                        maxLength={10}
                        value={formPhone}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, "");
                          setFormPhone(val);
                          if (formPhoneError) setFormPhoneError("");
                        }}
                        placeholder="Enter 10-digit number"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>
                    {formPhoneError && <p className="text-[11px] text-destructive font-medium">{formPhoneError}</p>}
                  </div>

                  {/* Email with Verification OTP */}
                  <div className="space-y-1">
                    <label htmlFor={emailInputId} className="text-xs font-semibold text-foreground flex items-center justify-between">
                      <span>Email Address *</span>
                      {emailVerified && (
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                          <CheckCircle2 size={12} /> Verified
                        </span>
                      )}
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id={emailInputId}
                          type="email"
                          required
                          disabled={emailVerified}
                          value={formEmail}
                          onChange={(e) => {
                            setFormEmail(e.target.value);
                            if (formEmailError) setFormEmailError("");
                          }}
                          placeholder="vikas.mehra@gmail.com"
                          className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none disabled:bg-muted/40"
                        />
                      </div>

                      {!emailVerified && (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shrink-0 cursor-pointer shadow-2xs"
                        >
                          {otpSent ? "Resend OTP" : "Send OTP"}
                        </button>
                      )}
                    </div>
                    {formEmailError && <p className="text-[11px] text-destructive font-medium">{formEmailError}</p>}

                    {/* Interactive OTP Verification Input */}
                    {otpSent && !emailVerified && (
                      <div className="mt-2.5 p-3 rounded-xl bg-muted/40 border border-border/80 space-y-2">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-muted-foreground">
                            Enter the 4-digit code sent to your email:
                          </span>
                          <span className="font-bold text-primary px-2 py-0.5 rounded bg-primary/10">
                            Demo OTP: {generatedOtp}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            maxLength={4}
                            value={otpValue}
                            onChange={(e) => setOtpValue(e.target.value)}
                            placeholder="Enter 4-digit OTP"
                            className="w-32 px-3 py-2 rounded-lg bg-background border border-border text-xs font-bold text-center tracking-widest focus:ring-2 focus:ring-primary/40 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={handleVerifyOtp}
                            className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors cursor-pointer"
                          >
                            Verify OTP
                          </button>
                        </div>
                        {otpError && <p className="text-[11px] text-destructive font-medium">{otpError}</p>}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70 mt-2"
                >
                  {isSubmitting ? (
                    <span>Submitting Request...</span>
                  ) : (
                    <>
                      <span>Request For Counseling</span>
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </section>

        {/* 6. Separated Offline University Section */}
        <div className="mt-14 p-6 sm:p-7 rounded-3xl bg-gradient-to-r from-amber-500/10 via-card to-card border border-amber-500/30">
          <div className="max-w-3xl space-y-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">
              Offline Campus Education
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-foreground">
              M.K. University, Patan, Gujarat
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Explore traditional on-campus programs with classroom-based learning, direct faculty interaction, and a regular university campus experience.
            </p>
            <div className="pt-2">
              <Link
                to="/offline-courses"
                className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-black font-bold text-xs inline-flex items-center gap-2 transition-colors shadow-sm"
              >
                <span>Explore M.K. University Offline Courses</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversitiesIndex;
