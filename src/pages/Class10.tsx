import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CounselingForm } from "@/components/CounselingForm";
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Clock,
  Laptop,
  ArrowRight,
  HeartHandshake
} from "lucide-react";
import classHero from "@/assets/class-hero.jpg";

export const Class10 = () => {
  return (
    <>
      <Helmet>
        <title>Class 10 Online Admission — Give Wings to Your Dreams | Degree Guru</title>
        <meta
          name="description"
          content="Complete your recognized Class 10 (Secondary) schooling online, even if you never attended school or don't have an 8th/9th marksheet. 100% online exams, valid across India."
        />
        <link rel="canonical" href="https://degreeguru.in/class-10/" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-12 md:py-20 overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background border-b border-border/50">
        <div className="container-dg relative z-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/15 text-primary text-xs font-bold">
              <Sparkles size={14} /> Flexible Recognized Open Secondary Certification
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Give Wings to Your Dreams. <br />
              <span className="text-gradient">Complete Class 10 Online.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Continue your education even if you don't have a previous 8th or 9th marksheet, or if you never went to school. Our flexible open schooling pathways enable you to earn a legally recognized secondary certificate with <strong>100% online examinations</strong>.
            </p>

            <div className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start">
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground">
                ✓ No Prior 8th/9th Marksheet Required
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground">
                ✓ 100% Online Web-Proctored Exams
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground">
                ✓ Valid for Class 12 & Govt Jobs
              </span>
            </div>

            <div className="pt-3">
              <a
                href="#class10-counseling"
                className="px-6 py-3.5 rounded-2xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all inline-flex items-center gap-2"
              >
                <GraduationCap size={18} /> Apply for Class 10 Online <ArrowRight size={15} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 bg-primary/20 rounded-[36px] blur-2xl pointer-events-none" />
              <img
                src={classHero}
                alt="Learner completing Class 10 secondary schooling online"
                className="relative rounded-3xl w-full object-cover aspect-[4/3] shadow-2xl border border-border/80"
              />
              <div className="absolute -bottom-4 -left-4 bg-card p-3.5 rounded-2xl border border-border shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold block">Legal Status</span>
                  <span className="text-xs font-extrabold text-foreground">AIU & COBSE Recognized</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why This Pathway is Revolutionary */}
      <section className="py-14 md:py-18 border-b border-border/50">
        <div className="container-dg">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">No Barriers to Learning</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mt-1">
              Education is for Everyone, at Any Age
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Whether you discontinued schooling due to family responsibilities or started working early, this certification gives you a legal secondary qualification.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                <HeartHandshake size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">No Prior Marksheet Needed</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                You do not need an 8th or 9th class pass certificate. Anyone with basic literacy who has attained the age of 14 can register based on self-declaration and birth proof.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <Laptop size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">100% Online Examinations</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Take your secondary school examinations from the comfort of your home on a computer or laptop. No traveling to crowded physical test centers.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded-2xl bg-[#6528f7]/10 text-[#6528f7] flex items-center justify-center font-bold">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-base font-bold text-foreground">Valid Across India</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                The secondary certificate issued is legally valid for admission into Class 11/12, ITI, Polytechnic diplomas, and central/state government job exams.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Curriculum & Subjects */}
      <section className="py-14 border-b border-border/50 bg-muted/20">
        <div className="container-dg max-w-4xl space-y-8">
          <div className="text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-foreground">
              Subjects Offered in Class 10
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Choose 5 subjects including at least one language to successfully complete your certificate.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs font-semibold text-foreground">
            <div className="p-3.5 rounded-2xl bg-card border border-border text-center">English</div>
            <div className="p-3.5 rounded-2xl bg-card border border-border text-center">Hindi</div>
            <div className="p-3.5 rounded-2xl bg-card border border-border text-center">Mathematics</div>
            <div className="p-3.5 rounded-2xl bg-card border border-border text-center">Science & Technology</div>
            <div className="p-3.5 rounded-2xl bg-card border border-border text-center">Social Science</div>
            <div className="p-3.5 rounded-2xl bg-card border border-border text-center">Economics / Business</div>
          </div>

          {/* CRITICAL PRICING & NO-EMI NOTICE */}
          <div className="p-5 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <AlertCircle size={16} /> Important Fee Notice
            </div>
            <p className="text-xs text-foreground/90 leading-relaxed font-medium">
              Schooling board registrations carry an affordable, transparent one-time admission fee. <strong>Please note that there is STRICTLY NO EMI option available for Class 10 and Class 12 enrollments.</strong> The fee is payable as a one-time transaction directly for examination and certification registration.
            </p>
          </div>
        </div>
      </section>

      {/* Counseling Form */}
      <section id="class10-counseling" className="py-16">
        <div className="container-dg max-w-2xl bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center mb-6">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
              Admissions Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
              Apply for Class 10 Online Admission
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Speak with a dedicated academic counselor to verify your age proof and get step-by-step guidance.
            </p>
          </div>

          <CounselingForm defaultProgram="Class 10 (Secondary)" />
        </div>
      </section>
    </>
  );
};

export default Class10;
