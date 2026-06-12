import { useState, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Building2, Users, Briefcase, Globe, Upload, CheckCircle2, ArrowRight,
  Phone, Mail, User, MapPin, FileText, Star, Shield, Zap, ChevronDown, Loader2
} from "lucide-react";
import { Blobs } from "@/components/Blobs";
import { Reveal } from "@/components/Reveal";
import { submitEmployerJob } from "@/lib/api";
import { toast } from "sonner";

const INDUSTRIES = [
  "Technology & IT", "Finance & Banking", "Healthcare", "Education",
  "Manufacturing", "Retail & E-commerce", "Hospitality & Tourism",
  "Real Estate", "Media & Entertainment", "Consulting",
  "Marketing & Advertising", "HR & Recruitment", "Legal",
  "Construction", "Logistics & Supply Chain", "Other",
];

const WORK_TYPES = [
  { value: "full-time",  label: "Full Time"  },
  { value: "part-time",  label: "Part Time"  },
  { value: "internship", label: "Internship" },
  { value: "remote",     label: "Remote"     },
  { value: "hybrid",     label: "Hybrid"     },
];

const CATEGORIES = [
  "Engineering & Tech", "Sales & Marketing", "Finance & Accounts",
  "HR & Administration", "Operations & Logistics", "Design & Creative",
  "Customer Support", "Legal & Compliance", "Healthcare & Medical",
  "Education & Training", "Research & Development", "Other",
];

const EXPERIENCE_OPTIONS = [
  "Fresher / 0 Years", "1–2 Years", "2–3 Years", "3–5 Years",
  "5–8 Years", "8–10 Years", "10+ Years",
];

const SALARY_OPTIONS = [
  "Not Disclosed", "Up to 2 LPA", "2–4 LPA", "4–6 LPA",
  "6–10 LPA", "10–15 LPA", "15–25 LPA", "25+ LPA",
];

const EMPLOYEE_COUNTS = [
  "1–10", "11–50", "51–200", "201–500", "501–1000", "1000+",
];

const BENEFITS = [
  { icon: FileText,  title: "Free Job Listings",        desc: "Post unlimited jobs at zero cost for businesses of all sizes." },
  { icon: Users,     title: "Skilled Workforce",         desc: "Connect with qualified graduates from India's top universities." },
  { icon: Globe,     title: "Multiple Industries",       desc: "Hire across tech, finance, healthcare, education, and more." },
  { icon: Briefcase, title: "Direct Candidate Reach",   desc: "Job seekers apply directly — no middlemen, no delay." },
  { icon: Zap,       title: "Easy Posting Process",      desc: "Submit in minutes. Our team reviews and goes live within 24 hrs." },
];

type FormState = {
  companyName: string; companyIndustry: string; employeeCount: string;
  companyAddress: string; companyWebsite: string;
  contactName: string; contactPhone: string; contactEmail: string; contactDesignation: string;
  jobTitle: string; jobCategory: string; jobLocation: string; workType: string;
  experienceRequired: string; salaryRange: string; industry: string;
  skillsRequired: string; jobDescription: string; openings: string; applyLink: string;
};

const INITIAL: FormState = {
  companyName: "", companyIndustry: "", employeeCount: "", companyAddress: "", companyWebsite: "",
  contactName: "", contactPhone: "", contactEmail: "", contactDesignation: "",
  jobTitle: "", jobCategory: "", jobLocation: "", workType: "",
  experienceRequired: "", salaryRange: "", industry: "",
  skillsRequired: "", jobDescription: "", openings: "1", applyLink: "",
};

