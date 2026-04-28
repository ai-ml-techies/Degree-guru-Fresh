import { UNIVERSITIES } from "@/data/programs";
import { GraduationCap } from "lucide-react";

export const UniversityMarquee = () => {
  const row1 = UNIVERSITIES;
  const row2 = [...UNIVERSITIES].reverse();

  return (
    <section className="py-20 overflow-hidden relative">
      {/* Soft glass backdrop band */}
      <div
        aria-hidden
        className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[70%] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsl(var(--primary) / 0.08), hsl(var(--primary) / 0.18), hsl(var(--primary) / 0.08))",
          filter: "blur(40px)",
        }}
      />

      <div className="container-dg mb-12">
        <h2 className="text-3xl md:text-4xl font-bold">Trusted University Network</h2>
        <p className="text-soft mt-2 max-w-xl">India's most respected universities — under one free counseling roof.</p>
      </div>

      <div className="space-y-5 relative">
        {/* Edge fade masks */}
        <div className="absolute inset-y-0 left-0 w-32 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent" />
        <div className="absolute inset-y-0 right-0 w-32 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent" />

        <div className="overflow-hidden">
          <div className="marquee">
            {[...row1, ...row1].map((u, i) => (
              <span
                key={`a-${i}`}
                className="marquee-pill group inline-flex items-center gap-3 px-6 py-4 font-semibold whitespace-nowrap text-sm md:text-base"
              >
                <span className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <GraduationCap size={14} className="text-primary group-hover:text-primary-foreground" />
                </span>
                {u}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="marquee marquee-reverse">
            {[...row2, ...row2].map((u, i) => (
              <span
                key={`b-${i}`}
                className="marquee-pill group inline-flex items-center gap-3 px-6 py-4 font-semibold whitespace-nowrap text-sm md:text-base"
              >
                <span className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <GraduationCap size={14} className="text-primary group-hover:text-primary-foreground" />
                </span>
                {u}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
