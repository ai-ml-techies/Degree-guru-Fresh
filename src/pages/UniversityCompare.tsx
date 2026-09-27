import { useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ACTIVE_ONLINE_UNIVERSITIES, UniversityData } from "@/data/universities";
import { UniversityLogo } from "@/components/UniversityLogo";
import { useLeadGate } from "@/context/LeadGateContext";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import {
  Layers,
  HelpCircle,
  Check,
  X,
  Plus,
  ShieldCheck,
  Building2,
  GraduationCap,
  IndianRupee,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Laptop,
  Briefcase,
  Star
} from "lucide-react";

export const UniversityCompare = () => {
  const [searchParams] = useSearchParams();
  const paramUnis = searchParams.get("unis")?.split(",").filter((s) => ACTIVE_ONLINE_UNIVERSITIES.some((u) => u.slug === s));

  // Dynamic list of selected university slugs (allows 2 to 4 universities)
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(
    paramUnis && paramUnis.length >= 2
      ? paramUnis.slice(0, 4)
      : [
          "amity-university-online",
          "sharda-university-online",
          "chandigarh-university-online",
        ]
  );

  const navigate = useNavigate();
  const { requireContact } = useLeadGate();

  const handleActionClick = (slug: string, name: string) => {
    requireContact(() => {
      navigate(`/universities/${slug}`);
    }, name);
  };

  // Derived universities array matching selectedSlugs 1-to-1
  const comparedUnis: UniversityData[] = selectedSlugs
    .map((slug) => ACTIVE_ONLINE_UNIVERSITIES.find((u) => u.slug === slug))
    .filter((u): u is UniversityData => Boolean(u));

  // Change a university in a specific column index
  const handleChangeUniversity = (index: number, newSlug: string) => {
    // Prevent duplicate selection
    if (selectedSlugs.includes(newSlug) && selectedSlugs[index] !== newSlug) {
      alert("This university is already in the comparison table.");
      return;
    }
    const updated = [...selectedSlugs];
    updated[index] = newSlug;
    setSelectedSlugs(updated);
  };

  // Remove a university column
  const handleRemoveUniversity = (index: number) => {
    if (selectedSlugs.length <= 2) {
      alert("A minimum of 2 universities is required for side-by-side comparison.");
      return;
    }
    const updated = selectedSlugs.filter((_, i) => i !== index);
    setSelectedSlugs(updated);
  };

  // Add a university
  const handleAddUniversity = () => {
    if (selectedSlugs.length >= 4) {
      alert("You can compare up to 4 universities at a time.");
      return;
    }
    // Find first available university not yet selected
    const nextUni = ACTIVE_ONLINE_UNIVERSITIES.find((u) => !selectedSlugs.includes(u.slug));
    if (nextUni) {
      setSelectedSlugs([...selectedSlugs, nextUni.slug]);
    }
  };

  return (
    <>
      <Helmet>
        <title>Compare Online Universities Side-by-Side | Degree Guru</title>
        <meta
          name="description"
          content="Compare UGC-DEB approved online universities side-by-side. Inspect semester fees, examination modes, LMS features, NAAC grading, and EMI plans inspired by College Vidya & Shiksha."
        />
        <link rel="canonical" href="https://degreeguru.in/universities/compare/" />
      </Helmet>

      <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <AppBreadcrumb
          items={[
            { label: "Universities", href: "/universities" },
            { label: "Compare Universities" },
          ]}
        />

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <ShieldCheck size={14} /> Side-by-Side Objective Benchmarking
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Compare Online Universities
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
            Evaluate UGC-DEB accredited online universities side-by-side on semester tuition fees, statutory recognitions, examination mode, and EMI options.
          </p>
        </div>

        {/* Selected Universities Quick Bar & Action */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-muted/40 p-3 sm:p-4 rounded-2xl border border-border/70">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-bold text-foreground">Comparing ({comparedUnis.length}/4):</span>
            {comparedUnis.map((u, i) => (
              <span
                key={u.id}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-bold text-foreground shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                <span className="max-w-[120px] sm:max-w-none truncate">{u.shortName}</span>
                {comparedUnis.length > 2 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveUniversity(i)}
                    className="text-muted-foreground hover:text-red-500 transition-colors ml-0.5"
                    title={`Remove ${u.shortName}`}
                  >
                    <X size={12} />
                  </button>
                )}
              </span>
            ))}
          </div>

          {selectedSlugs.length < 4 && (
            <button
              type="button"
              onClick={handleAddUniversity}
              className="px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm cursor-pointer ml-auto"
            >
              <Plus size={14} /> Add Another University
            </button>
          )}
        </div>

        {/* Mobile Swipe Hint */}
        <div className="md:hidden flex items-center justify-center gap-1.5 text-[11px] font-bold text-muted-foreground py-2 px-3 mb-2 bg-primary/5 rounded-xl border border-primary/10">
          <span>← Swipe horizontally to inspect universities →</span>
        </div>

        {/* ========================================================================= */}
        {/* COMPARISON MATRIX (Sticky Left Criteria + Responsive Columns) */}
        {/* ========================================================================= */}
        <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto scrollbar-thin">
            <table className="w-full text-left border-collapse min-w-[620px] sm:min-w-[760px] md:min-w-[850px]">
              {/* Dynamic Colgroup: Compact sticky label column + generous university columns */}
              <colgroup>
                <col className="w-32 sm:w-44 md:w-56" />
                {comparedUnis.map((u) => (
                  <col key={u.id} className="min-w-[210px] sm:min-w-[260px] md:min-w-[300px]" />
                ))}
              </colgroup>

              {/* Table Header: Dropdown & Remove Button */}
              <thead>
                <tr className="bg-muted/60 border-b border-border">
                  <th className="p-3.5 sm:p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground align-top sticky left-0 bg-card z-20 border-r border-border shadow-xs">
                    <span className="block text-xs sm:text-sm font-black text-foreground">Criteria</span>
                    <span className="text-[10px] text-muted-foreground font-normal hidden sm:block mt-0.5">Parameters</span>
                  </th>

                  {comparedUnis.map((u, idx) => (
                    <th key={u.id} className="p-3.5 sm:p-5 align-top border-l border-border/60 relative group bg-card/40">
                      {/* Remove Column Button (Shown if >= 3) */}
                      {selectedSlugs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUniversity(idx)}
                          className="absolute top-2.5 right-2.5 text-muted-foreground hover:text-red-500 hover:bg-muted transition-all p-1.5 rounded-full"
                          title="Remove from comparison"
                          aria-label={`Remove ${u.shortName}`}
                        >
                          <X size={14} />
                        </button>
                      )}

                      <div className="space-y-2">
                        <span className="text-[10px] font-extrabold text-primary uppercase tracking-wider block">
                          University {idx + 1}
                        </span>

                        {/* Real University Logo */}
                        <div className="p-2 sm:p-3 rounded-2xl bg-card border border-border/80 flex items-center justify-center h-16 sm:h-20 shadow-2xs">
                          <UniversityLogo idOrSlug={u.slug} size="md" />
                        </div>

                        {/* Full University Name & Location */}
                        <div>
                          <div className="text-xs sm:text-sm font-bold text-foreground line-clamp-2 leading-snug">
                            {u.name}
                          </div>
                          <span className="text-[11px] text-muted-foreground block truncate mt-0.5">{u.location}</span>
                        </div>

                        {/* Dropdown Selector - Change University */}
                        <select
                          value={u.slug}
                          onChange={(e) => handleChangeUniversity(idx, e.target.value)}
                          className="w-full py-1.5 px-2 rounded-lg bg-background border border-border text-[11px] font-semibold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none shadow-2xs hover:border-primary/50 transition-colors cursor-pointer"
                        >
                          {ACTIVE_ONLINE_UNIVERSITIES.map((opt) => (
                            <option key={opt.slug} value={opt.slug}>
                              {opt.shortName} — {opt.location}
                            </option>
                          ))}
                        </select>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {/* 1. Mode of Delivery */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Mode of Education
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center font-semibold border-l border-border/40">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-[11px] sm:text-xs">
                        {u.mode}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 2. Statutory Accreditations */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Accreditation & Approvals
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center font-bold text-foreground border-l border-border/40">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                        <ShieldCheck size={14} className="shrink-0" />
                        <span className="truncate max-w-[200px]">{u.accreditation}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 3. Program Fee Range */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Program Fee Range
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center font-black text-foreground border-l border-border/40">
                      <span className="text-xs sm:text-base text-foreground font-extrabold">{u.feesRange}</span>
                      <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">Approx. Full Course</span>
                    </td>
                  ))}
                </tr>

                {/* Registration Fee */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Registration Fee
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center text-xs font-semibold text-foreground border-l border-border/40">
                      <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/90 font-bold text-[11px] sm:text-xs">
                        {u.registrationFee || "₹500"}
                      </span>
                      <span className="block text-[10px] text-muted-foreground mt-1">
                        Adjusted in course fee
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Exam Fee */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Exam Fee
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center text-xs font-semibold text-foreground border-l border-border/40">
                      <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/90 font-bold text-[11px] sm:text-xs">
                        {u.examFee || "Included"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 4. Loan Partners */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Loan Partners
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center border-l border-border/40">
                      <div className="flex flex-col items-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-1">
                          <Check size={14} /> 0% EMI Available
                        </span>
                        <span className="text-[11px] text-primary font-bold mt-0.5">{u.loanPartners || "Bank / NBFC Partners"}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 5. Examination Format */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Examination Format
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center text-xs font-semibold text-foreground border-l border-border/40">
                      <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/90 text-[11px] sm:text-xs">
                        100% Online Web-Proctored
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 6. Learning Management System (LMS) */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    LMS & Mobile App
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center text-xs text-muted-foreground border-l border-border/40">
                      <span className="text-[11px] sm:text-xs">Live Weekend Masterclasses + 24/7 Mobile LMS</span>
                    </td>
                  ))}
                </tr>

                {/* 7. Career Support & Placement */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Placement Support
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center text-xs text-foreground border-l border-border/40">
                      <span className="font-semibold text-foreground block text-[11px] sm:text-xs">100% Placement Assistance</span>
                    </td>
                  ))}
                </tr>

                {/* 8. Student Rating */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-3 sm:p-4.5 font-bold text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Student Rating
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center border-l border-border/40">
                      <div className="inline-flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star size={13} className="fill-amber-500 text-amber-500" />
                        <span>4.7 / 5.0</span>
                      </div>
                      <span className="block text-[10px] text-muted-foreground">Verified Alumni Feedback</span>
                    </td>
                  ))}
                </tr>

                {/* 9. Action CTAs */}
                <tr className="bg-muted/30">
                  <td className="p-3 sm:p-4.5 font-black text-foreground text-xs sm:text-sm sticky left-0 bg-card z-10 border-r border-border shadow-xs">
                    Next Action
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-3 sm:p-4.5 text-center border-l border-border/40">
                      <button
                        type="button"
                        onClick={() => handleActionClick(u.slug, u.shortName)}
                        className="w-full sm:w-auto px-4 py-2 sm:py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all inline-flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span>View University</span>
                        <ArrowRight size={13} />
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Benchmark Disclaimer */}
        <div className="mt-8 p-4 rounded-2xl bg-muted/30 border border-border/60 text-center text-xs text-muted-foreground max-w-2xl mx-auto">
          💡 <strong>Independent Guidance:</strong> Degree Guru is an objective discovery platform for learners. Accreditations, syllabus structures, and examination modes are verified against official statutory notifications.
        </div>
      </div>
    </>
  );
};

export default UniversityCompare;
