import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { 
  ArrowRight, 
  GraduationCap, 
  ShieldCheck, 
  Sparkles, 
  BookOpen, 
  Award, 
  TrendingUp, 
  Users, 
  Compass,
  Calculator,
  FileText,
  CheckCircle2,
  Clock,
  IndianRupee,
  Search,
  MessageCircle,
  HelpCircle,
  Building2,
  Check
} from "lucide-react";
import { UniversityMarquee } from "@/components/UniversityMarquee";
import { AiCareerAssistant } from "@/components/AiCareerAssistant";
import { RoiCalculator } from "@/components/RoiCalculator";
import { FaqSection } from "@/components/FaqSection";
import { CounselingForm } from "@/components/CounselingForm";
import { CollegeVidyaCourseExplorer } from "@/components/courses/CollegeVidyaCourseExplorer";
import { UniversitiesGridShowcase } from "@/components/universities/UniversitiesGridShowcase";
import { ToolsShowcase } from "@/components/tools/ToolsShowcase";
import { EmiCalculator } from "@/components/tools/EmiCalculator";
import { CORE_COURSES } from "@/data/courses";
import { ACTIVE_ONLINE_UNIVERSITIES } from "@/data/universities";
import { BLOG_POSTS } from "@/data/blogs";
import { fetchHomeContent } from "@/lib/api";
import heroDesktop from "@/assets/hero-desktop.jpg";

