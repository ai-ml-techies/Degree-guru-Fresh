import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Compass,
  GraduationCap,
  Briefcase,
  TrendingUp,
  RotateCcw,
  Target,
  Zap,
  HelpCircle,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { CounselingForm } from "@/components/CounselingForm";
import { COURSES } from "@/data/courses";
import { UNIVERSITIES } from "@/data/universities";

// ── 8 High-Signal, Punchy Questions ──────────────────────────────────
interface SimpleQuestion {
  id: string;
  category: string;
  question: string;
  subtitle?: string;
  options: {
    label: string;
    description?: string;
    archetypeTag: string;
    careerFit: string;
    strength: string;
    degreeHint?: string;
  }[];
}

const QUESTIONS: SimpleQuestion[] = [
  {
    id: "stage",
    category: "Where you are today",
    question: "Where are you in your career journey right now?",
    options: [
      { label: "Working Professional", description: "Employed and looking for faster promotion or salary jump", archetypeTag: "Builder", careerFit: "Management", strength: "execution", degreeHint: "online-mba" },
      { label: "College / Fresh Graduate", description: "Recently completed or in final year of bachelor's", archetypeTag: "Explorer", careerFit: "Tech", strength: "learning_agility", degreeHint: "online-mca" },
      { label: "Class 10 or 12 Student", description: "Planning for college degrees or board completion", archetypeTag: "Operator", careerFit: "Foundational", strength: "initiative", degreeHint: "online-bba" },
      { label: "Looking for a Job / Switching Fields", description: "Ready to transition into high-growth business or technology", archetypeTag: "Driver", careerFit: "Growth", strength: "adaptability", degreeHint: "online-mba" },
    ],
  },
  {
    id: "interest",
    category: "What energizes you",
    question: "Which type of problem would you naturally prefer to solve?",
    options: [
      { label: "Strategy & Commercial Growth", description: "Launching new initiatives, closing deals, and driving business results", archetypeTag: "Driver", careerFit: "Brand & Marketing Management", strength: "leadership", degreeHint: "online-mba" },
      { label: "Data, Logic & Analytics", description: "Digging into numbers, spotting patterns, and finding why systems break", archetypeTag: "Solver", careerFit: "Business & Data Analytics", strength: "analytical_thinking", degreeHint: "online-mba" },
      { label: "Technology & Software Building", description: "Writing code, architecting software, and creating digital products", archetypeTag: "Builder", careerFit: "Full-Stack Software Engineering", strength: "problem_solving", degreeHint: "online-mca" },
      { label: "People, Mentorship & Talent", description: "Hiring great people, guiding teams, and building high-trust culture", archetypeTag: "Leader", careerFit: "People & Talent Management (HR)", strength: "communication", degreeHint: "online-mba" },
    ],
  },
  {
    id: "strength",
    category: "Your natural strength",
    question: "What do colleagues or friends praise you for most?",
    options: [
      { label: "Clear Thinking & Problem Solving", description: "Breaking down messy situations into practical steps", archetypeTag: "Solver", careerFit: "Product Management", strength: "problem_solving" },
      { label: "Creative Ideas & Storytelling", description: "Finding fresh angles, convincing people, and communicating vision", archetypeTag: "Driver", careerFit: "Brand & Marketing Management", strength: "creativity" },
      { label: "Discipline, Organisation & Follow-Through", description: "Ensuring zero mistakes, systematic tracking, and dependable execution", archetypeTag: "Operator", careerFit: "Operations & Supply Chain", strength: "organisation" },
      { label: "Quick Learning & High Adaptability", description: "Picking up new tools and concepts faster than average", archetypeTag: "Builder", careerFit: "Business & Data Analytics", strength: "learning_agility" },
    ],
  },
  {
    id: "work_style",
    category: "How you work best",
    question: "In what work environment do you perform at your peak?",
    options: [
      { label: "Autonomous Ownership", description: "Given clear targets and full freedom to decide how to deliver", archetypeTag: "Driver", careerFit: "Product Management", strength: "initiative" },
      { label: "Deep Focused Solo Work", description: "Uninterrupted blocks of time to solve tough technical or analytical challenges", archetypeTag: "Solver", careerFit: "Full-Stack Software Engineering", strength: "analytical_thinking" },
      { label: "Dynamic & Collaborative Team", description: "Brainstorming with colleagues, active client interactions, and teamwork", archetypeTag: "Leader", careerFit: "People & Talent Management (HR)", strength: "relationship_building" },
      { label: "Structured & Systematic Operations", description: "Well-defined guidelines, predictable processes, and high operational rigor", archetypeTag: "Operator", careerFit: "Operations & Supply Chain", strength: "attention_to_detail" },
    ],
  },
  {
    id: "priority_value",
    category: "What matters most",
    question: "What is your #1 priority for your career over the next 2 years?",
    options: [
      { label: "Steep Salary Growth & High Income", description: "Maximizing market compensation and high-paying roles", archetypeTag: "Driver", careerFit: "Product Management", strength: "initiative", degreeHint: "online-mba" },
      { label: "Fast Promotion into Leadership", description: "Moving from individual contributor to team manager / executive", archetypeTag: "Leader", careerFit: "Brand & Marketing Management", strength: "leadership", degreeHint: "online-mba" },
      { label: "Technical Mastery & Deep Skills", description: "Becoming an indispensable specialist in high-demand tools", archetypeTag: "Builder", careerFit: "Full-Stack Software Engineering", strength: "learning_agility", degreeHint: "online-mca" },
      { label: "Job Security & Work-Life Balance", description: "Sustainable working hours with a stable, recognized employer", archetypeTag: "Operator", careerFit: "Operations & Supply Chain", strength: "organisation", degreeHint: "online-mba" },
    ],
  },
  {
    id: "challenge",
    category: "Your main challenge",
    question: "What is currently holding you back the most?",
    options: [
      { label: "Lack of Direction", description: "I have skills, but I'm confused about which career path has highest growth", archetypeTag: "Explorer", careerFit: "Product Management", strength: "problem_solving" },
      { label: "Need a Recognized Degree", description: "I need an accredited UGC degree (like MBA or MCA) to qualify for promotions", archetypeTag: "Builder", careerFit: "Brand & Marketing Management", strength: "initiative", degreeHint: "online-mba" },
      { label: "Missing In-Demand Practical Skills", description: "I know the theory, but I need real-world projects and portfolio proof", archetypeTag: "Solver", careerFit: "Business & Data Analytics", strength: "learning_agility" },
      { label: "Difficulty Switching Domains", description: "Want to transition to tech or business but worried about experience gap", archetypeTag: "Driver", careerFit: "Product Management", strength: "adaptability", degreeHint: "online-mba" },
    ],
  },
  {
    id: "decision",
    category: "Next step commitment",
    question: "How would you ideally like to make your next career leap?",
    options: [
      { label: "Flexible Online Degree while Continuing Work", description: "Earn full monthly salary while studying on weekends with 0% EMI", archetypeTag: "Builder", careerFit: "Product Management", strength: "execution", degreeHint: "online-mba" },
      { label: "Hands-on Practical Upskilling & Projects", description: "Build 2–3 portfolio projects to prove immediate value to recruiters", archetypeTag: "Solver", careerFit: "Full-Stack Software Engineering", strength: "problem_solving" },
      { label: "Career Counseling & Mentorship", description: "Get 1-on-1 personalized guidance from an expert counselor first", archetypeTag: "Leader", careerFit: "People & Talent Management (HR)", strength: "communication" },
      { label: "Direct Job Applications & Resume Optimization", description: "Upgrade to ATS-compliant resume and start interviewing right away", archetypeTag: "Driver", careerFit: "Brand & Marketing Management", strength: "initiative" },
    ],
  },
];

