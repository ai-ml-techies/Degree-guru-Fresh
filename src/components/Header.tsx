import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X, ChevronDown, Building2, UserSearch } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "./ThemeProvider";
import { PROGRAMS } from "@/data/programs";
import { fetchHomeContent } from "@/lib/api";
import logoLight from "@/assets/logo-light.png";
import logoDark from "@/assets/logo-dark.png";

const DEFAULT_ANNOUNCEMENTS = [
  "🎓 100% Free Career Counseling — No Hidden Fees",
  "✅ 5,000+ Students Guided",
  "🏛️ 50+ UGC Approved Universities",

  "💸 No-Cost EMI from ₹3,500/month",
];

type NavItem = { to: string; label: string; dropdown?: "programs" | "jobs" };

const navItems: NavItem[] = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs", dropdown: "programs" },
  { to: "/class-10-12", label: "Class 10 & 12" },
  { to: "/jobs", label: "Jobs", dropdown: "jobs" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progOpen, setProgOpen] = useState(false);
  const [jobsOpen, setJobsOpen] = useState(false);

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
    } catch { return DEFAULT_ANNOUNCEMENTS; }
  })();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Announcement bar */}
      <div className="announcement-bar fixed top-0 inset-x-0 z-[101] h-8 overflow-hidden flex items-center">
        <div className="flex animate-ticker whitespace-nowrap">
          {[...ticker, ...ticker].map((text, i) => (
            <span key={i} className="text-white text-[11px] font-semibold tracking-wide px-4 sm:px-8">
              {text}
            </span>
          ))}
        </div>
      </div>

      {/* Floating, uplifted, separated header */}
      <header className="fixed top-8 inset-x-4 md:inset-x-8 z-[100]">
        <div className="glass-header mx-auto max-w-[1400px] rounded-2xl px-5 md:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <Link to="/" className="flex items-center" aria-label="Degree Guru">
              <img
                src={theme === "dark" ? logoDark : logoLight}
                alt="Degree Guru"
                className="h-11 md:h-12 w-auto animate-float-logo"
              />
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) =>
                item.dropdown === "programs" ? (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => setProgOpen(true)}
                    onMouseLeave={() => setProgOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2">
                      {item.label} <ChevronDown size={14} />
                    </button>
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[560px] transition-all duration-200 ease-out ${
                        progOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-1 pointer-events-none"
                      }`}
                    >
                      <div className="glass-dropdown p-3 grid grid-cols-2 gap-1">
                        {PROGRAMS.map((p) => (
                          <Link
                            key={p.slug}
                            to={`/programs/${p.slug}`}
                            className="group px-3 py-2.5 rounded-lg transition-colors duration-150 hover:bg-primary/15 will-change-transform"
                          >
                            <div className="text-sm font-semibold transition-colors duration-150 group-hover:text-primary">{p.name}</div>
                            <div className="text-[11px] text-foreground/60 truncate">{p.full}</div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : item.dropdown === "jobs" ? (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => setJobsOpen(true)}
                    onMouseLeave={() => setJobsOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2">
                      {item.label} <ChevronDown size={14} />
                    </button>
                    <div
                      className={`absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[220px] transition-all duration-200 ease-out ${
                        jobsOpen
                          ? "opacity-100 translate-y-0 pointer-events-auto"
                          : "opacity-0 -translate-y-1 pointer-events-none"
                      }`}
                    >
                      <div className="glass-dropdown p-2">
                        <Link
                          to="/jobs/employer"
                          onClick={() => setJobsOpen(false)}
                          className="group flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 transition-colors duration-150"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-150">
                            <Building2 size={14} className="text-primary group-hover:text-primary-foreground transition-colors" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold group-hover:text-primary transition-colors">Employer</div>
                            <div className="text-[11px] text-foreground/55 leading-tight">Post jobs for free</div>
                          </div>
                        </Link>
                        <Link
                          to="/jobs/job-seeker"
                          onClick={() => setJobsOpen(false)}
                          className="group flex items-start gap-3 px-3 py-3 rounded-xl hover:bg-primary/10 transition-colors duration-150"
                        >
                          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0 group-hover:bg-primary transition-colors duration-150">
                            <UserSearch size={14} className="text-primary group-hover:text-primary-foreground transition-colors" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold group-hover:text-primary transition-colors">Job Seeker</div>
                            <div className="text-[11px] text-foreground/55 leading-tight">Browse open positions</div>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </div>
                ) : (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `text-sm font-medium transition-colors hover:text-primary ${isActive ? "text-primary" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </nav>

            <div className="flex items-center gap-2 md:gap-3">
              <button
                onClick={toggle}
                aria-label="Toggle theme"
                className="hidden sm:flex w-10 h-10 items-center justify-center rounded-full border border-foreground/15 hover:border-primary/40 transition-all"
              >
                <span className="transition-transform duration-500" style={{ transform: theme === "dark" ? "rotate(180deg)" : "rotate(0)" }}>
                  {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />}
                </span>
              </button>
              <Link
                to="/contact"
                className="hidden sm:inline-flex bg-primary text-primary-foreground rounded-full px-5 py-2.5 text-[13px] font-semibold hover:shadow-lg hover:shadow-primary/30 transition-all"
              >
                Instant Chat
              </Link>
              <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full border border-foreground/15 bg-background/40"
                aria-label="Open menu"
              >
                <Menu size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu - rendered outside header so it always sits on top */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-[200] glass-dropdown p-6 overflow-auto animate-fade-in">
          <div className="flex justify-between items-center mb-8">
            <img src={theme === "dark" ? logoDark : logoLight} alt="Degree Guru" className="h-12 w-auto" />
            <button onClick={() => setMobileOpen(false)} aria-label="Close" className="w-11 h-11 flex items-center justify-center rounded-full border border-foreground/15">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {navItems.filter(i => !i.dropdown).map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-semibold py-3 border-b border-foreground/10"
              >
                {item.label}
              </Link>
            ))}

            {/* Programs sub-list */}
            <p className="text-xs font-bold uppercase tracking-wider text-primary mt-6 mb-2">Programs</p>
            <div className="grid grid-cols-1 gap-2">
              {PROGRAMS.map((p) => (
                <Link
                  key={p.slug}
                  to={`/programs/${p.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2.5 rounded-lg bg-primary/10"
                >
                  <div className="text-sm font-semibold">{p.name}</div>
                  <div className="text-[11px] text-foreground/60">{p.full}</div>
                </Link>
              ))}
            </div>

            {/* Jobs sub-list */}
            <p className="text-xs font-bold uppercase tracking-wider text-primary mt-6 mb-2">Jobs</p>
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/jobs/employer"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <Building2 size={16} className="text-primary shrink-0" />
                <div>
                  <div className="text-sm font-semibold">Employer</div>
                  <div className="text-[10px] text-foreground/55">Post jobs free</div>
                </div>
              </Link>
              <Link
                to="/jobs/job-seeker"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 px-3 py-3 rounded-xl bg-primary/10 hover:bg-primary/20 transition-colors"
              >
                <UserSearch size={16} className="text-primary shrink-0" />
                <div>
                  <div className="text-sm font-semibold">Job Seeker</div>
                  <div className="text-[10px] text-foreground/55">Browse jobs</div>
                </div>
              </Link>
            </div>

            <button onClick={toggle} className="mt-6 flex items-center gap-2 text-sm">
              {theme === "dark" ? <Sun size={16} /> : <Moon size={16} />} Toggle theme
            </button>
          </div>
        </div>
      )}
    </>
  );
};
