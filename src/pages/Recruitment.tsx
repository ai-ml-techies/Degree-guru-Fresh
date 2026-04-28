import { Reveal } from "@/components/Reveal";
import { CounselingForm } from "@/components/CounselingForm";

const Recruitment = () => (
  <>
    <section className="py-20">
      <div className="container-dg max-w-3xl">
        <Reveal>
          <p className="overline mb-3">Career Support</p>
          <h1 className="text-4xl md:text-[56px] font-extrabold leading-[1.05] mb-6">
            We Help You Land the Right Job Too
          </h1>
          <p className="text-soft text-lg leading-relaxed">
            Degree Guru is not just about getting you into the right online program. We also connect our learners with recruitment opportunities and career support. From resume tips to employer introductions, we help you turn your degree into a career.
          </p>
        </Reveal>
      </div>
    </section>

    <section className="pb-24">
      <div className="container-dg max-w-2xl">
        <Reveal>
          <h2 className="text-2xl font-bold text-center mb-8">Register for Recruitment Support</h2>
          <CounselingForm buttonLabel="Register for Recruitment Support" />
        </Reveal>
      </div>
    </section>
  </>
);

export default Recruitment;
