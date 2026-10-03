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
  // Hero Animation Stagger State
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Main Eligibility Form State (Matches "Check if you qualify" design)
  const [fullName, setFullName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [currentStatus, setCurrentStatus] = useState("Current status");
  const [isGraduate, setIsGraduate] = useState<"Yes" | "Not yet">("Not yet");

  // Main Form Validation & State
  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cityError, setCityError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // PDF Download Modal State (Clean Secondary Lead-Gen Flow)
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pdfPhone, setPdfPhone] = useState("");
  const [pdfEmail, setPdfEmail] = useState("");
  const [pdfNameError, setPdfNameError] = useState("");
  const [pdfPhoneError, setPdfPhoneError] = useState("");
  const [pdfEmailError, setPdfEmailError] = useState("");
  const [pdfSubmitting, setPdfSubmitting] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // FAQ Accordion State (Max 7 Questions)
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Animated Numbers State
  const [guaranteeCount, setGuaranteeCount] = useState(0);
  const [internshipCount, setInternshipCount] = useState(0);

  // Intersection Observers for Scroll Reveals
  const problemRef = useRef<HTMLDivElement>(null);
  const [problemVisible, setProblemVisible] = useState(false);

  const diffRef = useRef<HTMLDivElement>(null);
  const [diffVisible, setDiffVisible] = useState(false);

  const timelineRef = useRef<HTMLDivElement>(null);
  const [timelineVisible, setTimelineVisible] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);
  const [certVisible, setCertVisible] = useState(false);

  const internshipRef = useRef<HTMLDivElement>(null);
  const [internshipVisible, setInternshipVisible] = useState(false);

  const guaranteeRef = useRef<HTMLDivElement>(null);
  const [guaranteeVisible, setGuaranteeVisible] = useState(false);

  useEffect(() => {
    const observerOptions = { threshold: 0.2 };

    const problemObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setProblemVisible(true);
        problemObs.disconnect();
      }
    }, observerOptions);
    if (problemRef.current) problemObs.observe(problemRef.current);

    const diffObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setDiffVisible(true);
        diffObs.disconnect();
      }
    }, observerOptions);
    if (diffRef.current) diffObs.observe(diffRef.current);

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
        setInternshipVisible(true);
        let start = 0;
        const end = 15000;
        const duration = 1000;
        const stepTime = 20;
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

    const guarObs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setGuaranteeVisible(true);
        let start = 0;
        const end = 100;
        const duration = 900;
        const stepTime = 15;
        const steps = duration / stepTime;
        const increment = end / steps;
        const timer = setInterval(() => {
          start += increment;
          if (start >= end) {
            setGuaranteeCount(end);
            clearInterval(timer);
          } else {
            setGuaranteeCount(Math.floor(start));
          }
        }, stepTime);
        guarObs.disconnect();
      }
    }, observerOptions);
    if (guaranteeRef.current) guarObs.observe(guaranteeRef.current);

    return () => {
      problemObs.disconnect();
      diffObs.disconnect();
      timeObs.disconnect();
      certObs.disconnect();
      internObs.disconnect();
      guarObs.disconnect();
    };
  }, []);

  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();
  const cityInputId = useId();
  const ageInputId = useId();

  const scrollToForm = () => {
    const el = document.getElementById("main-eligibility-form");
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
    const phoneCheck = validateIndianMobile(mobileNumber);
    if (!phoneCheck.valid) {
      setPhoneError(phoneCheck.error || "Please enter a valid 10-digit mobile number.");
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
    const parsedAge = parseInt(age, 10);
    if (!age || isNaN(parsedAge) || parsedAge < 18 || parsedAge > 45) {
      setAgeError("Please enter a valid age (18-45).");
      return;
    }

    setNameError("");
    setPhoneError("");
    setEmailError("");
    setCityError("");
    setAgeError("");

    setIsSubmitting(true);
    try {
      await submitLead({
        name: nameCheck.normalized || fullName.trim(),
        phone: `+91 ${phoneCheck.normalized || mobileNumber.replace(/\D/g, "").slice(-10)}`,
        email: emailAddress.trim().toLowerCase(),
        program: `ACWM Career Programme - Graduate: ${isGraduate}, Status: ${currentStatus === "Current status" ? "Fresher" : currentStatus}, Age: ${age}, City: ${city.trim()}`,
        source: "acwm-check-if-you-qualify",
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
      setPdfPhoneError(phoneCheck.error || "Please enter a valid 10-digit mobile number.");
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
        program: "Interview Prep PDF Download — ACWM Wealth Officer",
        source: "acwm-interview-pdf-modal",
      });
    } catch {
      // Continue to download even if network logger encounters glitch
    } finally {
      setPdfSubmitting(false);
      setPdfDownloaded(true);

      // Trigger actual download of the supplied PDF
      const link = document.createElement("a");
      link.href = "/assets/acwm/bajaj_capital_interview_prep_kit.pdf";
      link.download = "Bajaj_Capital_Interview_Prep_Kit.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 7 Concise FAQs
  const FAQS = [
    {
      q: "Who can apply?",
      a: "Candidates with 12th Pass or above from any stream (Commerce, Arts, Science, etc.) with functional English communication. Both freshers and experienced candidates can apply.",
    },
    {
      q: "Is prior experience required?",
      a: "No prior experience in banking, finance, or wealth management is required. Structured online modules train you specifically for the Wealth Officer role.",
    },
    {
      q: "Do I need coding or technical skills?",
      a: "No coding or technical skills are needed. Wealth Officers focus on client portfolio advisory, mutual funds, relationship management, and financial planning.",
    },
    {
      q: "What happens after the entrance interview?",
      a: "Candidates who clear the entrance interview receive selection confirmation and their conditional corporate offer before online training begins.",
    },
    {
      q: "What is the Wealth Officer role?",
      a: "Wealth Officers evaluate client goals, provide mutual fund and investment guidance, and manage wealth portfolios at Bajaj Capital*.",
    },
    {
      q: "What package is offered?",
      a: "Selected candidates receive a full-time ₹4.2 LPA PACKAGE* with PAN India placement upon programme completion.",
    },
    {
      q: "How does the job guarantee work?",
      a: "The programme is structured around selection first: clearing the entrance interview and completing the training modules and paid internship secures your 100% guaranteed placement.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>Hired First. Trained Next. — 100% Job Guaranteed Online Course | ₹4.2 LPA</title>
        <meta
          name="description"
          content="Hired First. Trained Next. 100% Job Guaranteed Online Course with ₹4.2 LPA PACKAGE* as a Wealth Officer at Bajaj Capital. No experience, no coding, no tech skills required."
        />
        <link rel="canonical" href="https://degreeguru.in/placement-guaranteed/" />
      </Helmet>

      {/* Main Page Container */}
      <div className="min-h-screen bg-[#F7F5F0] text-[#071B35] font-sans antialiased selection:bg-emerald-800 selection:text-white pb-20 md:pb-0">
        
        {/* ========================================================================= */}
        {/* HEADER — MINIMAL RECRUITMENT BRANDING */}
        {/* ========================================================================= */}
        <header className="bg-[#071B35] text-white border-b border-white/10 py-3.5 px-4 sm:px-8 sticky top-0 z-40">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <div className="bg-white/95 px-3 py-1.5 rounded-lg border border-white/20 flex items-center">
                <img
                  src="/assets/acwm/bajaj-capital.png"
                  alt="Bajaj Capital"
                  className="h-6 sm:h-7 w-auto object-contain"
                />
              </div>
            </div>

            <button
              onClick={scrollToForm}
              className="group inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-[#071B35] font-black text-xs sm:text-sm tracking-wide transition-all duration-200 active:scale-95 cursor-pointer shadow-sm hover:shadow-md"
            >
              <span>CHECK ELIGIBILITY</span>
              <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
            </button>

          </div>
        </header>

        {/* ========================================================================= */}
        {/* 1. HERO — SHORT, CLEAN, HIGH-CONVERSION & EMOTIONALLY RELEVANT */}
        {/* ========================================================================= */}
        <section className={`bg-[#071B35] text-white py-12 sm:py-16 lg:py-20 border-b border-white/10 overflow-hidden transition-opacity duration-700 ${heroMounted ? "opacity-100" : "opacity-0"}`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Visual Hierarchy */}
              <div className="lg:col-span-7 space-y-5">
                
                {/* 1. Single Green Hero Chip */}
                <div 
                  className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/30 text-emerald-400 text-xs font-black tracking-widest uppercase transition-all duration-500 delay-100 ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                >
                  <span>100% JOB GUARANTEED ONLINE COURSE</span>
                </div>

                {/* 2. Main Headline: H1 */}
                <h1 
                  className={`text-4xl sm:text-5xl lg:text-[58px] font-black text-white tracking-tight leading-[1.06] transition-all duration-600 delay-200 ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  }`}
                >
                  HIRED FIRST.<br />
                  <span className="text-emerald-400">TRAINED NEXT.</span>
                </h1>

                {/* 3. Package & Role Immediately Below */}
                <div 
                  className={`space-y-1 transition-all duration-500 delay-300 ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                >
                  <p className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    ₹4.2 LPA PACKAGE*
                  </p>
                  <p className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                    WEALTH OFFICER
                  </p>
                </div>

                {/* 4. Objection Breaker */}
                <div 
                  className={`text-sm sm:text-base font-bold text-slate-200 tracking-wide transition-all duration-500 delay-400 ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                  }`}
                >
                  No experience. No coding. No tech skills.
                </div>

                {/* 5. One Short Explanatory Sentence */}
                <p 
                  className={`text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg transition-all duration-500 delay-500 ${
                    heroMounted ? "opacity-100" : "opacity-0"
                  }`}
                >
                  Get selected through the entrance interview, then train online for the role.
                </p>

                {/* 6. Simple Visual Journey */}
                <div 
                  className={`pt-1 text-xs font-black tracking-wider text-emerald-400 uppercase flex items-center gap-2 flex-wrap transition-all duration-500 delay-550 ${
                    heroMounted ? "opacity-100" : "opacity-0"
                  }`}
                >
                  <span>INTERVIEW</span>
                  <span className="text-slate-500">→</span>
                  <span>SELECTION</span>
                  <span className="text-slate-500">→</span>
                  <span>TRAINING</span>
                  <span className="text-slate-500">→</span>
                  <span className="text-white">JOB</span>
                </div>

                {/* 7. Primary CTA & Secondary */}
                <div 
                  className={`pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 transition-all duration-500 delay-600 ${
                    heroMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                  }`}
                >
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

              {/* Right Column: Premium Wealth Officer Image (Scales 97% -> 100%) */}
              <div className="lg:col-span-5">
                <div 
                  className={`rounded-2xl overflow-hidden border border-white/15 shadow-2xl bg-[#051427] transition-all duration-700 delay-300 transform ${
                    heroMounted ? "opacity-100 scale-100" : "opacity-0 scale-[0.97]"
                  }`}
                >
                  <img
                    src="/assets/acwm/indian_wealth_officer.jpg"
                    alt="Wealth Officer"
                    className="w-full h-[320px] sm:h-[420px] object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* TRUST STRIP (SLIM • APPROVED CREDENTIALS ONLY • NO CARDS) */}
        {/* ========================================================================= */}
        <section className="py-4 bg-[#F7F5F0] border-b border-[#E5E0D5]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8 flex items-center justify-between gap-6 flex-wrap">
            <span className="text-[11px] font-black uppercase tracking-widest text-slate-400">
              PROGRAMME CREDENTIALS
            </span>
            <div className="flex items-center gap-8 sm:gap-14 grayscale hover:grayscale-0 transition-all opacity-85">
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
                alt="ICFP"
                className="h-4 sm:h-5 w-auto object-contain"
              />
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. PROBLEM → ANSWER (NO CARDS • TYPOGRAPHY & WHITESPACE) */}
        {/* ========================================================================= */}
        <section ref={problemRef} className="py-20 sm:py-28 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-6">
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#071B35] tracking-tight leading-tight uppercase">
              WANT A BETTER CAREER,<br />
              BUT DON'T HAVE EXPERIENCE?
            </h2>

            <div className="pt-2">
              <span className="text-2xl sm:text-3xl font-black text-emerald-800 tracking-tight block">
                YOU DON'T NEED IT.
              </span>
            </div>

            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-xl mx-auto leading-relaxed">
              No coding. No technical background.<br />
              Clear the entrance interview, get selected and train for the role.
            </p>

            <div className="pt-6 flex items-center justify-center gap-6 sm:gap-10 text-xs sm:text-sm font-black uppercase tracking-wider text-[#071B35] flex-wrap">
              <span 
                className={`flex items-center gap-2 transition-all duration-500 transform ${
                  problemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                NO EXPERIENCE
              </span>
              <span 
                className={`flex items-center gap-2 transition-all duration-500 delay-200 transform ${
                  problemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                NO CODING
              </span>
              <span 
                className={`flex items-center gap-2 transition-all duration-500 delay-400 transform ${
                  problemVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-emerald-700"></span>
                NO TECH SKILLS
              </span>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. THE DIFFERENCE (CENTRAL PROPOSITION • SUBTLE VISUALS) */}
        {/* ========================================================================= */}
        <section ref={diffRef} className="py-20 sm:py-28 bg-[#F7F5F0] border-b border-[#E5E0D5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
            
            <div className="text-center space-y-3">
              <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                THE PARADIGM SHIFT
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#071B35] tracking-tight uppercase">
                MOST COURSES TRAIN YOU FIRST.
              </h2>
              <div className="text-xs sm:text-sm font-bold text-slate-500 uppercase tracking-widest pt-1">
                TRAIN → HOPE FOR A JOB
              </div>
            </div>

            <div className="border-t-2 border-dashed border-[#D5CEBF] pt-12 text-center space-y-4">
              <h3 className="text-3xl sm:text-5xl font-black text-emerald-800 tracking-tight leading-tight uppercase">
                HERE, YOU'RE HIRED FIRST.<br />
                TRAINED NEXT.
              </h3>

              <div className="pt-4 flex items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-black uppercase tracking-wider text-[#071B35] flex-wrap">
                <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E5E0D5] shadow-2xs">SELECTION</span>
                <span className="text-emerald-700 text-lg">→</span>
                <span className="px-3.5 py-1.5 rounded-lg bg-white border border-[#E5E0D5] shadow-2xs">TRAINING</span>
                <span className="text-emerald-700 text-lg">→</span>
                <span className="px-3.5 py-1.5 rounded-lg bg-emerald-700 text-white shadow-2xs">CAREER</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. HOW IT WORKS (CONNECTED TIMELINE • NOT CARDS) */}
        {/* ========================================================================= */}
        <section ref={timelineRef} className="py-20 sm:py-28 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-12">
            
            <div className="text-center space-y-1">
              <h2 className="text-2xl sm:text-4xl font-black text-[#071B35] tracking-tight uppercase">
                FROM INTERVIEW TO CAREER.
              </h2>
            </div>

            {/* Connected Progressive Timeline */}
            <div className="space-y-8 relative border-l-2 border-[#D5CEBF] ml-4 sm:ml-8 pl-6 sm:pl-10 py-2">
              
              {/* 01 ENTRANCE INTERVIEW */}
              <div 
                className={`relative space-y-1 transition-all duration-500 ${
                  timelineVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#071B35] text-white flex items-center justify-center text-[10px] font-black">
                  1
                </div>
                <span className="text-[11px] font-black text-slate-400 block uppercase tracking-widest">01</span>
                <h3 className="text-lg sm:text-xl font-black text-[#071B35] tracking-tight">ENTRANCE INTERVIEW</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Clear the entrance interview.</p>
              </div>

              {/* 02 SELECTION */}
              <div 
                className={`relative space-y-1 transition-all duration-500 delay-150 ${
                  timelineVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-[#071B35] text-white flex items-center justify-center text-[10px] font-black">
                  2
                </div>
                <span className="text-[11px] font-black text-slate-400 block uppercase tracking-widest">02</span>
                <h3 className="text-lg sm:text-xl font-black text-[#071B35] tracking-tight">SELECTION</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Get selected for the programme.</p>
              </div>

              {/* 03 ONLINE TRAINING */}
              <div 
                className={`relative space-y-1 transition-all duration-500 delay-300 ${
                  timelineVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                  3
                </div>
                <span className="text-[11px] font-black text-emerald-800 block uppercase tracking-widest">03</span>
                <h3 className="text-lg sm:text-xl font-black text-[#071B35] tracking-tight">ONLINE TRAINING</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Build the skills required for the role.</p>
              </div>

              {/* 04 PAID INTERNSHIP */}
              <div 
                className={`relative space-y-1 transition-all duration-500 delay-450 ${
                  timelineVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                  4
                </div>
                <span className="text-[11px] font-black text-emerald-800 block uppercase tracking-widest">04</span>
                <h3 className="text-lg sm:text-xl font-black text-[#071B35] tracking-tight">PAID INTERNSHIP</h3>
                <p className="text-xs sm:text-sm text-emerald-800 font-black">₹15,000/month*</p>
              </div>

              {/* 05 WEALTH OFFICER */}
              <div 
                className={`relative space-y-1 transition-all duration-500 delay-600 ${
                  timelineVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
                }`}
              >
                <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-[10px] font-black">
                  5
                </div>
                <span className="text-[11px] font-black text-emerald-800 block uppercase tracking-widest">05</span>
                <h3 className="text-lg sm:text-xl font-black text-emerald-800 tracking-tight">WEALTH OFFICER</h3>
                <p className="text-xs sm:text-sm text-slate-600 font-medium">Begin your career in Wealth Management.</p>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. THE ACTUAL JOB (DEEP NAVY • CLEAR OUTCOME) */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#071B35] text-white border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight uppercase">
                  YOUR FIRST CAREER ROLE:<br />
                  <span className="text-emerald-400">WEALTH OFFICER</span>
                </h2>

                <div className="space-y-1">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Hiring Partner</span>
                  <div className="text-2xl sm:text-3xl font-black text-white">BAJAJ CAPITAL*</div>
                </div>

                <div className="border-l-4 border-emerald-400 pl-4 py-1">
                  <span className="text-3xl sm:text-5xl font-black text-emerald-400 tracking-tight block">
                    ₹4.2 LPA PACKAGE*
                  </span>
                </div>

                <div className="pt-1">
                  <span className="inline-block px-3.5 py-1 rounded-full bg-white/10 text-xs font-bold uppercase tracking-wider text-emerald-400">
                    PAN INDIA PLACEMENT
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-300 font-medium leading-relaxed max-w-lg pt-1">
                  Build your career in Wealth Management through a structured path from training to employment.
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-2xl overflow-hidden border border-white/15 shadow-xl bg-[#051427]">
                  <img
                    src="/assets/acwm/indian_wealth_consultation.jpg"
                    alt="Wealth Officer Workplace"
                    className="w-full h-[320px] sm:h-[400px] object-cover transition-transform duration-500 hover:scale-[1.02]"
                  />
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. WHAT YOU'LL BE TRAINED FOR (CLEAN TYPOGRAPHY • NO CARD GRID) */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#F7F5F0] border-b border-[#E5E0D5]">
          <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
            
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-4xl font-black text-[#071B35] tracking-tight uppercase">
                TRAIN FOR THE ROLE YOU'RE JOINING.
              </h2>
              <p className="text-sm sm:text-base text-slate-600 font-medium">
                Build practical skills for Wealth Management.
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-4xl sm:text-5xl font-black text-[#071B35] block">
                240 HOURS
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-800 block">
                OF INDUSTRY-FOCUSED LEARNING*
              </span>
            </div>

            <div className="divide-y divide-[#E5E0D5] text-sm sm:text-base font-bold text-slate-800 pt-2 border-t border-[#E5E0D5]">
              <div className="py-3">Wealth Management</div>
              <div className="py-3">Financial Planning</div>
              <div className="py-3">Investment Products</div>
              <div className="py-3">Client Communication</div>
              <div className="py-3">Relationship Management</div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 8. CERTIFICATION (ACTUAL IMAGE • ONLY CARD #1) */}
        {/* ========================================================================= */}
        <section ref={certRef} className="py-20 sm:py-28 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-6xl mx-auto px-4 sm:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              
              <div className="lg:col-span-6 space-y-4">
                <h2 className="text-2xl sm:text-4xl font-black text-[#071B35] tracking-tight uppercase leading-tight">
                  LEARN. GET CERTIFIED.<br />
                  MOVE FORWARD.
                </h2>
                <p className="text-sm sm:text-base text-slate-600 font-medium max-w-md">
                  Complete the programme and earn the relevant Wealth Management certification.
                </p>
              </div>

              <div className="lg:col-span-6">
                <div 
                  className={`rounded-2xl overflow-hidden border border-slate-200 shadow-xl bg-white p-2 sm:p-3 transition-all duration-700 transform ${
                    certVisible ? "opacity-100 scale-100 shadow-2xl" : "opacity-0 scale-[0.96] shadow-sm"
                  }`}
                >
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
        {/* 9. PAID INTERNSHIP (EXTREMELY MINIMAL • NUMBER COUNT ANIMATION) */}
        {/* ========================================================================= */}
        <section ref={internshipRef} className="py-16 sm:py-24 bg-[#F7F5F0] border-b border-[#E5E0D5] text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
              LEARN. GAIN EXPERIENCE. EARN.
            </h2>
            <span className="text-4xl sm:text-6xl font-black text-emerald-800 tracking-tight block">
              ₹{internshipCount > 0 ? internshipCount.toLocaleString("en-IN") : "15,000"} / MONTH*
            </span>
            <span className="text-xs sm:text-sm font-black uppercase tracking-widest text-[#071B35] block">
              PAID INTERNSHIP*
            </span>
            <p className="text-xs sm:text-sm text-slate-600 font-medium pt-1 max-w-md mx-auto">
              Gain practical exposure while you learn.
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 10. GUARANTEED JOB SECTION (DEEP NAVY • POWERFUL 100% MOMENT) */}
        {/* ========================================================================= */}
        <section ref={guaranteeRef} className="py-20 sm:py-32 bg-[#071B35] text-white border-b border-white/10 text-center">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-6">
            
            <div className="space-y-1">
              <div className="text-7xl sm:text-9xl md:text-[130px] font-black tracking-tight leading-none text-white block">
                {guaranteeCount}%
              </div>
              <div 
                className={`text-2xl sm:text-4xl font-black tracking-tight uppercase text-emerald-400 block transition-all duration-700 delay-300 transform ${
                  guaranteeVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
              >
                JOB GUARANTEED*
              </div>
            </div>

            <div className="pt-1">
              <span className="text-2xl sm:text-3xl font-black text-white tracking-tight block">
                ₹4.2 LPA PACKAGE*
              </span>
            </div>

            <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed pt-2">
              *Terms &amp; conditions apply.
            </p>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 11. PROGRAMME INVESTMENT (CLEAR & VERIFIED • NO PRICING CARDS) */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-6">
            
            <h2 className="text-2xl sm:text-4xl font-black text-[#071B35] tracking-tight uppercase">
              WHAT DOES IT TAKE TO START?
            </h2>

            <div className="space-y-1 pt-2">
              <span className="text-3xl sm:text-4xl font-black text-emerald-800 tracking-tight block">
                ₹500 REGISTRATION FEE
              </span>
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 block">
                TO BOOK YOUR ENTRANCE EVALUATION
              </span>
            </div>

            <div className="pt-2 text-4xl sm:text-5xl font-black text-[#071B35] tracking-tight">
              ₹1,77,000 <span className="text-xs font-bold text-slate-500 uppercase tracking-widest block pt-1">TOTAL PROGRAMME FEE*</span>
            </div>

            <div className="flex items-center justify-center gap-4 text-xs font-bold text-slate-600 flex-wrap pt-2">
              <span>₹500 Registration</span>
              <span>•</span>
              <span>₹1,50,000 Programme Fee</span>
              <span>•</span>
              <span>₹27,000 GST</span>
            </div>

            <div className="pt-2">
              <span className="inline-block px-4 py-1.5 rounded-lg bg-slate-100 text-xs font-black text-slate-800">
                EMI OPTIONS AVAILABLE UP TO 10 MONTHS*
              </span>
            </div>

            <div className="pt-4">
              <button
                onClick={scrollToForm}
                className="group px-7 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-xs active:scale-95 inline-flex items-center gap-2"
              >
                <span>CHECK MY ELIGIBILITY</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 12. ELIGIBILITY (SIMPLE • NO CARD GRID) */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#F7F5F0] border-b border-[#E5E0D5]">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 text-center space-y-6">
            
            <h2 className="text-2xl sm:text-4xl font-black text-[#071B35] tracking-tight uppercase">
              COULD YOU BE ELIGIBLE?
            </h2>

            <div className="space-y-3 text-sm sm:text-base font-bold text-slate-800 pt-2 text-left max-w-md mx-auto">
              <div className="flex items-center gap-3">
                <Check size={18} className="text-emerald-700 shrink-0" />
                <span>12th PASS+</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-emerald-700 shrink-0" />
                <span>ANY STREAM</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-emerald-700 shrink-0" />
                <span>FRESHER OR EXPERIENCED</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-emerald-700 shrink-0" />
                <span>ENGLISH COMMUNICATION</span>
              </div>
              <div className="flex items-center gap-3">
                <Check size={18} className="text-emerald-700 shrink-0" />
                <span>ENTRANCE INTERVIEW REQUIRED</span>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. INTERVIEW PREP PDF (SECONDARY CONVERSION WITH CLEAN MODAL FLOW) */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-20 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 text-center space-y-5">
            
            <span className="text-xs font-black uppercase tracking-widest text-emerald-800 block">
              NOT READY TO APPLY YET?
            </span>

            <h2 className="text-2xl sm:text-4xl font-black text-[#071B35] tracking-tight uppercase">
              START WITH THE INTERVIEW.
            </h2>

            <p className="text-xs sm:text-sm text-slate-600 font-medium max-w-md mx-auto">
              Get the Interview Prep PDF and prepare before your entrance interview.
            </p>

            <div className="pt-2">
              <button
                onClick={() => {
                  setPdfModalOpen(true);
                  setPdfDownloaded(false);
                }}
                className="group px-7 py-3.5 rounded-xl bg-[#071B35] hover:bg-[#0c2a52] text-white font-black text-xs sm:text-sm tracking-wide transition-all duration-200 cursor-pointer shadow-md active:scale-95 inline-flex items-center gap-2"
              >
                <Download size={15} className="text-emerald-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span>DOWNLOAD INTERVIEW PREP PDF</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 14. MAIN ELIGIBILITY FORM — MATCHES "CHECK IF YOU QUALIFY" DESIGN */}
        {/* ========================================================================= */}
        <section id="main-eligibility-form" className="py-20 sm:py-28 bg-[#06182E] border-b border-white/10">
          <div className="max-w-[490px] mx-auto px-4 sm:px-6">
            <div className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-9 shadow-2xl border border-white/10">
              
              {/* Heading & Subtitle */}
              <div className="space-y-2 pb-6">
                <h2 className="font-serif text-[28px] sm:text-[34px] font-bold text-[#0B2545] tracking-tight leading-tight">
                  Check if you qualify
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 font-normal leading-relaxed">
                  A counsellor calls you within one working day. No payment at this stage.
                </p>
              </div>

              {submitted ? (
                <div className="py-8 text-center space-y-3">
                  <CheckCircle2 className="mx-auto text-emerald-600" size={48} />
                  <h4 className="text-xl font-bold text-[#0B2545]">Application Received</h4>
                  <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
                    A counsellor will review your profile and connect with you within one working day.
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
                      placeholder="Full name"
                      value={fullName}
                      onChange={(e) => {
                        setFullName(e.target.value);
                        if (nameError) setNameError("");
                      }}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#0F2942] placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                    />
                    {nameError && <p className="text-[11px] text-rose-600 font-semibold">{nameError}</p>}
                  </div>

                  {/* Phone & Email Row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Mobile with India Flag & +91 */}
                    <div className="space-y-1">
                      <div className="flex rounded-lg border border-slate-300 overflow-hidden bg-white focus-within:border-[#3B82F6] focus-within:ring-1 focus-within:ring-[#3B82F6]">
                        <div className="flex items-center gap-1 px-2.5 border-r border-slate-300 text-slate-700 text-sm select-none shrink-0 bg-white">
                          <span className="text-base leading-none">🇮🇳</span>
                          <span className="text-[10px] text-slate-500">▾</span>
                        </div>
                        <span className="flex items-center pl-2.5 text-slate-600 text-sm font-medium select-none shrink-0">
                          +91
                        </span>
                        <input
                          id={phoneInputId}
                          type="tel"
                          required
                          maxLength={10}
                          placeholder=""
                          value={mobileNumber}
                          onChange={(e) => {
                            setMobileNumber(e.target.value.replace(/\D/g, ""));
                            if (phoneError) setPhoneError("");
                          }}
                          className="w-full px-2 py-3 text-sm text-[#0F2942] focus:outline-none"
                        />
                      </div>
                      {phoneError && <p className="text-[11px] text-rose-600 font-semibold">{phoneError}</p>}
                    </div>

                    {/* Email Address */}
                    <div className="space-y-1">
                      <input
                        id={emailInputId}
                        type="email"
                        required
                        placeholder="Email"
                        value={emailAddress}
                        onChange={(e) => {
                          setEmailAddress(e.target.value);
                          if (emailError) setEmailError("");
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#0F2942] placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                      />
                      {emailError && <p className="text-[11px] text-rose-600 font-semibold">{emailError}</p>}
                    </div>
                  </div>

                  {/* City & Age Row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <input
                        id={cityInputId}
                        type="text"
                        required
                        placeholder="City"
                        value={city}
                        onChange={(e) => {
                          setCity(e.target.value);
                          if (cityError) setCityError("");
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#0F2942] placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                      />
                      {cityError && <p className="text-[11px] text-rose-600 font-semibold">{cityError}</p>}
                    </div>

                    <div className="space-y-1">
                      <input
                        id={ageInputId}
                        type="number"
                        min={18}
                        max={45}
                        required
                        placeholder="Age"
                        value={age}
                        onChange={(e) => {
                          setAge(e.target.value);
                          if (ageError) setAgeError("");
                        }}
                        className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-[#0F2942] placeholder:text-slate-400 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6]"
                      />
                      {ageError && <p className="text-[11px] text-rose-600 font-semibold">{ageError}</p>}
                    </div>
                  </div>

                  {/* Current Status Dropdown */}
                  <div className="relative">
                    <select
                      value={currentStatus}
                      onChange={(e) => setCurrentStatus(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-slate-300 text-sm text-slate-700 bg-white appearance-none focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] cursor-pointer"
                    >
                      <option value="Current status" disabled>Current status</option>
                      <option value="Fresher / Looking for first job">Fresher / Looking for first job</option>
                      <option value="Working professional">Working professional</option>
                      <option value="Final year student">Final year student</option>
                      <option value="Other">Other</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-600 pointer-events-none" />
                  </div>

                  {/* Graduate? Toggle Buttons */}
                  <div className="flex items-center justify-between gap-3 pt-1">
                    <span className="text-sm font-semibold text-slate-700">Graduate?</span>
                    <div className="grid grid-cols-2 gap-2.5 flex-1 max-w-[270px]">
                      <button
                        type="button"
                        onClick={() => setIsGraduate("Yes")}
                        className={`py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                          isGraduate === "Yes"
                            ? "bg-[#337AB7] text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        Yes
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsGraduate("Not yet")}
                        className={`py-2.5 rounded-lg text-sm font-bold transition-all cursor-pointer ${
                          isGraduate === "Not yet"
                            ? "bg-[#337AB7] text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        Not yet
                      </button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 rounded-lg bg-[#83A6CD] hover:bg-[#6F95BF] text-white font-bold text-base transition-colors shadow-xs cursor-pointer active:scale-[0.99] disabled:opacity-50"
                    >
                      {isSubmitting ? "Checking..." : "Check my eligibility"}
                    </button>
                  </div>

                  {/* Disclaimer */}
                  <p className="text-[11px] sm:text-xs text-slate-500 text-center pt-1 font-normal leading-relaxed">
                    By submitting you agree to our{" "}
                    <a href="/privacy" className="text-[#2D68C4] hover:underline font-semibold">Terms</a>
                    {" & "}
                    <a href="/privacy" className="text-[#2D68C4] hover:underline font-semibold">Privacy Policy</a>
                  </p>

                </form>
              )}

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 15. FAQ (ANIMATED ACCORDION • 7 QUESTIONS MAX) */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-white border-b border-[#EAE5DA]">
          <div className="max-w-3xl mx-auto px-4 sm:px-8 space-y-8">
            
            <h2 className="text-2xl sm:text-3xl font-black text-[#071B35] text-center uppercase tracking-tight">
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
        {/* 16. FINAL CTA (DEEP NAVY • POWERFUL CLOSING) */}
        {/* ========================================================================= */}
        <section className="py-20 sm:py-28 bg-[#071B35] text-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-8 space-y-5">
            
            <h2 className="text-4xl sm:text-5xl font-black leading-tight tracking-tight uppercase">
              HIRED FIRST.<br />
              <span className="text-emerald-400">TRAINED NEXT.</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 font-medium">
              Your first step is the entrance interview.
            </p>

            <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={scrollToForm}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#071B35] font-black text-sm tracking-wide transition-all duration-200 shadow-lg hover:shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>CHECK MY ELIGIBILITY</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>

              <button
                onClick={() => {
                  setPdfModalOpen(true);
                  setPdfDownloaded(false);
                }}
                className="group w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs tracking-wider uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download size={14} className="text-emerald-400 transition-transform duration-200 group-hover:-translate-y-0.5" />
                <span>DOWNLOAD INTERVIEW PREP PDF</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* FOOTER */}
        {/* ========================================================================= */}
        <footer className="bg-[#040F1E] text-slate-400 py-6 border-t border-white/10 text-center text-xs">
          <div className="max-w-6xl mx-auto px-4 space-y-2">
            <div className="flex items-center justify-center gap-2 text-slate-300 font-semibold text-xs flex-wrap">
              <span>Hiring Partner: <strong className="text-white">Bajaj Capital</strong></span>
              <span>•</span>
              <span>AIMA &amp; ICOFP Credentials</span>
            </div>
            <p className="text-[10px] text-slate-500 max-w-lg mx-auto leading-relaxed">
              *Subject to candidate clearing entrance evaluation interview, completing prescribed training modules, and applicable programme terms.
            </p>
          </div>
        </footer>

        {/* ========================================================================= */}
        {/* 17. DEGREE GURU FLOATING WHATSAPP BUTTON */}
        {/* ========================================================================= */}
        <a
          href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20want%20to%20know%20more%20about%20the%20Wealth%20Officer%20career%20programme"
          target="_blank"
          rel="noreferrer"
          aria-label="Chat with Degree Guru on WhatsApp"
          className="fixed z-50 flex items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl hover:scale-105 active:scale-95 transition-transform duration-200 right-5 bottom-20 md:bottom-5 w-[48px] h-[48px] md:w-[52px] md:h-[52px]"
        >
          <MessageCircle size={26} className="fill-white stroke-none" />
        </a>

        {/* ========================================================================= */}
        {/* 18. MOBILE STICKY CTA */}
        {/* ========================================================================= */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-xl flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-black text-emerald-800 block truncate">100% JOB GUARANTEED ONLINE COURSE</span>
            <span className="text-[10px] text-slate-500 block truncate">₹4.2 LPA PACKAGE*</span>
          </div>
          <button
            onClick={scrollToForm}
            className="px-4 py-2.5 rounded-xl bg-emerald-700 text-white font-black text-xs tracking-wider uppercase transition-all shadow-xs active:scale-95 shrink-0 cursor-pointer"
          >
            CHECK MY ELIGIBILITY →
          </button>
        </div>

        {/* ========================================================================= */}
        {/* PDF DOWNLOAD MODAL (FRICTIONLESS 3-FIELD SECONDARY LEAD-GEN) */}
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
                      Download Started Successfully!
                    </p>
                    <p className="text-xs text-slate-500 max-w-xs mx-auto">
                      Check your browser downloads for the Interview Prep PDF kit.
                    </p>
                  </div>

                  <div className="pt-2 border-t border-slate-100 space-y-2">
                    <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest block">
                      NEED HELP?
                    </span>
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
                      placeholder="Enter your full name"
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
                      placeholder="Enter your mobile number"
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
                      placeholder="Enter your email address"
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
                      {pdfSubmitting ? "Preparing Download..." : "GET THE INTERVIEW PDF →"}
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
