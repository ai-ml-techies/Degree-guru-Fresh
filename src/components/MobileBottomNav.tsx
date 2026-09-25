import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  GraduationCap, 
  Building2, 
  Compass, 
  X, 
  Calculator, 
  FileText, 
  BookOpen, 
  Sparkles,
  ChevronRight
} from "lucide-react";

export const MobileBottomNav = () => {
  const location = useLocation();
  const [careerDrawerOpen, setCareerDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  const isToolsActive = 
    careerDrawerOpen || 
    isActive("/career-finder") || 
    isActive("/roi-calculator") || 
    isActive("/resume-builder") || 
    isActive("/emi-calculator");

  const getActiveIndex = () => {
    if (isToolsActive) return 3;
    if (isActive("/universities")) return 2;
    if (isActive("/courses") || isActive("/programs")) return 1;
    return 0;
  };

  const activeIndex = getActiveIndex();

  const itemBase = "relative z-10 flex flex-col items-center justify-center py-1 px-1 rounded-xl transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer active:scale-95 select-none";

  return (
    <>
      {/* Mobile Floating Island Bar with Smooth Sliding Highlight */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-md mx-auto z-[95] safe-area-bottom pointer-events-auto select-none"
      >
        <div className="relative h-[64px] px-1 py-1 grid grid-cols-4 items-center rounded-2xl bg-white/96 dark:bg-[#181932]/96 backdrop-blur-2xl border border-black/10 dark:border-white/20 shadow-[0_12px_40px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.08)]">
          {/* Silky Smooth Animated Sliding Apple Pill Indicator */}
          <div 
            className="absolute top-1 bottom-1 rounded-xl bg-primary/10 dark:bg-primary/25 border border-primary/20 dark:border-primary/40 shadow-xs transition-all duration-300 [transition-timing-function:cubic-bezier(0.2,0.8,0.2,1)] pointer-events-none z-0"
            style={{ 
              left: `calc(${activeIndex * 25}% + 3px)`, 
              width: `calc(25% - 6px)` 
            }}
          />

          {/* 1. Home */}
          <Link
            to="/"
            onClick={() => setCareerDrawerOpen(false)}
            className={`${itemBase} ${activeIndex === 0 ? "text-primary font-black" : "text-muted-foreground/85 hover:text-foreground font-semibold"}`}
          >
            <Home 
              size={19} 
              className={`transition-all duration-300 ${activeIndex === 0 ? "stroke-[2.5] text-primary scale-110 drop-shadow-xs" : "stroke-[1.8] scale-100"}`} 
            />
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Home</span>
            <span className={`w-1 h-1 rounded-full bg-primary mt-0.5 transition-all duration-300 ${activeIndex === 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
          </Link>

          {/* 2. Online Programs */}
          <Link
            to="/courses"
            onClick={() => setCareerDrawerOpen(false)}
            className={`${itemBase} ${activeIndex === 1 ? "text-primary font-black" : "text-muted-foreground/85 hover:text-foreground font-semibold"}`}
          >
            <GraduationCap 
              size={19} 
              className={`transition-all duration-300 ${activeIndex === 1 ? "stroke-[2.5] text-primary scale-110 drop-shadow-xs" : "stroke-[1.8] scale-100"}`} 
            />
            <span className="text-[9.5px] mt-0.5 tracking-tight font-bold text-center leading-tight truncate max-w-full">Online Programs</span>
            <span className={`w-1 h-1 rounded-full bg-primary mt-0.5 transition-all duration-300 ${activeIndex === 1 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
          </Link>

          {/* 3. Universities */}
          <Link
            to="/universities"
            onClick={() => setCareerDrawerOpen(false)}
            className={`${itemBase} ${activeIndex === 2 ? "text-primary font-black" : "text-muted-foreground/85 hover:text-foreground font-semibold"}`}
          >
            <Building2 
              size={19} 
              className={`transition-all duration-300 ${activeIndex === 2 ? "stroke-[2.5] text-primary scale-110 drop-shadow-xs" : "stroke-[1.8] scale-100"}`} 
            />
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Universities</span>
            <span className={`w-1 h-1 rounded-full bg-primary mt-0.5 transition-all duration-300 ${activeIndex === 2 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
          </Link>

          {/* 4. Smart Tools (Drawer) */}
          <button
            type="button"
            onClick={() => setCareerDrawerOpen(!careerDrawerOpen)}
            className={`${itemBase} ${activeIndex === 3 ? "text-primary font-black" : "text-muted-foreground/85 hover:text-foreground font-semibold"}`}
          >
            <div className="relative">
              <Compass 
                size={19} 
                className={`transition-all duration-300 ${activeIndex === 3 ? "stroke-[2.5] text-primary scale-110 drop-shadow-xs" : "stroke-[1.8] text-muted-foreground/85 scale-100"}`} 
              />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-[#0c0d1a]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Smart Tools</span>
            <span className={`w-1 h-1 rounded-full bg-primary mt-0.5 transition-all duration-300 ${activeIndex === 3 ? "opacity-100 scale-100" : "opacity-0 scale-50"}`} />
          </button>
        </div>
      </nav>

      {/* Career Action Bottom Sheet Modal */}
      {careerDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-[100] animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setCareerDrawerOpen(false)} 
          />
          <div className="absolute bottom-16 inset-x-0 bg-background/95 backdrop-blur-xl border-t border-border rounded-t-3xl p-5 shadow-2xl safe-area-bottom animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Sparkles size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Career Discovery Suite</h3>
                  <p className="text-[11px] text-muted-foreground">Free AI-powered tools & guidance</p>
                </div>
              </div>
              <button
                onClick={() => setCareerDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-2.5 py-4">
              <Link
                to="/career-finder"
                onClick={() => setCareerDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-card hover:bg-muted/40 border border-border/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#6528f7]/10 text-[#6528f7] flex items-center justify-center">
                    <Compass size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      Career Finder <span className="text-[10px] px-2 py-0.5 rounded-full bg-primary/15 text-primary font-bold">100% Free</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">12-dimension strength & career match</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>

              <Link
                to="/roi-calculator"
                onClick={() => setCareerDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-card hover:bg-muted/40 border border-border/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Calculator size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Degree ROI Calculator</div>
                    <p className="text-[11px] text-muted-foreground">Estimate salary jump & payback period</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>

              <Link
                to="/resume-builder"
                onClick={() => setCareerDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-card hover:bg-muted/40 border border-border/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                    <FileText size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                      AI Resume Builder <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/15 text-purple-500 font-bold">ATS Ready</span>
                    </div>
                    <p className="text-[11px] text-muted-foreground">Job-ready resume with AI quantification</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>

              <Link
                to="/blog"
                onClick={() => setCareerDrawerOpen(false)}
                className="flex items-center justify-between p-3 rounded-2xl bg-card hover:bg-muted/40 border border-border/60 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                    <BookOpen size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground">Career Resources & Guides</div>
                    <p className="text-[11px] text-muted-foreground">IGNOU vs Online, salary trends & tips</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default MobileBottomNav;
