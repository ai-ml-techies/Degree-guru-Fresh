import React from "react";

export type ResumeData = {
  fullName: string;
  professionalTitle: string;
  location: string;
  email: string;
  phone: string;
  linkedin: string;
  portfolio: string;
  professionalSummary: string;
  experiences: {
    company: string;
    role: string;
    title?: string;
    duration: string;
    bullets: string[];
  }[];
  education: {
    degree: string;
    institution: string;
    year: string;
    score?: string;
  }[];
  skills: string[];
  projects?: {
    title: string;
    description: string;
  }[];
  certifications?: string[];
  achievements?: string[];
  languages: string;
  themeColor?: string;
};

export const RESUME_THEME_COLORS = [
  { id: "orange", name: "Coral Orange (Template)", hex: "#e24a3b" },
  { id: "blue", name: "Executive Blue", hex: "#2563eb" },
  { id: "grey", name: "Modern Slate Grey", hex: "#4b5563" },
  { id: "purple", name: "Brand Purple", hex: "#6528f7" },
  { id: "emerald", name: "Modern Emerald", hex: "#059669" },
  { id: "navy", name: "Classic Navy", hex: "#1e40af" },
  { id: "ruby", name: "Ruby Crimson", hex: "#dc2626" },
  { id: "amber", name: "Sunset Amber", hex: "#d97706" },
];

export const RESUME_FONTS = [
  {
    id: "arial",
    name: "Arial / Helvetica",
    family: "Arial, Helvetica, sans-serif",
    badge: "Corporate Standard",
    category: "Classic Sans",
    description: "Universally supported across all ATS scanners and office software.",
  },
  {
    id: "inter",
    name: "Inter",
    family: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    badge: "ATS #1 Choice",
    category: "Modern Sans",
    description: "Ultra-clean geometric sans, highest readability for ATS parsers.",
  },
  {
    id: "calibri",
    name: "Calibri",
    family: "'Calibri', 'Candara', 'Segoe', sans-serif",
    badge: "Executive Standard",
    category: "Corporate Sans",
    description: "Microsoft's clean corporate executive standard with soft curves.",
  },
  {
    id: "roboto",
    name: "Roboto",
    family: "'Roboto', sans-serif",
    badge: "Tech & Digital",
    category: "Clean Sans",
    description: "Google's flagship sans-serif, standard for tech and product roles.",
  },
  {
    id: "raleway",
    name: "Raleway",
    family: "'Raleway', sans-serif",
    badge: "Degree Guru Style",
    category: "Brand Sans",
    description: "Degree Guru's signature modern aesthetic font.",
  },
  {
    id: "poppins",
    name: "Poppins",
    family: "'Poppins', sans-serif",
    badge: "Modern & Geometric",
    category: "Geometric Sans",
    description: "Striking geometric sans-serif with friendly curves and high readability.",
  },
  {
    id: "montserrat",
    name: "Montserrat",
    family: "'Montserrat', sans-serif",
    badge: "Editorial Clean",
    category: "Editorial Sans",
    description: "Sleek, modern urban typography inspired by early 20th-century design.",
  },
  {
    id: "georgia",
    name: "Georgia",
    family: "Georgia, 'Times New Roman', serif",
    badge: "Classic Executive",
    category: "Executive Serif",
    description: "Authoritative, elegant serif ideal for leadership & consulting.",
  },
  {
    id: "times",
    name: "Times New Roman",
    family: "'Times New Roman', Times, serif",
    badge: "Traditional Academic",
    category: "Traditional Serif",
    description: "Classic time-tested standard for finance, legal, and academia.",
  },
];