const Employer = () => {
  const [form, setForm] = useState<FormState>(INITIAL);
  const [document, setDocument] = useState<File | null>(null);
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const [phoneError, setPhoneError] = useState<string | null>(null);

  const set = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  const validateIndianMobile = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.length < 10) return { valid: false, message: "Enter a 10-digit mobile number" };
    const last10 = digits.slice(-10);
    if (!/^[6-9]\d{9}$/.test(last10)) return { valid: false, message: "Enter a valid Indian mobile number" };
    return { valid: true, normalized: last10 } as any;
  };

  const onDocument = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "jpg", "jpeg", "png", "doc", "docx"].includes(ext)) {
      toast.error("Document must be PDF, JPG, PNG, DOC or DOCX."); return;
    }
    if (file.size > 5 * 1024 * 1024) { toast.error("Document must be under 5 MB."); return; }
    setDocument(file);
  };

  const scrollToForm = () => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmed) { toast.error("Please confirm the information is valid."); return; }
    if (!document) { toast.error("Please upload a company verification document."); return; }

    // Validate contact details and job description
    const validateName = (n: string) => {
      const v = n.trim();
      if (v.length < 2) return { valid: false, message: "Please enter contact person's full name." };
      if (!/^[\p{L} .'-]{2,}$/u.test(v)) return { valid: false, message: "Contact name contains invalid characters." };
      return { valid: true } as any;
    };

    const isDisposableEmail = (email: string) => {
      const black = ["mailinator.com","10minutemail.com","tempmail.com","yopmail.com","dispostable.com","guerrillamail.com","trashmail.com","maildrop.cc","getnada.com","mailnesia.com"];
      const domain = email.split("@")[1]?.toLowerCase() ?? "";
      return black.some(d => domain === d || domain.endsWith("." + d));
    };

    const validateIndianMobile = (input: string) => {
      const digits = input.replace(/\D/g, "");
      if (digits.length < 10) return { valid: false, message: "Enter a 10-digit mobile number" };
      const last10 = digits.slice(-10);
      if (!/^[6-9]\d{9}$/.test(last10)) return { valid: false, message: "Enter a valid Indian mobile number" };
      return { valid: true, normalized: last10 } as any;
    };

    const isGibberish = (text: string) => {
      const s = (text || "").replace(/[^A-Za-z\s]/g, " ").trim();
      if (s.length < 30) return false;
      const letters = s.replace(/[^A-Za-z]/g, "");
      const vowels = (letters.match(/[aeiou]/gi) || []).length;
      const vowelRatio = letters.length ? vowels / letters.length : 0;
      if (vowelRatio < 0.30) return true;
      const words = s.split(/\s+/).filter(Boolean);
      const noVowelWords = words.filter(w => !/[aeiou]/i.test(w) && w.length > 2).length;
      if (words.length && noVowelWords / words.length > 0.5) return true;
      return false;
    };

    const nameCheck = validateName(form.contactName || "");
    if (!nameCheck.valid) { toast.error(nameCheck.message); return; }
    const phoneCheck = validateIndianMobile(form.contactPhone || "");
    if (!phoneCheck.valid) { toast.error(phoneCheck.message); return; }
    if (!form.contactEmail || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.contactEmail)) { toast.error("Please enter a valid email address."); return; }
    if (isDisposableEmail(form.contactEmail)) { toast.error("Disposable email addresses are not allowed."); return; }
    if (!form.jobDescription || form.jobDescription.trim().length < 20) { toast.error("Please provide a detailed job description."); return; }
    if (isGibberish(form.jobDescription)) { toast.error("Job description looks like gibberish. Please provide a clear description."); return; }

    const data = new FormData();
    (Object.keys(form) as (keyof FormState)[]).forEach(k => data.append(k, form[k]));
    data.append("document", document);

    setSubmitting(true);
    try {
      const res = await submitEmployerJob(data);
      if (res.success) {
        setSubmitted(true);
        toast.success(res.message);
      } else {
        (res.errors ?? [res.message]).forEach(m => toast.error(m));
      }
    } catch {
      toast.error("Could not reach the server. Please check your connection.");
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls = "w-full bg-background/60 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/35";
  const selectCls = `${inputCls} appearance-auto`;
  const labelCls = "block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1.5";

  return (
    <>
      <Helmet>
        <title>Post a Job | Hire Skilled Talent for Free | Degree Guru Jobs</title>
        <meta name="description" content="Post jobs for free on Degree Guru and connect with qualified, skilled candidates across India. Simple, fast, and completely free job posting for businesses of all sizes." />
      </Helmet>

      {/* ── HERO ───────────────────────────────────────────────────────── */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <Blobs />
        <div className="container-dg relative z-10 text-center max-w-4xl mx-auto">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6">
              <Building2 size={14} className="text-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-widest">For Employers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-[52px] font-extrabold leading-[1.1] mb-5">
              Hire Skilled &amp; Qualified Talent{" "}
              <span className="text-gradient">for Your Business</span>
            </h1>
            <p className="text-soft text-lg leading-relaxed max-w-2xl mx-auto mb-8">
              Post jobs for free and connect with qualified candidates across multiple industries.
              Our network is powered by India's top universities.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <button onClick={scrollToForm} className="btn-primary">
                Post a Job — It's Free <ArrowRight size={18} />
              </button>
              <Link to="/jobs/job-seeker" className="btn-outline">Browse Job Seekers</Link>
            </div>
            {/* Trust strip */}
            <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-soft">
              {[
                { icon: Shield, text: "Verified Employers" },
                { icon: Star,   text: "Qualified Talent Pool" },
                { icon: Zap,    text: "24-Hour Review" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-2">
                  <Icon size={15} className="text-primary" /> {text}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── BENEFITS ───────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16 relative">
        <div className="container-dg">
          <Reveal>
            <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-5">
              {BENEFITS.map((b, i) => (
                <div key={b.title} className="glass glass-hover card-accent p-6 rounded-2xl text-center group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary transition-colors duration-300">
                    <b.icon size={20} className="text-primary group-hover:text-primary-foreground transition-colors" />
                  </div>
                  <h3 className="font-bold text-sm mb-2 group-hover:text-primary transition-colors">{b.title}</h3>
                  <p className="text-soft text-xs leading-relaxed">{b.desc}</p>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FORM ───────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-16" ref={formRef}>
        <div className="container-dg max-w-4xl">
          {submitted ? (
            <Reveal>
              <div className="glass card-accent rounded-3xl p-10 md:p-16 text-center">
                <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={44} className="text-green-500" />
                </div>
                <h2 className="text-2xl md:text-3xl font-extrabold mb-3">Job Posting Submitted!</h2>
                <p className="text-soft text-lg max-w-lg mx-auto mb-6">
                  Your job posting is under review. Our team will approve it within 24 hours.
                  You'll receive a confirmation on the email provided.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <button onClick={() => { setForm(INITIAL); setDocument(null); setConfirmed(false); setSubmitted(false); }} className="btn-primary">
                    Post Another Job <ArrowRight size={18} />
                  </button>
                  <Link to="/jobs/job-seeker" className="btn-outline">Browse Listings</Link>
                </div>
              </div>
            </Reveal>
          ) : (
            <form onSubmit={submit}>
              {/* Section header helper */}
              {(({ n, icon: Icon, title, sub }: { n: string; icon: React.ElementType; title: string; sub: string }) => (
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-extrabold text-sm">{n}</div>
                  <div>
                    <div className="flex items-center gap-2 font-bold text-lg"><Icon size={18} className="text-primary" />{title}</div>
                    <div className="text-soft text-sm">{sub}</div>
                  </div>
                </div>
              ))({ n: "", icon: Building2, title: "", sub: "" })}

              {/* ─ SECTION 1: COMPANY DETAILS ─ */}
              <Reveal>
                <div className="glass card-accent rounded-2xl p-6 md:p-8 mb-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/8">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-extrabold text-sm">1</div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-base"><Building2 size={16} className="text-primary" /> Company Details</div>
                      <div className="text-soft text-xs">Tell us about your organisation</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Company Name <span className="text-red-500">*</span></label>
                      <input className={inputCls} value={form.companyName} onChange={set("companyName")} placeholder="Acme Technologies Pvt. Ltd." required />
                    </div>
                    <div>
                      <label className={labelCls}>Company Industry <span className="text-red-500">*</span></label>
                      <select className={selectCls} value={form.companyIndustry} onChange={set("companyIndustry")} required>
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Employee Count</label>
                      <select className={selectCls} value={form.employeeCount} onChange={set("employeeCount")}>
                        <option value="">Select Range</option>
                        {EMPLOYEE_COUNTS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Company Website</label>
                      <input type="url" className={inputCls} value={form.companyWebsite} onChange={set("companyWebsite")} placeholder="https://acme.com" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Company Address</label>
                      <input className={inputCls} value={form.companyAddress} onChange={set("companyAddress")} placeholder="123 Business Park, Gurugram, Haryana" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Company Verification Document <span className="text-red-500">*</span></label>
                      <p className="text-soft text-xs mb-2">Upload GST Certificate, Registration Certificate, MSME, or Incorporation Proof (PDF/JPG/PNG/DOC · max 5 MB)</p>
                      <label className="flex items-center gap-3 cursor-pointer bg-background/60 border border-dashed border-foreground/20 rounded-xl px-4 py-4 hover:border-primary transition-all">
                        <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                          <Upload size={18} className="text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm truncate">
                            {document ? document.name : "Click to upload company document"}
                          </div>
                          <div className="text-xs text-soft">PDF, JPG, PNG, DOC, DOCX · Max 5 MB</div>
                        </div>
                        <input type="file" accept=".pdf,.jpg,.jpeg,.png,.doc,.docx" onChange={onDocument} className="hidden" />
                      </label>
                      {document && (
                        <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
                          <CheckCircle2 size={13} /> {document.name} uploaded
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* ─ SECTION 2: CONTACT PERSON ─ */}
              <Reveal>
                <div className="glass card-accent rounded-2xl p-6 md:p-8 mb-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/8">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-extrabold text-sm">2</div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-base"><User size={16} className="text-primary" /> Contact Person Details</div>
                      <div className="text-soft text-xs">Primary contact for this job posting</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                      <input className={inputCls} value={form.contactName} onChange={set("contactName")} placeholder="Rajesh Kumar" required />
                    </div>
                    <div>
                      <label className={labelCls}>Designation</label>
                      <input className={inputCls} value={form.contactDesignation} onChange={set("contactDesignation")} placeholder="HR Manager" />
                    </div>
                    <div>
                      <label className={labelCls}>Mobile Number <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                        <input
                          type="tel"
                          className={`${inputCls} pl-9`}
                          value={form.contactPhone}
                          onChange={e => {
                            const v = e.target.value;
                            set("contactPhone")(e);
                            const res = validateIndianMobile(v);
                            setPhoneError(res.valid ? null : res.message);
                          }}
                          onBlur={e => {
                            const res = validateIndianMobile(e.target.value);
                            setPhoneError(res.valid ? null : res.message);
                          }}
                          placeholder="+91 98765 43210"
                          required
                        />
                        {phoneError && <div className="text-xs text-red-500 mt-1">{phoneError}</div>}
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                        <input type="email" className={`${inputCls} pl-9`} value={form.contactEmail} onChange={set("contactEmail")} placeholder="hr@acme.com" required />
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* ─ SECTION 3: JOB POSTING DETAILS ─ */}
              <Reveal>
                <div className="glass card-accent rounded-2xl p-6 md:p-8 mb-6">
                  <div className="flex items-center gap-3 mb-6 pb-4 border-b border-foreground/8">
                    <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shrink-0 text-white font-extrabold text-sm">3</div>
                    <div>
                      <div className="flex items-center gap-2 font-bold text-base"><Briefcase size={16} className="text-primary" /> Job Posting Details</div>
                      <div className="text-soft text-xs">Describe the position you're hiring for</div>
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className={labelCls}>Job Title <span className="text-red-500">*</span></label>
                      <input className={inputCls} value={form.jobTitle} onChange={set("jobTitle")} placeholder="Senior Software Engineer" required />
                    </div>
                    <div>
                      <label className={labelCls}>Job Category <span className="text-red-500">*</span></label>
                      <select className={selectCls} value={form.jobCategory} onChange={set("jobCategory")} required>
                        <option value="">Select Category</option>
                        {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Job Location <span className="text-red-500">*</span></label>
                      <div className="relative">
                        <MapPin size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                        <input className={`${inputCls} pl-9`} value={form.jobLocation} onChange={set("jobLocation")} placeholder="Bengaluru, Karnataka" required />
                      </div>
                    </div>
                    <div>
                      <label className={labelCls}>Work Type <span className="text-red-500">*</span></label>
                      <select className={selectCls} value={form.workType} onChange={set("workType")} required>
                        <option value="">Select Work Type</option>
                        {WORK_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Experience Required</label>
                      <select className={selectCls} value={form.experienceRequired} onChange={set("experienceRequired")}>
                        <option value="">Select Experience</option>
                        {EXPERIENCE_OPTIONS.map(e => <option key={e}>{e}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Salary Range</label>
                      <select className={selectCls} value={form.salaryRange} onChange={set("salaryRange")}>
                        <option value="">Select Salary Range</option>
                        {SALARY_OPTIONS.map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Industry</label>
                      <select className={selectCls} value={form.industry} onChange={set("industry")}>
                        <option value="">Select Industry</option>
                        {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className={labelCls}>Number of Openings</label>
                      <input type="number" min="1" max="999" className={inputCls} value={form.openings} onChange={set("openings")} placeholder="1" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Skills Required</label>
                      <input className={inputCls} value={form.skillsRequired} onChange={set("skillsRequired")} placeholder="React, Node.js, SQL, Communication (comma separated)" />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>Job Description <span className="text-red-500">*</span></label>
                      <textarea rows={5} className={`${inputCls} resize-none`} value={form.jobDescription} onChange={set("jobDescription")} placeholder="Describe the role, responsibilities, qualifications, and any other important details..." required />
                    </div>
                    <div className="md:col-span-2">
                      <label className={labelCls}>External Apply Link (Optional)</label>
                      <div className="relative">
                        <Globe size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                        <input type="url" className={`${inputCls} pl-9`} value={form.applyLink} onChange={set("applyLink")} placeholder="https://careers.acme.com/apply/engineer (like Naukri)" />
                      </div>
                      <p className="text-soft text-xs mt-1">If provided, Apply Now will redirect candidates to this URL.</p>
                    </div>
                  </div>
                </div>
              </Reveal>

              {/* ─ SUBMIT ─ */}
              <Reveal>
                <div className="glass rounded-2xl p-6 md:p-8">
                  <label className="flex items-start gap-3 cursor-pointer mb-6">
                    <input
                      type="checkbox"
                      checked={confirmed}
                      onChange={e => setConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 rounded border-foreground/20 accent-primary shrink-0"
                    />
                    <span className="text-sm text-foreground/80 leading-relaxed">
                      I confirm that all information provided is accurate, and this job posting complies with
                      Indian employment laws. I understand that false information may result in removal.
                    </span>
                  </label>
                  <button type="submit" disabled={submitting || !confirmed} className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed">
                    {submitting ? (
                      <><Loader2 size={18} className="animate-spin" /> Submitting…</>
                    ) : (
                      <>Submit Job Posting <ArrowRight size={18} /></>
                    )}
                  </button>
                  <div className="flex flex-wrap justify-center gap-6 mt-4">
                    {["100% Free", "24-hr Review", "Qualified Candidates"].map(t => (
                      <span key={t} className="flex items-center gap-1.5 text-xs text-soft">
                        <CheckCircle2 size={12} className="text-green-500 shrink-0" /> {t}
                      </span>
                    ))}
                  </div>
                </div>
              </Reveal>
            </form>
          )}
        </div>
      </section>
    </>
  );
};

export default Employer;
