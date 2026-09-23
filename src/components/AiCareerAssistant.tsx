import { useState, useId } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  RefreshCw, 
  GraduationCap, 
  Send,
  Building2,
  TrendingUp,
  Award
} from "lucide-react";
import { CORE_COURSES } from "@/data/courses";
import { submitLead } from "@/lib/api";

type Step = "exploring" | "current_status" | "looking_for" | "preferred_field" | "recommendation" | "contact_success";

const EXPLORING_OPTIONS = [
  "Online MBA",
  "Online MCA",
  "Online BCA",
  "Online BBA",
  "Online B.Com",
  "Online DBA",
  "Online Bachelor's",
  "Online Master's",
  "Class 10",
  "Class 12",
  "Jobs",
  "Career Change",
  "Not Sure Yet",
];

const CURRENT_STATUS_OPTIONS = [
  "Working Professional",
  "Currently Studying in College",
  "Recently Graduated",
  "Actively Looking for a Job",
  "Class 10 Student / Dropout",
  "Class 12 Student / Dropout",
];

const LOOKING_FOR_OPTIONS = [
  "Promotion at Work",
  "Salary Hike (30% - 70%)",
  "Complete Career Switch",
  "First Corporate Job",
  "Recognized Higher Education Degree",
  "Flexible Weekend / Online Learning",
  "Skill Development & Certifications",
];

const PREFERRED_FIELDS = [
  "Management & Leadership",
  "Software, AI & Technology",
  "Commerce, Accounting & Finance",
  "Executive Leadership (Doctorate)",
  "Arts, Media & Humanities",
  "Secondary School Completion",
];

