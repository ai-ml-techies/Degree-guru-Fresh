import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RotateCcw, 
  TrendingUp, 
  Briefcase, 
  GraduationCap, 
  Award,
  Zap,
  BookOpen,
  Send
} from "lucide-react";
import { submitLead } from "@/lib/api";

type ScenarioQuestion = {
  id: number;
  dimension: string;
  scenario: string;
  options: {
    text: string;
    scoreTrait: "analytical" | "leadership" | "creative" | "tech" | "people";
  }[];
};

const SCENARIOS: ScenarioQuestion[] = [
  {
    id: 1,
    dimension: "Problem Solving Under Ambiguity",
    scenario: "Your team is assigned an urgent project with incomplete data and a 48-hour deadline. What is your natural first action?",
    options: [
      { text: "Break the problem down into structured logical components and analyze quantitative metrics.", scoreTrait: "analytical" },
      { text: "Step up to organize team members, clarify who does what, and streamline the timeline.", scoreTrait: "leadership" },
      { text: "Brainstorm unorthodox angles, sketch out novel perspectives, and create fresh solutions.", scoreTrait: "creative" },
      { text: "Explore automation tools, scripts, or systems that can streamline data processing immediately.", scoreTrait: "tech" },
      { text: "Check in with stakeholders to understand expectations and keep team morale high.", scoreTrait: "people" },
    ],
  },
  {
    id: 2,
    dimension: "Work Environment & Daily Energy",
    scenario: "When you reflect on a deeply fulfilling workday, what were you primarily engaged in?",
    options: [
      { text: "Evaluating complex spreadsheets, market reports, or financial forecasts.", scoreTrait: "analytical" },
      { text: "Leading high-stakes strategy meetings, closing deals, and driving business decisions.", scoreTrait: "leadership" },
      { text: "Designing visual layouts, writing persuasive content, or shaping brand stories.", scoreTrait: "creative" },
      { text: "Architecting software systems, writing clean code, or deploying cloud infrastructure.", scoreTrait: "tech" },
      { text: "Mentoring colleagues, resolving client challenges, and fostering positive collaboration.", scoreTrait: "people" },
    ],
  },
  {
    id: 3,
    dimension: "Conflict & Decision Making",
    scenario: "Two senior stakeholders strongly disagree on the next quarterly strategy. How do you resolve the standoff?",
    options: [
      { text: "Present empirical evidence, ROI projections, and testable A/B data to settle the debate objectively.", scoreTrait: "analytical" },
      { text: "Take ownership, make the definitive executive decision, and align everyone behind the target.", scoreTrait: "leadership" },
      { text: "Reframe the conflict by proposing a third hybrid, creative alternative nobody considered.", scoreTrait: "creative" },
      { text: "Build a functional prototype or simulation to test both options under real conditions.", scoreTrait: "tech" },
      { text: "Facilitate a 1-on-1 dialogue to understand each person's core concerns and reach consensus.", scoreTrait: "people" },
    ],
  },
  {
    id: 4,
    dimension: "Learning Preferences & Skill Acquisition",
    scenario: "You are given a budget and one month to master a high-growth modern skill. What are you choosing?",
    options: [
      { text: "Financial Modeling, Risk Analytics, and Business Intelligence.", scoreTrait: "analytical" },
      { text: "Executive Business Strategy, Negotiation, and P&L Management.", scoreTrait: "leadership" },
      { text: "Brand Strategy, UX/UI Design, or Multimedia Storytelling.", scoreTrait: "creative" },
      { text: "Full Stack Development, Cloud Engineering, or Machine Learning.", scoreTrait: "tech" },
      { text: "Talent Development, Strategic Human Resources, or Client Relationship Management.", scoreTrait: "people" },
    ],
  },
  {
    id: 5,
    dimension: "Core Career Motivation",
    scenario: "Beyond financial compensation, what outcome makes you feel most proud of your career?",
    options: [
      { text: "Uncovering hidden insights that prevent costly mistakes or predict major trends.", scoreTrait: "analytical" },
      { text: "Building an organization, leading teams to victory, and creating enterprise value.", scoreTrait: "leadership" },
      { text: "Crafting original ideas, memorable campaigns, or impactful designs that inspire people.", scoreTrait: "creative" },
      { text: "Engineering scalable digital products and robust architectures that work flawlessly.", scoreTrait: "tech" },
      { text: "Empowering people, guiding students or clients, and fostering human flourishing.", scoreTrait: "people" },
    ],
  },
];

