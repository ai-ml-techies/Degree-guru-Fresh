import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface Props {
  compact?: boolean;
  buttonLabel?: string;
  onSubmitDone?: () => void;
}

export const CounselingForm = ({ compact = false, buttonLabel = "Get Free Counseling Call", onSubmitDone }: Props) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", dob: "", message: "" });
  const handle = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please share your name and phone number.");
      return;
    }
    toast.success("Thanks! Our counselor will call you within 2 hours.");
    setForm({ name: "", email: "", phone: "", dob: "", message: "" });
    onSubmitDone?.();
  };

  const inputCls =
    "w-full bg-background/60 border border-foreground/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <form onSubmit={submit} className="glass p-8 md:p-10 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Full Name</label>
          <input className={inputCls} value={form.name} onChange={handle("name")} placeholder="Your name" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Phone Number</label>
          <input className={inputCls} value={form.phone} onChange={handle("phone")} placeholder="9876543210" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Email Address</label>
          <input type="email" className={inputCls} value={form.email} onChange={handle("email")} placeholder="you@email.com" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Date of Birth</label>
          <input type="date" className={inputCls} value={form.dob} onChange={handle("dob")} />
        </div>
      </div>
      {!compact && (
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Message</label>
          <textarea
            rows={4}
            className={inputCls}
            value={form.message}
            onChange={handle("message")}
            placeholder="Which online program are you interested in?"
          />
        </div>
      )}
      <button type="submit" className="btn-primary w-full mt-2">
        {buttonLabel} <ArrowRight size={18} />
      </button>
      <p className="text-xs text-soft text-center">
        100% Free. No spam. We reply within 2 hours.
      </p>
    </form>
  );
};
