import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  GraduationCap, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  Award, 
  BookOpen, 
  Building2, 
  Compass, 
  Calculator, 
  FileText, 
  HelpCircle, 
  PhoneCall, 
  MessageCircle, 
  Check, 
  ChevronRight, 
  Star, 
  Clock, 
  Search,
  TrendingUp, 
  Target, 
  Layers, 
  ExternalLink, 
  X,
  Scale,
  Users,
  BadgeCheck,
  ChevronDown
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CounselingForm } from "@/components/CounselingForm";
import { UNIVERSITIES } from "@/data/universities";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { useTheme } from "@/components/ThemeProvider";

// ── Types & Data ────────────────────────────────────────────────────────────

interface HeroStageOption {
  id: string;
  label: string;
  badge: string;
}

interface HeroGoalOption {
  id: string;
  label: string;
}

const HERO_STAGES: HeroStageOption[] = [
  { id: "10th", label: "10th Pass", badge: "Schooling / Diploma" },
  { id: "12th", label: "12th Pass", badge: "UG Degree" },
  { id: "ug", label: "Bachelor's Completed", badge: "PG Degree" },
  { id: "working", label: "Working Professional", badge: "Executive / Flexible" },
  { id: "doctorate", label: "Looking for Doctorate / DBA", badge: "Advanced Research" },
];

const HERO_GOALS: HeroGoalOption[] = [
  { id: "growth", label: "Career Growth" },
  { id: "switch", label: "Career Change" },
  { id: "higher", label: "Higher Studies" },
  { id: "first_degree", label: "First Degree" },
  { id: "better_job", label: "Better Job" },
  { id: "not_sure", label: "Not Sure" },
];

const RECOMMENDATION_MAP: Record<string, { degree: string; why: string; courses: string; path: string }> = {
  "10th": {
    degree: "Polytechnic Diploma, Skill Certifications or Senior Secondary (12th)",
    why: "Build strong foundational technical skills or complete your 12th with stream flexibility.",
    courses: "Diploma in Engineering • NIOS 12th • Digital Skills",
    path: "/class-10-12"
  },
  "12th": {
    degree: "Online / Distance Bachelor's Degree (BCA, BBA, B.Com, B.Sc)",
    why: "Earn a UGC-DEB accredited degree with industry-relevant skills without high campus costs.",
    courses: "Online BCA • Online BBA • Online B.Com • B.Sc IT",
    path: "/courses"
  },
  "ug": {
    degree: "Online Master's Degree (MBA, MCA, M.Sc, M.Com)",
    why: "Specialize in high-demand business or technology domains to unlock managerial salaries.",
    courses: "Online MBA • Online MCA • Online M.Sc Data Science • M.Com",
    path: "/courses"
  },
  "working": {
    degree: "Work-Integrated Online MBA or Executive Master's",
    why: "Upgrade qualifications and salary potential with 100% flexible weekend lectures.",
    courses: "Online MBA (Dual Specialization) • Executive MCA • AI Management",
    path: "/courses"
  },
  "doctorate": {
    degree: "Online Doctorate in Business Administration (DBA)",
    why: "Earn the prestigious 'Dr.' title while contributing applied research to business leadership.",
    courses: "Global DBA • Executive Doctorate • Research Fellowships",
    path: "/courses"
  }
};

const STAGE_CARDS = [
  {
    icon: "🎓",
    stage: "After 10th",
    desc: "Explore streams, diplomas and future study paths.",
    cta: "Explore Options →",
    href: "/class-10-12",
    badge: "Foundations & Diplomas"
  },
  {
    icon: "🎓",
    stage: "After 12th",
    desc: "Find the right bachelor's degree based on your interests and career goals.",
    cta: "Explore Bachelor's →",
    href: "/courses",
    badge: "BBA • BCA • B.Com"
  },
  {
    icon: "💼",
    stage: "After Bachelor's",
    desc: "Explore master's degrees, professional programs and career-focused courses.",
    cta: "Explore Master's →",
    href: "/courses",
    badge: "MBA • MCA • M.Sc"
  },
  {
    icon: "📈",
    stage: "Working Professional",
    desc: "Upgrade your skills, earn a degree and grow without leaving your job.",
    cta: "Explore Programs →",
    href: "/courses",
    badge: "Weekend • 100% Flexible"
  },
  {
    icon: "🎓",
    stage: "Doctorate / DBA",
    desc: "Explore advanced business and research-oriented programs.",
    cta: "Explore Doctorate →",
    href: "/courses",
    badge: "Earn 'Dr.' Title"
  },
];

