export interface UniversityCertification {
  id: string;
  name: string;
  fullName: string;
  universitySlug: string;
  duration: string;
  totalFee: number;
  feeFormatted: string;
  emiFormatted?: string;
  mode: string;
  eligibility: string;
  skills: string[];
  partner?: string;
}

export const UNIVERSITY_CERTIFICATIONS_DATA: UniversityCertification[] = [
  // ── UPES Online Certifications (Starting lowest ₹25k / ₹42k) ──
  {
    id: "upes-cert-proj-mgmt",
    name: "Certificate in Project Management",
    fullName: "UPES Executive Certificate in Project Management",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 25000,
    feeFormatted: "₹25,000",
    emiFormatted: "₹1,450/mo",
    mode: "Online Self-Paced",
    eligibility: "Any Graduate or Diploma holder with 1+ years experience",
    skills: ["Agile & Scrum", "Risk Assessment", "Resource Allocation", "MS Project"]
  },
  {
    id: "upes-cert-data-analytics-sp",
    name: "Certificate in Data Analytics (Self-Paced)",
    fullName: "UPES Certificate in Data Analytics (Self-Paced)",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 42000,
    feeFormatted: "₹42,000",
    emiFormatted: "₹2,100/mo",
    mode: "Online Self-Paced",
    eligibility: "10+2 / Graduation with basic mathematics",
    skills: ["PowerBI", "Advanced Excel", "SQL", "Tableau", "Data Storytelling"]
  },
  {
    id: "upes-cert-data-science-sp",
    name: "Certificate in Data Science (Self-Paced)",
    fullName: "UPES Certificate in Data Science (Self-Paced)",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 50000,
    feeFormatted: "₹50,000",
    emiFormatted: "₹2,500/mo",
    mode: "Online Self-Paced",
    eligibility: "Graduates / Diploma holders with quantitative aptitude",
    skills: ["Python", "Machine Learning", "Statistical Modeling", "Pandas & NumPy"]
  },
  {
    id: "upes-cert-data-analytics-hybrid",
    name: "Certificate in Data Analytics (Hybrid)",
    fullName: "UPES Advanced Hybrid Certificate in Data Analytics",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 60000,
    feeFormatted: "₹60,000",
    emiFormatted: "₹3,000/mo",
    mode: "Online Live & Hybrid Labs",
    eligibility: "Graduation with mathematics / computer science",
    skills: ["Live Industry Mentorship", "BigQuery", "Predictive Analytics"]
  },
  {
    id: "upes-cert-ai-ml-sp",
    name: "Certificate in AI & Machine Learning (Self-Paced)",
    fullName: "UPES Certificate in Artificial Intelligence & ML",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 62000,
    feeFormatted: "₹62,000",
    emiFormatted: "₹3,100/mo",
    mode: "Online Self-Paced",
    eligibility: "Graduation with coding background or STEM degree",
    skills: ["TensorFlow", "Deep Learning", "Neural Networks", "NLP"]
  },
  {
    id: "upes-cert-marketing",
    name: "Certificate in Marketing Management",
    fullName: "UPES Executive Certificate in Marketing Management",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 75000,
    feeFormatted: "₹75,000",
    emiFormatted: "₹3,750/mo",
    mode: "Online Remote",
    eligibility: "Any Graduate or Diploma holder",
    skills: ["Brand Strategy", "Digital Channels", "Consumer Behavior", "SEO & SEM"]
  },
  {
    id: "upes-cert-finance",
    name: "Certificate in Financial Management",
    fullName: "UPES Executive Certificate in Financial Management",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 75000,
    feeFormatted: "₹75,000",
    emiFormatted: "₹3,750/mo",
    mode: "Online Remote",
    eligibility: "Any Graduate with analytical aptitude",
    skills: ["Corporate Finance", "Valuation", "Financial Modeling", "Portfolio Management"]
  },
  {
    id: "upes-cert-operations",
    name: "Certificate in Operations Management",
    fullName: "UPES Executive Certificate in Operations Management",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 75000,
    feeFormatted: "₹75,000",
    emiFormatted: "₹3,750/mo",
    mode: "Online Remote",
    eligibility: "Any Graduate",
    skills: ["Supply Chain", "Six Sigma", "Inventory Control", "Process Optimization"]
  },
  {
    id: "upes-cert-safety",
    name: "Certificate in Industrial Safety",
    fullName: "UPES Professional Certificate in Industrial Safety & Risk",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 75000,
    feeFormatted: "₹75,000",
    emiFormatted: "₹3,750/mo",
    mode: "Online Remote",
    eligibility: "Diploma/Degree in Engineering or Sciences",
    skills: ["OSHA Protocols", "Hazard Identification", "Plant Audit", "Disaster Mgmt"]
  },
  {
    id: "upes-cert-lscm",
    name: "Certificate in Logistics & Supply Chain Management",
    fullName: "UPES Certificate in Logistics & Supply Chain Management",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 85000,
    feeFormatted: "₹85,000",
    emiFormatted: "₹4,250/mo",
    mode: "Online Remote",
    eligibility: "Any Graduate",
    skills: ["Global Freight", "ERP Systems", "Warehouse Operations", "Logistics Tech"]
  },
  {
    id: "upes-cert-renewables",
    name: "Certificate in Renewable Energy",
    fullName: "UPES Certificate in Renewable Energy Systems & Green Tech",
    universitySlug: "upes-online",
    duration: "6 Months",
    totalFee: 95000,
    feeFormatted: "₹95,000",
    emiFormatted: "₹4,750/mo",
    mode: "Online Remote",
    eligibility: "Graduation in Science / Engineering",
    skills: ["Solar & Wind Grids", "Carbon Trading", "Energy Audit", "ESG Compliance"]
  },

  // ── Kurukshetra University Online (KUK) Certifications & Diplomas ──
  {
    id: "kuk-cert-german",
    name: "Certificate in German Language",
    fullName: "KUK Certificate in German Language (CDOE)",
    universitySlug: "kurukshetra-university-online",
    duration: "6 Months",
    totalFee: 21899,
    feeFormatted: "₹21,899",
    emiFormatted: "₹1,200/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 from a recognized board",
    skills: ["German A1-A2 Level", "Grammar & Conversation", "Cross-Cultural Translation"]
  },
  {
    id: "kuk-cert-french",
    name: "Certificate in French Language",
    fullName: "KUK Certificate in French Language (CDOE)",
    universitySlug: "kurukshetra-university-online",
    duration: "6 Months",
    totalFee: 21899,
    feeFormatted: "₹21,899",
    emiFormatted: "₹1,200/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 from a recognized board",
    skills: ["French A1-A2 Level", "Pronunciation", "Professional Business French"]
  },
  {
    id: "kuk-cert-japanese",
    name: "Certificate in Japanese Language",
    fullName: "KUK Certificate in Japanese Language (CDOE)",
    universitySlug: "kurukshetra-university-online",
    duration: "6 Months",
    totalFee: 21899,
    feeFormatted: "₹21,899",
    emiFormatted: "₹1,200/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 from a recognized board",
    skills: ["Hiragana & Katakana", "JLPT N5 Fundamentals", "Conversational Japanese"]
  },
  {
    id: "kuk-diploma-gita",
    name: "Diploma in Bhagavad Gita",
    fullName: "KUK Diploma in Bhagavad Gita & Life Philosophy",
    universitySlug: "kurukshetra-university-online",
    duration: "1 Year",
    totalFee: 21899,
    feeFormatted: "₹21,899",
    emiFormatted: "₹1,200/mo",
    mode: "Online Remote",
    eligibility: "10+2 from any recognized board",
    skills: ["Sanskrit Hermeneutics", "Ethical Leadership", "Philosophical Synthesis"]
  },
  {
    id: "kuk-cert-iot",
    name: "Certificate in Internet of Things (IoT)",
    fullName: "KUK Certificate in Internet of Things (IoT Systems)",
    universitySlug: "kurukshetra-university-online",
    duration: "6 Months",
    totalFee: 27374,
    feeFormatted: "₹27,374",
    emiFormatted: "₹1,500/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 with Science / Computer background",
    skills: ["Sensors & Actuators", "Arduino / Raspberry Pi", "IoT Cloud Protocols"]
  },
  {
    id: "kuk-cert-fullstack",
    name: "Certificate in Full Stack Development",
    fullName: "KUK Certificate in Modern Full Stack Web Development",
    universitySlug: "kurukshetra-university-online",
    duration: "6 Months",
    totalFee: 27374,
    feeFormatted: "₹27,374",
    emiFormatted: "₹1,500/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 with basic programming familiarity",
    skills: ["HTML5/CSS3", "JavaScript & React", "Node.js & Express", "MongoDB"]
  },
  {
    id: "kuk-cert-cloud",
    name: "Certificate in Cloud Computing",
    fullName: "KUK Certificate in Cloud Computing & DevOps",
    universitySlug: "kurukshetra-university-online",
    duration: "6 Months",
    totalFee: 27374,
    feeFormatted: "₹27,374",
    emiFormatted: "₹1,500/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 with STEM / IT background",
    skills: ["AWS & Azure Core", "Virtualization", "Cloud Security", "Containers"]
  },
  {
    id: "kuk-diploma-aiml",
    name: "Diploma in AI & Machine Learning",
    fullName: "KUK Post-Graduate / Undergraduate Diploma in AI & ML",
    universitySlug: "kurukshetra-university-online",
    duration: "1 Year",
    totalFee: 32848,
    feeFormatted: "₹32,848",
    emiFormatted: "₹1,750/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 or Graduation with Mathematics",
    skills: ["Supervised ML", "Deep Learning", "Python Data Stack", "Scikit-Learn"]
  },
  {
    id: "kuk-diploma-cyber",
    name: "Diploma in Cyber Security",
    fullName: "KUK Diploma in Cyber Security & Network Defense",
    universitySlug: "kurukshetra-university-online",
    duration: "1 Year",
    totalFee: 32848,
    feeFormatted: "₹32,848",
    emiFormatted: "₹1,750/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 with Computer Science or relevant IT degree",
    skills: ["Ethical Hacking", "Cryptography", "Network Packet Analysis", "Firewalls"]
  },

  // ── DPU Pune (Dr. D.Y. Patil Vidyapeeth) Certifications ──
  {
    id: "dpu-cert-digital-marketing",
    name: "Certificate in Digital Marketing",
    fullName: "DPU Certificate Programme in Digital Marketing",
    universitySlug: "dr-dy-patil-vidyapeeth-pune-online",
    duration: "6 Months",
    totalFee: 28000,
    feeFormatted: "₹28,000",
    emiFormatted: "₹1,550/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 from a recognized board or Graduation",
    skills: ["Performance Marketing", "Meta & Google Ads", "Conversion Rate Optimization", "Email Marketing"]
  },
  {
    id: "dpu-cert-hahm",
    name: "Certificate in Hospital & Healthcare Management (HAHM)",
    fullName: "DPU Certificate in Hospital & Healthcare Management",
    universitySlug: "dr-dy-patil-vidyapeeth-pune-online",
    duration: "6 Months",
    totalFee: 28000,
    feeFormatted: "₹28,000",
    emiFormatted: "₹1,550/mo",
    mode: "Online Remote Proctored",
    eligibility: "Graduates / Healthcare staff / Paramedical professionals",
    skills: ["Hospital Administration", "NABH Quality Norms", "Healthcare Informatics", "Patient Care Workflow"]
  },

  // ── Lovely Professional University (LPU Online) Diplomas ──
  {
    id: "lpu-diploma-dba",
    name: "Diploma in Business Administration (DBA)",
    fullName: "LPU Online Diploma in Business Administration (DBA)",
    universitySlug: "lovely-professional-university-online",
    duration: "1 Year (2 Semesters)",
    totalFee: 37120,
    feeFormatted: "₹37,120",
    emiFormatted: "₹1,950/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 in any stream or equivalent",
    skills: ["Principles of Management", "Financial Accounting", "Marketing Fundamentals", "Business Law"]
  },
  {
    id: "lpu-diploma-dca",
    name: "Diploma in Computer Applications (DCA)",
    fullName: "LPU Online Diploma in Computer Applications (DCA)",
    universitySlug: "lovely-professional-university-online",
    duration: "1 Year (2 Semesters)",
    totalFee: 37120,
    feeFormatted: "₹37,120",
    emiFormatted: "₹1,950/mo",
    mode: "Online Remote Proctored",
    eligibility: "10+2 in any stream with basic computer familiarity",
    skills: ["C/C++ Programming", "Database Management", "Web Design Basics", "Office Automation"]
  },

  // ── Amity University Online Certification ──
  {
    id: "amity-cert-bfp",
    name: "Certificate in Business Fundamentals Program (BFP)",
    fullName: "Amity Certificate in Business Fundamentals Program (BFP)",
    universitySlug: "amity-university-online",
    duration: "6 Months",
    totalFee: 49000,
    feeFormatted: "₹49,000",
    emiFormatted: "₹2,450/mo",
    mode: "Online Remote",
    eligibility: "10+2 or Graduation in any discipline",
    skills: ["Business Economics", "Managerial Communication", "Spreadsheet Modeling", "Marketing Strategy"]
  }
];

export const getCertificationsForUniversity = (slugOrId: string): UniversityCertification[] => {
  const norm = slugOrId.toLowerCase();
  return UNIVERSITY_CERTIFICATIONS_DATA.filter((c) => {
    return c.universitySlug === norm ||
      norm.includes(c.universitySlug) ||
      c.universitySlug.includes(norm) ||
      (norm.includes("upes") && c.universitySlug.includes("upes")) ||
      (norm.includes("kuk") && c.universitySlug.includes("kurukshetra")) ||
      (norm.includes("kurukshetra") && c.universitySlug.includes("kurukshetra")) ||
      (norm.includes("dpu") && c.universitySlug.includes("patil")) ||
      (norm.includes("lpu") && c.universitySlug.includes("lovely")) ||
      (norm.includes("amity") && c.universitySlug.includes("amity"));
  });
};
