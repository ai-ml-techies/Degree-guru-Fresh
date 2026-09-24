export interface CourseCurriculumSemester {
  semester: string;
  subjects: string[];
}

export interface CourseFAQ {
  question: string;
  answer: string;
}

export interface CourseJobRole {
  role: string;
  salaryRange: string;
  topIndustries: string;
}

export interface Course {
  slug: string;
  title: string;          // E.g. "Online MBA" (ALWAYS "Online" prefixed)
  fullName: string;       // E.g. "Online Master of Business Administration"
  level: "Bachelors" | "Masters" | "Doctorate" | "Schooling";
  duration: string;
  eligibility: string;
  feeRange: string;
  emiStarting: string;
  shortDesc: string;
  overview: string;
  whoShouldChoose: string[];
  specializations: string[];
  curriculum: CourseCurriculumSemester[];
  learningFormat: string[];
  examMode: string;
  careerOpportunities: string;
  jobRoles: CourseJobRole[];
  skillsGained: string[];
  careerProgression: string;
  roiAnalysis: {
    avgInvestment: string;
    avgSalaryJump: string;
    paybackPeriod: string;
    roiVerdict: string;
  };
  admissionProcess: string[];
  faqs: CourseFAQ[];
  relatedCourseSlugs: string[];
  topUniversitySlugs: string[];
  primaryKeywordCluster: string[];
}

