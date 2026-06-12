import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles, Briefcase, BookOpen, Award, Star, Phone, CheckCircle2, TrendingUp, Users, Zap, MessageCircle } from "lucide-react";
import { Blobs } from "@/components/Blobs";
import { Reveal } from "@/components/Reveal";
import { UniversityMarquee } from "@/components/UniversityMarquee";
import { CounselingForm } from "@/components/CounselingForm";
import { Counter } from "@/components/Counter";
import { FaqSection } from "@/components/FaqSection";
import { PROGRAMS } from "@/data/programs";
import { fetchHomeContent, type HomeContent } from "@/lib/api";
import heroDesktop from "@/assets/hero-desktop.jpg";
import heroTablet from "@/assets/hero-tablet.jpg";
import heroMobile from "@/assets/hero-mobile.jpg";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";

const DEFAULTS: HomeContent = {
  hero_h1:           "India's <span>#1 Most Trusted</span> Career Counselling Platform",
  hero_subtitle:     "100% online degree courses from India's top universities. Honest counseling. Easy EMI options.",
  hero_cta_primary:  "Get Free Counseling",
  hero_cta_secondary:"Explore Programs",
  hero_badge_1:      "AICTE Approved",
  hero_badge_2:      "UGC Entitled",
  hero_badge_3:      "Easy EMI",

  stat1_value: "5000", stat1_suffix: "+", stat1_label: "Students Guided",
  stat2_value: "50",   stat2_suffix: "+", stat2_label: "Top Universities",
  stat3_value: "100",  stat3_suffix: "%", stat3_label: "Free Forever",

  vision_overline: "Our Vision",
  vision_h2:       "Empowering Viksit Bharat (Developed India) Initiative Through Education",
  vision_body:     "At Degree Guru, we believe every Indian deserves honest career guidance. Our mission aligns with the Viksit Bharat (Developed India) Initiative: empowering youth through education and informed choices. We partner with leading universities to build a platform where no student pays for counseling, where every professional finds their next step, and where the right online degree opens doors. This is a movement toward an educated, empowered India.",

  programs_overline: "Explore Programs",
  programs_h2:       "Online Programs for Every Career Stage",
  programs_subtitle: "Bachelors, masters, doctorate, and certifications. All delivered online. All guided by us for free.",

  whyus_overline: "Why Trust Us",
  whyus_h2:       "Why Thousands Choose Degree Guru",
  why1_title: "Completely Free Counseling",
  why1_desc:  "Top universities support our work, so students pay nothing. Honest, unbiased advice for every learner and professional.",
  why2_title: "Easy EMI Options",
  why2_desc:  "Top universities offer no-cost or low-cost EMI plans, so you never have to pause your dream for fees.",
  why3_title: "Scholarships & Recruitment Support",
  why3_desc:  "We help you find scholarships and connect with recruitment opportunities after your degree.",
  why4_title: "Industry Ready Advice",
  why4_desc:  "Our counselors understand current job markets, salary trends and what hiring managers actually look for.",

  how_overline: "Your Journey",
  how_h2:       "3 Steps to Your Online Degree",
  step1_num: "01", step1_title: "Share Your Profile",        step1_desc: "Tell us your background and career goals",
  step2_num: "02", step2_title: "Get Recommendations",       step2_desc: "Receive your personalized university and program shortlist",
  step3_num: "03", step3_title: "Enroll with Confidence",    step3_desc: "We guide your application until you are admitted",

  schooling_overline: "Schooling Online",
  schooling_h2:       "Complete Your Schooling Online",
  schooling_body:     "Missed formal schooling? You can now complete Class 10 or Class 12 online from home. Flexible learning for every age.",
  school_card1_title: "Class 10 Online", school_card1_sub: "Secondary education from home.",
  school_card2_title: "Class 12 Online", school_card2_sub: "Senior secondary, your way.",

  testimonials_overline: "Stories",
  testimonials_h2:       "Real Learners, Real Results",
  testimonials_json: "",
  faqs_json: "",
  announcements_json: "",

  cta_h2:      "Ready to Choose Your Online Degree?",
  cta_button:  "Talk to a Counselor. It is Free.",
  cta_subtext: "Join 5,000+ students who found their perfect program — for free.",

  contact_overline:  "Talk To Us",
  contact_h2:        "Get Free Counseling",
  contact_subtitle:  "Fill in your details. Our experts will call you back within 2 hours.",
  phone:             "9350199001",
  whatsapp_number:   "919350199001",
  email_admissions:  "admissions@degreeguru.in",
  email_queries:     "info@degreeguru.in",
  address:           "Gurugram, Haryana, India",
  availability:      "Available all 7 days",
};

