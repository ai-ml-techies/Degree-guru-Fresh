export type ProgramContent = {
  slug: string;
  name: string;
  full: string;
  level: "Bachelors" | "Masters" | "Doctoral" | "Skills";
  desc: string;
  tagline: string;        // unique hero subtitle (no "Your Future Starts Here")
  about: string;          // unique long description
  enrollFor: string[];    // unique audience
  emiNote: string;        // EMI line specific to program
};

export const PROGRAMS: ProgramContent[] = [
  {
    slug: "online-ba",
    name: "Online BA",
    full: "Bachelor of Arts",
    level: "Bachelors",
    desc: "A flexible humanities degree for curious minds and creative careers.",
    tagline: "Study what you love. Build a career around it.",
    about: "An Online BA opens doors across writing, media, education, civil services and the creative industries. Choose specialisations like English, Psychology, Sociology, Political Science or History from India's leading universities, and study at your own pace, from anywhere.",
    enrollFor: [
      "Class 12 pass students wanting flexibility",
      "Working professionals returning to study",
      "Civil services aspirants building a strong base",
      "Creators and writers wanting a recognised degree",
    ],
    emiNote: "Easy EMI options available, start your BA from as low as ₹3,500 per month.",
  },
  {
    slug: "online-bba",
    name: "Online BBA",
    full: "Bachelor of Business Administration",
    level: "Bachelors",
    desc: "Build your management foundations with a recognized online business degree.",
    tagline: "Become the manager every business is looking for.",
    about: "An Online BBA gives you a strong foundation in management, marketing, finance and operations. It is built for ambitious learners who want to step into business roles, run their own venture, or set the stage for an MBA.",
    enrollFor: [
      "Aspiring entrepreneurs and family business heirs",
      "Working professionals targeting team-lead roles",
      "Students planning to pursue an MBA next",
      "Sales and marketing executives upskilling",
    ],
    emiNote: "Flexible EMI plans starting around ₹4,500 per month, no upfront pressure.",
  },
  {
    slug: "online-bca",
    name: "Online BCA",
    full: "Bachelor of Computer Applications",
    level: "Bachelors",
    desc: "Step into tech with a future-ready computer applications degree.",
    tagline: "Code your way into India's biggest tech opportunity.",
    about: "An Online BCA prepares you for software development, web technologies, data and IT roles. The curriculum mixes programming languages, databases and modern frameworks with project-based learning so you graduate with real, hireable skills.",
    enrollFor: [
      "Aspiring software developers and engineers",
      "Self-taught coders who want a formal degree",
      "Working IT support staff aiming for dev roles",
      "Students planning an MCA or tech masters later",
    ],
    emiNote: "Pay in easy EMIs, many universities offer plans from ₹4,000 per month.",
  },
  {
    slug: "online-bcom",
    name: "Online BCom",
    full: "Bachelor of Commerce",
    level: "Bachelors",
    desc: "Master accounting, finance and commerce, fully online.",
    tagline: "Numbers, business and money, your degree, your way.",
    about: "An Online BCom builds expertise in accounting, taxation, business law and finance. It is the ideal launchpad for careers in banking, audit, financial services and CA / CS preparation, while staying flexible enough for jobs and family.",
    enrollFor: [
      "CA / CS / CMA aspirants who want a parallel degree",
      "Banking and finance executives upskilling",
      "Family business owners formalising knowledge",
      "Class 12 commerce students wanting flexibility",
    ],
    emiNote: "Affordable EMI plans, start your BCom for around ₹3,800 per month.",
  },
  {
    slug: "online-ma",
    name: "Online MA",
    full: "Master of Arts",
    level: "Masters",
    desc: "Deepen your expertise across literature, sociology, psychology and more.",
    tagline: "Specialise. Research. Lead conversations in your field.",
    about: "An Online MA lets you specialise in subjects like English, Psychology, Sociology, Public Policy or Education. Built for postgraduates who want academic depth without pausing their career, with research and dissertation tracks at top universities.",
    enrollFor: [
      "Educators and trainers seeking subject mastery",
      "UGC NET aspirants and research candidates",
      "Counsellors and therapists deepening expertise",
      "Civil services and policy aspirants",
    ],
    emiNote: "Flexible EMIs available, many programs run from ₹4,500 per month.",
  },
  {
    slug: "online-mba",
    name: "Online MBA",
    full: "Master of Business Administration",
    level: "Masters",
    desc: "Accelerate your career with a globally respected online MBA.",
    tagline: "The career accelerator working professionals trust.",
    about: "An Online MBA from a top Indian university is the fastest way to move into senior management, switch careers, or earn a serious salary jump. Specialise in Marketing, Finance, HR, Operations, Analytics or Product Management while continuing to work full-time.",
    enrollFor: [
      "Working professionals targeting promotions",
      "Career switchers moving into management",
      "Engineers and IT folks moving into product / strategy",
      "Founders and entrepreneurs scaling their venture",
    ],
    emiNote: "No-cost EMI options at top universities, from ₹8,000 per month.",
  },
  {
    slug: "online-mca",
    name: "Online MCA",
    full: "Master of Computer Applications",
    level: "Masters",
    desc: "Advance into senior tech roles with a specialised MCA.",
    tagline: "Level up from developer to tech leader.",
    about: "An Online MCA is built for working tech professionals and BCA / BSc IT graduates who want to move into senior engineering, DevOps, cloud or AI roles. Combines deep computer science with current industry tools and projects.",
    enrollFor: [
      "Software developers targeting senior roles",
      "BCA / BSc IT graduates upskilling",
      "Working IT folks moving into AI / cloud",
      "Aspiring tech leads and architects",
    ],
    emiNote: "Easy EMI plans starting around ₹6,500 per month, pay as you learn.",
  },
  {
    slug: "online-mcom",
    name: "Online MCom",
    full: "Master of Commerce",
    level: "Masters",
    desc: "Specialise in finance, taxation and advanced commerce.",
    tagline: "Become the finance expert every company needs.",
    about: "An Online MCom is for graduates who want to specialise in advanced accounting, finance, taxation or international business. Designed to fit around full-time finance, banking and audit jobs.",
    enrollFor: [
      "BCom graduates targeting senior finance roles",
      "CA / CS / CMA students wanting an academic edge",
      "Bank officers and tax professionals upskilling",
      "Aspiring finance educators and researchers",
    ],
    emiNote: "Flexible EMI plans, many universities offer from ₹5,000 per month.",
  },
  {
    slug: "online-dba",
    name: "Online DBA",
    full: "Doctor of Business Administration",
    level: "Doctoral",
    desc: "An applied doctorate for senior leaders and consultants.",
    tagline: "The applied doctorate built for industry leaders.",
    about: "An Online DBA is the practitioner's doctorate, designed for senior managers, consultants and entrepreneurs who want to apply rigorous research to real business problems. Earn a respected doctoral title without leaving your role.",
    enrollFor: [
      "Senior leaders, VPs and CXOs",
      "Independent consultants and coaches",
      "Entrepreneurs scaling complex ventures",
      "Aspiring business school faculty",
    ],
    emiNote: "Spread your investment over easy EMIs, flexible plans across partners.",
  },
  {
    slug: "phd",
    name: "PhD",
    full: "Doctor of Philosophy",
    level: "Doctoral",
    desc: "Pursue research at the highest level across disciplines.",
    tagline: "Become a recognised researcher in your field.",
    about: "A PhD is the highest academic qualification, built for serious researchers, future professors and subject experts. Pursue full-time or part-time tracks across management, sciences, humanities, engineering and social sciences from UGC-recognised universities.",
    enrollFor: [
      "Aspiring professors and university faculty",
      "Working professionals deep in their domain",
      "Researchers in policy, science and humanities",
      "Subject experts seeking the highest credential",
    ],
    emiNote: "Flexible fee plans and EMI options available, talk to us for details.",
  },
  {
    slug: "certifications",
    name: "Certifications",
    full: "Certification Courses",
    level: "Skills",
    desc: "Short, focused courses to upskill in months, not years.",
    tagline: "Learn one skill. Land one job. In months, not years.",
    about: "Short, intense online certifications in high-demand areas, Digital Marketing, Data Analytics, AI & ML, UX Design, Product Management, Finance and more. Built for fast outcomes and immediate career impact.",
    enrollFor: [
      "Working professionals making a fast pivot",
      "Students adding industry-ready skills",
      "Freelancers building proof of expertise",
      "Anyone wanting a quick, focused upgrade",
    ],
    emiNote: "Most certifications support easy EMIs, start from a few thousand a month.",
  },
];

export type Program = typeof PROGRAMS[number];

export const UNIVERSITIES = [
  "Amity University Online",
  "NMIMS",
  "OP Jindal Global University",
  "Lovely Professional University (LPU)",
  "Amrita Vishwa Vidyapeetham",
  "Amrita University",
  "Shoolini Online",
  "Galgotias University",
  "Parul University Online",
  "Chandigarh University",
  "Jain University",
  "UPES",
];
