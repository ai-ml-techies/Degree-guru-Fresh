import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { CounselingForm } from "@/components/CounselingForm";
import { Briefcase, FileText, Users, TrendingUp } from "lucide-react";
import recruitmentHero from "@/assets/recruitment-hero.jpg";

const perks = [
  { icon: FileText, t: "Resume & Profile Review", d: "We polish your resume and LinkedIn so recruiters actually call back." },
  { icon: Users, t: "Direct Employer Introductions", d: "We connect our learners with hiring partners across India." },
  { icon: Briefcase, t: "Interview Prep & Mock Rounds", d: "Practice with industry mentors before the real interview." },
  { icon: TrendingUp, t: "Salary Negotiation Coaching", d: "Don't leave money on the table. We help you ask right." },
];

const Recruitment = () => (
  <>
    <section className="relative py-20 overflow-hidden">
      <Blobs />
      <div className="container-dg relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="overline mb-3">Career Support</p>
          <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.05] mb-6">
            We Help You Land the Right Job Too
          </h1>
          <p className="text-soft text-lg leading-relaxed">
            A degree opens doors, we help you walk through the right one. From resume reviews to direct employer introductions, our recruitment support turns your online degree into a real career move.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-6 bg-primary/15 rounded-[40px] blur-2xl" />
            <img
              src={recruitmentHero}
              alt="Confident young Indian professional ready for her next role"
              className="relative rounded-[28px] w-full object-cover aspect-[4/3] shadow-2xl"
              loading="eager"
            />
          </div>
        </Reveal>
      </div>
    </section>

    <section className="py-16">
      <div className="container-dg">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((p, i) => (
            <Reveal key={p.t} delay={i * 0.08}>
              <div className="glass glass-hover p-8 h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-5">
                  <p.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{p.t}</h3>
                <p className="text-soft text-sm leading-relaxed">{p.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="pb-24">
      <div className="container-dg max-w-2xl">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Register for Recruitment Support</h2>
          <p className="text-soft mb-8">Tell us about yourself. Our team will reach out with the next steps.</p>
          <CounselingForm buttonLabel="Register for Recruitment Support" />
        </Reveal>
      </div>
    </section>
  </>
);

export default Recruitment;
