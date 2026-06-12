import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { ArrowRight, BookOpen } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { PROGRAMS } from "@/data/programs";
import { fetchPrograms, type ApiProgram } from "@/lib/api";
import type { ProgramContent } from "@/data/programs";

type Program = ProgramContent;

function apiToProgram(p: ApiProgram): Program {
  return {
    slug:        p.slug,
    name:        p.name,
    full:        p.full,
    level:       p.level,
    desc:        p.desc,
    tagline:     p.tagline,
    about:       p.about,
    enrollFor:   p.enrollFor,
    emiNote:     p.emiNote,
    careerRoles: p.careerRoles,
    careerSalary: p.careerSalary,
  };
}

const ProgramsIndex = () => {
  const { data: apiPrograms } = useQuery({
    queryKey: ['programs'],
    queryFn:  fetchPrograms,
    staleTime: 1000 * 60 * 5,
  });

  const programs: Program[] = apiPrograms && apiPrograms.length > 0
    ? apiPrograms.map(apiToProgram)
    : PROGRAMS;

  const grouped = {
    Bachelors: programs.filter(p => p.level === "Bachelors"),
    Masters:   programs.filter(p => p.level === "Masters"),
    Doctoral:  programs.filter(p => p.level === "Doctoral"),
    Skills:    programs.filter(p => p.level === "Skills"),
  };

  const siteUrl = 'https://degreeguru.in';

  return (
    <>
      <Helmet>
        <title>Online Degree Programs in India | Degree Guru</title>
        <meta name="description" content="Browse all online degree programs — BBA, MBA, MCA, B.Com, M.Com and more. Compare universities, fees, and no-cost EMI options with free counseling at Degree Guru." />
        <meta name="robots" content="index,follow" />
        <link rel="canonical" href={`${siteUrl}/programs`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/programs`} />
        <meta property="og:title" content="Online Degree Programs in India | Degree Guru" />
        <meta property="og:description" content="Browse all online degree programs — BBA, MBA, MCA, B.Com, M.Com and more. Compare universities, fees, and no-cost EMI options with free counseling at Degree Guru." />
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Online Degree Programs in India | Degree Guru" />
        <meta name="twitter:description" content="Browse all online degree programs — BBA, MBA, MCA, B.Com, M.Com and more. Compare universities, fees, and no-cost EMI options with free counseling at Degree Guru." />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
      </Helmet>
      <section className="relative py-14 md:py-20 overflow-hidden">
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
          list.length === 0 ? null : (
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
          )
        ))}
      </section>
    </>
  );
};

export default ProgramsIndex;