const FIVE_BIG_DEGREE_CATEGORIES = [
  {
    title: "After 10th",
    subtitle: "Find your next academic path",
    programs: ["Polytechnic Diploma", "NIOS 12th Pathway", "Computer Applications", "Vocational Diplomas"],
    color: "from-blue-500/10 to-indigo-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400",
    href: "/class-10-12",
    tag: "Start Strong"
  },
  {
    title: "Bachelor's",
    subtitle: "BBA • BCA • B.Com • BA • B.Sc & more",
    programs: ["Online BCA (Software)", "Online BBA (Marketing/Finance)", "Online B.Com (Accounts)", "Online B.Sc (Computer Science)"],
    color: "from-purple-500/10 to-fuchsia-500/10 border-purple-500/20 text-[#6528f7] dark:text-purple-400",
    href: "/courses",
    tag: "3 Years • UGC Entitled"
  },
  {
    title: "Master's",
    subtitle: "MBA • MCA • M.Com • MA • M.Sc & more",
    programs: ["Online MBA (130+ Specializations)", "Online MCA (Cloud & AI)", "Online M.Sc (Data Science)", "Online M.Com"],
    color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400",
    href: "/courses",
    tag: "High ROI • 2 Years"
  },
  {
    title: "Professional Courses",
    subtitle: "Build skills for today's careers",
    programs: ["Generative AI & Agentic AI", "Data Analytics & BI", "Digital Product Management", "Cloud & Cybersecurity"],
    color: "from-emerald-500/10 to-teal-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400",
    href: "/courses",
    tag: "Job-Ready Skills"
  },
  {
    title: "Doctorate / DBA",
    subtitle: "Take your expertise further",
    programs: ["Doctor of Business Admin (DBA)", "Executive Ph.D. Pathways", "Global Research Fellowships", "Applied Management Dr."],
    color: "from-rose-500/10 to-pink-500/10 border-rose-500/20 text-rose-600 dark:text-rose-400",
    href: "/courses",
    tag: "Terminal Credential"
  }
];

const MATRIX_DATA = [
  { stage: "After 10th", help: "Explore the right academic & career paths", outcome: "Select between Science, Commerce, Arts or High-Employability Diplomas", cta: "Explore 10th Next Steps" },
  { stage: "After 12th", help: "Choose the right bachelor's degree", outcome: "Compare UGC-recognized online & distance degrees with placement assistance", cta: "Find Bachelor's Course" },
  { stage: "After Bachelor's", help: "Find the right master's / professional program", outcome: "Unlock specialized career trajectories with high-growth postgraduate degrees", cta: "Find Master's Course" },
  { stage: "Working Professional", help: "Upgrade with a flexible degree", outcome: "Learn on weekends without pausing your salary or relocation hassles", cta: "Explore Executive Degrees" },
  { stage: "Career Change", help: "Discover new career & education paths", outcome: "Transition from non-tech to tech or operations to leadership with conversion degrees", cta: "Start Career Pivot" },
  { stage: "Doctorate / DBA", help: "Explore advanced programs", outcome: "Gain executive authority and the 'Dr.' title through practical applied research", cta: "Explore DBA Programs" },
];

const STUDENT_JOURNEYS = [
  {
    name: "Rohit Verma",
    location: "Bangalore",
    before: "Working professional in Operations • 3 years experience",
    goal: "Career growth & transition into Product/Strategy leadership",
    explored: "General MBA vs Executive PGDM vs Online Specialized MBA",
    decision: "Online MBA in Systems & Technology — Manipal University Online",
    helped: "Side-by-side course syllabus comparison + unbiased counseling + 0% EMI planning",
    avatar: "RV"
  },
  {
    name: "Pooja Sharma",
    location: "Jaipur",
    before: "12th Pass (Commerce) • Confused between CA, B.Com and BCA",
    goal: "First degree with high practical placement opportunities",
    explored: "Offline local college vs UGC-DEB Online BCA with Cloud Computing",
    decision: "Online BCA with Cloud & Software Development — Amity Online",
    helped: "Career finder match + saving ₹4 Lakhs on hostel/relocation costs",
    avatar: "PS"
  },
  {
    name: "Aditya Kulkarni",
    location: "Pune",
    before: "B.Sc Graduate • Stuck in customer support role",
    goal: "Break into High-Paying Software & Data Analytics",
    explored: "Costly 6-month bootcamps vs Accredited Online MCA",
    decision: "Online MCA with AI & Machine Learning — Chandigarh University Online",
    helped: "Objective fee comparison + verification that degree is valid for MNCs & Govt exams",
    avatar: "AK"
  }
];

const CAREER_GUIDES = [
  { title: "What should I do after 12th Commerce?", tag: "After 12th", readTime: "5 min read", href: "/blog" },
  { title: "MBA vs MCA: Which is better for your career?", tag: "Master's Comparison", readTime: "6 min read", href: "/blog" },
  { title: "What can I do after B.Com?", tag: "Career Discovery", readTime: "4 min read", href: "/blog" },
  { title: "Best degrees for working professionals in India", tag: "Working Pros", readTime: "7 min read", href: "/blog" },
  { title: "Online vs Regular Degree: Is it equally valid?", tag: "UGC Entitlement", readTime: "5 min read", href: "/blog" },
  { title: "How to choose the right MBA specialisation?", tag: "MBA Guide", readTime: "8 min read", href: "/blog" },
  { title: "What is a DBA and who should pursue it?", tag: "Doctorate", readTime: "6 min read", href: "/blog" },
];

