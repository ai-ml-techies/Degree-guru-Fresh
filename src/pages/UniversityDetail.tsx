import { useState, useId, useMemo } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { 
  UNIVERSITIES, 
  ACTIVE_ONLINE_UNIVERSITIES, 
  EXECUTIVE_PARTNERS, 
  INCLUDED_PARTNERS 
} from "@/data/universities";
import { COURSES } from "@/data/courses";
import { getUniversityCampusImage } from "@/data/universityCampusImages";
import { 
  AMITY_JULY_26_FEE_STRUCTURE, 
  AmityProgramFee 
} from "@/data/amityFeeStructure";
import { 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  MapPin, 
  Award, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  Send,
  Star,
  Check,
  Calendar,
  Users,
  Briefcase,
  Layers,
  FileText,
  UserCheck,
  Search,
  ZoomIn,
  Sparkles,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export const UniversityDetail = () => {
  const { uniSlug } = useParams<{ uniSlug: string }>();

  // Find university from full list
  const uni = UNIVERSITIES.find((u) => u.slug === uniSlug) ||
    [...ACTIVE_ONLINE_UNIVERSITIES, ...EXECUTIVE_PARTNERS, ...INCLUDED_PARTNERS].find((u) => u.slug === uniSlug);

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "faculty" | "admission">("overview");
  const [courseCategoryTab, setCourseCategoryTab] = useState<"ug" | "pg" | "collaborative" | "integrated">("ug");
  const [paymentMode, setPaymentMode] = useState<"direct" | "loan">("direct");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState<any | null>(null);

  // Always reset scroll to absolute top hero section on load / refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [uniSlug]);

  // Quick Lead Form State
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameInputId = useId();
  const phoneInputId = useId();
  const courseSelectId = useId();

  if (!uni) {
    return <Navigate to="/universities" replace />;
  }

  const isAmity = uni.slug.includes("amity") || uni.id.includes("amity");
  const campusImage = getUniversityCampusImage(uni.slug);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        name,
        phone,
        email: `${phone}@degreeguru.in`,
        program: `${uni.name} - ${selectedCourse || "General Inquiry"}`,
        source: `university-${uni.slug}`,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Thumbnail image helper for program cards
  const getCourseThumbnail = (prog: AmityProgramFee) => {
    if (prog.industryPartner === "Lenskart") {
      return "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=600&q=80";
    }
    if (prog.type === "UG - PG") {
      return "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=600&q=80";
    }
    if (prog.category === "IT & Computer") {
      return "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=600&q=80";
    }
    if (prog.category === "Commerce") {
      return "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80";
    }
    if (prog.category === "Humanities & Media") {
      return "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=600&q=80";
    }
    return "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80";
  };

  // Filtered Programs for Amity
  const filteredAmityPrograms = useMemo(() => {
    return AMITY_JULY_26_FEE_STRUCTURE.filter((prog) => {
      if (courseCategoryTab === "pg" && prog.type !== "PG") return false;
      if (courseCategoryTab === "ug" && prog.type !== "UG") return false;
      if (courseCategoryTab === "integrated" && prog.type !== "UG - PG") return false;
      if (courseCategoryTab === "collaborative" && !prog.industryPartner) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = prog.name.toLowerCase().includes(q);
        const matchPartner = prog.industryPartner?.toLowerCase().includes(q);
        const matchCat = prog.category.toLowerCase().includes(q);
        return matchName || matchPartner || matchCat;
      }
      return true;
    });
  }, [courseCategoryTab, searchQuery]);

  // Generic programs for other universities
  const genericPrograms = (uni.popularCourses || []).map((courseName) => {
    const matched = COURSES.find((c) => c.title.toLowerCase() === courseName.toLowerCase()) ||
      COURSES.find((c) => courseName.toLowerCase().includes(c.slug.replace("online-", "")));

    const isPg = courseName.includes("MBA") || courseName.includes("MCA") || courseName.includes("M.Sc") || courseName.includes("M.Com") || courseName.includes("Master");

    return {
      name: courseName,
      slug: matched?.slug || courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      level: isPg ? "Postgraduate (PG)" : "Undergraduate (UG)",
      levelKey: isPg ? "pg" : "ug",
      duration: matched?.duration || (isPg ? "2 Years (4 Semesters)" : "3 Years (6 Semesters)"),
      fee: matched?.feeRange || uni.feeRange || "₹60,000 – ₹1,80,000",
      emi: matched?.emiStarting || uni.emiStarting || "From ₹3,250/mo",
      specializations: matched?.specializations ? matched.specializations.slice(0, 4) : ["Finance", "Marketing", "Human Resources", "Analytics"],
      eligibility: matched?.eligibility ? matched.eligibility.split(".")[0] : (isPg ? "Bachelor's degree with min 50% marks" : "10+2 from recognized board with min 45% marks"),
    };
  });

  // 6 HD Authority Recognition Cards (From User Screenshot)
  const authorityLogos = [
    { name: "UGC-DEB", img: "/assets/approvals/ugc-deb.png" },
    { name: "AICTE", img: "/assets/approvals/aicte.png" },
    { name: "NIRF", img: "/assets/approvals/nirf.png" },
    { name: "WES", img: "/assets/approvals/wes.png" },
    { name: "QS World University Rankings", img: "/assets/approvals/qs.png" },
    { name: "DEC", img: "/assets/approvals/dec.png" },
  ];

  // Real Corporate Placement Logos
  const placementCompanies = [
    { name: "Google", logo: "/assets/companies/google.svg" },
    { name: "Microsoft", logo: "/assets/companies/microsoft.svg" },
    { name: "Amazon", logo: "/assets/companies/amazon.svg" },
    { name: "Deloitte", logo: "/assets/companies/deloitte.svg" },
    { name: "TCS", logo: "/assets/companies/tcs.svg" },
    { name: "Infosys", logo: "/assets/companies/infosys.svg" },
    { name: "Accenture", logo: "/assets/companies/accenture.svg" },
    { name: "HDFC Bank", logo: "/assets/companies/hdfc.svg" },
    { name: "KPMG", logo: "/assets/companies/kpmg.svg" },
    { name: "HCLTech", logo: "/assets/companies/hcltech.svg" },
    { name: "Lenskart", logo: "/assets/companies/lenskart.svg" },
    { name: "Wipro", logo: "/assets/companies/wipro.svg" },
  ];

  // Faculty Members from User Reference
  const facultyMembers = [
    {
      id: "sunil-kumar",
      name: "Dr. Sunil Kumar",
      designation: "Assistant Professor",
      qualification: "Ph.D. in Management",
      avatar: "/assets/faculty/sunil-kumar.png",
      bio: "Hello, I'm Dr. Sunil Kumar. I hold a Ph.D. in Management with over 12 years of specialized research and teaching experience in Strategic Management, Organizational Behavior, and Leadership Development."
    },
    {
      id: "luke-pearce",
      name: "Luke Pearce",
      designation: "International Faculty (10+ years)",
      qualification: "Master's in Education and Leadership",
      avatar: "/assets/faculty/luke-pearce.png",
      bio: "I'm Luke Pearce. With over a decade of international pedagogical leadership, I instruct global cohorts in Cross-Cultural Management, Global Business Communication, and Corporate Strategy."
    },
    {
      id: "neha-tandon",
      name: "Neha Tandon",
      designation: "Assistant Professor",
      qualification: "Double PG in Management & Commerce",
      avatar: "/assets/faculty/neha-tandon.png",
      bio: "I'm Neha Tandon. I have mentored thousands of working executives across Financial Accounting, Corporate Taxation, Managerial Economics, and Quantitative Decision Sciences."
    },
    {
      id: "hailey-stanton",
      name: "Dr. Hailey Stanton",
      designation: "International Faculty (11+ years)",
      qualification: "Ph.D. from Coventry University",
      avatar: "/assets/faculty/hailey-stanton.png",
      bio: "Hello, I'm Dr. Hailey Stanton. My research spans International Marketing, Digital Brand Analytics, and Consumer Behaviour across multinational retail ecosystems."
    },
    {
      id: "ronald-darnell",
      name: "Dr. Ronald Darnell",
      designation: "International Faculty",
      qualification: "Ph.D. from Capella University, MBA",
      avatar: "/assets/faculty/ronald-darnell.png",
      bio: "I'm Dr. Ronald Darnell. I bring 25+ years of senior executive leadership, corporate governance advisory, and business analytics instruction for Fortune 500 organizations."
    },
    {
      id: "sachit-paliwal",
      name: "Sachit Paliwal",
      designation: "Assistant Professor",
      qualification: "MBA in Finance Management",
      avatar: "/assets/faculty/sachit-paliwal.png",
      bio: "Hello, my name is Sachit Paliwal. I specialize in Investment Portfolio Analysis, FinTech Ecosystems, Corporate Valuation, and Advanced Capital Markets."
    },
  ];

  return (
    <>
      <Helmet>
        <title>{uni.name} — Online Degrees, Fees, Approvals & Admission 2026 | Degree Guru</title>
        <meta name="description" content={`Official information on ${uni.name} UGC-DEB approved online degrees, fee structure, no-cost EMI, and admission process. Free guidance on Degree Guru.`} />
        <link rel="canonical" href={`https://degreeguru.in/universities/${uni.slug}/`} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. SIMPLE CLEAR BREADCRUMB (Standard Page Flow like other pages)    */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="bg-muted/30 border-b border-border/50 py-3">
          <div className="container-dg max-w-6xl">
            <AppBreadcrumb
              items={[
                { label: "Universities", href: "/universities" },
                { label: uni.shortName || uni.name }
              ]}
            />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. HD UNIVERSITY FRONT IMAGE (Clearly Visible, Crisp, Unstretched) */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="container-dg max-w-6xl pt-1 sm:pt-2">
          <div className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 shadow-md bg-slate-900 aspect-[16/9] sm:aspect-[21/9] max-h-[340px] sm:max-h-[420px]">
            <img
              src={campusImage}
              alt={`${uni.name} Campus Facade`}
              className="w-full h-full object-cover object-[center_30%] transition-transform duration-500 hover:scale-101"
              loading="eager"
            />
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. UNIVERSITY PROFILE CARD                                        */}
        {/*    Logo pushed left & above, single-line name, no authority pills */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="relative -mt-7 sm:-mt-11 z-10 pb-3 sm:pb-5">
          <div className="container-dg max-w-6xl">
            <div className="p-4 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-5 relative">
              <div className="flex items-start gap-3 sm:gap-5 w-full md:w-auto">
                {/* Logo DP pushed left and above */}
                <div className="-mt-11 sm:-mt-16 -ml-2 sm:-ml-3 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-white p-2 sm:p-2.5 border-2 border-border shadow-md flex items-center justify-center shrink-0 z-10">
                  <img
                    src={isAmity ? "/logos/amity.png" : "/logos/cu.png"}
                    alt={uni.name}
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="space-y-1 sm:space-y-1.5 flex-1 min-w-0">
                  {/* Clean H1 in one line with reduced font size */}
                  <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-foreground tracking-tight whitespace-nowrap overflow-hidden text-ellipsis">
                    {uni.name}
                  </h1>

                  {/* Rating & Location (NO AICTE/NIRF/WES/UGC-DEB badges here per user request) */}
                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground">
                    <span className="flex items-center gap-1 text-foreground font-semibold">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      4.3 / 5 ({uni.reviewsCount || "4,120"}+ reviews)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} className="text-primary" /> {uni.location}
                    </span>
                    {uni.established && (
                      <>
                        <span className="hidden sm:inline">•</span>
                        <span className="hidden sm:flex items-center gap-1">
                          <Calendar size={12} /> Est. {uni.established}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-row sm:flex-col gap-2.5 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                <a
                  href="#counseling-box"
                  className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm text-center shadow-sm hover:bg-primary/90 transition-all"
                >
                  Apply for Admission
                </a>
                <Link
                  to="/universities/compare"
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-medium text-xs text-center border border-border transition-colors"
                >
                  Compare University
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 4. CLEAN STICKY SUBNAV TABS (Premium Underline, Fully Visible)      */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="sticky top-[96px] sm:top-[110px] md:top-[128px] z-30 bg-background border-b border-border shadow-xs">
          <div className="container-dg max-w-6xl">
            <div className="flex items-center gap-1 sm:gap-4 overflow-x-auto no-scrollbar py-0 text-xs sm:text-sm font-medium">
              {[
                { id: "overview", label: "About" },
                { id: "courses", label: isAmity ? "Courses & Fees (2026)" : "Courses & Fees" },
                { id: "placements", label: "Placements" },
                { id: "faculty", label: "Meet your Faculty" },
                { id: "admission", label: "Admission Process" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-3 sm:py-3.5 px-3.5 sm:px-5 border-b-2 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap outline-none focus:outline-none focus-visible:outline-none ${
                    activeTab === tab.id
                      ? "border-primary text-primary font-bold bg-primary/5 rounded-t-lg"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted-foreground/30 font-medium"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 5. MAIN CONTENT & COUNSELING SIDEBAR                              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="py-8">
          <div className="container-dg max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Tabbed Content */}
              <div className="lg:col-span-8 space-y-8">
                
                {/* ── TAB 1: OVERVIEW / ABOUT ── */}
                {activeTab === "overview" && (
                  <section className="space-y-6">
                    {/* About Section */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-bold text-foreground">
                          About <span className="text-primary">{uni.shortName || uni.name}</span>
                        </h2>
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {uni.description || `${uni.name} is India's first UGC-recognized online university, ranked among Asia's top digital higher education providers with global WES credential recognition.`}
                      </p>

                      {/* 6-Metric Clean Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Total Fee Range</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">{uni.feeRange}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">No-Cost EMI</span>
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                            From {uni.emiStarting || "₹3,850/mo"}
                          </span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Examination Mode</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">100% Online Web Proctored</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Learning Format</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">Live & Recorded Lectures</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Approvals</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">UGC-DEB • AICTE • WES</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Placement Support</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">350+ Recruiting Partners</span>
                        </div>
                      </div>
                    </div>

                    {/* ── STATUTORY RECOGNITION (Big, Clean HD Cards, Matching User Image 4) ── */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-foreground">
                          {uni.name} <span className="text-primary">Approved By</span>
                        </h3>
                      </div>

                      {/* 6 Big HD Authority Cards matching reference screenshot */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 pt-2">
                        {authorityLogos.map((auth, i) => (
                          <div
                            key={i}
                            className="group rounded-2xl bg-white border border-border/80 shadow-xs hover:shadow-md hover:border-primary/50 transition-all overflow-hidden flex items-center justify-center p-2 sm:p-3 aspect-[1.35/1] sm:aspect-[1.4/1]"
                          >
                            <img
                              src={auth.img}
                              alt={auth.name}
                              className="w-full h-full object-contain transition-transform duration-200 group-hover:scale-103"
                              loading="lazy"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* ── SAMPLE DEGREE CERTIFICATE SECTION (Clear Image with Clickable Zoom) ── */}
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        {/* Left Column: Value propositions */}
                        <div className="md:col-span-7 space-y-4">
                          <div className="space-y-1.5">
                            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                              Official Degree Equivalence
                            </span>
                            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                              Sample Certificate from {uni.name}
                            </h3>
                            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                              Become an alumnus of Amity Online and get a UGC-approved online degree. The degree awarded by the university is also been accredited by WES, etc.
                            </p>
                          </div>

                          {/* 4 Checkmark bullets matching reference */}
                          <div className="space-y-3 pt-1">
                            {[
                              "1st in India to get UGC approval for online programs",
                              "India's only Online MBA accredited by QS and ranked among the top 10 in Asia Pacific.",
                              "Degrees recognized by World Education Services (WES) across Canada & USA.",
                              "Ranked 22nd by NIRF in 2025",
                            ].map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2.5">
                                <div className="w-5 h-5 rounded-md bg-sky-100 text-sky-600 dark:bg-sky-950 dark:text-sky-400 flex items-center justify-center shrink-0 mt-0.5">
                                  <Check size={13} strokeWidth={3} />
                                </div>
                                <span className="text-xs sm:text-sm text-foreground/90 font-medium leading-snug">
                                  {item}
                                </span>
                              </div>
                            ))}
                          </div>

                          <div className="pt-2">
                            <a
                              href="#counseling-box"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
                            >
                              <span>Apply for UGC-accredited degree</span>
                              <ArrowRight size={13} />
                            </a>
                          </div>
                        </div>

                        {/* Right Column: Framed Sample Certificate with Instant Clickable Zoom */}
                        <div className="md:col-span-5 flex justify-center">
                          <Dialog>
                            <DialogTrigger asChild>
                              <div className="cursor-pointer group relative rounded-2xl overflow-hidden border-2 border-border/80 shadow-xl hover:shadow-2xl hover:border-primary/50 transition-all max-w-[280px] sm:max-w-[320px] bg-white">
                                <img
                                  src="/assets/universities/amity-sample-degree.png"
                                  alt="Amity University Sample Degree Certificate"
                                  className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-102"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white text-xs font-semibold backdrop-blur-[2px]">
                                  <ZoomIn size={18} />
                                  <span>Click to Zoom</span>
                                </div>
                              </div>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl p-6 bg-card border-border overflow-hidden">
                              <DialogHeader>
                                <DialogTitle className="text-base font-bold text-foreground">
                                  Amity University Online — Official Degree Specimen
                                </DialogTitle>
                              </DialogHeader>
                              <div className="flex flex-col items-center justify-center p-2 max-h-[80vh] overflow-y-auto">
                                <img
                                  src="/assets/universities/amity-sample-degree.png"
                                  alt="Amity University Online Degree Full Specimen"
                                  className="max-h-[75vh] w-auto object-contain rounded-xl border border-border shadow-2xl"
                                />
                                <div className="mt-3 text-center">
                                  <p className="text-xs text-muted-foreground font-medium">
                                    Official specimen conferred under UGC-DEB regulations. Legally equivalent to on-campus degrees.
                                  </p>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ── TAB 2: COURSES & FEES (Program Cards + Table matching Image 3) ── */}
                {activeTab === "courses" && (
                  <section className="space-y-8">
                    {/* 1. Program Cards Showcase (Matching Image 3) */}
                    <div className="space-y-5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                            {uni.name} <span className="text-primary">Courses</span>
                          </h2>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            UGC-DEB accredited online degrees designed for working professionals.
                          </p>
                        </div>

                        {/* Search Filter Input */}
                        <div className="relative min-w-[200px]">
                          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                          <input
                            type="text"
                            placeholder="Search programs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-card border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Clean Category Pills (UG, PG, Industry Collaborative, Integrated) */}
                      <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                        {[
                          { id: "ug", label: "UG Courses" },
                          { id: "pg", label: "PG Courses" },
                          { id: "collaborative", label: "Industry Collaborative" },
                          { id: "integrated", label: "Integrated Dual Degree" },
                        ].map((cat) => (
                          <button
                            key={cat.id}
                            onClick={() => setCourseCategoryTab(cat.id as any)}
                            className={`px-4 py-2 rounded-full text-xs font-semibold transition-all whitespace-nowrap ${
                              courseCategoryTab === cat.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "bg-card border border-border/80 text-foreground/80 hover:bg-muted"
                            }`}
                          >
                            {cat.label}
                          </button>
                        ))}
                      </div>

                      {/* PROGRAM CARDS GRID (Matching Image 3: Mobile scrollable cards, Desktop responsive grid) */}
                      <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-5 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 no-scrollbar snap-x">
                        {filteredAmityPrograms.slice(0, 10).map((prog) => {
                          const plan = paymentMode === "direct" ? prog.direct : prog.loan;
                          const thumb = getCourseThumbnail(prog);

                          return (
                            <div
                              key={prog.sNo}
                              className="w-[280px] sm:w-auto shrink-0 snap-start group rounded-3xl bg-card border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
                            >
                              <div>
                                {/* Top Thumbnail with Amity Badge (Matching Image 3) */}
                                <div className="relative h-44 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
                                  <img
                                    src={thumb}
                                    alt={prog.name}
                                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-103"
                                    loading="lazy"
                                  />
                                  {/* White Amity Crest Badge Overlay */}
                                  <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-white/95 backdrop-blur-sm shadow-xs border border-slate-200/90 flex items-center">
                                    <img src="/logos/amity.png" alt="Amity" className="h-5 w-auto object-contain" />
                                  </div>

                                  {prog.industryPartner && (
                                    <div className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full bg-emerald-600 text-white text-[10px] font-bold shadow-xs">
                                      {prog.industryPartner} Co-Created
                                    </div>
                                  )}
                                </div>

                                {/* Content Details */}
                                <div className="p-5 space-y-2.5">
                                  <span className="text-[10px] font-bold tracking-wider uppercase text-muted-foreground block">
                                    AMITY UNIVERSITY ONLINE
                                  </span>
                                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                                    {prog.name}
                                  </h3>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {prog.eligibility}
                                  </p>

                                  <div className="pt-2 flex items-center justify-between text-xs border-t border-border/40">
                                    <div className="space-y-0.5">
                                      <span className="text-[10px] text-muted-foreground block">Tuition Fee</span>
                                      <span className="text-sm font-bold text-foreground">
                                        ₹{plan.oneTimeFee.toLocaleString("en-IN")}
                                      </span>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                      <span className="text-[10px] text-muted-foreground block">Duration</span>
                                      <span className="text-xs font-semibold text-foreground">
                                        {prog.duration}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Card Footer Link */}
                              <div className="p-5 pt-0 flex items-center justify-between">
                                <a
                                  href="#counseling-box"
                                  onClick={() => setSelectedCourse(prog.name)}
                                  className="text-xs font-semibold text-primary group-hover:underline inline-flex items-center gap-1"
                                >
                                  <span>Read more</span>
                                  <ChevronRight size={14} />
                                </a>

                                <a
                                  href="#counseling-box"
                                  onClick={() => setSelectedCourse(prog.name)}
                                  className="px-3.5 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors shadow-xs"
                                >
                                  Apply Now
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* 2. Course Wise Updated Fees 2026 Table (Matching Image 3) */}
                    <div className="space-y-4 pt-4">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <h3 className="text-xl font-bold text-foreground">
                            Course Wise <span className="text-primary">Updated Fees 2026</span>
                          </h3>
                          <p className="text-xs text-muted-foreground">
                            Complete official July 26 fee breakdown across all degrees.
                          </p>
                        </div>

                        {/* Direct vs Loan Switcher */}
                        <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border/60 text-xs font-medium self-start sm:self-auto">
                          <button
                            onClick={() => setPaymentMode("direct")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              paymentMode === "direct"
                                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Direct Payment (Up to 12% off)
                          </button>
                          <button
                            onClick={() => setPaymentMode("loan")}
                            className={`px-3 py-1.5 rounded-lg transition-all ${
                              paymentMode === "loan"
                                ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            Loan General / 0% EMI
                          </button>
                        </div>
                      </div>

                      {/* Clean Table matching Image 3 */}
                      <div className="rounded-3xl border border-border overflow-hidden bg-card shadow-sm">
                        <div className="overflow-x-auto">
                          <table className="w-full text-left text-xs sm:text-sm">
                            <thead className="bg-[#002E5E] text-white text-xs font-semibold">
                              <tr>
                                <th className="py-3 px-4">Course</th>
                                <th className="py-3 px-4">Full Fees</th>
                                <th className="py-3 px-4">Semester Fee</th>
                                <th className="py-3 px-4">Duration</th>
                                <th className="py-3 px-4 text-right">Action</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                              {filteredAmityPrograms.map((prog) => {
                                const plan = paymentMode === "direct" ? prog.direct : prog.loan;
                                const isGreen = prog.name.includes("LENSKART");

                                return (
                                  <tr
                                    key={prog.sNo}
                                    className={`hover:bg-muted/40 transition-colors ${
                                      isGreen ? "bg-emerald-500/[0.04]" : ""
                                    }`}
                                  >
                                    <td className="py-3 px-4 font-semibold text-foreground">
                                      <div className="flex items-center gap-2">
                                        <span>{prog.name}</span>
                                        {isGreen && (
                                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                                            Lenskart
                                          </span>
                                        )}
                                      </div>
                                    </td>
                                    <td className="py-3 px-4 font-bold text-foreground">
                                      ₹{plan.oneTimeFee.toLocaleString("en-IN")}
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                      {plan.semesterFee > 0 ? `₹${plan.semesterFee.toLocaleString("en-IN")}` : "Annual basis"}
                                    </td>
                                    <td className="py-3 px-4 text-muted-foreground">
                                      {prog.duration}
                                    </td>
                                    <td className="py-3 px-4 text-right">
                                      <a
                                        href="#counseling-box"
                                        onClick={() => setSelectedCourse(prog.name)}
                                        className="text-primary hover:underline font-semibold text-xs inline-flex items-center gap-1"
                                      >
                                        Apply <ArrowRight size={11} />
                                      </a>
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ── TAB 3: PLACEMENTS (Real Logos, No Fillers) ── */}
                {activeTab === "placements" && (
                  <section className="space-y-6">
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Career Assistance & Hiring Drives
                        </span>
                        <h2 className="text-xl font-bold text-foreground">
                          Placement Support & Corporate Connect
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Amity Online provides dedicated corporate drives, virtual career fairs, mock interviews, and career counseling to bridge the gap between academic learning and corporate leadership.
                        </p>
                      </div>

                      {/* 3 Placement Highlights */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1">
                          <span className="text-[11px] text-muted-foreground font-medium block">Highest Package</span>
                          <span className="text-xl font-bold text-foreground block">₹18 LPA</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-semibold">Tier-1 MNCs</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1">
                          <span className="text-[11px] text-muted-foreground font-medium block">Average Package</span>
                          <span className="text-xl font-bold text-foreground block">₹7.2 LPA</span>
                          <span className="text-[10px] text-muted-foreground block font-medium">+55% Average Hike</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1 col-span-2 sm:col-span-1">
                          <span className="text-[11px] text-muted-foreground font-medium block">Hiring Partners</span>
                          <span className="text-xl font-bold text-foreground block">350+</span>
                          <span className="text-[10px] text-primary block font-medium">Virtual Campus Drives</span>
                        </div>
                      </div>

                      {/* 12 Real Recruiting Company Logos (No Text Fillers) */}
                      <div className="space-y-3 pt-2">
                        <div className="flex items-center justify-between">
                          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                            Top Recruiting Companies
                          </h3>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                          {placementCompanies.map((comp, idx) => (
                            <div
                              key={idx}
                              className="h-16 rounded-2xl bg-white border border-border/80 shadow-xs flex items-center justify-center p-3 hover:shadow-md transition-shadow"
                            >
                              <img
                                src={comp.logo}
                                alt={comp.name}
                                className="max-h-8 max-w-[85%] object-contain"
                                loading="lazy"
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Career Acceleration Highlights */}
                      <div className="pt-2 border-t border-border/50 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-xs font-semibold text-foreground block">Resume Enhancement</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">ATS-friendly resumes curated by HR leaders.</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-xs font-semibold text-foreground block">1-on-1 Mentorship</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Mock technical & behavioural interviews.</p>
                        </div>
                        <div className="p-3.5 rounded-2xl bg-muted/20 border border-border/40">
                          <span className="text-xs font-semibold text-foreground block">Virtual Job Fairs</span>
                          <p className="text-[11px] text-muted-foreground mt-0.5">Bi-annual job fairs across 350+ partners.</p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ── TAB 4: FACULTY (Exact Members from User Reference) ── */}
                {activeTab === "faculty" && (
                  <section className="space-y-6">
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Distinguished Mentors
                        </span>
                        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
                          Meet your Faculty
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Learn directly from internationally acclaimed researchers, professors, and industry leaders with decades of academic rigor and corporate executive experience.
                        </p>
                      </div>

                      {/* 6 Faculty Cards (Matching User Reference) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {facultyMembers.map((fac) => (
                          <div
                            key={fac.id}
                            className="p-4 rounded-2xl bg-card border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div className="space-y-3">
                              {/* Avatar & Core Designation */}
                              <div className="flex items-start gap-3">
                                <div className="w-16 h-16 rounded-xl bg-slate-100 overflow-hidden border border-border/60 shrink-0">
                                  <img
                                    src={fac.avatar}
                                    alt={fac.name}
                                    className="w-full h-full object-cover object-top"
                                    loading="lazy"
                                  />
                                </div>
                                <div className="space-y-0.5">
                                  <h3 className="text-sm font-bold text-foreground leading-tight">
                                    {fac.name}
                                  </h3>
                                  <p className="text-xs font-medium text-primary">
                                    {fac.designation}
                                  </p>
                                  <p className="text-[11px] text-muted-foreground truncate max-w-[150px]">
                                    {fac.qualification}
                                  </p>
                                </div>
                              </div>

                              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                                {fac.bio}
                              </p>
                            </div>

                            {/* View More Modal Trigger */}
                            <div className="pt-3 mt-2 border-t border-border/40">
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button
                                    onClick={() => setSelectedFaculty(fac)}
                                    className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors inline-flex items-center gap-1"
                                  >
                                    <span>View More</span>
                                    <ArrowRight size={12} />
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md p-6 bg-card border-border">
                                  <DialogHeader>
                                    <DialogTitle className="text-base font-bold text-foreground">
                                      Faculty Profile
                                    </DialogTitle>
                                  </DialogHeader>
                                  <div className="space-y-4 pt-2">
                                    <div className="flex items-center gap-4">
                                      <img
                                        src={fac.avatar}
                                        alt={fac.name}
                                        className="w-20 h-20 rounded-2xl object-cover border border-border shadow-sm"
                                      />
                                      <div>
                                        <h3 className="text-base font-bold text-foreground">{fac.name}</h3>
                                        <div className="text-xs font-semibold text-primary">{fac.designation}</div>
                                        <div className="text-xs text-muted-foreground mt-0.5">{fac.qualification}</div>
                                      </div>
                                    </div>
                                    <div className="p-3.5 rounded-xl bg-muted/40 border border-border/50 text-xs text-foreground/90 leading-relaxed">
                                      {fac.bio}
                                    </div>
                                    <div className="text-[11px] text-muted-foreground flex items-center gap-1.5">
                                      <CheckCircle2 size={13} className="text-emerald-500" />
                                      <span>Conducts live weekend masterclasses & doubt-solving clinics</span>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ── TAB 5: ADMISSION PROCESS ── */}
                {activeTab === "admission" && (
                  <section className="space-y-6">
                    <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Digital & Hassle-Free
                        </span>
                        <h2 className="text-xl font-bold text-foreground">
                          3-Step Online Admission Process
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Admission to {uni.name} is conducted 100% online through Degree Guru with zero processing charges.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                            01
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">Select Program</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Choose your degree from the July 26 fee sheet and consult an academic advisor on specializations and discounts.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                            02
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">Submit Documents</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Upload your marksheets and government ID for immediate UGC-DEB eligibility verification.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                          <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                            03
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">0% EMI & LMS Activation</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Complete fee payment or activate zero-cost monthly installments to receive immediate LMS student portal access.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ── LOOKING FOR MORE OPTIONS BANNER ── */}
                <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/25 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">Unbiased Comparison</span>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">
                        Looking for More Options?
                      </h2>
                      <p className="text-xs text-muted-foreground max-w-xl">
                        Compare {uni.name} with other top UGC-DEB approved online universities on fees, faculty, and career outcomes.
                      </p>
                    </div>

                    <Link
                      to="/universities/compare"
                      className="px-5 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-1.5 shrink-0"
                    >
                      <span>Compare Universities</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                </section>
              </div>

              {/* Right Column: Sticky Quick Counseling Form */}
              <div id="counseling-box" className="lg:col-span-4 sticky top-32 space-y-4">
                <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-lg space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <ShieldCheck size={20} className="text-primary" />
                    <div>
                      <h3 className="text-sm font-semibold text-foreground">Free Admission Support</h3>
                      <p className="text-[11px] text-muted-foreground">Official fee breakdown & eligibility</p>
                    </div>
                  </div>

                  {submitted ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-medium flex items-center gap-2">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span>Request received! Our academic counselor will connect with the fee breakdown shortly.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-3">
                      <div>
                        <label htmlFor={nameInputId} className="block text-[11px] font-medium text-muted-foreground mb-1">
                          Full Name
                        </label>
                        <input
                          id={nameInputId}
                          type="text"
                          required
                          placeholder="Your Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor={phoneInputId} className="block text-[11px] font-medium text-muted-foreground mb-1">
                          WhatsApp Mobile Number
                        </label>
                        <input
                          id={phoneInputId}
                          type="tel"
                          required
                          placeholder="10-digit mobile number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        />
                      </div>

                      <div>
                        <label htmlFor={courseSelectId} className="block text-[11px] font-medium text-muted-foreground mb-1">
                          Select Program
                        </label>
                        <select
                          id={courseSelectId}
                          value={selectedCourse}
                          onChange={(e) => setSelectedCourse(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        >
                          <option value="">Choose a Program...</option>
                          {isAmity
                            ? AMITY_JULY_26_FEE_STRUCTURE.map((p) => (
                                <option key={p.sNo} value={p.name}>
                                  {p.name} ({p.type})
                                </option>
                              ))
                            : genericPrograms.map((p, i) => (
                                <option key={i} value={p.name}>
                                  {p.name} ({p.levelKey.toUpperCase()})
                                </option>
                              ))}
                        </select>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send size={13} />
                        <span>Get Free Shortlist & Fees</span>
                      </Button>

                      <p className="text-[10px] text-muted-foreground text-center">
                        Zero spam • 100% Free counseling & zero hidden fees
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UniversityDetail;
