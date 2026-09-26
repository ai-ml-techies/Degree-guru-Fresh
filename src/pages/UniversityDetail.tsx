import { useState, useId, useRef } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { UniversityLogo } from "@/components/UniversityLogo";
import { 
  UNIVERSITIES, 
  University, 
  ACTIVE_ONLINE_UNIVERSITIES, 
  EXECUTIVE_PARTNERS, 
  INCLUDED_PARTNERS 
} from "@/data/universities";
import { COURSES } from "@/data/courses";
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
  FileCheck, 
  HelpCircle,
  Laptop,
  Briefcase,
  ChevronDown,
  Send,
  Star,
  Check,
  Calendar,
  Layers,
  FileText
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { Button } from "@/components/ui/button";

export const UniversityDetail = () => {
  const { uniSlug } = useParams<{ uniSlug: string }>();

  // Find university from full list
  const uni = UNIVERSITIES.find((u) => u.slug === uniSlug) ||
    [...ACTIVE_ONLINE_UNIVERSITIES, ...EXECUTIVE_PARTNERS, ...INCLUDED_PARTNERS].find((u) => u.slug === uniSlug);

  const [activeTab, setActiveTab] = useState<"overview" | "courses" | "approvals" | "admission" | "faqs">("overview");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

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

    return {
      name: courseName,
      slug: matched?.slug || courseName.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      level: matched?.level || (courseName.includes("MBA") || courseName.includes("MCA") || courseName.includes("M.Sc") || courseName.includes("M.Com") ? "Postgraduate" : "Undergraduate"),
      duration: matched?.duration || (courseName.includes("BCA") || courseName.includes("BBA") || courseName.includes("B.Com") ? "3 Years" : "2 Years"),
      fee: matched?.feeRange || uni.feeRange || "₹60,000 – ₹1,80,000",
      emi: matched?.emiStarting || uni.emiStarting || "From ₹3,250/mo",
      eligibility: matched?.eligibility ? matched.eligibility.split(".")[0] : "10+2 / Graduation pass from recognized board or university with 50% marks",
    };
  });

  return (
    <>
      <Helmet>
        <title>{uni.name} — Online Degrees, Fees, Approvals & Admission 2026 | Degree Guru</title>
        <meta name="description" content={`Explore ${uni.name} UGC-DEB approved online degrees, fee structure, no-cost EMI, and admission process. 100% free guidance on Degree Guru.`} />
        <link rel="canonical" href={`https://degreeguru.in/universities/${uni.slug}/`} />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. HERO & CAMPUS BANNER                                           */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <section className="relative bg-gradient-to-b from-primary/10 via-background to-background pt-6 pb-8 border-b border-border/60">
          <div className="container-dg max-w-6xl space-y-6">
            <AppBreadcrumb
              items={[
                { label: "Universities", href: "/universities" },
                { label: uni.shortName || uni.name }
              ]}
            />

            {/* University Profile Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="flex items-start gap-4 sm:gap-5">
                {/* University Logo */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white p-2 border border-border shadow-sm flex items-center justify-center shrink-0">
                  <UniversityLogo idOrSlug={uni.slug} size="lg" />
                </div>

                <div className="space-y-2">
                  {/* Badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {uni.naacGrade && (
                      <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1">
                        <Award size={12} /> NAAC {uni.naacGrade}
                      </span>
                    )}
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
                      UGC-DEB Entitled
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                      100% Online
                    </span>
                  </div>

                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-foreground tracking-tight">
                    {uni.name}
                  </h1>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground font-medium">
                    <span className="flex items-center gap-1 text-foreground font-semibold">
                      <Star size={13} className="fill-amber-400 text-amber-400" />
                      {uni.rating || "4.8"} / 5 ({uni.reviewsCount || "3,200"}+ reviews)
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <MapPin size={13} /> {uni.location}
                    </span>
                    {uni.established && (
                      <>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar size={13} /> Est. {uni.established}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Header CTAs */}
              <div className="flex flex-wrap sm:flex-col gap-2.5 w-full md:w-auto shrink-0">
                <a
                  href="#counseling-box"
                  className="flex-1 sm:flex-none px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm text-center shadow-md shadow-primary/20 hover:bg-primary/90 transition-all"
                >
                  Apply for Admission
                </a>
                <Link
                  to="/universities/compare"
                  className="flex-1 sm:flex-none px-5 py-3 rounded-xl bg-muted/60 hover:bg-muted text-foreground font-semibold text-xs text-center border border-border transition-colors"
                >
                  Compare University
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. STICKY MINIMAL NAVIGATION TABS (Strictly no LMS, Coupon, etc.)  */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="sticky top-16 z-30 bg-background/95 backdrop-blur-md border-b border-border/60">
          <div className="container-dg max-w-6xl">
            <div className="flex items-center gap-2 overflow-x-auto py-2.5 no-scrollbar text-xs font-semibold">
              {[
                { id: "overview", label: "Overview" },
                { id: "courses", label: "Courses & Fees" },
                { id: "approvals", label: "Approvals & Rankings" },
                { id: "admission", label: "Admission Process" },
                { id: "faqs", label: "FAQs" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-primary text-primary-foreground font-bold shadow-sm"
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
        {/* 3. MAIN CONTENT & STICKY LEAD FORM                                */}
        {/* ───────────────────────────────────────────────────────────────── */}
        <div className="py-10">
          <div className="container-dg max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Tabbed Content */}
              <div className="lg:col-span-8 space-y-8">
                {/* ── TAB 1: OVERVIEW ── */}
                {(activeTab === "overview" || activeTab === "courses") && (
                  <section className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                    <h2 className="text-xl font-bold text-foreground">
                      About {uni.shortName || uni.name}
                    </h2>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {uni.description || `${uni.name} is a premier UGC-DEB entitled online education provider offering career-aligned undergraduate and postgraduate degrees with state-of-the-art interactive digital learning.`}
                    </p>

                    {/* Key Facts Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                        <span className="text-[11px] text-muted-foreground font-medium block">Total Fee Range</span>
                        <span className="text-sm font-extrabold text-foreground mt-0.5 block">{uni.feeRange}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                        <span className="text-[11px] text-muted-foreground font-medium block">No-Cost EMI</span>
                        <span className="text-sm font-extrabold text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                          From {uni.emiStarting || "₹3,250/mo"}
                        </span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                        <span className="text-[11px] text-muted-foreground font-medium block">Examination Mode</span>
                        <span className="text-sm font-extrabold text-foreground mt-0.5 block">100% Online Web Proctored</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                        <span className="text-[11px] text-muted-foreground font-medium block">Learning Format</span>
                        <span className="text-sm font-extrabold text-foreground mt-0.5 block">Live & Recorded Lectures</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                        <span className="text-[11px] text-muted-foreground font-medium block">Accreditation</span>
                        <span className="text-sm font-extrabold text-foreground mt-0.5 block">{uni.approvals.slice(0, 2).join(" • ")}</span>
                      </div>

                      <div className="p-3.5 rounded-2xl bg-muted/30 border border-border/60">
                        <span className="text-[11px] text-muted-foreground font-medium block">Placement Support</span>
                        <span className="text-sm font-extrabold text-foreground mt-0.5 block">Virtual Placement Drives</span>
                      </div>
                    </div>

                    {/* Highlights Pills */}
                    {uni.highlights && uni.highlights.length > 0 && (
                      <div className="space-y-2 pt-2 border-t border-border/40">
                        <span className="text-xs font-bold text-foreground block">Key Highlights:</span>
                        <div className="space-y-1.5">
                          {uni.highlights.map((h, i) => (
                            <div key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <Check size={14} className="text-primary mt-0.5 shrink-0" />
                              <span>{h}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </section>
                )}

                {/* ── TAB 2: COURSES & FEES ── */}
                <section className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-foreground">Available Online Degrees & Fees</h2>
                      <p className="text-xs text-muted-foreground mt-0.5">UGC-DEB approved programs with flexible semester exams</p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {universityPrograms.map((prog, idx) => (
                      <div
                        key={idx}
                        className="p-4 sm:p-5 rounded-2xl bg-muted/20 border border-border/70 hover:border-primary/40 transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                              {prog.level}
                            </span>
                            <span className="text-xs text-muted-foreground font-medium flex items-center gap-1">
                              <Clock size={12} /> {prog.duration}
                            </span>
                          </div>
                          <h3 className="text-base font-bold text-foreground">{prog.name}</h3>
                          <p className="text-xs text-muted-foreground">{prog.eligibility}</p>
                        </div>

                        <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto shrink-0 gap-1 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40">
                          <div className="text-left sm:text-right">
                            <span className="text-xs font-bold text-foreground block">{prog.fee}</span>
                            <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">
                              EMI {prog.emi}
                            </span>
                          </div>
                          <a
                            href="#counseling-box"
                            onClick={() => setSelectedCourse(prog.name)}
                            className="px-3.5 py-1.5 rounded-lg bg-primary text-primary-foreground font-bold text-xs hover:bg-primary/90 transition-colors inline-flex items-center gap-1"
                          >
                            Apply Now
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── TAB 3: APPROVALS & ACCREDITATIONS ── */}
                <section className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Approvals & Accreditations</h2>
                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    Under the University Grants Commission (UGC) Regulations 2020, degrees awarded through online mode
                    by entitled institutions are completely equivalent to regular campus degrees for central and state government jobs,
                    UPSC, PSU recruitment, and higher postgraduate studies.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                    {uni.approvals.map((app, i) => (
                      <div key={i} className="p-3 rounded-xl bg-muted/30 border border-border/60 text-center space-y-1">
                        <CheckCircle2 size={18} className="text-emerald-500 mx-auto" />
                        <span className="text-xs font-bold text-foreground block">{app}</span>
                        <span className="text-[10px] text-muted-foreground block">Govt Approved</span>
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── TAB 4: ADMISSION PROCESS ── */}
                <section className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-5">
                  <h2 className="text-xl font-bold text-foreground">3-Step Easy Admission Process</h2>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                        01
                      </div>
                      <h3 className="text-sm font-bold text-foreground">Choose Program</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Select your degree and connect with a Degree Guru counselor for fee and scholarship guidance.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                        02
                      </div>
                      <h3 className="text-sm font-bold text-foreground">Verify Documents</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Submit digital copies of your marksheets and ID proof for instant university eligibility check.
                      </p>
                    </div>

                    <div className="p-4 rounded-2xl bg-muted/20 border border-border/60 space-y-2">
                      <div className="w-8 h-8 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center">
                        03
                      </div>
                      <h3 className="text-sm font-bold text-foreground">Start Learning</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Pay semester fee or activate 0% interest monthly EMI to receive student credentials and LMS access.
                      </p>
                    </div>
                  </div>
                </section>

                {/* ── TAB 5: FAQS ── */}
                <section className="p-6 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-sm space-y-4">
                  <h2 className="text-xl font-bold text-foreground">Frequently Asked Questions</h2>

                  <div className="space-y-2.5">
                    {[
                      {
                        q: `Is an online degree from ${uni.shortName} legally valid for government jobs?`,
                        a: `Yes. Under UGC-DEB notifications, online degrees awarded by UGC-entitled universities like ${uni.shortName} are fully recognized for UPSC, SSC, Banking, state PSCs, and all private corporate roles.`
                      },
                      {
                        q: `How are semester examinations conducted?`,
                        a: "All semester examinations are conducted 100% online through an AI-proctored web platform. You can take your exams conveniently from home or office on weekends."
                      },
                      {
                        q: `What is the monthly EMI option available?`,
                        a: `Students can opt for 0% interest no-cost EMI starting from ${uni.emiStarting || "₹3,250/month"} with zero collateral through verified banking and NBFC partners.`
                      },
                      {
                        q: `Can working professionals manage the study schedule?`,
                        a: "Yes. All lectures are recorded and accessible 24/7 on the student mobile app and LMS, requiring only 6–8 hours of flexible study per week."
                      }
                    ].map((faq, idx) => (
                      <div key={idx} className="rounded-xl bg-muted/20 border border-border/60 overflow-hidden">
                        <button
                          type="button"
                          onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                          className="w-full p-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors"
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
                          <div className="px-4 pb-4 text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-2.5">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* ── LOOKING FOR MORE OPTIONS CONTAINER (NO CONTAINER BELOW IT PER USER SPEC) ── */}
                <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/25 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-primary">Unbiased Comparison</span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-foreground">
                        Looking for More Options?
                      </h2>
                      <p className="text-xs sm:text-sm text-muted-foreground max-w-xl">
                        Compare {uni.name} with other top UGC-DEB entitled online universities on fees, LMS features, and placements.
                      </p>
                    </div>

                    <Link
                      to="/universities/compare"
                      className="px-6 py-3.5 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-2 shrink-0"
                    >
                      <span>Compare Universities</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </section>
              </div>

              {/* Right Column: Sticky Quick Counseling Form */}
              <div id="counseling-box" className="lg:col-span-4 sticky top-32 space-y-4">
                <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-xl space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                    <ShieldCheck size={20} className="text-primary" />
                    <div>
                      <h3 className="text-sm font-bold text-foreground">Free Admission Support</h3>
                      <p className="text-[11px] text-muted-foreground">Official fee breakdown & eligibility</p>
                    </div>
                  </div>

                  {submitted ? (
                    <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 size={18} className="shrink-0" />
                      <span>Request received! Our counselor will send the fee breakdown directly on WhatsApp.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-3">
                      <div>
                        <label htmlFor={nameInputId} className="block text-[11px] font-semibold text-muted-foreground mb-1">
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
                        <label htmlFor={phoneInputId} className="block text-[11px] font-semibold text-muted-foreground mb-1">
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
                        <label htmlFor={courseSelectId} className="block text-[11px] font-semibold text-muted-foreground mb-1">
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
                            <option key={i} value={p.name}>{p.name}</option>
                          ))}
                        </select>
                      </div>

                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-5 rounded-xl bg-primary text-primary-foreground font-bold text-xs shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                      >
                        <Send size={13} />
                        <span>Get Free Shortlist & Fees</span>
                      </Button>

                      <p className="text-[10px] text-muted-foreground text-center">
                        Zero spam • 100% Free counseling & zero hidden charges
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
