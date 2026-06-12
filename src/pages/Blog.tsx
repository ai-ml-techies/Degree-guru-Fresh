import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { Sparkles } from "lucide-react";

const Blog = () => (
  <>
    <section className="relative py-14 md:py-24 overflow-hidden">
      <Blobs />
      <div className="container-dg relative z-10 max-w-3xl">
        <Reveal>
          <p className="overline mb-4">Insights & Stories</p>
          <h1 className="text-[40px] md:text-[60px] font-extrabold leading-[1.05] mb-5">
            Degree Guru Blogs
          </h1>
          <p className="text-soft text-lg leading-[1.7]">
            Career advice, online learning insights, and student stories. Fresh posts coming soon.
          </p>
        </Reveal>
      </div>
    </section>

    <section className="pb-12 md:pb-24">
      <div className="container-dg">
        <Reveal>
          <div className="glass p-6 sm:p-12 md:p-16 max-w-3xl mx-auto text-left">
            <div className="w-14 h-14 rounded-full bg-primary/15 flex items-center justify-center mb-6">
              <Sparkles size={22} className="text-primary" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Coming Soon</h2>
            <p className="text-soft leading-relaxed">
              We are crafting honest, useful articles on online degrees, career planning, EMI guidance, and recruitment tips. Check back shortly.
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

export default Blog;