const WHY_ICONS = [ShieldCheck, Sparkles, Award, Briefcase];
const WHY_COLORS = [
  { bg: "bg-violet-100 dark:bg-violet-950", icon: "text-violet-600 dark:text-violet-400" },
  { bg: "bg-blue-100 dark:bg-blue-950",   icon: "text-blue-600 dark:text-blue-400" },
  { bg: "bg-amber-100 dark:bg-amber-950", icon: "text-amber-600 dark:text-amber-400" },
  { bg: "bg-emerald-100 dark:bg-emerald-950", icon: "text-emerald-600 dark:text-emerald-400" },
];

const STAT_ICONS = [Users, GraduationCap, Zap];

const LEVEL_TABS = ["All", "Bachelors", "Masters", "Doctoral", "Skills"] as const;
type LevelTab = typeof LEVEL_TABS[number];

const TESTIMONIAL_IMGS = [t1, t2, t3];

const Index = () => {
  const { data: api } = useQuery({
    queryKey: ["home-content"],
    queryFn:  fetchHomeContent,
    staleTime: 1000 * 60 * 5,
  });

  const c = { ...DEFAULTS, ...api };
  const [activeTab, setActiveTab] = useState<LevelTab>("All");

  const stats = [
    { value: Number(c.stat1_value), suffix: c.stat1_suffix, label: c.stat1_label, icon: STAT_ICONS[0] },
    { value: Number(c.stat2_value), suffix: c.stat2_suffix, label: c.stat2_label, icon: STAT_ICONS[1] },
    { value: Number(c.stat3_value), suffix: c.stat3_suffix, label: c.stat3_label, icon: STAT_ICONS[2] },
  ];

  const whyCards = [1, 2, 3, 4].map((n) => ({
    icon: WHY_ICONS[n - 1],
    colors: WHY_COLORS[n - 1],
    title: c[`why${n}_title`],
    desc:  c[`why${n}_desc`],
  }));

  const steps = [1, 2, 3].map((n) => ({
    num:   c[`step${n}_num`],
    title: c[`step${n}_title`],
    desc:  c[`step${n}_desc`],
  }));

  const parseJson = <T,>(raw: string, fallback: T[]): T[] => {
    try { const r = JSON.parse(raw); return Array.isArray(r) && r.length > 0 ? r : fallback; }
    catch { return fallback; }
  };

  const DEFAULT_TESTIMONIALS = [
    { name: "Priya Sharma", role: "Online MBA, NMIMS",    text: "Degree Guru helped me compare four universities honestly. I picked the right MBA in a week. No pressure, just facts." },
    { name: "Rohan Verma",  role: "Online BCA, LPU",      text: "I work full-time. Their counselor matched a program that fits my schedule perfectly. Enrolled in 3 days." },
    { name: "Aisha Khan",   role: "Online MA, Amity",     text: "Free, friendly and patient. They answered every question without any pressure. Highly recommend." },
    { name: "Vikram Nair",  role: "Online MCA, Amrita",   text: "The EMI guidance was incredible. I didn't know I could afford an MCA. Now I'm in my second semester." },
    { name: "Sneha Patel",  role: "Online BBA, Galgotias",text: "Got a scholarship through Degree Guru. Saved ₹40,000. The process was smoother than I expected." },
    { name: "Arjun Mehta",  role: "Online MBA, OP Jindal",text: "Best platform if you want an honest opinion. They told me which university to avoid — that's rare." },
  ];

  const DEFAULT_FAQS = [
    { q: "Is the counseling really 100% free? What's the catch?", a: "Absolutely free, no catch. Degree Guru is supported by our university partners who pay us a placement fee when a student enrolls. You never pay anything." },
    { q: "Are UGC-DEB online degrees valid for government jobs?",  a: "Yes. Degrees from UGC-DEB approved universities are fully recognized by the Government of India, UPSC, state PSCs, and most private employers." },
    { q: "Can I do an online degree while working full-time?",     a: "That's exactly who online degrees are designed for. Most programs offer recorded lectures you can watch anytime and flexible deadlines." },
    { q: "What EMI options are available?",                        a: "Programs start from as low as ₹3,500/month. Most universities offer no-cost EMI through partner banks and NBFCs." },
    { q: "How long does it take for a counselor to call me back?", a: "Our counselors typically call within 2 hours during working hours (9 AM – 8 PM, all 7 days). WhatsApp is available for instant replies." },
  ];

  const rawTestimonials = parseJson<{ name: string; role: string; text: string }>(c.testimonials_json, DEFAULT_TESTIMONIALS);
  const testimonials = rawTestimonials.map((t, i) => ({ ...t, img: TESTIMONIAL_IMGS[i % 3] }));

  const faqs = parseJson<{ q: string; a: string }>(c.faqs_json, DEFAULT_FAQS);

  const filteredPrograms = activeTab === "All"
    ? PROGRAMS
    : PROGRAMS.filter((p) => p.level === activeTab);

  const siteUrl = 'https://degreeguru.in';
  const defaultOgImage = `${siteUrl}/og-image.png`;

  return (
    <>
      <Helmet>
        <title>{c.seo_title || "Degree Guru | India's #1 Free Career Counseling Platform"}</title>
        <meta name="description" content={c.seo_description || "Compare online degree courses, universities, fees & no cost EMI with free counselling, placement support and career guidance for students at Degree Guru."} />
        {c.seo_focus_keyword && <meta name="keywords" content={c.seo_focus_keyword} />}
        <meta name="robots" content={c.seo_robots || 'index,follow'} />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:title" content={c.seo_title || "Degree Guru | India's #1 Free Career Counseling Platform"} />
        <meta property="og:description" content={c.seo_description || "Compare online degree courses, universities, fees & no cost EMI with free counselling, placement support and career guidance for students at Degree Guru."} />
        <meta property="og:image" content={c.seo_og_image || defaultOgImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={c.seo_title || "Degree Guru | India's #1 Free Career Counseling Platform"} />
        <meta name="twitter:description" content={c.seo_description || "Compare online degree courses, universities, fees & no cost EMI with free counselling, placement support and career guidance for students at Degree Guru."} />
        <meta name="twitter:image" content={c.seo_og_image || defaultOgImage} />
      </Helmet>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section className="relative flex items-center overflow-hidden pt-10 pb-16 md:min-h-[92vh] md:pb-20">
        <Blobs />
        <div className="container-dg relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-6 animate-fade-in">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-primary text-xs font-bold uppercase tracking-widest">India's Most Trusted Platform</span>
            </div>

            <h1
              className="font-extrabold leading-[1.05] text-[36px] sm:text-[48px] lg:text-[56px] xl:text-[64px] mb-6"
              dangerouslySetInnerHTML={{ __html: c.hero_h1 }}
            />
            <p className="text-soft text-lg leading-[1.75] max-w-[540px] mb-8">{c.hero_subtitle}</p>

            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/contact" className="btn-primary btn-primary-pulse group">
                {c.hero_cta_primary}
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <Link to="/programs" className="btn-outline">{c.hero_cta_secondary}</Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap items-center gap-4 text-xs">
              {[
                { icon: ShieldCheck, label: c.hero_badge_1 },
                { icon: Award,       label: c.hero_badge_2 },
                { icon: Sparkles,    label: c.hero_badge_3 },
              ].map(({ icon: Icon, label }) => (
                <span key={label} className="flex items-center gap-1.5 bg-primary/8 border border-primary/15 px-3 py-1.5 rounded-full text-foreground/80 font-medium">
                  <Icon size={12} className="text-primary" /> {label}
                </span>
              ))}
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-3 mt-8">
              <div className="flex -space-x-2">
                {[t1, t2, t3].map((img, i) => (
                  <img key={i} src={img} alt="" className="w-8 h-8 rounded-full border-2 border-background object-cover" />
                ))}
              </div>
              <div className="text-sm">
                <span className="font-bold text-foreground">700+ students</span>
                <span className="text-soft ml-1">enrolled this month</span>
              </div>
              <div className="flex gap-0.5 ml-1">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={11} className="fill-amber-400 text-amber-400" />)}
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative animate-float-soft">
              <div className="absolute -inset-8 bg-primary/15 rounded-[48px] blur-3xl" />
              <picture>
                {!c.hero_image && <source media="(max-width: 640px)" srcSet={heroMobile} />}
                {!c.hero_image && <source media="(max-width: 1024px)" srcSet={heroTablet} />}
                <img
                  src={c.hero_image || heroDesktop}
                  alt="Confident Indian student ready for an online degree"
                  className="relative rounded-[32px] w-full object-cover aspect-[4/3] sm:aspect-[4/5] shadow-2xl"
                  width={900} height={1100}
                />
              </picture>

              {/* Floating enrollment card */}
              <div className="absolute -bottom-6 -left-6 hidden md:flex items-center gap-3 px-5 py-4 rounded-2xl bg-background/95 backdrop-blur-xl border border-primary/20 shadow-2xl shadow-primary/20 animate-float">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <GraduationCap size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-foreground/60">Today</div>
                  <div className="font-bold text-foreground text-sm">700+ Students Enrolled</div>
                </div>
              </div>

              {/* Floating rating card */}
              <div className="absolute -top-4 -right-4 hidden md:flex items-center gap-2 px-4 py-3 rounded-xl bg-background/95 backdrop-blur-xl border border-amber-400/30 shadow-xl animate-float" style={{ animationDelay: "1s" }}>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={12} className="fill-amber-400 text-amber-400" />)}
                </div>
                <span className="font-bold text-sm">4.9</span>
                <span className="text-xs text-soft">Google Rating</span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS BAR ────────────────────────────────────────────────────── */}
      <section className="relative py-8 overflow-hidden">
        <div className="absolute inset-0 bg-primary" />
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)", backgroundSize: "20px 20px" }} />
        <div className="container-dg relative grid grid-cols-3 gap-4 md:gap-8">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div className="text-primary-foreground flex flex-col sm:flex-row items-center sm:items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center shrink-0 glow-ring">
                  <s.icon size={18} className="text-white" />
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-2xl md:text-[32px] font-extrabold leading-tight">
                    <Counter end={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] uppercase tracking-wider opacity-80 mt-0.5">{s.label}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── VISION ───────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />
        <div className="container-dg relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
                {c.vision_overline}
              </span>
              <h2 className="text-3xl md:text-[42px] font-bold mb-6 leading-tight">{c.vision_h2}</h2>
              <p className="text-soft text-lg leading-[1.85]">{c.vision_body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                {["Free Counseling", "No Pressure", "Honest Advice", "Pan India"].map((tag) => (
                  <span key={tag} className="flex items-center gap-1.5 text-sm font-medium text-primary">
                    <CheckCircle2 size={16} className="text-primary" /> {tag}
                  </span>
                ))}
              </div>
            </Reveal>
            <Reveal delay={0.12}>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Users,        label: "Students Served",  value: "5,000+", color: "bg-violet-100 dark:bg-violet-950 text-violet-700 dark:text-violet-300" },
                  { icon: GraduationCap,label: "Universities",     value: "50+",    color: "bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300" },
                  { icon: TrendingUp,   label: "Placement Rate",   value: "92%",    color: "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300" },
                  { icon: Zap,          label: "Response Time",    value: "2 hrs",  color: "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300" },
                ].map((item, i) => (
                  <div key={item.label} className={`glass card-accent p-6 rounded-2xl flex flex-col gap-3 ${i % 2 === 1 ? "mt-6" : ""}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <item.icon size={20} />
                    </div>
                    <div className="text-2xl font-extrabold">{item.value}</div>
                    <div className="text-sm text-soft">{item.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── PROGRAMS ─────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-24 relative">
        <div className="container-dg">
          <Reveal>
            <div className="max-w-2xl mb-8">
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                {c.programs_overline}
              </span>
              <h2 className="text-3xl md:text-[40px] font-bold mb-4 leading-tight">{c.programs_h2}</h2>
              <p className="text-soft text-lg">{c.programs_subtitle}</p>
            </div>
          </Reveal>

          {/* Filter tabs */}
          <Reveal>
            <div className="overflow-x-auto scrollbar-hide mb-10 -mx-5 sm:mx-0">
            <div className="inline-flex gap-2 p-1.5 bg-foreground/5 rounded-2xl mx-5 sm:mx-0">
              {LEVEL_TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`tab-pill ${activeTab === tab ? "active" : ""}`}
                >
                  {tab}
                  {tab !== "All" && (
                    <span className={`ml-1.5 text-[10px] font-bold px-1.5 py-0.5 rounded-full ${activeTab === tab ? "bg-white/20" : "bg-foreground/10"}`}>
                      {PROGRAMS.filter((p) => p.level === tab).length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            </div>
          </Reveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <Link to={`/programs/${p.slug}`} className="glass glass-hover card-accent p-8 block h-full group rounded-2xl">
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                      <BookOpen size={20} className="text-primary group-hover:text-primary-foreground transition-colors" />
                    </div>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full ${
                      p.level === "Bachelors" ? "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
                      p.level === "Masters"   ? "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300" :
                      p.level === "Doctoral"  ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300" :
                                               "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                    }`}>
                      {p.level}
                    </span>
                  </div>
                  <h3 className="text-[22px] font-bold mb-2 group-hover:text-primary transition-colors">{p.name}</h3>
                  <p className="text-soft text-[14px] leading-relaxed mb-5 line-clamp-2">{p.desc}</p>
                  <span className="text-primary font-semibold text-sm inline-flex items-center gap-1.5 group-hover:gap-3 transition-all duration-200">
                    Explore Program <ArrowRight size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>

          {filteredPrograms.length === 0 && (
            <div className="text-center py-16 text-soft">No programs found in this category.</div>
          )}
        </div>
      </section>

      <UniversityMarquee />

      {/* ── WHY US ───────────────────────────────────────────────────────── */}
      <section className="py-12 md:py-24 relative">
        <div className="absolute inset-0 dot-grid opacity-25 pointer-events-none" />
        <div className="container-dg relative">
          <Reveal>
            <div className="max-w-2xl mb-8 md:mb-14">
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                {c.whyus_overline}
              </span>
              <h2 className="text-3xl md:text-[40px] font-bold leading-tight">{c.whyus_h2}</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyCards.map((card, i) => (
              <Reveal key={card.title || i} delay={i * 0.08}>
                <div className="glass glass-hover card-accent p-8 h-full rounded-2xl group">
                  <div className={`w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center mb-5 transition-transform duration-300 group-hover:scale-110 ${card.colors.bg}`}>
                    <card.icon size={22} className={card.colors.icon} />
                  </div>
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">{card.title}</h3>
                  <p className="text-soft text-sm leading-relaxed">{card.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/3 to-transparent pointer-events-none" />
        <div className="container-dg relative">
          <Reveal>
            <div className="max-w-2xl mb-10 md:mb-16 mx-auto text-center">
              <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                {c.how_overline}
              </span>
              <h2 className="text-3xl md:text-[40px] font-bold leading-tight">{c.how_h2}</h2>
            </div>
          </Reveal>
          <div className="relative grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-14 left-[20%] right-[20%] h-[2px]"
              style={{ background: "linear-gradient(90deg, hsl(var(--primary)/0), hsl(var(--primary)), hsl(var(--primary)/0))" }} />
            {steps.map((s, i) => (
              <Reveal key={s.num || i} delay={i * 0.12}>
                <div className="text-center relative group">
                  <div className="relative mx-auto w-20 h-20 sm:w-28 sm:h-28 mb-6 sm:mb-8">
                    {/* Outer ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary/20 group-hover:border-primary/50 transition-colors duration-500" />
                    {/* Inner circle */}
                    <div className="absolute inset-3 rounded-full flex items-center justify-center text-2xl font-extrabold text-primary-foreground transition-all duration-500 group-hover:scale-105"
                      style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(258 93% 65%))", boxShadow: "0 8px 32px hsl(var(--primary) / 0.4)" }}>
                      {s.num}
                    </div>
                  </div>
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">{s.title}</h3>
                  <p className="text-soft text-sm max-w-xs mx-auto leading-relaxed">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal>
            <div className="text-center mt-14">
              <Link to="/contact" className="btn-primary inline-flex">
                Start My Journey <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── SCHOOLING ────────────────────────────────────────────────────── */}
      <section className="py-10 md:py-20">
        <div className="container-dg">
          <Reveal>
            <div className="glass card-accent rounded-3xl p-6 sm:p-8 md:p-12 overflow-hidden relative">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
              <div className="grid md:grid-cols-3 gap-8 items-center relative">
                <div className="md:col-span-1">
                  <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
                    {c.schooling_overline}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">{c.schooling_h2}</h2>
                  <p className="text-soft text-sm leading-relaxed mb-5">{c.schooling_body}</p>
                  <Link to="/class-10-12" className="btn-primary text-sm px-6 py-3 inline-flex">
                    Learn More <ArrowRight size={16} />
                  </Link>
                </div>
                <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                  {[
                    { title: c.school_card1_title, sub: c.school_card1_sub, grade: "10th", color: "from-blue-500/10 to-violet-500/10" },
                    { title: c.school_card2_title, sub: c.school_card2_sub, grade: "12th", color: "from-violet-500/10 to-primary/10" },
                  ].map((card) => (
                    <Link key={card.title} to="/class-10-12"
                      className="glass glass-hover rounded-2xl p-6 block group bg-gradient-to-br"
                      style={{ backgroundImage: `linear-gradient(135deg, hsl(var(--primary)/0.06), hsl(217 91% 60% / 0.06))` }}>
                      <div className="text-4xl font-extrabold text-gradient mb-3">Class {card.grade}</div>
                      <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors">{card.title}</h3>
                      <p className="text-soft text-sm">{card.sub}</p>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────────────────── */}
      <section className="py-12 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="container-dg relative">
          <Reveal>
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-14">
              <div className="max-w-2xl">
                <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
                  {c.testimonials_overline}
                </span>
                <h2 className="text-3xl md:text-[40px] font-bold leading-tight">{c.testimonials_h2}</h2>
              </div>
              {/* Google rating badge */}
              <div className="flex items-center gap-3 glass rounded-2xl px-5 py-3 shrink-0">
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={16} className="fill-amber-400 text-amber-400" />)}
                </div>
                <div>
                  <div className="font-extrabold text-lg leading-none">4.9</div>
                  <div className="text-[11px] text-soft">Google Rating</div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* 2-row staggered grid */}
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <Reveal key={t.name + i} delay={i * 0.07}>
                <div className={`glass glass-hover card-accent rounded-2xl p-7 h-full flex flex-col ${i % 3 === 1 ? "md:mt-8" : ""}`}>
                  <div className="text-5xl font-serif text-primary/20 leading-none mb-2 select-none">"</div>
                  <p className="text-foreground/80 leading-relaxed text-[15px] flex-1 mb-5">{t.text}</p>
                  <div className="flex items-center gap-3 mt-auto pt-4 border-t border-foreground/8">
                    <img src={t.img} alt={t.name} loading="lazy" className="w-12 h-12 rounded-full object-cover border-2 border-primary/20" width={48} height={48} />
                    <div>
                      <div className="font-bold text-sm">{t.name}</div>
                      <div className="text-xs text-soft">{t.role}</div>
                    </div>
                    <div className="ml-auto flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={11} className="fill-amber-400 text-amber-400" />)}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────────── */}
      <section className="py-10 md:py-20">
        <div className="container-dg">
          <Reveal>
            <div className="rounded-[32px] relative overflow-hidden p-6 sm:p-10 md:p-16 text-center"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(258 93% 52%) 40%, hsl(217 91% 55%) 100%)" }}>
              {/* Decorative circles */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full" />
                <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-white/8 rounded-full" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full"
                  style={{ background: "radial-gradient(ellipse at center, rgba(255,255,255,0.07) 0%, transparent 70%)" }} />
              </div>
              <div className="relative">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-1.5 mb-6 text-white text-xs font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  Limited Spots This Week
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-[44px] font-extrabold text-white mb-3 leading-tight">{c.cta_h2}</h2>
                <p className="text-white/75 text-lg mb-8 max-w-xl mx-auto">{c.cta_subtext}</p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link to="/contact" className="inline-flex items-center gap-2 bg-white text-primary rounded-xl px-8 py-4 font-bold text-base hover:scale-[1.03] transition-transform shadow-2xl">
                    {c.cta_button} <ArrowRight size={18} />
                  </Link>
                  <a href="https://wa.me/919350199001"
                    target="_blank" rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-[#25D366] text-white rounded-xl px-8 py-4 font-bold text-base hover:scale-[1.03] transition-transform shadow-xl">
                    <MessageCircle size={18} /> WhatsApp Us
                  </a>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <FaqSection faqs={faqs} />

      {/* ── CONTACT ──────────────────────────────────────────────────────── */}
      <section id="contact" className="py-12 md:py-24">
        <div className="container-dg grid lg:grid-cols-2 gap-12 items-start">
          <Reveal>
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-5">
              {c.contact_overline}
            </span>
            <h2 className="text-3xl md:text-[40px] font-bold mb-5 leading-tight">{c.contact_h2}</h2>
            <p className="text-soft text-lg leading-relaxed mb-8">{c.contact_subtitle}</p>

            <div className="space-y-4">
              {[
                { icon: Phone,    label: "Call Us",            value: c.phone,            href: `tel:+91${c.phone}` },
                { icon: MessageCircle, label: "WhatsApp",      value: `+${c.whatsapp_number}`, href: `https://wa.me/${c.whatsapp_number}` },
                { icon: Award,    label: "Admissions",         value: c.email_admissions,  href: `mailto:${c.email_admissions}` },
                { icon: Sparkles, label: "General Queries",    value: c.email_queries,     href: `mailto:${c.email_queries}` },
              ].map(({ icon: Icon, label, value, href }) => (
                <a key={label} href={href}
                  className="flex items-center gap-4 p-4 glass rounded-2xl hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary transition-colors">
                    <Icon size={18} className="text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs text-soft uppercase tracking-wider">{label}</div>
                    <div className="font-semibold text-sm">{value}</div>
                  </div>
                  <ArrowRight size={14} className="ml-auto text-soft group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>

            <div className="mt-6 p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-3">
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-sm font-medium">{c.availability} · {c.address}</span>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <CounselingForm source="home-page" />
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Index;
