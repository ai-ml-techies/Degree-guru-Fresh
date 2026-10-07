import React, { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Check,
  ChevronDown,
  CheckCircle2,
  Download,
  X,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Briefcase,
  Layers,
  TrendingUp,
  Users,
  Target,
  ShoppingBag,
  LineChart,
  HelpCircle,
  Route,
  Percent,
  ShieldCheck,
  Sparkles,
  Building2,
} from "lucide-react";
import { submitLead, sendSmsOtp, verifySmsOtp } from "@/lib/api";
import { validateIndianMobile, validateMeaningfulName, validateMeaningfulEmail } from "@/lib/validation";
import { WhatsAppCircleIcon } from "@/components/SocialIcons";

/* ───────────── Custom Modern Select (Solid Pure White, Zero Transparency) ───────────── */
const CustomSelect: React.FC<{
  value: string;
  onChange: (val: string) => void;
  options: string[];
  placeholder?: string;
  label?: string;
}> = ({ value, onChange, options, placeholder = "Select option", label }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {label && <span className="block text-[11px] font-bold text-slate-500 mb-1 tracking-wide">{label}</span>}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className={`w-full px-3.5 py-3 rounded-xl border text-sm text-slate-900 bg-white flex items-center justify-between text-left transition-all cursor-pointer shadow-xs ${
          open
            ? "border-[#1557D6] ring-2 ring-[#1557D6]/20 bg-blue-50/20"
            : "border-slate-300 hover:border-slate-400"
        }`}
      >
        <span className="truncate font-semibold text-slate-800">{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={`text-slate-500 shrink-0 ml-2 transition-transform duration-200 ${
            open ? "rotate-180 text-[#1557D6]" : ""
          }`}
        />
      </button>

      {open && (
        <div className="absolute z-[99] left-0 right-0 bottom-full mb-1.5 bg-white rounded-2xl shadow-2xl border-2 border-slate-200 py-2 max-h-56 overflow-y-auto ring-1 ring-black/10">
          {options.map((opt) => {
            const isSelected = opt === value;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setOpen(false);
                }}
                className={`w-full px-3.5 py-2.5 text-xs sm:text-sm text-left flex items-center justify-between transition-colors cursor-pointer ${
                  isSelected
                    ? "bg-blue-50 text-[#1557D6] font-bold"
                    : "bg-white text-slate-800 hover:bg-slate-100 font-medium"
                }`}
              >
                <span className="truncate">{opt}</span>
                {isSelected && (
                  <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 ml-2 shadow-xs">
                    <Check size={12} strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

/* Official WhatsApp brand vector icon matching reference */
const WhatsAppOfficialIcon = ({ className = "w-6 h-6" }: { className?: string }) => (
  <svg viewBox="0 0 48 48" className={className} fill="none">
    <circle cx="24" cy="24" r="23" fill="#25D366" />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M34.8 13.2C32 10.4 28.2 8.9 24.2 8.9C15.8 8.9 9 15.7 9 24.1C9 26.8 9.7 29.4 11 31.7L9 39.1L16.6 37.1C18.8 38.3 21.4 39 24.1 39H24.2C32.6 39 39.4 32.2 39.4 23.8C39.4 19.8 37.8 16 34.8 13.2ZM24.2 36.4H24.1C21.8 36.4 19.6 35.8 17.6 34.6L17.1 34.3L12.6 35.5L13.8 31.1L13.5 30.6C12.2 28.6 11.6 26.4 11.6 24.1C11.6 17.2 17.3 11.5 24.2 11.5C27.5 11.5 30.7 12.8 33.1 15.1C35.4 17.5 36.8 20.6 36.8 23.9C36.8 30.8 31.1 36.4 24.2 36.4ZM31.1 27.2C30.7 27 28.9 26.1 28.6 26C28.2 25.8 28 25.8 27.7 26.1C27.4 26.5 26.8 27.3 26.6 27.5C26.4 27.7 26.2 27.7 25.8 27.5C25.4 27.3 24.3 26.9 23 25.8C22 24.9 21.3 23.8 21.1 23.4C20.9 23 21.1 22.8 21.3 22.6C21.5 22.4 21.7 22.1 21.9 21.9C22.1 21.7 22.1 21.5 22.3 21.2C22.4 21 22.3 20.7 22.2 20.5C22.1 20.3 21.4 18.6 21.1 17.9C20.8 17.2 20.5 17.3 20.3 17.3H19.6C19.3 17.3 18.9 17.4 18.5 17.8C18.1 18.2 17.1 19.2 17.1 21.2C17.1 23.2 18.6 25.1 18.8 25.3C19 25.6 21.8 29.8 26 31.6C27 32 27.8 32.3 28.4 32.5C29.4 32.8 30.4 32.8 31.1 32.7C31.9 32.6 33.5 31.7 33.8 30.8C34.2 29.8 34.2 29 34.1 28.8C33.9 28.6 33.7 28.5 33.3 28.3L31.1 27.2Z"
      fill="white"
    />
  </svg>
);

import degreeGuruLogo from "@/assets/logo-light.png";
import leverageEduLogo from "@/assets/acwm/leverage-edu.png";
import aimaLogo from "@/assets/acwm/aima.png";
import bajajCapitalLogo from "@/assets/acwm/bajaj-capital.png";
import icofpLogo from "@/assets/acwm/icofp.png";
import acwmCertificate from "@/assets/acwm/acwm_certificate.jpg";
import heroImage from "@/assets/acwm/indian_wealth_officer.jpg";
import consultImage from "@/assets/acwm/indian_wealth_consultation.jpg";
import goldEmblem from "@/assets/acwm/gold-emblem.png";
import whatsappCleanIcon from "@/assets/acwm/whatsapp-clean.png";

const WA_LINK =
  "https://wa.me/919350199001?text=Hi%2C%20I%20want%20to%20know%20more%20about%20the%20Placement%20Guaranteed%20Program.";

/* ───────────── Scroll reveal ───────────── */
const Reveal: React.FC<{ children: React.ReactNode; delay?: number; className?: string }> = ({
  children,
  delay = 0,
  className = "",
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : "translateY(18px)",
        transition: `opacity .6s ease ${delay}ms, transform .6s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

/* ───────────── Content ───────────── */
const JOURNEY = [
  { when: "Week 0", title: "Selection", text: "Eligibility check and a panel interview with Bajaj Capital.", tag: "₹500 registration", tone: "navy" },
  { when: "Before training", title: "Pre-Placement Offer", text: "A written Pre-Placement Offer from Bajaj Capital. The program fee starts only after you accept the offer.", tag: "Fee starts after offer acceptance", tone: "blue" },
  { when: "Month 1 – 2.5", title: "Classroom training", text: "240 hours — 190 with ICOFP, 50 with AIMA. Mastering practical wealth advisory.", tag: "ACWM certification", tone: "navy" },
  { when: "Month 3 – 6", title: "Bajaj Capital internship", text: "Four months inside a live Bajaj Capital branch.", tag: "₹15,000 / month stipend", tone: "green" },
  { when: "Month 6", title: "Wealth Officer", text: "Full-time role once the completion criteria are met.", tag: "₹4.2 – ₹4.8 LPA", tone: "green" },
  { when: "Month 12", title: "Retention bonus", text: "After 12 months of full-time employment.", tag: "₹85,000", tone: "gold" },
];

const CERTIFICATIONS_EXPOSURE = [
  {
    name: "CFP Level 1 & 2",
    type: "Global Charter",
    focus: "Personal financial planning, tax & wealth management.",
    body: "FPSB India",
    typeStyle: "bg-blue-50 text-[#1557D6] border-blue-200/80",
  },
  {
    name: "NISM Series V-A",
    type: "Mandatory License",
    focus: "Mutual funds sales & investor advisory.",
    body: "NISM",
    typeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  {
    name: "NISM Series XXI-B",
    type: "Mandatory License",
    focus: "Portfolio Management Services (PMS).",
    body: "NISM",
    typeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  {
    name: "BQP",
    type: "Mandatory License",
    focus: "Insurance advisory & risk planning.",
    body: "IRDAI",
    typeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200/80",
  },
  {
    name: "Joint ICOFP & AIMA",
    type: "Professional Diploma",
    focus: "Practical wealth management & live casework.",
    body: "ICOFP & AIMA",
    typeStyle: "bg-indigo-50 text-indigo-700 border-indigo-200/80",
  },
];

const MODULES = [
  { icon: Briefcase, t: "Wealth Advisory", d: "Profile clients, build goal-based plans." },
  { icon: Layers, t: "Financial Products", d: "Mutual funds, insurance, fixed income." },
  { icon: LineChart, t: "Investment Understanding", d: "How assets behave and why." },
  { icon: Users, t: "Client Relationships", d: "Earn trust, retain portfolios." },
  { icon: Target, t: "Financial Planning", d: "Retirement, tax and risk planning." },
  { icon: ShoppingBag, t: "Sales & Distribution", d: "Compliant, ethical selling." },
  { icon: TrendingUp, t: "Market Understanding", d: "Read the market, brief the client." },
];

const LADDER = [
  { t: "Wealth Officer", d: "Where you start" },
  { t: "Senior Executive", d: "Larger client book" },
  { t: "Assistant Manager", d: "Team & branch targets" },
  { t: "Cluster / Regional Head", d: "Multi-branch leadership" },
];

const FAQS = [
  {
    q: "Is the placement genuinely guaranteed?",
    a: "Bajaj Capital issues a written Pre-Placement Offer upfront before any program fees are due. Full absorption as a Wealth Officer is guaranteed upon meeting completion criteria (85% attendance, evaluation scores, and NISM Series V-A certification).",
  },
  {
    q: "Who is eligible?",
    a: "Graduates or final-year Bachelor's students aged 28 or below across any stream. No prior experience or coding background required.",
  },
  {
    q: "What happens during the 4-month Bajaj Capital internship?",
    a: "Students work directly inside a live Bajaj Capital branch where they learn real-world wealth advisory, client relationship skills, and portfolio management with practical execution, earning a guaranteed ₹15,000/month stipend.",
  },
  {
    q: "When is the program fee payable?",
    a: "The program fee is payable ONLY AFTER you receive and accept your official written Pre-Placement Offer letter from Bajaj Capital. If you are not selected in the interview or do not accept the offer, you pay nothing. 0% EMI is also available.",
  },
  {
    q: "What salary is offered after successful completion?",
    a: "Selected candidates join as Wealth Officers with a starting package of ₹4.2 – ₹4.8 LPA CTC, along with an ₹85,000 retention bonus payable after 12 months of full-time employment.",
  },
];

type LegalTab = "program" | "fees" | "placement" | "terms" | "disclaimer";

const LEGAL: Record<LegalTab, { label: string; body: React.ReactNode }> = {
  program: {
    label: "Program Terms",
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Eligibility: graduate or final-year Bachelor's student, age 28 or below.</li>
        <li>Selection through eligibility check and Bajaj Capital panel interview.</li>
        <li>240 hours of training: 190 with ICOFP, 50 with AIMA.</li>
        <li>4-month internship at Bajaj Capital with ₹15,000 per month stipend.</li>
        <li>Certification: Advanced Certification in Wealth Management (ACWM).</li>
      </ul>
    ),
  },
  fees: {
    label: "Fee & Refund",
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>Registration fee: ₹500, paid at the eligibility stage.</li>
        <li>Program fee: ₹1,50,000 + 18% GST = ₹1,77,000, payable after the Pre-Placement Offer.</li>
        <li>If you are not selected in the interview, the program fee is not charged.</li>
        <li>0% EMI over 10 months is available.</li>
      </ul>
    ),
  },
  placement: {
    label: "Placement Terms",
    body: (
      <ul className="list-disc pl-5 space-y-2">
        <li>The Pre-Placement Offer is issued to candidates who cleared psychometric test and interview by Bajaj Capital.</li>
        <li>Full-time absorption requires 85% attendance, 80% in evaluations, NISM Series V-A certification, professional conduct and relocation readiness.</li>
        <li>Salary is within ₹4.2 – ₹4.8 LPA; the exact figure is stated in the offer letter.</li>
        <li>The ₹85,000 retention bonus applies after 12 months of full-time employment, subject to terms.</li>
        <li>Paid internship is mandatory to be eligible for full-time employment.</li>
      </ul>
    ),
  },
  terms: {
    label: "Terms & Conditions",
    body: <p>Participation is governed by the program terms, the Pre-Placement Offer letter and the policies of the partner institutions. Please read the official documents before registering.</p>,
  },
  disclaimer: {
    label: "Disclaimer",
    body: <p>The Pre-Placement Offer, internship, stipend, retention bonus and Wealth Officer role apply only to candidates selected into the Bajaj Capital pathway and are subject to its stated terms. Degree Guru is an admissions facilitator.</p>,
  },
};

const toneDot: Record<string, string> = {
  navy: "bg-[#061A36]",
  blue: "bg-[#1557D6]",
  green: "bg-[#18B879]",
  gold: "bg-[#F4B942]",
};

export const PlacementGuaranteed = () => {
  /* Modals */
  const [formOpen, setFormOpen] = useState(false);
  const [legalOpen, setLegalOpen] = useState<LegalTab | null>(null);
  const [zoomOpen, setZoomOpen] = useState(false);
  const [feeOpen, setFeeOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formHeading, setFormHeading] = useState("Check my eligibility");

  /* Verification state for instant PDF download */
  const [isVerified, setIsVerified] = useState<boolean>(() => {
    try {
      return localStorage.getItem("pg_phone_verified") === "true";
    } catch {
      return false;
    }
  });

  /* Form */
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [age, setAge] = useState("");
  const [education, setEducation] = useState("Commerce / B.Com");
  const [experience, setExperience] = useState("Fresher");
  const [isSerious, setIsSerious] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [busy, setBusy] = useState(false);
  const [timer, setTimer] = useState(30);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (step !== 2 || timer <= 0) return;
    const i = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(i);
  }, [step, timer]);

  /* Typewriter effect for Hero headline (loops smoothly repeatedly) */
  const [typedLine1, setTypedLine1] = useState("");
  const [typedLine2, setTypedLine2] = useState("");

  useEffect(() => {
    const line1 = "JOB FIRST.";
    const line2 = "TRAIN NEXT.";
    let i = 0;
    let j = 0;
    let isDeleting = false;
    let timer: NodeJS.Timeout;

    const tick = () => {
      if (!isDeleting) {
        if (i < line1.length) {
          i++;
          setTypedLine1(line1.slice(0, i));
          timer = setTimeout(tick, 90);
        } else if (j < line2.length) {
          j++;
          setTypedLine2(line2.slice(0, j));
          timer = setTimeout(tick, 90);
        } else {
          timer = setTimeout(() => {
            isDeleting = true;
            tick();
          }, 2000);
        }
      } else {
        if (j > 0) {
          j--;
          setTypedLine2(line2.slice(0, j));
          timer = setTimeout(tick, 40);
        } else if (i > 0) {
          i--;
          setTypedLine1(line1.slice(0, i));
          timer = setTimeout(tick, 40);
        } else {
          isDeleting = false;
          timer = setTimeout(tick, 500);
        }
      }
    };

    timer = setTimeout(tick, 300);
    return () => clearTimeout(timer);
  }, []);

  /* Timeline scroll progress */
  const tlRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const el = tlRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const p = (window.innerHeight * 0.65 - r.top) / r.height;
      setProgress(Math.min(1, Math.max(0, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  /* Lock body scroll while modals open */
  useEffect(() => {
    const open = formOpen || legalOpen || zoomOpen;
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [formOpen, legalOpen, zoomOpen]);

  const openForm = (heading = "Check my eligibility") => {
    setFormHeading(heading);
    setIsSerious(false);
    setFormOpen(true);
    if (step !== 3) setStep(1);
  };

  const handleDownloadPrepKit = () => {
    if (isVerified) {
      downloadGuide();
    } else {
      openForm("Download Free Interview Prep Kit");
    }
  };

  const submitDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const n = validateMeaningfulName(fullName, false);
    if (!n.valid) errs.name = n.error || "Enter your full name.";
    const p = validateIndianMobile(phone);
    if (!p.valid) errs.phone = p.error || "Enter a valid 10-digit mobile number.";
    const em = validateMeaningfulEmail(email);
    if (!em.valid) errs.email = em.error || "Enter a valid email.";
    if (!city.trim()) errs.city = "Enter your city.";
    const a = Number(age);
    if (!age.trim() || isNaN(a)) errs.age = "Enter your age.";
    else if (a < 18) errs.age = "Minimum age is 18.";
    else if (a > 28) errs.age = "This program is for candidates aged 28 or below.";
    if (!isSerious) errs.serious = "Please check the confirmation box below to proceed.";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    setOtpError("");
    try {
      const res = await sendSmsOtp(phone);
      if (res.success) {
        setStep(2);
        setTimer(30);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => otpRefs.current[0]?.focus(), 250);
      } else {
        setErrors({ form: res.message || "Could not send OTP. Please try again." });
      }
    } catch {
      setErrors({ form: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const onOtpChange = (i: number, v: string) => {
    if (v.length > 1) {
      const digits = v.replace(/\D/g, "").slice(0, 6).split("");
      const next = [...otp];
      digits.forEach((d, k) => {
        if (i + k < 6) next[i + k] = d;
      });
      setOtp(next);
      otpRefs.current[Math.min(i + digits.length, 5)]?.focus();
      return;
    }
    const d = v.replace(/\D/g, "");
    const next = [...otp];
    next[i] = d;
    setOtp(next);
    if (d && i < 5) otpRefs.current[i + 1]?.focus();
  };

  const resend = async () => {
    if (timer > 0 || busy) return;
    setBusy(true);
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
    try {
      const res = await sendSmsOtp(phone);
      if (res.success) setTimer(30);
      else setOtpError(res.message || "Could not resend OTP.");
    } catch {
      setOtpError("Network error while resending.");
    } finally {
      setBusy(false);
    }
  };

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setOtpError("Enter the 6-digit code.");
      return;
    }
    setBusy(true);
    setOtpError("");
    try {
      const r = await verifySmsOtp(phone, code);
      if (!r.success) {
        setOtpError(r.message || "Invalid or expired code.");
        return;
      }
      const pc = validateIndianMobile(phone);
      const nc = validateMeaningfulName(fullName, false);
      await submitLead({
        name: nc.normalized || fullName.trim(),
        phone: `+91 ${pc.normalized || phone.replace(/\D/g, "").slice(-10)}`,
        email: email.trim().toLowerCase(),
        city: city.trim(),
        age: age.trim(),
        status: experience,
        graduate: education,
        program: `ACWM Wealth Officer (Bajaj Capital) | City: ${city.trim()} | Age: ${age.trim()} | Education: ${education} | Exp: ${experience} | Verified: Phone OTP`,
        source: "placement-guaranteed-trust-page",
        formHeading: "Placement Guaranteed Eligibility (Phone Verified)",
      });
      try {
        localStorage.setItem("pg_phone_verified", "true");
      } catch {}
      setIsVerified(true);
      setStep(3);
      downloadGuide();
    } catch {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const downloadGuide = () => {
    const a = document.createElement("a");
    a.href = "/assets/acwm/bajaj_capital_interview_prep_kit.pdf";
    a.download = "Program_Guide.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const inputCls = (err?: string) =>
    `w-full px-3.5 py-3 rounded-xl border ${err ? "border-red-500" : "border-slate-300"} text-sm text-slate-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1557D6]/30 focus:border-[#1557D6]`;

  const stepsActive = (i: number) => progress >= i / JOURNEY.length - 0.02;

  return (
    <>
      <Helmet>
        <title>Wealth Officer Career Program with Bajaj Capital | Job First, Train Next</title>
        <meta
          name="description"
          content="A structured pathway to a Wealth Officer career opportunity with Bajaj Capital. Get a written Pre-Placement Offer before you pay the program fee. Academic partner AIMA, training by ICOFP."
        />
        <link rel="canonical" href="https://degreeguru.in/placement-guaranteed" />
      </Helmet>

      <div className="min-h-screen bg-[#F7F9FC] text-[#061A36] font-sans antialiased pb-20 md:pb-0 overflow-x-clip">
        {/* HEADER */}
        <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Link to="/" className="flex items-center">
                <img src={degreeGuruLogo} alt="Degree Guru" className="h-8 sm:h-10 w-auto" />
              </Link>
              <span className="text-slate-300 text-lg sm:text-xl font-light">|</span>
              <img src={leverageEduLogo} alt="Leverage Edu" className="h-6 sm:h-8 w-auto object-contain" />
            </div>
            <div className="flex items-center gap-3">
              <a
                href={WA_LINK}
                target="_blank"
                rel="noreferrer"
                aria-label="Chat on WhatsApp"
                className="w-10 h-10 sm:w-11 sm:h-11 flex items-center justify-center active:scale-95 transition-all shrink-0 hover:opacity-90"
              >
                <img src={whatsappCleanIcon} alt="WhatsApp" className="w-8 h-8 sm:w-9 sm:h-9 object-contain drop-shadow-xs" />
              </a>
            </div>
          </div>
        </header>

        {/* HERO SECTION WITH CLEAN TYPOGRAPHIC HIERARCHY & LIQUID GLASSMORPHISM */}
        <section className="bg-[#061A36] text-white overflow-hidden relative">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20 grid lg:grid-cols-12 gap-10 items-center relative z-10">
            <div className="lg:col-span-7 space-y-6">
              {/* Eyebrow Badges */}
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-2 text-xs sm:text-sm font-extrabold tracking-wide uppercase text-[#18B879] bg-[#18B879]/10 border border-[#18B879]/30 px-3.5 py-1.5 rounded-full shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-[#18B879] animate-pulse" />
                  India's #1 Job Guarantee Non-Tech Course
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-black tracking-wide uppercase text-[#F4B942] bg-[#F4B942]/10 border border-[#F4B942]/40 px-3 py-1.5 rounded-full shadow-xs">
                  Only 150 Seats
                </span>
              </div>

              {/* Main Headline with Typewriter Animation in Pure White */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black leading-[1.08] tracking-tight min-h-[2.2em] text-white">
                <span className="inline-block text-white">
                  {typedLine1}
                  {typedLine2.length === 0 && (
                    <span className="inline-block w-1.5 h-[0.82em] bg-white ml-1.5 align-middle animate-pulse" />
                  )}
                </span>
                <br />
                <span className="inline-block text-white">
                  {typedLine2}
                  {typedLine2.length > 0 && (
                    <span className="inline-block w-1.5 h-[0.82em] bg-white ml-1.5 align-middle animate-pulse" />
                  )}
                </span>
              </h1>

              {/* Program Name */}
              <div className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#18B879] tracking-tight">
                Advanced Certification in Wealth Management (ACWM)
              </div>

              {/* Clear Subtext */}
              <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
                A structured pathway to a Wealth Officer career opportunity with Bajaj Capital.
              </p>

              {/* Package Highlight */}
              <div className="pt-1">
                <div className="text-3xl sm:text-5xl font-black text-[#F4B942] tracking-tight">₹4.2–₹4.8 LPA</div>
                <div className="text-xs sm:text-sm text-slate-300 mt-1 font-medium">Guaranteed Starting CTC with Written Pre-Placement Offer</div>
              </div>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  onClick={() => openForm("Check my eligibility")}
                  className="group w-full sm:w-auto px-8 py-4 rounded-xl bg-[#18B879] hover:bg-[#15a36b] text-[#061A36] font-extrabold text-sm tracking-wide transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 active:scale-95"
                >
                  CHECK MY ELIGIBILITY
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl">
                <img src={heroImage} alt="Wealth Officer at work" className="w-full h-[300px] sm:h-[440px] object-cover object-[65%_30%]" />
              </div>
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="bg-white border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 grid grid-cols-3 gap-3 sm:gap-8">
            {[
              [aimaLogo, "AIMA", "Academic Partner"],
              [bajajCapitalLogo, "BAJAJ CAPITAL", "Hiring Partner"],
              [icofpLogo, "ICOFP", "Training Delivery"],
            ].map(([src, name, role]) => (
              <div key={name} className="group text-center">
                <div className="h-8 sm:h-10 flex items-center justify-center">
                  <img
                    src={src}
                    alt={name}
                    className="max-h-full max-w-[90px] sm:max-w-[140px] object-contain"
                  />
                </div>
                <div className="text-[11px] sm:text-xs font-bold mt-2">{name}</div>
                <div className="text-[10px] sm:text-xs text-slate-500">{role}</div>
              </div>
            ))}
          </div>
        </section>

        {/* COMPARISON SECTION (SLIDE ON MOBILE, SIMPLE SHORT HEADING, NO MULTI-LINE SQUEEZE) */}
        <section className="py-16 sm:py-24 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                HOW ACWM IS DIFFERENT
              </h2>
            </Reveal>

            {/* Scrollable / Slideable table container for mobile with generous column widths */}
            <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0 [scrollbar-width:none]">
              <div className="min-w-[700px] rounded-3xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                <div className="grid grid-cols-[160px_1fr_1fr] text-center text-xs sm:text-sm font-extrabold tracking-wide border-b border-slate-200">
                  <div className="py-4 px-3 bg-slate-50 text-slate-400 uppercase text-[11px] flex items-center justify-center">Parameter</div>
                  <div className="py-4 px-4 bg-slate-100 text-slate-500 uppercase flex items-center justify-center">Other Institutes</div>
                  <div className="py-4 px-4 bg-[#061A36] text-[#18B879] uppercase flex items-center justify-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#18B879] animate-pulse" />
                    ACWM Pathway
                  </div>
                </div>

                {[
                  [
                    "Seats Availability",
                    "Unlimited (open mass enrollment batches)",
                    "Only 150 real vacant seats linked to Bajaj Capital absorption",
                  ],
                  [
                    "Admission Criteria",
                    "Pay fee and get instant admission with zero evaluation or screening",
                    "First clear psychometric test & panel interview to be eligible to enroll",
                  ],
                  [
                    "Course Fee",
                    "Full fee taken upfront before any job assurance",
                    "Pay ONLY if you receive written Placement Guaranteed Offer Letter",
                  ],
                  [
                    "Job Guarantee",
                    "No job guarantee — only course completion certificate",
                    "Yes — formal written Pre-Placement Offer letter upfront",
                  ],
                  [
                    "Internship & Stipend",
                    "Unpaid or unassisted internship with ₹0 stipend",
                    "4-month branch internship with guaranteed ₹15,000/mo stipend",
                  ],
                  [
                    "How You Learn",
                    "Made for rote theoretical learning & memorization",
                    "Made for real-world client advisory & live branch simulations",
                  ],
                  [
                    "Placement Support",
                    "Uncertain support across multiple external companies",
                    "Join Bajaj Capital directly — no multi-company hustle",
                  ],
                ].map(([label, other, us]) => (
                  <div key={label} className="grid grid-cols-[160px_1fr_1fr] border-t border-slate-200 text-xs sm:text-sm items-center">
                    <div className="p-4 font-bold text-slate-800 bg-slate-50/70 border-r border-slate-100">
                      {label}
                    </div>
                    <div className="p-4 text-slate-600 flex items-center gap-2.5 border-r border-slate-100">
                      <span className="w-5 h-5 rounded-full bg-red-100 text-red-600 flex items-center justify-center shrink-0">
                        <X size={12} strokeWidth={3} />
                      </span>
                      <span className="leading-snug">{other}</span>
                    </div>
                    <div className="p-4 font-semibold text-[#061A36] bg-emerald-50/60 flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#18B879] text-white flex items-center justify-center shrink-0 shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </span>
                      <span className="leading-snug">{us}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PLACEMENT ROADMAP (COMES IMMEDIATELY AFTER DIFFERENCE) */}
        <section id="how" className="py-16 sm:py-24 bg-[#F7F9FC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-12">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">PLACEMENT ROADMAP</h2>
              <p className="text-slate-600 mt-3 text-sm sm:text-base">Selection to payroll.</p>
            </Reveal>

            <div ref={tlRef} className="relative pl-10 sm:pl-14">
              <div className="absolute left-[15px] sm:left-[23px] top-2 bottom-2 w-0.5 bg-slate-200" />
              <div
                className="absolute left-[15px] sm:left-[23px] top-2 w-0.5 bg-[#18B879]"
                style={{ height: `calc((100% - 16px) * ${progress})`, transition: "height .15s linear" }}
              />
              <div className="space-y-8">
                {JOURNEY.map((s, i) => {
                  const on = stepsActive(i);
                  return (
                    <div key={s.title} className="relative" style={{ opacity: on ? 1 : 0.35, transition: "opacity .4s" }}>
                      <span
                        className={`absolute -left-10 sm:-left-14 top-1 w-8 h-8 sm:w-12 sm:h-12 rounded-full border-4 border-[#F7F9FC] flex items-center justify-center text-[11px] sm:text-sm font-extrabold text-white ${toneDot[s.tone]} ${s.tone === "gold" ? "!text-[#061A36]" : ""}`}
                        style={{ transform: on ? "scale(1)" : "scale(.85)", transition: "transform .4s" }}
                      >
                        {i + 1}
                      </span>
                      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-[11px] font-bold tracking-wider text-[#1557D6] uppercase">{s.when}</div>
                        <h3 className="text-lg sm:text-xl font-extrabold mt-0.5">{s.title}</h3>
                        <p className="text-sm text-slate-600 mt-1 leading-relaxed">{s.text}</p>
                        <span className="inline-block mt-3 text-xs font-bold px-3 py-1 rounded-full bg-[#061A36] text-white">
                          {s.tag}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ELIGIBILITY (PUSHED BELOW ROADMAP) */}
        <section id="eligibility" className="pt-8 pb-10 sm:pt-11 sm:pb-12 bg-white border-t border-slate-200 scroll-mt-24 relative overflow-hidden">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            <Reveal className="text-center mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">ELIGIBILITY</h2>
            </Reveal>

            <Reveal>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 max-w-5xl mx-auto">
                {[
                  "Graduation or Pursuing",
                  "Age 28 or Below",
                  "No Experience Mandatory",
                  "Must Clear Entrance Psychometric Test & Interview",
                ].map((item) => (
                  <div
                    key={item}
                    className="h-full p-4 sm:p-4.5 rounded-2xl bg-[#F7F9FC] border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-start gap-3.5 text-left"
                  >
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                      <Check size={14} strokeWidth={3} />
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#061A36] leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* INTERVIEW PREP KIT DOWNLOAD SECTION */}
        <section className="py-8 sm:py-10 bg-slate-50 border-y border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6">
            <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200 p-5 sm:p-7 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-xs">
              <h3 className="text-lg sm:text-xl font-extrabold text-[#061A36] text-center sm:text-left">
                Bajaj Capital Interview Prep Kit
              </h3>
              <button
                onClick={handleDownloadPrepKit}
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#061A36] hover:bg-[#0c2952] text-white text-xs sm:text-sm font-extrabold tracking-wide transition-all shrink-0 active:scale-95 shadow-md"
              >
                DOWNLOAD PREP KIT
              </button>
            </div>
          </div>
        </section>

        {/* CAREER ADVANTAGE (BRIGHT BASE COLOR, REDUCED GAP, SOFT SHADOW) */}
        <section className="py-14 sm:py-20 bg-[#F7F9FC] text-[#061A36] border-b border-slate-200">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center max-w-2xl mx-auto mb-5 sm:mb-6">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                CAREER ADVANTAGE?
              </h2>
            </Reveal>

            {/* 3 Streamlined Cards: Swipable on mobile, 3-column grid on desktop */}
            <div className="flex flex-nowrap sm:grid sm:grid-cols-3 gap-3.5 overflow-x-auto sm:overflow-visible snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-3 [scrollbar-width:none]">
              <div className="snap-start shrink-0 w-[82%] sm:w-auto h-full">
                <Reveal delay={0} className="h-full">
                  <div className="h-full rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-5 transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-2px_rgba(0,0,0,0.09)] hover:border-[#18B879]/50">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#18B879] flex items-center justify-center mb-2.5">
                      <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#061A36]">No Fear of AI Job Loss</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      High-stakes wealth management is relationship-driven — clients trust experienced human advisors with their life savings, not algorithms.
                    </p>
                  </div>
                </Reveal>
              </div>

              <div className="snap-start shrink-0 w-[82%] sm:w-auto h-full">
                <Reveal delay={100} className="h-full">
                  <div className="h-full rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-5 transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-2px_rgba(0,0,0,0.09)] hover:border-blue-400/50">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#1557D6] flex items-center justify-center mb-2.5">
                      <Sparkles size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#061A36]">No Coding, No Tech Needed</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Open to graduates of all streams (Commerce, Arts, Science, Management) — zero coding or technical background required.
                    </p>
                  </div>
                </Reveal>
              </div>

              <div className="snap-start shrink-0 w-[82%] sm:w-auto h-full">
                <Reveal delay={200} className="h-full">
                  <div className="h-full rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-4 sm:p-5 transition-all duration-300 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-2px_rgba(0,0,0,0.09)] hover:border-[#F4B942]/50">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2.5">
                      <Users size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-extrabold text-[#061A36]">No Prior Experience Needed</h3>
                    <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                      Freshers are welcome — 240 hours of practical training and a 4-month corporate internship groom you from the ground up.
                    </p>
                  </div>
                </Reveal>
              </div>
            </div>

            {/* SEPARATE CONTAINER FOR BAJAJ LEGACY WITH GOLD EMBLEM */}
            <Reveal delay={300}>
              <div className="mt-5 rounded-2xl sm:rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 flex flex-col sm:flex-row items-center gap-5 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_25px_-2px_rgba(0,0,0,0.08)] transition-all">
                <img
                  src={goldEmblem}
                  alt="Century-Old Legacy Emblem"
                  className="w-14 h-18 sm:w-16 sm:h-20 object-contain shrink-0"
                />
                <div className="text-center sm:text-left flex-1">
                  <h3 className="text-lg sm:text-xl font-extrabold text-[#061A36]">
                    Backed by Bajaj Capital's Century-Old Legacy
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                    Build your career with India's premier investment network backed by trusted advisory, lakhs of satisfied clients, and extensive branch offices nationwide.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* PROOF + INSTITUTIONS */}
        <section className="pt-10 pb-16 sm:pt-12 sm:pb-20 bg-white relative overflow-hidden">
          <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <Reveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">BUILT AROUND REAL INSTITUTIONS.</h2>
            </Reveal>

            <div className="grid lg:grid-cols-12 gap-8 items-start">
              <div className="lg:col-span-7 grid gap-4">
                {[
                  [aimaLogo, "Academic Partner", "AIMA", "India's apex national management body established under Government & Industry leadership. Co-certifies the ACWM and delivers executive training."],
                  [bajajCapitalLogo, "Hiring Partner", "Bajaj Capital", "Interviews you, issues the Pre-Placement Offer and runs your internship."],
                  [icofpLogo, "Training Delivery", "ICOFP", "Delivers 190 hours of classroom training and NISM preparation."],
                ].map(([logo, role, name, line], i) => (
                  <Reveal key={name} delay={i * 100}>
                    <div className="flex items-center gap-5 rounded-3xl border border-slate-200/80 bg-white/80 backdrop-blur-md p-5 hover:border-[#1557D6]/40 hover:shadow-lg transition-all duration-300">
                      <div className="w-24 sm:w-32 h-14 shrink-0 bg-white rounded-2xl border border-slate-100 flex items-center justify-center p-2 shadow-2xs">
                        <img src={logo} alt={name} className="max-h-full max-w-full object-contain" />
                      </div>
                      <div>
                        <div className="text-[11px] font-bold tracking-wider text-[#1557D6] uppercase">{role}</div>
                        <p className="text-sm text-slate-700 mt-0.5 leading-relaxed">{line}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>

              <Reveal delay={150} className="lg:col-span-5">
                <button
                  onClick={() => setZoomOpen(true)}
                  className="group relative block w-full rounded-3xl overflow-hidden border border-slate-200/80 shadow-lg text-left backdrop-blur-md"
                  aria-label="Enlarge certificate"
                >
                  <img
                    src={acwmCertificate}
                    alt="ACWM certificate"
                    className="w-full transition-transform duration-500 group-hover:scale-105"
                  />
                </button>
                <p className="text-xs text-slate-500 mt-3 text-center">Advanced Certification in Wealth Management (ACWM)</p>
              </Reveal>
            </div>
          </div>
        </section>

        {/* CERTIFICATION EXPOSURE */}
        <section className="pt-10 pb-14 sm:pt-12 sm:pb-16 bg-[#F7F9FC] border-t border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <Reveal className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">CERTIFICATION EXPOSURE</h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2">
                Key professional certifications and licenses covered during the program.
              </p>
            </Reveal>

            {/* Desktop Table View */}
            <Reveal delay={100} className="hidden md:block">
              <div className="rounded-3xl border border-slate-200/90 bg-white shadow-xs overflow-hidden">
                <div className="grid grid-cols-12 gap-4 px-6 py-3.5 bg-slate-50/80 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                  <div className="col-span-3">Certification</div>
                  <div className="col-span-3">Type</div>
                  <div className="col-span-4">Primary Focus</div>
                  <div className="col-span-2 text-right">Issued By</div>
                </div>

                <div className="divide-y divide-slate-100">
                  {CERTIFICATIONS_EXPOSURE.map((row) => (
                    <div
                      key={row.name}
                      className="grid grid-cols-12 gap-4 px-6 py-3.5 items-center hover:bg-slate-50/60 transition-colors"
                    >
                      <div className="col-span-3">
                        <div className="font-extrabold text-sm sm:text-base text-[#061A36]">{row.name}</div>
                      </div>

                      <div className="col-span-3">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold border ${row.typeStyle}`}>
                          {row.type}
                        </span>
                      </div>

                      <div className="col-span-4 text-xs sm:text-sm text-slate-600 font-normal">
                        {row.focus}
                      </div>

                      <div className="col-span-2 text-right">
                        <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-100 text-[#061A36] border border-slate-200/80">
                          {row.body}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Mobile Stacked Cards View */}
            <div className="md:hidden space-y-3">
              {CERTIFICATIONS_EXPOSURE.map((row, i) => (
                <Reveal key={row.name} delay={i * 60}>
                  <div className="rounded-2xl border border-slate-200/90 bg-white p-4 shadow-2xs space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="font-extrabold text-base text-[#061A36]">{row.name}</div>
                      <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-slate-100 text-[#061A36] border border-slate-200 shrink-0">
                        {row.body}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600">
                      {row.focus}
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-[11px] text-slate-400 font-medium">Type</span>
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border ${row.typeStyle}`}>
                        {row.type}
                      </span>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            <p className="text-xs text-slate-500 mt-4 text-center">
              Joint certification awarded by AIMA &amp; ICOFP on program completion.
            </p>
          </div>
        </section>

        {/* WHAT YOU'LL LEARN */}
        <section className="pt-8 pb-10 sm:pt-11 sm:pb-14 bg-[#F7F9FC] border-t border-slate-200 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <Reveal className="text-center mb-3 sm:mb-4">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">What You'll Learn</h2>
            </Reveal>

            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory -mx-4 px-4 md:mx-0 md:px-0 pb-2 [scrollbar-width:none]">
              {MODULES.map(({ icon: Icon, t, d }) => (
                <div
                  key={t}
                  className="snap-start shrink-0 w-[72%] sm:w-[48%] md:w-auto rounded-3xl bg-white border border-slate-200/90 p-5 sm:p-6 hover:-translate-y-1.5 hover:shadow-lg hover:border-[#1557D6]/30 transition-all duration-300 group shadow-xs"
                >
                  <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#1557D6] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Icon size={22} />
                  </div>
                  <h3 className="font-extrabold text-base mt-4 text-[#061A36]">{t}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">{d}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHERE CAN THIS CAREER GO? (HEADING ABOVE IMAGE) */}
        <section className="pt-8 pb-12 sm:pt-11 sm:pb-16 bg-[#F7F9FC] border-t border-slate-200 relative overflow-hidden">
          <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-emerald-100/40 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <Reveal className="text-center lg:text-left mb-5 sm:mb-7">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">WHERE CAN THIS CAREER GO?</h2>
            </Reveal>

            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              <Reveal>
                <div className="rounded-3xl overflow-hidden shadow-xl border border-slate-200/80 bg-white">
                  <img src={consultImage} alt="Advisor meeting a client" className="w-full h-[260px] sm:h-[400px] object-cover object-[70%_40%]" />
                </div>
              </Reveal>
              <div className="space-y-3">
                {LADDER.map((l, i) => (
                  <Reveal key={l.t} delay={i * 80}>
                    <div className="flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-md p-4 sm:p-4.5 hover:border-[#1557D6]/40 hover:shadow-md hover:-translate-x-1 transition-all duration-300">
                      <span className="w-10 h-10 rounded-xl bg-[#061A36] text-white text-sm font-extrabold flex items-center justify-center shrink-0 shadow-xs">
                        0{i + 1}
                      </span>
                      <div className="flex-1">
                        <div className="font-extrabold text-sm sm:text-base text-[#061A36]">{l.t}</div>
                        <div className="text-xs text-slate-500 mt-0.5">{l.d}</div>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEES (PAYMENT SECTION) */}
        <section id="fees" className="pt-10 pb-16 sm:pt-12 sm:pb-20 bg-white border-t border-slate-200 scroll-mt-24 relative overflow-hidden">
          <div className="absolute top-1/4 -right-28 w-96 h-96 bg-amber-100/30 rounded-full blur-3xl pointer-events-none" />
          <div className="max-w-5xl mx-auto px-4 sm:px-6 relative z-10">
            <Reveal className="text-center mb-8 sm:mb-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">WHAT WILL YOU PAY?</h2>
            </Reveal>

            {/* Hierarchical 2-Column Grid */}
            <div className="grid lg:grid-cols-12 gap-6 items-stretch">

              {/* Left Column: Milestones */}
              <div className="lg:col-span-6 rounded-3xl border border-slate-200/80 bg-[#F7F9FC]/90 backdrop-blur-md p-6 sm:p-7 flex flex-col justify-between shadow-xs">
                <div className="space-y-6">
                  {/* Stage 1 */}
                  <div className="flex gap-4 items-center">
                    <div className="w-8 h-8 rounded-full bg-[#1557D6] text-white flex items-center justify-center text-xs font-bold shrink-0 shadow-xs">
                      1
                    </div>
                    <div className="flex-1 flex items-baseline justify-between">
                      <h4 className="text-sm font-extrabold text-[#061A36]">Registration Fee</h4>
                      <span className="text-base font-extrabold text-[#061A36]">₹500</span>
                    </div>
                  </div>

                  <div className="ml-4 border-l-2 border-dashed border-slate-300 h-4" />

                  {/* Stage 2 */}
                  <div className="flex gap-4 items-start">
                    <div className="w-8 h-8 rounded-full bg-[#061A36] text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 shadow-xs">
                      2
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between">
                        <h4 className="text-sm font-extrabold text-[#061A36]">Program Tuition Fee</h4>
                        <span className="text-sm font-bold text-[#1557D6] bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-100">
                          ₹1.77 Lakh
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        Payable <strong>ONLY AFTER</strong> you receive and accept your official written Pre-Placement Offer letter from Bajaj Capital.
                      </p>
                      <div className="mt-2 text-[11px] font-semibold text-slate-700 bg-white px-2.5 py-1 rounded-lg border border-slate-200">
                        0% interest EMI available.
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200 text-xs text-emerald-900 bg-emerald-50/80 p-3.5 rounded-xl border border-emerald-200/80 leading-relaxed flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                  <span><strong>Zero-Risk Commitment:</strong> If you are not selected in the interview, you do not pay any program fee.</span>
                </div>
              </div>

              {/* Right Column: Highlighted Glassmorphic Container (₹32,000) */}
              <div className="lg:col-span-6 rounded-3xl border-2 border-[#F4B942] bg-gradient-to-br from-[#061A36] via-[#092244] to-[#061A36] text-white p-6 sm:p-7 flex flex-col justify-between shadow-2xl relative overflow-hidden backdrop-blur-xl">
                <div className="absolute -right-12 -top-12 w-44 h-44 bg-[#F4B942]/15 rounded-full blur-2xl pointer-events-none animate-pulse" />

                <div>
                  <div className="pb-3 border-b border-white/10 mb-4">
                    <span className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-widest text-[#F4B942] uppercase">
                      <Sparkles size={13} className="text-[#F4B942]" />
                      WHAT YOU'LL ACTUALLY PAY
                    </span>
                  </div>

                  {/* Math Breakdown Table */}
                  <div className="p-4 sm:p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-3 text-xs sm:text-sm text-slate-200">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-300">Total Program Fee (incl. 18% GST):</span>
                      <span className="font-bold text-white text-sm sm:text-base">₹1,77,000</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-300">
                      <span>Internship Stipend (4 months × ₹15k):</span>
                      <span className="font-bold text-sm sm:text-base">− ₹60,000</span>
                    </div>
                    <div className="flex justify-between items-center text-emerald-300">
                      <span>Retention Bonus (after 12 months):</span>
                      <span className="font-bold text-sm sm:text-base">− ₹85,000</span>
                    </div>
                    <div className="pt-4 mt-2 border-t border-white/20 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1.5">
                      <div>
                        <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#F4B942]">
                          Effective Net Out-of-Pocket
                        </div>
                        <div className="text-[11px] text-slate-300">
                          Total investment after stipend &amp; retention bonus
                        </div>
                      </div>
                      <div className="text-4xl sm:text-5xl font-black text-[#F4B942] tracking-tight drop-shadow-sm sm:text-right">
                        ₹32,000
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 text-center">
                  <span className="text-xs text-slate-300">
                    + Full-time starting CTC at month 7: <strong className="text-[#18B879]">₹4.2 – ₹4.8 LPA</strong>
                  </span>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="py-16 sm:py-24 bg-[#061A36] text-white relative overflow-hidden">
          <div className="absolute top-1/2 -left-32 w-96 h-96 bg-emerald-500/10 rounded-full blur-[100px] pointer-events-none" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
            <Reveal className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">WHAT DOES PLACEMENT GUARANTEED MEAN?</h2>
              <p className="text-slate-300 mt-3 text-sm sm:text-base">Exactly this — no more, no less.</p>
            </Reveal>

            <div className="grid md:grid-cols-2 gap-5 max-w-4xl mx-auto">
              <Reveal>
                <div className="h-full rounded-3xl bg-white/5 backdrop-blur-xl border border-[#18B879]/40 p-6 shadow-xl hover:border-[#18B879]/70 transition-all">
                  <div className="text-xs font-bold tracking-widest text-[#18B879] mb-4">WHAT IS GUARANTEED</div>
                  <ul className="space-y-3 text-sm text-slate-200">
                    {[
                      "A written Pre-Placement Offer from Bajaj Capital once you clear selection.",
                      "A 4-month Bajaj Capital internship with ₹15,000 per month stipend.",
                      "The Wealth Officer role (₹4.2 – ₹4.8 LPA) when you meet the criteria below.",
                    ].map((t) => (
                      <li key={t} className="flex gap-2.5">
                        <Check size={16} className="text-[#18B879] shrink-0 mt-0.5" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
              <Reveal delay={100}>
                <div className="h-full rounded-3xl bg-white/5 backdrop-blur-xl border border-white/15 p-6 shadow-xl hover:border-white/30 transition-all">
                  <div className="text-xs font-bold tracking-widest text-[#F4B942] mb-4">THE CONDITIONS</div>
                  <ul className="space-y-3 text-sm text-slate-200">
                    {[
                      "Clear the Bajaj Capital interview",
                      "85% attendance",
                      "80% in evaluations",
                      "NISM Series V-A certification",
                      "Professional conduct and relocation readiness",
                    ].map((t) => (
                      <li key={t} className="flex gap-2.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#F4B942] mt-2 shrink-0" />
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-16 sm:py-24 bg-white scroll-mt-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <Reveal className="text-center mb-10">
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">FREQUENTLY ASKED QUESTIONS</h2>
            </Reveal>
            <div className="divide-y divide-slate-200 border-y border-slate-200">
              {FAQS.map((f, i) => {
                const open = openFaq === i;
                return (
                  <div key={f.q}>
                    <button
                      onClick={() => setOpenFaq(open ? null : i)}
                      className="w-full flex items-center justify-between gap-4 py-5 text-left font-bold text-sm sm:text-base hover:text-[#1557D6] transition-colors"
                    >
                      {f.q}
                      <ChevronDown size={18} className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180 text-[#1557D6]" : ""}`} />
                    </button>
                    <div className="grid transition-all duration-300" style={{ gridTemplateRows: open ? "1fr" : "0fr" }}>
                      <div className="overflow-hidden">
                        <p className="pb-5 pr-8 text-sm text-slate-600 leading-relaxed">{f.a}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className="py-16 sm:py-24 bg-[#061A36] text-white text-center">
          <div className="max-w-2xl mx-auto px-4 sm:px-6">
            <Reveal>
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">READY TO TAKE THE NEXT STEP?</h2>
              <button
                onClick={openForm}
                className="group mt-8 px-9 py-4 rounded-xl bg-[#18B879] hover:bg-[#15a36b] text-[#061A36] font-extrabold text-sm tracking-wide transition-all inline-flex items-center gap-2"
              >
                CHECK MY ELIGIBILITY
                <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
                
            </Reveal>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="bg-[#04101e] text-slate-400 text-xs py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-5">
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2">
              {(["program", "fees", "placement", "terms", "disclaimer"] as LegalTab[]).map((k) => (
                <button key={k} onClick={() => setLegalOpen(k)} className="hover:text-white transition-colors">
                  {k === "fees" ? "Fee & Refund Policy" : LEGAL[k].label}
                </button>
              ))}
              <Link to="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-500">
              The Pre-Placement Offer, internship, stipend, retention bonus and Wealth Officer role apply only to candidates selected into the Bajaj Capital pathway and are subject to its stated terms. © {new Date().getFullYear()} Degree Guru.
            </p>
          </div>
        </footer>

        {/* MOBILE FLOATING BAR: 5 APP BUTTONS */}
        <div className="md:hidden fixed z-40 bottom-3 inset-x-2 max-w-lg mx-auto">
          <div className="bg-[#061A36]/95 backdrop-blur-md text-white rounded-2xl py-2 px-1.5 shadow-2xl border border-white/10 flex items-center justify-around">
            <button
              onClick={() => openForm("Apply for Program")}
              className="flex flex-col items-center gap-0.5 text-[#18B879] active:scale-95 transition-transform cursor-pointer px-1"
            >
              <Briefcase size={17} />
              <span className="text-[10px] font-bold tracking-tight">Apply</span>
            </button>
            <a
              href="#eligibility"
              className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-white active:scale-95 transition-transform px-1"
            >
              <CheckCircle2 size={17} />
              <span className="text-[10px] font-semibold tracking-tight">Eligibility</span>
            </a>
            <a
              href="#how"
              className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-white active:scale-95 transition-transform px-1"
            >
              <Route size={17} />
              <span className="text-[10px] font-semibold tracking-tight">Roadmap</span>
            </a>
            <a
              href="#fees"
              className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-white active:scale-95 transition-transform px-1"
            >
              <Percent size={17} />
              <span className="text-[10px] font-semibold tracking-tight">Fee</span>
            </a>
            <a
              href="#faq"
              className="flex flex-col items-center gap-0.5 text-slate-300 hover:text-white active:scale-95 transition-transform px-1"
            >
              <HelpCircle size={17} />
              <span className="text-[10px] font-semibold tracking-tight">FAQ</span>
            </a>
          </div>
        </div>

        {/* DESKTOP FLOATING WHATSAPP */}
        <a
          href={WA_LINK}
          target="_blank"
          rel="noreferrer"
          aria-label="Talk to an Advisor on WhatsApp"
          className="hidden md:flex fixed z-40 right-6 bottom-6 items-center gap-2.5 bg-white rounded-full pl-1.5 pr-5 py-1.5 shadow-xl border border-slate-200 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
        >
          <WhatsAppCircleIcon className="w-11 h-11" />
          <span className="text-sm font-bold text-[#061A36]">Talk to an Advisor</span>
        </a>
      </div>

      {/* ELIGIBILITY MODAL / BOTTOM SHEET */}
      {formOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm"
          onClick={() => setFormOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-lg rounded-t-3xl sm:rounded-3xl max-h-[94vh] overflow-y-auto p-6 sm:p-8 relative shadow-2xl"
          >
            <button
              onClick={() => setFormOpen(false)}
              aria-label="Close"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center cursor-pointer"
            >
              <X size={18} />
            </button>

            {step === 1 && (
              <form onSubmit={submitDetails} className="space-y-3.5">
                <div className="pr-10 mb-2">
                  <h3 className="text-2xl font-extrabold">{formHeading}</h3>
                </div>

                <div>
                  <input className={inputCls(errors.name)} placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <div className={`flex rounded-xl border ${errors.phone ? "border-red-500" : "border-slate-300"} overflow-hidden focus-within:ring-2 focus-within:ring-[#1557D6]/30`}>
                    <span className="px-3.5 flex items-center bg-slate-50 border-r border-slate-200 text-sm font-semibold">+91</span>
                    <input
                      type="tel"
                      inputMode="numeric"
                      maxLength={10}
                      className="w-full px-3.5 py-3 text-sm focus:outline-none"
                      placeholder="Mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div>
                  <input type="email" className={inputCls(errors.email)} placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                  {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input className={inputCls(errors.city)} placeholder="City" value={city} onChange={(e) => setCity(e.target.value)} />
                    {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                  </div>
                  <div>
                    <input type="number" inputMode="numeric" className={inputCls(errors.age)} placeholder="Age" value={age} onChange={(e) => setAge(e.target.value)} />
                    {errors.age && <p className="text-xs text-red-500 mt-1">{errors.age}</p>}
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <CustomSelect
                    value={education}
                    onChange={setEducation}
                    options={[
                      "Commerce / B.Com",
                      "Management / BBA",
                      "Science / B.Sc",
                      "Arts / BA",
                      "Engineering / B.Tech",
                      "Postgraduate / Other",
                    ]}
                    placeholder="Highest qualification"
                    label="Qualification"
                  />
                  <CustomSelect
                    value={experience}
                    onChange={setExperience}
                    options={[
                      "Fresher",
                      "Less than 1 year",
                      "1 to 2 years",
                      "2+ years",
                    ]}
                    placeholder="Work experience"
                    label="Experience"
                  />
                </div>

                {errors.form && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle size={15} /> {errors.form}
                  </div>
                )}

                <div className="pt-1">
                  <label className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 cursor-pointer transition-colors">
                    <input
                      type="checkbox"
                      checked={isSerious}
                      onChange={(e) => {
                        setIsSerious(e.target.checked);
                        if (errors.serious) {
                          setErrors((prev) => {
                            const next = { ...prev };
                            delete next.serious;
                            return next;
                          });
                        }
                      }}
                      className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#1557D6] focus:ring-[#1557D6] cursor-pointer shrink-0"
                    />
                    <span className="text-xs text-slate-700 font-medium leading-snug">
                      I confirm I am a serious candidate who wants to enroll in the Job Guaranteed Program with Bajaj Capital.
                    </span>
                  </label>
                  {errors.serious && <p className="text-xs text-red-500 mt-1 font-semibold">{errors.serious}</p>}
                </div>

                <button
                  type="submit"
                  disabled={busy || !isSerious}
                  className="w-full py-4 rounded-xl bg-[#1557D6] hover:bg-[#0f44b0] disabled:opacity-50 disabled:cursor-not-allowed text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md"
                >
                  {busy ? <><RefreshCw size={16} className="animate-spin" /> SENDING OTP…</> : "SEND OTP"}
                </button>
                <p className="text-[11px] text-slate-400 text-center leading-snug">
                  Your information is used only to process your enquiry and connect you with the admissions team.
                </p>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={verify} className="space-y-5">
                <div className="pr-10">
                  <h3 className="text-2xl font-extrabold">Verify OTP</h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Code sent to <strong className="text-slate-900">+91 {phone}</strong>
                  </p>
                </div>
                <div className="flex justify-between gap-2">
                  {otp.map((d, i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        otpRefs.current[i] = el;
                      }}
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      onChange={(e) => onOtpChange(i, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Backspace" && !otp[i] && i > 0) otpRefs.current[i - 1]?.focus();
                      }}
                      className="w-full max-w-[52px] h-14 text-center text-xl font-bold rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#1557D6] focus:border-[#1557D6]"
                    />
                  ))}
                </div>
                {otpError && (
                  <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                    <AlertCircle size={15} /> {otpError}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={busy}
                  className="w-full py-4 rounded-xl bg-[#18B879] hover:bg-[#15a36b] disabled:opacity-70 text-[#061A36] font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-colors"
                >
                  {busy ? <><RefreshCw size={16} className="animate-spin" /> VERIFYING…</> : "VERIFY OTP"}
                </button>
                <div className="flex justify-between text-xs">
                  <button type="button" onClick={() => setStep(1)} className="text-slate-500 underline">
                    Change number
                  </button>
                  <button
                    type="button"
                    onClick={resend}
                    disabled={timer > 0}
                    className={timer > 0 ? "text-slate-400" : "text-[#1557D6] font-semibold"}
                  >
                    {timer > 0 ? `Resend in ${timer}s` : "Resend OTP"}
                  </button>
                </div>
              </form>
            )}

            {step === 3 && (
              <div className="text-center space-y-5 py-2">
                <div className="w-16 h-16 rounded-full bg-[#18B879] text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 size={34} />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold">Eligibility request submitted</h3>
                  <p className="text-sm text-slate-600 mt-2">Our admissions team will contact you within one working day.</p>
                </div>
                <div className="space-y-3">
                  <button
                    onClick={downloadGuide}
                    className="w-full py-4 rounded-xl bg-[#061A36] hover:bg-[#0c2952] text-white font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download size={16} /> DOWNLOAD PROGRAM GUIDE
                  </button>
                  <a
                    href={WA_LINK}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#061A36] font-extrabold text-sm tracking-wide flex items-center justify-center gap-2 transition-colors"
                  >
                    <WhatsAppCircleIcon className="w-5 h-5" /> SPEAK TO AN ADVISOR
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CERTIFICATE ZOOM */}
      {zoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-4" onClick={() => setZoomOpen(false)}>
          <button
            aria-label="Close"
            onClick={() => setZoomOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center"
          >
            <X size={20} />
          </button>
          <img
            src={acwmCertificate}
            alt="ACWM certificate"
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] max-w-full rounded-xl shadow-2xl"
          />
        </div>
      )}

      {/* LEGAL */}
      {legalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center" onClick={() => setLegalOpen(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white w-full sm:max-w-xl rounded-t-3xl sm:rounded-3xl max-h-[88vh] flex flex-col shadow-2xl"
          >
            <div className="flex items-center justify-between p-5 border-b border-slate-200">
              <h3 className="text-lg font-extrabold">Program disclosures</h3>
              <button onClick={() => setLegalOpen(null)} aria-label="Close" className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center">
                <X size={18} />
              </button>
            </div>
            <div className="flex overflow-x-auto border-b border-slate-200 text-xs font-bold [scrollbar-width:none]">
              {(Object.keys(LEGAL) as LegalTab[]).map((k) => (
                <button
                  key={k}
                  onClick={() => setLegalOpen(k)}
                  className={`px-4 py-3 whitespace-nowrap border-b-2 ${legalOpen === k ? "border-[#1557D6] text-[#1557D6]" : "border-transparent text-slate-500"}`}
                >
                  {LEGAL[k].label}
                </button>
              ))}
            </div>
            <div className="p-6 overflow-y-auto text-sm text-slate-700 leading-relaxed">{LEGAL[legalOpen].body}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default PlacementGuaranteed;
