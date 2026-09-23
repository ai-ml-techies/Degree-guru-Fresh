import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  GraduationCap, 
  Briefcase, 
  Compass, 
  User, 
  X, 
  Calculator, 
  FileText, 
  BookOpen, 
  Bookmark, 
  Sparkles,
  PhoneCall,
  ChevronRight
} from "lucide-react";

export const MobileBottomNav = () => {
  const location = useLocation();
  const [careerDrawerOpen, setCareerDrawerOpen] = useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = useState(false);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <>
      {/* Mobile Fixed Bottom Bar */}
      <nav 
        aria-label="Mobile Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-[95] mobile-bottom-dock border-t border-border/40 shadow-2xl safe-area-bottom"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* 1. Home */}
          <Link
            to="/"
            onClick={() => { setCareerDrawerOpen(false); setProfileDrawerOpen(false); }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
              isActive("/") && !careerDrawerOpen && !profileDrawerOpen
                ? "text-primary font-semibold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Home size={20} className={isActive("/") && !careerDrawerOpen && !profileDrawerOpen ? "stroke-[2.5]" : "stroke-[1.8]"} />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Home</span>
          </Link>

          {/* 2. Courses */}
          <Link
            to="/courses"
            onClick={() => { setCareerDrawerOpen(false); setProfileDrawerOpen(false); }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
              isActive("/courses") || isActive("/programs")
                ? "text-primary font-semibold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <GraduationCap size={20} className={isActive("/courses") ? "stroke-[2.5]" : "stroke-[1.8]"} />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Courses</span>
          </Link>

          {/* 3. Jobs */}
          <Link
            to="/jobs/job-seeker"
            onClick={() => { setCareerDrawerOpen(false); setProfileDrawerOpen(false); }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
              isActive("/jobs")
                ? "text-primary font-semibold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Briefcase size={20} className={isActive("/jobs") ? "stroke-[2.5]" : "stroke-[1.8]"} />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Jobs</span>
          </Link>

          {/* 4. Career (Action Drawer) */}
          <button
            type="button"
            onClick={() => {
              setProfileDrawerOpen(false);
              setCareerDrawerOpen(!careerDrawerOpen);
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
              careerDrawerOpen || isActive("/career-finder") || isActive("/roi-calculator") || isActive("/resume-builder")
                ? "text-primary font-semibold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <div className="relative">
              <Compass size={20} className={careerDrawerOpen ? "stroke-[2.5] text-primary" : "stroke-[1.8]"} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-primary animate-pulse" />
            </div>
            <span className="text-[10px] mt-1 font-medium tracking-tight">Career</span>
          </button>

          {/* 5. Profile (Drawer) */}
          <button
            type="button"
            onClick={() => {
              setCareerDrawerOpen(false);
              setProfileDrawerOpen(!profileDrawerOpen);
            }}
            className={`flex flex-col items-center justify-center py-1 rounded-xl transition-all duration-200 ${
              profileDrawerOpen
                ? "text-primary font-semibold scale-105"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <User size={20} className={profileDrawerOpen ? "stroke-[2.5] text-primary" : "stroke-[1.8]"} />
            <span className="text-[10px] mt-1 font-medium tracking-tight">Profile</span>
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

      {/* Profile & Saved Items Bottom Sheet */}
      {profileDrawerOpen && (
        <div className="md:hidden fixed inset-0 z-[100] animate-fade-in">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setProfileDrawerOpen(false)} 
          />
          <div className="absolute bottom-16 inset-x-0 bg-background/95 backdrop-blur-xl border-t border-border rounded-t-3xl p-5 shadow-2xl safe-area-bottom animate-slide-up">
            <div className="flex items-center justify-between pb-3 border-b border-border/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                  DG
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Your Career Space</h3>
                  <p className="text-[11px] text-muted-foreground">Saved courses, jobs & applications</p>
                </div>
              </div>
              <button
                onClick={() => setProfileDrawerOpen(false)}
                className="w-8 h-8 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 py-4">
              <Link
                to="/courses"
                onClick={() => setProfileDrawerOpen(false)}
                className="p-3 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-1.5">
                  <Bookmark size={18} />
                </div>
                <div className="text-xs font-semibold">Saved Courses</div>
                <div className="text-[10px] text-muted-foreground">Explore Degrees</div>
              </Link>

              <Link
                to="/jobs/job-seeker"
                onClick={() => setProfileDrawerOpen(false)}
                className="p-3 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-1.5">
                  <Briefcase size={18} />
                </div>
                <div className="text-xs font-semibold">Job Applications</div>
                <div className="text-[10px] text-muted-foreground">100% Free Apply</div>
              </Link>

              <Link
                to="/resume-builder"
                onClick={() => setProfileDrawerOpen(false)}
                className="p-3 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center mb-1.5">
                  <FileText size={18} />
                </div>
                <div className="text-xs font-semibold">My AI Resume</div>
                <div className="text-[10px] text-muted-foreground">ATS Ready PDF</div>
              </Link>

              <Link
                to="/referral"
                onClick={() => setProfileDrawerOpen(false)}
                className="p-3 rounded-2xl bg-card border border-border/60 hover:border-primary/40 transition-all flex flex-col items-center text-center"
              >
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-1.5">
                  <Sparkles size={18} />
                </div>
                <div className="text-xs font-semibold">Refer & Earn</div>
                <div className="text-[10px] text-amber-500 font-bold">₹5,000 Reward</div>
              </Link>
            </div>

            <div className="pt-2 border-t border-border/40">
              <a
                href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20need%20expert%20guidance"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm"
              >
                <PhoneCall size={14} /> Chat with Career Advisor on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
