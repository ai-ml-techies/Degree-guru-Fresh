import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { CounselingForm } from "@/components/CounselingForm";
import { Sparkles } from "lucide-react";
import classHero from "@/assets/class-hero.jpg";

const Class1012 = () => (
  <>
    <section className="relative py-20 overflow-hidden">
      <Blobs />
      <div className="container-dg relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="overline mb-3">Schooling Online</p>
          <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.05] mb-5">
            Class 10 & Class 12, Finished Online
          </h1>
          <p className="text-soft text-lg leading-relaxed">
            Complete your secondary or senior secondary education online from home. Flexible learning for every age, every situation, and easy EMI options if you need them.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-6 bg-primary/15 rounded-[40px] blur-2xl" />
            <img
              src={classHero}
              alt="A learner completing Class 10 from home"
              className="relative rounded-[28px] w-full object-cover aspect-[4/3] shadow-2xl"
              loading="eager"
            />
          </div>
        </Reveal>
      </div>
    </section>

    <section className="pb-20">
      <div className="container-dg grid md:grid-cols-2 gap-6 mb-12">
        <Reveal>
          <div className="glass glass-hover p-10">
            <h2 className="text-2xl font-bold mb-3">Class 10 Online</h2>
            <p className="text-soft leading-relaxed mb-4">
              Finish your secondary education from home, on your own schedule. No previous formal schooling is required in many cases, just the will to learn.
            </p>
            <p className="text-soft text-sm flex items-start gap-2">
              <Sparkles size={14} className="text-primary mt-1 flex-shrink-0" />
              Easy EMI options available. Limited government scholarship schemes may apply, talk to us to check eligibility.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass glass-hover p-10">
            <h2 className="text-2xl font-bold mb-3">Class 12 Online</h2>
            <p className="text-soft leading-relaxed mb-4">
              Earn your senior secondary completion online. Ideal for anyone who has finished Class 10 or equivalent and wants a flexible, dignified way to study.
            </p>
            <p className="text-soft text-sm flex items-start gap-2">
              <Sparkles size={14} className="text-primary mt-1 flex-shrink-0" />
              Open to working adults, homemakers and learners restarting education at any age. EMI options available.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="container-dg max-w-2xl">
        <Reveal>
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Talk To Us About Class 10 or 12</h2>
          <p className="text-soft mb-8">We'll call you within 2 hours. No fees, no pressure.</p>
          <CounselingForm />
        </Reveal>
      </div>
    </section>
  </>
);

export default Class1012;
