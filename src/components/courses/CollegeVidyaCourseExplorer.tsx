import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  GraduationCap, 
  Briefcase, 
  Sparkles, 
  Cpu, 
  Globe, 
  Award, 
  BookOpen, 
  Building2,
  FileCheck,
  Compass,
  Users
} from "lucide-react";
import { useLeadGate } from "@/context/LeadGateContext";

export interface CourseCardItem {
  badge: string;
  badgeStyle?: string;
  title: string;
  ctaText: string;
  slug: string;
  icon: React.ReactNode;
}

export interface CategoryGroup {
  id: string;
  title: string;
  subtitle: string;
  courses: CourseCardItem[];
}

const CATEGORIES: CategoryGroup[] = [
  {
    id: "pg",
    title: "PG Courses",
    subtitle: "After Graduation",
    courses: [
      {
        badge: "✦ Right MBA",
        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        title: "MBA Sorted",
        ctaText: "Find My MBA",
        slug: "online-mba",
        icon: <GraduationCap size={26} className="text-primary" />,
      },
      {
        badge: "9+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online MBA",
        ctaText: "Compare 131 Now",
        slug: "online-mba",
        icon: <Briefcase size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ Trending",
        badgeStyle: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
        title: "Online Global MBA",
        ctaText: "Compare 37 Now",
        slug: "online-mba",
        icon: <Globe size={26} className="text-purple-600" />,
      },
      {
        badge: "✦ ROI 100%",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "1 Year MBA Online",
        ctaText: "Compare 8 Now",
        slug: "online-mba",
        icon: <Award size={26} className="text-teal-600" />,
      },
      {
        badge: "24+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online MCA",
        ctaText: "Compare 58 Now",
        slug: "online-mca",
        icon: <Cpu size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "13+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online M.Sc",
        ctaText: "Compare 38 Now",
        slug: "online-msc",
        icon: <Sparkles size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ Global",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "MS Degree Online",
        ctaText: "Compare 10 Now",
        slug: "online-msc",
        icon: <Globe size={26} className="text-emerald-600" />,
      },
      {
        badge: "17+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online MA",
        ctaText: "Compare 76 Now",
        slug: "online-ma",
        icon: <BookOpen size={26} className="text-rose-600" />,
      },
      {
        badge: "7+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online M.Com",
        ctaText: "Compare 58 Now",
        slug: "online-mcom",
        icon: <Briefcase size={26} className="text-emerald-600" />,
      },
      {
        badge: "19+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Dual MBA Online",
        ctaText: "Compare 14 Now",
        slug: "online-mba",
        icon: <Award size={26} className="text-amber-600" />,
      },
      {
        badge: "✦ NEW",
        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        title: "Online MBA after Diploma",
        ctaText: "Compare 10 Now",
        slug: "online-mba",
        icon: <FileCheck size={26} className="text-emerald-600" />,
      },
      {
        badge: "5+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online Master of Education (M.Ed)",
        ctaText: "Compare 2 Now",
        slug: "courses",
        icon: <BookOpen size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "2 Years",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online Global MCA",
        ctaText: "Compare 1 Now",
        slug: "online-mca",
        icon: <Globe size={26} className="text-purple-600" />,
      },
      {
        badge: "2 Years",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online Master of Social Work",
        ctaText: "Compare 12 Now",
        slug: "courses",
        icon: <Users size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ Dr Title",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Online MBA & Doctorate",
        ctaText: "Compare 3 Now",
        slug: "online-dba",
        icon: <Award size={26} className="text-teal-600" />,
      },
      {
        badge: "✦ Edu Leader",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Online M.Ed & Ed.D",
        ctaText: "Compare 1 Now",
        slug: "courses",
        icon: <GraduationCap size={26} className="text-[#6528f7]" />,
      },
    ],
  },
  {
    id: "executive",
    title: "Executive Education",
    subtitle: "Working Professionals & CXOs",
    courses: [
      {
        badge: "✦ Fast Track",
        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        title: "1-Year Executive MBA",
        ctaText: "Compare 18 Now",
        slug: "online-mba",
        icon: <Briefcase size={26} className="text-primary" />,
      },
      {
        badge: "✦ Trending",
        badgeStyle: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
        title: "Executive PG Diploma AI",
        ctaText: "Compare 22 Now",
        slug: "online-msc",
        icon: <Cpu size={26} className="text-purple-600" />,
      },
      {
        badge: "CXO Track",
        badgeStyle: "bg-purple-50 text-[#6528f7] border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
        title: "Senior Management Program",
        ctaText: "Compare 14 Now",
        slug: "online-mba",
        icon: <Award size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "In-Demand",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Executive Product Management",
        ctaText: "Compare 16 Now",
        slug: "online-mba",
        icon: <Sparkles size={26} className="text-amber-600" />,
      },
      {
        badge: "✦ Global",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Global Executive Leadership",
        ctaText: "Compare 9 Now",
        slug: "online-mba",
        icon: <Globe size={26} className="text-emerald-600" />,
      },
      {
        badge: "Healthcare CXO",
        badgeStyle: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300",
        title: "Hospital & Healthcare Exec",
        ctaText: "Compare 12 Now",
        slug: "online-mba",
        icon: <Building2 size={26} className="text-rose-600" />,
      },
    ],
  },
  {
    id: "doctorate",
    title: "Doctorate/Ph.D.",
    subtitle: "Get Dr. Title (After UG + Work Ex)",
    courses: [
      {
        badge: "✦ \"Dr. Title\"",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "PhD vs DBA",
        ctaText: "Help Me Decide",
        slug: "online-dba",
        icon: <GraduationCap size={26} className="text-primary" />,
      },
      {
        badge: "✦ \"Dr. Title\"",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Offline PhD vs Online PhD?",
        ctaText: "Help Me Decide",
        slug: "online-dba",
        icon: <BookOpen size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ \"Dr. Title\"",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Online DBA Doctorate",
        ctaText: "Compare 27 Now",
        slug: "online-dba",
        icon: <Award size={26} className="text-amber-600" />,
      },
      {
        badge: "✦ 36 Months",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Doctorate for Professionals",
        ctaText: "Compare 15 Now",
        slug: "online-dba",
        icon: <Briefcase size={26} className="text-emerald-600" />,
      },
      {
        badge: "23+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "PhD for Working Professionals",
        ctaText: "Compare 60 Now",
        slug: "online-dba",
        icon: <GraduationCap size={26} className="text-purple-600" />,
      },
      {
        badge: "1+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "PhD Online",
        ctaText: "Compare 17 Now",
        slug: "online-dba",
        icon: <Cpu size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ No Thesis",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Honorary PhD Doctorate",
        ctaText: "Compare 2 Now",
        slug: "online-dba",
        icon: <FileCheck size={26} className="text-teal-600" />,
      },
      {
        badge: "✦ Zero Year",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Honorary Doctorate (DBA)",
        ctaText: "Compare 1 Now",
        slug: "online-dba",
        icon: <Award size={26} className="text-rose-600" />,
      },
      {
        badge: "5+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online Doctor of Education (Ed.D)",
        ctaText: "Compare 2 Now",
        slug: "online-dba",
        icon: <BookOpen size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "3 - 5 Years",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "PhD Distance",
        ctaText: "Compare 1 Now",
        slug: "online-dba",
        icon: <GraduationCap size={26} className="text-amber-600" />,
      },
      {
        badge: "2+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Part Time PhD",
        ctaText: "Compare 17 Now",
        slug: "online-dba",
        icon: <Cpu size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ \"Dr. Title\"",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Online DCS Doctorate",
        ctaText: "Compare 1 Now",
        slug: "online-dba",
        icon: <Cpu size={26} className="text-emerald-600" />,
      },
    ],
  },
  {
    id: "genai",
    title: "Gen AI/Agentic AI",
    subtitle: "Future Proof Career",
    courses: [
      {
        badge: "✦ Frontier Tech",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Agentic AI Engineering",
        ctaText: "Compare 15 Now",
        slug: "online-msc",
        icon: <Cpu size={26} className="text-purple-600" />,
      },
      {
        badge: "✦ High Growth",
        badgeStyle: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
        title: "GenAI Product Strategy & LLMs",
        ctaText: "Compare 24 Now",
        slug: "online-mba",
        icon: <Sparkles size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ Future Proof",
        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        title: "AI & Prompt Engineering",
        ctaText: "Compare 32 Now",
        slug: "online-msc",
        icon: <Cpu size={26} className="text-emerald-600" />,
      },
      {
        badge: "✦ Flexi Timings",
        badgeStyle: "bg-purple-50 text-[#6528f7] border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
        title: "M.Tech Autonomous Systems",
        ctaText: "Compare 11 Now",
        slug: "courses",
        icon: <Cpu size={26} className="text-[#6528f7]" />,
      },
    ],
  },
  {
    id: "ug",
    title: "UG Courses",
    subtitle: "After 12th",
    courses: [
      {
        badge: "✦ High ROI",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Online BBA",
        ctaText: "Compare 85 Now",
        slug: "online-bba",
        icon: <Briefcase size={26} className="text-primary" />,
      },
      {
        badge: "14+ Specializations",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online BCA",
        ctaText: "Compare 64 Now",
        slug: "online-bca",
        icon: <Cpu size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ Corporate Finance",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Online B.Com",
        ctaText: "Compare 52 Now",
        slug: "online-bcom",
        icon: <Award size={26} className="text-emerald-600" />,
      },
      {
        badge: "Liberal Arts",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online BA",
        ctaText: "Compare 45 Now",
        slug: "online-ba",
        icon: <BookOpen size={26} className="text-purple-600" />,
      },
      {
        badge: "✦ Tech Stack",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Online B.Sc (CS & IT)",
        ctaText: "Compare 28 Now",
        slug: "courses",
        icon: <Cpu size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "Impact Careers",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Online BSW (Social Work)",
        ctaText: "Compare 12 Now",
        slug: "courses",
        icon: <Users size={26} className="text-amber-600" />,
      },
    ],
  },
  {
    id: "engineering",
    title: "Engineering",
    subtitle: "Flexi Timing",
    courses: [
      {
        badge: "✦ Approved AICTE",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "B.Tech Working Professionals",
        ctaText: "Compare 24 Now",
        slug: "courses",
        icon: <Cpu size={26} className="text-primary" />,
      },
      {
        badge: "✦ Evening / Weekend",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "M.Tech Working Professionals",
        ctaText: "Compare 18 Now",
        slug: "courses",
        icon: <GraduationCap size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "Direct 2nd Year",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Diploma to B.Tech Lateral",
        ctaText: "Compare 12 Now",
        slug: "courses",
        icon: <Award size={26} className="text-emerald-600" />,
      },
    ],
  },
  {
    id: "abroad",
    title: "Study Abroad",
    subtitle: "Pathway/Hybrid Mode",
    courses: [
      {
        badge: "✦ Dual Country",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Global Pathway MBA (1+1)",
        ctaText: "Compare 15 Now",
        slug: "online-mba",
        icon: <Globe size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ 3-Yr Post-Study Visa",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "US / UK STEM Master's Hybrid",
        ctaText: "Compare 20 Now",
        slug: "online-msc",
        icon: <Globe size={26} className="text-primary" />,
      },
      {
        badge: "✦ Low Tuition",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "German Hybrid Master's",
        ctaText: "Compare 10 Now",
        slug: "courses",
        icon: <Compass size={26} className="text-emerald-600" />,
      },
    ],
  },
  {
    id: "skilling",
    title: "Skilling & Certificate",
    subtitle: "After 10th & 12th",
    courses: [
      {
        badge: "✦ Placement Support",
        badgeStyle: "bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/40 dark:text-teal-300",
        title: "Data Science & ML Bootcamp",
        ctaText: "Compare 42 Now",
        slug: "courses",
        icon: <Cpu size={26} className="text-primary" />,
      },
      {
        badge: "✦ Real Projects",
        badgeStyle: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300",
        title: "Full Stack Web Development",
        ctaText: "Compare 35 Now",
        slug: "courses",
        icon: <Sparkles size={26} className="text-emerald-600" />,
      },
      {
        badge: "✦ Wall St Standard",
        badgeStyle: "bg-purple-50 text-[#6528f7] border-purple-200 dark:bg-purple-950/40 dark:text-purple-300",
        title: "Investment Banking & Finance",
        ctaText: "Compare 26 Now",
        slug: "courses",
        icon: <Briefcase size={26} className="text-[#6528f7]" />,
      },
      {
        badge: "✦ Meta & Google",
        badgeStyle: "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300",
        title: "Digital Marketing & Growth",
        ctaText: "Compare 29 Now",
        slug: "courses",
        icon: <Globe size={26} className="text-amber-600" />,
      },
    ],
  },
];

