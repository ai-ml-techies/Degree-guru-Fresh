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

  const itemBase = "flex flex-col items-center justify-center py-1.5 px-1 rounded-xl transition-all duration-300 outline-none focus:outline-none focus-visible:outline-none focus-visible:ring-0 cursor-pointer";
  const activeStyle = "bg-primary/20 dark:bg-primary/30 text-primary font-black border border-primary/40 shadow-[0_0_18px_rgba(101,40,247,0.45)] backdrop-blur-xl scale-[1.02]";
  const inactiveStyle = "text-foreground/70 hover:text-foreground hover:bg-white/40 dark:hover:bg-white/5 font-semibold";

  return (
    <>
      {/* Mobile Floating Glassmorphism Island Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-3 inset-x-3 sm:inset-x-6 max-w-md mx-auto z-[95] safe-area-bottom pointer-events-auto select-none"
      >
        <div className="h-[64px] px-1.5 py-1 grid grid-cols-4 items-center gap-1 rounded-2xl bg-white/85 dark:bg-[#0c0d1a]/90 backdrop-blur-2xl border border-white/60 dark:border-white/15 shadow-[0_12px_40px_rgba(101,40,247,0.22),0_4px_16px_rgba(0,0,0,0.1)]">
          {/* 1. Home */}
          <Link
            to="/"
            onClick={() => setCareerDrawerOpen(false)}
            className={`${itemBase} ${isActive("/") && !careerDrawerOpen ? activeStyle : inactiveStyle}`}
          >
            <Home size={19} className={isActive("/") && !careerDrawerOpen ? "stroke-[2.5]" : "stroke-[1.8]"} />
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Home</span>
          </Link>

          {/* 2. Online Programs */}
          <Link
            to="/courses"
            onClick={() => setCareerDrawerOpen(false)}
            className={`${itemBase} ${(isActive("/courses") || isActive("/programs")) && !careerDrawerOpen ? activeStyle : inactiveStyle}`}
          >
            <GraduationCap size={19} className={(isActive("/courses") || isActive("/programs")) && !careerDrawerOpen ? "stroke-[2.5]" : "stroke-[1.8]"} />
            <span className="text-[9.5px] mt-0.5 tracking-tight font-bold text-center leading-tight truncate max-w-full">Online Programs</span>
          </Link>

          {/* 3. Universities */}
          <Link
            to="/universities"
            onClick={() => setCareerDrawerOpen(false)}
            className={`${itemBase} ${isActive("/universities") && !careerDrawerOpen ? activeStyle : inactiveStyle}`}
          >
            <Building2 size={19} className={isActive("/universities") && !careerDrawerOpen ? "stroke-[2.5]" : "stroke-[1.8]"} />
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Universities</span>
          </Link>

          {/* 4. Smart Tools (Drawer) */}
          <button
            type="button"
            onClick={() => setCareerDrawerOpen(!careerDrawerOpen)}
            className={`${itemBase} ${isToolsActive ? activeStyle : inactiveStyle}`}
          >
            <div className="relative">
              <Compass size={19} className={isToolsActive ? "stroke-[2.5] text-primary" : "stroke-[1.8]"} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary ring-2 ring-white dark:ring-[#0c0d1a] shadow-[0_0_8px_#6528f7]" />
            </div>
            <span className="text-[10px] mt-0.5 tracking-tight font-bold">Smart Tools</span>
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
