import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { PROGRAMS } from "@/data/programs";

const ProgramsIndex = () => {
  const grouped = {
    Bachelors: PROGRAMS.filter(p => p.level === "Bachelors"),
    Masters: PROGRAMS.filter(p => p.level === "Masters"),
    Doctoral: PROGRAMS.filter(p => p.level === "Doctoral"),
    Skills: PROGRAMS.filter(p => p.level === "Skills"),
  };

  return (
    <>
      <section className="relative py-20 overflow-hidden">
        <Blobs />
        <div className="container-dg relative z-10 max-w-3xl">
          <Reveal>
            <p className="overline mb-3">Online Programs</p>
            <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.05] mb-5">
              Find Your Perfect Online Program
            </h1>
            <p className="text-soft text-lg">Browse all online degrees and certifications we guide you through, free.</p>
          </Reveal>
        </div>
      </section>

      <section className="pb-24 space-y-16">
        {Object.entries(grouped).map(([level, list]) => (
          <div key={level} className="container-dg">
            <Reveal>
              <h2 className="text-2xl md:text-3xl font-bold mb-8">{level}</h2>
            </Reveal>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.map((p, i) => (
                <Reveal key={p.slug} delay={i * 0.05}>
                  <Link to={`/programs/${p.slug}`} className="glass glass-hover p-8 block group h-full">
                    <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center mb-5">
                      <BookOpen size={20} className="text-primary" />
                    </div>
                    <h3 className="text-[22px] font-bold mb-2">{p.name}</h3>
                    <p className="text-xs text-soft mb-3">{p.full}</p>
                    <p className="text-soft text-sm leading-relaxed mb-5">{p.desc}</p>
                    <span className="text-primary font-semibold text-sm inline-flex items-center gap-1">
                      Learn More <ArrowRight size={14} />
                    </span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </section>
    </>
  );
};

export default ProgramsIndex;
