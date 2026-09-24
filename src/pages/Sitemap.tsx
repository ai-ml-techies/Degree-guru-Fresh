import { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { ACTIVE_ONLINE_UNIVERSITIES } from "@/data/universities";
import { COURSES } from "@/data/courses";
import { 
  Building2, 
  GraduationCap, 
  Calculator, 
  Briefcase, 
  HelpCircle, 
  BookOpen, 
  Search, 
  Compass, 
  Layers, 
  FileText,
  Gift,
  PhoneCall,
  ShieldCheck,
  ExternalLink
} from "lucide-react";

export const Sitemap = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const sections = [
    {
      title: "Online Degree Programs",
      icon: GraduationCap,
      description: "UGC-DEB approved Master's and Bachelor's programs in technical and management fields.",
      links: COURSES.map((c) => ({
        label: `${c.title} — ${c.fullName}`,
        href: `/${c.slug}`,
      })),
      viewAll: { label: "Explore All Online Courses", href: "/courses" },
    },
    {
      title: "Accredited Online Universities",
      icon: Building2,
      description: "NAAC A+ & A++ rated institutions with live online exams, LMS, and placement assistance.",
      links: ACTIVE_ONLINE_UNIVERSITIES.slice(0, 15).map((u) => ({
        label: `${u.name} (${u.shortName})`,
        href: `/universities/${u.slug}`,
      })),
      viewAll: { label: "View All 30+ Universities", href: "/universities" },
    },
    {
      title: "University Comparison & Tools",
      icon: Layers,
      description: "Interactive benchmark tools to objectively compare universities, fees, and career outcomes.",
      links: [
        { label: "Side-by-Side University Comparison", href: "/universities/compare" },
        { label: "0% Interest EMI Installment Calculator", href: "/emi-calculator" },
        { label: "Education ROI & Salary Boost Calculator", href: "/roi-calculator" },
        { label: "AI Career Matcher & Stream Finder", href: "/career-finder" },
        { label: "Free ATS-Optimized Resume Builder", href: "/resume-builder" },
      ],
    },
    {
      title: "Class 10th & 12th Board Examinations",
      icon: BookOpen,
      description: "Recognized secondary and senior secondary board pathways with flexible online exams.",
      links: [
        { label: "Class 10th Direct Online Exams", href: "/class-10" },
        { label: "Class 12th Direct Online Exams", href: "/class-12" },
        { label: "Open Schooling (BOSSE) Hub", href: "/class-10-12" },
        { label: "Regular Offline Campus Degree Programs", href: "/offline-courses" },
      ],
    },
    {
      title: "Career & Placement Ecosystem",
      icon: Briefcase,
      description: "100% placement support, hiring drives, and dedicated student-to-employer matching.",
      links: [
        { label: "Candidate Job Portal & Career Switch", href: "/job-seeker" },
        { label: "Corporate Employer Talent Matching", href: "/employer" },
        { label: "Corporate Recruitment Services", href: "/recruitment" },
        { label: "Refer & Earn ₹5,000 Guaranteed Cash Reward", href: "/referral" },
      ],
    },
    {
      title: "Information & Corporate Governance",
      icon: ShieldCheck,
      description: "Legal policies, contact channels, and higher education knowledge base.",
      links: [
        { label: "About Degree Guru", href: "/about" },
        { label: "Contact Us & Counselor Support", href: "/contact" },
        { label: "Education Blog & Career Guides", href: "/blogs" },
        { label: "Privacy Policy & Student Data Protection", href: "/privacy" },
        { label: "Crawler XML Sitemap (sitemap.xml)", href: "/sitemap.xml" },
      ],
    },
  ];

  const filteredSections = sections.map((sec) => ({
    ...sec,
    links: sec.links.filter((l) =>
      l.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sec.title.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter((sec) => sec.links.length > 0 || searchTerm === "");

  return (
    <>
      <Helmet>
        <title>Sitemap - Directory of Universities, Degrees & Career Tools | Degree Guru</title>
        <meta
          name="description"
          content="Explore the complete sitemap of Degree Guru. Find links to all UGC-DEB approved online universities, Master's and Bachelor's programs, EMI calculators, and counseling portals."
        />
        <link rel="canonical" href="https://degreeguru.in/sitemap" />
      </Helmet>

      <div className="container-dg py-8 md:py-12">
        <AppBreadcrumb items={[{ label: "Sitemap" }]} />

        {/* Header */}
        <div className="max-w-3xl mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-3">
            <Compass size={14} /> Degree Guru Index
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-foreground tracking-tight mb-2">
            Degree Guru Sitemap
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Easily navigate across all accredited online universities, degrees, comparison matrices, AI career tools, and student portals.
          </p>
        </div>

        {/* Search filter */}
        <div className="relative max-w-md mb-8">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input
            type="text"
            placeholder="Search pages or programs in sitemap..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-card border border-border text-xs focus:ring-2 focus:ring-primary/40 focus:outline-none shadow-sm"
          />
        </div>

        {/* Grid of Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSections.map((sec, idx) => {
            const Icon = sec.icon;
            return (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-card border border-border/80 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon size={16} />
                    </div>
                    <h2 className="text-base font-extrabold text-foreground">{sec.title}</h2>
                  </div>
                  <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
                    {sec.description}
                  </p>

                  <ul className="space-y-2 text-xs">
                    {sec.links.map((link, lIdx) => (
                      <li key={lIdx}>
                        {link.href.endsWith(".xml") ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-0.5"
                          >
                            <span>•</span>
                            <span className="truncate">{link.label}</span>
                            <ExternalLink size={10} className="shrink-0 text-muted-foreground/60" />
                          </a>
                        ) : (
                          <Link
                            to={link.href}
                            className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5 py-0.5"
                          >
                            <span className="text-primary/70">•</span>
                            <span className="truncate">{link.label}</span>
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>

                {sec.viewAll && (
                  <div className="pt-3 mt-4 border-t border-border/50">
                    <Link
                      to={sec.viewAll.href}
                      className="text-xs font-bold text-primary hover:underline flex items-center justify-between"
                    >
                      <span>{sec.viewAll.label}</span>
                      <span>&rarr;</span>
                    </Link>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Sitemap;
