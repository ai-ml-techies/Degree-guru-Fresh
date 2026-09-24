import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  GraduationCap, 
  Building2, 
  Compass, 
  ChevronDown, 
  Moon, 
  Sun, 
  MessageCircle, 
  Calculator, 
  FileText, 
  Sparkles, 
  ArrowRight,
  Globe
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "./ThemeProvider";
import { useLanguage } from "@/context/LanguageContext";
import { fetchHomeContent } from "@/lib/api";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";
import { CORE_COURSES } from "@/data/courses";

const DEFAULT_ANNOUNCEMENTS = [
  "🎓 100% Free Career Counseling & Discovery — No Hidden Fees",
  "🏛️ 50+ UGC-DEB Approved Online Universities & Accredited Programs",
  "🚀 Free AI ATS-Friendly Resume Builder & Job Applications",
  "💸 No-Cost EMI Starting from ₹3,500/Month",
  "🤝 Refer & Earn ₹5,000 Guaranteed Reward for Every Enrolled Friend",
];

export const Header = () => {
  const { theme, toggle } = useTheme();
  const { language, setLanguage } = useLanguage();
  const location = useLocation();
  const [coursesDropdown, setCoursesDropdown] = useState(false);
  const [universitiesDropdown, setUniversitiesDropdown] = useState(false);
  const [careerDropdown, setCareerDropdown] = useState(false);

  const { data: homeContent } = useQuery({
    queryKey: ["home-content"],
    queryFn: fetchHomeContent,
    staleTime: 1000 * 60 * 5,
  });

  const ticker: string[] = (() => {
    try {
      const raw = homeContent?.announcements_json;
      const parsed = JSON.parse(raw || "[]");
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_ANNOUNCEMENTS;
    } catch { 
      return DEFAULT_ANNOUNCEMENTS; 
    }
  })();

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* 1. Announcement Ticker Bar — Pure Logo Purple Gradient (No Blue) */}
      <div className="announcement-bar fixed top-0 inset-x-0 z-[101] h-8 overflow-hidden flex items-center bg-gradient-to-r from-[#6528f7] via-[#7c3aed] to-[#551ebd]">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...ticker, ...ticker].map((text, i) => (
            <span key={i} className="text-white text-[11px] font-semibold tracking-wide px-4 sm:px-8 inline-flex items-center gap-2">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* 2. Main Header */}
      <header className="fixed top-8 inset-x-0 sm:inset-x-4 md:inset-x-8 z-[100]">
        <div className="glass-header mx-auto max-w-[1400px] sm:rounded-2xl px-4 sm:px-6 md:px-8 border-b sm:border border-border/50 shadow-md">
          <div className="flex items-center justify-between h-[64px] md:h-[68px]">
            {/* Logo (Desktop & Mobile) */}
            <Link to="/" className="flex items-center shrink-0" aria-label="Degree Guru Home">
              <img
                src={theme === "dark" ? logoDark : logoLight}
                alt="Degree Guru"
                className="h-9 sm:h-11 md:h-12 w-auto animate-float-logo object-contain"
              />
            </Link>

            {/* Desktop Navigation (Courses, Universities, Career Tools, Jobs) — Cleaned: No Blogs/About on main header */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8" aria-label="Desktop Navigation">
              {/* Courses Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCoursesDropdown(true)}
                onMouseLeave={() => setCoursesDropdown(false)}
              >
                <button 
                  className={`flex items-center gap-1.5 text-sm font-medium py-2 transition-colors ${
                    isActive("/online-") || isActive("/courses") ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"
                  }`}
                  aria-expanded={coursesDropdown}
                >
                  Courses <ChevronDown size={14} className={`transition-transform duration-200 ${coursesDropdown ? "rotate-180 text-primary" : ""}`} />
                </button>
                <div
                  className={`absolute top-full left-0 pt-2 w-[540px] transition-all duration-200 ease-out ${
                    coursesDropdown ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="glass-dropdown p-4 rounded-2xl shadow-2xl border border-border/70 grid grid-cols-2 gap-2">
                    <div className="col-span-2 pb-2 border-b border-border/40 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-primary">All UGC-Approved Online Degrees</span>
                      <Link to="/courses" className="text-xs text-muted-foreground hover:text-primary flex items-center gap-1">
                        View All <ArrowRight size={12} />
                      </Link>
                    </div>
                    {CORE_COURSES.map((c) => (
                      <Link
                        key={c.slug}
                        to={`/${c.slug}`}
                        className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors flex flex-col group"
                      >
                        <span className="text-xs font-bold text-foreground group-hover:text-primary">{c.shortName}</span>
                        <span className="text-[11px] text-muted-foreground truncate">{c.fullName}</span>
                      </Link>
                    ))}
                    <div className="col-span-2 pt-2 border-t border-border/40 flex items-center justify-between">
                      <Link to="/class-10" className="text-xs font-semibold text-primary hover:underline">
                        Class 10 (Online Exams) →
                      </Link>
                      <Link to="/class-12" className="text-xs font-semibold text-primary hover:underline">
                        Class 12 (Online Exams) →
                      </Link>
                      <Link to="/offline-courses" className="text-xs text-muted-foreground hover:text-primary">
                        Offline Campus (M.K. University) →
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Universities Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setUniversitiesDropdown(true)}
                onMouseLeave={() => setUniversitiesDropdown(false)}
              >
                <button 
                  className={`flex items-center gap-1.5 text-sm font-medium py-2 transition-colors ${
                    isActive("/universities") ? "text-primary font-semibold" : "text-foreground/80 hover:text-primary"
                  }`}
                  aria-expanded={universitiesDropdown}
                >
                  Universities <ChevronDown size={14} className={`transition-transform duration-200 ${universitiesDropdown ? "rotate-180 text-primary" : ""}`} />
                </button>
                <div
                  className={`absolute top-full left-0 pt-2 w-[420px] transition-all duration-200 ease-out ${
                    universitiesDropdown ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="glass-dropdown p-4 rounded-2xl shadow-2xl border border-border/70 space-y-2">
                    <Link
                      to="/universities"
                      className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-primary">Online Universities Directory</div>
                        <div className="text-[11px] text-muted-foreground">Browse 50+ UGC-DEB approved institutions</div>
                      </div>
                    </Link>
                    <Link
                      to="/universities/compare"
                      className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <GraduationCap size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-primary">Compare Universities</div>
                        <div className="text-[11px] text-muted-foreground">Side-by-side fees, EMI & LMS comparison</div>
                      </div>
                    </Link>
                    <Link
                      to="/offline-courses"
                      className="p-2.5 rounded-xl hover:bg-amber-500/10 transition-colors flex items-center gap-3 group border-t border-border/40 pt-3"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Building2 size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-amber-500">Offline Education</div>
                        <div className="text-[11px] text-muted-foreground">M.K. University, Patan — regular offline degrees</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Career Tools Dropdown */}
              <div 
                className="relative"
                onMouseEnter={() => setCareerDropdown(true)}
                onMouseLeave={() => setCareerDropdown(false)}
              >
                <button 
                  className={`flex items-center gap-1.5 text-sm font-medium py-2 transition-colors ${
                    isActive("/career-finder") || isActive("/roi-calculator") || isActive("/resume-builder")
                      ? "text-primary font-semibold"
                      : "text-foreground/80 hover:text-primary"
                  }`}
                  aria-expanded={careerDropdown}
                >
                  Career Tools <ChevronDown size={14} className={`transition-transform duration-200 ${careerDropdown ? "rotate-180 text-primary" : ""}`} />
                </button>
                <div
                  className={`absolute top-full left-0 pt-2 w-[380px] transition-all duration-200 ease-out ${
                    careerDropdown ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-2 pointer-events-none"
                  }`}
                >
                  <div className="glass-dropdown p-4 rounded-2xl shadow-2xl border border-border/70 space-y-2">
                    <Link
                      to="/career-finder"
                      className="p-2.5 rounded-xl hover:bg-primary/10 transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#6528f7]/10 text-[#6528f7] flex items-center justify-center">
                        <Compass size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-primary flex items-center gap-1.5">
                          Career Finder <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/15 text-primary font-bold">100% Free</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">12-dimension strength & career match</div>
                      </div>
                    </Link>
                    <Link
                      to="/roi-calculator"
                      className="p-2.5 rounded-xl hover:bg-emerald-500/10 transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                        <Calculator size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-emerald-500">Degree ROI Calculator</div>
                        <div className="text-[11px] text-muted-foreground">Salary jump, payback & investment ROI</div>
                      </div>
                    </Link>
                    <Link
                      to="/resume-builder"
                      className="p-2.5 rounded-xl hover:bg-purple-500/10 transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-500 flex items-center justify-center">
                        <FileText size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-purple-500 flex items-center gap-1.5">
                          AI Resume Builder <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-purple-500/15 text-purple-500 font-bold">ATS Score</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">Job-ready resume with AI quantification</div>
                      </div>
                    </Link>
                    <Link
                      to="/emi-calculator"
                      className="p-2.5 rounded-xl hover:bg-amber-500/10 transition-colors flex items-center gap-3 group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                        <Calculator size={16} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-foreground group-hover:text-amber-500 flex items-center gap-1.5">
                          EMI Calculator <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 font-bold">0% No-Cost</span>
                        </div>
                        <div className="text-[11px] text-muted-foreground">Monthly fee installments & approval check</div>
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            </nav>

            {/* Desktop Actions & Mobile Right Action */}
            <div className="flex items-center gap-2.5 sm:gap-3">
              {/* Language Switch Toggle (EN | हि) */}
              <div className="flex items-center rounded-full p-0.5 sm:p-1 bg-muted/60 border border-foreground/15 text-[11px] sm:text-xs font-bold shadow-sm">
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all ${
                    language === "en"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage("hi")}
                  className={`px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full transition-all ${
                    language === "hi"
                      ? "bg-amber-500 text-white shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  aria-label="Switch to Hindi"
                >
                  हि
                </button>
              </div>

              {/* Theme toggle */}
              <button
                onClick={toggle}
                className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-full border border-foreground/15 hover:bg-foreground/5 transition-colors"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-foreground" />}
              </button>

              {/* Mobile WhatsApp Button */}
              <a
                href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20want%20to%20know%20more%20about%20online%20degrees"
                target="_blank"
                rel="noreferrer"
                className="flex lg:hidden items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-all shadow-sm"
                aria-label="Contact on WhatsApp"
              >
                <MessageCircle size={15} className="fill-current" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
