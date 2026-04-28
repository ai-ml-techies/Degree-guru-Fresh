import { Link } from "react-router-dom";
import { ArrowRight, GraduationCap, ShieldCheck, Sparkles, Briefcase, BookOpen, Award, Star } from "lucide-react";
import { Blobs } from "@/components/Blobs";
import { Reveal } from "@/components/Reveal";
import { UniversityMarquee } from "@/components/UniversityMarquee";
import { CounselingForm } from "@/components/CounselingForm";
import { PROGRAMS } from "@/data/programs";
import heroDesktop from "@/assets/hero-desktop.jpg";
import heroTablet from "@/assets/hero-tablet.jpg";
import heroMobile from "@/assets/hero-mobile.jpg";
import t1 from "@/assets/testimonial-1.jpg";
import t2 from "@/assets/testimonial-2.jpg";
import t3 from "@/assets/testimonial-3.jpg";

const Index = () => {
  return (
    <>
      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden pt-12 pb-20">
        <Blobs />
        <div className="container-dg relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          <Reveal>
            <p className="overline mb-5">Free Career Counseling</p>
            <h1 className="font-extrabold leading-[1.05] text-[40px] sm:text-[52px] lg:text-[64px] xl:text-[72px] mb-6">
              Your degree, sorted, for free.
            </h1>
            <p className="text-soft text-lg leading-[1.7] max-w-[520px] mb-8">
              India's top universities. Honest counseling. Easy EMI options.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/contact" className="btn-primary">
                Get Free Counseling <ArrowRight size={18} />
              </Link>
              <Link to="/programs" className="btn-outline">
                Explore Programs
              </Link>
            </div>
            <div className="flex flex-wrap items-center gap-6 mt-10 text-xs text-soft">
              <span className="flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> AICTE Approved</span>
              <span className="flex items-center gap-2"><Award size={14} className="text-primary" /> UGC Entitled</span>
              <span className="flex items-center gap-2"><Sparkles size={14} className="text-primary" /> Easy EMI</span>
            </div>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="relative">
              <div className="absolute -inset-8 bg-primary/15 rounded-[48px] blur-3xl" />
              <picture>
                <source media="(max-width: 640px)" srcSet={heroMobile} />
                <source media="(max-width: 1024px)" srcSet={heroTablet} />
                <img
                  src={heroDesktop}
                  alt="Confident Indian student ready for an online degree"
                  className="relative rounded-[32px] w-full object-cover aspect-[4/5] shadow-2xl"
                  width={900}
                  height={1100}
                />
              </picture>
              <div className="absolute -bottom-6 -left-6 glass px-5 py-4 hidden md:flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/15 flex items-center justify-center">
                  <GraduationCap size={20} className="text-primary" />
                </div>
                <div>
                  <div className="text-xs text-soft">Counseled today</div>
                  <div className="font-bold">+182 students</div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TRUST BAR */}
      <section className="bg-primary text-primary-foreground py-12">
        <div className="container-dg grid grid-cols-3 gap-6 text-center">
          {[
            { n: "50,000+", l: "Students Guided" },
            { n: "600+", l: "University Partners" },
            { n: "100%", l: "Free Forever" },
          ].map((s) => (
            <Reveal key={s.l}>
              <div className="text-3xl md:text-[40px] font-extrabold">{s.n}</div>
              <div className="text-[13px] uppercase tracking-wider opacity-90 mt-1">{s.l}</div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* VISION */}
      <section className="py-24 relative">
        <div className="container-dg">
          <Reveal>
            <div className="glass max-w-[900px] mx-auto p-10 md:p-14 text-center">
              <p className="overline mb-4">Our Vision</p>
              <h2 className="text-3xl md:text-[40px] font-bold mb-6 leading-tight">
                Empowering Viksit Bharat Through Education
              </h2>
              <p className="text-soft text-lg leading-[1.8]">
                At Degree Guru, we believe every Indian deserves honest career guidance. Our mission aligns with Viksit Bharat: empowering youth through education and informed choices. We partner with leading universities to build a platform where no student pays for counseling, where every professional finds their next step, and where the right online degree opens doors. This is a movement toward an educated, empowered India.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* PROGRAMS */}
      <section className="py-24">
        <div className="container-dg">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="overline mb-3">Explore Programs</p>
              <h2 className="text-3xl md:text-[40px] font-bold mb-4">Online Programs for Every Career Stage</h2>
              <p className="text-soft text-lg">
                Bachelors, masters, doctorate, and certifications. All delivered online. All guided by us for free.
              </p>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROGRAMS.map((p, i) => (
              <Reveal key={p.slug} delay={i * 0.05}>
                <Link to={`/programs/${p.slug}`} className="glass glass-hover p-8 block h-full group">
                  <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-5 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <BookOpen size={20} className="text-primary group-hover:text-primary-foreground" />
                  </div>
                  <p className="overline mb-2">{p.level}</p>
                  <h3 className="text-[22px] font-bold mb-2">{p.name}</h3>
                  <p className="text-soft text-[15px] leading-relaxed mb-5">{p.desc}</p>
                  <span className="text-primary font-semibold text-sm inline-flex items-center gap-1">
                    Learn More <ArrowRight size={14} />
                  </span>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <UniversityMarquee />

      {/* WHY US */}
      <section className="py-24">
        <div className="container-dg">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="overline mb-3">Why Trust Us</p>
              <h2 className="text-3xl md:text-[40px] font-bold">Why Thousands Choose Degree Guru</h2>
            </div>
          </Reveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: ShieldCheck, t: "Completely Free Counseling", d: "Universities support our work, so students pay nothing. Honest, unbiased advice for every learner and professional." },
              { icon: Sparkles, t: "Easy EMI Options", d: "Most partner universities offer no-cost or low-cost EMI plans, so you never have to pause your dream for fees." },
              { icon: Award, t: "Scholarships & Recruitment Support", d: "We help you find scholarships and connect with recruitment opportunities after your degree." },
              { icon: Briefcase, t: "Industry Ready Advice", d: "Our counselors understand current job markets, salary trends and what hiring managers actually look for." },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 0.08}>
                <div className="glass glass-hover p-8 h-full">
                  <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-5">
                    <c.icon size={22} className="text-primary" />
                  </div>
                  <h3 className="text-lg font-bold mb-3">{c.t}</h3>
                  <p className="text-soft text-sm leading-relaxed">{c.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-dg">
          <Reveal>
            <div className="max-w-2xl mb-16">
              <p className="overline mb-3">Your Journey</p>
              <h2 className="text-3xl md:text-[40px] font-bold">3 Steps to Your Online Degree</h2>
            </div>
          </Reveal>
          <div className="relative grid md:grid-cols-3 gap-10">
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0" />
            {[
              { n: "01", t: "Share Your Profile", d: "Tell us your background and career goals" },
              { n: "02", t: "Get Recommendations", d: "Receive your personalized university and program shortlist" },
              { n: "03", t: "Enroll with Confidence", d: "We guide your application until you are admitted" },
            ].map((s, i) => (
              <Reveal key={s.n} delay={i * 0.1}>
                <div className="text-center relative">
                  <div className="w-24 h-24 mx-auto rounded-full bg-primary text-primary-foreground flex items-center justify-center text-2xl font-extrabold mb-6 shadow-xl shadow-primary/30 relative z-10">
                    {s.n}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{s.t}</h3>
                  <p className="text-soft text-sm max-w-xs mx-auto">{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CLASS 10 / 12 SMALL SECTION */}
      <section className="py-20">
        <div className="container-dg">
          <Reveal>
            <div className="glass p-8 md:p-12">
              <div className="grid md:grid-cols-3 gap-8 items-center">
                <div className="md:col-span-1">
                  <p className="overline mb-2">Schooling Online</p>
                  <h2 className="text-2xl md:text-3xl font-bold mb-3">Complete Your Schooling Online</h2>
                  <p className="text-soft text-sm leading-relaxed">
                    Missed formal schooling? You can now complete Class 10 or Class 12 online from home. Flexible learning for every age.
                  </p>
                </div>
                <div className="md:col-span-2 grid sm:grid-cols-2 gap-4">
                  <Link to="/class-10-12" className="glass glass-hover p-6 block">
                    <h3 className="text-lg font-bold mb-1">Class 10 Online</h3>
                    <p className="text-soft text-sm">Secondary education from home.</p>
                  </Link>
                  <Link to="/class-10-12" className="glass glass-hover p-6 block">
                    <h3 className="text-lg font-bold mb-1">Class 12 Online</h3>
                    <p className="text-soft text-sm">Senior secondary, your way.</p>
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24">
        <div className="container-dg">
          <Reveal>
            <div className="max-w-2xl mb-14">
              <p className="overline mb-3">Stories</p>
              <h2 className="text-3xl md:text-[40px] font-bold">Real Learners, Real Results</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { img: t1, name: "Priya Sharma", role: "Online MBA, NMIMS", q: "Degree Guru helped me compare four universities honestly. I picked the right MBA in a week." },
              { img: t2, name: "Rohan Verma", role: "Online BCA, LPU", q: "I work full-time. Their counselor matched a program that fits my schedule perfectly." },
              { img: t3, name: "Aisha Khan", role: "Online MA, Amity", q: "Free, friendly and patient. They answered every question without any pressure." },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="glass glass-hover p-8 h-full">
                  <div className="flex items-center gap-4 mb-5">
                    <img src={t.img} alt={t.name} loading="lazy" className="w-14 h-14 rounded-full object-cover" width={56} height={56} />
                    <div>
                      <div className="font-bold">{t.name}</div>
                      <div className="text-xs text-soft">{t.role}</div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, k) => (
                      <Star key={k} size={14} className="fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="text-soft leading-relaxed">{t.q}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section className="py-20">
        <div className="container-dg">
          <Reveal>
            <div className="rounded-[32px] bg-gradient-to-br from-primary via-primary to-primary-glow text-primary-foreground p-12 md:p-16 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-20" style={{ background: "radial-gradient(circle at 30% 20%, white, transparent 50%)" }} />
              <h2 className="relative text-3xl md:text-[40px] font-bold mb-6 leading-tight">
                Ready to Choose Your Online Degree?
              </h2>
              <Link to="/contact" className="relative inline-flex items-center gap-2 bg-white text-primary rounded-xl px-8 py-4 font-bold text-base hover:scale-[1.03] transition-transform shadow-2xl">
                Talk to a Counselor. It is Free. <ArrowRight size={18} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-24">
        <div className="container-dg grid lg:grid-cols-2 gap-12">
          <Reveal>
            <p className="overline mb-3">Talk To Us</p>
            <h2 className="text-3xl md:text-[40px] font-bold mb-5 leading-tight">Get Free Counseling</h2>
            <p className="text-soft text-lg leading-relaxed mb-8">
              Fill in your details. Our experts will call you back within 2 hours.
            </p>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">P</span> 9350199001</div>
              <div className="flex items-center gap-3"><span className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-bold">E</span> admissions@degreeguru.in</div>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <CounselingForm />
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Index;
