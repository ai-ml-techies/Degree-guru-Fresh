import { useState, useId } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { getCourseBySlug, CORE_COURSES } from "@/data/courses";
import { ACTIVE_ONLINE_UNIVERSITIES } from "@/data/universities";
import { 
  GraduationCap, 
  CheckCircle2, 
  Clock, 
  IndianRupee, 
  Sparkles, 
  Building2, 
  ArrowRight, 
  HelpCircle, 
  TrendingUp, 
  BookOpen, 
  Calendar, 
  Laptop, 
  FileCheck, 
  ChevronDown, 
  Send,
  ShieldCheck,
  Briefcase,
  Layers,
  Award
} from "lucide-react";
import { submitLead } from "@/lib/api";

export const CourseDetail = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const course = getCourseBySlug(courseSlug || "");

  const [activeSemTab, setActiveSemTab] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  // Lead form state
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const formNameId = useId();
  const formPhoneId = useId();
  const formEmailId = useId();

  if (!course) {
    return <Navigate to="/courses" replace />;
  }

  // Universities offering this course
  const offeringUnis = ACTIVE_ONLINE_UNIVERSITIES.filter((u) =>
    course.offeringUniversities.some(
      (ou) => ou.toLowerCase().includes(u.shortName.toLowerCase()) || ou.toLowerCase().includes(u.name.toLowerCase())
    )
  );

  // Related courses (all except current)
  const relatedCourses = CORE_COURSES.filter((c) => c.slug !== course.slug).slice(0, 4);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadPhone || !leadName) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        name: leadName,
        phone: leadPhone,
        email: leadEmail || `${leadPhone}@degreeguru.in`,
        program: `${course.fullName} Inquiry`,
        source: `course-page-${course.slug}`,
      });
      setLeadSuccess(true);
    } catch {
      setLeadSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Structured Course & FAQ Schema
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.fullName,
    "description": course.heroDescription,
    "provider": {
      "@type": "Organization",
      "name": "Degree Guru",
      "sameAs": "https://degreeguru.in",
    },
    "hasCourseInstance": {
      "@type": "CourseInstance",
      "courseMode": "Online",
      "duration": course.duration,
    },
  };

  return (
    <>
      <Helmet>
        <title>{course.fullName} - Fees, Eligibility, Universities & Syllabus 2026 | Degree Guru</title>
        <meta name="description" content={course.heroDescription} />
        <link rel="canonical" href={`https://degreeguru.in/${course.slug}/`} />
        <script type="application/ld+json">{JSON.stringify(schemaData)}</script>
      </Helmet>

      {/* 1. HERO SECTION - Seamlessly flows beneath the floating header up to the top ticker */}
      <section className="-mt-[100px] sm:-mt-[114px] md:-mt-[132px] pt-[104px] sm:pt-[118px] md:pt-[132px] pb-14 relative overflow-hidden bg-gradient-to-b from-primary/15 via-primary/5 to-background border-b border-border/60">
        <div className="container-dg">
          <AppBreadcrumb
            items={[
              { label: "Online Courses", href: "/courses" },
              { label: course.fullName }
            ]}
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
                <ShieldCheck size={14} /> 100% UGC-DEB & AICTE Approved Degree
              </div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-normal leading-[1.28] sm:leading-[1.32] md:leading-[1.38]">
                {course.fullName}
              </h1>
              <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
                {course.heroDescription}
              </p>

              {/* Key Quick Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm">
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-0.5">
                    <Clock size={14} /> Duration
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground">{course.duration}</div>
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 text-xs font-bold mb-0.5">
                    <IndianRupee size={14} /> Fees
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground">{course.feesRange}</div>
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm">
                  <div className="flex items-center gap-1.5 text-primary text-xs font-bold mb-0.5">
                    <Sparkles size={14} /> No-Cost EMI
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground">{course.emiFrom}</div>
                </div>
                <div className="p-3 rounded-2xl bg-card border border-border/70 shadow-sm">
                  <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 text-xs font-bold mb-0.5">
                    <TrendingUp size={14} /> Salary Jump
                  </div>
                  <div className="text-xs sm:text-sm font-extrabold text-foreground">{course.roiMetrics.averageSalaryJump}</div>
                </div>
              </div>

              {/* CTAs */}
              <div className="flex flex-wrap gap-3 pt-2">
                <a
                  href="#counseling-lead"
                  className="px-6 py-3 rounded-xl bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center gap-2"
                >
                  <GraduationCap size={16} /> Compare Top Universities <ArrowRight size={14} />
                </a>
                <Link
                  to="/roi-calculator"
                  className="px-5 py-3 rounded-xl bg-card border border-border text-foreground text-sm font-semibold hover:bg-muted transition-colors"
                >
                  Calculate Your ROI
                </Link>
              </div>
            </div>

            {/* Right Quick Lead Card */}
            <div id="counseling-lead" className="lg:col-span-5 bg-card border border-border/80 rounded-3xl p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-border/50">
                <div className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs">
                  DG
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground">Free 1-on-1 Counseling for {course.shortName}</h2>
                  <p className="text-[11px] text-muted-foreground">Compare fees, syllabus & admission criteria</p>
                </div>
              </div>

              {leadSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                  <CheckCircle2 size={18} className="shrink-0" />
                  <span>Your request has been received! Our academic advisor will contact you on WhatsApp shortly.</span>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <div>
                    <label htmlFor={formNameId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Full Name *</label>
                    <input
                      id={formNameId}
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor={formPhoneId} className="block text-[11px] font-semibold text-muted-foreground mb-1">WhatsApp Mobile *</label>
                    <input
                      id={formPhoneId}
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor={formEmailId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Email (Optional)</label>
                    <input
                      id={formEmailId}
                      type="email"
                      placeholder="name@gmail.com"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold transition-all shadow-md shadow-primary/20 flex items-center justify-center gap-1.5"
                  >
                    <Send size={13} /> Get Free University Comparison & Prospectus
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2 & 3. WHAT IS THIS COURSE & WHO SHOULD CHOOSE IT */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl space-y-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Overview</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              What is an {course.fullName}?
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mt-3 leading-relaxed">
              {course.whatIs}
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-card border border-border/70 space-y-4">
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <CheckCircle2 size={18} className="text-primary" /> Who Should Choose an {course.shortName}?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {course.whoShouldChoose.map((point, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-foreground/90">
                  <span className="w-5 h-5 rounded-full bg-primary/15 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    ✓
                  </span>
                  <span>{point}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4, 5, 6, 7. ELIGIBILITY, DURATION, FEES & EMI */}
      <section className="py-14 bg-muted/20 border-b border-border/50">
        <div className="container-dg max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Key Requirements</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Eligibility, Fees & EMI Structure
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-[#6528f7]/10 text-[#6528f7] flex items-center justify-center">
                <FileCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Academic Eligibility</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {course.eligibility}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <IndianRupee size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Fee Range & Financing</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Total program fees range between <strong>{course.feesRange}</strong> depending on university brand and LMS tier.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                <Calendar size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Flexible EMI Options</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Start learning with <strong>{course.emiFrom}</strong> monthly installments. 0% interest financing through partnered banks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 8. SPECIALIZATIONS */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">In-Demand Tracks</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Popular {course.shortName} Specializations
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Pick the domain matching your target industry and salary goals:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {course.specializations.map((spec, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-colors shadow-sm flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold shrink-0">
                  {i + 1}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-foreground">{spec}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9 & 10. UNIVERSITIES OFFERING THIS COURSE & COMPARISON */}
      <section className="py-14 bg-muted/30 border-b border-border/50">
        <div className="container-dg max-w-5xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Accredited Institutions</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                Top Universities Offering {course.shortName}
              </h2>
            </div>
            <Link
              to="/universities/compare"
              className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground hover:bg-muted flex items-center gap-1.5 w-fit shadow-sm"
            >
              Side-by-Side Comparison <ArrowRight size={13} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {offeringUnis.map((uni) => (
              <div key={uni.id} className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                      {uni.mode}
                    </span>
                    <span className="text-[11px] text-muted-foreground font-semibold">
                      {uni.accreditation}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground mt-2">{uni.name}</h3>
                  <p className="text-[11px] text-muted-foreground mt-0.5">Location: {uni.location}</p>
                </div>

                <div className="pt-2 border-t border-border/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-muted-foreground">Semester Fees from</span>
                    <div className="text-xs font-extrabold text-foreground">{uni.feesRange.split(" - ")[0]}</div>
                  </div>
                  <Link
                    to={`/universities/${uni.slug}`}
                    className="px-3 py-1.5 rounded-xl bg-primary/10 hover:bg-primary text-primary hover:text-primary-foreground text-xs font-bold transition-colors"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11, 12, 13. CURRICULUM, LEARNING FORMAT & EXAM INFORMATION */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl space-y-10">
          <div>
            <div className="text-center max-w-2xl mx-auto mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Syllabus Structure</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
                {course.shortName} Course Curriculum
              </h2>
            </div>

            {/* Semester Tabs */}
            <div className="flex justify-center gap-2 mb-6 flex-wrap">
              {course.curriculum.map((sem, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveSemTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSemTab === idx
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {sem.semester}
                </button>
              ))}
            </div>

            {/* Current Semester Subjects */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm">
              <h3 className="text-sm font-bold text-primary mb-3">
                Subjects & Modules — {course.curriculum[activeSemTab]?.semester}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {course.curriculum[activeSemTab]?.subjects.map((sub, i) => (
                  <div key={i} className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/40 text-xs font-medium text-foreground">
                    <span className="w-5 h-5 rounded-md bg-primary/10 text-primary flex items-center justify-center text-[10px] font-bold shrink-0">
                      {i + 1}
                    </span>
                    <span>{sub}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Format & Exam Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Laptop size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Learning Format & LMS</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {course.learningFormat}
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-2">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <FileCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Examination Pattern</h3>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                {course.examinationInfo}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 14, 15, 16, 17, 18. CAREER OPPORTUNITIES, JOB ROLES, SKILLS & ROI */}
      <section className="py-14 bg-muted/20 border-b border-border/50">
        <div className="container-dg max-w-5xl space-y-8">
          <div className="text-center max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Employment Impact
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Career Opportunities & ROI Analysis
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Job Roles */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Briefcase size={16} /> Target Job Roles
              </div>
              <div className="space-y-1.5">
                {course.jobRoles.map((role, idx) => (
                  <div key={idx} className="p-2 rounded-xl bg-muted/40 text-xs font-semibold text-foreground">
                    • {role}
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Gained */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                <Sparkles size={16} /> Key Skills Acquired
              </div>
              <div className="flex flex-wrap gap-1.5">
                {course.skillsGained.map((skill, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary dark:text-purple-300 text-xs font-semibold">
                    ✓ {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* ROI Metrics */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-emerald-500 font-bold text-xs uppercase tracking-wider">
                <TrendingUp size={16} /> Financial ROI
              </div>
              <div className="space-y-3 pt-1">
                <div>
                  <span className="text-[11px] text-muted-foreground">Average Salary Hike</span>
                  <div className="text-xl font-extrabold text-emerald-600 dark:text-emerald-400">
                    {course.roiMetrics.averageSalaryJump}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Estimated Payback Period</span>
                  <div className="text-base font-bold text-foreground">
                    {course.roiMetrics.estimatedPaybackMonths}
                  </div>
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground">Market Salary Potential</span>
                  <div className="text-sm font-semibold text-muted-foreground">
                    {course.roiMetrics.expectedSalaryRange}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center pt-2">
            <Link
              to="/resume-builder"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold transition-all shadow-md"
            >
              <Sparkles size={14} /> Build Your ATS Resume for {course.shortName} Roles
            </Link>
          </div>
        </div>
      </section>

      {/* 19. ADMISSION PROCESS */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Simple Steps</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Admission Process for {course.shortName}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {course.admissionSteps.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-card border border-border/70 text-center space-y-2">
                <span className="w-8 h-8 rounded-full bg-primary text-primary-foreground font-extrabold text-xs flex items-center justify-center mx-auto">
                  {idx + 1}
                </span>
                <h3 className="text-xs sm:text-sm font-bold text-foreground">{step}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 20. FREQUENTLY ASKED QUESTIONS (FAQS) */}
      <section className="py-14 bg-muted/20 border-b border-border/50">
        <div className="container-dg max-w-4xl">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Everything Clarified</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mt-1">
              Frequently Asked Questions: {course.shortName}
            </h2>
          </div>

          <div className="space-y-3">
            {course.faqs.map((faq, idx) => (
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

      {/* 21 & 22. RELATED COURSES & BLOGS */}
      <section className="py-14 border-b border-border/50">
        <div className="container-dg max-w-5xl space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground">Explore Related Online Degrees</h2>
            <Link to="/courses" className="text-xs font-bold text-primary hover:underline">
              View All Degrees →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            {relatedCourses.map((c) => (
              <Link
                key={c.slug}
                to={`/${c.slug}`}
                className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/50 transition-all group flex flex-col justify-between"
              >
                <div>
                  <span className="text-[10px] font-bold text-primary uppercase">{c.duration}</span>
                  <h3 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors mt-1">
                    {c.shortName}
                  </h3>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">{c.fullName}</p>
                </div>
                <div className="text-[11px] text-primary font-bold mt-3 flex items-center gap-1">
                  View Syllabus <ArrowRight size={12} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 24. FINAL STRONG CTA */}
      <section className="py-16 bg-[#6528f7] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#793efc] via-[#6528f7] to-[#4c16ca] opacity-90" />
        <div className="container-dg max-w-3xl space-y-5 relative z-10">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight">
            Ready to Accelerate Your Career with an {course.shortName}?
          </h2>
          <p className="text-sm sm:text-base text-white/85 max-w-xl mx-auto leading-relaxed">
            Get personalized guidance, compare accredited universities, and find the perfect specialization with Degree Guru's free counseling.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <a
              href="#counseling-lead"
              className="px-6 py-3 rounded-full bg-white text-primary font-extrabold text-xs sm:text-sm hover:bg-neutral-100 transition-all shadow-xl"
            >
              Get Free University Recommendations
            </a>
            <a
              href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20want%20to%20know%20more%20about%20Online%20Degrees"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-xs sm:text-sm transition-all shadow-xl flex items-center gap-2"
            >
              Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
export default CourseDetail;
