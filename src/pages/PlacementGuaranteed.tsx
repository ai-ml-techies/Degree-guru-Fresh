import React, { useState, useEffect, useRef, useId } from "react";
import { Helmet } from "react-helmet-async";
import {
  Check,
  ChevronDown,
  CheckCircle2,
  Download,
  FileText,
  X,
  Briefcase,
  GraduationCap,
  TrendingUp,
  ShieldCheck,
  Award,
  Clock,
  Building2,
  Calendar,
  MessageCircle
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { validateIndianMobile, validateMeaningfulName, validateMeaningfulEmail } from "@/lib/validation";
import aimaLogo from "@/assets/acwm/aima.png";
import bajajCapitalLogo from "@/assets/acwm/bajaj-capital.png";
import icofpLogo from "@/assets/acwm/icofp.png";

export const PlacementGuaranteed = () => {
  // Page Mount / Hero Animation
  const [heroMounted, setHeroMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHeroMounted(true), 40);
    return () => clearTimeout(timer);
  }, []);

  // Form State (Hero & Dedicated Eligibility)
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [currentStatus, setCurrentStatus] = useState("job-seeking");
  const [isGraduate, setIsGraduate] = useState("yes");

  const [nameError, setNameError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [cityError, setCityError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // PDF Download Modal State (Interview Prep PDF)
  const [pdfModalOpen, setPdfModalOpen] = useState(false);
  const [pdfName, setPdfName] = useState("");
  const [pdfPhone, setPdfPhone] = useState("");
  const [pdfEmail, setPdfEmail] = useState("");
  const [pdfNameError, setPdfNameError] = useState("");
  const [pdfPhoneError, setPdfPhoneError] = useState("");
  const [pdfEmailError, setPdfEmailError] = useState("");
  const [pdfSubmitting, setPdfSubmitting] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  // Animated Numbers State
  const [internshipCount, setInternshipCount] = useState(0);

  // Active FAQ toggler
  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Internship animation observer
  const internshipRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
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
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    if (internshipRef.current) observer.observe(internshipRef.current);
    return () => observer.disconnect();
  }, []);

  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();

  const scrollToApply = () => {
    const el = document.getElementById("apply-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      const firstInput = document.getElementById(nameInputId);
      if (firstInput) firstInput.focus();
    }
  };

  // Helper to save and export leads to Excel (client-side backup + server sync)
  const saveLeadToExcelStorage = (leadData: Record<string, string>) => {
    try {
      const stored = localStorage.getItem("dg_acwm_excel_leads");
      const list = stored ? JSON.parse(stored) : [];
      list.unshift({ ...leadData, timestamp: new Date().toISOString() });
      localStorage.setItem("dg_acwm_excel_leads", JSON.stringify(list));
    } catch {
      // LocalStorage fallback
    }
  };

  // Export all collected leads to Excel (.csv format with BOM)
  const handleExportLeadsToExcel = () => {
    try {
      const stored = localStorage.getItem("dg_acwm_excel_leads");
      const list = stored ? JSON.parse(stored) : [];
      if (!list || list.length === 0) {
        alert("No leads recorded in local session yet. Leads are also saved directly in the backend database.");
        return;
      }

      const headers = ["ID", "Timestamp", "Full Name", "Phone Number", "Email", "City", "Age", "Current Status", "Graduate", "Program", "Source"];
      const rows = list.map((item: any, idx: number) => [
        idx + 1,
        item.timestamp || "",
        `"${(item.name || "").replace(/"/g, '""')}"`,
        `"${item.phone || ""}"`,
        `"${item.email || ""}"`,
        `"${item.city || ""}"`,
        `"${item.age || ""}"`,
        `"${item.status || ""}"`,
        `"${item.graduate || ""}"`,
        `"${(item.program || "").replace(/"/g, '""')}"`,
        `"${item.source || ""}"`
      ]);

      const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r: any) => r.join(","))].join("\r\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `Bajaj_Capital_ACWM_Leads_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error("Export error", e);
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
    if (age.trim() && (isNaN(Number(age)) || Number(age) < 18 || Number(age) > 40)) {
      setAgeError("Please enter an age between 18 and 40.");
      return;
    }

    setNameError("");
    setPhoneError("");
    setEmailError("");
    setCityError("");
    setAgeError("");

    setIsSubmitting(true);

    const leadInfo = {
      name: nameCheck.normalized || fullName.trim(),
      phone: `+91 ${phoneCheck.normalized || phoneNumber.replace(/\D/g, "").slice(-10)}`,
      email: emailAddress.trim().toLowerCase(),
      city: city.trim(),
      age: age.trim() || "Unspecified",
      status: currentStatus,
      graduate: isGraduate,
      program: `ACWM Wealth Officer (Bajaj Capital) | City: ${city.trim()} | Age: ${age.trim() || "N/A"} | Status: ${currentStatus} | Grad: ${isGraduate}`,
      source: "bajaj-capital-acwm-career-programme",
    };

    // 1. Save to Excel local cache
    saveLeadToExcelStorage(leadInfo);

    // 2. Submit to backend API (which automatically appends to server Excel CSV and emails agestartup@gmail.com)
    try {
      await submitLead({
        name: leadInfo.name,
        phone: leadInfo.phone,
        email: leadInfo.email,
        program: leadInfo.program,
        source: leadInfo.source,
        formHeading: "Check if you qualify (Bajaj Capital ACWM Programme)",
        city: city.trim(),
        age: age.trim() || "Unspecified",
        status: currentStatus,
        graduate: isGraduate === "yes" ? "Yes, Completed" : "In Final Year / Not yet",
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

    const pdfLeadInfo = {
      name: nameCheck.normalized || pdfName.trim(),
      phone: `+91 ${phoneCheck.normalized || pdfPhone.replace(/\D/g, "").slice(-10)}`,
      email: pdfEmail.trim().toLowerCase(),
      city: "Interview Prep Kit",
      age: "N/A",
      status: "Downloaded PDF",
      graduate: "Yes",
      program: "Interview Prep PDF Kit — ACWM Wealth Officer (Bajaj Capital)",
      source: "acwm-interview-prep-pdf-modal",
    };

    saveLeadToExcelStorage(pdfLeadInfo);

    try {
      await submitLead({
        name: pdfLeadInfo.name,
        phone: pdfLeadInfo.phone,
        email: pdfLeadInfo.email,
        program: pdfLeadInfo.program,
        source: pdfLeadInfo.source,
        formHeading: "Download Interview Prep PDF Kit",
        city: "Interview Prep Kit",
        age: "N/A",
        status: "Downloaded PDF",
        graduate: "Yes",
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

  // Comprehensive Leverage Edu Matching FAQs
  const FAQS = [
    {
      q: "Is the job guaranteed?",
      a: "Yes, under a written conditional Pre-Placement Offer (PPO) issued directly by Bajaj Capital. Once you clear the Bajaj Capital panel interview, you receive your written PPO before training starts. You are absorbed full-time from month seven with a starting package of ₹4.2 LPA to ₹4.8 LPA upon completing evaluations (80%+), keeping 85%+ attendance, and clearing NISM VA certification.",
    },
    {
      q: "What do I pay, and when?",
      a: "You pay only a ₹500 eligibility registration fee initially. The main programme fee (₹1,50,000 + 18% GST) is payable ONLY after you clear the Bajaj Capital interview and receive your written Pre-Placement Offer. Flexible 10-month 0% interest EMI payment options are available through partner NBFCs.",
    },
    {
      q: "Do I earn during the programme?",
      a: "Yes! During your 4-month practical internship at Bajaj Capital, you earn a guaranteed stipend of ₹15,000 per month (totaling ₹60,000). On completing 12 months of full-time employment as a Wealth Officer, you also receive an ₹85,000 retention bonus. Factoring this in, your real net out-of-pocket cost in Year 1 is just ₹32,000.",
    },
    {
      q: "I am not from a finance or technical background. Can I apply?",
      a: "Absolutely! The programme is specifically designed for graduates from any stream (BA, B.Com, B.Sc, BBA, B.Tech, etc.) from any recognised university. No prior finance, sales, or coding experience is required. Training starts from core foundational concepts up to advanced wealth advisory.",
    },
    {
      q: "What if I do not clear the Bajaj Capital interview?",
      a: "If you do not clear the initial entrance interview, you pay zero tuition fee! Our counsellors will guide you on interview improvement and you can re-apply for subsequent cohorts.",
    },
    {
      q: "What certifications will I receive upon completion?",
      a: "You earn the prestigious Advanced Certification in Wealth Management (ACWM) jointly certified by the International College of Financial Planning (ICOFP) and All India Management Association (AIMA). The programme also covers preparation for NISM VA (Mutual Funds), NISM XXI-B, BQP, and CFP Level 1 & 2.",
    },
    {
      q: "What are the job responsibilities and location for a Wealth Officer?",
      a: "As a Wealth Officer at Bajaj Capital, you manage client portfolios, advise individuals on mutual funds, SIPs, insurance, and tax-saving investments, and drive client acquisition. Postings are Pan-India across major metro and tier-1/tier-2 branch networks with relocation assistance.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>ACWM Career Programme — Wealth Officer Job at Bajaj Capital | Pre-Placement Offer</title>
        <meta
          name="description"
          content="Interview for a Wealth Officer role at Bajaj Capital, get a pre-placement offer, then train for the Advanced Certification in Wealth Management with ICOFP and AIMA. Starting package ₹4.2 LPA."
        />
        <link rel="canonical" href="https://degreeguru.in/placement-guaranteed" />
      </Helmet>

      {/* Standalone Landing Page Wrapper */}
      <div className="min-h-screen bg-[#F8F9FA] text-[#0B1527] font-sans antialiased selection:bg-[#2F73B2] selection:text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>

        {/* ========================================================================= */}
        {/* HEADER / NAVIGATION BAR */}
        {/* ========================================================================= */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-3">
            <div className="flex items-center min-w-0 shrink">
              <a href="#top" className="flex items-center">
                <img
                  src={bajajCapitalLogo}
                  alt="Bajaj Capital"
                  className="h-5 sm:h-8 max-h-5 sm:max-h-8 w-auto max-w-[150px] sm:max-w-none object-contain shrink-0"
                />
              </a>
            </div>

            <nav className="flex items-center gap-3 sm:gap-6 shrink-0">
              <a href="#how" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#2F73B2] transition-colors hidden md:inline">
                How it works
              </a>
              <a href="#job" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#2F73B2] transition-colors hidden md:inline">
                The job
              </a>
              <a href="#money" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#2F73B2] transition-colors hidden md:inline">
                Fees &amp; ROI
              </a>
              <a href="#faq" className="text-xs sm:text-sm font-semibold text-slate-600 hover:text-[#2F73B2] transition-colors hidden lg:inline">
                Eligibility &amp; FAQ
              </a>

            </nav>
          </div>
          {/* Progress fill accent bar */}
          <div className="h-0.5 w-full bg-gradient-to-r from-[#2F73B2] via-[#25AAD3] to-[#4BBC7C]" />
        </header>

        {/* ========================================================================= */}
        {/* 1. HERO SECTION (WITH EMBEDDED APPLICATION CARD) */}
        {/* ========================================================================= */}
        {/* ========================================================================= */}
        {/* 1. HERO SECTION (VERY CLEAN & MINIMAL EDITORIAL DESIGN) */}
        {/* ========================================================================= */}
        <section id="top" className="relative bg-[#061938] text-white pt-10 sm:pt-20 pb-16 sm:pb-24 border-b border-slate-800 overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">

              {/* Left Column: Editorial Value Proposition */}
              <div className="lg:col-span-7 space-y-5 sm:space-y-6">

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl lg:text-[56px] font-extrabold tracking-tight leading-[1.12] sm:leading-[1.08] text-white">
                  Job First.<br />
                  Train Next.<br />
                  <span className="text-[#2e9e5b]">
                    Build Your Career.
                  </span>
                </h1>

                {/* Clean Subheadline */}
                <p className="text-sm sm:text-[17px] text-[#9fb3c8] font-normal leading-relaxed max-w-lg">
                  Interview for a Wealth Officer role at Bajaj Capital. Starting package <strong className="text-white font-semibold">₹4.2 LPA</strong>. Receive a pre-placement offer before training begins.
                </p>

                {/* Subtle Divider */}
                <div className="border-t border-slate-700/60 my-5 sm:my-6 max-w-lg" />

                {/* 3 Key Stats (Clean Typography, No Background Cards) */}
                <div className="grid grid-cols-3 gap-2.5 sm:gap-6 max-w-lg">
                  <div>
                    <div className="text-lg sm:text-3xl font-bold text-[#2e9e5b] tracking-tight">₹60,000</div>
                    <div className="text-[11px] sm:text-xs text-[#9fb3c8] mt-1 leading-snug">stipend earned while you train</div>
                  </div>

                  <div>
                    <div className="text-lg sm:text-3xl font-bold text-[#2e9e5b] tracking-tight">6 months</div>
                    <div className="text-[11px] sm:text-xs text-[#9fb3c8] mt-1 leading-snug">from first interview to payroll</div>
                  </div>

                  <div>
                    <div className="text-lg sm:text-3xl font-bold text-[#2e9e5b] tracking-tight">₹4.2 LPA</div>
                    <div className="text-[11px] sm:text-xs text-[#9fb3c8] mt-1 leading-snug">starting package as a Wealth Officer</div>
                  </div>
                </div>

                {/* Interview Prep PDF Button Preserved Cleanly */}
                <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 max-w-md">
                  <button
                    type="button"
                    onClick={() => {
                      setPdfModalOpen(true);
                      setPdfDownloaded(false);
                    }}
                    className="inline-flex items-center justify-center gap-2 px-4 sm:px-5 py-2.5 rounded-lg bg-white/10 hover:bg-white/15 border border-white/20 text-xs sm:text-sm font-semibold text-white transition-all cursor-pointer shadow-xs whitespace-nowrap w-full sm:w-auto"
                  >
                    <Download size={15} className="text-[#2e9e5b] shrink-0" />
                    <span>INTERVIEW PREP MATERIAL</span>
                  </button>

                  <a
                    href="#how"
                    className="text-xs sm:text-sm text-[#9fb3c8] hover:text-white transition-colors py-1 inline-flex items-center justify-center sm:justify-start gap-1"
                  >
                    How it works ↓
                  </a>
                </div>

              </div>

              {/* Right Column: Clean White Application Form Card */}
              <div id="apply-section" className="lg:col-span-5">
                <div className="bg-white text-slate-900 rounded-2xl p-4 sm:p-7 shadow-2xl border border-slate-100 max-w-md mx-auto lg:ml-auto">

                  {/* Clean Form Header */}
                  <div className="mb-4 space-y-1">
                    <h2 className="text-2xl font-bold text-[#0c2340] tracking-tight">
                      Check if you qualify
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      A counsellor calls you within one working day. No payment at this stage.
                    </p>
                  </div>

                  {submitted ? (
                    <div className="p-6 rounded-xl bg-emerald-50 border border-emerald-200 text-center space-y-4">
                      <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md shadow-emerald-600/30">
                        <CheckCircle2 size={26} />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-base font-bold text-emerald-950">Application Received</h3>
                        <p className="text-xs text-emerald-800 leading-relaxed">
                          Your profile has been received. Our career counsellor will connect with you within 1 working day.
                        </p>
                      </div>

                      <div className="pt-2 flex flex-col gap-2">
                        <a
                          href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20have%20submitted%20my%20application%20for%20the%20Bajaj%20Capital%20ACWM%20Wealth%20Officer%20programme"
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-2.5 px-3 rounded-lg bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-xs"
                        >
                          <MessageCircle size={15} className="fill-white stroke-none" />
                          <span>Chat on WhatsApp (9350199001)</span>
                        </a>

                        <button
                          type="button"
                          onClick={() => setSubmitted(false)}
                          className="text-xs text-slate-500 hover:text-slate-800 py-1"
                        >
                          Submit another profile
                        </button>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleMainFormSubmit} className="space-y-3">
                      {/* Full Name */}
                      <div>
                        <input
                          id={nameInputId}
                          type="text"
                          placeholder="Full name"
                          value={fullName}
                          onChange={(e) => {
                            setFullName(e.target.value);
                            if (nameError) setNameError("");
                          }}
                          required
                          className={`w-full px-3.5 py-2.5 rounded-lg border ${nameError ? "border-red-500 ring-1 ring-red-500/20" : "border-slate-200"} text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                        />
                        {nameError && <p className="text-[11px] text-red-500 mt-1">{nameError}</p>}
                      </div>

                      {/* Phone & Email Row */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <div className={`flex rounded-lg border ${phoneError ? "border-red-500" : "border-slate-200"} overflow-hidden focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500`}>
                            <div className="flex items-center gap-1 px-2.5 bg-slate-50 border-r border-slate-200 text-xs text-slate-700 select-none">
                              <span>🇮🇳</span>
                              <span className="text-[9px] text-slate-400">▾</span>
                              <span className="font-medium text-slate-700">+91</span>
                            </div>
                            <input
                              id={phoneInputId}
                              type="tel"
                              maxLength={10}
                              placeholder=""
                              value={phoneNumber}
                              onChange={(e) => {
                                setPhoneNumber(e.target.value.replace(/\D/g, ""));
                                if (phoneError) setPhoneError("");
                              }}
                              required
                              className="w-full px-2.5 py-2 text-sm text-slate-800 focus:outline-none"
                            />
                          </div>
                          {phoneError && <p className="text-[11px] text-red-500 mt-1">{phoneError}</p>}
                        </div>

                        <div>
                          <input
                            id={emailInputId}
                            type="email"
                            placeholder="Email"
                            value={emailAddress}
                            onChange={(e) => {
                              setEmailAddress(e.target.value);
                              if (emailError) setEmailError("");
                            }}
                            required
                            className={`w-full px-3.5 py-2.5 rounded-lg border ${emailError ? "border-red-500" : "border-slate-200"} text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          />
                          {emailError && <p className="text-[11px] text-red-500 mt-1">{emailError}</p>}
                        </div>
                      </div>

                      {/* City & Age Row */}
                      <div className="grid grid-cols-2 gap-2.5">
                        <div>
                          <input
                            type="text"
                            placeholder="City"
                            value={city}
                            onChange={(e) => {
                              setCity(e.target.value);
                              if (cityError) setCityError("");
                            }}
                            required
                            className={`w-full px-3.5 py-2.5 rounded-lg border ${cityError ? "border-red-500" : "border-slate-200"} text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          />
                          {cityError && <p className="text-[11px] text-red-500 mt-1">{cityError}</p>}
                        </div>

                        <div>
                          <input
                            type="number"
                            placeholder="Age"
                            value={age}
                            onChange={(e) => {
                              setAge(e.target.value);
                              if (ageError) setAgeError("");
                            }}
                            className={`w-full px-3.5 py-2.5 rounded-lg border ${ageError ? "border-red-500" : "border-slate-200"} text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
                          />
                          {ageError && <p className="text-[11px] text-red-500 mt-1">{ageError}</p>}
                        </div>
                      </div>

                      {/* Graduate Question Selector */}
                      <div className="flex items-center justify-between gap-3 pt-1">
                        <span className="text-xs text-slate-600 font-medium">Graduate?</span>
                        <div className="grid grid-cols-2 gap-2 flex-1 max-w-[210px]">
                          <button
                            type="button"
                            onClick={() => setIsGraduate("yes")}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${isGraduate === "yes"
                                ? "bg-slate-50 border-slate-400 text-slate-900 font-semibold shadow-2xs"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                          >
                            Yes
                          </button>
                          <button
                            type="button"
                            onClick={() => setIsGraduate("not-yet")}
                            className={`py-2 px-3 rounded-lg text-xs font-medium border text-center transition-colors cursor-pointer ${isGraduate === "not-yet"
                                ? "bg-slate-50 border-slate-400 text-slate-900 font-semibold shadow-2xs"
                                : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                              }`}
                          >
                            Not yet
                          </button>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-3 px-4 rounded-lg bg-[#7ea5cb] hover:bg-[#6c93be] text-white font-medium text-sm tracking-wide shadow-xs active:scale-[0.99] transition-colors cursor-pointer mt-1"
                      >
                        {isSubmitting ? "Checking eligibility..." : "Check my eligibility"}
                      </button>

                      {/* Terms Disclaimer */}
                      <p className="text-[11px] text-slate-400 text-center pt-1 leading-tight">
                        By submitting you agree to our <a href="/privacy" className="text-slate-500 hover:underline">Terms &amp; Privacy Policy</a>
                      </p>
                    </form>
                  )}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 2. DELIVERED WITH (PARTNERS SECTION - COMPACT & RESPONSIVE) */}
        {/* ========================================================================= */}
        <section className="py-4 sm:py-5 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-3 lg:gap-6">
              <div className="text-center lg:text-left shrink-0">
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400 block">
                  DELIVERED IN PARTNERSHIP WITH
                </span>
              </div>

              {/* All 3 partners: AIMA, Bajaj Capital, ICOFP - Guaranteed strictly in ONE clean line on all devices */}
              <div className="flex items-center justify-center lg:justify-end gap-2.5 sm:gap-6 flex-nowrap w-full lg:w-auto max-w-full py-1">
                {/* AIMA */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <img
                    src={aimaLogo}
                    alt="All India Management Association (AIMA)"
                    className="h-4 sm:h-6 max-h-[18px] sm:max-h-[26px] w-auto max-w-[70px] sm:max-w-[110px] object-contain shrink-0"
                  />
                  <div className="text-left hidden md:block leading-tight">
                    <div className="text-[10px] font-black uppercase text-slate-800">AIMA</div>
                    <div className="text-[9px] text-slate-500 font-medium">Academic Partner</div>
                  </div>
                </div>

                <div className="h-4 sm:h-5 w-px bg-slate-200 shrink-0 block" />

                {/* Bajaj Capital */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <img
                    src={bajajCapitalLogo}
                    alt="Bajaj Capital"
                    className="h-[14px] sm:h-5 max-h-[16px] sm:max-h-[22px] w-auto max-w-[115px] sm:max-w-[160px] object-contain shrink-0"
                  />
                  <div className="text-left hidden md:block leading-tight">
                    <div className="text-[10px] font-black uppercase text-slate-800">BAJAJ CAPITAL</div>
                    <div className="text-[9px] text-[#2e9e5b] font-bold">Hiring Partner (BCIBL)</div>
                  </div>
                </div>

                <div className="h-4 sm:h-5 w-px bg-slate-200 shrink-0 block" />

                {/* ICOFP */}
                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  <img
                    src={icofpLogo}
                    alt="ICOFP"
                    className="h-[14px] sm:h-5 max-h-[16px] sm:max-h-[22px] w-auto max-w-[75px] sm:max-w-[110px] object-contain shrink-0"
                  />
                  <div className="text-left hidden md:block leading-tight">
                    <div className="text-[10px] font-black uppercase text-slate-800">ICOFP</div>
                    <div className="text-[9px] text-slate-500 font-medium">Training Delivery</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* 3. CAREER PATHWAY (PHASE 1, 2, 3 + TIMELINE RAIL) */}
        {/* ========================================================================= */}
        <section id="how" className="py-16 sm:py-24 bg-[#F8F9FA] border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto space-y-3">
             
              <h2 className="text-2xl sm:text-[2.25rem] font-black text-[#071B35] tracking-tight leading-tight">
                Get the job offer first. Pay fees later.
              </h2>
              
            </div>

            {/* 3 Key Phase Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

              {/* Phase 01 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border-t-4 border-t-[#2F73B2] shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#2F73B2]">01</span>
                </div>
                <h3 className="text-lg font-black text-[#071B35]">Get selected</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Interview with the Bajaj Capital panel and receive your written conditional pre-placement offer before classes start.
                </p>
              </div>

              {/* Phase 02 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border-t-4 border-t-[#25AAD3] shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#25AAD3]">02</span>
                </div>
                <h3 className="text-lg font-black text-[#071B35]">Get trained</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  240 hours of rigorous learning with ICOFP &amp; AIMA, followed by a guaranteed paid internship at <strong>₹15,000/month</strong>.
                </p>
              </div>

              {/* Phase 03 */}
              <div className="bg-white rounded-2xl p-6 sm:p-7 border-t-4 border-t-[#4BBC7C] shadow-sm border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#4BBC7C]">03</span>
                </div>
                <h3 className="text-lg font-black text-[#071B35]">Get hired</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  Join Bajaj Capital as a full-time Wealth Officer starting from ₹4.2 LPA, plus an additional <strong>₹85,000 retention bonus</strong>.
                </p>
              </div>

            </div>

            {/* Week-by-Week Step Rail */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <h3 className="text-lg font-black text-[#071B35] tracking-tight">
                  6-Month Roadmap
                </h3>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
                  Pan-India Placement
                </span>
              </div>

              <div className="relative border-l-2 border-slate-200 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-8">

                {/* Week 0 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-6 h-6 rounded-full bg-[#2F73B2] border-4 border-white text-white flex items-center justify-center text-[10px] font-black shadow-sm" />
                  <span className="text-[11px] font-bold text-[#2F73B2] uppercase tracking-wider">Week 0</span>
                  <h4 className="text-base font-black text-[#071B35]">Interview with Bajaj Capital</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Appear for the entrance screening interview for the Wealth Officer role.</p>
                </div>

                {/* Week 1 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-6 h-6 rounded-full bg-[#2F73B2] border-4 border-white text-white flex items-center justify-center text-[10px] font-black shadow-sm" />
                  <span className="text-[11px] font-bold text-[#2F73B2] uppercase tracking-wider">Week 1</span>
                  <h4 className="text-base font-black text-[#071B35]">Receive Written Pre-Placement Offer &amp; Begin Certification</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Receive your formal written PPO with starting package from ₹4.2 LPA before commencement.</p>
                </div>

                {/* Week 9 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-6 h-6 rounded-full bg-[#25AAD3] border-4 border-white text-white flex items-center justify-center text-[10px] font-black shadow-sm" />
                  <span className="text-[11px] font-bold text-[#25AAD3] uppercase tracking-wider">Week 9</span>
                  <h4 className="text-base font-black text-[#071B35]">Executive Learning Module at AIMA</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Attend the specialized All India Management Association module as part of core certification.</p>
                </div>

                {/* Week 10 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-6 h-6 rounded-full bg-[#25AAD3] border-4 border-white text-white flex items-center justify-center text-[10px] font-black shadow-sm" />
                  <span className="text-[11px] font-bold text-[#25AAD3] uppercase tracking-wider">Week 10</span>
                  <h4 className="text-base font-black text-[#071B35]">Complete Certification (ACWM)</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Graduate with the Advanced Certification in Wealth Management credential.</p>
                </div>

                {/* Week 11 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-6 h-6 rounded-full bg-[#4BBC7C] border-4 border-white text-white flex items-center justify-center text-[10px] font-black shadow-sm" />
                  <span className="text-[11px] font-bold text-[#4BBC7C] uppercase tracking-wider">Week 11</span>
                  <h4 className="text-base font-black text-[#071B35]">Paid Internship Begins</h4>
                  <p className="text-xs sm:text-sm text-emerald-800 font-bold">Commence your 4-month practical internship at Bajaj Capital with ₹15,000/month stipend.</p>
                </div>

                {/* Week 28 */}
                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-6 h-6 rounded-full bg-[#4BBC7C] border-4 border-white text-white flex items-center justify-center text-[10px] font-black shadow-sm" />
                  <span className="text-[11px] font-bold text-[#4BBC7C] uppercase tracking-wider">Week 28 (Month 7)</span>
                  <h4 className="text-base font-black text-[#071B35]">Join Full-Time as a Wealth Officer</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Full-time absorption at Bajaj Capital with package from ₹4.2 LPA to ₹4.8 LPA.</p>
                </div>

                {/* Milestone */}
                <div className="relative space-y-1">
                  <div className="absolute -left-[31px] sm:-left-[47px] top-0 w-6 h-6 rounded-full bg-amber-500 border-4 border-white text-white flex items-center justify-center text-[10px] font-black shadow-sm" />
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">Milestone (Month 12)</span>
                  <h4 className="text-base font-black text-[#071B35]">Retention Bonus of ₹85,000</h4>
                  <p className="text-xs sm:text-sm text-slate-600">Awarded upon successful completion of 12 months full-time employment.</p>
                </div>

              </div>
            </div>

            {/* What you will learn grid */}
            <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">WHAT YOU WILL LEARN</span>
                <h4 className="text-xl font-black text-[#071B35]">Practical Wealth Advisory Curriculum</h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-semibold">
                  Financial Planning • Investments • Wealth Management • Mutual Funds • Retirement, Tax &amp; Risk Planning
                </p>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                  <strong>240 hours of industry learning:</strong> 190 hours with ICOFP + 50 hours with AIMA faculty.
                </div>
              </div>

              <div className="space-y-3">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">CERTIFICATION EXPOSURE</span>
                <h4 className="text-xl font-black text-[#071B35]">Recognised Industry Credentials</h4>
                <div className="flex flex-wrap gap-2 pt-1">
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">CFP Level 1</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">CFP Level 2</span>
                  <span className="px-3 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800">NISM VA (Mutual Funds)</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">NISM XXI-B</span>
                  <span className="px-3 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-bold text-slate-700">BQP</span>
                </div>
                <p className="text-xs text-slate-500 pt-1">
                  Plus the joint ICOFP &amp; AIMA Advanced Certification in Wealth Management upon graduation.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 4. CAREER PROGRESSION (WHERE YOUR CAREER CAN GO) */}
        {/* ========================================================================= */}
        <section id="job" className="py-16 sm:py-24 bg-[#071B35] text-white border-b border-white/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Career Ladder */}
            <div className="bg-white/5 rounded-3xl p-6 sm:p-10 border border-white/10 backdrop-blur-md space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-white">Where your career can go</h3>
                  <p className="text-xs sm:text-sm text-slate-400 mt-1">A clear, performance-driven progression pathway inside Bajaj Capital</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                {/* Rung 1 */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#4BBC7C]" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">WHERE YOU START</span>
                  <h4 className="text-base font-black text-white">Wealth Officer</h4>
                  <p className="text-xs text-slate-300">Your first client portfolio, live from month seven.</p>
                </div>

                {/* Rung 2 */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#25AAD3]" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">STAGE 2</span>
                  <h4 className="text-base font-black text-white">Senior Executive</h4>
                  <p className="text-xs text-slate-300">A larger investment book &amp; mentoring junior advisors.</p>
                </div>

                {/* Rung 3 */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#2F73B2]" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">STAGE 3</span>
                  <h4 className="text-base font-black text-white">Assistant Manager</h4>
                  <p className="text-xs text-slate-300">Owning team performance &amp; branch advisory targets.</p>
                </div>

                {/* Rung 4 */}
                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  <span className="text-[10px] font-bold uppercase text-slate-400">LONG-TERM</span>
                  <h4 className="text-base font-black text-white">Cluster / Regional Head</h4>
                  <p className="text-xs text-slate-300">Leading multi-branch wealth divisions across India.</p>
                </div>

              </div>
            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 5. FEES, INVESTMENT & THE "REAL NET COST" (LEVERAGE EDU MATCH) */}
        {/* ========================================================================= */}
        <section id="money" className="py-16 sm:py-24 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">

            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-xs font-black tracking-widest uppercase text-[#2F73B2] bg-[#2F73B2]/10 px-3 py-1 rounded-full">
                TRANSPARENT INVESTMENT
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#071B35] tracking-tight">
                Invest in your career. Start earning along the way.
              </h2>
             
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

              {/* Card 1: What You Pay */}
              <div className="lg:col-span-6 bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <h3 className="text-2xl font-black text-[#071B35]">PROGRAMME FEES</h3>

                  <div className="divide-y divide-slate-200 text-sm">
                    <div className="py-3 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Eligibility Registration</span>
                      <strong className="text-slate-900">₹500</strong>
                    </div>
                    <div className="py-3 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">Programme Investment</span>
                      <strong className="text-slate-900">₹1,50,000</strong>
                    </div>
                    <div className="py-3 flex justify-between items-center">
                      <span className="font-semibold text-slate-700">GST (18%)</span>
                      <strong className="text-slate-900">₹27,000</strong>
                    </div>
                  </div>

                  {/* EMI Box */}
                  <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-2xs space-y-1">
                    <span className="text-xs font-black text-[#2F73B2] uppercase tracking-wider">OR PAY MONTHLY (0% EMI)</span>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      Flexible no-cost EMI options available over <strong>10 months</strong>, subject to partner NBFC approval.
                    </p>
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 leading-relaxed font-medium">
                  <strong>Zero Risk:</strong> Nothing is payable until our counsellor confirms your eligibility. The programme fee applies only <em>after</em> you clear the Bajaj Capital interview and get your written PPO.
                </div>
              </div>

              {/* Card 2: What You Earn & Net Cost */}
              <div className="lg:col-span-6 bg-emerald-50/60 rounded-3xl p-6 sm:p-8 border border-emerald-200 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-800">GUARANTEED RETURNS</span>
                  <h3 className="text-2xl font-black text-emerald-950">Your Journey to Earning</h3>

                  <div className="divide-y divide-emerald-200/80 text-sm">
                    <div className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-emerald-900 block">During 4-Month Internship</span>
                        <span className="text-xs text-emerald-700 font-medium">Earn while gaining live work experience</span>
                      </div>
                      <strong className="text-emerald-900 text-base">₹15,000 / mo (₹60,000 total)</strong>
                    </div>

                    <div className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-emerald-900 block">Starting Salary (Month 7)</span>
                        <span className="text-xs text-emerald-700 font-medium">Full-time Wealth Officer compensation</span>
                      </div>
                      <strong className="text-emerald-900 text-base">₹4.2 LPA to ₹4.8 LPA</strong>
                    </div>

                    <div className="py-3 flex justify-between items-center">
                      <div>
                        <span className="font-bold text-emerald-900 block">Year 1 Retention Bonus</span>
                        <span className="text-xs text-emerald-700 font-medium">On completing 12 months full-time</span>
                      </div>
                      <strong className="text-emerald-900 text-base">₹85,000</strong>
                    </div>
                  </div>
                </div>

                {/* Net Cost Box */}
                <div className="p-5 rounded-2xl bg-white border border-emerald-300 shadow-md space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-emerald-800 uppercase tracking-wider">WHAT YOU ACTUALLY PAY</span>
      
                  </div>

                  <div className="space-y-1.5 text-xs text-slate-700 bg-emerald-50/50 p-3.5 rounded-xl border border-emerald-100">
                    <div className="flex justify-between items-center">
                      <span>Course Fee incl. GST:</span>
                      <strong className="text-slate-900">₹1,77,000</strong>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800">
                      <span>Stipend Earned:</span>
                      <strong>₹60,000</strong>
                    </div>
                    <div className="flex justify-between items-center text-emerald-800">
                      <span>Retention Bonus:</span>
                      <strong>₹85,000</strong>
                    </div>
                    <div className="pt-2 mt-1 border-t border-emerald-200 flex justify-between items-center font-bold text-emerald-900">
                      <span>Total Earnings:</span>
                      <span className="text-sm font-extrabold text-emerald-700">₹1,45,000</span>
                    </div>
                  </div>

                  <div className="pt-0.5">
                    <div className="text-xs font-bold text-slate-600">
                      So your effective cost is only:
                    </div>
                    <div className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
                      ₹32,000!
                    </div>
                  </div>

                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 6. WRITTEN PPO PROOF & CERTIFICATE SHOWCASE */}
        {/* ========================================================================= */}
        <section className="py-16 sm:py-24 bg-[#F8F9FA] border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-12">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

              <div className="lg:col-span-5 space-y-4">
                <span className="text-xs font-black tracking-widest uppercase text-[#2F73B2] bg-[#2F73B2]/10 px-3 py-1 rounded-full">
                  YOUR CAREER IN WRITING
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-[#071B35] tracking-tight">
                  Backed by a written offer from Bajaj Capital.
                </h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Selected candidates receive a formal conditional Pre-Placement Offer (PPO) before beginning their training journey.
                </p>

               
              </div>

              {/* Certificate image */}
              <div className="lg:col-span-7">
                <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200 shadow-xl space-y-3">
                  <div className="flex items-center justify-between px-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Joint ICOFP &amp; AIMA Certification
                    </span>
                    
                  </div>
                  <img
                    src="/assets/acwm/acwm_certificate.jpg"
                    alt="Advanced Certification in Wealth Management"
                    className="w-full h-auto rounded-xl object-contain border border-slate-100"
                  />
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 7. WHO CAN APPLY & FAQS ACCORDION */}
        {/* ========================================================================= */}
        <section id="faq" className="py-16 sm:py-24 bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

              {/* Left Column: Who Can Apply Criteria */}
              <div className="lg:col-span-5 space-y-6">
                <div className="space-y-2">

                  <h2 className="text-3xl font-black text-[#071B35] tracking-tight">
                    Who can apply
                  </h2>

                </div>

                <div className="space-y-4">

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">Graduate in any stream</h4>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">You are 28 years or under</h4>
                      {/* <p className="text-xs text-slate-600 mt-0.5">The pathway is custom built for young professionals launching their first serious finance career.</p> */}
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3.5">
                    <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={16} />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">You clear the 3-step entrance selection</h4>
                      {/* <p className="text-xs text-slate-600 mt-0.5">Aptitude assessment, counsellor pre-screening, and the final Bajaj Capital panel interview.</p> */}
                    </div>
                  </div>

                </div>

                <div className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 text-xs text-amber-900 leading-relaxed font-medium">
                  <strong>Please note:</strong> This programme is not for candidates seeking back-office data entry roles, unable to relocate, or only wanting an offline degree certificate without employment.
                </div>
              </div>

              {/* Right Column: Accordion FAQs */}
              <div className="lg:col-span-7 space-y-4">
                <div className="space-y-1 mb-2">
                  <h3 className="text-2xl font-black text-[#071B35] tracking-tight">
                    Frequently Asked Questions
                  </h3>
                  <p className="text-xs text-slate-500">
                    Transparent answers regarding eligibility, offers, stipend and curriculum
                  </p>
                </div>

                <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
                  {FAQS.map((faq, index) => {
                    const isOpen = openFaq === index;
                    return (
                      <div key={index} className="py-4">
                        <button
                          type="button"
                          onClick={() => toggleFaq(index)}
                          className="w-full flex items-center justify-between text-left gap-4 font-bold text-sm sm:text-base text-[#071B35] hover:text-[#2F73B2] transition-colors cursor-pointer"
                        >
                          <span>{faq.q}</span>
                          <span className={`w-6 h-6 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black shrink-0 transition-transform ${isOpen ? "rotate-180 bg-[#2F73B2] text-white" : ""}`}>
                            <ChevronDown size={14} />
                          </span>
                        </button>

                        {isOpen && (
                          <div className="mt-3 text-xs sm:text-sm text-slate-600 leading-relaxed pr-6 animate-in fade-in">
                            {faq.a}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ========================================================================= */}
        {/* 13. FINAL CTA (DARK NAVY SECTION - RESTORED FROM OLD CODE) */}
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
                type="button"
                onClick={scrollToApply}
                className="group w-full sm:w-auto px-8 py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#071B35] font-black text-sm tracking-wide transition-all duration-200 shadow-lg hover:shadow-emerald-500/20 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>CHECK MY ELIGIBILITY</span>
                <span className="inline-block transition-transform duration-200 group-hover:translate-x-1">→</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setPdfModalOpen(true);
                  setPdfDownloaded(false);
                }}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Download size={15} className="text-emerald-400" />
                <span>INTERVIEW PREP PDF</span>
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
          className="fixed z-50 flex items-center gap-1.5 px-3.5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20be5a] text-white shadow-2xl hover:scale-105 active:scale-95 transition-transform duration-200 right-5 bottom-5"
        >
          <MessageCircle size={20} className="fill-white stroke-none" />
          <span className="text-xs font-bold tracking-wide">WhatsApp</span>
        </a>

        {/* ========================================================================= */}
        {/* FOOTER & DISCLOSURES (OLD FOOTER COPY - NO EXCEL BUTTON) */}
        {/* ========================================================================= */}
        <footer className="py-8 bg-[#04101e] text-slate-400 text-xs border-t border-white/10 pb-20 sm:pb-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-4">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 text-white font-bold text-sm">
                <img
                  src={bajajCapitalLogo}
                  alt="Bajaj Capital"
                  className="h-6 w-auto object-contain brightness-0 invert opacity-80"
                />
                <span className="text-slate-500">|</span>
                <span className="text-slate-300 font-normal text-xs">ACWM Career Programme</span>
              </div>
              <div className="flex items-center gap-6 text-xs text-slate-400">
                <a href="#how" className="hover:text-white transition-colors">How it works</a>
                <a href="#job" className="hover:text-white transition-colors">The job</a>
                <a href="#money" className="hover:text-white transition-colors">Fees</a>
                <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
              </div>
            </div>

            <div className="space-y-2 leading-relaxed text-[11px] text-slate-500">
              <p>
                <strong>Disclosure:</strong> The conditional Pre-Placement Offer, paid internship, retention bonus, and Wealth Officer role apply only to candidates selected into the Bajaj Capital / BCIBL pathway, and are subject to that pathway's stated terms and interview process.
              </p>
              <p>
                Full-time absorption from month seven is subject to satisfactory internship evaluation (min 80%), minimum 85% attendance, NISM VA certification, professional conduct, relocation readiness, and conditions in the Conditional Pre-Placement Offer Letter.
              </p>
              <p>
                © {new Date().getFullYear()} Degree Guru &amp; Bajaj Capital. ACWM is delivered by the International College of Financial Planning (ICOFP) with AIMA as academic partner.
              </p>
            </div>
          </div>
        </footer>

      </div>

      {/* ========================================================================= */}
      {/* 9. PDF DOWNLOAD MODAL (DOWNLOAD INTERVIEW PREP PDF KEPT INTACT) */}
      {/* ========================================================================= */}
      {pdfModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative">

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setPdfModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {pdfDownloaded ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-14 h-14 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-emerald-600/30">
                  <CheckCircle2 size={30} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-900">Download Started!</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    Your <strong>Bajaj Capital Interview Prep Kit (PDF)</strong> has been downloaded to your device.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setPdfModalOpen(false)}
                  className="w-full py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition-colors"
                >
                  Close Window
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-black uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                    FREE INTERVIEW PREP KIT
                  </span>
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">
                    Download Interview Prep PDF
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Get the 2026 Bajaj Capital Wealth Officer interview questions, syllabus preview, and selection tips.
                  </p>
                </div>

                <form onSubmit={handlePdfSubmit} className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Rahul Sharma"
                      value={pdfName}
                      onChange={(e) => {
                        setPdfName(e.target.value);
                        if (pdfNameError) setPdfNameError("");
                      }}
                      required
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2F73B2]/40"
                    />
                    {pdfNameError && <p className="text-[11px] text-red-500 font-semibold">{pdfNameError}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Phone Number <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      maxLength={10}
                      placeholder="10-digit mobile number"
                      value={pdfPhone}
                      onChange={(e) => {
                        setPdfPhone(e.target.value.replace(/\D/g, ""));
                        if (pdfPhoneError) setPdfPhoneError("");
                      }}
                      required
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2F73B2]/40"
                    />
                    {pdfPhoneError && <p className="text-[11px] text-red-500 font-semibold">{pdfPhoneError}</p>}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-800">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder="name@email.com"
                      value={pdfEmail}
                      onChange={(e) => {
                        setPdfEmail(e.target.value);
                        if (pdfEmailError) setPdfEmailError("");
                      }}
                      required
                      className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#2F73B2]/40"
                    />
                    {pdfEmailError && <p className="text-[11px] text-red-500 font-semibold">{pdfEmailError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={pdfSubmitting}
                    className="w-full py-3 px-4 rounded-xl bg-[#2F73B2] hover:bg-[#255D91] text-white text-xs sm:text-sm font-extrabold shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    {pdfSubmitting ? (
                      <span>Preparing download...</span>
                    ) : (
                      <>
                        <Download size={15} />
                        <span>DOWNLOAD PDF NOW</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            )}

          </div>
        </div>
      )}

    </>
  );
};

export default PlacementGuaranteed;
