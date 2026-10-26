import React, { useState, useRef, useEffect } from "react";
import {
  Check,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Paperclip,
  X,
  Loader2,
  Download,
  ChevronDown,
} from "lucide-react";
import { submitLead, sendSmsOtp, verifySmsOtp } from "@/lib/api";
import { validateIndianMobile, validateMeaningfulName, validateMeaningfulEmail } from "@/lib/validation";
import { WhatsAppCircleIcon } from "@/components/SocialIcons";

const WA_ADVISOR_LINK =
  "https://wa.me/918448411672?text=" +
  encodeURIComponent("Hi Degree Guru, I would like to speak with a Career Advisor for personalized guidance regarding suitable programmes.");

interface BajajProgrammeFormProps {
  isModal?: boolean;
  onClose?: () => void;
  formHeading?: string;
}

export const BajajProgrammeForm: React.FC<BajajProgrammeFormProps> = ({
  isModal = false,
  onClose,
  formHeading = "Check Your Eligibility",
}) => {
  // Step navigation: 1 = Eligibility, 2 = Registration Details, "otp" = OTP Verification, 3 = Confirmed
  const [step, setStep] = useState<1 | 2 | "otp" | 3>(1);

  // Step 1: Eligibility criteria
  const [qualification, setQualification] = useState<string>("");
  const [age, setAge] = useState<string>("");
  const [experience, setExperience] = useState<string>("");
  const [enrollInterest, setEnrollInterest] = useState<string>("");

  // Step 2: Registration details
  const [fullName, setFullName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [city, setCity] = useState<string>("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeBase64, setResumeBase64] = useState<string>("");
  const [resumeError, setResumeError] = useState<string>("");
  const [isFeeUnderstood, setIsFeeUnderstood] = useState<boolean>(false);

  // OTP Verification
  const [otp, setOtp] = useState<string[]>(["", "", "", "", "", ""]);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [timer, setTimer] = useState<number>(0);
  const [otpError, setOtpError] = useState<string>("");

  // Form handling state
  const [busy, setBusy] = useState<boolean>(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Countdown timer for OTP
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  // Derived conditional logic
  const isGeneralIneligible =
    qualification === "Graduation Not Completed" || enrollInterest === "Just exploring";

  const numAge = parseInt(age, 10);
  const isAgeValid = !isNaN(numAge) && numAge >= 21 && numAge <= 35;

  // Both Fresher and Experienced are 100% allowed
  const isStep1Complete =
    qualification !== "" &&
    isAgeValid &&
    experience !== "" &&
    enrollInterest !== "";

  const isEligibleToProceed = isStep1Complete && !isGeneralIneligible;

  // Restrict age typing strictly to 21–35
  const handleAgeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 2);
    if (errors.age) {
      setErrors((prev) => {
        const n = { ...prev };
        delete n.age;
        return n;
      });
    }

    if (raw === "") {
      setAge("");
      return;
    }

    // 1 digit typed: only allow 2 or 3 because ages 21-35 start with 2 or 3
    if (raw.length === 1) {
      if (raw === "2" || raw === "3") {
        setAge(raw);
      }
      return;
    }

    // 2 digits typed: only allow between 21 and 35
    if (raw.length === 2) {
      const num = parseInt(raw, 10);
      if (num >= 21 && num <= 35) {
        setAge(raw);
      }
      return;
    }
  };

  // File Upload Handlers (Resume only)
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setResumeError("");
    const file = e.target.files?.[0];
    if (!file) return;

    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const isDocExt = /\.(pdf|doc|docx)$/i.test(file.name);

    if (!allowed.includes(file.type) && !isDocExt) {
      setResumeError("Only PDF, DOC, or DOCX formats accepted.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setResumeError("File size exceeds 5MB limit.");
      return;
    }

    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      const res = reader.result as string;
      const b64 = res.includes(",") ? res.split(",")[1] : res;
      setResumeBase64(b64);
    };
    reader.onerror = () => {
      setResumeError("Could not read file. Please try again.");
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setResumeFile(null);
    setResumeBase64("");
    setResumeError("");
  };

  // Step 1: Proceed to Registration
  const handleProceedToStep2 = () => {
    const errs: Record<string, string> = {};
    if (!qualification) errs.qualification = "Select qualification";
    if (!isAgeValid) errs.age = "Enter age (21–35)";
    if (!experience) errs.experience = "Select work experience";
    if (!enrollInterest) errs.enrollInterest = "Select your interest";

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    if (!isEligibleToProceed) return;

    setErrors({});
    setStep(2);
  };

  // Step 2: Submit Details & Trigger OTP
  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};

    const n = validateMeaningfulName(fullName, false);
    if (!n.valid) errs.name = n.error || "Enter full name";

    const p = validateIndianMobile(phone);
    if (!p.valid) errs.phone = p.error || "Enter 10-digit mobile number";

    const em = validateMeaningfulEmail(email);
    if (!em.valid) errs.email = em.error || "Enter valid email";

    if (!city.trim()) errs.city = "Enter current city";

    if (!isFeeUnderstood) {
      errs.fee = "Please acknowledge the confirmation checkbox to proceed";
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setBusy(true);
    setOtpError("");

    // Submit lead immediately so candidate information is NEVER lost and sheet/email triggers right away
    let finalBase64 = resumeBase64;
    if (resumeFile && !finalBase64) {
      try {
        finalBase64 = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = () => {
            const res = reader.result as string;
            resolve(res.includes(",") ? res.split(",")[1] : res);
          };
          reader.onerror = () => resolve("");
          reader.readAsDataURL(resumeFile);
        });
      } catch {
        // silent fallback
      }
    }

    try {
      await submitLead({
        name: fullName.trim(),
        phone: `+91 ${phone.replace(/\D/g, "").slice(-10)}`,
        email: email.trim().toLowerCase(),
        city: city.trim(),
        age: age.trim(),
        graduate: qualification,
        education: qualification,
        qualification: qualification,
        experience: experience,
        interest: enrollInterest,
        program: `ACWM Wealth Officer (Bajaj Capital) | Exp: ${experience} | Interest: ${enrollInterest}`,
        source: "placement-guaranteed-trust-page",
        formHeading: "Bajaj Capital Programme Registration",
        cvFile: resumeFile || undefined,
        resumeBase64: finalBase64 || undefined,
        resumeFileName: resumeFile ? resumeFile.name : undefined,
        resumeMimeType: resumeFile ? resumeFile.type : undefined,
      });
    } catch (submitErr) {
      console.warn("Immediate lead submission note:", submitErr);
    }

    try {
      const res = await sendSmsOtp(phone);
      if (res.success) {
        setStep("otp");
        setTimer(30);
        setOtp(["", "", "", "", "", ""]);
        setTimeout(() => otpRefs.current[0]?.focus(), 250);
      } else {
        // Even if SMS OTP gateway had an issue, the lead is already safely saved!
        setStep(3);
        downloadProgramGuide();
      }
    } catch {
      // Even if network error for SMS, the lead is already safely saved!
      setStep(3);
      downloadProgramGuide();
    } finally {
      setBusy(false);
    }
  };

  // OTP Input handler
  const onOtpChange = (index: number, val: string) => {
    if (val.length > 1) {
      const digits = val.replace(/\D/g, "").slice(0, 6).split("");
      const nextOtp = [...otp];
      digits.forEach((d, k) => {
        if (index + k < 6) nextOtp[index + k] = d;
      });
      setOtp(nextOtp);
      otpRefs.current[Math.min(index + digits.length, 5)]?.focus();
      return;
    }
    const cleanDigit = val.replace(/\D/g, "");
    const nextOtp = [...otp];
    nextOtp[index] = cleanDigit;
    setOtp(nextOtp);
    if (cleanDigit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  // Resend SMS OTP
  const handleResendOtp = async () => {
    if (timer > 0 || busy) return;
    setBusy(true);
    setOtpError("");
    setOtp(["", "", "", "", "", ""]);
    try {
      const res = await sendSmsOtp(phone, "sms");
      if (res.success) setTimer(30);
      else setOtpError(res.message || "Could not resend OTP.");
    } catch {
      setOtpError("Network error while resending OTP.");
    } finally {
      setBusy(false);
    }
  };

  // Voice OTP
  const handleResendVoice = async () => {
    if (busy) return;
    setBusy(true);
    setOtpError("");
    try {
      const res = await sendSmsOtp(phone, "voice");
      if (res.success) {
        setTimer(30);
        setOtpError("Calling your mobile number with verification code now...");
      } else {
        setOtpError(res.message || "Could not trigger phone call.");
      }
    } catch {
      setOtpError("Network error while placing call.");
    } finally {
      setBusy(false);
    }
  };

  // Verify OTP and complete lead registration
  const handleVerifyOtp = async (e: React.FormEvent) => {
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

      // Convert Resume file to base64 if needed
      let finalBase64 = resumeBase64;
      if (resumeFile && !finalBase64) {
        try {
          finalBase64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = reader.result as string;
              resolve(res.includes(",") ? res.split(",")[1] : res);
            };
            reader.onerror = () => resolve("");
            reader.readAsDataURL(resumeFile);
          });
        } catch {
          // silent fallback
        }
      }

      // Submit lead to Google Sheets & CRM
      await submitLead({
        name: fullName.trim(),
        phone: `+91 ${phone.replace(/\D/g, "").slice(-10)}`,
        email: email.trim().toLowerCase(),
        city: city.trim(),
        age: age.trim(),
        graduate: qualification,
        education: qualification,
        qualification: qualification,
        experience: experience,
        interest: enrollInterest,
        program: `ACWM Wealth Officer (Bajaj Capital) | Exp: ${experience} | Interest: ${enrollInterest}`,
        source: "placement-guaranteed-trust-page",
        formHeading: "Bajaj Capital Programme Registration (Verified)",
        cvFile: resumeFile || undefined,
        resumeBase64: finalBase64 || undefined,
        resumeFileName: resumeFile ? resumeFile.name : undefined,
        resumeMimeType: resumeFile ? resumeFile.type : undefined,
      });

      // Fire Meta Pixel & GA4 / GTM Lead Event
      if (typeof window !== "undefined") {
        try {
          if ((window as any).fbq) {
            (window as any).fbq("track", "Lead", {
              content_name: "Bajaj Capital ACWM Registration",
              currency: "INR",
              value: 500,
            });
          }
          if ((window as any).dataLayer) {
            (window as any).dataLayer.push({
              event: "generate_lead",
              lead_type: "bajaj_acwm_registration",
              program: "ACWM Wealth Officer",
            });
          }
          if ((window as any).gtag) {
            (window as any).gtag("event", "generate_lead", {
              event_category: "Lead",
              event_label: "Bajaj Capital ACWM Registration",
            });
          }
        } catch {
          // Analytics error safety
        }
      }

      setStep(3);
      downloadProgramGuide();
    } catch {
      setOtpError("Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  };

  const downloadProgramGuide = () => {
    const a = document.createElement("a");
    a.href = "/assets/acwm/bajaj_capital_interview_prep_kit.pdf";
    a.download = "Bajaj_Capital_ACWM_Guide.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full bg-white text-[#061A36] rounded-3xl shadow-2xl border border-slate-100 overflow-hidden transition-all duration-300">
      {/* Clean Live Form Vibe Header */}
      <div className="px-6 sm:px-7 pt-6 sm:pt-7 pb-3 border-b border-slate-100 relative bg-white">
        {isModal && onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close form"
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        )}

        <h3 className="text-xl sm:text-2xl font-black text-[#061A36] tracking-tight">
          {step === 3
            ? "Registration Confirmed"
            : step === "otp"
            ? "Verify Mobile Number"
            : step === 2
            ? "Registration Details"
            : formHeading}
        </h3>
      </div>

      {/* Main Form Body */}
      <div className="p-6 sm:p-7">
        {/* ==================== STEP 1: ELIGIBILITY (REFINED UX HIERARCHY) ==================== */}
        {step === 1 && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* 1. Highest Qualification */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Highest Qualification
              </label>
              <div className="relative">
                <select
                  value={qualification}
                  onChange={(e) => {
                    setQualification(e.target.value);
                    if (errors.qualification) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.qualification;
                        return n;
                      });
                    }
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-[#1557D6]/20 bg-slate-50/50 hover:bg-slate-50 focus:bg-white ${
                    errors.qualification
                      ? "border-red-400"
                      : qualification
                      ? "border-[#1557D6] text-slate-700 font-medium"
                      : "border-slate-200 text-slate-400 font-normal"
                  }`}
                >
                  <option value="">Select Qualification</option>
                  <option value="Bachelor's Degree">Bachelor's Degree</option>
                  <option value="Master's Degree">Master's Degree</option>
                  <option value="Graduation Not Completed">Graduation Not Completed</option>
                </select>
                <ChevronDown size={16} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              </div>
              {errors.qualification && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.qualification}</p>
              )}
            </div>

            {/* 2. Age (Type restricted to 21–35) */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Age
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={2}
                  value={age}
                  onChange={handleAgeChange}
                  placeholder="Enter age (21–35)"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#1557D6]/20 bg-slate-50/50 hover:bg-slate-50 focus:bg-white ${
                    errors.age
                      ? "border-red-400"
                      : isAgeValid
                      ? "border-[#1557D6] text-slate-800 font-medium"
                      : "border-slate-200 text-slate-700 font-normal"
                  }`}
                />
              </div>
              {errors.age && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.age}</p>
              )}
            </div>

            {/* 3. Work Experience (Clear Hierarchy + Low Opacity for Non-Selected) */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Work Experience
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "Fresher", label: "Fresher" },
                  { id: "Experienced", label: "Experienced" },
                ].map((item) => {
                  const selected = experience === item.id;
                  const isAnotherSelected = experience !== "" && !selected;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setExperience(item.id);
                        if (errors.experience) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.experience;
                            return n;
                          });
                        }
                      }}
                      className={`py-2.5 px-3.5 rounded-xl border text-sm transition-all text-center cursor-pointer active:scale-98 ${
                        selected
                          ? "border-[#1557D6] bg-blue-50/40 text-[#1557D6] font-semibold ring-1 ring-[#1557D6]/25 opacity-100 shadow-2xs"
                          : isAnotherSelected
                          ? "border-slate-200/60 bg-slate-50/30 text-slate-400 font-normal opacity-40 hover:opacity-80 hover:text-slate-600 hover:border-slate-300"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-500 font-normal opacity-85 hover:opacity-100 hover:text-slate-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {errors.experience && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.experience}</p>
              )}
            </div>

            {/* 4. Interested in enrolling? (Clear Hierarchy + Low Opacity for Non-Selected) */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-1.5">
                Interested in enrolling?
              </label>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { id: "Yes, I'm interested", label: "Yes, I'm interested" },
                  { id: "Just exploring", label: "Just exploring" },
                ].map((item) => {
                  const selected = enrollInterest === item.id;
                  const isAnotherSelected = enrollInterest !== "" && !selected;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setEnrollInterest(item.id);
                        if (errors.enrollInterest) {
                          setErrors((prev) => {
                            const n = { ...prev };
                            delete n.enrollInterest;
                            return n;
                          });
                        }
                      }}
                      className={`py-2.5 px-2.5 sm:px-3 rounded-xl border text-xs sm:text-sm transition-all text-center cursor-pointer active:scale-98 ${
                        selected
                          ? "border-[#1557D6] bg-blue-50/40 text-[#1557D6] font-semibold ring-1 ring-[#1557D6]/25 opacity-100 shadow-2xs"
                          : isAnotherSelected
                          ? "border-slate-200/60 bg-slate-50/30 text-slate-400 font-normal opacity-40 hover:opacity-80 hover:text-slate-600 hover:border-slate-300"
                          : "border-slate-200 bg-slate-50/50 hover:bg-slate-50 text-slate-500 font-normal opacity-85 hover:opacity-100 hover:text-slate-700"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
              {errors.enrollInterest && (
                <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.enrollInterest}</p>
              )}
            </div>

            {/* EXACT REQUIRED FALLBACK 1: Graduation incomplete OR "Just exploring" */}
            {isGeneralIneligible && (
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-950 space-y-3 animate-in fade-in duration-200">
                <div className="flex items-start gap-2">
                  <AlertCircle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-[13px] font-normal leading-relaxed text-slate-700">
                    This profile does not match the programme criteria. Connect with Degree Guru's Career Advisor for personalized guidance.
                  </p>
                </div>
                <a
                  href={WA_ADVISOR_LINK}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <WhatsAppCircleIcon className="w-4 h-4 text-white" />
                  Connect with Advisor
                </a>
              </div>
            )}



            {/* Proceed to Step 2 Button */}
            {!isGeneralIneligible && (
              <button
                type="button"
                onClick={handleProceedToStep2}
                disabled={!isStep1Complete}
                className={`w-full py-3 px-5 rounded-xl font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all duration-200 shadow-md ${
                  isStep1Complete
                    ? "bg-gradient-to-r from-[#18B879] via-[#34D399] to-[#F4B942] hover:brightness-105 text-[#061A36] shadow-emerald-500/20 active:scale-98 cursor-pointer"
                    : "bg-slate-100 text-slate-400 cursor-not-allowed border border-slate-200"
                }`}
              >
                <span>PROCEED TO REGISTRATION</span>
                <ArrowRight size={16} />
              </button>
            )}
          </div>
        )}

        {/* ==================== STEP 2: REGISTRATION DETAILS ==================== */}
        {step === 2 && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3 animate-in fade-in duration-300">
            {/* Back Button */}
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setStep(1);
              }}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1557D6] hover:text-[#0c2a54] transition-colors mb-0.5 cursor-pointer"
            >
              <ArrowLeft size={13} /> Back
            </button>

            {/* 1. Full Name */}
            <div>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#1557D6]/20 ${
                  errors.name
                    ? "border-red-400 bg-red-50/20 text-slate-800"
                    : "border-slate-200 bg-slate-50/40 text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal focus:bg-white"
                }`}
              />
              {errors.name && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.name}</p>}
            </div>

            {/* 2. Mobile Number */}
            <div>
              <div className="flex rounded-xl border border-slate-200 overflow-hidden focus-within:ring-1 focus-within:ring-[#1557D6]/20 focus-within:border-[#1557D6] bg-slate-50/40 focus-within:bg-white">
                <span className="px-3.5 flex items-center bg-slate-100/80 border-r border-slate-200 text-xs font-semibold text-slate-600">
                  +91
                </span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  placeholder="Mobile Number"
                  className="w-full px-3.5 py-2.5 text-sm text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal focus:outline-none bg-transparent"
                />
              </div>
              {errors.phone && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.phone}</p>}
            </div>

            {/* 3. Email Address */}
            <div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email Address"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#1557D6]/20 ${
                  errors.email
                    ? "border-red-400 bg-red-50/20 text-slate-800"
                    : "border-slate-200 bg-slate-50/40 text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal focus:bg-white"
                }`}
              />
              {errors.email && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.email}</p>}
            </div>

            {/* 4. Current City */}
            <div>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Current City"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm transition-all focus:outline-none focus:ring-1 focus:ring-[#1557D6]/20 ${
                  errors.city
                    ? "border-red-400 bg-red-50/20 text-slate-800"
                    : "border-slate-200 bg-slate-50/40 text-slate-700 font-medium placeholder:text-slate-400 placeholder:font-normal focus:bg-white"
                }`}
              />
              {errors.city && <p className="text-[11px] text-red-500 mt-1 font-medium">{errors.city}</p>}
            </div>

            {/* 5. Upload Resume Only (Optional) */}
            <div>
              <label className="relative flex items-center justify-between px-3.5 py-2 rounded-xl border border-dashed border-slate-300 hover:border-[#1557D6] bg-slate-50/50 hover:bg-blue-50/30 cursor-pointer transition-all">
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleFileChange}
                  className="sr-only"
                />
                <div className="flex items-center gap-2 min-w-0">
                  <Paperclip size={14} className="text-slate-400 shrink-0" />
                  {resumeFile ? (
                    <span className="text-xs font-semibold text-slate-800 truncate">{resumeFile.name}</span>
                  ) : (
                    <span className="text-xs text-slate-500 font-normal truncate">
                      Upload Resume <span className="text-slate-400">(Optional)</span>
                    </span>
                  )}
                </div>
                {resumeFile ? (
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-1 hover:bg-slate-200 rounded-full text-slate-400 hover:text-slate-700 shrink-0"
                    title="Remove"
                  >
                    <X size={13} />
                  </button>
                ) : (
                  <span className="text-[10px] font-semibold text-[#1557D6] uppercase tracking-wide">
                    BROWSE
                  </span>
                )}
              </label>
              {resumeError && <p className="text-[11px] text-red-500 mt-1">{resumeError}</p>}
            </div>

            {/* Checkbox: Exact requested wording */}
            <div className="pt-0.5">
              <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-50/70 border border-slate-200 hover:bg-slate-100/50 cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={isFeeUnderstood}
                  onChange={(e) => {
                    setIsFeeUnderstood(e.target.checked);
                    if (errors.fee) {
                      setErrors((prev) => {
                        const n = { ...prev };
                        delete n.fee;
                        return n;
                      });
                    }
                  }}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-[#18B879] focus:ring-[#18B879] cursor-pointer shrink-0"
                />
                <span className="text-xs text-slate-600 font-normal leading-relaxed">
                  I understand the ₹500 registration fee applies, and the programme fee is payable only after receiving the job offer.
                </span>
              </label>
              {errors.fee && <p className="text-[11px] text-red-500 mt-1 font-semibold">{errors.fee}</p>}
            </div>

            {errors.form && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{errors.form}</span>
              </div>
            )}

            {/* Submit Registration Button */}
            <button
              type="submit"
              disabled={busy || !isFeeUnderstood}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#18B879] via-[#34D399] to-[#F4B942] hover:brightness-105 disabled:opacity-50 disabled:cursor-not-allowed text-[#061A36] font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer"
            >
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>SENDING OTP…</span>
                </>
              ) : (
                <>
                  <span>SUBMIT REGISTRATION</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}

        {/* ==================== STEP OTP: REAL PHONE VERIFICATION ==================== */}
        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in duration-300">
            <div className="text-center">
              <h4 className="text-lg font-bold text-[#061A36]">Enter OTP</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Sent to <strong className="text-[#061A36]">+91 {phone}</strong>
              </p>
            </div>

            {/* 6 Digit Input Boxes */}
            <div className="flex justify-center gap-2 sm:gap-2.5">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (otpRefs.current[i] = el)}
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => onOtpChange(i, e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Backspace" && !otp[i] && i > 0) {
                      otpRefs.current[i - 1]?.focus();
                    }
                  }}
                  className="w-10 sm:w-11 h-11 sm:h-12 text-center text-lg sm:text-xl font-semibold rounded-xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1557D6] focus:ring-1 focus:ring-[#1557D6]/20 outline-none transition-all"
                />
              ))}
            </div>

            {otpError && (
              <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{otpError}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={busy}
              className="w-full py-3 px-5 rounded-xl bg-gradient-to-r from-[#18B879] via-[#34D399] to-[#F4B942] hover:brightness-105 disabled:opacity-60 text-[#061A36] font-bold text-sm tracking-wide flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 active:scale-98 cursor-pointer"
            >
              {busy ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>VERIFYING…</span>
                </>
              ) : (
                <>
                  <span>CONFIRM & SUBMIT</span>
                  <Check size={15} className="stroke-[2.5]" />
                </>
              )}
            </button>

            {/* Resend Actions */}
            <div className="pt-2 text-xs text-slate-500 border-t border-slate-100 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="text-[#1557D6] font-medium hover:underline cursor-pointer"
              >
                Edit details
              </button>

              <button
                type="button"
                onClick={handleResendVoice}
                disabled={busy}
                className="text-emerald-700 font-semibold hover:underline cursor-pointer"
              >
                Call OTP
              </button>

              {timer > 0 ? (
                <span className="text-slate-400 font-normal">Resend in {timer}s</span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-[#1557D6] font-semibold hover:underline cursor-pointer"
                >
                  Resend SMS
                </button>
              )}
            </div>
          </form>
        )}

        {/* ==================== STEP 3: REGISTRATION CONFIRMED ==================== */}
        {step === 3 && (
          <div className="text-center py-4 space-y-4 animate-in zoom-in-95 duration-300">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={30} className="stroke-[2.5]" />
            </div>

            <div>
              <h4 className="text-xl font-bold text-slate-900 tracking-tight">
                Registration Confirmed!
              </h4>
              <p className="text-xs sm:text-[13px] text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed font-normal">
                Thank you, <strong className="text-slate-900 font-semibold">{fullName}</strong>. Your registration for the
                Bajaj Capital ACWM Programme has been submitted. Our admissions team will contact you within
                24 hours.
              </p>
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="button"
                onClick={downloadProgramGuide}
                className="w-full py-3 px-4 rounded-xl bg-[#061A36] hover:bg-[#0c2a54] text-white font-bold text-xs tracking-wider flex items-center justify-center gap-2 shadow-md transition-colors cursor-pointer"
              >
                <Download size={14} />
                DOWNLOAD PROGRAM GUIDE
              </button>

              <a
                href={WA_ADVISOR_LINK}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 rounded-xl border border-slate-300 hover:bg-slate-50 text-[#061A36] font-semibold text-xs tracking-wider flex items-center justify-center gap-2 transition-colors"
              >
                <WhatsAppCircleIcon className="w-4 h-4" />
                CONNECT WITH ADVISOR
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