export const CollegeVidyaCourseExplorer = () => {
  const [activeTab, setActiveTab] = useState<string>("pg");
  const navigate = useNavigate();
  const { requireContact } = useLeadGate();

  const activeCategory = CATEGORIES.find((c) => c.id === activeTab) || CATEGORIES[0];

  const handleCourseClick = (slug: string, title: string) => {
    // Non-mandatory removable popup for programs
    requireContact(
      () => {
        navigate(`/${slug}`);
      },
      title,
      false // Removable popup!
    );
  };

  return (
    <div className="space-y-4">
      {/* Course Explorer Two-Column Glassmorphism Layout */}
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6 items-start">
        {/* Left Sidebar Category Tabs: Snug width, larger typography */}
        <div className="w-full lg:w-48 xl:w-52 shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {CATEGORIES.map((cat) => {
            const isSelected = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveTab(cat.id)}
                className={`text-left px-3.5 py-3 rounded-xl transition-all duration-200 shrink-0 w-auto lg:w-full border cursor-pointer backdrop-blur-md ${
                  isSelected
                    ? "bg-[#6528f7] text-white border-[#6528f7] shadow-md shadow-[#6528f7]/25"
                    : "bg-card/75 dark:bg-card/40 border-border/70 hover:border-[#6528f7]/40 hover:bg-card/90 text-foreground"
                }`}
              >
                <div className={`text-sm sm:text-base font-black tracking-tight leading-snug ${isSelected ? "text-white" : "text-foreground"}`}>
                  {cat.title}
                </div>
                <div className="mt-1.5">
                  <span className={`inline-block text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-md shadow-xs ${
                    isSelected ? "bg-white text-[#6528f7]" : "bg-primary/10 text-primary"
                  }`}>
                    {cat.subtitle}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Cards Grid */}
        <div className="flex-1 min-w-0 w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-3">
            {activeCategory.courses.map((course, idx) => (
              <div
                key={`${course.title}-${idx}`}
                onClick={() => handleCourseClick(course.slug, course.title)}
                className="bg-card/75 dark:bg-card/40 backdrop-blur-md border border-border/80 hover:border-[#6528f7]/60 rounded-xl p-3 flex flex-col items-center justify-between text-center hover:shadow-xl hover:shadow-[#6528f7]/10 transition-all duration-200 group cursor-pointer min-h-[148px] relative"
              >
                {/* Top Badge */}
                <div className="w-full flex justify-center">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[9px] font-bold border tracking-tight truncate max-w-[125px] shadow-xs ${
                      course.badgeStyle || "bg-amber-50 text-amber-700 border-amber-200"
                    }`}
                  >
                    {course.badge}
                  </span>
                </div>

                {/* Center Icon */}
                <div className="my-1.5 w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#6528f7]/10 dark:bg-[#6528f7]/20 text-[#6528f7] flex items-center justify-center group-hover:scale-110 transition-transform [&>svg]:w-5 [&>svg]:h-5">
                  {course.icon}
                </div>

                {/* Course Title - Loud and Clear */}
                <h4 className="text-xs sm:text-[13px] font-bold text-foreground group-hover:text-[#6528f7] transition-colors leading-tight line-clamp-2 px-0.5">
                  {course.title}
                </h4>

                {/* Bottom Brand Purple Action Button */}
                <div className="w-full pt-2">
                  <button
                    type="button"
                    className="w-full py-1.5 px-2 rounded-lg bg-[#6528f7] hover:bg-[#551ebd] active:bg-[#4b14b0] text-white font-bold text-[11px] tracking-wide shadow-sm hover:shadow-md hover:shadow-[#6528f7]/25 transition-all text-center cursor-pointer truncate"
                  >
                    {course.ctaText}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default CollegeVidyaCourseExplorer;
