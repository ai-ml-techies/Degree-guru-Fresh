import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { ShieldCheck, Sparkles, Users, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import aboutHero from "@/assets/about-hero.jpg";

const About = () => (
  <>
    <section className="relative min-h-[60vh] flex items-center overflow-hidden py-20">
      <Blobs />
      <div className="container-dg relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="overline mb-4">About Degree Guru</p>
          <h1 className="text-[40px] md:text-[60px] font-extrabold leading-[1.05] mb-6">
            India's Trusted Free Education Guide
          </h1>
          <p className="text-soft text-lg leading-[1.8]">
            A platform built on one simple belief: career counseling should be free, honest and accessible to every Indian, with easy EMI options on the programs we recommend.
          </p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-6 bg-primary/15 rounded-[40px] blur-2xl" />
            <img
              src={aboutHero}
              alt="Indian students studying together at a modern library"
              className="relative rounded-[28px] w-full object-cover aspect-[4/3] shadow-2xl"
              loading="eager"
            />
          </div>
        </Reveal>
      </div>
    </section>

    <section className="py-20">
      <div className="container-dg">
        <Reveal>
          <div className="glass max-w-[800px] mx-auto p-10 md:p-14">
            <p className="overline mb-3">Our Story</p>
            <h2 className="text-3xl font-bold mb-5">Built on a Simple Belief</h2>
            <p className="text-soft text-lg leading-[1.8]">
              Too many Indian students pay for biased counseling and end up in the wrong program. We started Degree Guru to change that. Because we partner directly with India's top universities, our counseling is free for every student, and we make sure you know about every EMI and scholarship option you qualify for.
            </p>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="bg-primary text-primary-foreground py-20">
      <div className="container-dg max-w-3xl text-center">
        <Reveal>
          <p className="overline !text-primary-foreground/80 mb-3">Vision</p>
          <h2 className="text-3xl md:text-[40px] font-bold mb-5">Aligned With Viksit Bharat</h2>
          <p className="text-lg leading-[1.8] opacity-95">
            We believe an educated India is an empowered India. Every learner we guide brings the country one step closer to Viksit Bharat. Our work is a small part of a much larger national mission.
          </p>
        </Reveal>
      </div>
    </section>

    <section className="py-24">
      <div className="container-dg">
        <Reveal>
          <h2 className="text-3xl md:text-[40px] font-bold mb-14">What Makes Us Different</h2>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { icon: ShieldCheck, t: "Free Forever", d: "No charges to students. Ever." },
            { icon: Users, t: "Trusted Partnerships", d: "Direct ties with India's top universities." },
            { icon: Sparkles, t: "Easy EMI Options", d: "Fee plans that fit your monthly budget." },
            { icon: Briefcase, t: "End to End Support", d: "From shortlisting to enrollment to recruitment." },
          ].map((c, i) => (
            <Reveal key={c.t} delay={i * 0.08}>
              <div className="glass glass-hover p-8 h-full">
                <div className="w-12 h-12 rounded-2xl bg-primary/15 flex items-center justify-center mb-4">
                  <c.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-bold text-lg mb-2">{c.t}</h3>
                <p className="text-soft text-sm">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>

    <section className="py-20">
      <div className="container-dg">
        <Reveal>
          <div className="glass p-10 md:p-12 text-center max-w-3xl mx-auto">
            <p className="overline mb-3">Beyond Counseling</p>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">We Help You Get Hired Too</h2>
            <p className="text-soft leading-relaxed mb-6">
              Beyond counseling, we also help graduates connect with recruitment opportunities. Resume guidance, employer introductions, and ongoing career support.
            </p>
            <Link to="/recruitment" className="btn-primary">Learn About Recruitment</Link>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="py-20">
      <div className="container-dg grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {[
          { n: "5+", l: "Years" },
          { n: "50,000+", l: "Students" },
          { n: "600+", l: "Partners" },
          { n: "98%", l: "Satisfaction" },
        ].map((s) => (
          <Reveal key={s.l}>
            <div className="glass glass-hover p-8">
              <div className="text-3xl md:text-4xl font-extrabold text-primary">{s.n}</div>
              <div className="text-xs uppercase tracking-wider mt-2 text-soft">{s.l}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  </>
);

export default About;