export const DEFAULT_RESUME_DATA: ResumeData = {
  fullName: "Aarav Sharma",
  professionalTitle: "Senior Growth Marketing Strategist",
  location: "New Delhi, India",
  email: "aarav.sharma@example.com",
  phone: "+91 98765 43210",
  linkedin: "linkedin.com/in/aarav-sharma-growth",
  portfolio: "https://aaravsharma.dev",
  professionalSummary:
    "Data-driven Senior Growth Marketing Strategist with over 4 years of experience leading multi-channel acquisition, performance marketing, and organic content pipelines. Skilled in conversion rate optimization (CRO), search engine positioning, and cross-functional team leadership to accelerate revenue growth.",
  experiences: [
    {
      company: "Apex Media Labs",
      role: "Growth Marketing Lead",
      title: "Apex Media Labs | Growth Marketing Lead",
      duration: "2024 - Present",
      bullets: [
        "Spearheaded multi-channel growth campaigns generating over 18M organic impressions and 320% user acquisition increase.",
        "Managed a monthly Meta and Google Ads budget of ₹15L, optimizing CAC down by 34% with an average 4.5x ROAS.",
        "Led an 8-member creative and performance marketing team across SEO, copywriting, design, and paid media.",
        "Established automated GA4 and Mixpanel conversion attribution funnels to quantify real-time customer lifetime value.",
      ],
    },
    {
      company: "Novus Digital Group",
      role: "Performance Marketing Manager",
      title: "Novus Digital Group | Performance Marketing Manager",
      duration: "2022 - 2024",
      bullets: [
        "Scaled inbound lead velocity by 160% through targeted LinkedIn, search engine, and influencer partnerships.",
        "Architected automated email nurture drip campaigns lifting free-to-paid product conversion rates by 28%.",
        "Conducted comprehensive website technical SEO overhauls resulting in top-3 Google rankings for 40+ high-intent keywords.",
      ],
    },
    {
      company: "Crestview Creative Agency",
      role: "Digital Marketing Specialist",
      title: "Crestview Creative Agency | Digital Marketing Specialist",
      duration: "2021 - 2022",
      bullets: [
        "Developed and scheduled high-retention social and video campaigns across YouTube and Instagram.",
        "Coordinated brand design identities and landing page A/B tests to optimize visitor engagement.",
      ],
    },
  ],
  education: [
    {
      degree: "Master of Business Administration (Marketing)",
      score: "8.6 CGPA",
      institution: "Delhi University",
      year: "2023",
    },
    {
      degree: "Bachelor of Business Administration (BBA)",
      score: "82%",
      institution: "IP University",
      year: "2021",
    },
    {
      degree: "Senior Secondary (Class 12)",
      score: "92%",
      institution: "CBSE Board",
      year: "2018",
    },
  ],
  skills: [
    "Brand Management",
    "Marketing Strategy",
    "SEO",
    "SMO",
    "Brand Identity Design",
    "Content Writing",
    "Copywriting",
    "Team Building",
    "Leadership",
    "Cross-Functional Collaboration",
    "Communication & Presentation",
    "AI-Driven Video Editing",
    "Eleven Labs",
    "NotebookLM",
    "Veo 3.1",
    "Gemini",
    "Claude",
  ],
  languages: "English (Conversational) & Hindi (Native)",
  themeColor: "#e24a3b",
};

export interface ResumePaperProps {
  data: ResumeData;
  scale?: number;
  selectedColor?: string;
  selectedFont?: string;
}

/**
 * Helper to render bullet points with selective bold highlights (**keyword**)
 */
function renderBulletContent(text: string) {
  if (!text.includes("**")) return text;
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-bold text-neutral-900">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return part;
  });
}

