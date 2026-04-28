export const PROGRAMS = [
  { slug: "online-ba", name: "Online BA", full: "Bachelor of Arts", level: "Bachelors", desc: "A flexible humanities degree for curious minds and creative careers." },
  { slug: "online-bba", name: "Online BBA", full: "Bachelor of Business Administration", level: "Bachelors", desc: "Build your management foundations with a recognized online business degree." },
  { slug: "online-bca", name: "Online BCA", full: "Bachelor of Computer Applications", level: "Bachelors", desc: "Step into tech with a future-ready computer applications degree." },
  { slug: "online-bcom", name: "Online BCom", full: "Bachelor of Commerce", level: "Bachelors", desc: "Master accounting, finance and commerce, fully online." },
  { slug: "online-ma", name: "Online MA", full: "Master of Arts", level: "Masters", desc: "Deepen your expertise across literature, sociology, psychology and more." },
  { slug: "online-mba", name: "Online MBA", full: "Master of Business Administration", level: "Masters", desc: "Accelerate your career with a globally respected online MBA." },
  { slug: "online-mca", name: "Online MCA", full: "Master of Computer Applications", level: "Masters", desc: "Advance into senior tech roles with a specialised MCA." },
  { slug: "online-mcom", name: "Online MCom", full: "Master of Commerce", level: "Masters", desc: "Specialise in finance, taxation and advanced commerce." },
  { slug: "online-dba", name: "Online DBA", full: "Doctor of Business Administration", level: "Doctoral", desc: "An applied doctorate for senior leaders and consultants." },
  { slug: "phd", name: "PhD", full: "Doctor of Philosophy", level: "Doctoral", desc: "Pursue research at the highest level across disciplines." },
  { slug: "certifications", name: "Certifications", full: "Certification Courses", level: "Skills", desc: "Short, focused courses to upskill in months, not years." },
] as const;

export type Program = (typeof PROGRAMS)[number];

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
