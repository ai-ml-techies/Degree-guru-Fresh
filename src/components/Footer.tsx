import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight, Shield, Award, Star } from "lucide-react";
import logoDark from "@/assets/logo-dark.png";

const trustBadges = [
  { icon: Shield, label: "UGC-DEB Approved", sub: "All listed accredited universities" },
  { icon: Award, label: "AICTE Recognised", sub: "Quality assured programs" },
  { icon: Star, label: "4.9★ Rated", sub: "by 5,000+ students" },
];

const ugPrograms = [
  { to: "/online-bba", label: "Online BBA" },
  { to: "/online-bca", label: "Online BCA" },
  { to: "/online-bcom", label: "Online B.Com" },
  { to: "/online-ba", label: "Online BA" },
  { to: "/class-10-12", label: "Class 10 / 12 Online" },
];

const pgPrograms = [
  { to: "/online-mba", label: "Online MBA" },
  { to: "/online-mca", label: "Online MCA" },
  { to: "/online-mcom", label: "Online M.Com" },
  { to: "/online-ma", label: "Online MA" },
  { to: "/online-msc", label: "Online M.Sc" },
  { to: "/online-dba", label: "Online DBA (Doctorate)" },
];

export const Footer = () => {
  return (
    <footer className="relative bg-[#0c0d1a] text-white overflow-hidden">
      {/* Top gradient glow */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-primary/10 blur-[80px] pointer-events-none" />

      {/* Newsletter / CTA strip */}
      <div className="border-b border-white/8">
        <div className="container-dg py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            <div className="max-w-md">
              <h3 className="text-xl font-bold mb-2">
                Get <span className="text-gradient">free counseling</span> — no cost, ever
              </h3>
              <p className="text-white/70 text-sm leading-relaxed">
                Over 5,000 students guided to the right program with 100% unbiased expert career counseling.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
              <a
                href="https://wa.me/919350199001?text=Hi%2C%20I%27d%20like%20free%20career%20counseling"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#25D366] text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-[#22c55e] transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-green-500/30"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Chat on WhatsApp
              </a>
              <Link
                to="/contact"
                className="inline-flex items-center justify-center gap-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl text-sm hover:bg-primary/90 transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30"
              >
                Book a Free Call <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* Trust badges row */}
          <div className="flex flex-wrap gap-6 mt-8 pt-8 border-t border-white/8">
            {trustBadges.map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center shrink-0">
                  <Icon size={16} className="text-primary" />
                </div>
                <div>
                  <div className="text-sm font-semibold leading-tight">{label}</div>
                  <div className="text-xs text-white/60 leading-tight">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid - Balanced 5 columns with segregated UG & PG */}
      <div className="container-dg py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-8">
          {/* Brand column */}
          <div className="sm:col-span-2 lg:col-span-1">
            <img src={logoDark} alt="Degree Guru" className="h-14 w-auto mb-5" />
            <p className="text-white/70 leading-relaxed text-sm mb-6">
              India's trusted free career counseling and online degree guidance platform. Helping learners since 2020.
            </p>
            <div className="flex gap-2.5">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className={`w-9 h-9 aspect-square shrink-0 rounded-xl bg-white/8 flex items-center justify-center transition-all duration-200 hover:-translate-y-1 hover:text-white ${s.color}`}
                >
                  <s.Svg />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest text-white/50">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              {[
                { to: "/",            label: "Home"                  },
                { to: "/about",       label: "About Us"              },
                { to: "/contact",     label: "Contact Us"            },
                { to: "/blog",        label: "Blog & Resources"      },
                { to: "/universities",label: "Universities"          },
                { to: "/career-finder",label: "Career Tools"         },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary transition-colors shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Online UG Courses */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest text-white/50">Online UG Courses</h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              {ugPrograms.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary transition-colors shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Online PG Courses */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest text-white/50">Online PG Courses</h4>
            <ul className="space-y-2.5 text-sm text-white/75">
              {pgPrograms.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to} className="hover:text-white hover:translate-x-1 transition-all inline-flex items-center gap-1.5 group">
                    <span className="w-1 h-1 rounded-full bg-primary/60 group-hover:bg-primary transition-colors shrink-0" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest text-white/40">Get In Touch</h4>
            <ul className="space-y-4 text-sm text-white/65">
              <li>
                <a href="tel:+919350199001" className="flex items-start gap-3 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors mt-0.5">
                    <Phone size={13} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-white/85">+91 93501 99001</div>
                    <div className="text-xs text-white/40">Mon – Sun, 9 AM – 8 PM</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:admissions@degreeguru.in" className="flex items-start gap-3 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors mt-0.5">
                    <Mail size={13} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-white/85">admissions@degreeguru.in</div>
                    <div className="text-xs text-white/40">For program admissions</div>
                  </div>
                </a>
              </li>
              <li>
                <a href="mailto:info@degreeguru.in" className="flex items-start gap-3 hover:text-white transition-colors group">
                  <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 group-hover:bg-primary/25 transition-colors mt-0.5">
                    <Mail size={13} className="text-primary" />
                  </div>
                  <div>
                    <div className="font-medium text-white/85">info@degreeguru.in</div>
                    <div className="text-xs text-white/40">General queries</div>
                  </div>
                </a>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin size={13} className="text-primary" />
                </div>
                <div>
                  <div className="font-medium text-white/85">Gurugram, Haryana</div>
                  <div className="text-xs text-white/40">India</div>
                </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/8 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <p className="text-xs text-white/35">
            © 2026 Degree Guru. All rights reserved. Built for India's learners.
          </p>
          <div className="flex items-center gap-3">
            <Link to="/privacy" className="text-xs text-white/45 hover:text-white transition-colors">Privacy Policy</Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link to="/terms" className="text-xs text-white/45 hover:text-white transition-colors">Terms of Use</Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link to="/sitemap" className="text-xs text-white/45 hover:text-white transition-colors">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
