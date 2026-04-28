import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { Briefcase, FileText, Users, TrendingUp, ArrowRight, Upload } from "lucide-react";
import { toast } from "sonner";
import recruitmentHero from "@/assets/recruitment-hero.jpg";

const perks = [
  { icon: FileText, t: "Resume & Profile Review", d: "We polish your resume and LinkedIn so recruiters actually call back." },
  { icon: Users, t: "Direct Employer Introductions", d: "We connect our learners with hiring partners across India." },
  { icon: Briefcase, t: "Interview Prep & Mock Rounds", d: "Practice with industry mentors before the real interview." },
  { icon: TrendingUp, t: "Salary Negotiation Coaching", d: "Don't leave money on the table. We help you ask right." },
];

const Recruitment = () => (
  <>
    <section className="relative py-20 overflow-hidden">
      <Blobs />
      <div className="container-dg relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="overline mb-3">Career Support</p>
          <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.05] mb-6">
            We Help You Land the Right Job Too
          </h1>
          <p className="text-soft text-lg leading-relaxed">
            A degree opens doors, we help you walk through the right one. From resume reviews to direct employer introductions, our recruitment support turns your online degree into a real career move.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-6 bg-primary/15 rounded-[40px] blur-2xl" />
            <img
              src={recruitmentHero}
              alt="Confident young Indian professional ready for her next role"
              className="relative rounded-[28px] w-full object-cover aspect-[4/3] shadow-2xl"
              loading="eager"
            />
          </div>
        </Reveal>
      </div>
    </section>

    <section className="py-16">
      <div className="container-dg">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08}>
              <div className="glass glass-hover p-8 h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-5">
                  <p.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{p.t}</h3>
                <p className="text-soft text-sm leading-relaxed">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="pb-24">
      <div className="container-dg max-w-2xl">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Register for Recruitment Support</h2>
          <p className="text-soft mb-8">Tell us about yourself. Our team will reach out with the next steps.</p>
          <RecruitmentForm />
        </Reveal>
      </div>
    </section>
  </>
);

const RecruitmentForm = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", experience: "" });
  const [resume, setResume] = useState<File | null>(null);

  const handle = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  const onResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (file) {
      const allowed = [".pdf", ".doc", ".docx"];
      const ok = allowed.some((ext) => file.name.toLowerCase().endsWith(ext));
      if (!ok) {
        toast.error("Please upload a PDF, DOC or DOCX file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Resume must be smaller than 5 MB.");
        return;
      }
    }
    setResume(file);
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.phone) {
      toast.error("Please share your name and phone number.");
      return;
    }
    if (!resume) {
      toast.error("Please attach your updated resume.");
      return;
    }
    toast.success("Thanks! Our recruitment team will reach out within 2 hours.");
    setForm({ name: "", email: "", phone: "", experience: "" });
    setResume(null);
  };

  const inputCls =
    "w-full bg-background/60 border border-foreground/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all";

  return (
    <form onSubmit={submit} className="glass p-8 md:p-10 space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Full Name</label>
          <input className={inputCls} value={form.name} onChange={handle("name")} placeholder="Your name" maxLength={100} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Phone Number</label>
          <input className={inputCls} value={form.phone} onChange={handle("phone")} placeholder="9876543210" maxLength={15} />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Email Address</label>
          <input type="email" className={inputCls} value={form.email} onChange={handle("email")} placeholder="you@email.com" maxLength={255} />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Years of Experience</label>
          <input className={inputCls} value={form.experience} onChange={handle("experience")} placeholder="e.g. Fresher / 2 years" maxLength={50} />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-2 uppercase tracking-wider">Upload Updated Resume</label>
        <label className="flex items-center gap-3 cursor-pointer bg-background/60 border border-dashed border-foreground/20 rounded-xl px-4 py-4 hover:border-primary transition-all">
          <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0">
            <Upload size={18} className="text-primary" />
          </div>
          <div className="text-sm flex-1 min-w-0">
            <div className="font-semibold truncate">
              {resume ? resume.name : "Click to upload your latest resume"}
            </div>
            <div className="text-xs text-soft">PDF, DOC or DOCX. Max 5 MB.</div>
          </div>
          <input
            type="file"
            accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
            onChange={onResume}
            className="hidden"
          />
        </label>
      </div>
      <button type="submit" className="btn-primary w-full mt-2">
        Register for Recruitment Support <ArrowRight size={18} />
      </button>
      <p className="text-xs text-soft text-center">
        Your details stay private. We reply within 2 hours.
      </p>
    </form>
  );
};

export default Recruitment;