const STREAMLINED_FAQS = [
  {
    q: "How do I know which degree is right for me?",
    a: "Degree Guru starts with your current educational qualification, current job role (if any), and what you want to achieve (salary jump, career change, or government exam eligibility). We map these directly to industry-recognized degrees and show you realistic outcomes before you choose."
  },
  {
    q: "Is Degree Guru's counselling free?",
    a: "Yes, 100% free. We never charge students for career guidance, university shortlisting, or admission counseling. There are no hidden fees or paid assessments."
  },
  {
    q: "Can you help me choose a university?",
    a: "Yes. Once you identify the right degree, we help you objectively compare recognized universities on NAAC accreditation, UGC-DEB statutory approvals, semester fees, learning portals, and placement assistance."
  },
  {
    q: "Do you help students after 10th and 12th?",
    a: "Absolutely. We guide 10th students on stream selection and vocational diplomas, and 12th students on choosing the most viable undergraduate degrees (BBA, BCA, B.Com, B.Sc) matching their aptitude."
  },
  {
    q: "Can working professionals get career guidance?",
    a: "Yes. Over 60% of our learners are working professionals looking to earn an accredited MBA, MCA, or M.Sc with flexible weekend schedules to qualify for promotions without quitting their jobs."
  },
  {
    q: "Can I compare universities before applying?",
    a: "Yes. Our side-by-side comparison engine lets you inspect official fee schedules, syllabus details, exam modes, and EMI options across multiple universities at the same time."
  },
  {
    q: "Can I calculate my EMI?",
    a: "Yes. You can use our built-in Education EMI Calculator to see your exact monthly outlay with zero-cost EMI plans before filling any admission application."
  },
  {
    q: "Are the programs recognised?",
    a: "Every university listed on Degree Guru holds statutory entitlements from the UGC-DEB (Distance Education Bureau), NAAC accreditation, and AICTE/AIU approvals where applicable, ensuring degrees are 100% valid for private MNCs and government examinations."
  },
  {
    q: "Can I talk to a counsellor?",
    a: "Yes. Click 'Talk to a Career Counsellor' at any time, share your details, and a dedicated education advisor will connect with you via phone or WhatsApp for free, unbiased advice."
  }
];

