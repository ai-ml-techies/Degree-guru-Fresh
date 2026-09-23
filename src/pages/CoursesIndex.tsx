import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CORE_COURSES, CourseData } from "@/data/courses";
import { CollegeVidyaCourseExplorer } from "@/components/courses/CollegeVidyaCourseExplorer";
import { 
  GraduationCap, 
  Search, 
  Clock, 
  IndianRupee, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  BookOpen,
  Filter
} from "lucide-react";

export const CoursesIndex = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = [
    "All",
    "Online Master's",
    "Online Bachelor's",
    "Executive Doctorate",
    "Secondary (10th/12th)",
  ];

  const filteredCourses = CORE_COURSES.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.shortName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.specializations.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));

    if (selectedCategory === "All") return matchesSearch;
    if (selectedCategory === "Online Master's") {
      return matchesSearch && ["Online MBA", "Online MCA", "Online M.Com", "Online MA", "Online M.Sc"].includes(c.shortName);
    }
    if (selectedCategory === "Online Bachelor's") {
      return matchesSearch && ["Online BCA", "Online BBA", "Online B.Com", "Online BA"].includes(c.shortName);
    }
    if (selectedCategory === "Executive Doctorate") {
      return matchesSearch && c.shortName === "Online DBA";
    }
    if (selectedCategory === "Secondary (10th/12th)") {
      return matchesSearch && (c.slug.includes("10") || c.slug.includes("12"));
    }
    return matchesSearch;
  });

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

      <div className="container-dg py-8 md:py-14 space-y-14">
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

        {/* 1. College Vidya Category Explorer Component */}
        <CollegeVidyaCourseExplorer />

        {/* 2. Detailed Searchable Course Directory */}
        <div className="space-y-8 pt-8 border-t border-border/60">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl font-black text-foreground">
              Search All Degree Programs
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Filter by degree level or search specific specializations.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
            <input
              type="text"
              placeholder="Search Online MBA, Online BCA, Data Science, Digital Marketing..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-card border border-border text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none shadow-sm"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2 justify-center">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm scale-105"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((c) => (
            <div
              key={c.slug}
              className="p-6 rounded-3xl bg-card border border-border/80 shadow-md hover:shadow-xl transition-all duration-200 flex flex-col justify-between space-y-5 group"
            >
              <div>
                <div className="flex items-center justify-between gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold uppercase tracking-wide">
                    {c.duration}
                  </span>
                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <TrendingUp size={13} /> {c.roiMetrics.averageSalaryJump}
                  </span>
                </div>

                <h2 className="text-xl font-black text-foreground group-hover:text-primary transition-colors mt-3">
                  {c.shortName}
                </h2>
                <p className="text-xs text-muted-foreground font-medium mt-0.5">{c.fullName}</p>
                <p className="text-xs text-muted-foreground/80 mt-3 line-clamp-3 leading-relaxed">
                  {c.heroDescription}
                </p>

                {/* Quick specs */}
                <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-border/50">
                  <div>
                    <span className="text-[10px] text-muted-foreground block">Total Fees</span>
                    <span className="text-xs font-bold text-foreground">{c.feesRange}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-muted-foreground block">No-Cost EMI</span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{c.emiFrom}</span>
                  </div>
                </div>

                {/* Popular specializations chips */}
                <div className="mt-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1.5">
                    Popular Specializations:
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {c.specializations.slice(0, 3).map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-muted text-[10px] font-semibold text-foreground/80">
                        {s}
                      </span>
                    ))}
                    {c.specializations.length > 3 && (
                      <span className="text-[10px] text-muted-foreground self-center">
                        +{c.specializations.length - 3} more
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-border/50 flex items-center justify-between">
                <Link
                  to={`/${c.slug}`}
                  className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm"
                >
                  View Universities & Syllabus <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* BOSSE & Offline Banners */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-12">
          <div className="p-6 rounded-3xl bg-gradient-to-br from-[#6528f7]/10 via-card to-card border border-[#6528f7]/20 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-[#6528f7]/15 text-[#6528f7] dark:text-purple-300 text-[10px] font-bold uppercase">
                Open Schooling
              </span>
              <h3 className="text-lg font-bold text-foreground mt-2">BOSSE Class 10 & 12 Recognized Pathway</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Complete secondary or senior secondary schooling with government-approved open schooling board for higher degree eligibility.
              </p>
            </div>
            <Link to="/class-10-12" className="mt-4 text-xs font-bold text-[#6528f7] dark:text-purple-300 hover:underline flex items-center gap-1">
              Explore BOSSE Schooling →
            </Link>
          </div>

          <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-500/10 via-card to-card border border-amber-500/20 flex flex-col justify-between">
            <div>
              <span className="px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-600 dark:text-amber-400 text-[10px] font-bold uppercase">
                Offline Degrees
              </span>
              <h3 className="text-lg font-bold text-foreground mt-2">Offline Courses — M.K. University, Patan</h3>
              <p className="text-xs text-muted-foreground mt-1">
                Looking for on-campus offline learning? Explore regular full-time undergraduate and postgraduate programs.
              </p>
            </div>
            <Link to="/offline-courses" className="mt-4 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
              Explore Offline Campus Courses →
            </Link>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};
export default CoursesIndex;
