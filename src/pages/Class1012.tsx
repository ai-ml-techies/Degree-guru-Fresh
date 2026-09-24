import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CounselingForm } from "@/components/CounselingForm";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { Sparkles, ShieldCheck, CheckCircle2, GraduationCap, Clock, Award, BookOpen, ArrowRight, AlertCircle } from "lucide-react";
import classHero from "@/assets/class-hero.jpg";

export const Class1012 = () => {
  return (
    <>
      <Helmet>
        <title>Class 10 & Class 12 Online Open Schooling | Degree Guru</title>
        <meta
          name="description"
          content="Complete recognized Class 10 (Secondary) and Class 12 (Senior Secondary) schooling through recognized open schooling boards. 100% online exams, valid across India."
        />
        <link rel="canonical" href="https://degreeguru.in/class-10-12/" />
      </Helmet>

      {/* Hero */}
      <section className="relative py-10 md:py-16 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/50">
        <div className="container-dg relative z-10 mb-6">
          <AppBreadcrumb items={[{ label: "Open Schooling Hub" }]} />
        </div>
        <div className="container-dg relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/15 text-primary text-xs font-bold">
              <ShieldCheck size={14} /> Recognized Open Schooling Pathways
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Class 10 & Class 12 Online Schooling
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Complete your secondary or senior secondary certification from home with complete statutory validity across India. Qualify for university admissions, degree programs, and competitive examinations with 100% online exams.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <span className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-semibold text-foreground">
                ✓ Valid for All Online Degrees
              </span>
              <span className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-semibold text-foreground">
                ✓ 100% Online Exams
              </span>
              <span className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-semibold text-foreground">
                ✓ Affordable One-Time Fee (No EMI)
              </span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 bg-primary/15 rounded-[36px] blur-2xl pointer-events-none" />
            <img
              src={classHero}
              alt="Learner completing Class 10 and 12 online"
              className="relative rounded-[24px] w-full object-cover aspect-[4/3] shadow-2xl border border-border/60"
            />
          </div>
        </div>
      </section>

      {/* Program Cards */}
      <section className="py-14">
        <div className="container-dg grid md:grid-cols-2 gap-6 mb-12">
          {/* Class 10 Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase">
                  Secondary Schooling
                </span>
                <span className="text-xs text-muted-foreground font-semibold">Duration: Flexible</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Class 10 (Secondary)</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Continue your education even without a previous 8th or 9th marksheet, or if you never went to school. 100% online exams with complete nationwide validity.
              </p>
              <div className="p-3.5 rounded-xl bg-muted/40 text-xs text-foreground/90 space-y-1.5">
                <p><strong>Eligibility:</strong> Minimum 14 years of age with self-declaration.</p>
                <p><strong>Examinations:</strong> 100% Online Web-Proctored.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/class-10"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-md"
              >
                <span>View Class 10 Program Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          {/* Class 12 Card */}
          <div className="p-6 md:p-8 rounded-3xl bg-card border border-border/80 shadow-md space-y-4 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                  Senior Secondary
                </span>
                <span className="text-xs text-muted-foreground font-semibold">Duration: Flexible</span>
              </div>
              <h2 className="text-2xl font-bold text-foreground">Class 12 (Senior Secondary)</h2>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                Complete your 12th standard online in Science, Commerce, or Arts streams. Unlock undergraduate degree admissions (BCA, BBA, B.Com, BA) and career promotions.
              </p>
              <div className="p-3.5 rounded-xl bg-muted/40 text-xs text-foreground/90 space-y-1.5">
                <p><strong>Streams:</strong> Science (PCM/PCB), Commerce, Arts/Humanities.</p>
                <p><strong>Examinations:</strong> 100% Online Web-Proctored.</p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to="/class-12"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>View Class 12 Program Details</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>

        {/* Pricing Notice */}
        <div className="container-dg max-w-2xl mb-12">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-xs text-foreground/90 flex items-start gap-2.5">
            <AlertCircle size={16} className="text-amber-700 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Transparent Fee Policy:</strong> Schooling board admissions are billed as an affordable one-time payment. <strong>There is strictly NO EMI option available for Class 10 and 12.</strong>
            </div>
          </div>
        </div>

        {/* Counseling Desk */}
        <div className="container-dg max-w-2xl bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground">Talk to a Schooling Advisor</h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">100% Free guidance on admission eligibility, documents & fees.</p>
          </div>
          <CounselingForm defaultProgram="Class 10 & 12 Schooling" />
        </div>
      </section>
    </>
  );
};

export default Class1012;
