import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, ArrowRight, Shield, Award, Star } from "lucide-react";
import logoDark from "@/assets/logo-dark.png";

const trustBadges = [
  { icon: Shield, label: "UGC-DEB Approved", sub: "All partner universities" },
  { icon: Award, label: "AICTE Recognised", sub: "Quality assured programs" },
  { icon: Star, label: "4.9★ Rated", sub: "by 5,000+ students" },
];

const trustPills = [
  "100% Free Forever",
  "AICTE Approved Programs",
  "UGC Entitled Degrees",
  "Easy EMI Options",
  "50+ Top Universities",
];

const SvgInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
);
const SvgFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
);
const SvgLinkedin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);
const SvgYoutube = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
);
const SvgWhatsapp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
);

const socials = [
  { Svg: SvgInstagram, href: "https://www.instagram.com/degreeguru/", label: "Instagram", color: "hover:bg-gradient-to-br hover:from-purple-500 hover:to-pink-500" },
  { Svg: SvgFacebook, href: "https://www.facebook.com/degreegurucareer/", label: "Facebook", color: "hover:bg-blue-600" },
  { Svg: SvgLinkedin, href: "https://www.linkedin.com/company/degree-guru", label: "LinkedIn", color: "hover:bg-blue-700" },
  { Svg: SvgYoutube, href: "https://www.youtube.com/@DegreeGuru", label: "YouTube", color: "hover:bg-red-600" },
  { Svg: SvgWhatsapp, href: "https://wa.me/919350199001", label: "WhatsApp", color: "hover:bg-[#25D366]" },
];

const programs = [
  { to: "/programs/online-ba", label: "Online BA" },
  { to: "/programs/online-bba", label: "Online BBA" },
  { to: "/programs/online-bca", label: "Online BCA" },
  { to: "/programs/online-mba", label: "Online MBA" },
  { to: "/programs/online-mca", label: "Online MCA" },
  { to: "/programs/online-dba", label: "Online DBA" },
  { to: "/programs/phd", label: "PhD" },
  { to: "/class-10-12", label: "Class 10 / 12 Online" },
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
              <p className="text-white/55 text-sm leading-relaxed">
                Over 5,000 students guided to the right program. Our counselors call back within 2 hours.
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
                  <div className="text-xs text-white/45 leading-tight">{sub}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-dg py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand column */}
          <div>
            <img src={logoDark} alt="Degree Guru" className="h-14 w-auto mb-5" />
            <p className="text-white/55 leading-relaxed text-sm mb-6">
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
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest text-white/40">Quick Links</h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              {[
                { to: "/",            label: "Home"                  },
                { to: "/about",       label: "About Us"              },
                { to: "/contact",     label: "Contact Us"            },
                { to: "/blog",        label: "Blog & Resources"      },
                { to: "/recruitment", label: "Careers / Recruitment" },
                { to: "/privacy",     label: "Privacy Policy"        },
                { to: "/terms",       label: "Terms of Use"          },
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

          {/* Jobs */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest text-white/40">Jobs</h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              {[
                { to: "/jobs/employer",   label: "Post a Job — Free"  },
                { to: "/jobs/job-seeker", label: "Browse Jobs"        },
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

          {/* Programs */}
          <div>
            <h4 className="font-bold mb-5 text-xs uppercase tracking-widest text-white/40">Programs</h4>
            <ul className="space-y-2.5 text-sm text-white/65">
              {programs.map(({ to, label }) => (
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

        {/* Trust pills */}
        <div className="flex flex-wrap gap-2.5 mt-14 mb-10">
          {trustPills.map((p) => (
            <span
              key={p}
              className="border border-white/12 rounded-full px-4 py-1.5 text-xs text-white/60 hover:border-primary/40 hover:text-white/85 transition-all cursor-default"
            >
              {p}
            </span>
          ))}
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
