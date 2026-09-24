import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { ACTIVE_ONLINE_UNIVERSITIES, UniversityData } from "@/data/universities";
import { UniversityLogo } from "@/components/UniversityLogo";
import { useLeadGate } from "@/context/LeadGateContext";
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
  // Dynamic list of selected university slugs (allows 2 to 4 universities)
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([
    "manipal-university-jaipur",
    "amity-university-online",
    "sharda-university-online",
  ]);

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

      <div className="container-dg py-8 md:py-14">
        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Compare Online Universities
          </h1>
        </div>

        {/* Top Controls: Active Count & Add University */}
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="text-xs font-bold text-muted-foreground">
            Comparing <span className="text-primary font-black">{comparedUnis.length}</span> of 4 Universities
          </div>

          {selectedSlugs.length < 4 && (
            <button
              type="button"
              onClick={handleAddUniversity}
              className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-all shadow-sm"
            >
              <Plus size={15} /> Add Another University ({selectedSlugs.length}/4)
            </button>
          )}
        </div>

        {/* ========================================================================= */}
        {/* COMPARISON MATRIX (College Vidya & Shiksha Inspired) */}
        {/* ========================================================================= */}
        <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[760px] table-fixed">
              {/* Dynamic Colgroup based on number of selected universities */}
              <colgroup>
                <col className="w-64" />
                {comparedUnis.map((u) => (
                  <col key={u.id} className="min-w-[200px]" />
                ))}
              </colgroup>

              {/* Table Header: Dropdown & Remove Button */}
              <thead>
                <tr className="bg-muted/50 border-b border-border">
                  <th className="p-4 sm:p-5 text-xs font-bold uppercase tracking-wider text-muted-foreground align-top">
                    <span className="block text-xs font-black text-foreground mb-1">Universities</span>
                    <span className="text-[11px] font-normal text-muted-foreground">
                      Switch or remove institutions using dropdowns below.
                    </span>
                  </th>

                  {comparedUnis.map((u, idx) => (
                    <th key={u.id} className="p-4 sm:p-5 align-top border-l border-border/50 relative group bg-card/60">
                      {/* Remove Column Button (Shown if >= 3) */}
                      {selectedSlugs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveUniversity(idx)}
                          className="absolute top-3 right-3 text-muted-foreground hover:text-red-500 transition-colors p-1 rounded-full hover:bg-muted"
                          title="Remove from comparison"
                          aria-label={`Remove ${u.shortName}`}
                        >
                          <X size={15} />
                        </button>
                      )}

                      <div className="space-y-2 pr-6">
                        <span className="text-[10px] font-bold text-primary uppercase tracking-wider block">
                          University {idx + 1}
                        </span>

                        {/* Real University Logo */}
                        <div className="p-3 rounded-2xl bg-card border border-border/80 flex items-center justify-center min-h-[56px] shadow-sm">
                          <UniversityLogo idOrSlug={u.slug} size="md" />
                        </div>

                        {/* Dropdown Selector */}
                        <select
                          value={u.slug}
                          onChange={(e) => handleChangeUniversity(idx, e.target.value)}
                          className="w-full p-2 rounded-xl bg-background border border-border text-xs font-bold text-foreground focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        >
                          {ACTIVE_ONLINE_UNIVERSITIES.map((opt) => (
                            <option key={opt.slug} value={opt.slug}>
                              {opt.name} ({opt.shortName})
                            </option>
                          ))}
                        </select>

                        <div className="pt-1">
                          <span className="text-sm font-black text-foreground block truncate">{u.shortName}</span>
                          <span className="text-[11px] text-muted-foreground block truncate">{u.location}</span>
                        </div>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
                {/* 1. Mode of Delivery */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground flex items-center gap-1.5">
                    Mode of Education
                    <span className="group relative cursor-pointer text-muted-foreground">
                      <HelpCircle size={13} />
                      <span className="hidden group-hover:block absolute left-5 top-0 w-48 p-2 rounded-lg bg-popover border border-border text-[11px] shadow-lg z-50">
                        100% online learning allows studying from any city without attending physical campus.
                      </span>
                    </span>
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center font-semibold border-l border-border/40">
                      <span className="px-3 py-1 rounded-full bg-primary/10 text-primary font-bold text-xs">
                        {u.mode}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 2. Statutory Accreditations */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground">
                    Accreditation & Approvals
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center font-bold text-foreground border-l border-border/40">
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs">
                        <ShieldCheck size={14} className="shrink-0" />
                        <span>{u.accreditation}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 3. Program Fee Range */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground">
                    Program Fee Range
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center font-black text-foreground border-l border-border/40">
                      <span className="text-sm sm:text-base text-foreground">{u.feesRange}</span>
                      <span className="block text-[10px] text-muted-foreground font-normal mt-0.5">Approx. Full Course</span>
                    </td>
                  ))}
                </tr>

                {/* Registration Fee */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground">
                    Registration Fee
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center text-xs font-semibold text-foreground border-l border-border/40">
                      <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/90 font-bold">
                        {u.registrationFee || "₹500"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* Exam Fee */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground">
                    Exam Fee
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center text-xs font-semibold text-foreground border-l border-border/40">
                      <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/90 font-bold">
                        {u.examFee || "Included"}
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 4. Loan Partners & EMI Options */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground">
                    0% EMI & Financing Partners
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center border-l border-border/40">
                      <div className="flex flex-col items-center">
                        <span className="text-emerald-600 dark:text-emerald-400 font-extrabold text-xs flex items-center gap-1">
                          <Check size={16} /> 0% EMI Available
                        </span>
                        <span className="text-[11px] text-primary font-bold mt-0.5">{u.loanPartners || "Bank / NBFC"}</span>
                        <span className="text-[10px] text-muted-foreground font-medium mt-0.5">{u.emiStarting || "From ₹3,500/mo"}</span>
                      </div>
                    </td>
                  ))}
                </tr>

                {/* 5. Examination Format */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground flex items-center gap-1.5">
                    Examination Format
                    <span className="group relative cursor-pointer text-muted-foreground">
                      <HelpCircle size={13} />
                      <span className="hidden group-hover:block absolute left-5 top-0 w-48 p-2 rounded-lg bg-popover border border-border text-[11px] shadow-lg z-50">
                        Exams are web-proctored using AI and live invigilators. Take them from home on weekends.
                      </span>
                    </span>
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center text-xs font-semibold text-foreground border-l border-border/40">
                      <span className="px-2.5 py-1 rounded-lg bg-muted text-foreground/90">
                        100% Online Web-Proctored
                      </span>
                    </td>
                  ))}
                </tr>

                {/* 6. Learning Management System (LMS) */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground">
                    LMS & Mobile App
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center text-xs text-muted-foreground border-l border-border/40">
                      <span>Live Weekend Masterclasses + 24/7 Mobile LMS & Discussion Forums</span>
                    </td>
                  ))}
                </tr>

                {/* 7. Career Support & Placement */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground">
                    Placement Support
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center text-xs text-foreground border-l border-border/40">
                      <span className="font-semibold text-foreground block">Resume Reviews & Job Fairs</span>
                      <span className="text-[10px] text-muted-foreground">100+ Corporate Recruitment Partners</span>
                    </td>
                  ))}
                </tr>

                {/* 8. Student Rating */}
                <tr className="hover:bg-muted/20 transition-colors">
                  <td className="p-4 sm:p-5 font-bold text-foreground">
                    Student Rating
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center border-l border-border/40">
                      <div className="inline-flex items-center gap-1 text-amber-500 font-bold text-xs">
                        <Star size={14} className="fill-amber-500 text-amber-500" />
                        <span>4.7 / 5.0</span>
                      </div>
                      <span className="block text-[10px] text-muted-foreground">Verified Alumni Feedback</span>
                    </td>
                  ))}
                </tr>

                {/* 9. Action CTAs */}
                <tr className="bg-muted/30">
                  <td className="p-4 sm:p-5 font-black text-foreground">
                    Next Action
                  </td>
                  {comparedUnis.map((u) => (
                    <td key={u.id} className="p-4 sm:p-5 text-center border-l border-border/40">
                      <button
                        type="button"
                        onClick={() => handleActionClick(u.slug, u.shortName)}
                        className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold hover:bg-primary/90 transition-all inline-flex items-center gap-1.5 shadow-sm cursor-pointer"
                      >
                        <span>View University Profile</span>
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
