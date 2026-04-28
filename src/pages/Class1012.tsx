import { Reveal } from "@/components/Reveal";
import { CounselingForm } from "@/components/CounselingForm";

const Class1012 = () => (
  <>
    <section className="py-20">
      <div className="container-dg max-w-4xl">
        <Reveal>
          <p className="overline mb-3">Schooling Online</p>
          <h1 className="text-4xl md:text-5xl font-extrabold mb-5">Class 10 & Class 12 Online</h1>
          <p className="text-soft text-lg leading-relaxed">
            Complete your secondary or senior secondary education online from home. Flexible learning for every age and every situation.
          </p>
        </Reveal>
      </div>
    </section>

    <section className="pb-20">
      <div className="container-dg grid md:grid-cols-2 gap-6 mb-12">
        <Reveal>
          <div className="glass p-10">
            <h2 className="text-2xl font-bold mb-3">Class 10 Online</h2>
            <p className="text-soft leading-relaxed mb-4">
              Complete your secondary education online from home. Flexible schedule. No previous formal schooling required in many cases.
            </p>
            <p className="text-soft text-sm">
              Limited government scholarship schemes may apply. Contact us to check your eligibility.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="glass p-10">
            <h2 className="text-2xl font-bold mb-3">Class 12 Online</h2>
            <p className="text-soft leading-relaxed mb-4">
              Complete your senior secondary education online. Ideal for those who have completed Class 10 or equivalent and want to study from home.
            </p>
            <p className="text-soft text-sm">
              Open to working adults, homemakers, and learners restarting education at any age.
            </p>
          </div>
        </Reveal>
      </div>

      <div className="container-dg max-w-2xl">
        <Reveal>
          <p className="overline mb-3 text-center">Request Callback</p>
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">Talk To Us About Class 10 or 12</h2>
          <CounselingForm />
        </Reveal>
      </div>
    </section>
  </>
);

export default Class1012;