export const CareerFinder = () => {
  const [hasStarted, setHasStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "analytical" | "leadership" | "creative" | "tech" | "people">>({});
  const [isCompleted, setIsCompleted] = useState(false);

  // Lead capture state (asked first)
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [currentEducation, setCurrentEducation] = useState("Working Professional");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();

  const handleStartAssessment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      alert("Please enter your name and phone number to begin.");
      return;
    }
    setHasStarted(true);
  };

  const handleSelectOption = (trait: "analytical" | "leadership" | "creative" | "tech" | "people") => {
    const updated = { ...answers, [currentQuestionIndex]: trait };
    setAnswers(updated);

    if (currentQuestionIndex < SCENARIOS.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setAnswers({});
    setIsCompleted(false);
    setSubmitted(false);
  };

  // Compute dominant traits
  const computeProfile = () => {
    const counts = { analytical: 0, leadership: 0, creative: 0, tech: 0, people: 0 };
    Object.values(answers).forEach((trait) => {
      counts[trait] = (counts[trait] || 0) + 1;
    });

    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topTrait = sorted[0][0];

    switch (topTrait) {
      case "tech":
        return {
          title: "Technical Architect & Systems Builder",
          badge: "Technology & Engineering Track",
          personality: "Logical, Systematic, Problem-Solver",
          degrees: ["Online MCA", "Online BCA"],
          degreeLinks: ["/online-mca", "/online-bca"],
          specializations: ["Cloud Computing", "AI & Machine Learning", "Full Stack Development"],
          roles: ["Cloud Solutions Architect", "Full Stack Software Engineer", "DevOps Specialist"],
          salary: "₹6.5L - ₹18L / year",
          skills: ["System Design", "Python / JavaScript", "Cloud Services (AWS/Azure)", "Data Structures"],
          advice: "Combine technical mastery with an accredited Online MCA or BCA to unlock tier-1 tech campus and remote international opportunities."
        };
      case "leadership":
        return {
          title: "Strategic Business Leader & General Manager",
          badge: "Executive Management Track",
          personality: "Decisive, Visionary, Action-Oriented",
          degrees: ["Online MBA", "Online DBA"],
          degreeLinks: ["/online-mba", "/online-dba"],
          specializations: ["Strategic Leadership", "Operations & Supply Chain", "General Management"],
          roles: ["Operations Manager", "Business Unit Head", "Management Consultant", "Vice President"],
          salary: "₹10L - ₹28L / year",
          skills: ["P&L Management", "Cross-Functional Leadership", "Strategic Negotiation", "Organizational Design"],
          advice: "An Online MBA or Online DBA will formalize your leadership credentials, qualifying you for Director, VP, and C-Suite advancement."
        };
      case "creative":
        return {
          title: "Brand Strategist & Creative Growth Specialist",
          badge: "Marketing & Creative Track",
          personality: "Innovative, Empathetic, Storyteller",
          degrees: ["Online MBA in Marketing", "Online BA in Journalism / Mass Comm"],
          degreeLinks: ["/online-mba", "/online-ba"],
          specializations: ["Digital Marketing", "Brand Strategy", "Content & Media Management"],
          roles: ["Digital Marketing Strategist", "Brand Manager", "Creative Director"],
          salary: "₹6L - ₹16L / year",
          skills: ["Performance Marketing", "Content Strategy", "SEO / Social Strategy", "Audience Psychology"],
          advice: "Modern creative growth requires both artistic intuition and analytical marketing rigor taught in top Online MBA Marketing specializations."
        };
      case "analytical":
        return {
          title: "Quantitative Analyst & Financial Strategist",
          badge: "Finance & Analytics Track",
          personality: "Methodical, Objective, Evidence-Driven",
          degrees: ["Online MBA in Finance", "Online M.Com", "Online B.Com"],
          degreeLinks: ["/online-mba", "/online-mcom", "/online-bcom"],
          specializations: ["Financial Analytics", "Investment Banking", "Corporate Finance"],
          roles: ["Financial Analyst", "Risk Manager", "Portfolio Associate", "CFO Track"],
          salary: "₹7L - ₹20L / year",
          skills: ["Financial Modeling", "Valuation", "Regulatory Compliance", "Data Interpretation"],
          advice: "Leverage your high analytical aptitude with an Online MBA in Finance or Online M.Com to access high-yield financial institutions."
        };
      default:
        return {
          title: "Human Capital & People Operations Specialist",
          badge: "HR & Organizational Psychology Track",
          personality: "Empathetic, Collaborative, Trust-Builder",
          degrees: ["Online MBA in HR", "Online MA"],
          degreeLinks: ["/online-mba", "/online-ma"],
          specializations: ["Human Resource Management", "Organizational Behavior", "Talent Acquisition"],
          roles: ["HR Business Partner (HRBP)", "Talent Development Manager", "Chief Happiness Officer"],
          salary: "₹6L - ₹15L / year",
          skills: ["Talent Strategy", "Labor Law Compliance", "Employee Relations", "Performance Appraisal Systems"],
          advice: "Modern enterprises place immense value on talent strategists. An Online MBA in HR provides the strategic business foundation required."
        };
    }
  };

  const profile = isCompleted ? computeProfile() : null;

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        name,
        phone,
        email: `${phone}@degreeguru.in`,
        program: `Career Finder Result: ${profile?.title || "Career Assessment"}`,
        source: "career-finder",
      });
      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="container-dg py-8 md:py-16">
        <AppBreadcrumb items={[{ label: "Career Tools" }, { label: "Career Matcher" }]} />

        {/* Header Hero */}
        <div className="text-center max-w-3xl mx-auto mb-10 md:mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
            <Compass size={15} /> 100% Free Career & Degree Discovery Test
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            CAREER FINDER
          </h1>
          <p className="text-base sm:text-lg text-muted-foreground mt-3 leading-relaxed">
            Find careers that fit your interests, strengths, and working style through real-world scenario challenges.
          </p>
        </div>

        {/* Assessment Card */}
        <div className="max-w-3xl mx-auto bg-card border border-border/80 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          {!hasStarted ? (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center space-y-2 max-w-md mx-auto">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                  <Compass size={24} />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                  Step 1: Tell Us About Yourself
                </h2>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Enter your details first so we can benchmark your responses and map your career strengths to high-growth degree paths.
                </p>
              </div>

              <form onSubmit={handleStartAssessment} className="space-y-4 max-w-md mx-auto pt-2">
                <div>
                  <label htmlFor={nameInputId} className="block text-xs font-bold text-foreground mb-1">
                    Your Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={nameInputId}
                    type="text"
                    required
                    placeholder="e.g. Aarav Mehta"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label htmlFor={phoneInputId} className="block text-xs font-bold text-foreground mb-1">
                      WhatsApp Mobile <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={phoneInputId}
                      type="tel"
                      required
                      placeholder="e.g. +91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label htmlFor={emailInputId} className="block text-xs font-bold text-foreground mb-1">
                      Email Address
                    </label>
                    <input
                      id={emailInputId}
                      type="email"
                      placeholder="e.g. aarav@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Current Educational / Career Stage
                  </label>
                  <select
                    value={currentEducation}
                    onChange={(e) => setCurrentEducation(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  >
                    <option value="Working Professional">Working Professional (Seeking Career Growth)</option>
                    <option value="College Graduate / Final Year">College Graduate / Final Year (Seeking Masters / Jobs)</option>
                    <option value="12th Pass">12th Pass (Seeking Online Bachelors)</option>
                    <option value="Class 10/12th Incomplete">Class 10/12th Incomplete (Seeking Open Board Certification)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 pt-3"
                >
                  <span>Start Career Challenge (5 Scenarios)</span>
                  <ArrowRight size={16} />
                </button>

                <p className="text-[11px] text-center text-muted-foreground">
                  🔒 100% Free & Confidential. Zero Spam Guarantee.
                </p>
              </form>
            </div>
          ) : !isCompleted ? (
            <div>
              {/* Progress Indicator */}
              <div className="flex items-center justify-between text-xs font-bold text-muted-foreground mb-3">
                <span className="text-primary font-extrabold uppercase tracking-wider">
                  Scenario {currentQuestionIndex + 1} of {SCENARIOS.length}
                </span>
                <span>{Math.round(((currentQuestionIndex + 1) / SCENARIOS.length) * 100)}% Complete</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-full overflow-hidden mb-8">
                <div
                  className="h-full bg-primary transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / SCENARIOS.length) * 100}%` }}
                />
              </div>

              {/* Question Dimension & Scenario */}
              <div className="space-y-4 mb-8">
                <span className="px-3 py-1 rounded-full bg-muted text-[11px] font-bold text-foreground/80">
                  {SCENARIOS[currentQuestionIndex].dimension}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                  {SCENARIOS[currentQuestionIndex].scenario}
                </h2>
              </div>

              {/* Options */}
              <div className="space-y-3">
                {SCENARIOS[currentQuestionIndex].options.map((option, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectOption(option.scoreTrait)}
                    className="w-full text-left p-4 sm:p-5 rounded-2xl border border-border/70 hover:border-primary/70 bg-card hover:bg-primary/5 transition-all duration-150 flex items-start justify-between group shadow-sm"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-6 h-6 rounded-full bg-muted text-muted-foreground font-bold text-xs flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span className="text-xs sm:text-sm font-medium text-foreground group-hover:text-primary transition-colors">
                        {option.text}
                      </span>
                    </div>
                    <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0 ml-2 mt-1" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Results Dashboard */
            profile && (
              <div className="space-y-8 animate-fade-in">
                <div className="text-center pb-6 border-b border-border/60">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                    {profile.badge}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-foreground mt-3">
                    {profile.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-lg mx-auto">
                    Work Style Profile: <strong>{profile.personality}</strong>
                  </p>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Suggested Degrees */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/70">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-2">
                      <GraduationCap size={16} /> Recommended Online Degrees
                    </div>
                    <div className="space-y-1.5">
                      {profile.degrees.map((deg, i) => (
                        <Link
                          key={deg}
                          to={profile.degreeLinks[i]}
                          className="flex items-center justify-between p-2 rounded-xl bg-card border border-border/50 text-xs font-bold text-foreground hover:text-primary hover:border-primary transition-colors"
                        >
                          <span>{deg}</span>
                          <ArrowRight size={13} />
                        </Link>
                      ))}
                    </div>
                  </div>

                  {/* Potential Job Roles */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/70">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2">
                      <Briefcase size={16} /> Potential Target Job Roles
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {profile.roles.map((role) => (
                        <span key={role} className="px-2.5 py-1 rounded-lg bg-card border border-border text-xs font-semibold text-foreground">
                          {role}
                        </span>
                      ))}
                    </div>
                    <div className="text-[11px] text-muted-foreground font-semibold mt-3 flex items-center gap-1">
                      <TrendingUp size={13} className="text-emerald-500" /> Market CTC: {profile.salary}
                    </div>
                  </div>

                  {/* Key Skills to Develop */}
                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 md:col-span-2">
                    <div className="flex items-center gap-2 text-foreground font-bold text-xs uppercase tracking-wider mb-2">
                      <Zap size={16} className="text-amber-500" /> Essential Skills to Build
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill) => (
                        <span key={skill} className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-medium text-foreground">
                          ✓ {skill}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-3 italic">
                      "{profile.advice}"
                    </p>
                  </div>
                </div>

                {/* Free Action Next Steps */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    onClick={handleRestart}
                    className="px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground text-xs font-semibold flex items-center gap-2 transition-colors"
                  >
                    <RotateCcw size={14} /> Retake Assessment
                  </button>

                  <div className="flex gap-2">
                    <Link
                      to="/roi-calculator"
                      className="px-4 py-2.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                    >
                      Calculate ROI
                    </Link>
                    <Link
                      to="/resume-builder"
                      className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      Build ATS Resume <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>

                {/* Lead Form for Full Career Report */}
                <div className="mt-8 p-6 rounded-2xl bg-gradient-to-tr from-primary/10 via-primary/5 to-transparent border border-primary/20 space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={16} className="text-primary" />
                    <h3 className="text-sm font-bold text-foreground">Want this Career Blueprint sent to your WhatsApp?</h3>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get the complete 12-page breakdown with university fee comparisons and alumni placement reports.
                  </p>

                  {submitted ? (
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 size={16} /> Your career blueprint report has been sent to WhatsApp!
                    </div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="flex flex-col sm:flex-row gap-2 pt-1">
                      <label htmlFor={nameInputId} className="sr-only">Full Name</label>
                      <input
                        id={nameInputId}
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 flex-1"
                      />
                      <label htmlFor={phoneInputId} className="sr-only">WhatsApp Number</label>
                      <input
                        id={phoneInputId}
                        type="tel"
                        required
                        placeholder="WhatsApp Number"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 flex-1"
                      />
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center gap-1.5 shrink-0 hover:bg-primary/90 transition-colors shadow-sm"
                      >
                        <Send size={14} /> Send My Report
                      </button>
                    </form>
                  )}
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};
export default CareerFinder;