export const NewHome = () => {
  const { theme } = useTheme();
  const [selectedStage, setSelectedStage] = useState<string>("working");
  const [selectedGoal, setSelectedGoal] = useState<string>("growth");
  const [counselorModalOpen, setCounselorModalOpen] = useState(false);
  const [counselorSource, setCounselorSource] = useState("New Home Header");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Interactive Mini Course Finder State (Section 5)
  const [finderEdu, setFinderEdu] = useState("Graduate / Working");
  const [finderInterest, setFinderInterest] = useState("Management & Leadership");
  const [finderBudget, setFinderBudget] = useState("₹1 Lakh - ₹2 Lakhs");

  const currentRec = RECOMMENDATION_MAP[selectedStage] || RECOMMENDATION_MAP["working"];

  const openCounseling = (sourceName: string) => {
    setCounselorSource(sourceName);
    setCounselorModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors selection:bg-primary/20 selection:text-primary">
      
      {/* ── Top Avatar Preview Switcher Banner ────────────────────────── */}
      <div className="bg-primary/10 border-b border-primary/20 py-2 px-4 text-center text-xs font-medium text-foreground flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary text-white text-[10px] font-bold">
          <Sparkles size={12} /> Degree Guru 2.0
        </span>
        <span>Previewing Career-First Decision Avatar</span>
        <span className="text-muted-foreground">•</span>
        <Link to="/" className="text-primary hover:underline font-bold inline-flex items-center gap-1">
          Switch to Classic Home <ExternalLink size={12} />
        </Link>
      </div>

      {/* ── Avatar Navigation Header ───────────────────────────────────── */}
      <header className="sticky top-0 z-40 bg-background/90 backdrop-blur-md border-b border-border/80">
        <div className="container-dg h-16 sm:h-18 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <Link to="/new-home" className="shrink-0 flex items-center gap-2">
            <img 
              src={theme === "dark" ? logoDark : logoLight} 
              alt="Degree Guru" 
              className="h-9 sm:h-10 w-auto object-contain"
            />
          </Link>

          {/* Clean Simplified Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-semibold text-foreground/85">
            <a href="#explore-programs" className="hover:text-primary transition-colors">Explore Programs</a>
            <a href="#universities" className="hover:text-primary transition-colors">Universities</a>
            <a href="#career-tools" className="hover:text-primary transition-colors">Career Tools</a>
            <a href="#career-guides" className="hover:text-primary transition-colors">Career Guides</a>
          </nav>

          {/* Right Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => openCounseling("Header Nav - Talk to Counsellor")}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-foreground/90 hover:text-primary hover:bg-muted transition-all border border-border/70"
            >
              <MessageCircle size={15} className="text-primary" />
              <span>Talk to a Counsellor</span>
            </button>

            <a
              href="#course-finder"
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs sm:text-sm font-bold shadow-md shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Find My Course</span>
              <ArrowRight size={15} />
            </a>
          </div>
        </div>
      </header>

      {/* ── 1. HERO: Central Story & Product Demonstrator ─────────────── */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 overflow-hidden border-b border-border/60">
        {/* Soft Background Radial Glow (Subtle, never harsh) */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-96 bg-primary/8 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="container-dg space-y-10">
          
          {/* Main Hero Value Proposition */}
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-wide">
              <Compass size={14} /> Career-First Education Discovery
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.12]">
              Not Sure What to Study Next? <br className="hidden sm:block" />
              <span className="text-primary">Find the Right Degree for Your Career.</span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Tell us your education, interests and career goals. We’ll help you discover the right course, degree and university for your next step.
            </p>

            {/* Hero Primary Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <a
                href="#course-finder"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
              >
                Find My Right Course <ArrowRight size={16} />
              </a>

              <button
                type="button"
                onClick={() => openCounseling("Hero - Talk to Career Counsellor")}
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-card hover:bg-muted text-foreground font-bold text-sm border border-border flex items-center justify-center gap-2 transition-all"
              >
                <PhoneCall size={16} className="text-primary" /> Talk to a Career Counsellor
              </button>
            </div>

            {/* Small Trust Line */}
            <p className="pt-1 text-xs text-muted-foreground/80 flex items-center justify-center gap-2 flex-wrap">
              <span>✓ 100% Free Career Guidance</span>
              <span>•</span>
              <span>Course & University Shortlisting</span>
              <span>•</span>
              <span>No Hidden Counselling Fees</span>
            </p>
          </div>

          {/* Interactive Product Demonstrator (The Hero Visual!) */}
          <div className="max-w-4xl mx-auto p-5 sm:p-7 md:p-8 rounded-3xl bg-card/85 dark:bg-card/60 backdrop-blur-xl border border-border/80 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-primary">Interactive Preview</span>
                <h3 className="text-lg sm:text-xl font-black text-foreground">Find Your Right Course in 30 Seconds</h3>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center gap-1">
                <CheckCircle2 size={13} /> Live Outcome Engine
              </span>
            </div>

            {/* Step 1: Where are you right now? */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-bold text-foreground/90 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center">1</span>
                Where are you right now?
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {HERO_STAGES.map((s) => {
                  const active = selectedStage === s.id;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSelectedStage(s.id)}
                      className={`p-3 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between min-h-[72px] ${
                        active 
                          ? "bg-primary text-white border-primary shadow-md shadow-primary/20 scale-[1.02]"
                          : "bg-muted/30 hover:bg-muted/70 border-border/70 text-foreground"
                      }`}
                    >
                      <span className="text-xs sm:text-[13px] font-bold leading-tight">{s.label}</span>
                      <span className={`text-[9.5px] mt-1 font-medium ${active ? "text-white/80" : "text-muted-foreground"}`}>
                        {s.badge}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: What do you want to achieve? */}
            <div className="space-y-2.5">
              <label className="text-xs sm:text-sm font-bold text-foreground/90 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-black flex items-center justify-center">2</span>
                What do you want to achieve?
              </label>

              <div className="flex flex-wrap gap-2">
                {HERO_GOALS.map((g) => {
                  const active = selectedGoal === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setSelectedGoal(g.id)}
                      className={`px-3.5 py-1.5 rounded-lg border text-xs font-bold transition-all cursor-pointer ${
                        active
                          ? "bg-primary text-white border-primary shadow-sm"
                          : "bg-muted/40 hover:bg-muted border-border/70 text-foreground"
                      }`}
                    >
                      {g.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Live Recommendation Result Box */}
            <div className="p-4 sm:p-5 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-md bg-white dark:bg-card text-primary text-[10px] font-bold shadow-xs">
                    Recommended Study Path
                  </span>
                  <span className="text-xs text-muted-foreground">• Based on your selection</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-foreground">
                  {currentRec.degree}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {currentRec.why}
                </p>
                <div className="pt-1 text-[11px] font-semibold text-primary">
                  Popular Options: <span className="text-foreground/90">{currentRec.courses}</span>
                </div>
              </div>

              <div className="shrink-0 flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to={currentRec.path}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all"
                >
                  Explore Degrees <ArrowRight size={14} />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* ── 2. WHERE ARE YOU IN YOUR EDUCATION JOURNEY? ────────────────── */}
      <section className="py-14 md:py-20 border-b border-border/60 bg-muted/20">
        <div className="container-dg space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Choose Your Starting Point</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Where Are You in Your Education Journey?
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Choose your stage. We’ll show you what comes next.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {STAGE_CARDS.map((card, i) => (
              <Link
                key={i}
                to={card.href}
                className="group p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/60 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all flex flex-col justify-between relative hover:-translate-y-1"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{card.icon}</span>
                    <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold">
                      {card.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {card.stage}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {card.desc}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-1 text-xs font-bold text-primary group-hover:translate-x-1 transition-transform">
                  <span>{card.cta}</span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── 3. CORE PROMISE: HOW DEGREE GURU HELPS ─────────────────────── */}
      <section className="py-16 md:py-24 border-b border-border/60 bg-background">
        <div className="container-dg space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">The Core Promise</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight leading-tight">
              You Don’t Need to Know the Answer. <br className="hidden sm:block" />
              <span className="text-primary">That’s what we’re here for.</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              Choosing a degree shouldn’t mean opening 20 tabs, comparing hundreds of courses and still wondering if you made the right choice.
            </p>
          </div>

          {/* Visual Progression: Confusion to Clarity */}
          <div className="max-w-4xl mx-auto p-4 sm:p-5 rounded-2xl bg-muted/40 border border-border/70 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-left">
            <span className="text-xs font-bold text-muted-foreground">Degree Guru helps you go from:</span>
            <div className="flex items-center gap-2 flex-wrap justify-center text-xs font-bold">
              <span className="px-3 py-1 rounded-lg bg-rose-500/10 text-rose-600 dark:text-rose-400">“I’m confused.”</span>
              <span className="text-muted-foreground">➔</span>
              <span className="px-3 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">“This is the course I should consider.”</span>
              <span className="text-muted-foreground">➔</span>
              <span className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">“These are the universities I can choose from.”</span>
              <span className="text-muted-foreground">➔</span>
              <span className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">“This is what it will cost me.”</span>
            </div>
          </div>

          {/* 4 Simple Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3 relative">
              <span className="text-3xl font-black text-primary/30">01</span>
              <h4 className="text-base font-bold text-foreground">Tell us about yourself</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Your education, interests, career goals and budget. No lengthy assessments or technical jargon.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3 relative">
              <span className="text-3xl font-black text-primary/30">02</span>
              <h4 className="text-base font-bold text-foreground">Discover suitable courses</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Explore degrees and career paths that match your profile and current job market demand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3 relative">
              <span className="text-3xl font-black text-primary/30">03</span>
              <h4 className="text-base font-bold text-foreground">Compare universities</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Compare recognised universities, fees, specialisations and other important factors side by side.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-3 relative">
              <span className="text-3xl font-black text-primary/30">04</span>
              <h4 className="text-base font-bold text-foreground">Make your decision</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Get free 1-on-1 expert counselling and move forward with confidence and clarity.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* ── 4. WHAT CAN I STUDY? (5 BIG CARDS) ─────────────────────────── */}
      <section id="explore-programs" className="py-16 md:py-22 border-b border-border/60 bg-muted/20">
        <div className="container-dg space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Browse Curated Degrees</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Explore Degrees That Can Take You Forward
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Don’t get lost in hundreds of cluttered categories. Choose the stage that matches your ambition.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {FIVE_BIG_DEGREE_CATEGORIES.map((cat, i) => (
              <div
                key={i}
                className="p-5 rounded-2xl bg-card border border-border/80 flex flex-col justify-between shadow-sm hover:shadow-md transition-all hover:border-primary/50 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-bold text-muted-foreground">
                      {cat.tag}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                      {cat.title}
                    </h3>
                    <p className="text-[11px] text-muted-foreground font-medium mt-0.5">
                      {cat.subtitle}
                    </p>
                  </div>

                  <ul className="space-y-1.5 pt-2 border-t border-border/60">
                    {cat.programs.map((p, idx) => (
                      <li key={idx} className="text-xs text-foreground/80 flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                        <span className="truncate">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-5">
                  <Link
                    to={cat.href}
                    className="w-full py-2 px-3 rounded-lg bg-muted hover:bg-primary hover:text-white text-xs font-bold flex items-center justify-center gap-1 transition-all"
                  >
                    <span>Explore Programs</span>
                    <ChevronRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <Link
              to="/courses"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card hover:bg-muted text-foreground text-xs sm:text-sm font-bold border border-border shadow-xs hover:scale-[1.01] transition-all"
            >
              <span>Explore All Programs & Specializations</span>
              <ArrowRight size={14} className="text-primary" />
            </Link>
          </div>

        </div>
      </section>

      {/* ── 5. THE STAR: COURSE FINDER ENGINE ──────────────────────────── */}
      <section id="course-finder" className="py-16 md:py-24 border-b border-border/60 bg-background relative">
        <div className="container-dg max-w-4xl space-y-10">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <Sparkles size={14} /> Star Recommendation Tool
            </div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Still Don’t Know Which Course Is Right for You?
            </h2>
            <p className="text-sm md:text-base text-muted-foreground max-w-xl mx-auto">
              Let Degree Guru help you find out. Answer 3 quick parameters to discover degrees worth exploring.
            </p>
          </div>

          {/* Interactive Interactive Finder Card */}
          <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 shadow-xl space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              
              {/* Parameter 1 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/90 flex items-center gap-1.5">
                  <GraduationCap size={15} className="text-primary" /> Your Current Education
                </label>
                <select
                  value={finderEdu}
                  onChange={(e) => setFinderEdu(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option>10th Standard</option>
                  <option>12th (Commerce)</option>
                  <option>12th (Science / Math)</option>
                  <option>12th (Arts / Humanities)</option>
                  <option>Graduate / Working</option>
                  <option>Diploma Holder</option>
                </select>
              </div>

              {/* Parameter 2 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/90 flex items-center gap-1.5">
                  <Target size={15} className="text-primary" /> Interest & Career Goal
                </label>
                <select
                  value={finderInterest}
                  onChange={(e) => setFinderInterest(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option>Management & Leadership</option>
                  <option>Software, Cloud & AI</option>
                  <option>Finance & Accounting</option>
                  <option>Marketing & Business Growth</option>
                  <option>Data Analytics & Statistics</option>
                  <option>Government Jobs / Civil Services</option>
                </select>
              </div>

              {/* Parameter 3 */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-foreground/90 flex items-center gap-1.5">
                  <Calculator size={15} className="text-primary" /> Approximate Budget
                </label>
                <select
                  value={finderBudget}
                  onChange={(e) => setFinderBudget(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 cursor-pointer"
                >
                  <option>Budget-Friendly (&lt; ₹75,000 Total)</option>
                  <option>₹1 Lakh - ₹2 Lakhs</option>
                  <option>₹2 Lakhs+ (Top Tier / Global)</option>
                  <option>Need Monthly EMI (₹3,000 – ₹5,000/mo)</option>
                </select>
              </div>

            </div>

            {/* Live Recommendation Output Banner */}
            <div className="p-5 rounded-2xl bg-muted/40 border border-border flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Matched Program Strategy</span>
                <h4 className="text-base font-bold text-foreground">
                  {finderInterest.includes("Software") ? "Online BCA or MCA with AI Specialization" :
                   finderInterest.includes("Finance") ? "Online MBA in Finance or Online M.Com" :
                   finderInterest.includes("Management") ? "Online MBA with Dual Specialization" :
                   "Career-Aligned UGC Entitled Degree"}
                </h4>
                <p className="text-xs text-muted-foreground">
                  Includes UGC-DEB recognized degree, placement assistance, and zero-cost EMI options within {finderBudget}.
                </p>
              </div>

              <div className="shrink-0 flex items-center gap-2">
                <Link
                  to="/career-finder"
                  className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-xs sm:text-sm shadow-md shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  Find My Course — It’s Free
                </Link>
              </div>
            </div>

            {/* Trust Subline */}
            <div className="pt-1 text-center text-xs text-muted-foreground flex items-center justify-center gap-2 flex-wrap">
              <span>No registration fee</span>
              <span>•</span>
              <span>No paid career test</span>
              <span>•</span>
              <span>No sales pressure</span>
            </div>

          </div>

        </div>
      </section>

      {/* ── 6. UNIVERSITY COMPARISON: NOW THAT YOU KNOW WHAT TO STUDY ─── */}
      <section id="universities" className="py-16 md:py-22 border-b border-border/60 bg-muted/20">
        <div className="container-dg space-y-10">
          
          <div className="text-center max-w-3xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Now that you know what you want to study…</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Find the University That Fits You.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Compare universities based on what actually matters to your career and wallet.
            </p>
          </div>

          {/* What Actually Matters: 8 Factors Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2.5 text-center">
            {[
              { icon: "💰", label: "Official Fees" },
              { icon: "📋", label: "Eligibility" },
              { icon: "🎯", label: "Specialisations" },
              { icon: "⏱️", label: "Duration" },
              { icon: "🏛️", label: "Accreditation" },
              { icon: "💻", label: "Learning Format" },
              { icon: "🤝", label: "Career Support" },
              { icon: "💳", label: "EMI Options" }
            ].map((f, i) => (
              <div key={i} className="p-3 rounded-xl bg-card border border-border/80 shadow-2xs">
                <span className="text-xl">{f.icon}</span>
                <div className="text-[11px] font-bold text-foreground mt-1">{f.label}</div>
              </div>
            ))}
          </div>

          {/* Interactive University Comparison Table / Preview */}
          <div className="p-5 sm:p-7 rounded-3xl bg-card border border-border/80 shadow-md space-y-4 overflow-x-auto">
            <div className="flex items-center justify-between min-w-[600px]">
              <div>
                <h4 className="text-base font-bold text-foreground">Top Online Universities Comparison Preview</h4>
                <p className="text-xs text-muted-foreground">Verify accreditation, fee structure and exam formats in one screen</p>
              </div>
              <Link
                to="/universities/compare"
                className="px-4 py-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary text-xs font-bold transition-colors inline-flex items-center gap-1"
              >
                Compare Universities <ArrowRight size={13} />
              </Link>
            </div>

            <div className="min-w-[600px] border border-border/70 rounded-xl overflow-hidden text-xs">
              <div className="grid grid-cols-5 bg-muted/60 p-3 font-bold text-muted-foreground uppercase text-[10px]">
                <div>University</div>
                <div>Accreditation</div>
                <div>Popular Degrees</div>
                <div>Starting Fee</div>
                <div>Monthly EMI</div>
              </div>
              {[
                { name: "Manipal University Online", acc: "NAAC A+ • UGC-DEB", degrees: "MBA, MCA, BBA, BCA", fee: "₹1,50,000 Total", emi: "From ₹4,150/mo" },
                { name: "Amity University Online", acc: "NAAC A+ • UGC-DEB • QS Top", degrees: "MBA, MCA, B.Com, MA", fee: "₹1,80,000 Total", emi: "From ₹4,800/mo" },
                { name: "Jain University Online", acc: "NAAC A++ • UGC-DEB", degrees: "MBA, MCA, BBA", fee: "₹1,40,000 Total", emi: "From ₹3,900/mo" },
                { name: "Chandigarh University Online", acc: "NAAC A+ • UGC-DEB", degrees: "MBA, MCA, BA, M.Sc", fee: "₹1,10,000 Total", emi: "From ₹3,200/mo" },
              ].map((row, idx) => (
                <div key={idx} className="grid grid-cols-5 p-3.5 border-t border-border/60 items-center font-medium hover:bg-muted/30 transition-colors">
                  <div className="font-bold text-foreground">{row.name}</div>
                  <div><span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10.5px] font-bold">{row.acc}</span></div>
                  <div className="text-muted-foreground">{row.degrees}</div>
                  <div className="font-semibold text-foreground">{row.fee}</div>
                  <div className="font-bold text-primary">{row.emi}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 7. FREE TOOLS FOR YOUR CAREER & EDUCATION ──────────────────── */}
      <section id="career-tools" className="py-16 md:py-24 border-b border-border/60 bg-background">
        <div className="container-dg space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Self-Serve Platforms</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Free Tools for Your Career & Education
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Everything you need to make a smarter, quantifiable decision before you enroll.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Tool 1 */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <FileText size={24} />
                </div>
                <h3 className="text-base font-bold text-foreground">ATS Resume Builder</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Build a professional, ATS-friendly resume in minutes with keyword optimization and PDF download.
                </p>
              </div>
              <div className="pt-5">
                <Link
                  to="/resume-builder"
                  className="w-full py-2.5 px-3 rounded-xl bg-muted hover:bg-primary hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  Build My Resume <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Tool 2 */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Calculator size={24} />
                </div>
                <h3 className="text-base font-bold text-foreground">Education EMI Calculator</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Know your monthly education cost, tenure interest and affordability before you commit.
                </p>
              </div>
              <div className="pt-5">
                <Link
                  to="/emi-calculator"
                  className="w-full py-2.5 px-3 rounded-xl bg-muted hover:bg-primary hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  Calculate EMI <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Tool 3 */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-[#6528f7] flex items-center justify-center">
                  <Compass size={24} />
                </div>
                <h3 className="text-base font-bold text-foreground">Career Finder</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Not sure which career path suits you? Answer structured questions to uncover your ideal direction.
                </p>
              </div>
              <div className="pt-5">
                <Link
                  to="/career-finder"
                  className="w-full py-2.5 px-3 rounded-xl bg-muted hover:bg-primary hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  Find My Career <ArrowRight size={13} />
                </Link>
              </div>
            </div>

            {/* Tool 4 */}
            <div className="p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover:shadow-xl hover:border-primary/50 transition-all flex flex-col justify-between group">
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <Scale size={24} />
                </div>
                <h3 className="text-base font-bold text-foreground">Course & Uni Comparison</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Compare degrees and university features side-by-side without visiting 15 separate websites.
                </p>
              </div>
              <div className="pt-5">
                <Link
                  to="/universities/compare"
                  className="w-full py-2.5 px-3 rounded-xl bg-muted hover:bg-primary hover:text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  Compare Now <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </div>

          <div className="text-center">
            <span className="text-xs font-bold text-muted-foreground">
              More free tools coming soon • University ROI Index, Placement Salary Heatmap & Exam Tracker
            </span>
          </div>

        </div>
      </section>

      {/* ── 8. DEGREE GURU FOR EVERY STAGE MATRIX ──────────────────────── */}
      <section className="py-16 md:py-22 border-b border-border/60 bg-muted/20">
        <div className="container-dg max-w-4xl space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Tailored Guidance</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Whatever Your Next Step, Start Here.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Degree Guru communicates your exact path in 10 seconds.
            </p>
          </div>

          <div className="bg-card border border-border/80 rounded-3xl overflow-hidden shadow-sm">
            <div className="grid grid-cols-12 bg-muted/70 p-4 font-bold text-xs text-muted-foreground uppercase tracking-wider">
              <div className="col-span-4 sm:col-span-3">Your Situation</div>
              <div className="col-span-5 sm:col-span-6">How We Help You</div>
              <div className="col-span-3 text-right">Action</div>
            </div>

            <div className="divide-y divide-border/60">
              {MATRIX_DATA.map((item, idx) => (
                <div key={idx} className="grid grid-cols-12 p-4 sm:p-5 items-center text-xs sm:text-sm hover:bg-muted/30 transition-colors">
                  <div className="col-span-4 sm:col-span-3 font-bold text-foreground flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    <span>{item.stage}</span>
                  </div>
                  <div className="col-span-5 sm:col-span-6 text-muted-foreground pr-2">
                    <span className="font-semibold text-foreground/90">{item.help}</span>
                    <span className="hidden sm:inline text-xs text-muted-foreground block mt-0.5">{item.outcome}</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <Link
                      to="/courses"
                      className="inline-flex items-center gap-1 text-xs font-bold text-primary hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ── 9. TRUST: GUIDANCE BEFORE ADMISSION ────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-border/60 bg-background">
        <div className="container-dg max-w-4xl space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Unbiased Philosophy</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Guidance Before Admission. <br className="hidden sm:block" />
              <span className="text-primary">Not Just Admission.</span>
            </h2>
            <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
              We help you understand your options before you make a commitment.
            </p>
          </div>

          {/* Core Trust Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            
            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">1</div>
                <h4 className="text-base font-bold text-foreground">Course-First Approach</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                We help you identify suitable programs before pushing university options. A great university with the wrong course is still the wrong decision.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">2</div>
                <h4 className="text-base font-bold text-foreground">Clear Comparisons</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                Understand full fees, eligibility, duration, exam modes and hidden costs upfront with 100% transparency.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">3</div>
                <h4 className="text-base font-bold text-foreground">Free Counselling</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                Speak directly to an experienced career counsellor when you need tailored advice, without paying high consult fees.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border/80 space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">4</div>
                <h4 className="text-base font-bold text-foreground">Student-First Guidance</h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed pl-10">
                Your career goal comes first. The university comes later. We recommend programs that solve your situation, not quotas.
              </p>
            </div>

          </div>

          {/* Bold Brand Manifesto Callout */}
          <div className="p-6 sm:p-8 rounded-3xl bg-primary/8 border border-primary/20 text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">The Degree Guru Guarantee</span>
            <blockquote className="text-base sm:text-lg md:text-xl font-bold text-foreground max-w-2xl mx-auto italic">
              “We don’t start by asking ‘Which university do you want?’ <br className="hidden sm:block" />
              We start by asking <span className="text-primary not-italic font-black">‘What are you trying to achieve?’</span>”
            </blockquote>
          </div>

        </div>
      </section>

      {/* ── 10. UNIVERSITY LOGOS (POSITIONED NATURALLY) ────────────────── */}
      <section className="py-16 md:py-20 border-b border-border/60 bg-muted/20">
        <div className="container-dg space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Accredited Network</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Explore Recognised Universities & Programs
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Compare programs from leading universities and find options that fit your goals, eligibility and budget.
            </p>
          </div>

          {/* University Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {UNIVERSITIES.slice(0, 12).map((u) => (
              <Link
                key={u.id}
                to={`/universities/${u.slug}`}
                className="p-4 rounded-2xl bg-card border border-border/80 hover:border-primary/50 text-center flex flex-col items-center justify-between shadow-2xs hover:shadow-md transition-all group min-h-[150px]"
              >
                <div className="w-12 h-12 rounded-xl bg-muted/60 flex items-center justify-center font-bold text-xs text-primary group-hover:scale-105 transition-transform">
                  🏛️
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground group-hover:text-primary transition-colors leading-tight line-clamp-2">
                    {u.name}
                  </h4>
                  <span className="inline-block mt-1 text-[9.5px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {u.naacGrade} Accredited
                  </span>
                </div>
                <span className="text-[10px] font-bold text-primary">View Programs &rarr;</span>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── 11. STUDENT STORIES: REAL DECISIONS ───────────────────────── */}
      <section className="py-16 md:py-24 border-b border-border/60 bg-background">
        <div className="container-dg space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Real Decisions</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Real Students. Real Decisions.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Honest stories of how students navigated confusion, compared options, and chose the right degree.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {STUDENT_JOURNEYS.map((story, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-card border border-border/80 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary text-white font-bold text-sm flex items-center justify-center">
                      {story.avatar}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-foreground">{story.name}</h4>
                      <span className="text-xs text-muted-foreground">{story.location}</span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-muted/40 space-y-2 text-xs">
                    <div>
                      <span className="font-bold text-muted-foreground block text-[10px] uppercase">Starting Situation:</span>
                      <span className="text-foreground/90 font-medium">{story.before}</span>
                    </div>
                    <div>
                      <span className="font-bold text-primary block text-[10px] uppercase">Career Goal:</span>
                      <span className="text-foreground font-semibold">{story.goal}</span>
                    </div>
                    <div>
                      <span className="font-bold text-muted-foreground block text-[10px] uppercase">Options Explored:</span>
                      <span className="text-muted-foreground">{story.explored}</span>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold uppercase text-emerald-600 dark:text-emerald-400">Final Decision:</span>
                    <h5 className="text-xs font-bold text-foreground">{story.decision}</h5>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/60 text-xs text-muted-foreground">
                  <span className="font-bold text-foreground/80">What helped:</span> {story.helped}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* ── 12. CONFUSED ABOUT YOUR CAREER? START HERE ────────────────── */}
      <section id="career-guides" className="py-16 md:py-22 border-b border-border/60 bg-muted/20">
        <div className="container-dg space-y-10">
          
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">In-Depth Guides</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Confused About Your Career? Start Here.
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Deep, factual decision guides to answer your most specific education dilemmas.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {CAREER_GUIDES.map((g, i) => (
              <Link
                key={i}
                to={g.href}
                className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/50 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div className="space-y-2">
                  <span className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[10px] font-bold">
                    {g.tag}
                  </span>
                  <h4 className="text-sm font-bold text-foreground group-hover:text-primary transition-colors leading-snug">
                    {g.title}
                  </h4>
                </div>
                <div className="pt-4 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{g.readTime}</span>
                  <span className="text-primary font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                    Read Guide &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* ── 13. FAQ: QUESTIONS STUDENTS ASK ────────────────────────────── */}
      <section className="py-16 md:py-24 border-b border-border/60 bg-background">
        <div className="container-dg max-w-3xl space-y-10">
          
          <div className="text-center space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Common Queries</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Questions Students Ask
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Clear, straight answers without marketing fluff.
            </p>
          </div>

          <div className="space-y-3">
            {STREAMLINED_FAQS.map((faq, i) => {
              const isOpen = openFaqIndex === i;
              return (
                <div
                  key={i}
                  className="rounded-2xl border border-border/80 bg-card overflow-hidden transition-all"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : i)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-foreground cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown size={18} className={`shrink-0 text-primary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ── 14. FINAL CTA: YOUR NEXT CAREER MOVE ────────────────────────── */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-primary/10 via-background to-background relative overflow-hidden">
        <div className="container-dg max-w-4xl text-center space-y-6">
          
          <span className="px-3.5 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold inline-block">
            Take the First Step
          </span>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
            Your Next Career Move Starts With One Decision.
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Not sure what to study? Let’s figure it out. Tell us where you are today. We’ll help you explore where you can go next.
          </p>

          <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a
              href="#course-finder"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-primary/25 hover:-translate-y-0.5 transition-all"
            >
              Find My Right Course <ArrowRight size={16} />
            </a>

            <button
              type="button"
              onClick={() => openCounseling("Footer CTA - Talk to Career Counsellor")}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-card hover:bg-muted text-foreground font-bold text-sm border border-border flex items-center justify-center gap-2 transition-all"
            >
              <PhoneCall size={16} className="text-primary" /> Talk to a Career Counsellor
            </button>
          </div>

          <p className="text-xs text-muted-foreground pt-1">
            100% Free • No obligation • No hidden counselling charges
          </p>

        </div>
      </section>

      {/* ── Global Interactive Counseling Modal ───────────────────────── */}
      <Dialog open={counselorModalOpen} onOpenChange={setCounselorModalOpen}>
        <DialogContent className="sm:max-w-md p-6 bg-card border border-border/80">
          <DialogHeader>
            <DialogTitle className="text-lg font-black text-foreground flex items-center gap-2">
              <PhoneCall size={18} className="text-primary" /> Talk to a Career Counsellor
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Share your contact details. An experienced Degree Guru career advisor will call you for 100% free, unbiased advice.
            </DialogDescription>
          </DialogHeader>

          <div className="pt-2">
            <CounselingForm
              compact
              source={counselorSource}
              buttonLabel="Request Free Counseling Call"
              onSubmitDone={() => setCounselorModalOpen(false)}
            />
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
};

export default NewHome;
