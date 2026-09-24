import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { CounselingForm } from "@/components/CounselingForm";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import {
  ShieldCheck,
  GraduationCap,
  Sparkles,
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Laptop,
  ArrowRight,
  TrendingUp
} from "lucide-react";
import classHero from "@/assets/class-hero.jpg";

export const Class12 = () => {
  return (
    <>
      <Helmet>
        <title>Class 12 Online Admission (Senior Secondary) — 100% Online Exams | Degree Guru</title>
        <meta
          name="description"
          content="Complete your recognized Class 12 (Senior Secondary) schooling online. Science, Commerce, and Arts streams with 100% online examinations. Valid for university degrees and competitive exams."
        />
        <link rel="canonical" href="https://degreeguru.in/class-12/" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative py-10 md:py-16 overflow-hidden bg-gradient-to-b from-emerald-500/10 via-background to-background border-b border-border/50">
        <div className="container-dg relative z-10 mb-6">
          <AppBreadcrumb items={[{ label: "Open Schooling", href: "/class-10-12" }, { label: "Class 12" }]} />
        </div>
        <div className="container-dg relative z-10 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              <Sparkles size={14} /> Senior Secondary Certification Pathway
            </div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
              Complete Class 12 Online. <br />
              <span className="text-gradient">Unlock Your College & Career Path.</span>
            </h1>

            <p className="text-base sm:text-lg text-muted-foreground leading-relaxed">
              Earn your government-recognized Class 12 Senior Secondary certificate through flexible online schooling. Qualify for undergraduate degrees (Online BCA, BBA, B.Com, BA), competitive examinations, and corporate career promotions with <strong>100% online exams</strong>.
            </p>

            <div className="flex flex-wrap gap-2 pt-2 justify-center lg:justify-start">
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground">
                ✓ Science, Commerce & Arts Streams
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground">
                ✓ 100% Online Web-Proctored Exams
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-bold text-foreground">
                ✓ Transfer of Credit (TOC) Supported
              </span>
            </div>

            <div className="pt-3">
              <a
                href="#class12-counseling"
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm shadow-xl shadow-emerald-600/25 transition-all inline-flex items-center gap-2"
              >
                <GraduationCap size={18} /> Apply for Class 12 Online <ArrowRight size={15} />
              </a>
            </div>
          </div>

          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md">
              <div className="absolute -inset-4 bg-emerald-500/20 rounded-[36px] blur-2xl pointer-events-none" />
              <img
                src={classHero}
                alt="Student studying Class 12 senior secondary online"
                className="relative rounded-3xl w-full object-cover aspect-[4/3] shadow-2xl border border-border/80"
              />
              <div className="absolute -bottom-4 -left-4 bg-card p-3.5 rounded-2xl border border-border shadow-xl flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <span className="text-[11px] text-muted-foreground font-semibold block">University Validity</span>
                  <span className="text-xs font-extrabold text-foreground">Eligible for All UGC Degrees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 Streams Available */}
      <section className="py-14 md:py-18 border-b border-border/50">
        <div className="container-dg">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">Stream Options</span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground mt-1">
              Choose Your Class 12 Stream
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2">
              Select the stream matching your higher education aspirations and career target.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Science */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-[#6528f7]/15 text-[#6528f7] dark:text-purple-300 text-[10px] font-bold uppercase">
                Science Stream
              </span>
              <h3 className="text-xl font-bold text-foreground">Science (PCM / PCB)</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Ideal for aspiring engineers, IT professionals, medical technicians, and science graduates.
              </p>
              <div className="pt-2 text-xs font-semibold text-foreground/90 space-y-1">
                <div>• Physics, Chemistry, Mathematics</div>
                <div>• Biology, English, Computer Science</div>
              </div>
            </div>

            {/* Commerce */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold uppercase">
                Commerce Stream
              </span>
              <h3 className="text-xl font-bold text-foreground">Commerce & Accounts</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Direct pathway to Online B.Com, Online BBA, Chartered Accountancy (CA), and banking careers.
              </p>
              <div className="pt-2 text-xs font-semibold text-foreground/90 space-y-1">
                <div>• Accountancy, Business Studies</div>
                <div>• Economics, English, Mathematics</div>
              </div>
            </div>

            {/* Arts */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
              <span className="px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase">
                Humanities Stream
              </span>
              <h3 className="text-xl font-bold text-foreground">Arts & Humanities</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Preparation for civil service examinations, public administration, law (LLB), and creative media fields.
              </p>
              <div className="pt-2 text-xs font-semibold text-foreground/90 space-y-1">
                <div>• Political Science, History, Sociology</div>
                <div>• Psychology, English, Hindi</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Pricing & NO-EMI NOTICE */}
      <section className="py-12 border-b border-border/50 bg-muted/20">
        <div className="container-dg max-w-3xl">
          <div className="p-6 rounded-3xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
            <div className="flex items-center gap-2 text-amber-800 dark:text-amber-400 font-extrabold text-xs uppercase tracking-wider">
              <AlertCircle size={16} /> Important Fee Structure Notice
            </div>
            <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed font-medium">
              Schooling enrollment fees are structured as an affordable one-time payment covering registration, curriculum material, and examination hall tickets. <strong>Please note that there is STRICTLY NO EMI option available for Class 10 and Class 12 enrollments.</strong> Complete fee must be remitted as a one-time payment.
            </p>
          </div>
        </div>
      </section>

      {/* Counseling Desk */}
      <section id="class12-counseling" className="py-16">
        <div className="container-dg max-w-2xl bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl">
          <div className="text-center mb-6">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
              Class 12 Desk
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
              Apply for Class 12 Online Admission
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Check your eligibility, stream availability, and transfer of credit (TOC) with our counselors.
            </p>
          </div>

          <CounselingForm defaultProgram="Class 12 (Senior Secondary)" />
        </div>
      </section>
    </>
  );
};

export default Class12;
