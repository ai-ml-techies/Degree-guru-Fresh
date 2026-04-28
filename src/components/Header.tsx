import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, Moon, Sun, X, ChevronDown } from "lucide-react";
import { useTheme } from "./ThemeProvider";
import { PROGRAMS } from "@/data/programs";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/programs", label: "Programs", dropdown: true },
  { to: "/class-10-12", label: "Class 10 & 12" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export const Header = () => {
  const { theme, toggle } = useTheme();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [progOpen, setProgOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  return (
    <>
      {/* Floating, uplifted, separated header */}
      <header className="fixed top-4 inset-x-4 md:inset-x-8 z-[100]">
        <div className="glass-header mx-auto max-w-[1400px] rounded-2xl px-5 md:px-8">
          <div className="flex items-center justify-between h-[68px]">
            <Link to="/" className="font-extrabold text-xl md:text-2xl tracking-tight">
              Degree Guru
            </Link>

            <nav className="hidden lg:flex items-center gap-8">
              {navItems.map((item) =>
                item.dropdown ? (
                  <div
                    key={item.to}
                    className="relative"
                    onMouseEnter={() => setProgOpen(true)}
                    onMouseLeave={() => setProgOpen(false)}
                  >
                    <button className="flex items-center gap-1 text-sm font-medium hover:text-primary transition-colors py-2">
                      {item.label} <ChevronDown size={14} />
                    </button>
                    {progOpen && (
                      <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 w-[520px]">
                        <div className="glass-dropdown p-4 grid grid-cols-2 gap-1">
                          {PROGRAMS.map((p) => (
                            <Link
                              key={p.slug}
                              to={`/programs/${p.slug}`}
                              className="px-3 py-2.5 rounded-lg hover:bg-primary/15 transition-colors text-sm font-semibold"
                            >
                              {p.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
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
            <span className="font-extrabold text-xl">Degree Guru</span>
            <button onClick={() => setMobileOpen(false)} aria-label="Close" className="w-11 h-11 flex items-center justify-center rounded-full border border-foreground/15">
              <X size={20} />
            </button>
          </div>
          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="text-lg font-semibold py-3 border-b border-foreground/10"
              >
                {item.label}
              </Link>
            ))}
            <p className="text-xs font-bold uppercase tracking-wider text-primary mt-6 mb-2">Programs</p>
            <div className="grid grid-cols-2 gap-2">
              {PROGRAMS.map((p) => (
                <Link
                  key={p.slug}
                  to={`/programs/${p.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className="px-3 py-2 rounded-lg bg-primary/10 text-sm font-semibold"
                >
                  {p.name}
                </Link>
              ))}
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
