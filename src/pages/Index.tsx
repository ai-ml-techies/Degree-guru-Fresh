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
  Check,
} from "lucide-react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { WhatsAppCircleIcon } from "@/components/SocialIcons";

export const Index = () => {
  const [counselingOpen, setCounselingOpen] = useState(false);
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
      <section id="hero" className="relative pt-6 sm:pt-8 md:pt-10 pb-14 md:pb-20 overflow-hidden bg-gradient-to-b from-primary/8 via-background to-background border-b border-border/50 scroll-mt-28 md:scroll-mt-36">
        <div className="container-dg">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
              <h1 className="text-3xl sm:text-5xl lg:text-5xl xl:text-6xl font-black text-foreground tracking-normal leading-[1.24] sm:leading-[1.26] md:leading-[1.32]">
                Not Sure What’s Next? <span className="block text-gradient mt-1">Find Your Growth Roadmap</span>
              </h1>

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
                  className="px-5 py-3.5 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 text-emerald-700 dark:text-emerald-400 font-bold text-sm transition-all flex items-center gap-2 group"
                >
                  <WhatsAppCircleIcon className="w-5 h-5 rounded-full shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Talk to a Counselor</span>
                </a>
              </div>
            </div>

            {/* Right Hero Image (Enlarged, natural young professional, not generic stock) */}
            <div className="lg:col-span-6 relative">
              <div className="relative mx-auto max-w-lg sm:max-w-xl lg:max-w-none">
                <div className="absolute -inset-6 bg-gradient-to-tr from-primary/25 via-[#6528f7]/20 to-transparent rounded-[44px] blur-3xl pointer-events-none" />
                <img
                  src={heroDesktop}
                  alt="Young student and professional discovering online degree options on Degree Guru"
                  className="relative rounded-3xl w-full object-cover aspect-[4/3] sm:aspect-[1.15/1] lg:aspect-[1/1] xl:aspect-[1.05/1] max-h-[520px] shadow-2xl border border-border/80"
                  loading="eager"
                />
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
              Explore Online Degree Programs
            </h2>
          </div>

          <CollegeVidyaCourseExplorer />
        </div>
      </section>

      {/* 4. UGC-APPROVED UNIVERSITIES VISIBILITY SECTION (College Vidya 18-University Grid) */}
      <UniversitiesGridShowcase />


      {/* 5. TOOLS & CALCULATORS SHOWCASE */}
      <section className="py-10 md:py-14 border-b border-border/50">
        <div className="container-dg space-y-10">
          <ToolsShowcase />

          {/* Interactive EMI Calculator Embed */}
          <div className="pt-2">
            <EmiCalculator />
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
            </div>
            <Link to="/blog" className="text-xs sm:text-sm font-bold text-primary hover:underline flex items-center gap-1">
              View All Articles <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
            {BLOG_POSTS.slice(0, 3).map((post) => (
              <div
                key={post.slug}
                className="rounded-3xl bg-card border border-border/80 shadow-md hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  {/* Blog Image */}
                  <div className="relative w-full aspect-[16/10] overflow-hidden bg-muted">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="px-2.5 py-1 rounded-full bg-background/90 backdrop-blur-md text-foreground text-[10px] font-black uppercase tracking-wider shadow-sm border border-border/60">
                        {post.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-snug line-clamp-2">
                      <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                      {post.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 pb-5 pt-3 flex justify-between items-center text-xs border-t border-border/40">
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
            Not Sure Where Your Career Is Going?
          </h2>
          <div className="pt-2 flex justify-center">
            <button
              type="button"
              onClick={() => setCounselingOpen(true)}
              className="px-9 py-4 rounded-full bg-white text-[#6528f7] font-black text-sm sm:text-base hover:bg-neutral-100 transition-all shadow-2xl hover:scale-105 active:scale-95 flex items-center gap-2.5"
            >
              <Sparkles size={18} className="text-[#6528f7]" />
              <span>Request Free Counseling</span>
            </button>
          </div>
        </div>
      </section>

      {/* Free Counseling Lead Modal */}
      <Dialog open={counselingOpen} onOpenChange={setCounselingOpen}>
        <DialogContent className="max-w-md p-5 sm:p-6 rounded-3xl bg-card border border-border shadow-2xl max-h-[92vh] overflow-y-auto">
          <DialogHeader className="pb-1 text-left">
            <DialogTitle className="text-lg sm:text-xl font-black text-foreground tracking-tight">
              Need Right Guidance?
            </DialogTitle>
          </DialogHeader>
          <CounselingForm
            buttonLabel="Request Free Counseling Call"
            source="home-pre-footer-cta"
            onSubmitDone={() => setCounselingOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Index;