export const COURSES: Course[] = [
  // ── 1. Online MBA ────────────────────────────────────────────────
  {
    slug: "online-mba",
    title: "Online MBA",
    fullName: "Online Master of Business Administration",
    level: "Masters",
    duration: "2 Years (4 Semesters)",
    eligibility: "Bachelor's degree in any discipline from a recognized university with minimum 50% marks (45% for reserved categories). Work experience preferred but not mandatory.",
    feeRange: "₹65,000 – ₹2,10,000 (Total Course Fee)",
    emiStarting: "₹3,950/month (No-Cost EMI available)",
    shortDesc: "Fast-track your management career with India's most flexible, UGC-entitled Online MBA. Study around your job with live weekend masterclasses and zero commute.",
    overview: "An Online MBA is a comprehensive two-year postgraduate degree in business management delivered entirely through state-of-the-art digital learning management systems. Designed specifically for ambitious working professionals, fresh graduates, and entrepreneurs, it offers identical academic credibility, syllabus rigor, and corporate recognition as a traditional on-campus MBA, backed by UGC-DEB and AICTE entitling regulations.",
    whoShouldChoose: [
      "Working professionals targeting team-lead, managerial, or executive leadership promotions without quitting their current job",
      "Career switchers moving from technical, sales, or operations roles into strategic management, consulting, and finance",
      "Fresh graduates seeking high-value corporate placement opportunities at top MNCs and emerging startups",
      "Entrepreneurs, startup founders, and family business heirs wanting structured expertise in capital management, scale, and digital marketing",
    ],
    specializations: [
      "Marketing Management",
      "Financial Management",
      "Human Resource Management",
      "Business Analytics & Data Science",
      "Operations & Supply Chain Management",
      "Information Technology (IT) Management",
      "International Business",
      "Healthcare & Hospital Administration",
      "Digital Marketing & E-Commerce",
      "Banking, Financial Services & Insurance (BFSI)",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: ["Management Concepts & Organizational Behavior", "Managerial Economics", "Accounting for Managers", "Business Communication & Ethics", "Quantitative Techniques in Management"],
      },
      {
        semester: "Semester 2",
        subjects: ["Marketing Management", "Financial Management", "Human Resource Management", "Operations & Supply Chain Management", "Business Research Methodology"],
      },
      {
        semester: "Semester 3",
        subjects: ["Strategic Management & Business Policy", "Enterprise Systems & ERP", "Specialization Core Elective 1", "Specialization Core Elective 2", "Summer Internship Project / Case Analysis"],
      },
      {
        semester: "Semester 4",
        subjects: ["Business Analytics & AI for Decision Making", "Corporate Governance & Sustainability", "Advanced Specialization Elective 3", "Advanced Specialization Elective 4", "Master Dissertation / Capstone Project"],
      },
    ],
    learningFormat: [
      "Interactive live weekend lectures by senior industry leaders and university faculty",
      "24/7 on-demand access to recorded video lectures, Harvard/Ivey case study collections, and digital e-libraries",
      "Self-paced quizzes, weekly discussion forums, and simulated business strategy games",
      "Mobile learning app allowing you to study seamlessly during daily commute or leisure hours",
    ],
    examMode: "100% Online Remote-Proctored Examinations with AI monitoring and flexible weekend slot booking from home.",
    careerOpportunities: "Graduates of an Online MBA command leadership positions across IT, consulting, BFSI, FMCG, retail, and manufacturing sectors. With top online universities offering direct campus virtual placement drives, resume enhancement, and mock interviews, learners experience an average salary increment of 45% to 70% upon degree completion.",
    jobRoles: [
      { role: "Business Development Manager", salaryRange: "₹7.5 – ₹14 LPA", topIndustries: "Tech, SaaS, EdTech" },
      { role: "Financial Analyst / Portfolio Manager", salaryRange: "₹8 – ₹16 LPA", topIndustries: "Investment Banking, Fintech, Consulting" },
      { role: "Product Manager", salaryRange: "₹12 – ₹24 LPA", topIndustries: "Tech Startups, Consumer Apps, E-commerce" },
      { role: "Operations / Supply Chain Lead", salaryRange: "₹7 – ₹13 LPA", topIndustries: "Logistics, FMCG, Manufacturing" },
      { role: "HR Business Partner (HRBP)", salaryRange: "₹6.5 – ₹12 LPA", topIndustries: "Global MNCs, IT Services, Healthcare" },
    ],
    skillsGained: ["Strategic Thinking & Business Formulation", "Financial Modeling & Budgeting", "Data-Driven Decision Making", "Cross-Functional Team Leadership", "Negotiation & Stakeholder Management", "Digital Transformation Strategies"],
    careerProgression: "Associate / Senior Executive → Assistant Manager (Year 1 post-MBA) → Manager / Lead (Year 2–3) → Senior Manager / Director (Year 4–6) → VP / Business Head (Year 7+).",
    roiAnalysis: {
      avgInvestment: "₹1,20,000 (Average 2-year total tuition)",
      avgSalaryJump: "₹3,50,000 – ₹5,50,000 increase over pre-MBA earnings",
      paybackPeriod: "4 to 6 months post-graduation",
      roiVerdict: "Extremely High ROI. Because you continue earning your full monthly salary throughout the 2-year study period, the opportunity cost is zero compared to a regular campus MBA.",
    },
    admissionProcess: [
      "Step 1: Free Counseling & University Selection on Degree Guru",
      "Step 2: Submit Academic Transcripts (10th, 12th, Graduation Degree)",
      "Step 3: Document Verification & Direct University Admission Approval",
      "Step 4: Pay Semester Fee or activate 0% interest EMI plan to unlock LMS",
    ],
    faqs: [
      {
        question: "Is an Online MBA degree legally valid in India and abroad?",
        answer: "Yes, 100%. Under the University Grants Commission (UGC) Open and Distance Learning and Online Programmes Regulations, 2020, an Online MBA degree awarded by an entitled university is completely equivalent to a regular full-time on-campus MBA. It is valid for central/state government jobs, UPSC, PSU recruitment, higher doctoral studies (PhD), and private sector corporate roles.",
      },
      {
        question: "Do I have to visit the campus for examinations?",
        answer: "No. All accredited online universities listed on Degree Guru conduct examinations online through secure AI and human-proctored web platforms. You can take your semester exams right from your laptop or PC with a webcam and microphone at home on weekends.",
      },
      {
        question: "Can I pay my Online MBA fees in monthly installments?",
        answer: "Yes. Universities connect you with zero-cost and low-cost EMI financing plans through major banks and NBFCs, allowing you to start your Online MBA from as low as ₹3,950 per month with zero collateral.",
      },
      {
        question: "How many hours per week do I need to study for an Online MBA?",
        answer: "Most learners dedicate between 6 to 10 hours per week. Because lectures are recorded and accessible 24/7 on mobile, you can easily balance your studies alongside full-time work and personal commitments.",
      },
      {
        question: "What is the difference between an Online MBA and a Distance MBA?",
        answer: "While a Distance MBA primarily relies on printed self-study books and offline physical study centres for exams, an Online MBA is a modern digital interactive experience. It features live video classes, digital LMS, interactive quizzes, global peer networking, and 100% online home-based exams.",
      },
    ],
    relatedCourseSlugs: ["online-mca", "online-bba", "online-dba", "online-mcom"],
    topUniversitySlugs: ["amity-university-online", "manipal-university-jaipur-online", "nmims-online", "chandigarh-university-online", "lovely-professional-university-online", "dr-dy-patil-vidyapeeth-pune-online"],
    primaryKeywordCluster: ["online mba", "online mba course", "online mba degree", "online mba universities", "online mba fees", "online mba eligibility", "best online mba", "online mba for working professionals", "online mba with emi"],
  },

  // ── 2. Online BCA ────────────────────────────────────────────────
  {
    slug: "online-bca",
    title: "Online BCA",
    fullName: "Online Bachelor of Computer Applications",
    level: "Bachelors",
    duration: "3 Years (6 Semesters)",
    eligibility: "Class 12 (10+2) pass from any recognized board (CBSE, ICSE, State Board, or BOSSE) with minimum 45%–50% marks. Mathematics in Class 12 is optional in several leading universities.",
    feeRange: "₹50,000 – ₹1,50,000 (Total Course Fee)",
    emiStarting: "₹2,650/month",
    shortDesc: "Launch your software development career with an industry-oriented Online BCA. Master Python, Full-Stack Web Development, Cloud, and Data Structures 100% online.",
    overview: "The Online Bachelor of Computer Applications (BCA) is a premier 3-year undergraduate degree designed to bridge the gap between academic theory and practical software engineering. Built in collaboration with top tech giants, the curriculum equips students with hands-on coding proficiencies in Python, Java, JavaScript, Database Management, and Cloud Computing while granting the flexibility to pursue internships and freelance projects.",
    whoShouldChoose: [
      "Class 12 pass students passionate about coding, web development, and digital technology",
      "Non-science or commerce students wanting to build high-paying software and IT careers without doing B.Tech",
      "Self-taught developers, freelancers, and technical support staff wanting a recognized formal university degree",
      "Learners planning to pursue an Online MCA or technical master's degree in India or abroad",
    ],
    specializations: [
      "Cloud & Security",
      "Data Analytics & Machine Learning",
      "Full Stack Web Development",
      "Cybersecurity",
      "Artificial Intelligence",
      "Mobile App Development",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: ["Foundations of Information Technology", "Programming in C", "Mathematics for Computer Science", "Digital Electronics", "Practical C Programming Lab"],
      },
      {
        semester: "Semester 2",
        subjects: ["Object-Oriented Programming with C++", "Data Structures & Algorithms", "Operating Systems", "Environmental Studies", "Data Structures Lab"],
      },
      {
        semester: "Semester 3",
        subjects: ["Database Management Systems (DBMS)", "Core Java Programming", "Computer Networks", "Web Technologies (HTML/CSS/JS)", "DBMS & SQL Practical Lab"],
      },
      {
        semester: "Semester 4",
        subjects: ["Python Programming", "Software Engineering & Agile", "Computer Architecture", "Specialization Track Elective 1", "Python & Full-Stack Lab"],
      },
      {
        semester: "Semester 5",
        subjects: ["Cloud Computing Fundamentals", "Information Security", "Specialization Track Elective 2", "Mobile App Development", "Mini Technical Project"],
      },
      {
        semester: "Semester 6",
        subjects: ["Artificial Intelligence & Machine Learning Basics", "Advanced Web Frameworks (React/Node)", "Open Elective", "Major Capstone Software Project & Viva"],
      },
    ],
    learningFormat: [
      "Cloud coding sandboxes where students write and compile code directly in the browser",
      "Live interactive programming masterclasses with experienced software engineers",
      "Project-driven assessments emphasizing GitHub portfolios, clean code, and database schema creation",
      "Recorded lecture archives accessible on mobile for convenient revision anytime",
    ],
    examMode: "100% Online Remote-Proctored Exams with practical coding assignments and viva sessions.",
    careerOpportunities: "The IT sector actively recruits BCA graduates for software development, technical analysis, QA automation, and database administration roles. Top online universities connect students with tech hiring drives offering competitive starting packages.",
    jobRoles: [
      { role: "Junior Software Developer", salaryRange: "₹4.2 – ₹8.5 LPA", topIndustries: "IT Services, SaaS, Fintech" },
      { role: "Full Stack Web Developer", salaryRange: "₹5.0 – ₹10 LPA", topIndustries: "Startups, E-commerce, Tech Agencies" },
      { role: "Data Analyst", salaryRange: "₹4.5 – ₹9 LPA", topIndustries: "Analytics, Marketing, Banking" },
      { role: "Cloud Support Associate", salaryRange: "₹4.0 – ₹7.5 LPA", topIndustries: "AWS/Azure Partners, IT Infrastructure" },
      { role: "QA & Software Test Engineer", salaryRange: "₹3.8 – ₹7.0 LPA", topIndustries: "Software Companies, Consulting" },
    ],
    skillsGained: ["Full-Stack Web Development", "Object-Oriented Programming (Java/Python)", "Database Design & SQL", "Cloud Deployment (AWS/GCP)", "Data Structures & Problem Solving", "Git & Version Control"],
    careerProgression: "Trainee Engineer → Software Developer (Year 1–2) → Senior Developer (Year 3–4) → Tech Lead / Engineering Manager (Year 5+).",
    roiAnalysis: {
      avgInvestment: "₹90,000 (Average 3-year total tuition)",
      avgSalaryJump: "₹4,00,000 starting annual compensation",
      paybackPeriod: "Under 3 months post-employment",
      roiVerdict: "Exceptional ROI. Offers a fast, low-cost entry into the high-paying software industry without spending ₹8–12 lakhs on a conventional 4-year engineering college.",
    },
    admissionProcess: [
      "Step 1: Consult Degree Guru advisors to match universities by tech specialization",
      "Step 2: Submit 10th and 12th mark sheets along with ID proof",
      "Step 3: Instant admission eligibility check and university verification",
      "Step 4: Complete enrollment with affordable monthly EMI support",
    ],
    faqs: [
      {
        question: "Can I do an Online BCA if I did not have Math in Class 12?",
        answer: "Yes! While some universities mandate Mathematics at the 10+2 level, several premier institutions (such as Amity Online, Manipal Online, and LPU Online) accept students from Arts and Commerce streams, often providing a bridge foundation module in computer mathematics.",
      },
      {
        question: "Can I get a job in top IT companies after an Online BCA?",
        answer: "Absolutely. Leading tech employers like TCS, Infosys, Wipro, Accenture, Cognizant, and product startups evaluate candidates based on their coding skills, problem-solving ability, and portfolio projects. The UGC-entitled Online BCA gives you full formal qualification parity.",
      },
      {
        question: "Can I apply for an MCA or pursue higher studies abroad after an Online BCA?",
        answer: "Yes. An Online BCA from a UGC-recognized university is fully valid for admission into an MCA, MSc Computer Science, MBA, or international university postgraduate master's degrees with WES equivalence.",
      },
      {
        question: "How do practical coding sessions work in an online degree?",
        answer: "Universities provide integrated cloud IDEs and virtual programming sandboxes. You write code, execute test suites, and submit real-world GitHub projects directly through your browser, guided by live faculty lab assistants.",
      },
    ],
    relatedCourseSlugs: ["online-mca", "online-bba", "online-msc"],
    topUniversitySlugs: ["amity-university-online", "manipal-university-jaipur-online", "chandigarh-university-online", "lovely-professional-university-online", "parul-university", "galgotias-university-online"],
    primaryKeywordCluster: ["online bca", "online bca course", "online bca degree", "online bca admission", "online bca fees", "online bca eligibility", "best online bca", "online bca without maths"],
  },

  // ── 3. Online MCA ────────────────────────────────────────────────
  {
    slug: "online-mca",
    title: "Online MCA",
    fullName: "Online Master of Computer Applications",
    level: "Masters",
    duration: "2 Years (4 Semesters)",
    eligibility: "BCA, B.Sc (Computer Science / IT), B.Tech or any Bachelor's degree with Mathematics at 10+2 or Graduation level with at least 50% aggregate marks (45% for reserved categories).",
    feeRange: "₹75,000 – ₹1,80,000 (Total Course Fee)",
    emiStarting: "₹3,400/month",
    shortDesc: "Elevate your tech stature to senior software engineer or system architect. Industry-designed 2-year Online MCA with AI, Cloud Architecture & DevOps.",
    overview: "The modern 2-year Online Master of Computer Applications (MCA) is designed in alignment with the revised AICTE curriculum to prepare technical graduates for elite engineering and architectural positions. Covering advanced algorithms, distributed computing, DevOps, AI, and cybersecurity, it empowers professionals to upgrade into senior high-compensation tech roles while maintaining their full-time jobs.",
    whoShouldChoose: [
      "BCA, B.Sc, and B.Tech graduates seeking rapid career escalation into senior engineering roles",
      "IT professionals aiming to transition into Artificial Intelligence, Data Engineering, or Cloud Architecture",
      "Junior developers seeking pay parity and executive promotions equivalent to M.Tech and regular MCA graduates",
      "Professionals preparing for global technical leadership roles in high-growth technology corporations",
    ],
    specializations: [
      "Artificial Intelligence & Machine Learning",
      "Cloud Computing & DevOps",
      "Cyber Security & Digital Forensics",
      "Data Science & Big Data Analytics",
      "Full Stack Software Development",
      "Blockchain Technology",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: ["Advanced Data Structures & Algorithms", "Computer Networks & Distributed Systems", "Relational & NoSQL Database Systems", "Mathematical Foundations of Computer Science", "Advanced Programming Lab (Python/Go)"],
      },
      {
        semester: "Semester 2",
        subjects: ["Cloud Computing Architecture", "Object Oriented Software Engineering", "AI & Machine Learning Essentials", "Web Technologies & Microservices", "Cloud & Web Services Lab"],
      },
      {
        semester: "Semester 3",
        subjects: ["Specialization Core 1 (e.g. Deep Learning / DevOps)", "Specialization Core 2 (e.g. NLP / Containerization)", "Cybersecurity & Cryptography", "Research Methodology", "Industry Mini Project"],
      },
      {
        semester: "Semester 4",
        subjects: ["Enterprise System Design", "Specialization Elective 3", "Major Industrial Internship / Software Capstone Project", "Comprehensive Viva Voce"],
      },
    ],
    learningFormat: [
      "Live weekend masterclasses by principal software engineers and CTOs from top tech firms",
      "Virtual cloud labs with Docker and Kubernetes environments for hands-on systems programming",
      "Interactive code reviews, peer programming sessions, and hackathons",
      "Access to comprehensive recorded archives and technical research paper repositories",
    ],
    examMode: "100% Online Remote-Proctored Examinations with automated code execution checks and virtual vivas.",
    careerOpportunities: "An Online MCA commands immediate respect across IT consulting giants, product multinationals, and innovative startups. MCA holders frequently transition directly into Tech Lead, Principal Engineer, and Solutions Architect positions.",
    jobRoles: [
      { role: "Senior Software Engineer", salaryRange: "₹9.0 – ₹18 LPA", topIndustries: "Product MNCs, FinTech, SaaS" },
      { role: "Cloud Solutions Architect", salaryRange: "₹14 – ₹28 LPA", topIndustries: "Cloud Providers, Enterprise IT" },
      { role: "Machine Learning Engineer", salaryRange: "₹11 – ₹22 LPA", topIndustries: "AI Startups, Automotive, Healthcare" },
      { role: "DevOps Engineer / SRE", salaryRange: "₹10 – ₹20 LPA", topIndustries: "Telecom, E-Commerce, Banking" },
      { role: "Data Engineer", salaryRange: "₹8.5 – ₹17 LPA", topIndustries: "Big Data Consulting, Retail Analytics" },
    ],
    skillsGained: ["Distributed Systems Architecture", "Machine Learning & Neural Networks", "Docker & Kubernetes Deployment", "Advanced Database Optimization", "CI/CD Pipeline Construction", "Enterprise Software Engineering"],
    careerProgression: "Software Developer → Senior Software Engineer (Post-MCA) → Tech Lead (Year 2–3) → Solutions Architect (Year 4–6) → Director of Engineering (Year 7+).",
    roiAnalysis: {
      avgInvestment: "₹1,10,000 (Average 2-year total tuition)",
      avgSalaryJump: "₹4,50,000 – ₹7,00,000 salary increase",
      paybackPeriod: "3 to 5 months post-completion",
      roiVerdict: "Top-Tier ROI. The AICTE-revised 2-year structure saves an entire year of study compared to the old 3-year format, accelerating entry into high six-figure tech packages.",
    },
    admissionProcess: [
      "Step 1: Free consultation with Degree Guru's technical career specialists",
      "Step 2: Submit graduation marks and verification documents",
      "Step 3: University eligibility verification and specialization selection",
      "Step 4: Zero-cost EMI activation and LMS credential distribution",
    ],
    faqs: [
      {
        question: "Is a 2-year Online MCA recognized by AICTE and UGC?",
        answer: "Yes. In 2020, AICTE officially reduced the MCA course duration from 3 years to 2 years nationwide. All UGC-entitled Online MCA programs follow this approved 2-year syllabus and carry full recognition for private and government recruitment.",
      },
      {
        question: "Can non-BCA graduates (like B.Sc or B.Com students) apply for an Online MCA?",
        answer: "Yes, provided you had Mathematics either in Class 12 or at the graduation degree level. Some universities offer a supplementary bridge semester to help non-CS students build necessary foundational programming skills.",
      },
      {
        question: "Does an Online MCA qualify for government exams and public sector undertakings (PSUs)?",
        answer: "Yes. The UGC Gazette confirms that degrees awarded through online mode by recognized universities are treated as equivalent to regular on-campus degrees for all Central/State government positions and PSU recruitments.",
      },
    ],
    relatedCourseSlugs: ["online-bca", "online-mba", "online-msc"],
    topUniversitySlugs: ["amity-university-online", "manipal-university-jaipur-online", "chandigarh-university-online", "lovely-professional-university-online", "vellore-institute-of-technology-online", "jaypee-institute-of-information-technology-online"],
    primaryKeywordCluster: ["online mca", "online mca course", "online mca degree", "online mca admission", "online mca fees", "online mca eligibility", "2 year online mca", "best online mca in india"],
  },

  // ── 4. Online BBA ────────────────────────────────────────────────
  {
    slug: "online-bba",
    title: "Online BBA",
    fullName: "Online Bachelor of Business Administration",
    level: "Bachelors",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 (Class 12) in any stream (Commerce, Science, Arts) from a recognized board with minimum 45%–50% marks.",
    feeRange: "₹55,000 – ₹1,50,000",
    emiStarting: "₹2,800/month",
    shortDesc: "Build management, marketing, and leadership foundations from day one. India's top UGC-approved Online BBA with practical corporate modules.",
    overview: "The Online Bachelor of Business Administration (BBA) is a high-demand professional undergraduate degree crafted to prepare ambitious school leavers and young professionals for successful business management careers. Covering digital marketing, corporate finance, organizational leadership, and entrepreneurship, the program offers flexible learning paired with real-world case discussions.",
    whoShouldChoose: [
      "Class 12 students seeking early business leadership skills and practical corporate training",
      "Aspiring entrepreneurs aiming to launch or scale modern digital startups and family enterprises",
      "Young professionals in sales, administration, or retail seeking recognized graduate qualifications",
      "Learners planning to pursue a future top-tier MBA program",
    ],
    specializations: [
      "Digital Marketing",
      "Finance & Banking",
      "Human Resource Management",
      "Retail & E-Commerce Operations",
      "International Business",
      "Entrepreneurship & Family Business",
    ],
    curriculum: [
      {
        semester: "Semester 1",
        subjects: ["Principles of Management", "Business Economics", "Business Mathematics & Statistics", "Business English & Communication", "Computer Applications in Business"],
      },
      {
        semester: "Semester 2",
        subjects: ["Financial Accounting", "Marketing Management", "Organizational Behavior", "Business Law", "Environmental Studies"],
      },
      {
        semester: "Semester 3",
        subjects: ["Human Resource Management", "Cost & Management Accounting", "Operations Management", "Business Research Methods", "Specialization Elective 1"],
      },
      {
        semester: "Semester 4",
        subjects: ["Financial Management", "International Business Environment", "Consumer Behavior", "Specialization Elective 2", "Corporate Social Responsibility"],
      },
      {
        semester: "Semester 5",
        subjects: ["Strategic Management", "Digital Marketing Foundations", "Entrepreneurship Development", "Specialization Elective 3", "Internship Project"],
      },
      {
        semester: "Semester 6",
        subjects: ["Business Analytics for Managers", "Global Supply Chain Management", "Advanced Specialization Elective 4", "Capstone Business Plan & Project"],
      },
    ],
    learningFormat: ["Live weekly faculty webinars", "Harvard business case studies", "Interactive digital e-books", "Mobile app with offline study capabilities"],
    examMode: "100% Online Remote-Proctored Semester Exams with flexible weekend scheduling.",
    careerOpportunities: "BBA graduates secure early placements across corporate banking, digital marketing agencies, logistics, retail management, and HR consulting firms.",
    jobRoles: [
      { role: "Marketing & Growth Associate", salaryRange: "₹4.0 – ₹7.5 LPA", topIndustries: "E-commerce, Brands, Agencies" },
      { role: "Financial Services Executive", salaryRange: "₹4.2 – ₹8.0 LPA", topIndustries: "Banking, Insurance, FinTech" },
      { role: "Human Resources Coordinator", salaryRange: "₹3.8 – ₹6.5 LPA", topIndustries: "Corporate MNCs, Staffing Firms" },
      { role: "Operations Supervisor", salaryRange: "₹4.0 – ₹7.0 LPA", topIndustries: "Logistics, Retail, Hospitality" },
    ],
    skillsGained: ["Marketing Campaign Formulation", "Financial Statement Analysis", "Team Leadership & Coordination", "Business Pitching & Negotiation", "Data Interpretation"],
    careerProgression: "Management Trainee → Assistant Manager (Year 2) → Business Manager (Year 4) → General Manager / Business Unit Head (Post-MBA / Year 6+).",
    roiAnalysis: {
      avgInvestment: "₹95,000 (Average 3-year total tuition)",
      avgSalaryJump: "₹3,80,000 starting compensation",
      paybackPeriod: "Under 4 months of employment",
      roiVerdict: "Strong Career Launchpad. Equips students with foundational corporate readiness at a fraction of traditional business school costs.",
    },
    admissionProcess: [
      "Step 1: Discuss university options with Degree Guru counselors",
      "Step 2: Upload 10th and 12th certificates for verification",
      "Step 3: Confirm admission seat in your preferred university",
      "Step 4: Activate affordable zero-cost EMI",
    ],
    faqs: [
      {
        question: "Can I prepare for an MBA or government exams during my Online BBA?",
        answer: "Yes! The flexible schedule allows you to prepare for CAT, XAT, UPSC, or Banking exams simultaneously without attending physical classes.",
      },
      {
        question: "Is the degree certificate identical to a regular BBA?",
        answer: "Yes. Under UGC regulations, the degree certificate clearly confers a Bachelor of Business Administration degree without stigmatizing delivery labels.",
      },
    ],
    relatedCourseSlugs: ["online-mba", "online-bcom", "online-bca"],
    topUniversitySlugs: ["amity-university-online", "manipal-university-jaipur-online", "nmims-online", "lovely-professional-university-online", "parul-university"],
    primaryKeywordCluster: ["online bba", "online bba course", "online bba degree", "online bba admission", "online bba fees", "best online bba in india"],
  },

  // ── 5. Online B.Com ──────────────────────────────────────────────
  {
    slug: "online-bcom",
    title: "Online B.Com",
    fullName: "Online Bachelor of Commerce",
    level: "Bachelors",
    duration: "3 Years (6 Semesters)",
    eligibility: "10+2 Pass in Commerce or any stream from a recognized board with minimum 45%–50% marks.",
    feeRange: "₹40,000 – ₹1,20,000",
    emiStarting: "₹2,100/month",
    shortDesc: "Master corporate finance, auditing, and taxation. The ultimate flexible degree for CA, CS, and Banking aspirants.",
    overview: "An Online Bachelor of Commerce (B.Com) provides thorough foundational expertise across financial accounting, corporate taxation, auditing, company law, and banking operations. It is widely preferred by learners who are preparing for professional examinations such as CA, CS, CMA, and CPA.",
    whoShouldChoose: [
      "CA, CS, CMA, and CFA aspirants needing a recognized parallel graduation degree with zero attendance hassles",
      "Working professionals in retail accounting, banking, and financial services needing formal degree qualification",
      "Commerce students seeking high-quality university credentials with maximum scheduling freedom",
    ],
    specializations: ["Accounting & Finance", "Banking & Insurance", "FinTech & Digital Banking", "Auditing & Taxation", "International Finance (ACCA integrated)"],
    curriculum: [
      { semester: "Semester 1", subjects: ["Financial Accounting", "Business Organization & Management", "Microeconomics", "Business Communication", "Environmental Studies"] },
      { semester: "Semester 2", subjects: ["Advanced Accounting", "Corporate Law", "Macroeconomics", "Business Statistics", "Computerized Accounting (Tally/ERP)"] },
      { semester: "Semester 3", subjects: ["Income Tax Law & Practice", "Company Law", "Cost Accounting", "Banking Theory & Practice", "Specialization Elective 1"] },
      { semester: "Semester 4", subjects: ["Goods & Services Tax (GST) & Customs", "Auditing & Corporate Governance", "Management Accounting", "Financial Markets", "Specialization Elective 2"] },
      { semester: "Semester 5", subjects: ["Financial Management", "Corporate Tax Planning", "Principles of Marketing", "Specialization Elective 3", "Project Work"] },
      { semester: "Semester 6", subjects: ["International Business & Trade", "Security Analysis & Portfolio Management", "Advanced Auditing", "Specialization Elective 4", "Comprehensive Viva"] },
    ],
    learningFormat: ["Self-paced interactive modules", "Live weekly tax and accounting webinars", "Practice problem-solving sets", "Mobile e-learning app"],
    examMode: "100% Online Proctored Semester Exams.",
    careerOpportunities: "Direct recruitment paths into audit firms, banking, mutual funds, insurance, and corporate accounting departments.",
    jobRoles: [
      { role: "Accountant / Financial Executive", salaryRange: "₹3.5 – ₹6.5 LPA", topIndustries: "Corporate Finance, Audit Firms" },
      { role: "Tax Consultant / GST Executive", salaryRange: "₹4.0 – ₹7.2 LPA", topIndustries: "Accounting Services, Retail" },
      { role: "Bank Probationary Officer (PO)", salaryRange: "₹5.5 – ₹9.0 LPA", topIndustries: "Public & Private Banks" },
      { role: "Financial Analyst Trainee", salaryRange: "₹4.5 – ₹8.0 LPA", topIndustries: "FinTech, Wealth Management" },
    ],
    skillsGained: ["Balance Sheet Auditing", "Corporate Tax & GST Filing", "Financial Statement Interpretation", "Tally & ERP Accounting", "Risk & Portfolio Assessment"],
    careerProgression: "Junior Accountant → Senior Accountant (Year 2) → Finance Manager (Year 4) → Financial Controller / CFO (Post-Qualification / Year 7+).",
    roiAnalysis: {
      avgInvestment: "₹65,000 (Average 3-year total tuition)",
      avgSalaryJump: "₹3,50,000 starting salary",
      paybackPeriod: "Under 3 months of full-time employment",
      roiVerdict: "Extremely Cost-Effective. One of the most affordable bachelor's degrees in India with universal government and private acceptability.",
    },
    admissionProcess: ["Step 1: Free consultation with Degree Guru", "Step 2: Submit 10th & 12th mark sheets", "Step 3: Document approval", "Step 4: Start studying with easy EMI"],
    faqs: [
      { question: "Can I pursue CA or CS alongside an Online B.Com?", answer: "Yes! Thousands of CA/CS foundation and intermediate students choose an Online B.Com because it eliminates daily mandatory college attendance, giving you 100% focus for your articleship and professional prep." },
      { question: "Is this degree recognized for bank and government examinations?", answer: "Yes. It is fully valid for SBI PO, IBPS PO, SSC CGL, UPSC Civil Services, and state government officer recruitments." },
    ],
    relatedCourseSlugs: ["online-mcom", "online-bba", "online-mba"],
    topUniversitySlugs: ["amity-university-online", "manipal-university-jaipur-online", "chandigarh-university-online", "lovely-professional-university-online", "andhra-university-online"],
    primaryKeywordCluster: ["online bcom", "online b.com course", "online bcom degree", "online bcom admission", "online bcom fees", "online bcom for ca students"],
  },

  // ── 6. Online BA ─────────────────────────────────────────────────
  {
    slug: "online-ba",
    title: "Online BA",
    fullName: "Online Bachelor of Arts",
    level: "Bachelors",
    duration: "3 Years (6 Semesters)",
    eligibility: "Class 12 (10+2) pass in any stream from a recognized board with minimum 45% marks.",
    feeRange: "₹35,000 – ₹1,10,000",
    emiStarting: "₹1,850/month",
    shortDesc: "The ultimate flexible humanities degree. Ideal for UPSC, Civil Services aspirants, writers, and working candidates.",
    overview: "The Online Bachelor of Arts (BA) is a flexible, highly regarded degree offering rich intellectual specializations across English Literature, Political Science, History, Sociology, Economics, and Psychology. It is especially celebrated among civil service aspirants and creative media professionals seeking maximum autonomy over their daily schedules.",
    whoShouldChoose: [
      "Civil Services (UPSC, State PSC, SSC) aspirants needing strong subject foundations with zero mandatory classroom hours",
      "Content creators, writers, journalists, and media executives wanting a recognized academic degree",
      "Working candidates and homemakers seeking to complete their graduation at an affordable pace",
    ],
    specializations: ["English Literature", "Political Science", "History", "Sociology", "Economics", "Journalism & Mass Communication", "Psychology"],
    curriculum: [
      { semester: "Semester 1", subjects: ["Core Language & Communication", "Introduction to Political Theory", "History of India - Ancient", "Sociology Concepts", "Environmental Studies"] },
      { semester: "Semester 2", subjects: ["English Literature Classics", "Indian Government & Politics", "Medieval Indian History", "Social Institutions", "Generic Elective 1"] },
      { semester: "Semester 3", subjects: ["Specialization Subject 1", "Modern Indian History", "Public Administration", "Contemporary Social Issues", "Skill Enhancement Course"] },
      { semester: "Semester 4", subjects: ["Specialization Subject 2", "International Relations", "Economic Development", "Research Methods in Social Sciences", "Skill Enhancement Course 2"] },
      { semester: "Semester 5", subjects: ["Advanced Specialization Subject 3", "Modern World History", "Political Thought", "Discipline Specific Elective 1", "Term Project"] },
      { semester: "Semester 6", subjects: ["Advanced Specialization Subject 4", "Contemporary Global Politics", "Human Rights & Gender Studies", "Discipline Specific Elective 2", "Dissertation"] },
    ],
    learningFormat: ["Engaging video masterclasses", "Downloadable comprehensive study books", "Faculty discussion hours", "Interactive reading packs"],
    examMode: "Online Remote Proctored Semester Exams.",
    careerOpportunities: "Direct eligibility for all civil services, defense, banking examinations, advertising agencies, publishing houses, and NGO leadership roles.",
    jobRoles: [
      { role: "Civil Services / Government Officer", salaryRange: "₹7.0 – ₹14 LPA", topIndustries: "State & Central Government" },
      { role: "Content Strategist & Copywriter", salaryRange: "₹4.2 – ₹8.5 LPA", topIndustries: "Media, Tech, Advertising" },
      { role: "Public Relations Executive", salaryRange: "₹4.0 – ₹7.5 LPA", topIndustries: "Corporate Communications, Agencies" },
      { role: "Policy Research Analyst", salaryRange: "₹4.5 – ₹9.0 LPA", topIndustries: "Think Tanks, NGOs, Media" },
    ],
    skillsGained: ["Critical Analysis & Synthesizing Complex Information", "Persuasive Writing & Public Discourse", "Sociopolitical Awareness", "Policy Analysis", "Qualitative Research"],
    careerProgression: "Associate / Analyst → Senior Specialist (Year 2) → Communications / Policy Lead (Year 4) → Department Director (Year 6+).",
    roiAnalysis: {
      avgInvestment: "₹50,000 (Average 3-year total tuition)",
      avgSalaryJump: "₹3,60,000 annual entry package",
      paybackPeriod: "Under 2 months of post-graduation employment",
      roiVerdict: "Highest Affordability. Lowest tuition cost among all university degree offerings with 100% civil service and public exam validity.",
    },
    admissionProcess: ["Step 1: Select preferred subject combination on Degree Guru", "Step 2: Upload 10th & 12th mark sheets", "Step 3: Verification & instant seat offer", "Step 4: Begin classes with micro-EMI support"],
    faqs: [
      { question: "Is an Online BA recognized for UPSC Civil Services and State PSC?", answer: "Yes! The Union Public Service Commission (UPSC) and all State Public Service Commissions treat online degrees from UGC-recognized universities identically to regular campus degrees." },
      { question: "Can I pursue an MA or B.Ed after an Online BA?", answer: "Yes. An Online BA provides full eligibility for master's programs (MA, MBA) as well as professional degrees like B.Ed and LLB." },
    ],
    relatedCourseSlugs: ["online-ma", "online-bcom", "online-bba"],
    topUniversitySlugs: ["amity-university-online", "chandigarh-university-online", "lovely-professional-university-online", "andhra-university-online", "kurukshetra-university-online"],
    primaryKeywordCluster: ["online ba", "online ba course", "online ba degree", "online ba admission", "online ba fees", "online ba for upsc"],
  },

  // ── 7. Online M.Com ──────────────────────────────────────────────
  {
    slug: "online-mcom",
    title: "Online M.Com",
    fullName: "Online Master of Commerce",
    level: "Masters",
    duration: "2 Years (4 Semesters)",
    eligibility: "B.Com, BBA, B.Com (Hons) or equivalent commerce bachelor's degree with minimum 50% marks (45% for reserved categories).",
    feeRange: "₹45,000 – ₹1,20,000",
    emiStarting: "₹2,400/month",
    shortDesc: "Advance your corporate accounting, taxation, and financial mastery. Ideal for finance professionals, UGC NET, and lectureship aspirants.",
    overview: "The Online Master of Commerce (M.Com) is an advanced two-year postgraduate degree designed to cultivate high-level expertise in financial analytics, international trade, taxation laws, accounting theory, and investment management. It is the premier academic pathway for finance executives and future commerce educators.",
    whoShouldChoose: [
      "Commerce graduates seeking senior financial leadership roles in corporate firms",
      "Candidates preparing for UGC NET / JRF to pursue assistant professorships in higher education",
      "Accountants and auditors looking to qualify for senior managerial compensation bands",
    ],
    specializations: ["Financial Analysis & Reporting", "International Business & Trade", "Advanced Banking & Insurance", "Taxation & Forensic Accounting"],
    curriculum: [
      { semester: "Semester 1", subjects: ["Organizational Theory & Behavior", "Statistical Analysis for Business", "Financial Management & Policy", "Managerial Economics", "Advanced Accounting Standards"] },
      { semester: "Semester 2", subjects: ["Corporate Financial Accounting", "Marketing Concepts & Strategy", "Business Environment & Policy", "International Business Operations", "Research Methodology"] },
      { semester: "Semester 3", subjects: ["Corporate Tax Planning & Management", "Strategic Cost Management", "Specialization Elective 1", "Specialization Elective 2", "Seminar & Case Analysis"] },
      { semester: "Semester 4", subjects: ["Security Analysis & Portfolio Management", "Financial Institutions & Markets", "Advanced Auditing & Corporate Governance", "Specialization Elective 3", "Dissertation & Viva"] },
    ],
    learningFormat: ["Recorded masterclasses", "Live weekend financial modeling workshops", "Digital library access", "Self-assessment tools"],
    examMode: "100% Online Remote-Proctored Exams.",
    careerOpportunities: "Direct pathways into corporate finance, consulting companies, banking institutions, and academia.",
    jobRoles: [
      { role: "Senior Financial Analyst", salaryRange: "₹6.5 – ₹12 LPA", topIndustries: "Banking, FinTech, MNCs" },
      { role: "Corporate Tax Manager", salaryRange: "₹7.0 – ₹13 LPA", topIndustries: "Big 4 Consulting, Corporate Audit" },
      { role: "Assistant Professor (after NET)", salaryRange: "₹6.0 – ₹10 LPA", topIndustries: "Universities, Higher Education" },
      { role: "Risk & Compliance Officer", salaryRange: "₹6.5 – ₹11 LPA", topIndustries: "BFSI, Investment Firms" },
    ],
    skillsGained: ["Advanced Corporate Valuation", "Tax Strategy & Planning", "Auditing Frameworks", "Econometric Modeling", "Investment Portfolio Management"],
    careerProgression: "Accountant → Senior Analyst (Post-M.Com) → Finance Manager (Year 3) → Vice President - Finance (Year 6+).",
    roiAnalysis: {
      avgInvestment: "₹75,000 (Average 2-year total tuition)",
      avgSalaryJump: "₹3,00,000 – ₹4,80,000 increase in compensation",
      paybackPeriod: "Under 3 months post-completion",
      roiVerdict: "High Academic & Corporate Return. Direct eligibility for lectureship exams and senior accounting roles.",
    },
    admissionProcess: ["Step 1: Choose university on Degree Guru", "Step 2: Upload B.Com transcripts", "Step 3: Verification & enrollment", "Step 4: Flexible monthly payment setup"],
    faqs: [
      { question: "Is an Online M.Com valid for the UGC NET exam for lectureship?", answer: "Yes! UGC explicitly recognizes online postgraduate master's degrees from entitled universities for taking the National Eligibility Test (NET) for Assistant Professorship and JRF." },
    ],
    relatedCourseSlugs: ["online-bcom", "online-mba", "online-ma"],
    topUniversitySlugs: ["amity-university-online", "manipal-university-jaipur-online", "lovely-professional-university-online", "andhra-university-online", "parul-university"],
    primaryKeywordCluster: ["online mcom", "online m.com course", "online mcom degree", "online mcom admission", "online mcom fees", "online mcom for ugc net"],
  },

  // ── 8. Online MA ─────────────────────────────────────────────────
  {
    slug: "online-ma",
    title: "Online MA",
    fullName: "Online Master of Arts",
    level: "Masters",
    duration: "2 Years (4 Semesters)",
    eligibility: "Bachelor's degree in any discipline from a recognized university with minimum 45%–50% marks.",
    feeRange: "₹45,000 – ₹1,30,000",
    emiStarting: "₹2,300/month",
    shortDesc: "Deepen your expertise across Literature, Psychology, Sociology, and Public Policy without leaving your job.",
    overview: "An Online Master of Arts (MA) provides advanced academic specialization across humanities and social sciences disciplines. It equips educators, researchers, content leaders, and policy professionals with master-level critical analysis, scholarly inquiry, and advanced communication capabilities.",
    whoShouldChoose: [
      "Teachers, lecturers, and educators aiming for promotions and higher salary scales",
      "UGC NET / PhD aspirants seeking specialized research credentials in English, Psychology, or Sociology",
      "Media professionals, editors, authors, and corporate trainers requiring postgraduate qualifications",
    ],
    specializations: ["English Literature", "Psychology", "Sociology", "Political Science & International Relations", "Public Policy & Administration", "Economics", "Journalism & Mass Communication"],
    curriculum: [
      { semester: "Semester 1", subjects: ["Advanced Foundations of the Discipline", "Historiography & Literature/Theory", "Core Subject Concepts 1", "Core Subject Concepts 2", "Academic Writing & Research"] },
      { semester: "Semester 2", subjects: ["Advanced Theoretical Approaches", "Contemporary Global Contexts", "Elective Paper 1", "Elective Paper 2", "Seminar Paper Presentation"] },
      { semester: "Semester 3", subjects: ["Specialization Paper 1", "Specialization Paper 2", "Specialization Paper 3", "Interdisciplinary Elective", "Dissertation Synopsis Preparation"] },
      { semester: "Semester 4", subjects: ["Specialization Paper 4", "Specialization Paper 5", "Master Dissertation / Research Project", "Comprehensive Viva Voce"] },
    ],
    learningFormat: ["Recorded expert lectures", "Live weekend seminars", "Extensive digitized reading packs", "Faculty mentor review sessions"],
    examMode: "100% Online Remote-Proctored Semester Exams.",
    careerOpportunities: "Openings across secondary and higher education, corporate training, publishing houses, think tanks, public relations, and social development.",
    jobRoles: [
      { role: "Assistant Professor / Senior Lecturer (with NET)", salaryRange: "₹6.0 – ₹11 LPA", topIndustries: "Colleges, Universities" },
      { role: "Senior Editor & Publications Manager", salaryRange: "₹5.5 – ₹10 LPA", topIndustries: "Publishing, EdTech, Media" },
      { role: "Corporate Communications Lead", salaryRange: "₹6.5 – ₹12 LPA", topIndustries: "Tech MNCs, Consulting" },
      { role: "Psychological / Educational Counselor", salaryRange: "₹5.0 – ₹9.5 LPA", topIndustries: "Healthcare, Schools, Private Practice" },
    ],
    skillsGained: ["Scholarly Research & Qualitative Analysis", "Advanced Persuasive Rhetoric", "Behavioral & Sociological Insight", "Curriculum & Content Architecture", "Cross-Cultural Communication"],
    careerProgression: "Lecturer / Associate → Senior Professor / Head of Department (Year 5+) OR Content Specialist → Director of Communications (Year 5+).",
    roiAnalysis: {
      avgInvestment: "₹70,000 (Average 2-year total tuition)",
      avgSalaryJump: "₹2,50,000 – ₹4,00,000 increment in academic and media roles",
      paybackPeriod: "Under 4 months post-completion",
      roiVerdict: "Strong Professional & Scholarly Return. Fast-tracks school teachers to PGT/Principal bands and qualifies graduates for university lectureship.",
    },
    admissionProcess: ["Step 1: Choose specialization with Degree Guru advisors", "Step 2: Submit graduation marks", "Step 3: Verification & confirmation", "Step 4: Activate affordable installment plan"],
    faqs: [
      { question: "Can I do an Online MA in English if my graduation was in Science or Commerce?", answer: "Yes! Most universities permit graduates of any stream (B.Sc, B.Com, B.Tech, etc.) to enroll in an Online MA in English, Political Science, or Sociology." },
      { question: "Is this degree valid for school teaching (PGT) and B.Ed eligibility?", answer: "Yes, fully valid across all state education boards, Kendriya Vidyalayas (KVS), Navodaya Vidyalayas, and private international schools." },
    ],
    relatedCourseSlugs: ["online-ba", "online-mcom", "online-mba"],
    topUniversitySlugs: ["amity-university-online", "lovely-professional-university-online", "chandigarh-university-online", "andhra-university-online", "kurukshetra-university-online"],
    primaryKeywordCluster: ["online ma", "online ma course", "online ma degree", "online ma english", "online ma admission", "online ma fees"],
  },

  // ── 9. Online M.Sc ───────────────────────────────────────────────
  {
    slug: "online-msc",
    title: "Online M.Sc",
    fullName: "Online Master of Science (Data Science / AI / Mathematics)",
    level: "Masters",
    duration: "2 Years (4 Semesters)",
    eligibility: "B.Sc (Maths, Stats, CS, IT, Physics) or BCA, B.Tech/BE or any Bachelor's degree with quantitative/mathematical background with minimum 50% aggregate.",
    feeRange: "₹85,000 – ₹1,95,000",
    emiStarting: "₹3,900/month",
    shortDesc: "Master Data Science, Applied Mathematics, and AI. High-demand STEM postgraduate degree designed for tech and analytics leaders.",
    overview: "The Online Master of Science (M.Sc) in specialized quantitative domains—such as Data Science, Artificial Intelligence, Applied Mathematics, and Information Technology—is an elite technical program. It develops advanced statistical computation, predictive modeling, machine learning, and algorithmic expertise for high-impact industrial and research careers.",
    whoShouldChoose: [
      "Software engineers, analysts, and STEM graduates aiming to transition into high-paying Data Scientist and AI Specialist roles",
      "Professionals seeking strong mathematical, statistical, and algorithmic mastery without pausing full-time employment",
      "Aspirants targeting advanced research, doctoral studies, or specialized tech consulting careers",
    ],
    specializations: ["Data Science & Analytics", "Artificial Intelligence & Machine Learning", "Applied Mathematics & Computing", "Information Technology", "Cybersecurity & Cryptography"],
    curriculum: [
      { semester: "Semester 1", subjects: ["Probability & Mathematical Statistics", "Advanced Python & Scientific Computing", "Linear Algebra for Data Science", "Data Structures & Database Systems", "Data Science Lab 1"] },
      { semester: "Semester 2", subjects: ["Machine Learning Algorithms & Models", "Statistical Inference & Modeling", "Big Data Analytics & Spark", "Data Visualization & Storytelling", "Machine Learning Lab 2"] },
      { semester: "Semester 3", subjects: ["Deep Learning & Neural Networks", "Natural Language Processing (NLP)", "Specialization Elective 1", "Specialization Elective 2", "Industry Capstone Project Phase 1"] },
      { semester: "Semester 4", subjects: ["AI Ethics & MLOps Deployment", "Cloud Analytics Engineering", "Advanced Elective 3", "Final Research Dissertation & Defense"] },
    ],
    learningFormat: ["Interactive Jupyter notebook cloud environments", "Live coding masterclasses with lead data scientists", "Comprehensive video lectures", "Weekly Kaggle-style challenges"],
    examMode: "100% Online Remote-Proctored Exams with code submissions and viva.",
    careerOpportunities: "Massive demand across tech conglomerates, hedge funds, fintech, healthtech, and global e-commerce companies.",
    jobRoles: [
      { role: "Data Scientist", salaryRange: "₹10 – ₹22 LPA", topIndustries: "FinTech, E-Commerce, Tech Product" },
      { role: "Machine Learning Engineer", salaryRange: "₹12 – ₹25 LPA", topIndustries: "AI Startups, Automotive, Healthcare" },
      { role: "Quantitative / Risk Analyst", salaryRange: "₹11 – ₹24 LPA", topIndustries: "Investment Banks, Hedge Funds" },
      { role: "BI & Data Architect", salaryRange: "₹13 – ₹26 LPA", topIndustries: "Enterprise IT, Cloud Consulting" },
    ],
    skillsGained: ["Statistical Inference & Predictive Modeling", "Deep Learning Architectures (TensorFlow/PyTorch)", "Big Data Processing (PySpark/Hadoop)", "Data Pipeline Engineering & MLOps", "Complex Data Storytelling"],
    careerProgression: "Data Analyst → Data Scientist (Post-M.Sc) → Lead Data Scientist (Year 3) → Principal Scientist / Head of AI (Year 6+).",
    roiAnalysis: {
      avgInvestment: "₹1,30,000 (Average 2-year total tuition)",
      avgSalaryJump: "₹5,00,000 – ₹9,00,000 salary surge",
      paybackPeriod: "3 to 4 months post-graduation",
      roiVerdict: "Peak Market Value. Data Science and AI specialists command among the highest compensation multiples in global tech recruitment.",
    },
    admissionProcess: ["Step 1: Check quantitative eligibility with Degree Guru", "Step 2: Submit STEM transcripts", "Step 3: Verification & university approval", "Step 4: Start learning with low-cost EMI"],
    faqs: [
      { question: "Is a coding background required to join an Online M.Sc in Data Science?", answer: "Basic exposure to programming or mathematics is helpful, but universities provide foundational bridge courses in Python and statistics during the first semester." },
      { question: "Is an Online M.Sc valid for a PhD in India or abroad?", answer: "Yes. The degree is awarded by UGC-recognized universities and is fully valid for CSIR-UGC NET, GATE, and PhD admissions globally with WES evaluation." },
    ],
    relatedCourseSlugs: ["online-mca", "online-bca", "online-mba"],
    topUniversitySlugs: ["chandigarh-university-online", "vellore-institute-of-technology-online", "manipal-university-jaipur-online", "amity-university-online"],
    primaryKeywordCluster: ["online msc", "online msc data science", "online m.sc course", "online msc admission", "online msc fees", "best online msc in india"],
  },

  // ── 10. Online DBA ───────────────────────────────────────────────
  {
    slug: "online-dba",
    title: "Online DBA",
    fullName: "Online Doctor of Business Administration",
    level: "Doctorate",
    duration: "3 Years (Flexible up to 5 Years)",
    eligibility: "Master's degree (MBA, M.Com, M.Tech, MS or equivalent) with minimum 55% marks, along with 3 to 5+ years of managerial or professional work experience.",
    feeRange: "₹3,50,000 – ₹7,50,000",
    emiStarting: "₹11,500/month",
    shortDesc: "The pinnacle of executive leadership education. Earn the prestigious 'Dr.' title while solving real-world business challenges.",
    overview: "The Online Doctor of Business Administration (DBA) is an internationally recognized terminal professional doctorate designed exclusively for senior executives, directors, consultants, and entrepreneurs. Unlike a theoretical PhD, the DBA emphasizes applied business research—empowering leaders to publish papers, synthesize industry innovations, and earn the respected 'Dr.' title while actively leading organizations.",
    whoShouldChoose: [
      "CXOs, VPs, Directors, and Senior Managers seeking the highest academic credential in management",
      "Management consultants and executive advisors wanting global authority and thought leadership standing",
      "Entrepreneurs wanting to conduct research-backed strategic transformations of their enterprises",
      "Senior executives seeking adjunct and visiting professorships at elite business schools worldwide",
    ],
    specializations: ["Global Executive Leadership", "Strategic Innovation & Digital Disruption", "Applied Finance & Corporate Governance", "Supply Chain Transformation", "Healthcare Management & Policy"],
    curriculum: [
      { semester: "Year 1 (Coursework)", subjects: ["Advanced Applied Research Methodologies", "Quantitative & Qualitative Business Analysis", "Literature Review & Theory Development", "Strategic Innovation Frameworks"] },
      { semester: "Year 2 (Proposal & Research)", subjects: ["Doctoral Dissertation Proposal Defense", "Data Collection & Empirical Investigation", "Scholarly Publication Seminar", "Supervised Research Colloquiums"] },
      { semester: "Year 3 (Dissertation & Defense)", subjects: ["Doctoral Thesis Writing", "Peer Review & International Conference Submission", "Final Dissertation Defense before Faculty Board", "Conferment of Doctoral Degree ('Dr.')"] },
    ],
    learningFormat: ["Dedicated 1-on-1 PhD research supervisor guidance", "International executive peer colloquiums", "Self-paced research milestones", "Access to global journal databases (EBSCO, JSTOR, ProQuest)"],
    examMode: "Research Milestone Evaluations and Final Doctoral Dissertation Defense (Virtual / Hybrid).",
    careerOpportunities: "Direct ascension to Boardroom, C-suite (CEO, COO, CFO), Senior Partner at Strategy Consulting firms, and Global Advisory positions.",
    jobRoles: [
      { role: "C-Suite Executive (CEO / COO / Managing Director)", salaryRange: "₹35 – ₹80+ LPA", topIndustries: "Global Corporations, Conglomerates" },
      { role: "Senior Partner / Principal Consultant", salaryRange: "₹28 – ₹60 LPA", topIndustries: "Management Consulting, Advisory" },
      { role: "Professor of Practice / Adjunct Faculty", salaryRange: "₹18 – ₹35 LPA", topIndustries: "Global Business Schools, Universities" },
    ],
    skillsGained: ["Applied Empirical Research", "Executive Board Governance", "Macroeconomic Forecasting", "Academic Publishing", "High-Impact Industry Keynote Speaking"],
    careerProgression: "Senior Manager / Director → Vice President → CXO / Managing Director / Board Advisor (Post-DBA).",
    roiAnalysis: {
      avgInvestment: "₹4,50,000 (Average 3-year total program investment)",
      avgSalaryJump: "₹10,00,000 – ₹25,00,000 executive compensation advancement",
      paybackPeriod: "6 to 9 months post-completion",
      roiVerdict: "Prestigious Life-Long Value. Confers the definitive 'Dr.' title and opens international consulting, board appointments, and C-suite doors worldwide.",
    },
    admissionProcess: ["Step 1: Profile evaluation & research interest discussion with Degree Guru", "Step 2: Submit CV, Master's degree, and preliminary Statement of Purpose (SOP)", "Step 3: University doctoral committee interview", "Step 4: Supervisor allocation and doctoral enrollment"],
    faqs: [
      { question: "Can I legally use the title 'Doctor' (Dr.) after completing an Online DBA?", answer: "Yes! The Doctor of Business Administration is a terminal doctorate degree, granting graduates the full legitimate right to use the title 'Dr.' before their name internationally and professionally." },
      { question: "How does a DBA differ from an academic PhD?", answer: "A traditional PhD is focused on theoretical research and primarily prepares students for full-time university academic careers. A DBA is designed for working executives and focuses on solving practical, high-impact industrial and corporate challenges using applied empirical research." },
    ],
    relatedCourseSlugs: ["online-mba", "online-msc"],
    topUniversitySlugs: ["birchwood-university", "european-institute-of-management-and-technology", "upgrad-executive-programs", "op-jindal-global-university-online"],
    primaryKeywordCluster: ["online dba", "doctor of business administration online", "online dba in india", "executive dba online", "online dba fees", "best online dba"],
  },

  // ── Class 10 & 12 Pathways via BOSSE ─────────────────────────────
  {
    slug: "class-10-12",
    title: "Class 10 & 12 Board (BOSSE)",
    fullName: "Open Schooling Secondary (Class 10) & Senior Secondary (Class 12)",
    level: "Schooling",
    duration: "6 Months to 1 Year (Flexible / On-Demand)",
    eligibility: "Class 10: Age 14+ years with basic literacy. Class 12: Class 10 passed from any recognized board.",
    feeRange: "₹15,000 – ₹32,000 (Complete Board Fee)",
    emiStarting: "₹1,250/month",
    shortDesc: "Complete Class 10 or 12 through the recognized BOSSE Open Board. 100% valid for NEET, JEE, CUET, and all government jobs with on-demand exams.",
    overview: "BOSSE (Board of Open Schooling and Skill Education) is an autonomous open schooling board recognized by the Ministry of Education (MoE), Government of India, and AIU. It provides flexible, accessible secondary (Class 10) and senior secondary (Class 12) education with transfer of credit (TOC) for failed/dropped-out students, sports persons, and working individuals.",
    whoShouldChoose: [
      "Students who failed or dropped out of Class 10 or 12 in CBSE, ICSE, or State Boards needing immediate credit transfer",
      "Competitive exam aspirants (NEET, JEE, CUET, NDA) wanting flexible attendance to focus on coaching",
      "Working candidates needing a valid 10th or 12th pass certificate to qualify for jobs or promotions",
      "Athletes, artists, and overseas students needing flexible on-demand examination dates",
    ],
    specializations: ["Class 10 General", "Class 12 Science (PCM/PCB)", "Class 12 Commerce", "Class 12 Arts / Humanities"],
    curriculum: [
      { semester: "Class 10 Core", subjects: ["English", "Hindi / Regional Language", "Mathematics", "Science & Technology", "Social Science", "Data Entry Operations"] },
      { semester: "Class 12 Science", subjects: ["Physics", "Chemistry", "Mathematics / Biology", "English", "Computer Science"] },
      { semester: "Class 12 Commerce", subjects: ["Accountancy", "Business Studies", "Economics", "English", "Informatics Practices"] },
      { semester: "Class 12 Arts", subjects: ["History", "Political Science", "Geography", "Sociology", "English"] },
    ],
    learningFormat: ["Self-instructional printed textbooks delivered to your doorstep", "E-learning portal with chapter video summaries", "Teacher doubt-clearing sessions", "Previous years' solved question banks"],
    examMode: "Bi-Annual Public Examinations and Flexible On-Demand Examinations at designated centres.",
    careerOpportunities: "Direct admission eligibility into regular and online degree colleges (B.Tech, MBBS, BCA, BBA, BA, B.Com) and qualification for all Central/State Government jobs.",
    jobRoles: [
      { role: "Eligible for Central/State Govt Exams (SSC, Railway, Police, Defense)", salaryRange: "₹3.5 – ₹7.0 LPA", topIndustries: "Government Sector" },
      { role: "Eligible for Higher Education (NEET, JEE, CUET, Degree Programs)", salaryRange: "Foundation for Career", topIndustries: "Medical, Engineering, Commerce" },
    ],
    skillsGained: ["Academic Literacy", "Quantitative Foundation", "Scientific Reasoning", "Language Fluency", "Vocational & Computer Skills"],
    careerProgression: "Secondary Pass (Class 10) → Senior Secondary Pass (Class 12) → Bachelor's Degree Graduate → Professional Career.",
    roiAnalysis: {
      avgInvestment: "₹22,000 (Average complete board fee)",
      avgSalaryJump: "Unlocks formal employment and degree admissions",
      paybackPeriod: "Immediate upon qualifying for jobs",
      roiVerdict: "Invaluable. Saves academic years through Transfer of Credit (TOC) and establishes formal education credentials for life.",
    },
    admissionProcess: [
      "Step 1: Document review & previous mark sheet verification with Degree Guru",
      "Step 2: Stream and subject selection (Science, Commerce, Arts)",
      "Step 3: Transfer of Credit (TOC) application for failed subjects to carry forward pass marks",
      "Step 4: Board enrollment and textbook dispatch",
    ],
    faqs: [
      { question: "Is BOSSE valid for NEET, JEE, and CUET examinations?", answer: "Yes! BOSSE is recognized by the Ministry of Education, Government of India, and is an AIU member. Students passing Class 12 from BOSSE are 100% eligible to sit for NEET, JEE Mains, CUET, NDA, and other national entrance exams." },
      { question: "What is Transfer of Credit (TOC)?", answer: "If you failed in CBSE, ICSE, or any state board, you can transfer pass marks for up to two subjects directly to BOSSE and only need to sit for the remaining subjects, saving an entire academic year." },
    ],
    relatedCourseSlugs: ["online-bca", "online-bba", "online-bcom", "online-ba"],
    topUniversitySlugs: ["bosse-board-of-open-schooling-and-skill-education"],
    primaryKeywordCluster: ["bosse board", "class 10 open schooling", "class 12 open board", "bosse open school admission", "failed class 12 credit transfer", "class 10 12 online admission"],
  },
];

