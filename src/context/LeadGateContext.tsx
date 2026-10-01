import React, { createContext, useContext, useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, X, Mail, KeyRound, Loader2 } from "lucide-react";
import { validateIndianMobile, validateMeaningfulName, validateMeaningfulEmail } from "@/lib/validation";
import { sendEmailOtp, verifyEmailOtp, submitLead } from "@/lib/api";

interface LeadGateContextType {
  isUnlocked: boolean;
  requireContact: (onProceed: () => void, targetTitle?: string, isMandatory?: boolean) => void;
  openGateModal: (targetTitle?: string, isMandatory?: boolean) => void;
}

const LeadGateContext = createContext<LeadGateContextType>({
  isUnlocked: false,
  requireContact: (fn) => fn(),
  openGateModal: () => {},
});

export const useLeadGate = () => useContext(LeadGateContext);

export const LeadGateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return typeof window !== "undefined" && localStorage.getItem("dg_contact_unlocked") === "true";
  });
  const [isOpen, setIsOpen] = useState(false);
  const [targetTitle, setTargetTitle] = useState<string>("Online Degree Tool");
  const [isMandatory, setIsMandatory] = useState<boolean>(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Email verification via OTP states
  const [otpSent, setOtpSent] = useState(false);
  const [otpSending, setOtpSending] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerifying, setOtpVerifying] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState(0);
  const [devOtpHint, setDevOtpHint] = useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // OTP Countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown(otpCountdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const requireContact = (onProceed: () => void, title?: string, mandatory: boolean = false) => {
    if (isUnlocked || (typeof window !== "undefined" && localStorage.getItem("dg_contact_unlocked") === "true")) {
      onProceed();
      return;
    }
    setTargetTitle(title || "Program & University");
    setIsMandatory(mandatory);
    setPendingAction(() => onProceed);
    setPhoneError("");
    setNameError("");
    setEmailError("");
    setIsOpen(true);
  };

  const openGateModal = (title?: string, mandatory: boolean = false) => {
    setTargetTitle(title || "Degree Guru Platform");
    setIsMandatory(mandatory);
    setPendingAction(null);
    setPhoneError("");
    setNameError("");
    setEmailError("");
    setIsOpen(true);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    if (!isMandatory && pendingAction) {
      const action = pendingAction;
      setPendingAction(null);
      action();
    }
  };

  // Live Phone change with Indian mobile number validation
  const handlePhoneChange = (val: string) => {
    const cleanDigits = val.replace(/\D/g, "");
    setPhone(cleanDigits);

    if (cleanDigits.length > 0) {
      const first = cleanDigits[0];
      if (["0", "1", "2", "3", "4", "5"].includes(first)) {
        setPhoneError(`Indian mobile numbers start with 6, 7, 8, or 9 (numbers starting with ${first} are not permitted).`);
        return;
      }
    }
    if (phoneError) setPhoneError("");
  };

  // Live Name change
  const handleNameChange = (val: string) => {
    setName(val);
    if (nameError) setNameError("");
  };

  // Live Email change
  const handleEmailChange = (val: string) => {
    setEmail(val);
    setEmailVerified(false);
    setOtpSent(false);
    setOtp("");
    setDevOtpHint(null);
    if (emailError) setEmailError("");
  };

  // Send OTP to email
  const handleSendEmailOtp = async () => {
    const emailCheck = validateMeaningfulEmail(email, false);
    if (!emailCheck.valid) {
      setEmailError(emailCheck.error || "Please enter a valid email address.");
      return;
    }
    setEmailError("");
    setOtpSending(true);

    try {
      const res = await sendEmailOtp(emailCheck.normalized || email);
      if (res.success) {
        setOtpSent(true);
        setOtpCountdown(45);
        if (res.dev_otp) setDevOtpHint(res.dev_otp);
      } else {
        setEmailError(res.message || "Failed to send verification code.");
      }
    } catch {
      setEmailError("Could not send code. Please try again.");
    } finally {
      setOtpSending(false);
    }
  };

  // Verify OTP
  const handleVerifyEmailOtp = async () => {
    const cleanOtp = otp.trim();
    if (!cleanOtp) {
      setEmailError("Please enter the 6-digit code.");
      return;
    }
    setOtpVerifying(true);
    try {
      const res = await verifyEmailOtp(email, cleanOtp);
      if (res.success) {
        setEmailVerified(true);
        setOtpSent(false);
        setDevOtpHint(null);
        setEmailError("");
      } else {
        setEmailError(res.message || "Invalid or expired verification code.");
      }
    } catch {
      setEmailError("Verification failed. Please try again.");
    } finally {
      setOtpVerifying(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Strict Indian Phone Validation
    const phoneCheck = validateIndianMobile(phone);
    if (!phoneCheck.valid) {
      setPhoneError(phoneCheck.error || "Please enter a valid 10-digit Indian mobile number.");
      return;
    }

    // 2. Strict Meaningful Name Validation (Optional to provide, but if provided MUST be meaningful)
    if (name.trim()) {
      const nameCheck = validateMeaningfulName(name, true);
      if (!nameCheck.valid) {
        setNameError(nameCheck.error || "Please enter a valid, meaningful full name (avoid random characters).");
        return;
      }
    }

    // 3. Strict Meaningful Email Validation & OTP verification (if email provided)
    if (email.trim()) {
      const emailCheck = validateMeaningfulEmail(email, true);
      if (!emailCheck.valid) {
        setEmailError(emailCheck.error || "Please enter a valid, meaningful email address.");
        return;
      }
      if (!emailVerified) {
        setEmailError("Please verify your email with the OTP code first.");
        if (!otpSent) {
          handleSendEmailOtp();
        }
        return;
      }
    }

    setIsSubmitting(true);
    const cleanPhone = phoneCheck.normalized || phone;

    try {
      localStorage.setItem("dg_contact_unlocked", "true");
      localStorage.setItem("dg_lead_phone", cleanPhone);
      if (name.trim()) localStorage.setItem("dg_lead_name", name.trim());
      if (email.trim()) localStorage.setItem("dg_lead_email", email.trim());
      setIsUnlocked(true);

      // Submit lead via standardized API
      await submitLead({
        name: name.trim() || "Student Learner",
        phone: cleanPhone,
        email: email.trim() || undefined,
        program: `${targetTitle} (${isMandatory ? "Mandatory Tool" : "Program Popup"})`,
        source: `lead-gate-${targetTitle.toLowerCase().replace(/[^a-z0-9]/g, "-")}`,
      });
    } catch {
      // Non-blocking fallback
    }

    setTimeout(() => {
      setIsSubmitting(false);
      setIsOpen(false);
      if (pendingAction) {
        const action = pendingAction;
        setPendingAction(null);
        action();
      }
    }, 250);
  };

  return (
    <LeadGateContext.Provider value={{ isUnlocked, requireContact, openGateModal }}>
      {children}

      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            handleDismiss();
          } else {
            setIsOpen(true);
          }
        }}
      >
        <DialogContent className="sm:max-w-[460px] p-0 overflow-hidden bg-card border border-border/80 shadow-2xl rounded-3xl">
          {/* Top Banner Gradient */}
          <div className="bg-gradient-to-r from-[#6528f7] via-[#7c3aed] to-[#551ebd] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            {/* Close 'X' Button for Removable / Non-Mandatory Program Popups */}
            {!isMandatory && (
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-sm z-20 cursor-pointer"
                aria-label="Close popup"
              >
                <X size={18} />
              </button>
            )}

            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/15 backdrop-blur-md mb-3 border border-white/20 shadow-inner">
              <Lock size={22} className="text-white" />
            </div>
            
            <DialogTitle className="text-xl sm:text-2xl font-black text-white tracking-tight leading-tight">
              {isMandatory ? "Unlock Free Tool Access" : "Connect with a Counselor"}
            </DialogTitle>
            <DialogDescription className="text-xs sm:text-sm text-white/85 mt-1 max-w-sm mx-auto leading-relaxed">
              {isMandatory
                ? "Enter your mobile number to unlock our interactive calculators, comparison tools, and eligibility tests."
                : "Get 100% free personalized guidance, university fee breakdowns, and syllabus comparison for " + targetTitle + "."}
            </DialogDescription>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
            {/* Mobile Number Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Mobile Number <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={11} /> 100% Spam-Free
                </span>
              </label>
              <div className={`relative flex rounded-xl border ${phoneError ? "border-red-500/80 ring-1 ring-red-500/20" : "border-border"} bg-background focus-within:ring-2 focus-within:ring-primary/40 overflow-hidden`}>
                <div className="px-3 bg-muted/60 text-xs font-bold text-muted-foreground flex items-center border-r border-border select-none">
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="10-digit mobile number (starts with 6-9)"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-3.5 py-2.5 text-sm font-semibold bg-transparent focus:outline-none placeholder:text-muted-foreground/60"
                />
              </div>
              {phoneError && (
                <p className="text-[11px] text-red-500 font-semibold mt-1 leading-tight">{phoneError}</p>
              )}
            </div>

            {/* Full Name Field */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Your Full Name <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                maxLength={60}
                className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${nameError ? "border-red-500/80 ring-1 ring-red-500/20" : "border-border"} bg-background focus:ring-2 focus:ring-primary/40 focus:outline-none placeholder:text-muted-foreground/60`}
              />
              {nameError && (
                <p className="text-[11px] text-red-500 font-semibold mt-1 leading-tight">{nameError}</p>
              )}
            </div>

            {/* Email Address Field with In-place Verification */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-foreground">
                  Email Address <span className="text-[10px] text-muted-foreground font-normal">(Optional, must verify)</span>
                </label>
                {emailVerified ? (
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                    <CheckCircle2 size={11} className="text-emerald-500" /> Verified ✓
                  </span>
                ) : email.trim().length > 0 ? (
                  <button
                    type="button"
                    onClick={handleSendEmailOtp}
                    disabled={otpSending || otpCountdown > 0}
                    className="text-[11px] font-bold text-primary hover:text-primary/80 disabled:opacity-50 flex items-center gap-1 cursor-pointer"
                  >
                    {otpSending ? (
                      <>
                        <Loader2 size={11} className="animate-spin" /> Sending…
                      </>
                    ) : otpCountdown > 0 ? (
                      `Resend (${otpCountdown}s)`
                    ) : (
                      "Verify via OTP"
                    )}
                  </button>
                ) : null}
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="e.g. rahul.sharma@gmail.com"
                  value={email}
                  onChange={(e) => handleEmailChange(e.target.value)}
                  maxLength={100}
                  className={`w-full px-3.5 py-2.5 text-sm rounded-xl border ${
                    emailError ? "border-red-500/80 ring-1 ring-red-500/20" : emailVerified ? "border-emerald-500/60 bg-emerald-500/5" : "border-border"
                  } bg-background focus:ring-2 focus:ring-primary/40 focus:outline-none placeholder:text-muted-foreground/60`}
                />
              </div>

              {emailError && (
                <p className="text-[11px] text-red-500 font-semibold mt-1 leading-tight">{emailError}</p>
              )}

              {/* OTP Drawer if OTP sent & not yet verified */}
              {otpSent && !emailVerified && (
                <div className="p-2.5 bg-primary/5 border border-primary/20 rounded-xl space-y-1.5 mt-2 animate-in fade-in">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-foreground flex items-center gap-1">
                      <KeyRound size={12} className="text-primary" /> Enter 6-digit OTP sent to email:
                    </span>
                    {devOtpHint && (
                      <span className="text-[9px] font-mono text-muted-foreground bg-muted px-1 py-0.5 rounded">
                        Dev OTP: {devOtpHint}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                      placeholder="6-digit code"
                      className="flex-1 bg-background border border-border focus:border-primary rounded-lg px-2.5 py-1.5 text-center font-mono font-bold tracking-widest text-sm text-foreground outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleVerifyEmailOtp}
                      disabled={otpVerifying || otp.length < 4}
                      className="px-3 py-1.5 bg-primary text-white text-xs font-bold rounded-lg hover:bg-primary/90 disabled:opacity-50 cursor-pointer flex items-center gap-1"
                    >
                      {otpVerifying ? <Loader2 size={11} className="animate-spin" /> : "Verify"}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 rounded-xl bg-primary text-primary-foreground font-extrabold text-sm hover:bg-primary/90 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all flex items-center justify-center gap-2 group cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Verifying...</span>
                ) : (
                  <>
                    <span>Continue to {targetTitle}</span>
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>

              {/* Removable Popup Skip Link for Programs (not mandatory) */}
              {!isMandatory && (
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="w-full py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors text-center cursor-pointer"
                >
                  Skip for now & browse program directly →
                </button>
              )}
            </div>

            <div className="flex items-center justify-center gap-4 text-[10px] text-muted-foreground pt-1">
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-500" /> Free Forever
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-500" /> No Spam Guarantee
              </span>
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 size={11} className="text-emerald-500" /> One-Time Setup
              </span>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </LeadGateContext.Provider>
  );
};
