import { useState, useId } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { 
  ACTIVE_ONLINE_UNIVERSITIES, 
  EXECUTIVE_PARTNERS, 
  INCLUDED_PARTNERS, 
  UniversityData 
} from "@/data/universities";
import { 
  Building2, 
  ShieldCheck, 
  GraduationCap, 
  MapPin, 
  Award, 
  Clock, 
  IndianRupee, 
  CheckCircle2, 
  ArrowRight, 
  FileCheck, 
  HelpCircle,
  Laptop,
  Briefcase,
  ChevronDown,
  Send
} from "lucide-react";
import { submitLead } from "@/lib/api";

export const UniversityDetail = () => {
  const { uniSlug } = useParams<{ uniSlug: string }>();

  const allUnis: UniversityData[] = [
    ...ACTIVE_ONLINE_UNIVERSITIES,
    ...EXECUTIVE_PARTNERS,
    ...INCLUDED_PARTNERS,
  ];

  const uni = allUnis.find((u) => u.slug === uniSlug);

  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Counseling lead form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const formNameId = useId();
  const formPhoneId = useId();

  if (!uni) {
    return <Navigate to="/universities" replace />;
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        name,
        phone,
        email: `${phone}@degreeguru.in`,
        program: `${uni.name} Admission Inquiry`,
        source: `university-${uni.slug}`,
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{uni.name} - Online Degrees, Fees, Approvals & Admissions 2026 | Degree Guru</title>
        <meta name="description" content={uni.overview} />
        <link rel="canonical" href={`https://degreeguru.in/universities/${uni.slug}/`} />
      </Helmet>

      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 via-background to-background py-10 md:py-14 border-b border-border/60">
        <div className="container-dg">
          <AppBreadcrumb
            items={[
              { label: "Universities", href: "/universities" },
              { label: uni.shortName || uni.name }
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold uppercase">
                  {uni.mode}
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center gap-1">
                  <Award size={13} /> {uni.accreditation}
                </span>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin size={12} /> {uni.location}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
                {uni.name}
              </h1>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                {uni.overview}
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
                  <span className="text-[11px] text-muted-foreground font-semibold block">Total Fees Range</span>
                  <span className="text-sm sm:text-base font-black text-foreground mt-0.5 block">{uni.feesRange}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm">
                  <span className="text-[11px] text-muted-foreground font-semibold block">EMI Installments</span>
                  <span className="text-sm sm:text-base font-black text-emerald-600 dark:text-emerald-400 mt-0.5 block">
                    {uni.emiAvailable ? "From ₹3,500/mo" : "Semester Wise"}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-card border border-border/80 shadow-sm col-span-2 sm:col-span-1">
                  <span className="text-[11px] text-muted-foreground font-semibold block">Accreditation</span>
                  <span className="text-sm font-bold text-foreground mt-0.5 block truncate">{uni.accreditation}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#uni-counseling"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs sm:text-sm shadow-md shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  Apply for Admission <ArrowRight size={14} />
                </a>
                <Link
                  to="/universities/compare"
                  className="px-4 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-xs sm:text-sm hover:bg-muted transition-colors"
                >
                  Compare with Other Universities
                </Link>
              </div>
            </div>

            {/* Quick Lead Capture Card */}
            <div id="uni-counseling" className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 sm:p-7 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-border/50">
                <ShieldCheck size={20} className="text-primary" />
                <div>
                  <h2 className="text-sm font-bold text-foreground">Get {uni.shortName} Admission Support</h2>
                  <p className="text-[11px] text-muted-foreground">100% Free counseling & brochure download</p>
                </div>
              </div>

              {submitted ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>Request received! Our counselor will send the fee breakdown directly to WhatsApp.</span>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label htmlFor={formNameId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Your Full Name</label>
                    <input
                      id={formNameId}
                      type="text"
                      required
                      placeholder="e.g. Yash Sharma"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor={formPhoneId} className="block text-[11px] font-semibold text-muted-foreground mb-1">WhatsApp Phone Number</label>
                    <input
                      id={formPhoneId}
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground text-xs font-bold shadow-md hover:bg-primary/90 transition-all flex items-center justify-center gap-1.5"
                  >
                    <Send size={14} /> Send My Free Shortlist & Fees
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Available Online Programs */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Programs Offered</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Popular Online Degrees at {uni.shortName}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {uni.popularPrograms.map((prog, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-card border border-border/70 shadow-sm flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                    <GraduationCap size={16} />
                  </div>
                  <span className="text-xs sm:text-sm font-bold text-foreground">{prog}</span>
                </div>
                <Link
                  to={`/${prog.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
                  className="text-xs text-primary hover:underline font-semibold"
                >
                  Details →
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Examination, LMS & Student Support */}
      <section className="py-14 bg-muted/20 border-b border-border/50">
        <div className="container-dg max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#6528f7]/10 text-[#6528f7] flex items-center justify-center">
                <Laptop size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Digital Learning LMS</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {uni.shortName} provides 24/7 web access to recorded lectures, discussion forums, live weekend webinars, and digital library resources.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <FileCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Online Proctored Exams</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Take semester assessments from your home or office. AI & webcam-proctored examination slots scheduled conveniently over weekends.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Briefcase size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Career Services & Placement</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Dedicated placement assistance, resume masterclasses, mock interviews, and access to virtual recruitment drives.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-4xl space-y-6">
          <div className="text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Frequently Asked Questions</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              FAQs about {uni.name}
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: `Is an online degree from ${uni.shortName} recognized by UGC and government bodies?`,
                a: `Yes. Online degrees offered by ${uni.name} hold valid statutory approval from UGC-DEB and AICTE where applicable, making them legally equivalent to traditional on-campus degrees under UGC regulations.`,
              },
              {
                q: `Can working professionals pursue ${uni.shortName} courses while keeping their full-time jobs?`,
                a: `Absolutely. The program curriculum is specifically formatted with asynchronous recorded lectures, weekend doubt clearing, and flexible self-paced assignment submissions.`,
              },
              {
                q: `What are the financing and EMI options available at ${uni.shortName}?`,
                a: `Students can choose between lump-sum semester fees or 0% interest no-cost EMI installments starting from approximately ₹3,500/month through partnered NBFCs and banks.`,
              },
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl bg-card border border-border/70 overflow-hidden shadow-sm">
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? null : idx)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-foreground hover:text-primary transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 shrink-0 text-muted-foreground ${
                      openFaqIndex === idx ? "rotate-180 text-primary" : ""
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
export default UniversityDetail;
