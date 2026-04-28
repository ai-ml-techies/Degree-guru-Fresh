import { useParams, Link, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { ArrowRight, ChevronRight, GraduationCap, Briefcase, Award, ShieldCheck, Star, Wallet } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { CounselingForm } from "@/components/CounselingForm";
import { PROGRAMS } from "@/data/programs";
import programHero from "@/assets/program-hero.jpg";

// Universities relevant per program. NMIMS excluded from BBA.
const universitiesForProgram = (slug: string) => {
  const all = [
    { name: "Amity University Online", note: "Global presence, multiple campuses, strong alumni network" },
    { name: "NMIMS Online", note: "Premium business school heritage" },
    { name: "OP Jindal Global University Online", note: "Top ranked private university" },
    { name: "Lovely Professional University (LPU) Online", note: "Diverse programs, large alumni network" },
    { name: "Amrita Vishwa Vidyapeetham Online", note: "Top NIRF ranked institution" },
    { name: "Shoolini Online", note: "Research-led learning" },
    { name: "Galgotias University Online", note: "Industry-focused curriculum" },
    { name: "Parul University Online", note: "Wide industry partnerships" },
  ];
  let pool = all;
  if (slug === "online-bba") pool = all.filter(u => u.name !== "NMIMS Online");
  return pool.slice(0, 6);
};

const careerScope = (slug: string) => {
  const map: Record<string, { roles: string[]; salary: string }> = {
    "online-mba": { roles: ["Business Manager", "Product Manager", "Consultant", "Entrepreneur"], salary: "INR 6 to 25 LPA" },
    "online-bba": { roles: ["Business Analyst", "Marketing Executive", "Operations Lead"], salary: "INR 3 to 8 LPA" },
    "online-bca": { roles: ["Software Developer", "Web Developer", "QA Engineer"], salary: "INR 3 to 7 LPA" },
    "online-mca": { roles: ["Senior Developer", "DevOps Engineer", "Tech Lead"], salary: "INR 6 to 18 LPA" },
    "online-ba": { roles: ["Content Writer", "Civil Services Aspirant", "Educator"], salary: "INR 2.5 to 6 LPA" },
    "online-ma": { roles: ["Researcher", "Educator", "Policy Analyst"], salary: "INR 4 to 9 LPA" },
    "online-bcom": { roles: ["Accountant", "Tax Associate", "Banking Executive"], salary: "INR 3 to 7 LPA" },
    "online-mcom": { roles: ["Finance Manager", "Audit Lead", "Tax Consultant"], salary: "INR 5 to 12 LPA" },
    "online-dba": { roles: ["Senior Consultant", "Director", "Educator"], salary: "INR 15 to 40 LPA" },
    "phd": { roles: ["Researcher", "Professor", "Subject Expert"], salary: "INR 8 to 20 LPA" },
    "certifications": { roles: ["Skill-based roles across domains"], salary: "Varies by domain" },
  };
  return map[slug] || { roles: ["Diverse career paths"], salary: "Varies by role" };
};

const ProgramDetail = () => {
  const { slug } = useParams();
  const program = PROGRAMS.find(p => p.slug === slug);

  useEffect(() => {
    if (program) {
      document.title = `${program.name} | Free Counseling & Guidance | Degree Guru`;
      const meta = document.querySelector('meta[name="description"]');
      if (meta) meta.setAttribute("content", `${program.name} (${program.full}). Free career counseling, easy EMI options and university comparison from Degree Guru.`);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [program]);

  if (!program) return <Navigate to="/programs" replace />;

  const universities = universitiesForProgram(program.slug);
  const career = careerScope(program.slug);

  return (
    <>
      {/* HERO */}
      <section className="relative py-20 overflow-hidden">
        <Blobs />
        <div className="container-dg relative z-10">
          <nav className="flex items-center gap-2 text-xs text-soft mb-8">
            <Link to="/" className="hover:text-primary">Home</Link>
            <ChevronRight size={12} />
            <Link to="/programs" className="hover:text-primary">Programs</Link>
            <ChevronRight size={12} />
            <span className="font-semibold text-foreground">{program.name}</span>
          </nav>
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <Reveal>
              <p className="overline mb-3">{program.level}</p>
              <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.05] mb-5">
                {program.name}
              </h1>
              <p className="text-soft text-lg max-w-xl mb-8">
                {program.tagline}
              </p>
              <div className="flex flex-wrap gap-3">
                <span className="glass px-4 py-2 text-sm font-semibold flex items-center gap-2"><ShieldCheck size={14} className="text-primary" /> UGC Entitled</span>
                <span className="glass px-4 py-2 text-sm font-semibold flex items-center gap-2"><Award size={14} className="text-primary" /> AICTE Approved</span>
                <span className="glass px-4 py-2 text-sm font-semibold flex items-center gap-2"><Wallet size={14} className="text-primary" /> Easy EMI</span>
              </div>
            </Reveal>
            <Reveal delay={0.15}>
              <div className="relative">
                <div className="absolute -inset-6 bg-primary/15 rounded-[40px] blur-2xl" />
                <img
                  src={programHero}
                  alt={`${program.name} student studying online`}
                  className="relative rounded-[28px] w-full object-cover aspect-[4/3] shadow-2xl"
                  loading="eager"
                />
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* OVERVIEW */}
      <section className="py-16">
        <div className="container-dg">
          <Reveal>
            <div className="glass p-10 md:p-14 max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold mb-5">What is {program.name}?</h2>
              <p className="text-soft text-lg leading-[1.8] mb-6">
                {program.about}
              </p>
              <h3 className="text-xl font-bold mt-8 mb-3">Who Should Enroll?</h3>
              <ul className="space-y-2 text-soft">
                {program.enrollFor.map((item) => (
                  <li key={item} className="flex gap-2"><span className="text-primary font-bold">•</span> {item}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* EMI HIGHLIGHT */}
      <section className="py-12">
        <div className="container-dg max-w-4xl">
          <Reveal>
            <div className="glass glass-hover p-8 md:p-10 flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-primary/15 flex items-center justify-center flex-shrink-0">
                <Wallet size={26} className="text-primary" />
              </div>
              <div>
                <p className="overline mb-1">Easy EMI</p>
                <h3 className="text-xl md:text-2xl font-bold mb-2">Pay Comfortably, Study Stress-Free</h3>
                <p className="text-soft leading-relaxed">{program.emiNote}</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CAREER SCOPE */}
      <section className="py-16">
        <div className="container-dg">
          <Reveal>
            <div className="glass p-10 md:p-14 max-w-4xl mx-auto">
              <p className="overline mb-3">Career Path</p>
              <h2 className="text-3xl font-bold mb-6">Career Opportunities</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2"><Briefcase size={18} className="text-primary" /> Popular Roles</h3>
                  <ul className="space-y-2 text-soft">
                    {career.roles.map(r => <li key={r}>• {r}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold mb-3 flex items-center gap-2"><Award size={18} className="text-primary" /> Average Salary Range</h3>
                  <p className="text-2xl font-extrabold text-primary">{career.salary}</p>
                  <p className="text-xs text-soft mt-2">Indicative ranges. Varies by experience and employer.</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* UNIVERSITIES */}
      <section className="py-16">
        <div className="container-dg">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <p className="overline mb-3">Top Picks</p>
              <h2 className="text-3xl md:text-4xl font-bold">Top Universities Offering {program.name}</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {universities.map((u, i) => (
              <Reveal key={u.name} delay={i * 0.05}>
                <div className="glass glass-hover p-7 h-full">
                  <h3 className="text-lg font-bold mb-2">{u.name}</h3>
                  <p className="text-soft text-sm leading-relaxed mb-4">{u.note}</p>
                  <div className="flex flex-wrap gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">UGC Entitled</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">AICTE Approved</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary px-2 py-1 rounded">Easy EMI</span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal>
            <p className="text-center text-soft mt-10 max-w-xl mx-auto">
              Not sure which fits you? Our free counselors compare options based on your profile.
            </p>
          </Reveal>
        </div>
      </section>

      {/* ADMISSION */}
      <section className="py-16">
        <div className="container-dg grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Reveal>
            <div className="glass glass-hover p-8 h-full">
              <p className="overline mb-3">Admission</p>
              <h2 className="text-2xl font-bold mb-4">Simple Admission Process</h2>
              <p className="text-soft leading-relaxed">
                Direct admission. Just share your basic details and academic background. Our counselors guide you end to end. Eligibility is open to learners from diverse backgrounds.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass glass-hover p-8 h-full">
              <p className="overline mb-3">Scholarships & EMI</p>
              <h2 className="text-2xl font-bold mb-4">Fee Support That Fits</h2>
              <p className="text-soft leading-relaxed">
                Several universities offer scholarships for deserving candidates, plus easy EMI options to spread your fees comfortably. We help you check what you qualify for.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="py-16">
        <div className="container-dg max-w-3xl">
          <Reveal>
            <div className="glass p-10 text-center">
              <div className="flex justify-center gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, k) => <Star key={k} size={16} className="fill-primary text-primary" />)}
              </div>
              <p className="text-lg leading-relaxed text-soft mb-5">
                "Degree Guru helped me pick the right {program.name} without any pressure. The counselor was honest about pros, cons and even the EMI of each university."
              </p>
              <div className="font-bold">Verified Learner</div>
              <div className="text-xs text-soft">{program.full} graduate</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA FORM */}
      <section className="py-20">
        <div className="container-dg max-w-2xl">
          <Reveal>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">Confused About {program.name}?</h2>
              <p className="text-soft text-lg">Talk to us. We will simplify everything — including the EMI math.</p>
            </div>
            <CounselingForm compact buttonLabel="Request Free Counseling Call" />
          </Reveal>
        </div>
      </section>

      {/* RELATED */}
      <section className="pb-24">
        <div className="container-dg">
          <Reveal>
            <h2 className="text-2xl font-bold mb-8">Related Programs</h2>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {PROGRAMS.filter(p => p.slug !== program.slug).slice(0, 4).map((p) => (
              <Link key={p.slug} to={`/programs/${p.slug}`} className="glass glass-hover p-5 block">
                <div className="font-bold mb-1">{p.name}</div>
                <div className="text-xs text-soft mb-3">{p.full}</div>
                <span className="text-primary text-sm font-semibold inline-flex items-center gap-1">
                  Explore <ArrowRight size={12} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default ProgramDetail;
