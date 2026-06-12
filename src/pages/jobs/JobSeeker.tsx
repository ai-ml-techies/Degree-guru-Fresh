import { useState, useEffect, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Search, MapPin, Briefcase, Clock, Building2, Filter,
  X, ChevronDown, Upload, CheckCircle2, ArrowRight, Loader2,
  DollarSign, Users, Sparkles, GraduationCap, Link2,
} from "lucide-react";
import { Blobs } from "@/components/Blobs";
import { Reveal } from "@/components/Reveal";
import { fetchJobListings, registerJobSeeker, applyToJob, type JobPosting } from "@/lib/api";
import { toast } from "sonner";

// ─── Constants ────────────────────────────────────────────────────────────────
const WORK_TYPE_LABELS: Record<string, string> = {
  "full-time": "Full Time", "part-time": "Part Time",
  "internship": "Internship", "remote": "Remote", "hybrid": "Hybrid",
};

const WORK_TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "full-time":  { bg: "#ede9fe", text: "#6c45e0" },
  "part-time":  { bg: "#dbeafe", text: "#2563eb" },
  "internship": { bg: "#fef3c7", text: "#d97706" },
  "remote":     { bg: "#d1fae5", text: "#059669" },
  "hybrid":     { bg: "#fee2e2", text: "#dc2626" },
};

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

const EXPERIENCE_OPTIONS = [
  "Fresher / 0 Years", "1–2 Years", "2–3 Years", "3–5 Years",
  "5–8 Years", "8–10 Years", "10+ Years",
];

const QUALIFICATIONS = [
  "10th Pass", "12th Pass", "Diploma", "Bachelor's Degree",
  "Master's Degree", "MBA", "PhD", "Other",
];

const SEEKER_INDUSTRIES = INDUSTRIES;

// ─── Types ─────────────────────────────────────────────────────────────────
type SeekerProfile = { id: number; name: string; email: string; phone: string };

type SeekerForm = {
  fullName: string; email: string; phone: string; city: string;
  qualification: string; experience: string; preferredIndustry: string;
  skills: string; linkedinUrl: string;
};

const SEEKER_INITIAL: SeekerForm = {
  fullName: "", email: "", phone: "", city: "",
  qualification: "", experience: "", preferredIndustry: "",
  skills: "", linkedinUrl: "",
};

