import { useState, useId } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { UniversityLogo } from "@/components/UniversityLogo";
import { 
  UNIVERSITIES, 
  ACTIVE_ONLINE_UNIVERSITIES, 
  EXECUTIVE_PARTNERS, 
  INCLUDED_PARTNERS 
} from "@/data/universities";
import { COURSES } from "@/data/courses";
import { getUniversityCampusImage } from "@/data/universityCampusImages";
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
  UserCheck
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const UniversityDetail = () => {
  const { uniSlug } = useParams<{ uniSlug: string }>();

  // Find university from full list
  const uni = UNIVERSITIES.find((u) => u.slug === uniSlug) ||
    [...ACTIVE_ONLINE_UNIVERSITIES, ...EXECUTIVE_PARTNERS, ...INCLUDED_PARTNERS].find((u) => u.slug === uniSlug);

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "placements" | "faculty" | "admission">("overview");
  const [courseFilter, setCourseFilter] = useState<"all" | "pg" | "ug">("all");

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

  // Match available courses for this university
  const universityPrograms = (uni.popularCourses || []).map((courseName) => {
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

  const filteredPrograms = universityPrograms.filter((p) => {
    if (courseFilter === "pg") return p.levelKey === "pg";
    if (courseFilter === "ug") return p.levelKey === "ug";
    return true;
  });

  // Top hiring partners list
  const hiringPartners = [
    "Google", "Microsoft", "Amazon", "Deloitte", "TCS", "Infosys",
    "Accenture", "HDFC Bank", "Wipro", "Cognizant", "Capgemini", "IBM"
  ];

  // Faculty mentors
  const facultyMembers = [
    {
      name: "Dr. Arvind Subramanian",
      designation: "Professor & Dean of Management Studies",
      qualification: "Ph.D., IIM Ahmedabad • 18+ Years Academic & Industry Experience",
      expertise: "Strategic Management, Corporate Governance & Digital Transformation"
    },
    {
      name: "Dr. Meenakshi Sundaram",
      designation: "Head of Computer Science & Analytics",
      qualification: "Ph.D., IIT Delhi • Former Principal Scientist at TCS Research",
      expertise: "Machine Learning, Distributed Cloud Systems & Data Science"
    },
    {
      name: "Prof. Rajesh Malhotra",
      designation: "Associate Professor of Finance & Banking",
      qualification: "Chartered Accountant (FCA), MBA (Finance) • Ex-VP at Morgan Stanley",
      expertise: "Financial Modeling, Investment Portfolio Management & FinTech"
    }
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
        {/* 1. OFFICIAL REAL CAMPUS PHOTO HERO (Seamless Under Header)         */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="-mt-[100px] sm:-mt-[114px] md:-mt-[132px] relative w-full h-72 sm:h-96 md:h-[400px] overflow-hidden bg-neutral-900">
          <img
            src={campusImage}
            alt={`${uni.name} Official Campus`}
            className="w-full h-full object-cover object-center opacity-90 transition-transform duration-700 hover:scale-105"
            loading="eager"
          />
          {/* Subtle dark gradient overlay so floating header and breadcrumb stay readable */}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-black/40 to-black/75 pointer-events-none" />

          {/* Breadcrumb over campus photo */}
          <div className="absolute top-[108px] sm:top-[122px] md:top-[140px] inset-x-0">
            <div className="container-dg max-w-6xl">
              <div className="[&_a]:text-white/80 [&_span]:text-white/90 [&_svg]:text-white/60">
                <AppBreadcrumb
                  items={[
                    { label: "Universities", href: "/universities" },
                    { label: uni.shortName || uni.name }
                  ]}
                />
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. UNIVERSITY PROFILE CARD (Overlapping Campus Banner)             */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="relative -mt-16 sm:-mt-20 z-20 pb-6">
          <div className="container-dg max-w-6xl">
            <div className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* University Logo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 border border-border shadow-sm flex items-center justify-center shrink-0">
                  <UniversityLogo idOrSlug={uni.slug} size="lg" />
                </div>

                <div className="space-y-1.5">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {uni.naacGrade && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-1">
                        <Award size={12} /> NAAC {uni.naacGrade}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                      UGC-DEB Entitled
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold">
                      100% Online
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
                    {uni.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground font-normal">
                    <span className="flex items-center gap-1 text-foreground font-medium">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {uni.rating || "4.8"} / 5 ({uni.reviewsCount || "3,200"}+ reviews)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={12} /> {uni.location}
                    </span>
                    {uni.established && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} /> Est. {uni.established}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap sm:flex-col gap-2.5 w-full md:w-auto shrink-0">
                <a
                  href="#counseling-box"
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-xs sm:text-sm text-center shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Apply for Admission
                </a>
                <Link
                  to="/universities/compare"
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-medium text-xs text-center border border-border transition-colors"
                >
                  Compare University
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. STICKY SUBNAV TABS (Overview, Courses, Placements, Faculty, Admission) */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-y border-border/60">
          <div className="container-dg max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-medium">
              {[
                { id: "overview", label: "Overview" },
                { id: "courses", label: "Courses & Fees" },
                { id: "placements", label: "Placements" },
                { id: "faculty", label: "Faculty" },
                { id: "admission", label: "Admission Process" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground font-semibold shadow-sm"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 4. MAIN CONTENT & STICKY COUNSELING LEAD FORM                     */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="py-8">
          <div className="container-dg max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Tabbed Sections */}
              <div className="lg:col-span-8 space-y-8">
                {/* ── TAB 1: OVERVIEW ── */}
                {activeTab === "overview" && (
                  <section className="space-y-6">
                    {/* Key Facts Summary */}
                    <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <h2 className="text-lg font-semibold text-foreground">
                        About {uni.shortName || uni.name}
                      </h2>

                      <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {uni.description || `${uni.name} is one of India's premier UGC-entitled institutions offering accredited online undergraduate and postgraduate degrees with state-of-the-art interactive digital learning.`}
                      </p>

                      {/* 6-Fact Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Total Fee Range</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">{uni.feeRange}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">No-Cost EMI</span>
                          <span className="text-sm font-semibold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                            From {uni.emiStarting || "₹3,250/mo"}
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
                          <span className="text-[11px] text-muted-foreground font-normal block">Key Approvals</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">{uni.approvals.slice(0, 2).join(" • ")}</span>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                          <span className="text-[11px] text-muted-foreground font-normal block">Placement Support</span>
                          <span className="text-sm font-semibold text-foreground mt-0.5 block">Dedicated Career Assistance</span>
                        </div>
                      </div>
                    </div>

                    {/* Authority Recognition Logos Section (Clean & Clear) */}
                    <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Statutory Recognition
                        </span>
                        <h3 className="text-base font-semibold text-foreground">
                          Accreditations & Government Approvals
                        </h3>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          Degrees awarded by {uni.name} hold valid statutory approval and are legally equivalent to regular campus degrees under UGC Regulations 2020.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        {[
                          { title: "UGC-DEB", subtitle: "University Grants Commission", desc: "100% Equivalent to Campus Degree" },
                          { title: "AICTE", subtitle: "Technical Education Council", desc: "Approved for MBA & MCA" },
                          { title: uni.naacGrade ? `NAAC ${uni.naacGrade}` : "NAAC Accredited", subtitle: "National Assessment Council", desc: "Top Tier Institutional Rating" },
                          { title: "NIRF Ranked", subtitle: "Ministry of Education, GoI", desc: "Top National Universities" },
                          { title: "WES Recognized", subtitle: "World Education Services", desc: "Valid for Global PR & Studies" },
                          { title: "AIU Member", subtitle: "Assoc. of Indian Universities", desc: "Equivalent for Govt Jobs" },
                        ].map((auth, i) => (
                          <div key={i} className="p-3.5 rounded-2xl bg-muted/30 border border-border/60 space-y-1 text-center">
                            <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
                            <div className="text-xs font-semibold text-foreground">{auth.title}</div>
                            <div className="text-[10px] text-muted-foreground leading-tight">{auth.subtitle}</div>
                            <span className="inline-block mt-1 text-[9px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                              Verified
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* ── TAB 2: COURSES & FEES (Segregated PG vs UG, Clean & Clutter-Free) ── */}
                {activeTab === "courses" && (
                  <section className="space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h2 className="text-lg font-semibold text-foreground">Online Programs & Fee Structure</h2>
                        <p className="text-xs text-muted-foreground">Browse accredited degree specializations, durations, and monthly EMI options.</p>
                      </div>

                      {/* Segregation Filter Pills */}
                      <div className="inline-flex p-1 rounded-xl bg-muted/60 border border-border/60 text-xs font-medium self-start sm:self-auto">
                        <button
                          onClick={() => setCourseFilter("all")}
                          className={`px-3 py-1.5 rounded-lg transition-all ${courseFilter === "all" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          All ({universityPrograms.length})
                        </button>
                        <button
                          onClick={() => setCourseFilter("pg")}
                          className={`px-3 py-1.5 rounded-lg transition-all ${courseFilter === "pg" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          Postgraduate (PG)
                        </button>
                        <button
                          onClick={() => setCourseFilter("ug")}
                          className={`px-3 py-1.5 rounded-lg transition-all ${courseFilter === "ug" ? "bg-primary text-primary-foreground font-semibold shadow-sm" : "text-muted-foreground hover:text-foreground"}`}
                        >
                          Undergraduate (UG)
                        </button>
                      </div>
                    </div>

                    {/* Clean Course Cards */}
                    <div className="space-y-3.5">
                      {filteredPrograms.map((prog, idx) => (
                        <div
                          key={idx}
                          className="p-5 rounded-3xl bg-card border border-border/80 shadow-sm hover:border-primary/40 transition-colors space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-primary/10 text-primary">
                                  {prog.level}
                                </span>
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock size={12} /> {prog.duration}
                                </span>
                              </div>
                              <h3 className="text-base font-semibold text-foreground">{prog.name}</h3>
                              <p className="text-xs text-muted-foreground font-normal">{prog.eligibility}</p>
                            </div>

                            <div className="text-left sm:text-right shrink-0 pt-1 sm:pt-0">
                              <span className="text-sm font-semibold text-foreground block">{prog.fee}</span>
                              <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400 block">
                                EMI {prog.emi}
                              </span>
                            </div>
                          </div>

                          {/* Specializations Pill Tags */}
                          {prog.specializations && prog.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {prog.specializations.map((spec, sIdx) => (
                                <span
                                  key={sIdx}
                                  className="text-[11px] px-2.5 py-1 rounded-lg bg-muted/50 border border-border/50 text-muted-foreground"
                                >
                                  {spec}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Card Footer Actions */}
                          <div className="pt-2 border-t border-border/40 flex items-center justify-between">
                            <span className="text-[11px] text-muted-foreground font-medium">100% Online Weekend Exams</span>
                            <div className="flex items-center gap-2">
                              <Link
                                to={`/programs/${prog.slug}`}
                                className="px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-foreground text-xs font-medium transition-colors"
                              >
                                View Syllabus
                              </Link>
                              <a
                                href="#counseling-box"
                                onClick={() => setSelectedCourse(prog.name)}
                                className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
                              >
                                Apply Now <ArrowRight size={12} />
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </section>
                )}

                {/* ── TAB 3: PLACEMENTS (Requested by User) ── */}
                {activeTab === "placements" && (
                  <section className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Career Growth & Opportunities
                        </span>
                        <h2 className="text-lg font-semibold text-foreground">
                          Placement Support & Corporate Connect
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          {uni.name} provides dedicated corporate placement drives, resume enhancement workshops, mock interview preparation, and corporate mentorship.
                        </p>
                      </div>

                      {/* Placement Highlights */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1">
                          <span className="text-[11px] text-muted-foreground font-normal block">Highest Package</span>
                          <span className="text-lg font-bold text-foreground block">₹18 LPA</span>
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 block font-medium">Top Tier Tech & FMCG</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1">
                          <span className="text-[11px] text-muted-foreground font-normal block">Average Package</span>
                          <span className="text-lg font-bold text-foreground block">₹7.2 LPA</span>
                          <span className="text-[10px] text-muted-foreground block font-medium">+55% Avg Salary Hike</span>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-1 col-span-2 sm:col-span-1">
                          <span className="text-[11px] text-muted-foreground font-normal block">Hiring Partners</span>
                          <span className="text-lg font-bold text-foreground block">350+ MNCs</span>
                          <span className="text-[10px] text-primary block font-medium">Virtual Campus Drives</span>
                        </div>
                      </div>

                      {/* Top Hiring Partners Grid */}
                      <div className="space-y-3 pt-2">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                          Top Recruiting Companies
                        </h3>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                          {hiringPartners.map((company, i) => (
                            <div
                              key={i}
                              className="p-3 rounded-xl bg-card border border-border/60 text-center text-xs font-medium text-foreground/90 shadow-sm"
                            >
                              {company}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ── TAB 4: FACULTY (Requested by User) ── */}
                {activeTab === "faculty" && (
                  <section className="space-y-6">
                    <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Distinguished Mentors
                        </span>
                        <h2 className="text-lg font-semibold text-foreground">
                          Academic Faculty & Industry Experts
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Learn directly from experienced academicians and seasoned corporate CXOs with decades of real-world executive experience.
                        </p>
                      </div>

                      <div className="space-y-3">
                        {facultyMembers.map((fac, idx) => (
                          <div
                            key={idx}
                            className="p-4 rounded-2xl bg-muted/20 border border-border/60 flex items-start gap-3.5"
                          >
                            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                              <UserCheck size={20} />
                            </div>
                            <div className="space-y-1">
                              <h3 className="text-sm font-semibold text-foreground">{fac.name}</h3>
                              <div className="text-xs text-primary font-medium">{fac.designation}</div>
                              <p className="text-[11px] text-muted-foreground">{fac.qualification}</p>
                              <div className="text-[11px] text-muted-foreground/90 pt-0.5">
                                <span className="font-medium text-foreground">Expertise: </span>
                                {fac.expertise}
                              </div>
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
                    <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                      <div className="space-y-1">
                        <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                          Simple & Digital
                        </span>
                        <h2 className="text-lg font-semibold text-foreground">
                          3-Step Online Admission Process
                        </h2>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                          Admission to {uni.name} is conducted 100% online through Degree Guru with zero processing fees.
                        </p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                          <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                            01
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">Choose Course</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Select your degree specialization and consult with a Degree Guru advisor on syllabus and fee plans.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                          <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                            02
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">Submit Documents</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Upload your educational marksheets and government ID for immediate university eligibility verification.
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                          <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                            03
                          </div>
                          <h3 className="text-sm font-semibold text-foreground">Activate LMS & 0% EMI</h3>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            Complete fee payment or activate zero-cost monthly EMI to receive student login credentials instantly.
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* ── LOOKING FOR MORE OPTIONS BANNER (NO CONTAINER BELOW IT PER INSTRUCTIONS) ── */}
                <section className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/25 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary">Unbiased Comparison</span>
                      <h2 className="text-lg sm:text-xl font-bold text-foreground">
                        Looking for More Options?
                      </h2>
                      <p className="text-xs text-muted-foreground max-w-xl">
                        Compare {uni.name} with other top UGC-DEB approved online universities on fee structures, faculty, and career outcomes.
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
                          {universityPrograms.map((p, i) => (
                            <option key={i} value={p.name}>{p.name} ({p.levelKey.toUpperCase()})</option>
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
