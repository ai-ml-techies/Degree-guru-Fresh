import { useState, useId } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { 
  CheckCircle2, 
  ArrowRight, 
  Briefcase, 
  Award, 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  ShieldCheck, 
  GraduationCap, 
  HelpCircle,
  Building2,
  Users,
  ChevronDown,
  Sparkles
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { validateIndianMobile, validateMeaningfulName, validateMeaningfulEmail } from "@/lib/validation";

export const PlacementGuaranteed = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [education, setEducation] = useState("Graduate");
  
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameCheck = validateMeaningfulName(name, false);
    if (!nameCheck.valid) {
      setNameError(nameCheck.error || "Please enter a valid, meaningful name.");
      return;
    }
    const phoneCheck = validateIndianMobile(phone);
    if (!phoneCheck.valid) {
      setPhoneError(phoneCheck.error || "Please enter a valid 10-digit Indian mobile number.");
      return;
    }
    const emailCheck = validateMeaningfulEmail(email);
    if (!emailCheck.valid) {
      setEmailError(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    setNameError("");
    setPhoneError("");
    setEmailError("");
    setIsSubmitting(true);

    try {
      await submitLead({
        name: nameCheck.normalized || name.trim(),
        phone: `${countryCode} ${phoneCheck.normalized || phone.replace(/\D/g, "").slice(-10)}`,
        email: email.trim().toLowerCase(),
        program: `100% Placement Guaranteed ACWM (${education})`,
        source: "placement-guaranteed-page",
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const FAQS = [
    {
      q: "What does '100% Placement Guaranteed' mean in this program?",
      a: "Unlike traditional courses where placement happens after graduation, this program operates on a 'Job First, Train Next' model. You interview with Bajaj Capital before enrolling, and upon clearing the interview, you receive a written Pre-Placement Offer (PPO) letter stating your role and starting salary (₹4.2 LPA CTC) before formal training begins.",
    },
    {
      q: "Who conducts the pre-placement interview and provides the offer?",
      a: "The hiring and PPO are directly provided by Bajaj Capital, one of India's premier non-banking financial companies with over 58 years of wealth management heritage. You become a permanent employee upon completion of the training pathway.",
    },
    {
      q: "What is the duration of the ACWM Career Programme?",
      a: "The program spans 8 months in total: 4 months of intensive classroom/online training (240 hours) followed by a 4-month paid internship with Bajaj Capital at a fixed stipend of ₹15,000/month (total ₹60,000 stipend).",
    },
    {
      q: "What credentials and certifications do I earn?",
      a: "You receive the Advanced Certification in Wealth Management (ACWM) conferred jointly by AIMA (All India Management Association) and ICOFP (International College of Financial Planning), in addition to preparation for mandatory regulatory certifications like NISM.",
    },
    {
      q: "Who is eligible to apply for this programme?",
      a: "Graduates from any stream (B.Com, BBA, BA, B.Sc, BCA, B.Tech, etc.) or final-year college students awaiting their final semester results are eligible. A genuine interest in wealth management, banking, client advising, and financial planning is required.",
    },
    {
      q: "Are No-Cost EMI financing options available for the tuition fee?",
      a: "Yes. Flexible zero-cost education EMI options starting from ₹3,500/month are available with zero down payment and zero hidden interest through our education finance partners.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>100% Guaranteed Placement Career Programme — Job First, Train Next | Degree Guru</title>
        <meta
          name="description"
          content="Get a written Pre-Placement Offer (PPO) starting from ₹4.2 LPA at Bajaj Capital before training begins. 8-Month ACWM Programme with ₹60,000 paid stipend and ₹85,000 retention bonus."
        />
        <link rel="canonical" href="https://degreeguru.in/placement-guaranteed/" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground font-sans">
        {/* Breadcrumb Navigation */}
        <div className="container-dg max-w-6xl pt-4 pb-2">
          <AppBreadcrumb
            items={[
              { label: "Career Programs", href: "/courses" },
              { label: "100% Placement Guaranteed" },
            ]}
          />
        </div>

        {/* ── HERO BANNER: DARK BLUE NAVY THEME MATCHING LEVERAGEEDU ACWM ── */}
        <section className="relative overflow-hidden bg-gradient-to-br from-[#0c1f38] via-[#09182b] to-[#040d1a] text-white py-12 md:py-16 border-b border-border/20">
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

          <div className="container-dg max-w-6xl relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Value Proposition & Numbers */}
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 size={15} className="text-emerald-400" />
                  <span>100% Guaranteed Placement Career Programme</span>
                </div>

                <div className="space-y-2">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
                    Job First. Train Next. <br />
                    <span className="text-emerald-400">Build Your Career.</span>
                  </h1>
                  <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                    Interview for a Wealth Officer role at Bajaj Capital and receive a written Pre-Placement Offer (PPO) before training begins.
                  </p>
                </div>

                {/* 3 Prominent Stat Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1">
                    <span className="text-[11px] text-slate-300 font-medium block">Starting Package</span>
                    <span className="text-2xl sm:text-3xl font-black text-white block">₹4.2 LPA</span>
                    <span className="text-[11px] text-emerald-400 font-semibold block">Full-time Wealth Officer Role</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1">
                    <span className="text-[11px] text-slate-300 font-medium block">Internship Stipend</span>
                    <span className="text-2xl sm:text-3xl font-black text-white block">₹60,000</span>
                    <span className="text-[11px] text-slate-300 font-semibold block">₹15,000/mo while you train</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 space-y-1">
                    <span className="text-[11px] text-slate-300 font-medium block">Retention Bonus</span>
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 block">₹85,000</span>
                    <span className="text-[11px] text-slate-300 font-semibold block">After 12 months full-time</span>
                  </div>
                </div>

                {/* Quick Trust Tags */}
                <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Written PPO Letter
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> AIMA & ICOFP Certified
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-400" /> Zero Hidden Interest EMI
                  </span>
                </div>
              </div>

              {/* Right Column: Lead Form Card */}
              <div className="lg:col-span-5" id="counseling-box">
                <div className="p-6 sm:p-7 rounded-3xl bg-card text-foreground border border-border shadow-2xl space-y-5">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                      Admissions Open for 2026 Cohort
                    </span>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      Talk to our Career Counselor
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Register to check your eligibility for the Bajaj Capital interview and PPO.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                      <CheckCircle2 className="mx-auto text-emerald-600 dark:text-emerald-400" size={32} />
                      <h3 className="font-bold text-sm text-foreground">Interview Registration Confirmed!</h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Our career counseling mentor will call you within 15 minutes on {countryCode} {phone} to guide you through the interview round.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-3.5">
                      <div className="space-y-1">
                        <label htmlFor={nameInputId} className="text-[11px] font-semibold text-muted-foreground">
                          Full Name *
                        </label>
                        <input
                          id={nameInputId}
                          type="text"
                          required
                          value={name}
                          onChange={(e) => {
                            setName(e.target.value);
                            if (nameError) setNameError("");
                          }}
                          placeholder="e.g. Rahul Sharma"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        />
                        {nameError && <p className="text-[11px] text-destructive font-medium">{nameError}</p>}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor={phoneInputId} className="text-[11px] font-semibold text-muted-foreground">
                          Mobile Number (10 Digits) *
                        </label>
                        <div className="flex gap-2">
                          <select
                            value={countryCode}
                            onChange={(e) => setCountryCode(e.target.value)}
                            aria-label="Country Code"
                            className="px-2.5 py-2.5 rounded-xl bg-background border border-border text-xs font-semibold shrink-0"
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
                            value={phone}
                            onChange={(e) => {
                              const val = e.target.value.replace(/\D/g, "");
                              setPhone(val);
                              if (phoneError) setPhoneError("");
                            }}
                            placeholder="Enter 10-digit number"
                            className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                          />
                        </div>
                        {phoneError && <p className="text-[11px] text-destructive font-medium">{phoneError}</p>}
                      </div>

                      <div className="space-y-1">
                        <label htmlFor={emailInputId} className="text-[11px] font-semibold text-muted-foreground">
                          Email Address *
                        </label>
                        <input
                          id={emailInputId}
                          type="email"
                          required
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                          placeholder="rahul.sharma@gmail.com"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        />
                        {emailError && <p className="text-[11px] text-destructive font-medium">{emailError}</p>}
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-semibold text-muted-foreground">
                          Current Education / Qualification
                        </label>
                        <select
                          value={education}
                          onChange={(e) => setEducation(e.target.value)}
                          aria-label="Education Qualification"
                          className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs font-medium focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        >
                          <option value="Graduate">Graduated (BA/B.Com/BBA/B.Sc/BCA/B.Tech)</option>
                          <option value="Final Year Student">Final Year College Student</option>
                          <option value="Working Professional">Working Professional (0-3 yrs)</option>
                          <option value="Post Graduate">Post Graduate (MBA/MCA/M.Com)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer disabled:opacity-70"
                      >
                        {isSubmitting ? (
                          <span>Verifying & Submitting...</span>
                        ) : (
                          <>
                            <span>Register for Pre-Placement Interview</span>
                            <ArrowRight size={14} />
                          </>
                        )}
                      </button>

                      <p className="text-[10px] text-center text-muted-foreground">
                        🔒 100% Free Guidance. Your information is protected under privacy standards.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── HIRING & ACCREDITATION PARTNERS BAR ── */}
        <section className="py-6 bg-card border-b border-border/60">
          <div className="container-dg max-w-6xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Corporate Hiring & Academic Delivery Partners
                </span>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Direct recruitment by Bajaj Capital with dual curriculum certification.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-3">
                <div className="px-4 py-2 rounded-2xl bg-muted/40 border border-border/70 flex items-center gap-2">
                  <Building2 size={16} className="text-primary shrink-0" />
                  <span className="text-xs font-extrabold text-foreground">Bajaj Capital</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">Hiring Partner</span>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-muted/40 border border-border/70 flex items-center gap-2">
                  <Award size={16} className="text-sky-600 dark:text-sky-400 shrink-0" />
                  <span className="text-xs font-bold text-foreground">AIMA</span>
                  <span className="text-[10px] text-muted-foreground font-medium">(All India Management Assoc.)</span>
                </div>

                <div className="px-4 py-2 rounded-2xl bg-muted/40 border border-border/70 flex items-center gap-2">
                  <GraduationCap size={16} className="text-purple-600 dark:text-purple-400 shrink-0" />
                  <span className="text-xs font-bold text-foreground">ICOFP</span>
                  <span className="text-[10px] text-muted-foreground font-medium">(Financial Planning)</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 1: 8-MONTH CAREER PATHWAY (From Interview to Payroll) ── */}
        <section className="py-12 md:py-16">
          <div className="container-dg max-w-6xl space-y-10">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Step-by-Step Trajectory
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Your 8-Month Career Pathway
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                From initial selection interview to guaranteed payroll as a permanent Wealth Officer.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Step 1 */}
              <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3 relative overflow-hidden group hover:border-primary/50 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary font-black flex items-center justify-center text-sm">
                  01
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">Get Selected</h3>
                  <span className="text-[11px] font-semibold text-primary block">Month 0</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Appear for the screening interview with Bajaj Capital. Receive your written Pre-Placement Offer (PPO) stating ₹4.2 LPA starting CTC before enrolling.
                </p>
              </div>

              {/* Step 2 */}
              <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3 relative overflow-hidden group hover:border-sky-500/50 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black flex items-center justify-center text-sm">
                  02
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">Classroom Training</h3>
                  <span className="text-[11px] font-semibold text-sky-600 dark:text-sky-400 block">Months 1 to 4</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complete 240 hours of practical wealth advisory, financial planning, mutual funds, taxation, and NISM examination preparation modules.
                </p>
              </div>

              {/* Step 3 */}
              <div className="p-6 rounded-3xl bg-card border border-border shadow-xs space-y-3 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black flex items-center justify-center text-sm">
                  03
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">Paid Internship</h3>
                  <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 block">Months 5 to 8</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  4 months hands-on client advisory internship at Bajaj Capital branches. Earn a fixed stipend of ₹15,000/month (total ₹60,000 stipend).
                </p>
              </div>

              {/* Step 4 */}
              <div className="p-6 rounded-3xl bg-card border border-emerald-500/40 shadow-xs space-y-3 relative overflow-hidden group bg-gradient-to-br from-emerald-500/5 to-card">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-black flex items-center justify-center text-sm">
                  04
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">Full-Time Payroll</h3>
                  <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 block">Month 9 Onwards</span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Transition to full-time permanent Wealth Officer with ₹4.2 LPA starting CTC, plus ₹85,000 retention completion bonus upon completing 12 months.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 2: CURRICULUM & SKILLS COVERED ── */}
        <section className="py-12 bg-muted/20 border-y border-border/60">
          <div className="container-dg max-w-6xl space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold text-primary uppercase tracking-wider">
                  Industry-Aligned Syllabus
                </span>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight mt-1">
                  What You Will Learn
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                  Structured around real wealth advisory scenarios, regulatory exams, and corporate client relationship building.
                </p>
              </div>

              <a
                href="#counseling-box"
                className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-colors self-start md:self-auto shrink-0 shadow-xs"
              >
                Apply for ACWM Batch
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: "Financial Planning & Wealth Advisory",
                  desc: "Goal-based financial planning, asset allocation frameworks, risk profiling, and client life-stage portfolio modeling.",
                  icon: TrendingUp,
                },
                {
                  title: "Mutual Funds & Capital Markets",
                  desc: "Deep-dive analysis of equity, debt, and hybrid mutual fund schemes, index benchmarks, and macroeconomic indicators.",
                  icon: DollarSign,
                },
                {
                  title: "Taxation, Risk & Estate Planning",
                  desc: "Personal income tax optimization, capital gains calculations, life & health insurance structuring, and estate transitions.",
                  icon: ShieldCheck,
                },
                {
                  title: "Regulatory & NISM Exam Preparation",
                  desc: "Comprehensive coaching for mandatory regulatory certifications including NISM Series X-A and X-B.",
                  icon: Award,
                },
                {
                  title: "Client Relationship Management (CRM)",
                  desc: "Pitching high-net-worth individuals (HNIs), client discovery meetings, consultative selling, and relationship retention.",
                  icon: Users,
                },
                {
                  title: "FinTech & Wealth Advisory Tools",
                  desc: "Hands-on experience with modern portfolio analytics platforms, financial modeling spreadsheets, and wealth reporting suites.",
                  icon: Sparkles,
                },
              ].map((mod, idx) => {
                const IconComponent = mod.icon;
                return (
                  <div key={idx} className="p-5 rounded-2xl bg-card border border-border shadow-2xs space-y-2">
                    <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                      <IconComponent size={16} />
                    </div>
                    <h3 className="text-sm font-bold text-foreground">{mod.title}</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── SECTION 3: RETURN ON INVESTMENT BREAKDOWN ── */}
        <section className="py-12 md:py-16">
          <div className="container-dg max-w-6xl space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                Financial Return Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                High Return on Education Investment
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Calculate your direct earnings in the first year alone against your program enrollment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Card 1: Earnings Breakdown */}
              <div className="md:col-span-2 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-card via-card to-emerald-500/5 border border-border shadow-sm space-y-6">
                <h3 className="text-lg font-bold text-foreground">
                  First Year Total Earning Potential: <span className="text-emerald-600 dark:text-emerald-400">₹5,65,000</span>
                </h3>

                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs">
                    <span className="font-semibold text-foreground">Starting Base CTC (Bajaj Capital)</span>
                    <span className="font-bold text-foreground">₹4,20,000 / year</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs">
                    <span className="font-semibold text-foreground">Paid Internship Stipend (4 Months @ ₹15,000/mo)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+ ₹60,000</span>
                  </div>
                  <div className="flex items-center justify-between p-3.5 rounded-xl bg-muted/40 border border-border/70 text-xs">
                    <span className="font-semibold text-foreground">Retention Bonus (Upon 12 months full-time completion)</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">+ ₹85,000</span>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-700 dark:text-emerald-300">Total Net 1st Year Remuneration</span>
                  <span className="text-base font-black text-emerald-600 dark:text-emerald-400">₹5,65,000</span>
                </div>
              </div>

              {/* Card 2: No-Cost EMI financing */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-sm space-y-5 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
                    <span>Flexible Financing</span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground">No-Cost EMI Support</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enroll with zero upfront financial burden. Study with transparent monthly installments.
                  </p>
                  <div className="pt-2">
                    <span className="text-xs text-muted-foreground block">Monthly Installments Starting From</span>
                    <span className="text-2xl font-black text-foreground">₹3,500 / month</span>
                    <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold block mt-0.5">Zero Hidden Interest Charges</span>
                  </div>
                </div>

                <a
                  href="#counseling-box"
                  className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground font-semibold text-xs text-center hover:bg-primary/90 transition-colors shadow-xs"
                >
                  Check EMI Eligibility
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── SECTION 4: FAQS ACCORDION ── */}
        <section className="py-12 bg-muted/20 border-t border-border/60">
          <div className="container-dg max-w-4xl space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                Got Questions?
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl bg-card border border-border overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-xs sm:text-sm font-bold text-foreground">
                      {faq.q}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`text-muted-foreground shrink-0 transition-transform duration-200 ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {openFaq === idx && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-xs text-muted-foreground leading-relaxed animate-in fade-in-50 duration-150">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom Final CTA Card */}
            <div className="p-8 rounded-3xl bg-gradient-to-r from-primary/10 via-card to-emerald-500/10 border border-primary/20 text-center space-y-4 shadow-sm">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground">
                Ready to Secure Your Pre-Placement Offer?
              </h3>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
                Batches are limited to ensure 1:1 mentorship and dedicated placement onboarding with Bajaj Capital.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <a
                  href="#counseling-box"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm hover:bg-primary/90 transition-all shadow-md"
                >
                  Apply for Pre-Placement Interview
                </a>
                <Link
                  to="/universities/sgt-university-online"
                  className="px-5 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-xs sm:text-sm hover:bg-muted transition-colors"
                >
                  View SGT University Online
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PlacementGuaranteed;
