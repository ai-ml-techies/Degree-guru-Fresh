import { Helmet } from "react-helmet-async";
import { CollegeVidyaCourseExplorer } from "@/components/courses/CollegeVidyaCourseExplorer";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { ShieldCheck } from "lucide-react";

export const CoursesIndex = () => {
  return (
    <>
      <Helmet>
        <title>Explore Online Degree Courses - MBA, MCA, BCA, BBA, B.Com | Degree Guru</title>
        <meta
          name="description"
          content="Explore UGC-DEB approved Online Degree Programs in India. Compare Online MBA, Online BCA, Online MCA, Online BBA and executive degrees with 0% EMI."
        />
        <link rel="canonical" href="https://degreeguru.in/courses/" />
      </Helmet>

      <div className="container-dg py-6 md:py-10 space-y-8">
        <AppBreadcrumb items={[{ label: "Courses" }]} />

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <ShieldCheck size={14} /> 100% UGC-DEB Recognized Higher Education
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Explore Online Degree Courses
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-2 leading-relaxed">
            Find the right online bachelor's, master's or executive doctorate. Compare accredited universities, curriculum, and flexible EMI options.
          </p>
        </div>

        {/* College Vidya Category Explorer Component */}
        <CollegeVidyaCourseExplorer />
      </div>
    </>
  );
};
export default CoursesIndex;