// ─── JobCard ──────────────────────────────────────────────────────────────
const JobCard = ({
  job, onApply, appliedIds,
}: {
  job: JobPosting;
  onApply: (job: JobPosting) => void;
  appliedIds: Set<number>;
}) => {
  const [expanded, setExpanded] = useState(false);
  const colors = WORK_TYPE_COLORS[job.workType] ?? { bg: "#f1f5f9", text: "#64748b" };
  const skills = job.skillsRequired ? job.skillsRequired.split(",").map(s => s.trim()).filter(Boolean) : [];
  const isApplied = appliedIds.has(job.id);

  const daysAgo = (() => {
    const diff = Math.floor((Date.now() - new Date(job.postedAt).getTime()) / 86400000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Yesterday";
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} week${Math.floor(diff / 7) > 1 ? "s" : ""} ago`;
    return new Date(job.postedAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  })();

  return (
    <div className="glass glass-hover card-accent rounded-2xl p-5 sm:p-6 flex flex-col gap-4 group">
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 font-extrabold text-primary text-sm group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            {job.companyName.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-base leading-tight group-hover:text-primary transition-colors">{job.jobTitle}</h3>
            <div className="flex items-center gap-1.5 text-soft text-xs mt-0.5">
              <Building2 size={11} />
              <span>{job.companyName}</span>
              {job.companyIndustry && <><span className="opacity-40">•</span><span>{job.companyIndustry}</span></>}
            </div>
          </div>
        </div>
        <span className="shrink-0 text-[10px] font-bold uppercase tracking-wide px-2.5 py-1 rounded-full"
          style={{ background: colors.bg, color: colors.text }}>
          {WORK_TYPE_LABELS[job.workType] ?? job.workType}
        </span>
      </div>

      {/* Meta row */}
      <div className="flex flex-wrap gap-3 text-xs text-soft">
        {job.jobLocation && (
          <span className="flex items-center gap-1"><MapPin size={11} className="text-primary/70" />{job.jobLocation}</span>
        )}
        {job.experienceRequired && (
          <span className="flex items-center gap-1"><Briefcase size={11} className="text-primary/70" />{job.experienceRequired}</span>
        )}
        {job.salaryRange && (
          <span className="flex items-center gap-1"><DollarSign size={11} className="text-primary/70" />{job.salaryRange}</span>
        )}
        <span className="flex items-center gap-1 ml-auto"><Clock size={11} />{daysAgo}</span>
      </div>

      {/* Skills */}
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.slice(0, 5).map(s => (
            <span key={s} className="bg-primary/8 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full border border-primary/15">{s}</span>
          ))}
          {skills.length > 5 && <span className="text-[10px] text-soft py-0.5">+{skills.length - 5} more</span>}
        </div>
      )}

      {/* Description toggle */}
      {job.jobDescription && (
        <div>
          <button onClick={() => setExpanded(e => !e)} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline">
            {expanded ? "Show less" : "View description"}
            <ChevronDown size={12} className={`transition-transform ${expanded ? "rotate-180" : ""}`} />
          </button>
          {expanded && (
            <p className="text-soft text-xs leading-relaxed mt-2 whitespace-pre-line line-clamp-6">
              {job.jobDescription}
            </p>
          )}
        </div>
      )}

      {/* Footer: openings + apply */}
      <div className="flex items-center justify-between gap-3 mt-auto pt-2 border-t border-foreground/8">
        <span className="text-xs text-soft flex items-center gap-1">
          <Users size={11} /> {job.openings} opening{job.openings > 1 ? "s" : ""}
        </span>
        {isApplied ? (
          <span className="flex items-center gap-1.5 text-green-600 text-xs font-semibold">
            <CheckCircle2 size={14} /> Applied
          </span>
        ) : job.applyLink ? (
          <a href={job.applyLink} target="_blank" rel="noreferrer"
            className="btn-primary text-xs px-4 py-2">
            Apply Now <ArrowRight size={13} />
          </a>
        ) : (
          <button onClick={() => onApply(job)} className="btn-primary text-xs px-4 py-2">
            Apply Now <ArrowRight size={13} />
          </button>
        )}
      </div>
    </div>
  );
};

// ─── Apply / Register Modal ────────────────────────────────────────────────
const ApplyModal = ({
  job, seeker, onClose, onRegistered, onApplied,
}: {
  job: JobPosting;
  seeker: SeekerProfile | null;
  onClose: () => void;
  onRegistered: (s: SeekerProfile) => void;
  onApplied: (jobId: number) => void;
}) => {
  const [form, setForm] = useState<SeekerForm>(SEEKER_INITIAL);
  const [resume, setResume] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [step, setStep] = useState<"register" | "apply" | "done">(seeker ? "apply" : "register");

  const [phoneError, setPhoneError] = useState<string | null>(null);

  const set = (k: keyof SeekerForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }));

  // Validate Indian mobile numbers: allow optional country code (+91, 91, 0) and require 10 digits starting with 6-9
  const validateIndianMobile = (input: string) => {
    const digits = input.replace(/\D/g, "");
    if (digits.length < 10) return { valid: false, message: "Enter a 10-digit mobile number" };
    const last10 = digits.slice(-10);
    if (!/^[6-9]\d{9}$/.test(last10)) return { valid: false, message: "Enter a valid Indian mobile number" };
    return { valid: true, normalized: last10 } as any;
  };

  const onResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!["pdf", "doc", "docx"].includes(ext)) { toast.error("Resume must be PDF, DOC or DOCX."); return; }
    if (file.size > 5 * 1024 * 1024) { toast.error("Resume must be under 5 MB."); return; }
    setResume(file);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName.trim() || !form.email.trim() || !form.phone.trim()) {
      toast.error("Name, email and phone are required."); return;
    }
    const phoneCheck = validateIndianMobile(form.phone);
    if (!phoneCheck.valid) { toast.error(phoneCheck.message); return; }
    // Name validation
    const validateName = (n: string) => {
      const v = n.trim();
      if (v.length < 2) return { valid: false, message: "Please enter your full name." };
      if (!/^[\p{L} .'-]{2,}$/u.test(v)) return { valid: false, message: "Name contains invalid characters." };
      return { valid: true } as any;
    };
    const isDisposableEmail = (email: string) => {
      const black = ["mailinator.com","10minutemail.com","tempmail.com","yopmail.com","dispostable.com","guerrillamail.com","trashmail.com","maildrop.cc","getnada.com","mailnesia.com"];
      const domain = email.split("@")[1]?.toLowerCase() ?? "";
      return black.some(d => domain === d || domain.endsWith("." + d));
    };

    const nameCheck = validateName(form.fullName);
    if (!nameCheck.valid) { toast.error(nameCheck.message); return; }
    if (isDisposableEmail(form.email)) { toast.error("Disposable email addresses are not allowed."); return; }
    const data = new FormData();
    (Object.keys(form) as (keyof SeekerForm)[]).forEach(k => { if (form[k]) data.append(k, form[k]); });
    if (resume) data.append("resume", resume);
    setSubmitting(true);
    try {
      const res = await registerJobSeeker(data);
      if (res.success && res.seekerId) {
        const profile: SeekerProfile = { id: res.seekerId, name: form.fullName, email: form.email, phone: form.phone };
        onRegistered(profile);
        setStep("apply");
        toast.success("Profile created! Now applying…");
      } else {
        (res.errors ?? [res.message]).forEach(m => toast.error(m));
      }
    } catch { toast.error("Connection error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const handleApply = async () => {
    if (!seeker && step !== "apply") return;
    const s = seeker!;
    setSubmitting(true);
    try {
      const res = await applyToJob(job.id, s.id);
      if (res.success) {
        onApplied(job.id);
        setStep("done");
        toast.success("Application submitted successfully!");
      } else {
        toast.error(res.message);
      }
    } catch { toast.error("Connection error. Please try again."); }
    finally { setSubmitting(false); }
  };

  const inputCls = "w-full bg-background/60 border border-foreground/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-foreground/35";
  const selectCls = `${inputCls} appearance-auto`;
  const labelCls = "block text-xs font-semibold uppercase tracking-wider text-foreground/60 mb-1.5";

  return (
    <div className="fixed inset-0 z-[400] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full sm:max-w-2xl max-h-[92vh] overflow-y-auto glass rounded-t-3xl sm:rounded-3xl p-6 sm:p-8 animate-[fade-in-up_0.3s_ease_forwards] z-10">
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-extrabold leading-tight">{step === "done" ? "Application Sent!" : step === "apply" ? "Confirm Application" : "Create Your Profile"}</h2>
            <p className="text-soft text-xs mt-1">Applying for: <span className="font-semibold text-foreground">{job.jobTitle}</span> at <span className="font-semibold">{job.companyName}</span></p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-foreground/10 flex items-center justify-center hover:bg-foreground/20 transition-colors shrink-0">
            <X size={16} />
          </button>
        </div>

        {step === "done" ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={36} className="text-green-500" />
            </div>
            <h3 className="font-extrabold text-xl mb-2">You're Applied!</h3>
            <p className="text-soft text-sm mb-6 max-w-xs mx-auto">The employer will review your profile and reach out if you're shortlisted.</p>
            <button onClick={onClose} className="btn-primary">Browse More Jobs <ArrowRight size={16} /></button>
          </div>
        ) : step === "apply" ? (
          <div>
            <div className="glass rounded-xl p-4 mb-5 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary font-extrabold text-sm shrink-0">
                {job.companyName.substring(0, 2).toUpperCase()}
              </div>
              <div>
                <div className="font-bold text-sm">{job.jobTitle}</div>
                <div className="text-soft text-xs">{job.companyName} · {job.jobLocation}</div>
              </div>
            </div>
            <p className="text-soft text-sm mb-5">
              Hi <span className="font-semibold text-foreground">{seeker?.name}</span>! Your profile is ready.
              Click below to apply for this position.
            </p>
            <button onClick={handleApply} disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Submitting…</> : <>Confirm &amp; Apply <ArrowRight size={16} /></>}
            </button>
            <p className="text-xs text-soft text-center mt-3">Your profile details will be shared with the employer.</p>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="space-y-4">
            <p className="text-soft text-sm -mt-2 mb-4">
              Create your free profile once and apply to any job on Degree Guru Jobs.
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Full Name <span className="text-red-500">*</span></label>
                <input className={inputCls} value={form.fullName} onChange={set("fullName")} placeholder="Your full name" required />
              </div>
              <div>
                <label className={labelCls}>Phone Number <span className="text-red-500">*</span></label>
                <input
                  type="tel"
                  className={inputCls}
                  value={form.phone}
                  onChange={e => {
                    const v = e.target.value;
                    set("phone")(e);
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
              <div>
                <label className={labelCls}>Email Address <span className="text-red-500">*</span></label>
                <input type="email" className={inputCls} value={form.email} onChange={set("email")} placeholder="you@email.com" required />
              </div>
              <div>
                <label className={labelCls}>City</label>
                <input className={inputCls} value={form.city} onChange={set("city")} placeholder="Mumbai" />
              </div>
              <div>
                <label className={labelCls}>Highest Qualification</label>
                <select className={selectCls} value={form.qualification} onChange={set("qualification")}>
                  <option value="">Select Qualification</option>
                  {QUALIFICATIONS.map(q => <option key={q}>{q}</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Experience</label>
                <select className={selectCls} value={form.experience} onChange={set("experience")}>
                  <option value="">Select Experience</option>
                  {EXPERIENCE_OPTIONS.map(e => <option key={e}>{e}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Preferred Industry</label>
                <select className={selectCls} value={form.preferredIndustry} onChange={set("preferredIndustry")}>
                  <option value="">Select Industry</option>
                  {SEEKER_INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Skills</label>
                <input className={inputCls} value={form.skills} onChange={set("skills")} placeholder="React, Python, Excel, Communication (comma separated)" />
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>LinkedIn URL (Optional)</label>
                <div className="relative">
                  <Link2 size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/35" />
                  <input type="url" className={`${inputCls} pl-9`} value={form.linkedinUrl} onChange={set("linkedinUrl")} placeholder="https://linkedin.com/in/yourname" />
                </div>
              </div>
              <div className="sm:col-span-2">
                <label className={labelCls}>Upload Resume (Optional)</label>
                <label className="flex items-center gap-3 cursor-pointer bg-background/60 border border-dashed border-foreground/20 rounded-xl px-4 py-3 hover:border-primary transition-all">
                  <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0">
                    <Upload size={14} className="text-primary" />
                  </div>
                  <div className="flex-1 min-w-0 text-sm truncate">
                    {resume ? resume.name : "Upload your resume (PDF, DOC, DOCX · max 5 MB)"}
                  </div>
                  <input type="file" accept=".pdf,.doc,.docx" onChange={onResume} className="hidden" />
                </label>
              </div>
            </div>
            <button type="submit" disabled={submitting} className="btn-primary w-full disabled:opacity-60">
              {submitting ? <><Loader2 size={16} className="animate-spin" /> Creating Profile…</> : <>Create Profile &amp; Apply <ArrowRight size={16} /></>}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

// ─── Main Page ─────────────────────────────────────────────────────────────
const JobSeeker = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [workTypeFilter, setWorkTypeFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null);
  const [seeker, setSeeker] = useState<SeekerProfile | null>(() => {
    try { return JSON.parse(sessionStorage.getItem("dg_seeker") ?? "null"); }
    catch { return null; }
  });
  const [appliedIds, setAppliedIds] = useState<Set<number>>(() => {
    try { return new Set(JSON.parse(sessionStorage.getItem("dg_applied") ?? "[]")); }
    catch { return new Set(); }
  });
  const searchRef = useRef<HTMLInputElement>(null);

  const loadJobs = async () => {
    setLoading(true);
    try {
      const data = await fetchJobListings({
        q: search || undefined,
        location: locationFilter || undefined,
        work_type: workTypeFilter || undefined,
        industry: industryFilter || undefined,
      });
      setJobs(data);
    } catch { toast.error("Failed to load jobs. Please refresh."); }
    finally { setLoading(false); }
  };

  useEffect(() => { loadJobs(); }, []);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); loadJobs(); };

  const handleApply = (job: JobPosting) => {
    if (seeker) setSelectedJob(job);
    else setSelectedJob(job);
  };

  const onRegistered = (s: SeekerProfile) => {
    setSeeker(s);
    sessionStorage.setItem("dg_seeker", JSON.stringify(s));
  };

  const onApplied = (jobId: number) => {
    const next = new Set([...appliedIds, jobId]);
    setAppliedIds(next);
    sessionStorage.setItem("dg_applied", JSON.stringify([...next]));
  };

  const resetFilters = () => { setLocationFilter(""); setWorkTypeFilter(""); setIndustryFilter(""); setSearch(""); loadJobs(); };

  const hasFilters = search || locationFilter || workTypeFilter || industryFilter;

  return (
    <>
      <Helmet>
        <title>Find Jobs | Browse Open Positions | Degree Guru Jobs</title>
        <meta name="description" content="Browse verified job listings from top companies. Filter by work type, location, industry and more. Apply directly through Degree Guru Jobs." />
      </Helmet>

      {/* ── SEARCH HERO ──────────────────────────────────────────────── */}
      <section className="relative py-12 md:py-20 overflow-hidden">
        <Blobs />
        <div className="container-dg relative z-10 max-w-3xl mx-auto text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-5">
              <GraduationCap size={14} className="text-primary" />
              <span className="text-primary text-xs font-bold uppercase tracking-widest">For Job Seekers</span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-[48px] font-extrabold leading-[1.1] mb-4">
              Find Your <span className="text-gradient">Dream Job</span>
            </h1>
            <p className="text-soft text-base md:text-lg mb-8 max-w-xl mx-auto">
              Browse verified openings from top employers. Apply in seconds with your Degree Guru profile.
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch} className="glass rounded-2xl p-2 flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  ref={searchRef}
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Job title, skill, or keyword…"
                  className="w-full bg-transparent pl-10 pr-4 py-3 text-sm outline-none placeholder:text-foreground/35"
                />
              </div>
              <div className="relative sm:w-48">
                <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40" />
                <input
                  value={locationFilter}
                  onChange={e => setLocationFilter(e.target.value)}
                  placeholder="City or state…"
                  className="w-full bg-transparent pl-9 pr-4 py-3 text-sm outline-none placeholder:text-foreground/35"
                />
              </div>
              <button type="submit" className="btn-primary shrink-0">
                <Search size={15} /> Search
              </button>
            </form>

            {/* Quick filter chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {WORK_TYPES.map(t => (
                <button key={t.value}
                  onClick={() => { setWorkTypeFilter(f => f === t.value ? "" : t.value); }}
                  className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all border ${workTypeFilter === t.value ? "bg-primary text-primary-foreground border-primary" : "border-foreground/15 hover:border-primary/40 hover:text-primary"}`}>
                  {t.label}
                </button>
              ))}
            </div>

            {seeker && (
              <div className="mt-4 text-xs text-soft flex items-center justify-center gap-2">
                <CheckCircle2 size={13} className="text-green-500" />
                Logged in as <span className="font-semibold text-foreground">{seeker.name}</span>
                <button onClick={() => { setSeeker(null); sessionStorage.removeItem("dg_seeker"); }} className="text-primary underline ml-1">Sign out</button>
              </div>
            )}
          </Reveal>
        </div>
      </section>

      {/* ── LISTINGS ─────────────────────────────────────────────────── */}
      <section className="pb-20">
        <div className="container-dg">
          <div className="flex flex-col lg:flex-row gap-6">

            {/* ── Filter sidebar ─────────────────────────────────────── */}
            <aside className="lg:w-64 shrink-0">
              {/* Mobile filter toggle */}
              <button onClick={() => setShowFilters(v => !v)}
                className="lg:hidden w-full flex items-center justify-between gap-2 glass rounded-xl px-4 py-3 text-sm font-semibold mb-3">
                <span className="flex items-center gap-2"><Filter size={15} /> Filters</span>
                <ChevronDown size={15} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
              </button>

              <div className={`space-y-4 ${showFilters ? "block" : "hidden lg:block"}`}>
                <div className="glass rounded-2xl p-5">
                  <h3 className="font-bold text-sm mb-4 flex items-center gap-2">
                    <Filter size={14} className="text-primary" /> Refine Results
                  </h3>

                  {/* Work Type */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2">Work Type</label>
                    <div className="space-y-1.5">
                      {WORK_TYPES.map(t => (
                        <label key={t.value} className="flex items-center gap-2 cursor-pointer">
                          <input type="radio" name="workType" value={t.value}
                            checked={workTypeFilter === t.value}
                            onChange={() => setWorkTypeFilter(workTypeFilter === t.value ? "" : t.value)}
                            className="accent-primary" />
                          <span className="text-sm">{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <hr className="border-foreground/8 my-3" />

                  {/* Industry */}
                  <div className="mb-4">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-foreground/50 mb-2">Industry</label>
                    <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)}
                      className="w-full bg-background/60 border border-foreground/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-primary">
                      <option value="">All Industries</option>
                      {INDUSTRIES.map(i => <option key={i}>{i}</option>)}
                    </select>
                  </div>

                  {hasFilters && (
                    <button onClick={resetFilters} className="text-xs text-primary font-semibold flex items-center gap-1 hover:underline mt-2">
                      <X size={12} /> Clear all filters
                    </button>
                  )}

                  <button onClick={loadJobs} className="btn-primary w-full text-sm mt-3 py-2.5">
                    <Search size={14} /> Apply Filters
                  </button>
                </div>
              </div>
            </aside>

            {/* ── Jobs list ──────────────────────────────────────────── */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-soft">
                  {loading ? "Loading…" : <><span className="font-bold text-foreground">{jobs.length}</span> jobs found</>}
                </div>
                {hasFilters && !loading && (
                  <button onClick={resetFilters} className="text-xs text-primary flex items-center gap-1 hover:underline">
                    <X size={12} /> Clear filters
                  </button>
                )}
              </div>

              {loading ? (
                <div className="grid sm:grid-cols-2 gap-4">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass rounded-2xl p-6 animate-pulse">
                      <div className="flex gap-3 mb-4">
                        <div className="w-11 h-11 rounded-xl bg-foreground/10" />
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-foreground/10 rounded w-3/4" />
                          <div className="h-3 bg-foreground/8 rounded w-1/2" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="h-3 bg-foreground/8 rounded" />
                        <div className="h-3 bg-foreground/8 rounded w-2/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : jobs.length === 0 ? (
                <div className="glass rounded-3xl p-12 md:p-16 text-center">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-5">
                    <Briefcase size={36} className="text-primary" />
                  </div>
                  <h3 className="text-xl font-extrabold mb-2">No Jobs Found</h3>
                  <p className="text-soft text-sm max-w-sm mx-auto mb-6">
                    {hasFilters
                      ? "Try adjusting your filters or broadening your search."
                      : "No approved jobs at the moment. New listings are added daily — check back soon!"}
                  </p>
                  <div className="flex flex-wrap gap-3 justify-center">
                    {hasFilters && (
                      <button onClick={resetFilters} className="btn-primary">Clear Filters</button>
                    )}
                    <Link to="/jobs/employer" className="btn-outline">Post a Job</Link>
                  </div>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 gap-4">
                  {jobs.map(job => (
                    <JobCard key={job.id} job={job} onApply={handleApply} appliedIds={appliedIds} />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Apply Modal ───────────────────────────────────────────────── */}
      {selectedJob && (
        <ApplyModal
          job={selectedJob}
          seeker={seeker}
          onClose={() => setSelectedJob(null)}
          onRegistered={onRegistered}
          onApplied={onApplied}
        />
      )}
    </>
  );
};

export default JobSeeker;
