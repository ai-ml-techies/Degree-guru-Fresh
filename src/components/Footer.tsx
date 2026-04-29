import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Facebook, Instagram, Linkedin, Youtube } from "lucide-react";
import logoDark from "@/assets/logo-dark.png";

const trustPills = [
  "100% Free Forever",
  "AICTE Approved Programs",
  "UGC Entitled Degrees",
  "Easy EMI Options",
  "50+ Top Universities",
];

const socials = [
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
  { icon: Youtube, href: "https://youtube.com", label: "YouTube" },
];

export const Footer = () => {
  return (
    <footer className="bg-[#0e0e0e] text-white pt-20 pb-12 mt-0">
      <div className="container-dg">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div>
            <img src={logoDark} alt="Degree Guru" className="h-14 w-auto mb-4" />
            <p className="text-white/70 leading-relaxed text-sm mb-6">
              India's Trusted Free Career Counseling and Recruitment Platform.
            </p>
            <div className="flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="w-10 h-10 aspect-square shrink-0 rounded-full bg-white/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-all hover:-translate-y-1"
                >
                  <s.icon size={16} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li><Link to="/" className="hover:text-white">Home</Link></li>
              <li><Link to="/about" className="hover:text-white">About</Link></li>
              <li><Link to="/blog" className="hover:text-white">Blogs</Link></li>
              <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
              <li><Link to="/recruitment" className="hover:text-white">Careers / Recruitment</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider">Programs</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li><Link to="/programs/online-ba" className="hover:text-white">Online BA</Link></li>
              <li><Link to="/programs/online-bba" className="hover:text-white">Online BBA</Link></li>
              <li><Link to="/programs/online-bca" className="hover:text-white">Online BCA</Link></li>
              <li><Link to="/programs/online-mba" className="hover:text-white">Online MBA</Link></li>
              <li><Link to="/programs/online-mca" className="hover:text-white">Online MCA</Link></li>
              <li><Link to="/programs/online-dba" className="hover:text-white">Online DBA</Link></li>
              <li><Link to="/programs/phd" className="hover:text-white">PhD</Link></li>
              <li><Link to="/class-10-12" className="hover:text-white">Class 10 / 12 Online</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-5 text-sm uppercase tracking-wider">Contact</h4>
            <ul className="space-y-3 text-sm text-white/75">
              <li className="flex items-center gap-2"><Phone size={14} /> 9350199001</li>
              <li className="flex items-center gap-2"><Mail size={14} /> Admissions: admissions@degreeguru.in</li>
              <li className="flex items-center gap-2"><Mail size={14} /> Queries: info@degreeguru.in</li>
              <li className="flex items-center gap-2"><MapPin size={14} /> Gurugram, Haryana, India</li>
            </ul>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 mt-14 mb-10">
          {trustPills.map((p) => (
            <span key={p} className="border border-white/20 rounded-full px-4 py-2 text-xs text-white/80">
              {p}
            </span>
          ))}
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-white/50">
          <div>2026 Degree Guru. Built for India's learners.</div>
          <Link
            to="/privacy"
            className="inline-flex items-center rounded-full border border-white/20 px-4 py-2 text-xs font-semibold text-white/80 hover:bg-white hover:text-[#0e0e0e] transition-all"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </footer>
  );
};