export const Index = () => {
  const { data: homeContent } = useQuery({
    queryKey: ["home-content"],
    queryFn: fetchHomeContent,
    staleTime: 1000 * 60 * 5,
  });

  return (
    <>
      <Helmet>
        <title>Degree Guru — Education Marketplace, Career Discovery & Job Platform</title>
        <meta
          name="description"
          content="Explore online degrees, compare accredited universities, find career paths, build ATS resumes and discover jobs — all in one place. 100% free career discovery."
        />
        <link rel="canonical" href="https://degreeguru.in/" />
      </Helmet>

      {/* 1. HERO SECTION (Prompt Rule #7 & #2) */}
      <section className="relative pt-6 pb-14 md:pb-20 overflow-hidden bg-gradient-to-b from-primary/8 via-background to-background border-b border-border/50">
        <div className="container-dg">
          {/* Top Value Pill */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-border shadow-sm text-xs font-semibold text-foreground">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>India's Modern Education, Career & Employment Ecosystem</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
                Accelerate Your Career Growth. <br className="hidden sm:inline" />
                <span className="text-gradient">Earn a Top University Degree.</span>
              </h1>

              <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Compare accredited UGC-approved online universities, calculate 0% EMI installments, and get 100% free personalized counseling.
              </p>

              {/* Primary & Counselor CTAs */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2">
                <Link
                  to="/courses"
                  className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center gap-2"
                >
                  <GraduationCap size={18} /> Find My Course <ArrowRight size={15} />
                </Link>

                <a
                  href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20would%20like%20to%20talk%20to%20a%20counselor"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 font-bold text-sm transition-all flex items-center gap-2"
                >
                  <MessageCircle size={17} /> Talk to a Counselor
                </a>
              </div>
            </div>

            {/* Right Hero Image (Natural young professional, not generic stock) */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 via-[#6528f7]/15 to-transparent rounded-[36px] blur-2xl pointer-events-none" />
                <img
                  src={heroDesktop}
                  alt="Young student and professional discovering online degree options on Degree Guru"
                  className="relative rounded-3xl w-full object-cover aspect-[4/3] shadow-2xl border border-border/80"
                  loading="eager"
                />

                {/* Floating Metric Card 1 */}
                <div className="absolute -bottom-4 -left-4 sm:bottom-4 sm:-left-6 bg-card/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-border shadow-xl flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <TrendingUp size={20} />
                  </div>
                  <div>
                    <span className="text-[11px] text-muted-foreground font-semibold block">Average Career Jump</span>
                    <span className="text-sm font-extrabold text-foreground">+55% Salary Hike</span>
                  </div>
                </div>

                {/* Floating Metric Card 2 */}
                <div className="absolute -top-3 -right-3 bg-card/95 backdrop-blur-md px-3.5 py-2 rounded-xl border border-border shadow-lg flex items-center gap-2 text-xs font-bold text-foreground">
                  <ShieldCheck size={16} className="text-primary" />
                  <span>100% Free Counseling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. AI CAREER ASSISTANT ("Ask Degree Guru") */}
      <section id="ask-degree-guru" className="py-12 md:py-16 bg-muted/20 border-b border-border/50">
        <div className="container-dg">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Meet Your AI Career Advisor
            </h2>
          </div>

          <AiCareerAssistant />
        </div>
      </section>

      {/* 3. EXPLORE ONLINE DEGREE COURSES */}
      <section className="py-12 md:py-16 border-b border-border/50 bg-background">
        <div className="container-dg space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
              Explore Programs by Category & Level
            </h2>
          </div>

          <CollegeVidyaCourseExplorer />
        </div>
      </section>

      {/* 4. UGC-APPROVED UNIVERSITIES VISIBILITY SECTION (College Vidya 18-University Grid) */}
      <UniversitiesGridShowcase />

      {/* 5. INFINITE UNIVERSITY LOGO TICKER (Real Logos Scrolling) */}
      <UniversityMarquee />

      {/* 5. TOOLS & CALCULATORS SHOWCASE (College Vidya Inspired with EMI Calculator) */}
      <section className="py-16 md:py-20 border-b border-border/50">
        <div className="container-dg space-y-16">
          <ToolsShowcase />

          {/* Interactive EMI Calculator Embed */}
          <div className="pt-4">
            <EmiCalculator />
          </div>
        </div>
      </section>

      {/* 8. AI RESUME BUILDER */}
      <section className="py-14 md:py-18 bg-muted/20 border-b border-border/50">
        <div className="container-dg max-w-4xl">
          <div className="p-8 sm:p-10 rounded-3xl bg-card/75 dark:bg-card/40 backdrop-blur-md border border-border/80 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 max-w-xl">
              <div className="w-12 h-12 rounded-2xl bg-[#6528f7]/10 text-[#6528f7] flex items-center justify-center">
                <FileText size={24} />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl sm:text-3xl font-black text-foreground">AI Resume Builder</h3>
                <span className="px-2.5 py-0.5 rounded-full bg-[#6528f7]/15 text-[#6528f7] text-[10px] font-bold">
                  ATS Ready
                </span>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Turn your accomplishments into quantified, ATS-friendly statements. Compare against target job descriptions to discover missing keywords before applying.
              </p>
              <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold text-foreground/80">
                <span className="px-2.5 py-1 rounded-lg bg-muted">✓ AI Achievement Quantifier</span>
                <span className="px-2.5 py-1 rounded-lg bg-muted">✓ ATS Match Score</span>
                <span className="px-2.5 py-1 rounded-lg bg-muted">✓ Clean 1-Page PDF</span>
              </div>
            </div>

            <div className="shrink-0">
              <Link
                to="/resume-builder"
                className="px-6 py-3.5 rounded-xl bg-[#6528f7] hover:bg-[#551ebd] text-white text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-[#6528f7]/25 hover:scale-[1.02]"
              >
                Build My ATS Resume Now <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 10. WHY DEGREE GURU (Honest, Unbiased & Verified) */}
      <section className="py-16 md:py-20 border-b border-border/50">
        <div className="container-dg max-w-5xl">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">Trust & Integrity</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mt-1">
              Why Thousands Trust Degree Guru
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              No exaggerated claims. No spam calls. Pure factual guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">100% Free & Unbiased</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Counseling at Degree Guru is always 100% free for students and professionals. We present objective fee schedules and curriculum comparisons.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                <Award size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Statutory UGC-DEB Approvals</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                We only list accredited universities carrying verified statutory distance and online education entitlements, ensuring your degree is valid for government jobs.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-[#6528f7] flex items-center justify-center">
                <IndianRupee size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Transparent Fee & 0% EMI</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Zero hidden counseling charges. Access verified no-cost EMI installments starting from ₹3,500/month disbursed directly to universities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 11. LATEST CAREER & EDUCATION BLOGS */}
      <section className="py-16 md:py-20 border-b border-border/50">
        <div className="container-dg">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-primary">Knowledge Hub</span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight mt-1">
                Latest Career & Education Guides
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Factual comparisons for informed choices.
              </p>
            </div>
            <Link to="/blog" className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View All Articles <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {BLOG_POSTS.slice(0, 2).map((post) => (
              <div key={post.slug} className="p-6 rounded-3xl bg-card border border-border/80 shadow-md space-y-3">
                <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                  {post.category}
                </span>
                <h3 className="text-lg font-bold text-foreground hover:text-primary transition-colors">
                  <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {post.summary}
                </p>
                <div className="pt-2 flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">{post.readTime}</span>
                  <Link to={`/blog/${post.slug}`} className="text-primary font-bold hover:underline flex items-center gap-1">
                    Read Article →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 12. FAQS SECTION */}
      <FaqSection />

      {/* 13. FINAL STRONG CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-[#6528f7] via-[#7c3aed] to-[#551ebd] text-white text-center relative overflow-hidden">
        <div className="container-dg max-w-3xl space-y-6 relative z-10">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight">
            Ready to Take the Next Step in Your Education & Career?
          </h2>
          <p className="text-base sm:text-lg text-white/90 max-w-xl mx-auto leading-relaxed">
            Get personalized advice, compare top UGC-approved universities, and take charge of your professional journey with Degree Guru.
          </p>
          <div className="pt-2 flex flex-wrap justify-center gap-3.5">
            <Link
              to="/courses"
              className="px-7 py-3.5 rounded-full bg-white text-primary font-extrabold text-sm hover:bg-neutral-100 transition-all shadow-xl"
            >
              Explore All Online Degrees
            </Link>
            <a
              href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20want%20to%20know%20my%20options"
              target="_blank"
              rel="noreferrer"
              className="px-7 py-3.5 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white font-extrabold text-sm transition-all shadow-xl flex items-center gap-2"
            >
              <MessageCircle size={18} /> Chat on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
};
export default Index;
