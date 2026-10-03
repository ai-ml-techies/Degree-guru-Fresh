import React, { createContext, useContext, useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { X, ArrowRight } from "lucide-react";
import { validateIndianMobile, validateMeaningfulName } from "@/lib/validation";
import { submitLead } from "@/lib/api";

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
  const [nameError, setNameError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    setIsOpen(true);
  };

  const openGateModal = (title?: string, mandatory: boolean = false) => {
    setTargetTitle(title || "Degree Guru Platform");
    setIsMandatory(mandatory);
    setPendingAction(null);
    setPhoneError("");
    setNameError("");
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

  const handlePhoneChange = (val: string) => {
    const cleanDigits = val.replace(/\D/g, "");
    setPhone(cleanDigits);

    if (cleanDigits.length > 0) {
      const first = cleanDigits[0];
      if (["0", "1", "2", "3", "4", "5"].includes(first)) {
        setPhoneError(`Indian mobile numbers start with 6, 7, 8, or 9.`);
        return;
      }
    }
    if (phoneError) setPhoneError("");
  };

  const handleNameChange = (val: string) => {
    setName(val);
    if (nameError) setNameError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneError("");
    setNameError("");

    // Validate Phone
    const phoneCheck = validateIndianMobile(phone);
    if (!phoneCheck.valid) {
      setPhoneError(phoneCheck.error || "Please enter a valid 10-digit mobile number.");
      return;
    }

    // Validate Name (if provided)
    if (name.trim()) {
      const nameCheck = validateMeaningfulName(name, true);
      if (!nameCheck.valid) {
        setNameError(nameCheck.error || "Please enter a valid full name.");
        return;
      }
    }

    setIsSubmitting(true);
    const cleanPhone = phoneCheck.normalized || phone;

    try {
      localStorage.setItem("dg_contact_unlocked", "true");
      localStorage.setItem("dg_lead_phone", cleanPhone);
      if (name.trim()) localStorage.setItem("dg_lead_name", name.trim());
      setIsUnlocked(true);

      // Submit lead via standardized API
      await submitLead({
        name: name.trim() || "Student Learner",
        phone: cleanPhone,
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
        <DialogContent className="sm:max-w-[340px] p-0 overflow-hidden bg-card border border-border/80 shadow-2xl rounded-2xl">
          {/* Top Banner */}
          <div className="bg-gradient-to-r from-[#6528f7] via-[#7c3aed] to-[#551ebd] px-5 py-4 text-white text-center relative overflow-hidden">
            <div className="absolute -right-6 -bottom-6 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
            
            {/* Close 'X' Button */}
            <button
              type="button"
              onClick={handleDismiss}
              className="absolute top-3.5 right-3.5 w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors shadow-sm z-20 cursor-pointer"
              aria-label="Close popup"
            >
              <X size={15} />
            </button>

            <DialogTitle className="text-lg font-black text-white tracking-tight leading-tight">
              Connect with a Counselor
            </DialogTitle>
            <DialogDescription className="sr-only">
              Connect with a counselor
            </DialogDescription>
          </div>

          {/* Form Body - Reduced Size: Only Name, Phone, Submit and Skip */}
          <form onSubmit={handleSubmit} className="p-4 sm:p-5 space-y-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Name
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                maxLength={60}
                className={`w-full px-3 py-2 text-sm rounded-lg border ${nameError ? "border-red-500/80 ring-1 ring-red-500/20" : "border-border"} bg-background focus:ring-2 focus:ring-primary/40 focus:outline-none placeholder:text-muted-foreground/60`}
              />
              {nameError && (
                <p className="text-[11px] text-red-500 font-semibold mt-1 leading-tight">{nameError}</p>
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-foreground">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className={`relative flex rounded-lg border ${phoneError ? "border-red-500/80 ring-1 ring-red-500/20" : "border-border"} bg-background focus-within:ring-2 focus-within:ring-primary/40 overflow-hidden`}>
                <div className="px-2.5 bg-muted/60 text-xs font-bold text-muted-foreground flex items-center border-r border-border select-none">
                  +91
                </div>
                <input
                  type="tel"
                  placeholder="10-digit mobile number"
                  maxLength={10}
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  autoFocus
                  required
                  className="w-full px-3 py-2 text-sm font-semibold bg-transparent focus:outline-none placeholder:text-muted-foreground/60"
                />
              </div>
              {phoneError && (
                <p className="text-[11px] text-red-500 font-semibold mt-1 leading-tight">{phoneError}</p>
              )}
            </div>

            <div className="pt-1.5 space-y-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded-lg bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90 shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>

              <button
                type="button"
                onClick={handleDismiss}
                className="w-full py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors text-center cursor-pointer"
              >
                Skip
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </LeadGateContext.Provider>
  );
};