export const ResumePaper: React.FC<ResumePaperProps> = ({
  data,
  scale = 1,
  selectedColor,
  selectedFont,
}) => {
  const primaryColor = selectedColor || data.themeColor || "#e24a3b";
  const fontFamily = selectedFont || "Arial, Helvetica, sans-serif";

  return (
    <div
      id="printable-resume"
      className="resume-sheet bg-white text-neutral-900 shadow-2xl relative print:shadow-none print:m-0 print:border-none mx-auto"
      style={{
        width: "100%",
        maxWidth: "800px",
        minHeight: "1050px",
        height: "auto",
        padding: "48px",
        fontSize: "11pt",
        lineHeight: "1.32",
        boxSizing: "border-box",
        fontFamily,
        transform: scale !== 1 ? `scale(${scale})` : undefined,
        transformOrigin: "top center",
      }}
    >
      {/* 1. Header: Name (14pt Bold, Centered, Accent Color) */}
      <div className="text-center">
        <h1
          className="font-bold uppercase tracking-wide leading-tight transition-colors"
          style={{
            fontSize: "14pt",
            color: primaryColor,
            margin: 0,
            letterSpacing: "0.04em",
          }}
        >
          {data.fullName || "YASH"}
        </h1>

        {/* Title Below Name (12pt Bold, Centered, Dark) */}
        <div
          className="font-bold text-neutral-900 mt-1 leading-snug"
          style={{ fontSize: "12pt" }}
        >
          {data.professionalTitle || "Data Driven Digital Marketer"}
        </div>
      </div>

      {/* 2. Contact Row (10.5pt, Centered with Pipes and Clean No-Underline Links) */}
      <div
        className="text-center text-neutral-900 mt-2 flex flex-wrap justify-center items-center gap-x-2.5 leading-normal"
        style={{ fontSize: "10.5pt" }}
      >
        {data.location && <span>{data.location}</span>}
        {data.location && data.email && <span className="text-neutral-400">|</span>}

        {data.email && (
          <a
            href={`mailto:${data.email}`}
            className="text-neutral-900 no-underline hover:opacity-80 transition-opacity"
          >
            {data.email}
          </a>
        )}
        {data.email && data.phone && <span className="text-neutral-400">|</span>}

        {data.phone && (
          <a
            href={`tel:${data.phone.replace(/\s+/g, "")}`}
            className="text-neutral-900 no-underline hover:opacity-80 transition-opacity"
          >
            {data.phone}
          </a>
        )}

        {/* Optional LinkedIn: Displays only the word 'LinkedIn', hyperlinked to profile, no underline */}
        {data.linkedin && data.linkedin.trim() && (
          <>
            {(data.location || data.email || data.phone) && (
              <span className="text-neutral-400">|</span>
            )}
            <a
              href={
                data.linkedin.startsWith("http")
                  ? data.linkedin
                  : `https://${data.linkedin.replace(/^https?:\/\//, "")}`
              }
              target="_blank"
              rel="noreferrer"
              className="text-neutral-900 no-underline hover:opacity-80 transition-opacity"
            >
              LinkedIn
            </a>
          </>
        )}
      </div>

      {/* Section Divider 1 (Proper spacing above and below) */}
      <div
        style={{
          borderTop: `1px solid ${primaryColor}`,
          marginTop: "12px",
          marginBottom: "11px",
        }}
      />

      {/* 3. Professional Summary: (12pt Bold Heading in Accent Color) */}
      {data.professionalSummary && (
        <section className="break-inside-avoid">
          <h2
            className="font-bold leading-snug transition-colors"
            style={{
              fontSize: "12pt",
              color: primaryColor,
              margin: "0 0 3px 0",
            }}
          >
            Professional Summary:
          </h2>
          <p
            className="text-neutral-900 m-0 leading-[1.32] text-left"
            style={{ fontSize: "11pt" }}
          >
            {data.professionalSummary}
          </p>
        </section>
      )}

      {/* Section Divider 2 (Proper spacing above and below) */}
      {data.experiences && data.experiences.length > 0 && (
        <div
          style={{
            borderTop: `1px solid ${primaryColor}`,
            marginTop: "12px",
            marginBottom: "11px",
          }}
        />
      )}

      {/* 4. Experience: (12pt Bold Heading in Accent Color) */}
      {data.experiences && data.experiences.length > 0 && (
        <section className="break-inside-avoid">
          <h2
            className="font-bold leading-snug transition-colors"
            style={{
              fontSize: "12pt",
              color: primaryColor,
              margin: "0 0 3.5px 0",
            }}
          >
            Experience:
          </h2>
          <div className="space-y-2">
            {data.experiences.map((exp, idx) => {
              const headerHeading =
                exp.title ||
                (exp.company && exp.role
                  ? `${exp.company} | ${exp.role}`
                  : exp.role || exp.company);

              return (
                <div key={idx} className="break-inside-avoid">
                  {/* Role Row: Company / Role (Bold) & Dates (Italic, Right Aligned) */}
                  <div
                    className="flex justify-between items-baseline text-neutral-900 leading-snug"
                    style={{ fontSize: "11pt" }}
                  >
                    <div className="font-bold">{headerHeading}</div>
                    <div
                      className="italic font-normal text-neutral-900 shrink-0 text-right pl-2"
                      style={{ fontSize: "10.5pt" }}
                    >
                      {exp.duration}
                    </div>
                  </div>

                  {/* Bullets */}
                  <ul
                    className="list-disc list-outside ml-4 mt-0.5 space-y-[1.5px] text-neutral-900 leading-[1.32]"
                    style={{ fontSize: "11pt" }}
                  >
                    {exp.bullets.map((b, bIdx) => (
                      <li key={bIdx}>{renderBulletContent(b)}</li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Section Divider 3 (Proper spacing above and below) */}
      {data.education && data.education.length > 0 && (
        <div
          style={{
            borderTop: `1px solid ${primaryColor}`,
            marginTop: "12px",
            marginBottom: "11px",
          }}
        />
      )}

      {/* 5. Education: (12pt Bold Heading in Accent Color) */}
      {data.education && data.education.length > 0 && (
        <section className="break-inside-avoid">
          <h2
            className="font-bold leading-snug transition-colors"
            style={{
              fontSize: "12pt",
              color: primaryColor,
              margin: "0 0 3px 0",
            }}
          >
            Education:
          </h2>
          <ul
            className="list-disc list-outside ml-4 mt-0.5 space-y-[1.5px] text-neutral-900 leading-[1.32]"
            style={{ fontSize: "11pt" }}
          >
            {data.education.map((edu, idx) => (
              <li key={idx}>
                <span className="font-bold">{edu.degree}</span>
                {edu.score && ` - ${edu.score}`}
                {edu.institution && `, ${edu.institution}`}
                {edu.year && `, ${edu.year}`}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Section Divider 4 (Proper spacing above and below) */}
      {data.skills && data.skills.length > 0 && (
        <div
          style={{
            borderTop: `1px solid ${primaryColor}`,
            marginTop: "12px",
            marginBottom: "11px",
          }}
        />
      )}

      {/* 6. Skills: (12pt Bold Heading in Accent Color) */}
      {data.skills && data.skills.length > 0 && (
        <section className="break-inside-avoid">
          <h2
            className="font-bold leading-snug transition-colors"
            style={{
              fontSize: "12pt",
              color: primaryColor,
              margin: "0 0 3px 0",
            }}
          >
            Skills:
          </h2>
          <div
            className="text-neutral-900 leading-[1.32]"
            style={{ fontSize: "11pt" }}
          >
            {data.skills.join(" | ")}
          </div>
        </section>
      )}

      {/* 7. Footer Row: Language & Portfolio (Language and Portfolio words colored, optional portfolio, natural spacing) */}
      <div
        className="flex justify-between items-baseline text-neutral-900 leading-snug break-inside-avoid mt-3.5"
        style={{ fontSize: "11pt" }}
      >
        <div>
          <span className="font-bold transition-colors" style={{ color: primaryColor }}>
            Language:
          </span>{" "}
          <span className="text-neutral-900">
            {data.languages || "English (Conversational) & Hindi (Native)"}
          </span>
        </div>

        {data.portfolio && data.portfolio.trim() ? (
          <div>
            <span className="font-bold transition-colors" style={{ color: primaryColor }}>
              Portfolio:
            </span>{" "}
            <a
              href={
                data.portfolio.startsWith("http")
                  ? data.portfolio
                  : `https://${data.portfolio}`
              }
              target="_blank"
              rel="noreferrer"
              className="underline text-neutral-900 hover:opacity-80 transition-opacity"
            >
              Links
            </a>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ResumePaper;