export const getCourseBySlug = (slug: string) => {
  const found = COURSES.find(c => c.slug === slug);
  if (!found) return undefined;
  return {
    ...found,
    shortName: found.title,
    heroDescription: found.shortDesc,
    feesRange: found.feeRange,
    emiFrom: found.emiStarting,
    whatIs: found.overview,
    learningFormat: Array.isArray(found.learningFormat) ? found.learningFormat.join(". ") : found.learningFormat,
    examinationInfo: found.examMode,
    offeringUniversities: found.topUniversitySlugs,
    roiMetrics: {
      averageSalaryJump: found.roiAnalysis.avgSalaryJump,
      estimatedPaybackMonths: found.roiAnalysis.paybackPeriod,
      expectedSalaryRange: found.jobRoles[0]?.salaryRange || "₹6L - ₹18L/year",
    },
    admissionSteps: found.admissionProcess,
    faqs: found.faqs.map(f => ({ q: f.question, a: f.answer })),
    jobRoles: found.jobRoles.map(j => `${j.role} (${j.salaryRange})`),
  };
};

export const CORE_COURSES = COURSES.map(c => ({
  ...c,
  shortName: c.title,
  heroDescription: c.shortDesc,
  feesRange: c.feeRange,
  emiFrom: c.emiStarting,
  whatIs: c.overview,
  learningFormat: Array.isArray(c.learningFormat) ? c.learningFormat.join(". ") : c.learningFormat,
  examinationInfo: c.examMode,
  offeringUniversities: c.topUniversitySlugs,
  roiMetrics: {
    averageSalaryJump: c.roiAnalysis.avgSalaryJump,
    estimatedPaybackMonths: c.roiAnalysis.paybackPeriod,
    expectedSalaryRange: c.jobRoles[0]?.salaryRange || "₹6L - ₹18L/year",
  },
  admissionSteps: c.admissionProcess,
  faqs: c.faqs.map(f => ({ q: f.question, a: f.answer })),
  jobRoles: c.jobRoles.map(j => `${j.role} (${j.salaryRange})`),
}));

export type CourseData = (typeof CORE_COURSES)[0];

export const getAllCourseSlugs = () => COURSES.map(c => c.slug);

