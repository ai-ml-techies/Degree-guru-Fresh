import { UNIVERSITIES } from "@/data/programs";

export const UniversityMarquee = () => {
  const row1 = UNIVERSITIES;
  const row2 = [...UNIVERSITIES].reverse();

  return (
    <section className="py-20 overflow-hidden relative">
      <div className="container-dg mb-10 text-center">
        <p className="overline mb-3">University Partners</p>
        <h2 className="text-3xl md:text-4xl font-bold">Trusted University Network</h2>
      </div>
      <div className="space-y-4">
        <div className="overflow-hidden">
          <div className="marquee">
            {[...row1, ...row1].map((u, i) => (
              <span key={`a-${i}`} className="glass px-6 py-4 font-semibold whitespace-nowrap text-sm md:text-base">
                {u}
              </span>
            ))}
          </div>
        </div>
        <div className="overflow-hidden">
          <div className="marquee marquee-reverse">
            {[...row2, ...row2].map((u, i) => (
              <span key={`b-${i}`} className="glass px-6 py-4 font-semibold whitespace-nowrap text-sm md:text-base">
                {u}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