// Result Archetypes definition
interface ArchetypeResult {
  title: string;
  tagline: string;
  summary: string;
  topCareers: {
    title: string;
    cluster: string;
    fit: number;
    why: string[];
    courseSlug: string;
  }[];
  strengths: string[];
  growthArea: {
    title: string;
    nextStep: string;
  };
  recommendedDegree: {
    title: string;
    slug: string;
    reason: string;
    emi: string;
  };
  roadmap: {
    step: string;
    action: string;
  }[];
}

const ARCHETYPES: Record<string, ArchetypeResult> = {
  Driver: {
    title: "Strategic Growth Driver",
    tagline: "High initiative, commercial acumen, and momentum",
    summary: "You naturally connect big-picture strategy with execution. You thrive when given ownership to drive business growth and measurable outcomes.",
    topCareers: [
      {
        title: "Product Management",
        cluster: "Product & Technology",
        fit: 94,
        why: ["High ownership mindset", "Balancing business goals with user needs", "Strategic decision-making"],
        courseSlug: "online-mba"
      },
      {
        title: "Brand & Marketing Management",
        cluster: "Marketing & Growth",
        fit: 90,
        why: ["Strong persuasive communication", "Campaign execution and customer acquisition", "Revenue focus"],
        courseSlug: "online-mba"
      },
      {
        title: "Business & Data Analytics",
        cluster: "Analytics & Strategy",
        fit: 86,
        why: ["Data-backed decisions", "Spotting commercial opportunities", "High market demand"],
        courseSlug: "online-mba"
      }
    ],
    strengths: ["Strategic Thinking", "Initiative & Ownership", "Persuasive Communication"],
    growthArea: {
      title: "Executive Storytelling",
      nextStep: "Practice distilling data into concise 3-bullet decision memos for senior leadership."
    },
    recommendedDegree: {
      title: "Online MBA (Business Analytics or Marketing)",
      slug: "online-mba",
      reason: "Provides the recognized UGC-DEB master's credential needed to fast-track into managerial and leadership bands without quitting your job.",
      emi: "Starting from ₹3,950/mo"
    },
    roadmap: [
      { step: "01", action: "Lock in your target role (Product or Marketing Management)" },
      { step: "02", action: "Build 1 practical portfolio case study solving a real business problem" },
      { step: "03", action: "Enroll in an accredited Online MBA with flexible weekend masterclasses" },
      { step: "04", action: "Reposition your ATS resume and target ₹12–18 LPA managerial roles" }
    ]
  },
  Solver: {
    title: "Analytical Problem Solver",
    tagline: "Logical diagnostics, data rigor, and structured clarity",
    summary: "You cut through ambiguity with logic and data. You excel at diagnosing bottlenecks, uncovering insights, and building mistake-proof solutions.",
    topCareers: [
      {
        title: "Business & Data Analytics",
        cluster: "Data & Strategy",
        fit: 95,
        why: ["Strong logical reasoning", "Translating numbers into strategic insights", "Rapid industry growth"],
        courseSlug: "online-mba"
      },
      {
        title: "Full-Stack Software Engineering",
        cluster: "Software & Technology",
        fit: 89,
        why: ["Systematic debugging ability", "Architectural problem solving", "High remote salary potential"],
        courseSlug: "online-mca"
      },
      {
        title: "Product Management",
        cluster: "Product & Technology",
        fit: 87,
        why: ["Metrics-driven roadmapping", "Data experimentation (A/B testing)", "Root-cause diagnostics"],
        courseSlug: "online-mba"
      }
    ],
    strengths: ["Analytical Thinking", "Structured Problem Solving", "Attention to Detail"],
    growthArea: {
      title: "Non-Technical Stakeholder Communication",
      nextStep: "Translate technical findings into clear business outcomes without heavy jargon."
    },
    recommendedDegree: {
      title: "Online MCA or Online MBA in Data Analytics",
      slug: "online-mca",
      reason: "Unlocks top-tier technology and analytics positions with UGC-DEB recognized degree credentials.",
      emi: "Starting from ₹3,250/mo"
    },
    roadmap: [
      { step: "01", action: "Master core analytical tools: SQL, Power BI, and Python fundamentals" },
      { step: "02", action: "Publish 2 interactive data dashboards on GitHub or LinkedIn" },
      { step: "03", action: "Select an accredited Online MCA or MBA Data Science degree" },
      { step: "04", action: "Apply to analytics roles with verified case studies" }
    ]
  },
  Builder: {
    title: "Modern Technical Builder",
    tagline: "Hands-on execution, practical technology, and tangible systems",
    summary: "You prefer building real things over endless debates. You are energized by modern technologies, working software, and practical implementation.",
    topCareers: [
      {
        title: "Full-Stack Software Engineering",
        cluster: "Software & Cloud",
        fit: 96,
        why: ["Direct coding & architecture focus", "High technical autonomy", "Fast-growing compensation"],
        courseSlug: "online-mca"
      },
      {
        title: "Business & Data Analytics",
        cluster: "Data & Systems",
        fit: 88,
        why: ["Database architecture", "Practical query pipelines", "High demand in tech firms"],
        courseSlug: "online-mba"
      },
      {
        title: "Product Management",
        cluster: "Product & Engineering",
        fit: 85,
        why: ["Technical bridge to business", "Sprint execution", "Feature prioritization"],
        courseSlug: "online-mba"
      }
    ],
    strengths: ["Rapid Learning Agility", "Practical Execution", "Technical Problem Solving"],
    growthArea: {
      title: "Business & Commercial Context",
      nextStep: "Understand how software decisions impact revenue, customer retention, and costs."
    },
    recommendedDegree: {
      title: "Online MCA / Online BCA",
      slug: "online-mca",
      reason: "Gives you the formal IT degree required for software engineering campus and MNC hiring drives without leaving your job.",
      emi: "Starting from ₹2,650/mo"
    },
    roadmap: [
      { step: "01", action: "Solidify core programming proficiencies (Full Stack / Cloud)" },
      { step: "02", action: "Build 2 deployed full-stack web applications" },
      { step: "03", action: "Secure your formal UGC-entitled Online MCA or BCA degree" },
      { step: "04", action: "Target high-paying software developer and engineering positions" }
    ]
  },
  Leader: {
    title: "People & Talent Leader",
    tagline: "Empathetic alignment, team culture, and organizational impact",
    summary: "You achieve results through people. You have strong emotional intelligence, build mutual trust easily, and inspire teams toward shared goals.",
    topCareers: [
      {
        title: "People & Talent Management (HR)",
        cluster: "Human Resources & Talent",
        fit: 95,
        why: ["High empathy and team rapport", "Hiring and culture leadership", "Strategic HR partnering"],
        courseSlug: "online-mba"
      },
      {
        title: "Brand & Marketing Management",
        cluster: "Marketing & Strategy",
        fit: 88,
        why: ["Deep customer empathy", "Storytelling and communication", "Creative campaign leadership"],
        courseSlug: "online-mba"
      },
      {
        title: "Operations & Supply Chain",
        cluster: "Operations & People",
        fit: 84,
        why: ["Managing cross-functional teams", "Vendor coordination", "Process consistency"],
        courseSlug: "online-mba"
      }
    ],
    strengths: ["Communication", "Relationship Building", "Team Leadership"],
    growthArea: {
      title: "Data-Driven HR & People Analytics",
      nextStep: "Learn to use metrics (retention, eNPS, CAC per hire) to support talent decisions."
    },
    recommendedDegree: {
      title: "Online MBA (HR Management / General Management)",
      slug: "online-mba",
      reason: "Accelerates your progression toward HR Business Partner (HRBP), Talent Lead, and CHRO leadership roles.",
      emi: "Starting from ₹3,850/mo"
    },
    roadmap: [
      { step: "01", action: "Familiarize yourself with modern People Analytics and talent frameworks" },
      { step: "02", action: "Lead a key talent acquisition or employee initiative in your current role" },
      { step: "03", action: "Enroll in an accredited Online MBA in HR Management" },
      { step: "04", action: "Step into senior HRBP and talent leadership roles" }
    ]
  },
  Operator: {
    title: "Organised Operations Specialist",
    tagline: "Airtight execution, systematic scale, and operational clarity",
    summary: "You turn high-level plans into reliable reality. You bring order to chaos, uphold quality standards, and eliminate costly operational mistakes.",
    topCareers: [
      {
        title: "Operations & Supply Chain",
        cluster: "Operations & Logistics",
        fit: 95,
        why: ["High attention to detail", "Systematic workflow tracking", "Ensuring dependable deliverables"],
        courseSlug: "online-mba"
      },
      {
        title: "Business & Data Analytics",
        cluster: "Data & Operations",
        fit: 89,
        why: ["Process tracking metrics", "Optimizing operational efficiency", "Reporting consistency"],
        courseSlug: "online-mba"
      },
      {
        title: "Brand & Marketing Management",
        cluster: "Marketing Operations",
        fit: 83,
        why: ["Campaign timelines and budgets", "Agency management", "Execution discipline"],
        courseSlug: "online-mba"
      }
    ],
    strengths: ["Organisation", "Attention to Detail", "Reliable Execution"],
    growthArea: {
      title: "Embracing Fluidity & Rapid Pivots",
      nextStep: "Practice rapid prototyping and testing early versions before waiting for 100% perfection."
    },
    recommendedDegree: {
      title: "Online MBA (Operations & Supply Chain)",
      slug: "online-mba",
      reason: "Validates your operational expertise and qualifies you for senior supply chain and operations director roles.",
      emi: "Starting from ₹3,500/mo"
    },
    roadmap: [
      { step: "01", action: "Implement standard operating workflows and Agile tracking in current projects" },
      { step: "02", action: "Quantify efficiency gains (e.g. reduced turnaround time by 30%)" },
      { step: "03", action: "Pursue an Online MBA in Operations / Supply Chain" },
      { step: "04", action: "Advance to Operations Lead, Plant Manager, or Logistics Director" }
    ]
  }
};

