import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { ShieldCheck, ArrowRight, Lock, CheckCircle2, X } from "lucide-react";

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
  const [phoneError, setPhoneError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // For tools: isMandatory = true (user must submit number)
  // For programs / courses: isMandatory = false (removable popup, can skip or close)
  const requireContact = (onProceed: () => void, title?: string, mandatory: boolean = false) => {
    if (isUnlocked || (typeof window !== "undefined" && localStorage.getItem("dg_contact_unlocked") === "true")) {
      onProceed();
      return;
    }
    setTargetTitle(title || "Program & University");
    setIsMandatory(mandatory);
    setPendingAction(() => onProceed);
    setPhoneError("");
    setIsOpen(true);
  };

  const openGateModal = (title?: string, mandatory: boolean = false) => {
    setTargetTitle(title || "Degree Guru Platform");
    setIsMandatory(mandatory);
    setPendingAction(null);
    setPhoneError("");
    setIsOpen(true);
  };

  const handleDismiss = () => {
    setIsOpen(false);
    if (!isMandatory && pendingAction) {
      // For programs / non-mandatory modals, user dismisses and still proceeds freely!
      const action = pendingAction;
      setPendingAction(null);
      action();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPhone = phone.replace(/\D/g, "");
    if (cleanPhone.length !== 10) {
      setPhoneError("Please enter a valid 10-digit mobile number");
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem("dg_contact_unlocked", "true");
      localStorage.setItem("dg_lead_phone", cleanPhone);
      if (name) localStorage.setItem("dg_lead_name", name);
      setIsUnlocked(true);

      // Async post lead
      fetch("http://localhost:8000/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: cleanPhone,
          name: name || "Student Learner",
          source: `${targetTitle} (${isMandatory ? "Mandatory Tool" : "Program Popup"})`,
        }),
      }).catch(() => {
        // silent fail
      });
    } catch {
      // fallback
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
        <DialogContent className="sm:max-w-[440px] p-0 overflow-hidden bg-card border border-border/80 shadow-2xl rounded-3xl">
          {/* Top Banner Gradient */}
          <div className="bg-gradient-to-r from-[#6528f7] via-[#7c3aed] to-[#551ebd] p-6 text-white text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            {/* Close 'X' Button for Removable / Non-Mandatory Program Popups */}
            {!isMandatory && (
              <button
                type="button"
                onClick={handleDismiss}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-sm z-20"
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
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground flex items-center justify-between">
                <span>Mobile Number <span className="text-red-500">*</span></span>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <ShieldCheck size={11} /> 100% Spam-Free
                </span>
              </label>
              <div className="relative flex rounded-xl border border-border bg-background focus-within:ring-2 focus-within:ring-primary/40 overflow-hidden">
                <div className="px-3 bg-muted/60 text-xs font-bold text-muted-foreground flex items-center border-r border-border select-none">
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value.replace(/\D/g, ""));
                    if (phoneError) setPhoneError("");
                  }}
                  autoFocus
                  required
                  className="w-full px-3.5 py-3 text-sm font-semibold bg-transparent focus:outline-none placeholder:text-muted-foreground/60"
                />
              </div>
              {phoneError && (
                <p className="text-[11px] text-red-500 font-semibold">{phoneError}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-foreground">
                Your Full Name <span className="text-[10px] text-muted-foreground font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Rahul Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3.5 py-3 text-sm rounded-xl border border-border bg-background focus:ring-2 focus:ring-primary/40 focus:outline-none placeholder:text-muted-foreground/60"
              />
            </div>

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
                  className="w-full py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors text-center cursor-pointer"
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
