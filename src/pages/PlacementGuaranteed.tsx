import React, { useState, useEffect, useRef, useId } from "react";
import { Helmet } from "react-helmet-async";
import { 
  Check, 
  ChevronDown, 
  CheckCircle2, 
  Download, 
  FileText, 
  X, 
  MessageCircle
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { validateIndianMobile, validateMeaningfulName, validateMeaningfulEmail } from "@/lib/validation";

export const PlacementGuaranteed = () => {
  // Page Mount / Hero Animation
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Main Eligibility Form State (Section 10)
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [city, setCity] = useState("");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cityError, setCityError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // PDF Download Modal State (Section 11)
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pdfPhone, setPdfPhone] = useState("");
  const [pdfEmail, setPdfEmail] = useState("");
  const [pdfNameError, setPdfNameError] = useState("");
  const [pdfPhoneError, setPdfPhoneError] = useState("");
  const [pdfEmailError, setPdfEmailError] = useState("");
  const [pdfSubmitting, setPdfSubmitting] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // FAQ Accordion State (Section 12)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Animated Numbers State
  const [internshipCount, setInternshipCount] = useState(0);

  // Intersection Observers for Restrained Scroll Reveals
  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineVisible, setTimelineVisible] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);
  const [certVisible, setCertVisible] = useState(false);

  const internshipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    const timeObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setTimelineVisible(true);
        timeObs.disconnect();
      }
    }, observerOptions);
    if (timelineRef.current) timeObs.observe(timelineRef.current);

    const certObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setCertVisible(true);
        certObs.disconnect();
      }
    }, observerOptions);
    if (certRef.current) certObs.observe(certRef.current);

    const internObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        let start = 0;
        const end = 15000;
        const duration = 800;
        const stepTime = 16;
        const steps = duration / stepTime;
        const increment = end / steps;
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setInternshipCount(end);
            clearInterval(timer);
          } else {
            setInternshipCount(Math.floor(start));
          }
        }, stepTime);
        internObs.disconnect();
      }
    }, observerOptions);
    if (internshipRef.current) internObs.observe(internshipRef.current);

    return () => {
      timeObs.disconnect();
      certObs.disconnect();
      internObs.disconnect();
    };
  }, []);

  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();
  const cityInputId = useId();

  const scrollToForm = () => {
    const el = document.getElementById("eligibility-form-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = document.getElementById(nameInputId);
      if (firstInput) firstInput.focus();
    }
  };

  const handleMainFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameCheck = validateMeaningfulName(fullName, false);
    if (!nameCheck.valid) {
      setNameError(nameCheck.error || "Please enter your full name.");
      return;
    }
    const phoneCheck = validateIndianMobile(phoneNumber);
    if (!phoneCheck.valid) {
      setPhoneError(phoneCheck.error || "Please enter a valid 10-digit phone number.");
      return;
    }
    const emailCheck = validateMeaningfulEmail(emailAddress);
    if (!emailCheck.valid) {
      setEmailError(emailCheck.error || "Please enter a valid email address.");
      return;
    }
    if (!city.trim()) {
      setCityError("Please enter your city.");
      return;
    }

    setNameError("");
    setPhoneError("");
    setEmailError("");
    setCityError("");

    setIsSubmitting(true);
    try {
      await submitLead({
        name: nameCheck.normalized || fullName.trim(),
        phone: `+91 ${phoneCheck.normalized || phoneNumber.replace(/\D/g, "").slice(-10)}`,
        email: emailAddress.trim().toLowerCase(),
        program: `ACWM Wealth Officer Programme — City: ${city.trim()}`,
        source: "placement-guaranteed-main-form",
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePdfSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const nameCheck = validateMeaningfulName(pdfName, false);
    if (!nameCheck.valid) {
      setPdfNameError(nameCheck.error || "Please enter your full name.");
      return;
    }
    const phoneCheck = validateIndianMobile(pdfPhone);
    if (!phoneCheck.valid) {
      setPdfPhoneError(phoneCheck.error || "Please enter a valid 10-digit phone number.");
      return;
    }
    const emailCheck = validateMeaningfulEmail(pdfEmail);
    if (!emailCheck.valid) {
      setPdfEmailError(emailCheck.error || "Please enter a valid email address.");
      return;
    }

    setPdfNameError("");
    setPdfPhoneError("");
    setPdfEmailError("");
    setPdfSubmitting(true);

    try {
      await submitLead({
        name: nameCheck.normalized || pdfName.trim(),
        phone: `+91 ${phoneCheck.normalized || pdfPhone.replace(/\D/g, "").slice(-10)}`,
        email: pdfEmail.trim().toLowerCase(),
        program: "Interview Prep PDF Kit — ACWM Wealth Officer",
        source: "placement-guaranteed-pdf-modal",
      });
    } catch {
      // Continue download even if network logger catches glitch
    } finally {
      setPdfSubmitting(false);
      setPdfDownloaded(true);

      const link = document.createElement("a");
      link.href = "/assets/acwm/bajaj_capital_interview_prep_kit.pdf";
      link.download = "Bajaj_Capital_Interview_Prep_Kit.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Exactly the 8 genuine questions requested
  const FAQS = [
    {
      q: "Is this programme online?",
      a: "Yes. The structured training modules are conducted 100% online, allowing candidates from any location in India to participate.",
    },
    {
      q: "Is prior finance experience required?",
      a: "No prior experience in banking, finance, or wealth management is required. The curriculum starts from core fundamentals.",
    },
    {
      q: "Do I need coding or technical skills?",
      a: "No coding or technical skills are needed. Wealth Officers focus on client portfolio advisory, mutual funds, and relationship management.",
    },
    {
      q: "What role can I get after the programme?",
      a: "You start as a Wealth Officer at Bajaj Capital*, with clear progression to Senior Executive, Assistant Manager, and Leadership roles.",
    },
    {
      q: "What is the package?",
      a: "Selected candidates receive a full-time ₹4.2 LPA PACKAGE* with PAN India placement upon successful programme completion.",
    },
    {
      q: "How does the placement guarantee work?",
      a: "Candidates are evaluated and selected through an entrance interview first. Completing the online training and paid internship secures your 100% job placement*.",
    },
    {
      q: "What is the programme duration?",
      a: "The programme spans 6 months, comprising 240 hours of online industry learning combined with practical paid internship exposure.",
    },
    {
      q: "What is the programme fee?",
      a: "The programme investment is ₹1,50,000 + GST. EMI payment plans are available for up to 10 months.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Hired First. Trained Next. — 100% Job Guaranteed Online Course | ₹4.2 LPA</title>
        <meta
          name="description"
          content="Start your career as a Wealth Officer with a ₹4.2 LPA package. 100% job guaranteed online course by Bajaj Capital. No experience, coding, or tech skills required."
        />
        <link rel="canonical" href="https://degreeguru.in/placement-guaranteed/" />
      </Helmet>

      {/* Standalone Landing Page Root — Starts directly at top of viewport */}
      <div className="min-h-screen bg-[#F7F5F0] text-[#071B35] font-sans antialiased selection:bg-emerald-800 selection:text-white pb-20 md:pb-0">
        
        {/* ========================================================================= */}
        {/* 1. HERO — STARTS DIRECTLY AT TOP OF VIEWPORT (NO GLOBAL WEBSITES CHROME) */}
        {/* ========================================================================= */}
        <section className={`bg-[#071B35] text-white pt-10 sm:pt-14 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 border-b border-white/10 overflow-hidden transition-opacity duration-500 ${heroMounted ? "opacity-100" : "opacity-0"}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Core Positioning */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* Small green pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-black tracking-widest uppercase">
                  <span>100% JOB GUARANTEED ONLINE COURSE</span>
                </div>

                {/* Main headline */}
                <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-black text-white tracking-tight leading-[1.08]">
                  Hired First.<br />
                  <span className="text-emerald-400">Trained Next.</span>
                </h1>

                {/* Subheadline */}
                <p className="text-lg sm:text-xl font-bold text-slate-100">
                  Start your career as a Wealth Officer with a <span className="text-emerald-400">₹4.2 LPA package*</span>.
                </p>

                {/* Supporting line */}
                <div className="text-sm sm:text-base font-semibold text-slate-300">
                  No experience. No coding. No tech skills.
                </div>

                {/* Short explanation */}
                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg">
                  Clear the entrance interview, get selected, complete the online training, and start your career in wealth management.
                </p>

                {/* Simple journey */}
                <div className="pt-1 flex items-center gap-2 text-xs font-black text-emerald-400 tracking-wider uppercase flex-wrap">
                  <span>INTERVIEW</span>
                  <span className="text-slate-500">→</span>
                  <span>SELECTION</span>
                  <span className="text-slate-500">→</span>
                  <span>TRAINING</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-white">JOB</span>
                </div>

                {/* CTAs */}
                <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                  <button
                    onClick={scrollToForm}
                    className="group px-7 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#071B35] font-black text-sm tracking-wide transition-all duration-200 shadow-lg hover:shadow-emerald-500/20 active:scale-95 cursor-pointer text-center flex items-center justify-center gap-2"
                  >
                    <span>CHECK MY ELIGIBILITY</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </button>

                  <button
                    onClick={() => {
                      setPdfModalOpen(true);
                      setPdfDownloaded(false);
                    }}
                    className="group inline-flex items-center justify-center gap-2 text-xs sm:text-sm font-bold text-slate-300 hover:text-emerald-400 transition-colors py-2 text-center cursor-pointer"
                  >
                    <Download size={15} className="text-emerald-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                    <span>DOWNLOAD INTERVIEW PREP PDF</span>
                    <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
                  </button>
                </div>

              </div>

              {/* Right Column: Hero Image */}
              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#051427]">
                  <img
                    src="/assets/acwm/indian_wealth_officer.jpg"
                    alt="Wealth Officer Career"
                    className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-500 hover:scale-[1.01]"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. CREDENTIAL STRIP (MINIMAL HORIZONTAL STRIP) */}
        {/* ========================================================================= */}
        <section className="py-4 bg-[#F7F5F0] border-b border-[#E5E0D5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              PROGRAMME CREDENTIALS
            </span>
            <div className="flex items-center gap-8 sm:gap-12 grayscale hover:grayscale-0 transition-all opacity-85">
              <img
                src="/assets/acwm/bajaj-capital.png"
                alt="Bajaj Capital"
                className="h-5 sm:h-6 w-auto object-contain"
              />
              <span className="text-slate-300">•</span>
              <img
                src="/assets/acwm/aima.png"
                alt="AIMA"
                className="h-4 sm:h-5 w-auto object-contain"
              />
              <span className="text-slate-300">•</span>
              <img
                src="/assets/acwm/icofp.png"
                alt="ICOP"
                className="h-4 sm:h-5 w-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PROBLEM → ANSWER (VISUALLY LIGHT) */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-4">
            <h2 className="text-2xl sm:text-4xl font-black text-[#071B35] tracking-tight">
              “Want a career in finance, but don't have a technical background?”
            </h2>
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto">
              You don't need coding, prior finance experience or technical skills to get started.
            </p>
            <div className="pt-2">
              <p className="text-sm sm:text-base font-bold text-emerald-800 max-w-xl mx-auto">
                This programme takes you from selection to structured wealth-management training and a job opportunity.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. THE CAREER PATH (CLEAN TIMELINE) */}
        {/* ========================================================================= */}
        <section ref={timelineRef} className="py-16 sm:py-24 bg-[#F7F5F0] border-b border-[#E5E0D5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-10">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-black text-[#071B35] tracking-tight">
                Your path from interview to career.
              </h2>
            </div>

            {/* Timeline */}
            <div className="space-y-6 relative border-l-2 border-[#D5CEBF] ml-4 sm:ml-8 pl-6 sm:pl-10 py-2">
              <div className="relative space-y-1">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#071B35] text-white flex items-center justify-center text-[10px] font-black">
                  1
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#071B35]">INTERVIEW</h3>
                <p className="text-xs sm:text-sm text-slate-600">Clear the 1-on-1 entrance interview.</p>
              </div>

              <div className="relative space-y-1">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#071B35] text-white flex items-center justify-center text-[10px] font-black">
                  2
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#071B35]">SELECTION</h3>
                <p className="text-xs sm:text-sm text-slate-600">Receive formal selection confirmation.</p>
              </div>

              <div className="relative space-y-1">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                  3
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#071B35]">ONLINE TRAINING</h3>
                <p className="text-xs sm:text-sm text-slate-600">Learn practical wealth advisory online.</p>
              </div>

              <div className="relative space-y-1">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                  4
                </div>
                <h3 className="text-base sm:text-lg font-black text-[#071B35]">PAID INTERNSHIP</h3>
                <p className="text-xs sm:text-sm text-emerald-800 font-bold">₹15,000 / month* stipend.</p>
              </div>

              <div className="relative space-y-1">
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                  5
                </div>
                <h3 className="text-base sm:text-lg font-black text-emerald-800">WEALTH OFFICER</h3>
                <p className="text-xs sm:text-sm text-slate-600">Start full-time career placement.</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. JOB OUTCOME (DARK NAVY SECTION) */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#071B35] text-white border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-7 space-y-4">
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  Your first role: <span className="text-emerald-400">Wealth Officer</span>
                </h2>

                <div className="border-l-4 border-emerald-400 pl-4 py-1">
                  <span className="text-3xl sm:text-5xl font-black text-emerald-400 tracking-tight block">
                    ₹4.2 LPA PACKAGE*
                  </span>
                </div>

                <div className="text-xl sm:text-2xl font-bold text-white">
                  Bajaj Capital*
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg pt-1">
                  Build your career in wealth management with a structured path from training to employment.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-[#051427]">
                  <img
                    src="/assets/acwm/indian_wealth_consultation.jpg"
                    alt="Wealth Officer Consultation"
                    className="w-full h-[300px] sm:h-[380px] object-cover"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. WHAT YOU'LL LEARN (COMPACT) */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-6">
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-[#071B35] tracking-tight">
                What You'll Learn
              </h2>
              <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-emerald-800">
                240 HOURS OF INDUSTRY LEARNING
              </p>
            </div>

            <div className="divide-y divide-[#E5E0D5] text-sm font-bold text-slate-800 pt-1 border-t border-[#E5E0D5]">
              <div className="py-3 flex items-center justify-between">
                <span>Financial Planning</span>
                <span className="text-xs text-slate-400 font-medium">Core Module</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span>Investments</span>
                <span className="text-xs text-slate-400 font-medium">Asset Allocation</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span>Wealth Management</span>
                <span className="text-xs text-slate-400 font-medium">Portfolio Advisory</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span>Mutual Funds</span>
                <span className="text-xs text-slate-400 font-medium">Product Mastery</span>
              </div>
              <div className="py-3 flex items-center justify-between">
                <span>Retirement, Tax &amp; Risk Planning</span>
                <span className="text-xs text-slate-400 font-medium">Client Strategy</span>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. CERTIFICATION (ACTUAL CERTIFICATE IMAGE) */}
        {/* ========================================================================= */}
        <section ref={certRef} className="py-16 sm:py-24 bg-[#F7F5F0] border-b border-[#E5E0D5]">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              
              <div className="lg:col-span-5 space-y-3">
                <h2 className="text-2xl sm:text-3xl font-black text-[#071B35] tracking-tight">
                  Build expertise you can prove.
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                  Earn the Advanced Certification in Wealth Management through the programme.
                </p>
              </div>

              <div className="lg:col-span-7">
                <div className={`rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white p-2.5 sm:p-3.5 transition-all duration-500 transform ${
                  certVisible ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
                }`}>
                  <img
                    src="/assets/acwm/acwm_certificate.jpg"
                    alt="Advanced Certification in Wealth Management"
                    className="w-full h-auto object-contain rounded-xl"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. PAID INTERNSHIP (SIMPLE & CLEAN) */}
        {/* ========================================================================= */}
        <section ref={internshipRef} className="py-16 sm:py-20 bg-white border-b border-[#EAE5DA] text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-2">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
              Learn. Work. Earn.
            </h2>
            <div className="text-4xl sm:text-6xl font-black text-emerald-800 tracking-tight">
              ₹{internshipCount > 0 ? internshipCount.toLocaleString("en-IN") : "15,000"} / MONTH*
            </div>
            <p className="text-xs sm:text-sm text-slate-600 font-medium pt-1">
              Paid internship exposure during the programme.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 9. PROGRAMME INVESTMENT (MINIMAL & CLEAR) */}
        {/* ========================================================================= */}
        <section className="py-14 sm:py-18 bg-[#F7F5F0] border-b border-[#E5E0D5] text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-3">
            <span className="text-xs font-black uppercase tracking-widest text-slate-400 block">
              Programme Fee
            </span>
            <div className="text-3xl sm:text-5xl font-black text-[#071B35] tracking-tight">
              ₹1,50,000 + GST
            </div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              *Payable upon selection confirmation. 0% interest EMI options available up to 10 months.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. WHO CAN APPLY (TWO-COLUMN LAYOUT) */}
        {/* ========================================================================= */}
        <section id="eligibility-form-section" className="py-16 sm:py-24 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-5xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Who can apply? */}
              <div className="lg:col-span-5 space-y-6 pt-2">
                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-black text-[#071B35] tracking-tight">
                    Who can apply?
                  </h2>
                  <p className="text-xs text-slate-500 font-medium">
                    Basic criteria for programme selection:
                  </p>
                </div>

                <div className="space-y-3.5 text-sm font-bold text-slate-800">
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-emerald-700 shrink-0" />
                    <span>12th Pass or above (any stream)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-emerald-700 shrink-0" />
                    <span>Freshers or working professionals</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-emerald-700 shrink-0" />
                    <span>Functional English communication</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Check size={18} className="text-emerald-700 shrink-0" />
                    <span>Selection through entrance interview</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed">
                  No technical background or prior banking experience required. Training begins from scratch.
                </div>
              </div>

              {/* Right Column: Check your eligibility Form */}
              <div className="lg:col-span-7">
                <div className="bg-[#F7F5F0] rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm">
                  
                  <div className="space-y-1 pb-4">
                    <h3 className="text-xl sm:text-2xl font-black text-[#071B35]">
                      Check your eligibility
                    </h3>
                    <p className="text-xs text-slate-500">
                      Submit your details to check qualification for the entrance interview.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="py-6 text-center space-y-2">
                      <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
                      <h4 className="text-lg font-bold text-[#071B35]">Details Received</h4>
                      <p className="text-xs text-slate-600 max-w-xs mx-auto">
                        An admissions counsellor will review your profile and connect within one working day.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleMainFormSubmit} className="space-y-3.5">
                      
                      {/* Full Name */}
                      <div className="space-y-1">
                        <input
                          id={nameInputId}
                          type="text"
                          required
                          placeholder="Enter your full name"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (nameError) setNameError("");
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-[#071B35] placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                        />
                        {nameError && <p className="text-[11px] text-rose-600 font-semibold">{nameError}</p>}
                      </div>

                      {/* Phone Number */}
                      <div className="space-y-1">
                        <input
                          id={phoneInputId}
                          type="tel"
                          required
                          maxLength={10}
                          placeholder="Enter your phone number"
                          value={phoneNumber}
                          onChange={(e) => {
                            setPhoneNumber(e.target.value.replace(/\D/g, ""));
                            if (phoneError) setPhoneError("");
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-[#071B35] placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                        />
                        {phoneError && <p className="text-[11px] text-rose-600 font-semibold">{phoneError}</p>}
                      </div>

                      {/* Email */}
                      <div className="space-y-1">
                        <input
                          id={emailInputId}
                          type="email"
                          required
                          placeholder="Enter your email"
                          value={emailAddress}
                          onChange={(e) => {
                            setEmailAddress(e.target.value);
                            if (emailError) setEmailError("");
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-[#071B35] placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                        />
                        {emailError && <p className="text-[11px] text-rose-600 font-semibold">{emailError}</p>}
                      </div>

                      {/* City */}
                      <div className="space-y-1">
                        <input
                          id={cityInputId}
                          type="text"
                          required
                          placeholder="Enter your city"
                          value={city}
                          onChange={(e) => {
                            setCity(e.target.value);
                            if (cityError) setCityError("");
                          }}
                          className="w-full px-4 py-3 rounded-lg border border-slate-300 bg-white text-sm text-[#071B35] placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                        />
                        {cityError && <p className="text-[11px] text-rose-600 font-semibold">{cityError}</p>}
                      </div>

                      {/* Submit CTA */}
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-3.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-sm tracking-wide transition-all shadow-sm active:scale-95 cursor-pointer disabled:opacity-50"
                        >
                          {isSubmitting ? "Checking..." : "CHECK MY ELIGIBILITY →"}
                        </button>
                      </div>

                    </form>
                  )}

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. INTERVIEW PREP PDF (DEDICATED SECTION WITH SHORT LEAD MODAL) */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-[#F7F5F0] border-b border-[#E5E0D5]">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-4">
            <h2 className="text-2xl sm:text-3xl font-black text-[#071B35] tracking-tight">
              Prepare for your interview.
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
              Get the Interview Prep PDF and understand what to expect before your selection interview.
            </p>
            <div className="pt-2">
              <button
                onClick={() => {
                  setPdfModalOpen(true);
                  setPdfDownloaded(false);
                }}
                className="group px-7 py-3.5 rounded-xl bg-[#071B35] hover:bg-[#0d2a4e] text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 inline-flex items-center gap-2 cursor-pointer"
              >
                <Download size={15} className="text-emerald-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span>DOWNLOAD INTERVIEW PREP PDF</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. FAQ (CLEAN ACCORDION WITH EXACT 8 QUESTIONS) */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-8">
            <h2 className="text-2xl sm:text-3xl font-black text-[#071B35] text-center tracking-tight">
              Frequently Asked Questions
            </h2>

            <div className="space-y-3">
              {FAQS.map((faq, index) => {
                const isOpen = openFaq === index;
                return (
                  <div
                    key={index}
                    className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : index)}
                      className="w-full p-4 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-[#071B35] cursor-pointer"
                    >
                      <span>{faq.q}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 transition-transform duration-200 text-slate-400 ${
                          isOpen ? "rotate-180 text-emerald-700" : ""
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-2 font-medium">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. FINAL CTA (DARK NAVY SECTION) */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#071B35] text-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-black leading-tight tracking-tight">
              Ready to start your finance career?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium">
              Check your eligibility and take the first step.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={scrollToForm}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#071B35] font-black text-sm tracking-wide transition-all duration-200 shadow-lg hover:shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>CHECK MY ELIGIBILITY</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>

              <a
                href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20want%20to%20apply%20for%20the%20Wealth%20Officer%20career%20programme"
                target="_blank"
                rel="noreferrer"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#25D366] hover:bg-[#20be5a] text-white font-black text-xs sm:text-sm tracking-wide transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} className="fill-white stroke-none" />
                <span>WHATSAPP US →</span>
              </a>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 14. FLOATING WHATSAPP BUTTON (NUMBER: 9350199001) */}
        {/* ========================================================================= */}
        <a
          href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20have%20a%20query%20about%20the%20Wealth%20Officer%20career%20programme"
          target="_blank"
          rel="noreferrer"
          aria-label="WhatsApp Degree Guru"
          className="fixed z-50 flex items-center gap-1.5 px-3 py-2 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200 right-5 bottom-5"
        >
          <MessageCircle size={20} className="fill-white stroke-none" />
          <span className="text-xs font-bold tracking-wide">WhatsApp</span>
        </a>

        {/* ========================================================================= */}
        {/* INTERVIEW PREP PDF MODAL */}
        {/* ========================================================================= */}
        {pdfModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071B35]/80 backdrop-blur-xs animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl w-full max-w-md p-6 sm:p-8 border border-slate-200 shadow-2xl relative">
              
              <button
                type="button"
                onClick={() => setPdfModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>

              <div className="space-y-1 pb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center mb-2">
                  <FileText size={20} />
                </div>
                <h3 className="text-xl font-black text-[#071B35]">
                  Get The Interview Prep PDF
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  Official preparation guide for the Bajaj Capital entrance interview.
                </p>
              </div>

              {pdfDownloaded ? (
                <div className="py-4 text-center space-y-4">
                  <CheckCircle2 className="mx-auto text-emerald-600" size={40} />
                  <div className="space-y-1">
                    <p className="text-sm font-black text-[#071B35]">
                      Download Started!
                    </p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Check your browser downloads for the Interview Prep PDF kit.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <a
                      href="https://wa.me/919350199001?text=Hi%2C%20I%20downloaded%20the%20Interview%20Prep%20PDF%20and%20need%20help%20with%20my%20application"
                      target="_blank"
                      rel="noreferrer"
                      className="w-full py-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-black text-xs tracking-wider uppercase inline-flex items-center justify-center gap-2 transition-all shadow-xs"
                    >
                      <MessageCircle size={16} className="fill-white stroke-none" />
                      <span>TALK TO US ON WHATSAPP →</span>
                    </a>
                  </div>
                </div>
              ) : (
                <form onSubmit={handlePdfSubmit} className="space-y-3.5">
                  <div className="space-y-1">
                    <input
                      type="text"
                      required
                      placeholder="Full Name"
                      value={pdfName}
                      onChange={(e) => {
                        setPdfName(e.target.value);
                        if (pdfNameError) setPdfNameError("");
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#071B35] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    {pdfNameError && <p className="text-[11px] text-rose-600 font-semibold">{pdfNameError}</p>}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="Phone Number"
                      value={pdfPhone}
                      onChange={(e) => {
                        setPdfPhone(e.target.value.replace(/\D/g, ""));
                        if (pdfPhoneError) setPdfPhoneError("");
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#071B35] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    {pdfPhoneError && <p className="text-[11px] text-rose-600 font-semibold">{pdfPhoneError}</p>}
                  </div>

                  <div className="space-y-1">
                    <input
                      type="email"
                      required
                      placeholder="Email"
                      value={pdfEmail}
                      onChange={(e) => {
                        setPdfEmail(e.target.value);
                        if (pdfEmailError) setPdfEmailError("");
                      }}
                      className="w-full px-3.5 py-2.5 rounded-lg border border-slate-200 text-sm text-[#071B35] placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                    {pdfEmailError && <p className="text-[11px] text-rose-600 font-semibold">{pdfEmailError}</p>}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={pdfSubmitting}
                      className="w-full py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-black text-xs tracking-wider uppercase transition-all shadow-xs cursor-pointer active:scale-95"
                    >
                      {pdfSubmitting ? "Preparing..." : "DOWNLOAD INTERVIEW PREP PDF →"}
                    </button>
                  </div>
                </form>
              )}

            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default PlacementGuaranteed;