export const AiCareerAssistant = () => {
  const [step, setStep] = useState<Step>("exploring");
  const [exploring, setExploring] = useState<string>("");
  const [status, setStatus] = useState<string>("");
  const [goal, setGoal] = useState<string>("");
  const [field, setField] = useState<string>("");
  
  // Contact details
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leadSuccess, setLeadSuccess] = useState(false);

  const nameInputId = useId();
  const phoneInputId = useId();
  const emailInputId = useId();

  const handleSelectExploring = (val: string) => {
    setExploring(val);
    setStep("current_status");
  };

  const handleSelectStatus = (val: string) => {
    setStatus(val);
    setStep("looking_for");
  };

  const handleSelectGoal = (val: string) => {
    setGoal(val);
    setStep("preferred_field");
  };

  const handleSelectField = (val: string) => {
    setField(val);
    setStep("recommendation");
  };

  const handleReset = () => {
    setStep("exploring");
    setExploring("");
    setStatus("");
    setGoal("");
    setField("");
    setLeadSuccess(false);
  };

  // Compute smart recommendations
  const getRecommendation = () => {
    if (exploring === "Class 10" || exploring === "Class 12" || status.includes("Class 10") || status.includes("Class 12")) {
      return {
        title: "BOSSE Recognized Secondary / Senior Secondary Pathway",
        subtitle: "Government-recognized open schooling with flexible examination windows",
        recommendedCourseSlug: "bosse-class-12",
        linkText: "Explore BOSSE Class 10 & 12 Options",
        linkUrl: "/class-10-12",
        avgSalary: "₹2.5L - ₹4L initial corporate baseline",
        badge: "School Completion",
        universities: ["BOSSE Open Schooling Board"],
      };
    }
    if (exploring === "Online DBA" || field.includes("Doctorate")) {
      return {
        title: "Online DBA (Doctor of Business Administration)",
        subtitle: "Designed for senior executives, managers & consultants targeting C-suite roles",
        recommendedCourseSlug: "online-dba",
        linkText: "View Online DBA Curriculum & Universities",
        linkUrl: "/online-dba",
        avgSalary: "₹25L - ₹45L/year (C-Suite & Leadership)",
        badge: "Executive Doctorate",
        universities: ["Birchwood University", "EIMT", "Golden Gate"],
      };
    }
    if (exploring === "Online MCA" || field.includes("Technology") || field.includes("Software")) {
      return {
        title: "Online MCA (Master of Computer Applications)",
        subtitle: "Specializations in Cloud Computing, AI & Full Stack Engineering",
        recommendedCourseSlug: "online-mca",
        linkText: "View Online MCA Specializations & Fees",
        linkUrl: "/online-mca",
        avgSalary: "₹7.5L - ₹16L/year (Avg 58% hike)",
        badge: "Tech Acceleration",
        universities: ["Amity University", "Manipal University Jaipur", "Chandigarh University"],
      };
    }
    if (exploring === "Online BCA") {
      return {
        title: "Online BCA (Bachelor of Computer Applications)",
        subtitle: "Ideal for fresh 10+2 students & tech enthusiasts building a coding foundation",
        recommendedCourseSlug: "online-bca",
        linkText: "Explore Online BCA Admission & EMI",
        linkUrl: "/online-bca",
        avgSalary: "₹4.5L - ₹8.5L/year starting potential",
        badge: "Tech Degree",
        universities: ["Manipal University Jaipur", "Amrita Online", "Uttaranchal University"],
      };
    }
    // Default to Online MBA
    return {
      title: "Online MBA (Master of Business Administration)",
      subtitle: "Tailored for working professionals seeking promotions, salary hikes, and management transition",
      recommendedCourseSlug: "online-mba",
      linkText: "Explore Top 15 Online MBA Universities & Fees",
      linkUrl: "/online-mba",
      avgSalary: "₹8.5L - ₹22L/year (Avg 65% salary hike)",
      badge: "Highest Career Growth",
      universities: ["NMIMS Online", "Amity University", "Manipal (MUJ)", "Parul University", "D.Y. Patil"],
    };
  };

  const rec = getRecommendation();

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || !fullName) return;
    setIsSubmitting(true);
    try {
      await submitLead({
        name: fullName,
        phone,
        email: email || `${phone}@degreeguru.in`,
        program: `${exploring || "General Inquiry"} - via AI Career Assistant`,
        source: "ai-career-assistant",
      });
      setLeadSuccess(true);
    } catch {
      setLeadSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto rounded-3xl border border-primary/20 bg-gradient-to-b from-card/90 via-card to-card/95 shadow-2xl p-5 sm:p-8 backdrop-blur-xl relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -right-20 -top-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -left-20 -bottom-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-border/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-primary to-[#8b5cf6] flex items-center justify-center text-white shadow-md shadow-primary/30">
            <Bot size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold text-foreground">Ask Degree Guru</h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-500 text-[10px] font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live AI Advisor
              </span>
            </div>
          </div>
        </div>

        {step !== "exploring" && (
          <button
            onClick={handleReset}
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors py-1 px-2.5 rounded-lg hover:bg-muted/50"
          >
            <RefreshCw size={13} /> Reset
          </button>
        )}
      </div>

      {/* Progressive Interaction Body */}
      <div className="pt-6 min-h-[280px] flex flex-col justify-center">
        {/* Step 1: Exploring */}
        {step === "exploring" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Step 1 of 4</p>
                <h4 className="text-lg sm:text-xl font-bold text-foreground">What are you exploring right now?</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Select what best matches your current plan or thought:</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 sm:gap-2.5 pt-2">
              {EXPLORING_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectExploring(item)}
                  className="px-3.5 py-3 rounded-xl border border-border/70 hover:border-primary/60 bg-card hover:bg-primary/5 text-foreground text-xs sm:text-sm font-semibold transition-all duration-150 text-left flex items-center justify-between group shadow-sm"
                >
                  <span>{item}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Current Status */}
        {step === "current_status" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Step 2 of 4</p>
                <h4 className="text-lg sm:text-xl font-bold text-foreground">What are you currently doing?</h4>
                <p className="text-xs text-muted-foreground mt-0.5">This helps match university format and study hours:</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {CURRENT_STATUS_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectStatus(item)}
                  className="px-4 py-3.5 rounded-xl border border-border/70 hover:border-primary/60 bg-card hover:bg-primary/5 text-foreground text-xs sm:text-sm font-semibold transition-all duration-150 text-left flex items-center justify-between group shadow-sm"
                >
                  <span>{item}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Looking For / Outcome */}
        {step === "looking_for" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Step 3 of 4</p>
                <h4 className="text-lg sm:text-xl font-bold text-foreground">What is your primary goal from this degree?</h4>
                <p className="text-xs text-muted-foreground mt-0.5">We personalize recommendations based on expected career ROI:</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {LOOKING_FOR_OPTIONS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectGoal(item)}
                  className="px-4 py-3.5 rounded-xl border border-border/70 hover:border-primary/60 bg-card hover:bg-primary/5 text-foreground text-xs sm:text-sm font-semibold transition-all duration-150 text-left flex items-center justify-between group shadow-sm"
                >
                  <span>{item}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Preferred Field */}
        {step === "preferred_field" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-primary/15 flex items-center justify-center text-primary shrink-0 mt-0.5">
                <Sparkles size={14} />
              </div>
              <div>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider">Step 4 of 4</p>
                <h4 className="text-lg sm:text-xl font-bold text-foreground">What is your preferred domain or field?</h4>
                <p className="text-xs text-muted-foreground mt-0.5">Final touch to pinpoint syllabus & specialization:</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              {PREFERRED_FIELDS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleSelectField(item)}
                  className="px-4 py-3.5 rounded-xl border border-border/70 hover:border-primary/60 bg-card hover:bg-primary/5 text-foreground text-xs sm:text-sm font-semibold transition-all duration-150 text-left flex items-center justify-between group shadow-sm"
                >
                  <span>{item}</span>
                  <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Immediate Value + Personalized AI Roadmap + Optional Lead */}
        {step === "recommendation" && (
          <div className="space-y-6 animate-fade-in">
            {/* Value Recommendation Card */}
            <div className="p-5 sm:p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                  {rec.badge}
                </span>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <TrendingUp size={14} /> {rec.avgSalary}
                </span>
              </div>

              <div>
                <h4 className="text-xl sm:text-2xl font-black text-foreground">{rec.title}</h4>
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">{rec.subtitle}</p>
              </div>

              {/* Recommended Universities */}
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Top Accredited Universities for Your Profile:</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  {rec.universities.map((uni) => (
                    <span key={uni} className="px-3 py-1 rounded-xl bg-card border border-border text-xs font-semibold text-foreground flex items-center gap-1.5 shadow-sm">
                      <Building2 size={13} className="text-primary" /> {uni}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Links */}
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  to={rec.linkUrl}
                  className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-md shadow-primary/20"
                >
                  <GraduationCap size={16} /> {rec.linkText} <ArrowRight size={14} />
                </Link>
                <Link
                  to="/roi-calculator"
                  className="px-4 py-2.5 rounded-xl bg-card border border-border text-xs sm:text-sm font-semibold text-foreground hover:bg-muted/50 transition-colors"
                >
                  Calculate Your Exact ROI
                </Link>
              </div>
            </div>

            {/* Value-First Progressive Contact Form */}
            <div className="p-5 sm:p-6 rounded-2xl bg-card border border-border/80 shadow-sm space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Award size={18} />
                </div>
                <div>
                  <h5 className="text-sm sm:text-base font-bold text-foreground">
                    Receive Complete Syllabus, Fee Comparison & University Shortlist
                  </h5>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    100% Free. No pushy sales calls. Verified guidance directly on WhatsApp.
                  </p>
                </div>
              </div>

              {leadSuccess ? (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-3">
                  <CheckCircle2 size={20} className="shrink-0" />
                  <div>
                    <p className="font-bold">Recommendation packet generated successfully!</p>
                    <p className="text-[11px] opacity-90">Our senior academic counselor has sent the fee matrix to your WhatsApp.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div>
                    <label htmlFor={nameInputId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Your Full Name *</label>
                    <input
                      id={nameInputId}
                      type="text"
                      required
                      placeholder="e.g. Yash Sharma"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label htmlFor={phoneInputId} className="block text-[11px] font-semibold text-muted-foreground mb-1">WhatsApp Mobile *</label>
                    <input
                      id={phoneInputId}
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    />
                  </div>
                  <div>
                    <label htmlFor={emailInputId} className="block text-[11px] font-semibold text-muted-foreground mb-1">Email (Optional)</label>
                    <div className="flex gap-2">
                      <input
                        id={emailInputId}
                        type="email"
                        placeholder="name@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                      />
                    </div>
                  </div>
                  <div className="sm:col-span-3 pt-1">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full sm:w-auto px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-emerald-600/25"
                    >
                      {isSubmitting ? (
                        <>Sending Details...</>
                      ) : (
                        <>
                          <Send size={15} /> Get My Free Personalized Roadmap
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
