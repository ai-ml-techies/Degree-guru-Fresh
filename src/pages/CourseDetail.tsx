import { useState, useId, useEffect } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { getCourseBySlug, CORE_COURSES } from "@/data/courses";
import { ACTIVE_ONLINE_UNIVERSITIES } from "@/data/universities";
import { UniversityLogo } from "@/components/UniversityLogo";
import { getUniversityCampusImage } from "@/data/universityCampusImages";
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  HelpCircle, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Laptop, 
  FileCheck, 
  ChevronDown, 
  Send,
  ShieldCheck,
  Briefcase,
  Layers,
  Award,
  Star,
  Search,
  Check,
  Plus,
  Heart,
  X
} from "lucide-react";
import { submitLead } from "@/lib/api";

export const CourseDetail = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = getCourseBySlug(courseSlug || "");

  const [activeSemTab, setActiveSemTab] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // University comparison & filter state
  const [selectedCompareUnis, setSelectedCompareUnis] = useState<string[]>([]);
  const [uniSearch, setUniSearch] = useState("");
  const [selectedSpecialOption, setSelectedSpecialOption] = useState<string>("all");

  useEffect(() => {
    if (window.location.hash === "#universities-offering") {
      const el = document.getElementById("universities-offering");
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);
      }
    }
  }, []);

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

  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const formNameId = useId();
  const formPhoneId = useId();
  const formEmailId = useId();

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Universities offering this course
  const offeringUnis = ACTIVE_ONLINE_UNIVERSITIES.filter((u) =>
    course.offeringUniversities.some(
      (ou) =>
        ou.toLowerCase().includes(u.shortName.toLowerCase()) ||
        ou.toLowerCase().includes(u.name.toLowerCase()) ||
        u.name.toLowerCase().includes(ou.toLowerCase())
    )
  );

  const baseUnis = offeringUnis.length > 0 ? offeringUnis : ACTIVE_ONLINE_UNIVERSITIES.slice(0, 6);

  const filteredUnis = baseUnis.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(uniSearch.toLowerCase()) ||
      u.shortName.toLowerCase().includes(uniSearch.toLowerCase()) ||
      u.location.toLowerCase().includes(uniSearch.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedSpecialOption === "budget") {
      return (
        u.feesRange.includes("₹4") ||
        u.feesRange.includes("₹5") ||
        u.feesRange.includes("₹6") ||
        u.feesRange.includes("₹7") ||
        u.feesRange.includes("₹8")
      );
    }
    if (selectedSpecialOption === "naac") {
      return u.accreditation.toLowerCase().includes("naac");
    }
    if (selectedSpecialOption === "aicte") {
      return (
        u.accreditation.toLowerCase().includes("aicte") ||
        u.accreditation.toLowerCase().includes("ugc")
      );
    }

    return true;
  });

  // Related courses (all except current)
  const relatedCourses = CORE_COURSES.filter((c) => c.slug !== course.slug).slice(0, 4);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone || !leadName) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        name: leadName,
        phone: leadPhone,
        email: leadEmail || `${leadPhone}@degreeguru.in`,
        program: `${course.fullName} Inquiry`,
        source: `course-page-${course.slug}`,
      });
      setLeadSuccess(true);
    } catch {
      setLeadSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structured Course & FAQ Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.fullName,
    "description": course.heroDescription,
    "provider": {
      "@type": "Organization",
      "name": "Degree Guru",
      "sameAs": "https://degreeguru.in",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "duration": course.duration,
    },
  };

  return (
    <>
      <Helmet>
        <title>{course.fullName} - Fees, Eligibility, Universities & Syllabus 2026 | Degree Guru</title>
        <meta name="description" content={course.heroDescription} />
        <link rel="canonical" href={`https://degreeguru.in/${course.slug}/`} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* 1. HERO SECTION - Seamlessly flows beneath the floating header up to the top ticker */}
      <section className="-mt-[100px] sm:-mt-[114px] md:-mt-[132px] pt-[104px] sm:pt-[118px] md:pt-[132px] pb-14 relative overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-background border-b border-border/60">
        <div className="container-dg">
          <AppBreadcrumb
            items={[
              { label: "Online Courses", href: "/courses" },
              { label: course.fullName }
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                <ShieldCheck size={14} /> 100% UGC-DEB & AICTE Approved Degree
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-normal leading-[1.28] sm:leading-[1.32] md:leading-[1.38]">
                {course.fullName}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {course.heroDescription}
              </p>

              {/* Key Quick Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm">
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-0.5">
                    <Clock size={14} /> Duration
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground">{course.duration}</div>
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-0.5">
                    <IndianRupee size={14} /> Fees
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground">{course.feesRange}</div>
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm">
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-0.5">
                    <Sparkles size={14} /> No-Cost EMI
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground">{course.emiFrom}</div>
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold mb-0.5">
                    <TrendingUp size={14} /> Salary Jump
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground">{course.roiMetrics.averageSalaryJump}</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#counseling-lead"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <GraduationCap size={16} /> Compare Top Universities <ArrowRight size={14} />
                </a>
                <Link
                  to="/roi-calculator"
                  className="px-5 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Calculate Your ROI
                </Link>
              </div>
            </div>

            {/* Right Quick Lead Card */}
            <div id="counseling-lead" className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  DG
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Free 1-on-1 Counseling for {course.shortName}</h2>
                  <p className="text-[11px] text-muted-foreground">Compare fees, syllabus & admission criteria</p>
                </div>
              </div>

              {leadSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>Your request has been received! Our academic advisor will contact you on WhatsApp shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label htmlFor={formNameId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Full Name *</label>
                    <input
                      id={formNameId}
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor={formPhoneId} className="block text-[11px] font-semibold text-muted-foreground mb-1">WhatsApp Mobile *</label>
                    <input
                      id={formPhoneId}
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor={formEmailId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Email (Optional)</label>
                    <input
                      id={formEmailId}
                      type="email"
                      placeholder="name@gmail.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                  >
                    <Send size={13} /> Get Free University Comparison & Prospectus
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2 & 3. WHAT IS THIS COURSE & WHO SHOULD CHOOSE IT */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl space-y-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Overview</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              What is an {course.fullName}?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
              {course.whatIs}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/70 space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 size={18} className="text-primary" /> Who Should Choose an {course.shortName}?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.whoShouldChoose.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4, 5, 6, 7. ELIGIBILITY, DURATION, FEES & EMI */}
      <section className="py-14 bg-muted/20 border-b border-border/50">
        <div className="container-dg max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Key Requirements</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Eligibility, Fees & EMI Structure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#6528f7]/10 text-[#6528f7] flex items-center justify-center">
                <FileCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Academic Eligibility</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {course.eligibility}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <IndianRupee size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Fee Range & Financing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Total program fees range between <strong>{course.feesRange}</strong> depending on university brand and LMS tier.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Flexible EMI Options</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Start learning with <strong>{course.emiFrom}</strong> monthly installments. 0% interest financing through partnered banks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SPECIALIZATIONS */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">In-Demand Tracks</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Popular {course.shortName} Specializations
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Pick the domain matching your target industry and salary goals:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {course.specializations.map((spec, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-colors shadow-sm flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground">{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 & 10. BEST UNIVERSITIES FOR COURSE (MATCHING SCREENSHOT 5) */}
      <section id="universities-offering" className="py-14 bg-muted/30 border-b border-border/50 scroll-mt-28">
        <div className="container-dg max-w-7xl">
          {/* Header matching Screenshot 5 */}
          <div className="mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold mb-2">
              <Sparkles size={14} /> Compare Accredited Degree Institutions
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Best Universities For {course.fullName}{" "}
              <span className="text-primary font-bold text-lg sm:text-2xl block sm:inline mt-1 sm:mt-0">
                (EMI Starting from {course.emiFrom})
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-2xl">
              Compare accredited UGC-DEB and AICTE approved universities offering online {course.shortName} with transparent semester fees and 0% interest loan EMI options.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-6 items-start">
            {/* Left Filter Sidebar ("Special options") */}
            <div className="w-full lg:w-64 xl:w-72 shrink-0 space-y-4">
              <div className="p-5 rounded-3xl bg-card border border-border/80 shadow-md space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-foreground pb-2 border-b border-border/60">
                  Special options
                </h3>

                {/* Search University */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={14} />
                  <input
                    type="text"
                    placeholder="Search university..."
                    value={uniSearch}
                    onChange={(e) => setUniSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>

                {/* Filter Options */}
                <div className="space-y-1.5 pt-1">
                  {[
                    { id: "all", label: "All Universities" },
                    { id: "budget", label: "Budget Friendly (EMI < ₹4,000)" },
                    { id: "naac", label: "NAAC A++ / A+ Accredited" },
                    { id: "aicte", label: "AICTE & UGC-DEB Approved" },
                  ].map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => setSelectedSpecialOption(opt.id)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between transition-all cursor-pointer ${
                        selectedSpecialOption === opt.id
                          ? "bg-primary text-primary-foreground font-bold shadow-xs"
                          : "hover:bg-muted text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span>{opt.label}</span>
                      {selectedSpecialOption === opt.id && <Check size={13} />}
                    </button>
                  ))}
                </div>

                {/* Quick Free Counseling Card */}
                <div className="p-4 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-2 mt-4">
                  <div className="text-xs font-bold text-foreground">Confused which university to pick?</div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Get an unbiased 1-on-1 counselor comparison based on your budget & career goals.
                  </p>
                  <a
                    href="#counseling-lead"
                    className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline pt-1"
                  >
                    Request Free Counseling →
                  </a>
                </div>
              </div>
            </div>

            {/* Right University Cards Grid (Matching Screenshot 5) */}
            <div className="flex-1 min-w-0 w-full space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {filteredUnis.map((uni) => {
                  const isCompared = selectedCompareUnis.includes(uni.slug);
                  return (
                    <div
                      key={uni.id}
                      className="rounded-3xl bg-card border border-border/80 hover:border-primary/60 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group shadow-sm"
                    >
                      {/* Top Campus Picture Area */}
                      <div>
                        <div className="relative aspect-[16/10] w-full overflow-hidden bg-muted">
                          <img
                            src={getUniversityCampusImage(uni.slug)}
                            alt={uni.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />

                          {/* Top Badges */}
                          <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-primary/90 backdrop-blur-md text-white text-[10px] font-extrabold shadow-sm">
                            Admissions 2026
                          </div>

                          <div className="absolute top-3 right-3 flex items-center gap-1.5">
                            <span className="px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-emerald-400 text-[10px] font-bold">
                              0% EMI
                            </span>
                          </div>

                          {/* Bottom Badges on Image */}
                          <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between gap-2">
                            <span className="px-2.5 py-0.5 rounded-lg bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold shadow-xs truncate max-w-[170px] flex items-center gap-1">
                              <ShieldCheck size={12} className="shrink-0" />
                              {uni.accreditation.split(",")[0] || "UGC-DEB"}
                            </span>

                            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md text-amber-400 text-[11px] font-extrabold shrink-0">
                              <Star size={12} className="fill-amber-400" /> 4.8
                            </div>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-4 sm:p-5 space-y-3.5">
                          {/* University Header Row */}
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-xl bg-card border border-border/80 p-1 flex items-center justify-center shrink-0 shadow-2xs">
                              <UniversityLogo idOrSlug={uni.slug} size="sm" />
                            </div>
                            <div className="min-w-0">
                              <h3 className="text-sm font-extrabold text-foreground group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                                {uni.name}
                              </h3>
                              <p className="text-[11px] text-muted-foreground truncate">{uni.location}</p>
                            </div>
                          </div>

                          {/* Key Specs Pill Strip */}
                          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/50 text-[11px]">
                            <div className="p-2 rounded-xl bg-muted/40">
                              <span className="text-muted-foreground block text-[10px]">Tuition Fees</span>
                              <span className="font-extrabold text-foreground">{uni.feesRange.split(" - ")[0]}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              <span className="text-muted-foreground block text-[10px]">No-Cost EMI</span>
                              <span className="font-extrabold">{course.emiFrom || "₹3,599/m"}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-muted/40">
                              <span className="text-muted-foreground block text-[10px]">Duration</span>
                              <span className="font-bold text-foreground">{course.duration}</span>
                            </div>
                            <div className="p-2 rounded-xl bg-muted/40">
                              <span className="text-muted-foreground block text-[10px]">Exam Mode</span>
                              <span className="font-bold text-foreground truncate block">100% Online</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="p-4 sm:p-5 pt-0 space-y-2">
                        <button
                          type="button"
                          onClick={() => toggleCompare(uni.slug)}
                          className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                            isCompared
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                              : "bg-[#0b57d0] hover:bg-[#0842a0] text-white"
                          }`}
                        >
                          {isCompared ? (
                            <>
                              <Check size={14} /> Added to Compare
                            </>
                          ) : (
                            <>
                              <Plus size={14} /> Add to Compare
                            </>
                          )}
                        </button>

                        <Link
                          to={`/universities/${uni.slug}`}
                          className="w-full text-center block text-xs font-bold text-primary hover:underline py-1"
                        >
                          View University Details →
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Checklist Banner Matching Reference in Screenshot 5 */}
              <div className="p-6 rounded-3xl bg-gradient-to-r from-blue-500/15 via-primary/10 to-indigo-500/15 border border-primary/20 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-1 text-center sm:text-left">
                  <div className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-primary">
                    <CheckCircle2 size={15} /> Student Enrollment Guide
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-foreground">
                    Checklist I Wish I Had Before Enrolling
                  </h3>
                  <p className="text-xs text-muted-foreground max-w-xl">
                    Know the 5 statutory verification points every online learner must inspect: UGC-DEB entitlement, live proctoring norms, credit transfer & fee transparency.
                  </p>
                </div>
                <a
                  href="#counseling-lead"
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shrink-0 hover:bg-primary/90 transition-all shadow-md"
                >
                  Get Enrollment Checklist
                </a>
              </div>
            </div>
          </div>

          {/* Floating Compare Action Bar (Shown when universities selected) */}
          {selectedCompareUnis.length > 0 && (
            <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#0c0d1a] border border-primary/50 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 max-w-[90vw]">
              <div className="text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{selectedCompareUnis.length} Universities Selected</span>
              </div>

              <div className="flex items-center gap-2">
                <Link
                  to={`/universities/compare?unis=${selectedCompareUnis.join(",")}`}
                  className="px-4 py-2 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs flex items-center gap-1.5 transition-all shadow-md"
                >
                  Compare Now (Side-by-Side) <ArrowRight size={13} />
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
        </div>
      </section>


      {/* 11, 12, 13. CURRICULUM, LEARNING FORMAT & EXAM INFORMATION */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl space-y-10">
          <div>
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Syllabus Structure</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                {course.shortName} Course Curriculum
              </h2>
            </div>

            {/* Semester Tabs */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {course.curriculum.map((sem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSemTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSemTab === idx
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sem.semester}
                </button>
              ))}
            </div>

            {/* Current Semester Subjects */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm">
              <h3 className="text-sm font-bold text-primary mb-3">
                Subjects & Modules — {course.curriculum[activeSemTab]?.semester}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.curriculum[activeSemTab]?.subjects.map((sub, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 text-xs font-medium text-foreground">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Format & Exam Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Laptop size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Learning Format & LMS</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {course.learningFormat}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <FileCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Examination Pattern</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {course.examinationInfo}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14, 15, 16, 17, 18. CAREER OPPORTUNITIES, JOB ROLES, SKILLS & ROI */}
      <section id="job-roles" className="py-14 bg-muted/20 border-b border-border/50 scroll-mt-28">
        <div className="container-dg max-w-6xl space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Career Trajectory & Compensation
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">
              Job Roles & Career Opportunities
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              {course.careerOpportunitiesText || `Graduates of ${course.fullName} command high-impact leadership and technical roles across top multinational corporations and high-growth startups.`}
            </p>
          </div>

          {/* Detailed Job Roles Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm sm:text-base font-bold text-foreground flex items-center gap-2">
                <Briefcase size={18} className="text-primary" />
                <span>High-Demand Job Profiles for {course.shortName}</span>
              </h3>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                Verified Market Compensation 2026
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {(course.rawJobRoles || []).map((job, idx) => (
                <div
                  key={idx}
                  className="group p-5 rounded-3xl bg-card border border-border/80 shadow-xs hover:border-primary/50 hover:shadow-md transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs shrink-0">
                        0{idx + 1}
                      </span>
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 text-xs font-bold shrink-0 border border-emerald-500/20">
                        {job.salaryRange}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                        {job.role}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        Key Industries: <strong className="text-foreground/80">{job.topIndustries}</strong>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border/50 flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Hiring Tier-1 MNCs</span>
                    <a
                      href="#counseling-form"
                      className="font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Inquire</span>
                      <ArrowRight size={12} />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Career Progression Flow */}
          {course.careerProgressionText && (
            <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Hierarchical Growth Pathway
              </span>
              <h3 className="text-base sm:text-lg font-bold text-foreground">
                Career Progression for {course.shortName} Professionals
              </h3>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium bg-muted/40 p-4 rounded-2xl border border-border/60">
                {course.careerProgressionText}
              </p>
            </div>
          )}

          {/* Skills Acquired & Financial ROI Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
            {/* Key Skills Acquired */}
            <div className="md:col-span-7 p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles size={16} /> Key Industry Skills Acquired
              </div>
              <h3 className="text-base font-bold text-foreground">
                Competencies That Drive 40%–70% Salary Hikes
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {course.skillsGained.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-primary/10 text-primary dark:text-purple-300 text-xs font-semibold border border-primary/15"
                  >
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Financial ROI */}
            <div className="md:col-span-5 p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                <TrendingUp size={16} /> Financial ROI & Payback
              </div>
              <div className="space-y-3 pt-1">
                <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                  <span className="text-[11px] text-muted-foreground block">Average Salary Hike Post Degree</span>
                  <div className="text-xl font-black text-emerald-600 dark:text-emerald-400 mt-0.5">
                    {course.roiMetrics.averageSalaryJump}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                    <span className="text-[10px] text-muted-foreground block">Payback Period</span>
                    <span className="text-xs font-bold text-foreground mt-0.5 block">
                      {course.roiMetrics.estimatedPaybackMonths}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-muted/30 border border-border/50">
                    <span className="text-[10px] text-muted-foreground block">Top Bracket</span>
                    <span className="text-xs font-bold text-foreground mt-0.5 block">
                      {course.roiMetrics.expectedSalaryRange}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/resume-builder"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md"
            >
              <Sparkles size={14} /> Build Your ATS Resume for {course.shortName} Roles
            </Link>
          </div>
        </div>
      </section>

      {/* 19. ADMISSION PROCESS */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple Steps</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Admission Process for {course.shortName}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {course.admissionSteps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-card border border-border/70 text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center mx-auto">
                  {idx + 1}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-foreground">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 20. FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <section className="py-14 bg-muted/20 border-b border-border/50">
        <div className="container-dg max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Everything Clarified</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Frequently Asked Questions: {course.shortName}
            </h2>
          </div>

          <div className="space-y-3">
            {course.faqs.map((faq, idx) => (
              <div key={idx} className="rounded-2xl bg-card border border-border/70 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 shrink-0 text-muted-foreground ${
                      openFaqIndex === idx ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 21 & 22. RELATED COURSES & BLOGS */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Explore Related Online Degrees</h2>
            <Link to="/courses" className="text-xs font-bold text-primary hover:underline">
              View All Degrees →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {relatedCourses.map((c) => (
              <Link
                key={c.slug}
                to={`/${c.slug}`}
                className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase">{c.duration}</span>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mt-1">
                    {c.shortName}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{c.fullName}</p>
                </div>
                <div className="text-[11px] text-primary font-bold mt-3 flex items-center gap-1">
                  View Syllabus <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 24. FINAL STRONG CTA */}
      <section className="py-16 bg-[#6528f7] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#793efc] via-[#6528f7] to-[#4c16ca] opacity-90" />
        <div className="container-dg max-w-3xl space-y-5 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Ready to Accelerate Your Career with an {course.shortName}?
          </h2>
          <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed">
            Get personalized guidance, compare accredited universities, and find the perfect specialization with Degree Guru's free counseling.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="#counseling-lead"
              className="px-6 py-3 rounded-full bg-white text-primary font-extrabold text-xs sm:text-sm hover:bg-neutral-100 transition-all shadow-xl"
            >
              Get Free University Recommendations
            </a>
            <a
              href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20want%20to%20know%20more%20about%20Online%20Degrees"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm transition-all shadow-xl flex items-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
export default CourseDetail;
