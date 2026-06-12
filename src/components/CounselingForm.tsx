import { useState } from "react";
import { ArrowRight, CheckCircle2, User, Phone, Mail, Calendar, MessageSquare, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { submitCounselingLead } from "@/lib/api";

interface Props {
  compact?: boolean;
  buttonLabel?: string;
  source?: string;
  onSubmitDone?: () => void;
}

export const CounselingForm = ({ compact = false, buttonLabel = "Get Free Counseling Call", source, onSubmitDone }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", dob: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const handle = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("Please share your name and phone number.");
      return;
    }

    // Basic validations: name and phone
    const validateName = (n: string) => {
      const v = n.trim();
      if (v.length < 2) return { valid: false, message: "Please enter your full name." };
      if (!/^[\p{L} .'-]{2,}$/u.test(v)) return { valid: false, message: "Name contains invalid characters." };
      return { valid: true } as any;
    };

    const validateIndianMobile = (input: string) => {
      const digits = input.replace(/\D/g, "");
      if (digits.length < 10) return { valid: false, message: "Enter a 10-digit mobile number" };
      const last10 = digits.slice(-10);
      if (!/^[6-9]\d{9}$/.test(last10)) return { valid: false, message: "Enter a valid Indian mobile number" };
      return { valid: true, normalized: last10 } as any;
    };

    const nameCheck = validateName(form.name);
    if (!nameCheck.valid) { toast.error(nameCheck.message); return; }
    const phoneCheck = validateIndianMobile(form.phone);
    if (!phoneCheck.valid) { toast.error(phoneCheck.message); return; }

    setSubmitting(true);
    try {
      const result = await submitCounselingLead({
        name:    form.name.trim(),
        phone:   form.phone.trim(),
        email:   form.email.trim() || undefined,
        dob:     form.dob || undefined,
        message: form.message.trim() || undefined,
        source,
      });

      if (result.success) {
        setSubmitted(true);
        toast.success("Thanks! Our counselor will call you within 2 hours.");
        setTimeout(() => {
          setForm({ name: "", email: "", phone: "", dob: "", message: "" });
          setSubmitted(false);
          onSubmitDone?.();
        }, 3500);
      } else {
        const msg = result.errors?.[0] ?? result.message ?? "Submission failed. Please try again.";
        toast.error(msg);
      }
    } catch {
      toast.error("Could not reach the server. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const fieldCls = (field: string) =>
    `w-full bg-background/50 border rounded-xl pl-11 pr-4 py-3.5 text-sm transition-all duration-200 outline-none placeholder:text-foreground/35 ${
      focusedField === field
        ? "border-primary ring-2 ring-primary/20 bg-background/80"
        : "border-foreground/10 hover:border-foreground/20"
    }`;

  const iconCls = "absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35 transition-colors duration-200";
  const iconActiveCls = "absolute left-3.5 top-1/2 -translate-y-1/2 text-primary transition-colors duration-200";

  if (submitted) {
    return (
      <div className="glass p-8 md:p-10 flex flex-col items-center justify-center gap-4 text-center min-h-[320px] animate-[fade-in-up_0.5s_ease_forwards]">
        <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center animate-[pop-in_0.4s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
          <CheckCircle2 size={40} className="text-green-500" />
        </div>
        <h3 className="text-xl font-bold mt-2">You're all set!</h3>
        <p className="text-soft text-sm max-w-xs">
          Our counselor will call you at <span className="font-semibold text-foreground">{form.phone}</span> within 2 hours.
        </p>
        <div className="flex items-center gap-2 text-xs text-soft bg-primary/5 border border-primary/15 rounded-full px-4 py-2 mt-2">
          <Sparkles size={13} className="text-primary" />
          Free guidance, no strings attached
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="glass p-8 md:p-10 space-y-4">
      {/* Trust badge */}
      <div className="flex items-center gap-2 bg-primary/8 border border-primary/15 rounded-full px-4 py-2 w-fit mb-2">
        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
        <span className="text-xs font-semibold text-primary">Counselors available now · Calls back in 2 hrs</span>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60">Full Name *</label>
          <div className="relative">
            <User size={15} className={focusedField === "name" ? iconActiveCls : iconCls} />
            <input
              className={fieldCls("name")}
              value={form.name}
              onChange={handle("name")}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              placeholder="Your full name"
              maxLength={150}
              disabled={submitting}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60">Phone Number *</label>
          <div className="relative">
            <Phone size={15} className={focusedField === "phone" ? iconActiveCls : iconCls} />
            <input
              type="tel"
              className={fieldCls("phone")}
              value={form.phone}
              onChange={handle("phone")}
              onFocus={() => setFocusedField("phone")}
              onBlur={() => setFocusedField(null)}
              placeholder="10-digit mobile number"
              maxLength={15}
              disabled={submitting}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60">Email Address</label>
          <div className="relative">
            <Mail size={15} className={focusedField === "email" ? iconActiveCls : iconCls} />
            <input
              type="email"
              className={fieldCls("email")}
              value={form.email}
              onChange={handle("email")}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              placeholder="you@email.com"
              maxLength={255}
              disabled={submitting}
            />
          </div>
        </div>
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60">Date of Birth</label>
          <div className="relative">
            <Calendar size={15} className={focusedField === "dob" ? iconActiveCls : iconCls} />
            <input
              type="date"
              className={fieldCls("dob")}
              value={form.dob}
              onChange={handle("dob")}
              onFocus={() => setFocusedField("dob")}
              onBlur={() => setFocusedField(null)}
              disabled={submitting}
            />
          </div>
        </div>
      </div>

      {!compact && (
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/60">What are you looking for?</label>
          <div className="relative">
            <MessageSquare size={15} className={`absolute left-3.5 top-4 transition-colors duration-200 ${focusedField === "message" ? "text-primary" : "text-foreground/35"}`} />
            <textarea
              rows={3}
              className={`${fieldCls("message")} pl-11 resize-none`}
              value={form.message}
              onChange={handle("message")}
              onFocus={() => setFocusedField("message")}
              onBlur={() => setFocusedField(null)}
              placeholder="Which program or stream are you interested in?"
              disabled={submitting}
            />
          </div>
        </div>
      )}

      <button type="submit" disabled={submitting} className="btn-primary btn-primary-pulse w-full mt-2 group disabled:opacity-70 disabled:cursor-not-allowed">
        {submitting ? (
          <span className="flex items-center justify-center gap-2">
            <Loader2 size={18} className="animate-spin" /> Sending…
          </span>
        ) : (
          <span className="flex items-center justify-center gap-2">
            {buttonLabel}
            <ArrowRight size={18} className="transition-transform duration-200 group-hover:translate-x-1" />
          </span>
        )}
      </button>

      <div className="flex items-center justify-center gap-6 pt-1">
        {["100% Free", "No Spam", "2-hr Callback"].map((tag) => (
          <span key={tag} className="flex items-center gap-1.5 text-xs text-soft">
            <CheckCircle2 size={12} className="text-green-500 shrink-0" />
            {tag}
          </span>
        ))}
      </div>
    </form>
  );
};
