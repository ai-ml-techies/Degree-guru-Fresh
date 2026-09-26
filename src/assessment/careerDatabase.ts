import { CareerMatch, RiasecArea, StrengthKey, CareerValue } from "./types";

export interface DatabaseCareer {
  id: string;
  title: string;
  cluster: string;
  description: string;
  typicalWork: string;
  riasecPrimary: RiasecArea[];
  strengthsRequired: StrengthKey[];
  dominantValues: CareerValue[];
  keySkills: string[];
  helpfulDegrees: string[];
  helpfulCertifications: string[];
  entryRoles: string[];
  growthPath: string[];
  workStyleFit: string;
  degreeSlug?: string;
}

export const CAREER_DATABASE: DatabaseCareer[] = [
  // ── 1. Product & Management ──
  {
    id: "product_management",
    title: "Product Management",
    cluster: "Product & Technology",
    description: "Define product vision, align cross-functional tech, design, and business teams, and build solutions users love.",
    typicalWork: "Prioritising roadmaps, interviewing users, reviewing product analytics, defining user stories, and working with engineering sprints.",
    riasecPrimary: ["EXPLORE_SOLVE", "LEAD_INFLUENCE"],
    strengthsRequired: ["problem_solving", "communication", "analytical_thinking", "initiative", "decision_making"],
    dominantValues: ["Growth", "Impact", "Leadership", "Freedom"],
    keySkills: ["Product Discovery", "User Journey Mapping", "SQL & Metrics", "A/B Testing", "Agile Execution"],
    helpfulDegrees: ["Online MBA", "Online MCA", "Online BCA"],
    helpfulCertifications: ["Product School", "Scrum Product Owner", "Pragmatic Institute"],
    entryRoles: ["Associate Product Manager (APM)", "Product Analyst", "Business Analyst"],
    growthPath: ["APM → Product Manager → Senior PM → Group PM → Head of Product / VP"],
    workStyleFit: "High interaction with engineering and design, strategic autonomy, fast-paced execution.",
    degreeSlug: "online-mba"
  },
  {
    id: "marketing_management",
    title: "Brand & Marketing Management",
    cluster: "Business & Marketing",
    description: "Drive customer acquisition, build powerful brand narratives, and lead high-ROI multichannel growth campaigns.",
    typicalWork: "Planning marketing campaigns, tracking CAC and LTV, crafting brand positioning, managing digital ad spends, and leading creative teams.",
    riasecPrimary: ["CREATE_EXPRESS", "LEAD_INFLUENCE"],
    strengthsRequired: ["creativity", "communication", "analytical_thinking", "initiative"],
    dominantValues: ["Growth", "Creativity", "Income", "Impact"],
    keySkills: ["Growth Marketing", "Content Strategy", "Performance Ads", "Marketing Analytics", "Brand Storytelling"],
    helpfulDegrees: ["Online MBA", "Online BBA"],
    helpfulCertifications: ["HubSpot Inbound", "Google Ads & Analytics", "Meta Blueprint"],
    entryRoles: ["Marketing Associate", "Digital Marketing Executive", "Growth Analyst"],
    growthPath: ["Marketing Specialist → Brand Manager → Marketing Director → CMO"],
    workStyleFit: "Dynamic, creative experimentation balanced with commercial accountability and analytics.",
    degreeSlug: "online-mba"
  },
  {
    id: "business_analytics",
    title: "Business & Data Analytics",
    cluster: "Data & Technology",
    description: "Translate complex business numbers into clear strategic decisions, predictive forecasts, and revenue opportunities.",
    typicalWork: "Writing SQL queries, building executive dashboards (Power BI / Tableau), modeling conversion metrics, and presenting data insights.",
    riasecPrimary: ["EXPLORE_SOLVE", "ORGANISE_STRUCTURE"],
    strengthsRequired: ["analytical_thinking", "attention_to_detail", "problem_solving", "learning_agility"],
    dominantValues: ["Learning", "Income", "Growth", "Stability"],
    keySkills: ["Advanced SQL", "Power BI / Tableau", "Python for Analytics", "Statistical Modeling", "Business Storytelling"],
    helpfulDegrees: ["Online MBA", "Online MCA", "Online BCA"],
    helpfulCertifications: ["Google Data Analytics", "Microsoft Power BI Associate", "AWS Data Analytics"],
    entryRoles: ["Junior Business Analyst", "Data Analyst Intern", "MIS Executive"],
    growthPath: ["Data Analyst → Senior Business Analyst → Analytics Manager → Head of BI / CDO"],
    workStyleFit: "Deep analytical focus with structured problem solving and regular stakeholder interaction.",
    degreeSlug: "online-mba"
  },
  {
    id: "software_engineering",
    title: "Full-Stack Software Engineering",
    cluster: "Software & Technology",
    description: "Architect and build modern web applications, distributed backend services, and scalable cloud systems.",
    typicalWork: "Writing clean TypeScript/Node/Python code, designing APIs, reviewing PRs, managing databases, and automating deployments.",
    riasecPrimary: ["BUILD_DO", "EXPLORE_SOLVE"],
    strengthsRequired: ["problem_solving", "analytical_thinking", "learning_agility", "attention_to_detail"],
    dominantValues: ["Learning", "Income", "Freedom", "Stability"],
    keySkills: ["TypeScript / JavaScript", "React & Next.js", "Node.js / Python", "PostgreSQL / MongoDB", "Docker & Cloud"],
    helpfulDegrees: ["Online MCA", "Online BCA", "Online M.Sc"],
    helpfulCertifications: ["AWS Certified Developer", "Meta Frontend / Backend Certificate"],
    entryRoles: ["Junior Software Engineer", "Frontend Developer", "Backend Developer"],
    growthPath: ["Junior Dev → SDE 2 → Senior Engineer → Tech Lead → Principal / VP Engineering"],
    workStyleFit: "Deep uninterrupted technical work combined with collaborative sprint planning.",
    degreeSlug: "online-mca"
  },
  {
    id: "human_resources_management",
    title: "People & Talent Management (HR)",
    cluster: "Human Resources & Talent",
    description: "Shape organizational culture, hire top talent, drive performance frameworks, and support employee growth.",
    typicalWork: "Managing talent acquisition, designing appraisal cycles, employee engagement initiatives, workplace policy, and leadership development.",
    riasecPrimary: ["HELP_CONNECT", "ORGANISE_STRUCTURE"],
    strengthsRequired: ["communication", "relationship_building", "organisation", "leadership"],
    dominantValues: ["Impact", "Stability", "Work-life balance", "Recognition"],
    keySkills: ["Talent Acquisition", "HR Analytics", "Performance Appraisal Systems", "Labor Law Compliance", "Conflict Resolution"],
    helpfulDegrees: ["Online MBA", "Online BBA"],
    helpfulCertifications: ["SHRM-CP", "HRCI-PHR", "LinkedIn Certified Recruiter"],
    entryRoles: ["HR Executive", "Talent Acquisition Associate", "HR Operations Coordinator"],
    growthPath: ["HR Associate → HR Generalist → HR Business Partner (HRBP) → Head of People / CHRO"],
    workStyleFit: "High interpersonal communication, empathetic people leadership, and organizational structure.",
    degreeSlug: "online-mba"
  },
  {
    id: "financial_management",
    title: "Corporate Finance & Investment Analysis",
    cluster: "Finance & Banking",
    description: "Evaluate capital investments, forecast corporate financial performance, manage cashflows, and structure financial growth.",
    typicalWork: "Building DCF valuation models, evaluating capital budgeting, preparing investor decks, managing treasury, and financial auditing.",
    riasecPrimary: ["ORGANISE_STRUCTURE", "EXPLORE_SOLVE"],
    strengthsRequired: ["analytical_thinking", "attention_to_detail", "decision_making", "problem_solving"],
    dominantValues: ["Income", "Prestige", "Stability", "Growth"],
    keySkills: ["Financial Modeling", "Corporate Valuation", "Capital Budgeting", "Excel & Financial Reporting", "Risk Analysis"],
    helpfulDegrees: ["Online MBA", "Online M.Com", "Online B.Com"],
    helpfulCertifications: ["CFA Level 1", "FMVA (Corporate Finance Institute)", "NISM Certifications"],
    entryRoles: ["Financial Analyst", "Credit Analyst", "Accounts & Treasury Executive"],
    growthPath: ["Financial Analyst → Senior Analyst → Finance Manager → VP Finance / CFO"],
    workStyleFit: "Methodical, detail-intensive analytical work with high commercial rigor and measurable impact.",
    degreeSlug: "online-mba"
  },
  {
    id: "operations_supply_chain",
    title: "Operations & Supply Chain Management",
    cluster: "Operations & Logistics",
    description: "Streamline procurement, optimize nationwide distribution networks, eliminate bottlenecks, and ensure seamless delivery.",
    typicalWork: "Forecasting demand, negotiating supplier contracts, auditing warehouse SOPs, optimizing freight routes, and Lean Six Sigma audits.",
    riasecPrimary: ["BUILD_DO", "ORGANISE_STRUCTURE"],
    strengthsRequired: ["execution", "organisation", "problem_solving", "decision_making"],
    dominantValues: ["Stability", "Growth", "Income", "Efficiency"],
    keySkills: ["Supply Chain Analytics", "Inventory Management", "Vendor Negotiations", "Process Optimization", "ERP (SAP/Oracle)"],
    helpfulDegrees: ["Online MBA", "Online BBA"],
    helpfulCertifications: ["Six Sigma Green Belt", "APICS CSCP", "Supply Chain Operations Certificate"],
    entryRoles: ["Operations Associate", "Procurement Coordinator", "Logistics Executive"],
    growthPath: ["Operations Executive → Operations Lead → Supply Chain Manager → COO"],
    workStyleFit: "Practical on-the-ground execution, systematic tracking, and rapid real-time troubleshooting.",
    degreeSlug: "online-mba"
  },
  {
    id: "management_consulting",
    title: "Strategy & Management Consulting",
    cluster: "Strategy & Advisory",
    description: "Help corporate leaders and enterprises solve their toughest growth, turnaround, digital transformation, and organizational puzzles.",
    typicalWork: "Structuring ambiguous business problems, building market entry models, interviewing industry executives, and presenting board decks.",
    riasecPrimary: ["EXPLORE_SOLVE", "LEAD_INFLUENCE"],
    strengthsRequired: ["analytical_thinking", "problem_solving", "communication", "leadership"],
    dominantValues: ["Growth", "Prestige", "Income", "Learning"],
    keySkills: ["Structured Problem Solving", "Hypothesis-Driven Analysis", "Executive Communication", "Financial Evaluation", "Market Sizing"],
    helpfulDegrees: ["Online MBA", "Online MCA"],
    helpfulCertifications: ["Case Interview Preparation", "Management Consulting Institute"],
    entryRoles: ["Associate Consultant", "Business Analyst (Advisory)", "Research Associate"],
    growthPath: ["Analyst → Consultant → Senior Consultant → Engagement Manager → Partner"],
    workStyleFit: "Intellectually rigorous, diverse fast-paced client projects, and high executive interaction.",
    degreeSlug: "online-mba"
  },
  {
    id: "ui_ux_design",
    title: "UI / UX Product Design",
    cluster: "Design & Creative",
    description: "Craft intuitive, beautiful user interfaces and seamless digital experiences backed by psychology and user testing.",
    typicalWork: "Conducting user research, wireframing in Figma, designing design systems, prototyping micro-interactions, and usability testing.",
    riasecPrimary: ["CREATE_EXPRESS", "EXPLORE_SOLVE"],
    strengthsRequired: ["creativity", "attention_to_detail", "problem_solving", "communication"],
    dominantValues: ["Creativity", "Freedom", "Learning", "Impact"],
    keySkills: ["Figma & Design Systems", "User Research & Usability Testing", "Wireframing & Prototyping", "Interaction Design", "Visual Typography"],
    helpfulDegrees: ["Online BCA", "Online BA"],
    helpfulCertifications: ["Google UX Design Certificate", "Interaction Design Foundation (IxDF)"],
    entryRoles: ["Junior UI/UX Designer", "Product Design Intern", "Visual Designer"],
    growthPath: ["UI Designer → Product Designer → Senior UX Designer → Design Lead → Head of Design"],
    workStyleFit: "Creative exploration, aesthetic freedom, empathetic user understanding, and iterative prototyping.",
    degreeSlug: "online-bca"
  },
  {
    id: "ai_machine_learning",
    title: "AI & Machine Learning Engineering",
    cluster: "Data & Technology",
    description: "Build intelligent systems, train large language and predictive models, and deploy scalable AI into consumer products.",
    typicalWork: "Training neural networks, curating and cleaning training datasets, deploying LLMs with RAG pipelines, and optimizing inference speeds.",
    riasecPrimary: ["EXPLORE_SOLVE", "BUILD_DO"],
    strengthsRequired: ["analytical_thinking", "learning_agility", "problem_solving", "attention_to_detail"],
    dominantValues: ["Learning", "Income", "Growth", "Freedom"],
    keySkills: ["Python & PyTorch", "LLM APIs & Prompt Systems", "Vector Databases & RAG", "Data Preprocessing", "MLOps & Docker"],
    helpfulDegrees: ["Online MCA", "Online BCA", "Online M.Sc"],
    helpfulCertifications: ["DeepLearning.AI Machine Learning Specialization", "AWS Machine Learning Specialty"],
    entryRoles: ["Junior ML Engineer", "Data Science Associate", "AI Developer"],
    growthPath: ["AI Engineer → Senior ML Engineer → Staff AI Scientist → Head of AI"],
    workStyleFit: "Deep mathematical and programmatic work on cutting-edge technological problems.",
    degreeSlug: "online-mca"
  },
  {
    id: "healthcare_administration",
    title: "Healthcare Administration & Management",
    cluster: "Healthcare & Public Health",
    description: "Lead hospital operations, healthcare quality standards, patient service delivery, and digital health initiatives.",
    typicalWork: "Managing hospital department budgets, ensuring NABH accreditation compliance, supervising staff workflows, and patient care systems.",
    riasecPrimary: ["HELP_CONNECT", "ORGANISE_STRUCTURE"],
    strengthsRequired: ["organisation", "communication", "decision_making", "relationship_building"],
    dominantValues: ["Impact", "Stability", "Prestige", "Growth"],
    keySkills: ["Hospital Operations", "Healthcare Quality (NABH)", "Patient Relationship Systems", "Medical Billing & Insurance", "Health Informatics"],
    helpfulDegrees: ["Online MBA", "Online BBA"],
    helpfulCertifications: ["Hospital Management Certificate", "Six Sigma Healthcare"],
    entryRoles: ["Hospital Administrative Executive", "Patient Care Coordinator", "Quality Associate"],
    growthPath: ["Admin Executive → Assistant Medical Superintendent → Operations Director → COO / CEO"],
    workStyleFit: "High-impact service environment combining people empathy with rigorous operational standards.",
    degreeSlug: "online-mba"
  },
  {
    id: "content_media_strategy",
    title: "Content Strategy & Media Production",
    cluster: "Media & Communication",
    description: "Build loyal audiences, direct multi-platform content ecosystems, and produce compelling narratives that resonate.",
    typicalWork: "Developing editorial calendars, writing high-impact scripts, optimizing video and audio for engagement, and managing creative freelancers.",
    riasecPrimary: ["CREATE_EXPRESS", "HELP_CONNECT"],
    strengthsRequired: ["creativity", "communication", "initiative", "attention_to_detail"],
    dominantValues: ["Creativity", "Freedom", "Recognition", "Impact"],
    keySkills: ["Content Direction", "Scriptwriting & Storytelling", "Audience Analytics", "SEO & Distribution Strategy", "Podcast / Video Production"],
    helpfulDegrees: ["Online MA", "Online BA"],
    helpfulCertifications: ["HubSpot Content Marketing", "YouTube Certified"],
    entryRoles: ["Content Creator", "Copywriter", "Social Media Strategist"],
    growthPath: ["Content Writer → Content Strategist → Editorial Lead → VP of Content"],
    workStyleFit: "Creative independence, narrative craft, audience empathy, and flexible pacing.",
    degreeSlug: "online-ma"
  }
];