export const KnowYourself = () => {
  const [view, setView] = useState<"intro" | "quiz" | "result">("intro");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [counselingOpen, setCounselingOpen] = useState(false);

  // Result state
  const [resultArchetype, setResultArchetype] = useState<ArchetypeResult>(ARCHETYPES.Driver);

  // Load saved result if any
  useEffect(() => {
    try {
      const saved = localStorage.getItem("dg_clean_archetype");
      if (saved && ARCHETYPES[saved]) {
        setResultArchetype(ARCHETYPES[saved]);
      }
    } catch {
      // ignore
    }
  }, []);

  const currentQ = QUESTIONS[currentIndex];
  const totalQ = QUESTIONS.length;

  const handleSelectOption = (optIndex: number) => {
    const updated = { ...selectedAnswers, [currentQ.id]: optIndex };
    setSelectedAnswers(updated);

    // Auto-advance after smooth tactile tap
    setTimeout(() => {
      if (currentIndex < totalQ - 1) {
        setCurrentIndex((prev) => prev + 1);
        window.scrollTo({ top: 120, behavior: "smooth" });
      } else {
        // Calculate result
        const archetypeCounts: Record<string, number> = { Driver: 0, Solver: 0, Builder: 0, Leader: 0, Operator: 0 };
        for (const [qId, ansIdx] of Object.entries(updated)) {
          const qObj = QUESTIONS.find((q) => q.id === qId);
          if (qObj && qObj.options[ansIdx]) {
            const tag = qObj.options[ansIdx].archetypeTag;
            archetypeCounts[tag] = (archetypeCounts[tag] || 0) + 1;
          }
        }
        const dominant = Object.entries(archetypeCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "Driver";
        const finalResult = ARCHETYPES[dominant] || ARCHETYPES.Driver;
        setResultArchetype(finalResult);
        localStorage.setItem("dg_clean_archetype", dominant);
        setView("result");
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }, 220);
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    } else {
      setView("intro");
    }
  };

  const handleRestart = () => {
    setSelectedAnswers({});
    setCurrentIndex(0);
    setView("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Find partner universities for the recommended degree
  const matchedCourse = COURSES.find((c) => c.slug === resultArchetype.recommendedDegree.slug) || COURSES[0];
  const topPartnerUnis = UNIVERSITIES.filter(
    (u) => u.category === "online" && matchedCourse.topUniversitySlugs.includes(u.slug)
  ).slice(0, 3);

  return (
    <>
      <Helmet>
        <title>Know Yourself — Simple Career Discovery & Roadmap | Degree Guru</title>
        <meta
          name="description"
          content="Understand yourself. Discover your direction. Know your next move. A clean, minimal, 5-minute career assessment and personalized roadmap by Degree Guru."
        />
        <link rel="canonical" href="https://degreeguru.in/know-yourself" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground flex flex-col font-sans">
        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 1. INTRO VIEW (Clean, Minimal, On-Point)                         */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {view === "intro" && (
          <div className="flex-1 flex flex-col justify-center py-16 md:py-24">
            <div className="container-dg max-w-2xl text-center space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                <Sparkles size={14} />
                <span>Career Discovery • 100% Free</span>
              </div>

              <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-foreground leading-[1.2]">
                Know Yourself.
              </h1>

              <p className="text-lg sm:text-xl font-medium text-foreground/90 max-w-lg mx-auto leading-snug">
                Understand your strengths, discover suitable career directions, and know your next move.
              </p>

              <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                A simple 5-minute assessment designed for Indian students and working professionals.
                No tests, no exams, no clutter.
              </p>

              {/* Direct CTA */}
              <div className="pt-2">
                <Button
                  size="lg"
                  onClick={() => {
                    setCurrentIndex(0);
                    setView("quiz");
                  }}
                  className="px-8 py-6 rounded-2xl bg-primary text-primary-foreground font-bold text-base shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all inline-flex items-center gap-2"
                >
                  <span>Start Assessment</span>
                  <ArrowRight size={17} />
                </Button>
              </div>

              <div className="flex items-center justify-center gap-6 text-xs text-muted-foreground pt-4 font-medium">
                <span>Free forever</span>
                <span>•</span>
                <span>7 Simple Questions</span>
                <span>•</span>
                <span>Personalized Roadmap</span>
              </div>
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 2. QUIZ FLOW (Simple Card Questions, Minimal & On-Point)           */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {view === "quiz" && currentQ && (
          <div className="flex-1 flex flex-col justify-between py-8 px-4 max-w-xl mx-auto w-full">
            {/* Top Navigation & Minimal Progress */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs font-semibold">
                <button
                  type="button"
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <span className="text-primary font-bold">
                  Question {currentIndex + 1} of {totalQ}
                </span>
              </div>

              {/* Thin progress bar */}
              <div className="w-full bg-muted/60 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${Math.round(((currentIndex + 1) / totalQ) * 100)}%` }}
                />
              </div>
            </div>

            {/* Question Title & Cards */}
            <div className="space-y-4 my-auto py-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-primary/80 block">
                {currentQ.category}
              </span>

              <h2 className="text-2xl sm:text-3xl font-bold text-foreground leading-snug tracking-tight">
                {currentQ.question}
              </h2>

              {currentQ.subtitle && (
                <p className="text-sm text-muted-foreground">{currentQ.subtitle}</p>
              )}

              {/* Minimal Option Cards */}
              <div className="space-y-3 pt-3">
                {currentQ.options.map((opt, idx) => {
                  const isSelected = selectedAnswers[currentQ.id] === idx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-150 flex items-start gap-3.5 group ${
                        isSelected
                          ? "bg-primary/10 border-primary ring-1 ring-primary shadow-sm"
                          : "bg-card border-border/70 hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full shrink-0 flex items-center justify-center mt-0.5 border transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30 group-hover:border-primary/60"
                        }`}
                      >
                        {isSelected && <Check size={12} className="stroke-[3]" />}
                      </div>

                      <div className="space-y-0.5">
                        <div className={`text-sm sm:text-base font-semibold ${isSelected ? "text-primary font-bold" : "text-foreground"}`}>
                          {opt.label}
                        </div>
                        {opt.description && (
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer tip */}
            <div className="pt-6 text-center text-xs text-muted-foreground">
              Select the option that feels most natural to you.
            </div>
          </div>
        )}

        {/* ───────────────────────────────────────────────────────────────── */}
        {/* 3. RESULT VIEW (Clean, Direct, Meaningful, No Bloat)              */}
        {/* ───────────────────────────────────────────────────────────────── */}
        {view === "result" && (
          <div className="flex-1 py-10">
            <div className="container-dg max-w-3xl space-y-8">
              {/* Archetype Header */}
              <div className="p-6 sm:p-8 rounded-3xl bg-card border border-primary/25 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
                    Your Career Profile
                  </span>
                  <button
                    type="button"
                    onClick={handleRestart}
                    className="text-xs text-muted-foreground hover:text-foreground font-semibold inline-flex items-center gap-1"
                  >
                    <RotateCcw size={13} /> Retake
                  </button>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                  {resultArchetype.title}
                </h1>

                <p className="text-sm font-semibold text-primary/90">
                  "{resultArchetype.tagline}"
                </p>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  {resultArchetype.summary}
                </p>
              </div>

              {/* Top 3 Careers Worth Exploring */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Briefcase size={18} className="text-primary" />
                  <span>Careers Worth Exploring</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {resultArchetype.topCareers.map((c, i) => (
                    <div key={i} className="p-5 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-primary">
                            {c.cluster}
                          </span>
                          <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                            {c.fit}% Fit
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-foreground leading-snug">{c.title}</h3>
                        <ul className="space-y-1 text-xs text-muted-foreground pt-1">
                          {c.why.map((w, wIdx) => (
                            <li key={wIdx} className="flex items-start gap-1.5">
                              <span className="text-primary font-bold">•</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <Link
                        to={`/programs/${c.courseSlug}`}
                        className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 pt-2"
                      >
                        Explore Degree Path <ArrowRight size={12} />
                      </Link>
                    </div>
                  ))}
                </div>
              </div>

              {/* Core Strengths & 1 Growth Area */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm space-y-3">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <CheckCircle2 size={16} className="text-emerald-500" />
                    <span>Your Top Strengths</span>
                  </h3>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {resultArchetype.strengths.map((str, idx) => (
                      <span key={idx} className="px-3 py-1.5 rounded-xl bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                        {str}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="p-6 rounded-2xl bg-card border border-border/70 shadow-sm space-y-2">
                  <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                    <Zap size={16} className="text-amber-500" />
                    <span>Area to Expand</span>
                  </h3>
                  <div className="text-xs font-bold text-foreground">{resultArchetype.growthArea.title}</div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {resultArchetype.growthArea.nextStep}
                  </p>
                </div>
              </div>

              {/* Recommended Education Path */}
              <div className="p-6 sm:p-7 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/25 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary block">
                      Recommended Education Path
                    </span>
                    <h3 className="text-xl font-extrabold text-foreground mt-0.5">
                      {resultArchetype.recommendedDegree.title}
                    </h3>
                  </div>

                  <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10 w-fit">
                    {resultArchetype.recommendedDegree.emi}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {resultArchetype.recommendedDegree.reason}
                </p>

                {/* Top 3 Universities */}
                <div className="pt-2 border-t border-border/40 space-y-2">
                  <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide block">
                    Top UGC-DEB Entitled Universities:
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {topPartnerUnis.map((uni) => (
                      <Link
                        key={uni.id}
                        to={`/universities/${uni.slug}`}
                        className="p-3 rounded-xl bg-card border border-border/70 hover:border-primary/40 text-xs font-semibold transition-colors flex items-center justify-between"
                      >
                        <span className="truncate pr-2">{uni.shortName}</span>
                        <ArrowRight size={12} className="text-primary shrink-0" />
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              {/* Simple 4-Step Roadmap */}
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                  <Target size={18} className="text-primary" />
                  <span>Your Next Move (4-Step Path)</span>
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {resultArchetype.roadmap.map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-card border border-border/70 flex items-start gap-3">
                      <div className="w-7 h-7 rounded-xl bg-primary text-primary-foreground font-bold text-xs flex items-center justify-center shrink-0">
                        {st.step}
                      </div>
                      <p className="text-xs font-medium text-foreground leading-relaxed pt-1">
                        {st.action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Direct Actions Banner */}
              <div className="p-6 sm:p-8 rounded-3xl bg-primary text-primary-foreground flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-primary/20">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-white">Need Free Guidance on Universities & Fees?</h3>
                  <p className="text-xs text-white/85">Talk to an academic counselor at no cost.</p>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => setCounselingOpen(true)}
                    className="w-full sm:w-auto px-6 py-5 rounded-xl bg-white text-primary font-bold text-xs hover:bg-white/90 shadow"
                  >
                    Talk to a Counselor
                  </Button>
                </div>
              </div>

              <div className="text-center pt-2">
                <p className="text-[11px] text-muted-foreground">
                  Career discovery guidance based on self-reported inputs. Not a clinical diagnosis.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Counseling Modal */}
      <Dialog open={counselingOpen} onOpenChange={setCounselingOpen}>
        <DialogContent className="max-w-md p-0 border-0 bg-transparent shadow-none">
          <CounselingForm
            variant="card"
            title="Free Academic Counseling"
            subtitle="Get unbiased advice on UGC-approved online degrees, eligibility and fee structures"
            onSuccess={() => setCounselingOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KnowYourself;
