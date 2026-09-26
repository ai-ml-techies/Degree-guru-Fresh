import { useState, useEffect, useMemo, useRef } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  GraduationCap,
  Briefcase,
  TrendingUp,
  ShieldCheck,
  Building2,
  Target,
  Layers,
  Award,
  Zap,
  RotateCcw,
  Printer,
  ChevronRight,
  MessageCircle,
  HelpCircle,
  FileText,
  AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { CounselingForm } from "@/components/CounselingForm";
import { WhatsAppCircleIcon } from "@/components/SocialIcons";
import {
  ASSESSMENT_QUESTIONS,
  AssessmentQuestion,
  evaluateAssessment,
  AssessmentResult,
  CareerMatch
} from "@/assessment";
import { COURSES } from "@/data/courses";
import { UNIVERSITIES } from "@/data/universities";

type ViewState = "hero" | "assessment" | "result";

export const KnowYourself = () => {
  const [view, setView] = useState<ViewState>("hero");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [selectedMulti, setSelectedMulti] = useState<number[]>([]);
  const [researchConsent, setResearchConsent] = useState(false);
  const [counselingOpen, setCounselingOpen] = useState(false);
  const [selectedCareerModal, setSelectedCareerModal] = useState<CareerMatch | null>(null);
  const [howItWorksOpen, setHowItWorksOpen] = useState(false);

  // Result state
  const [result, setResult] = useState<AssessmentResult | null>(() => {
    try {
      const saved = localStorage.getItem("degreeguru_knowyourself_result");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Load existing answers if any
  useEffect(() => {
    try {
      const savedAnswers = localStorage.getItem("degreeguru_knowyourself_answers");
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
    } catch {
      // ignore
    }
  }, []);

  // Filter adaptive questions based on progress
  const activeQuestions = useMemo(() => {
    // Stage and Core questions always included
    const baseQuestions = ASSESSMENT_QUESTIONS.filter((q) => !q.adaptiveTag);
    const adaptiveQuestions = ASSESSMENT_QUESTIONS.filter((q) => q.adaptiveTag);

    // If answers reveal analytical orientation, prioritize analytical adaptive questions
    return [...baseQuestions, ...adaptiveQuestions];
  }, []);

  const currentQuestion = activeQuestions[currentQuestionIndex];
  const totalQuestions = activeQuestions.length;

  // Sync selection when question index changes
  useEffect(() => {
    if (!currentQuestion) return;
    const existing = answers[currentQuestion.id];
    if (currentQuestion.type === "multiselect") {
      setSelectedMulti(Array.isArray(existing) ? existing : []);
    } else {
      setSelectedOption(typeof existing === "number" ? existing : null);
    }
    // Scroll window smoothly to question area on mobile
    if (view === "assessment") {
      window.scrollTo({ top: 120, behavior: "smooth" });
    }
  }, [currentQuestionIndex, currentQuestion, view]);

  // Handle Option selection
  const handleSelectOption = (index: number) => {
    if (!currentQuestion) return;

    if (currentQuestion.type === "multiselect") {
      const nextMulti = selectedMulti.includes(index)
        ? selectedMulti.filter((i) => i !== index)
        : [...selectedMulti, index];
      setSelectedMulti(nextMulti);
      const nextAnswers = { ...answers, [currentQuestion.id]: nextMulti };
      setAnswers(nextAnswers);
      localStorage.setItem("degreeguru_knowyourself_answers", JSON.stringify(nextAnswers));
    } else {
      setSelectedOption(index);
      const nextAnswers = { ...answers, [currentQuestion.id]: index };
      setAnswers(nextAnswers);
      localStorage.setItem("degreeguru_knowyourself_answers", JSON.stringify(nextAnswers));

      // Auto-advance after small tactile delay for single / forced choice
      setTimeout(() => {
        handleNext(nextAnswers);
      }, 260);
    }
  };

  const handleNext = (customAnswers?: Record<string, any>) => {
    const finalAnswers = customAnswers || answers;
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate final result
      const calculatedResult = evaluateAssessment(finalAnswers);
      setResult(calculatedResult);
      localStorage.setItem("degreeguru_knowyourself_result", JSON.stringify(calculatedResult));
      setView("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    } else {
      setView("hero");
    }
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setSelectedMulti([]);
    localStorage.removeItem("degreeguru_knowyourself_answers");
    setView("assessment");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Minutes left calculation
  const questionsRemaining = Math.max(0, totalQuestions - currentQuestionIndex);
  const minutesLeft = Math.max(1, Math.ceil(questionsRemaining * 0.35));

  // Find partner universities for the recommended course
  const recommendedCourseData = useMemo(() => {
    if (!result?.educationRecommendation.primaryDegreeSlug) return null;
    return COURSES.find((c) => c.slug === result.educationRecommendation.primaryDegreeSlug);
  }, [result]);

  const recommendedUnis = useMemo(() => {
    if (!recommendedCourseData) return UNIVERSITIES.slice(0, 3);
    const matched = UNIVERSITIES.filter(
      (u) =>
        u.category === "online" &&
        (recommendedCourseData.topUniversitySlugs.includes(u.slug) ||
          u.popularCourses.some((c) => c.toLowerCase().includes(recommendedCourseData.title.toLowerCase())))
    );
    return matched.length > 0 ? matched.slice(0, 3) : UNIVERSITIES.slice(0, 3);
  }, [recommendedCourseData]);

  return (
    <>
      <Helmet>
        <title>Know Yourself — Career Discovery & Education Roadmap | Degree Guru</title>
        <meta
          name="description"
          content="Understand yourself. Discover your direction. Know your next move. An adaptive, India-focused career discovery assessment and personalized roadmap by Degree Guru."
        />
        <link rel="canonical" href="https://degreeguru.in/know-yourself" />
      </Helmet>

      <div className="min-h-screen bg-background text-foreground flex flex-col">
        {/* ========================================================================= */}
        {/* 1. HERO VIEW                                                              */}
        {/* ========================================================================= */}
        {view === "hero" && (
          <div className="flex-1 pb-16">
            {/* Top Announcement Bar */}
            <div className="bg-primary/10 border-b border-primary/20 py-2.5 px-4 text-center">
              <p className="text-xs sm:text-sm font-semibold text-primary flex items-center justify-center gap-2">
                <Sparkles size={14} className="animate-pulse" />
                <span>India’s Adaptive Career Discovery Assessment • 100% Free</span>
              </p>
            </div>

            {/* Hero Main */}
            <section className="relative pt-12 md:pt-20 pb-16 overflow-hidden bg-gradient-to-b from-primary/8 via-background to-background">
              <div className="container-dg max-w-4xl text-center space-y-6">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs sm:text-sm font-bold uppercase tracking-wider">
                  <Compass size={15} />
                  <span>Know Yourself</span>
                </div>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.18] text-foreground">
                  Know Yourself.
                </h1>

                <p className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground/90 max-w-2xl mx-auto leading-snug">
                  Understand your strengths, discover career directions and find your next move.
                </p>

                <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                  A simple personalised assessment that helps you understand what fits you, what you can improve and
                  which career, skill and education paths are worth exploring.
                </p>

                {/* CTAs */}
                <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Button
                    size="lg"
                    onClick={() => {
                      if (result) {
                        setView("result");
                      } else {
                        setView("assessment");
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-6 rounded-2xl bg-primary text-primary-foreground font-extrabold text-base shadow-xl shadow-primary/25 hover:bg-primary/90 hover:scale-[1.02] transition-all flex items-center justify-center gap-2.5"
                  >
                    <Sparkles size={18} />
                    <span>{result ? "View My Career Profile" : "Start Free"}</span>
                    <ArrowRight size={17} />
                  </Button>

                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => setHowItWorksOpen(true)}
                    className="w-full sm:w-auto px-6 py-6 rounded-2xl border-border/80 font-bold text-base hover:bg-muted/40"
                  >
                    How It Works
                  </Button>
                </div>

                <p className="text-xs sm:text-sm text-muted-foreground pt-1 font-medium">
                  Free • Personalised • About 10–15 minutes
                </p>

                {result && (
                  <div className="pt-2">
                    <button
                      onClick={handleRestart}
                      className="text-xs text-primary underline hover:text-primary/80 transition-colors inline-flex items-center gap-1.5"
                    >
                      <RotateCcw size={12} /> Retake assessment with fresh answers
                    </button>
                  </div>
                )}
              </div>
            </section>

            {/* The Ultimate Journey Section */}
            <section className="py-12 border-y border-border/60 bg-muted/20">
              <div className="container-dg max-w-5xl">
                <div className="text-center mb-8">
                  <span className="text-xs uppercase font-extrabold tracking-widest text-primary block mb-2">
                    The Complete Career Evolution
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-extrabold">Your Discovery Journey</h2>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 text-center">
                  {[
                    { step: "01", title: "KNOW YOURSELF", desc: "Strengths & values" },
                    { step: "02", title: "DISCOVER CAREER", desc: "High-fit roles" },
                    { step: "03", title: "IDENTIFY GAPS", desc: "What you need" },
                    { step: "04", title: "BUILD SKILLS", desc: "High leverage" },
                    { step: "05", title: "RIGHT EDUCATION", desc: "Accredited degrees" },
                    { step: "06", title: "TAKE NEXT STEP", desc: "90-day action" },
                    { step: "07", title: "GROW", desc: "Salary & impact" }
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-2xl bg-card border border-border/60 shadow-sm flex flex-col justify-between hover:border-primary/40 transition-colors"
                    >
                      <div className="text-[10px] font-black text-primary/80 mb-1">{item.step}</div>
                      <div className="text-xs sm:text-sm font-extrabold text-foreground leading-tight">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-muted-foreground mt-1">{item.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Value Proposition Grid */}
            <section className="py-14">
              <div className="container-dg max-w-5xl">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Target size={20} />
                    </div>
                    <h3 className="text-lg font-extrabold">Deterministic & Evidence-Informed</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      No random AI guesswork or arbitrary personality quizzes. Your responses are systematically mapped
                      against 6 core career interest dimensions and 13 concrete strength indicators.
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <Briefcase size={20} />
                    </div>
                    <h3 className="text-lg font-extrabold">India-Focused Industry Match</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Calibrated for the real Indian job market across tech, analytics, marketing, product, finance, and
                      management — connecting you directly with authentic UGC-DEB entitled degrees.
                    </p>
                  </div>

                  <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold">
                      <TrendingUp size={20} />
                    </div>
                    <h3 className="text-lg font-extrabold">Actionable 5-Stage Roadmap</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      Finish with a concrete 5-step transition plan, your immediate 7, 30, and 90-day moves, and zero
                      unrealistic hurdles. Start making real progress today.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 2. ASSESSMENT FLOW VIEW (One Question Per Screen on Mobile)                */}
        {/* ========================================================================= */}
        {view === "assessment" && currentQuestion && (
          <div className="flex-1 flex flex-col justify-between py-6 px-4 max-w-2xl mx-auto w-full">
            {/* Top Navigation & Progress */}
            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold">
                <button
                  onClick={handlePrev}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-muted text-foreground transition-colors"
                >
                  <ArrowLeft size={14} /> Back
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">
                    Question {currentQuestionIndex + 1} of {totalQuestions}
                  </span>
                  <span className="text-muted-foreground hidden sm:inline">•</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Clock size={12} /> ~{minutesLeft} min left
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-primary h-full transition-all duration-300 ease-out rounded-full"
                  style={{ width: `${Math.round(((currentQuestionIndex + 1) / totalQuestions) * 100)}%` }}
                />
              </div>
            </div>

            {/* Question Header Card */}
            <div className="space-y-3 my-auto py-2">
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary/80">
                {currentQuestion.section === "stage_goal" && "Your Starting Point"}
                {currentQuestion.section === "interests" && "Interests & Curiosity"}
                {currentQuestion.section === "strengths" && "Strengths & Problem Solving"}
                {currentQuestion.section === "workstyle" && "Work Style & Environment"}
                {currentQuestion.section === "values_motivation" && "Career Values & Drive"}
                {currentQuestion.section === "confidence_challenges" && "Confidence & Practical Challenges"}
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground leading-snug tracking-tight">
                {currentQuestion.title}
              </h2>

              {currentQuestion.subtitle && (
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {currentQuestion.subtitle}
                </p>
              )}

              {/* Options List: Large tactile answer cards */}
              <div className="space-y-3 pt-4">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected =
                    currentQuestion.type === "multiselect"
                      ? selectedMulti.includes(idx)
                      : selectedOption === idx;

                  return (
                    <button
                      key={idx}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 group relative ${
                        isSelected
                          ? "bg-primary/10 border-primary shadow-md shadow-primary/10 ring-1 ring-primary"
                          : "bg-card border-border/70 hover:border-primary/50 hover:bg-muted/30"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full shrink-0 flex items-center justify-center mt-0.5 border transition-colors ${
                          isSelected
                            ? "bg-primary border-primary text-primary-foreground"
                            : "border-muted-foreground/30 group-hover:border-primary/60"
                        }`}
                      >
                        {isSelected && <Check size={14} className="stroke-[3]" />}
                      </div>

                      <div className="space-y-1 pr-2">
                        <div className={`text-sm sm:text-base font-bold ${isSelected ? "text-primary" : "text-foreground"}`}>
                          {opt.text}
                        </div>
                        {opt.description && (
                          <p className="text-xs sm:text-sm text-muted-foreground leading-normal">
                            {opt.description}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Multiselect confirmation button if applicable */}
              {currentQuestion.type === "multiselect" && (
                <div className="pt-4">
                  <Button
                    size="lg"
                    disabled={selectedMulti.length === 0}
                    onClick={() => handleNext()}
                    className="w-full py-5 rounded-2xl bg-primary text-primary-foreground font-extrabold text-sm"
                  >
                    <span>Continue ({selectedMulti.length} selected)</span>
                    <ArrowRight size={16} />
                  </Button>
                </div>
              )}
            </div>

            {/* Bottom Consent and Helper info */}
            <div className="pt-6 border-t border-border/40 mt-8 text-center space-y-2">
              <label className="inline-flex items-center gap-2 text-[11px] text-muted-foreground cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={researchConsent}
                  onChange={(e) => setResearchConsent(e.target.checked)}
                  className="rounded border-border text-primary focus:ring-primary w-3.5 h-3.5"
                />
                <span>Help Degree Guru improve career guidance through anonymised, aggregated insights (Optional).</span>
              </label>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* 3. REPORT / RESULTS EXPERIENCE (Sections 1–11)                            */}
        {/* ========================================================================= */}
        {view === "result" && result && (
          <div className="flex-1 py-10 print:py-0">
            <div className="container-dg max-w-5xl space-y-12">
              {/* Report Header Bar */}
              <div className="bg-card border border-border/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider">
                    <CheckCircle2 size={13} /> Assessment Completed
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-black text-foreground tracking-tight">
                    Your Career Discovery Report
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Tailored for your current journey:{" "}
                    <span className="font-semibold text-foreground capitalize">
                      {result.userStage.replace(/_/g, " ")}
                    </span>{" "}
                    • Completed on {new Date(result.completedAt).toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" })}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                    className="rounded-xl flex items-center gap-1.5 text-xs font-bold"
                  >
                    <Printer size={14} /> Print / Save PDF
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleRestart}
                    className="rounded-xl flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-foreground"
                  >
                    <RotateCcw size={14} /> Retake
                  </Button>
                </div>
              </div>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 1: WHO YOU ARE                                            */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    01
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">Who You Are</h2>
                    <p className="text-xs text-muted-foreground">Your natural orientation, archetype, and motivations</p>
                  </div>
                </div>

                {/* Archetype Showcase Card */}
                <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/15 via-card to-card border border-primary/30 shadow-lg shadow-primary/5 space-y-4">
                  <div className="inline-block text-xs font-extrabold uppercase tracking-widest text-primary px-3 py-1 rounded-full bg-primary/10">
                    Your Career Profile Archetype
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                    {result.archetype.title}
                  </h3>
                  <p className="text-base sm:text-lg font-semibold text-primary/90 leading-snug">
                    "{result.archetype.tagline}"
                  </p>
                  <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-3xl">
                    {result.archetype.description}
                  </p>
                </div>

                {/* Top 3 RIASEC Interests */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.riasecTop3.map((r, i) => (
                    <div key={r.area} className="p-5 rounded-2xl bg-card border border-border/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-primary">
                          #{i + 1} Interest
                        </span>
                        <span className="text-xs font-extrabold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                          {r.score}% Match
                        </span>
                      </div>
                      <div className="text-base font-extrabold text-foreground">{r.label}</div>
                      <div className="text-xs font-medium text-muted-foreground">{r.tagline}</div>
                      <p className="text-xs text-soft leading-relaxed pt-1">{r.description}</p>
                    </div>
                  ))}
                </div>

                {/* Work Style & Motivation Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* How you work best */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers size={18} className="text-primary" />
                      <h4 className="text-base font-extrabold">How You May Work Best</h4>
                    </div>
                    <p className="text-sm text-soft leading-relaxed italic bg-muted/30 p-3.5 rounded-xl border border-border/40">
                      "{result.workStyle.summary}"
                    </p>
                    <div className="space-y-3 pt-2">
                      {result.workStyle.axes.map((axis, i) => (
                        <div key={i} className="space-y-1">
                          <div className="flex justify-between text-xs font-semibold">
                            <span className={axis.score < 0 ? "text-primary font-bold" : "text-muted-foreground"}>
                              {axis.leftLabel}
                            </span>
                            <span className={axis.score >= 0 ? "text-primary font-bold" : "text-muted-foreground"}>
                              {axis.rightLabel}
                            </span>
                          </div>
                          <div className="w-full bg-muted h-1.5 rounded-full relative">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 rounded-full bg-primary shadow"
                              style={{ left: `calc(${((axis.score + 100) / 200) * 100}% - 7px)` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Career Values & Motivation */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <div className="flex items-center gap-2">
                      <Target size={18} className="text-primary" />
                      <h4 className="text-base font-extrabold">Your Strongest Career Values</h4>
                    </div>
                    <div className="space-y-2.5">
                      {result.topValues.map((val, idx) => (
                        <div key={val.name} className="p-3 rounded-xl bg-muted/30 border border-border/40 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-full bg-primary/10 text-primary text-[11px] font-extrabold flex items-center justify-center">
                              {idx + 1}
                            </span>
                            <span className="text-sm font-extrabold text-foreground">{val.name}</span>
                          </div>
                          <p className="text-xs text-muted-foreground pl-7 leading-relaxed">{val.explanation}</p>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-border/50 text-xs text-soft leading-relaxed">
                      <span className="font-bold text-foreground">Dominant Motivation:</span> {result.motivationProfile.summary}
                    </div>
                  </div>
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 2: WHAT YOU MAY BE GOOD AT (Strengths)                    */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    02
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">What You May Be Good At</h2>
                    <p className="text-xs text-muted-foreground">Your top 5 strength indicators scored across problem scenarios</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {result.topStrengths.map((str) => (
                    <div key={str.key} className="p-5 rounded-2xl bg-card border border-border/80 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-extrabold text-foreground">{str.label}</span>
                        <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          {str.tier}
                        </span>
                      </div>
                      <div className="w-full bg-muted/60 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                          style={{ width: `${str.score}%` }}
                        />
                      </div>
                      <p className="text-xs text-soft leading-relaxed">{str.explanation}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 3: WHAT YOU CAN DEVELOP (Growth Opportunities)            */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    03
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">What You Can Develop</h2>
                    <p className="text-xs text-muted-foreground">High-leverage growth opportunities to focus on next</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {result.growthOpportunities.map((opp, idx) => (
                    <div key={idx} className="p-5 rounded-2xl bg-card border border-border/80 space-y-3 flex flex-col justify-between">
                      <div className="space-y-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-widest text-amber-600 dark:text-amber-400">
                          Growth Opportunity #{idx + 1}
                        </span>
                        <h4 className="text-base font-extrabold text-foreground">{opp.area}</h4>
                        <p className="text-xs text-soft leading-relaxed">{opp.observation}</p>
                      </div>

                      <div className="p-3 rounded-xl bg-muted/40 border border-border/50 text-xs">
                        <span className="font-extrabold text-primary block mb-0.5">Next step:</span>
                        <span className="text-foreground/90">{opp.nextStep}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 4: POTENTIAL BLIND SPOTS                                  */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    04
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">Potential Blind Spots</h2>
                    <p className="text-xs text-muted-foreground">Observations worth watching based on your responses</p>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3">
                  {result.blindSpots.map((spot, i) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-muted/30">
                      <AlertCircle size={16} className="text-primary shrink-0 mt-0.5" />
                      <p className="text-xs sm:text-sm text-soft leading-relaxed">{spot}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 5: CAREER DIRECTIONS TO EXPLORE                           */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    05
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">Careers Worth Exploring</h2>
                    <p className="text-xs text-muted-foreground">
                      Based on your strengths, values, and work style • Not a rigid label
                    </p>
                  </div>
                </div>

                {/* Top 3 Strong Matches */}
                <div className="space-y-4">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-primary block">
                    Top Strong Matches
                  </span>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {result.careersToExplore.strongMatches.map((career) => (
                      <div
                        key={career.id}
                        className="p-6 rounded-3xl bg-card border border-primary/30 shadow-md shadow-primary/5 flex flex-col justify-between space-y-4 hover:border-primary transition-colors"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                              {career.cluster}
                            </span>
                            <span className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                              {career.matchScore}% Fit
                            </span>
                          </div>

                          <h3 className="text-xl font-black text-foreground">{career.title}</h3>
                          <p className="text-xs text-soft leading-relaxed line-clamp-3">{career.description}</p>

                          {/* Why it appeared */}
                          <div className="p-3.5 rounded-2xl bg-muted/40 border border-border/50 space-y-1.5">
                            <span className="text-[11px] font-bold text-primary uppercase tracking-wide block">
                              Why it appeared:
                            </span>
                            <ul className="space-y-1 text-xs text-muted-foreground">
                              {career.whyItAppeared.slice(0, 3).map((w, idx) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <span className="text-primary font-black mt-0.5">•</span>
                                  <span>{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setSelectedCareerModal(career)}
                            className="w-full rounded-xl text-xs font-bold flex items-center justify-center gap-1.5"
                          >
                            <span>Explore Details & Roles</span>
                            <ChevronRight size={14} />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Also Explore */}
                {result.careersToExplore.alsoExplore.length > 0 && (
                  <div className="space-y-3 pt-4">
                    <span className="text-xs font-extrabold uppercase tracking-widest text-muted-foreground block">
                      Also Worth Exploring
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {result.careersToExplore.alsoExplore.map((career) => (
                        <div
                          key={career.id}
                          onClick={() => setSelectedCareerModal(career)}
                          className="p-4 rounded-2xl bg-card border border-border/70 hover:border-primary/40 cursor-pointer transition-all space-y-1.5"
                        >
                          <div className="text-[10px] font-bold text-primary">{career.cluster}</div>
                          <div className="text-sm font-extrabold text-foreground">{career.title}</div>
                          <div className="text-xs text-muted-foreground flex items-center justify-between pt-1">
                            <span>{career.matchScore}% Match</span>
                            <ChevronRight size={13} className="text-primary" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 6: SKILL GAP (Already Strong / Build Next / Useful Later) */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    06
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">What Do You Need to Build?</h2>
                    <p className="text-xs text-muted-foreground">
                      Targeted skill breakdown for your primary career match ({result.careersToExplore.strongMatches[0]?.title})
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Already Strong */}
                  <div className="p-6 rounded-3xl bg-card border border-emerald-500/20 shadow-sm space-y-3">
                    <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-extrabold text-sm">
                      <CheckCircle2 size={16} /> Already Strong
                    </div>
                    <p className="text-xs text-muted-foreground">Skills your responses suggest you already utilize effectively:</p>
                    <div className="space-y-2 pt-1">
                      {result.skillsToBuild.alreadyStrong.map((s, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-emerald-500/10 text-xs font-bold text-foreground">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Build Next */}
                  <div className="p-6 rounded-3xl bg-card border border-primary/30 shadow-md shadow-primary/5 space-y-3">
                    <div className="flex items-center gap-2 text-primary font-extrabold text-sm">
                      <Zap size={16} /> Build Next (Highest Priority)
                    </div>
                    <p className="text-xs text-muted-foreground">Priority capabilities that will unlock direct market leverage:</p>
                    <div className="space-y-2 pt-1">
                      {result.skillsToBuild.buildNext.map((s, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-primary/10 text-xs font-bold text-foreground">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Useful Later */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-3">
                    <div className="flex items-center gap-2 text-muted-foreground font-extrabold text-sm">
                      <Clock size={16} /> Useful Later
                    </div>
                    <p className="text-xs text-muted-foreground">Advanced skills to acquire as you advance to senior roles:</p>
                    <div className="space-y-2 pt-1">
                      {result.skillsToBuild.usefulLater.map((s, idx) => (
                        <div key={idx} className="p-2.5 rounded-xl bg-muted/40 text-xs font-bold text-foreground">
                          {s}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 7: EDUCATION & ONLINE DEGREE RECOMMENDATION               */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    07
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">Education Recommendation</h2>
                    <p className="text-xs text-muted-foreground">
                      Objective evaluation: Do you need another degree right now?
                    </p>
                  </div>
                </div>

                {result.educationRecommendation.status === "skills_experience_first" ? (
                  <div className="p-6 sm:p-8 rounded-3xl bg-card border border-border/80 space-y-4">
                    <div className="inline-block text-xs font-extrabold uppercase tracking-widest text-emerald-600 dark:text-emerald-400 px-3 py-1 rounded-full bg-emerald-500/10">
                      Recommendation: Skills & Experience First
                    </div>
                    <h3 className="text-xl font-bold">You may not need another degree immediately.</h3>
                    <p className="text-sm text-soft leading-relaxed max-w-2xl">
                      {result.educationRecommendation.summary}
                    </p>
                    <div className="pt-2">
                      <Button
                        size="sm"
                        onClick={() => setCounselingOpen(true)}
                        className="rounded-xl text-xs font-bold bg-primary text-primary-foreground"
                      >
                        Talk to a Free Career Counselor
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary/10 via-card to-card border border-primary/30 shadow-lg space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-widest text-primary block mb-1">
                          Your Recommended Education Path
                        </span>
                        <h3 className="text-2xl sm:text-3xl font-black text-foreground">
                          {result.educationRecommendation.primaryDegreeName}
                        </h3>
                      </div>

                      {result.educationRecommendation.primaryDegreeSlug && (
                        <Link
                          to={`/programs/${result.educationRecommendation.primaryDegreeSlug}`}
                          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-primary text-primary-foreground text-xs sm:text-sm font-bold shadow-md hover:bg-primary/90 transition-colors w-fit"
                        >
                          <span>Explore {result.educationRecommendation.primaryDegreeName} Syllabus</span>
                          <ArrowRight size={15} />
                        </Link>
                      )}
                    </div>

                    <p className="text-sm text-soft leading-relaxed">
                      {result.educationRecommendation.summary}
                    </p>

                    {/* Why it may fit */}
                    <div className="p-4 rounded-2xl bg-muted/40 border border-border/50 space-y-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-primary block">
                        Why It May Fit You
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-soft">
                        {result.educationRecommendation.whyItMayFit.map((w, idx) => (
                          <div key={idx} className="flex items-start gap-2">
                            <Check size={14} className="text-primary mt-0.5 shrink-0" />
                            <span>{w}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specialisations to explore */}
                    {result.educationRecommendation.specialisationsToExplore.length > 0 && (
                      <div className="space-y-2">
                        <span className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground block">
                          Specialisations to Explore
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {result.educationRecommendation.specialisationsToExplore.map((spec, idx) => (
                            <span
                              key={idx}
                              className="px-3 py-1.5 rounded-xl bg-card border border-border text-xs font-semibold text-foreground shadow-sm"
                            >
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Partner Universities Comparison Preview */}
                    <div className="space-y-3 pt-4 border-t border-border/50">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold uppercase tracking-widest text-foreground">
                          Top Entitled Universities for this Degree
                        </span>
                        <span className="text-[11px] text-muted-foreground">UGC-DEB Approved</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {recommendedUnis.map((uni) => (
                          <div key={uni.id} className="p-4 rounded-2xl bg-card border border-border space-y-2">
                            <div className="text-xs font-extrabold text-foreground">{uni.name}</div>
                            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                              {uni.naacGrade && <span className="font-bold text-primary">NAAC {uni.naacGrade}</span>}
                              <span>•</span>
                              <span>{uni.location}</span>
                            </div>
                            <div className="text-xs font-bold text-foreground pt-1">{uni.feeRange}</div>
                            <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                              EMI from {uni.emiStarting}
                            </div>
                            <Link
                              to={`/universities/${uni.slug}`}
                              className="text-xs text-primary font-bold hover:underline inline-flex items-center gap-1 pt-1"
                            >
                              View University <ChevronRight size={12} />
                            </Link>
                          </div>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted-foreground italic pt-1">
                        Program details may change. Confirm current eligibility and admission criteria before enrolment.
                      </p>
                    </div>
                  </div>
                )}
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 8: PERSONALISED ROADMAP (Max 5 Stages)                    */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    08
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">Your Roadmap</h2>
                    <p className="text-xs text-muted-foreground">
                      Here’s a simple path from where you are today to where you want to go
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-bold text-foreground">
                      Trajectory Profile: <span className="text-primary">{result.roadmap.careerType}</span>
                    </span>
                    <span className="font-bold text-foreground">
                      Target Direction: <span className="text-primary">{result.roadmap.targetCareer}</span>
                    </span>
                  </div>

                  <div className="space-y-4 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-border/80 before:hidden sm:before:block">
                    {result.roadmap.stages.map((stage, idx) => (
                      <div
                        key={idx}
                        className="p-5 sm:p-6 rounded-3xl bg-card border border-border/80 shadow-sm flex flex-col sm:flex-row items-start gap-4 sm:ml-4 relative"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-primary text-primary-foreground font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-primary/20">
                          {stage.stepNumber}
                        </div>

                        <div className="space-y-2 flex-1">
                          <h3 className="text-lg font-black text-foreground">{stage.title}</h3>

                          <div className="text-xs sm:text-sm text-soft leading-relaxed">
                            <span className="font-bold text-foreground">What to do: </span>
                            {stage.whatToDo}
                          </div>

                          <div className="text-xs sm:text-sm text-soft leading-relaxed">
                            <span className="font-bold text-primary">Why it matters: </span>
                            {stage.whyItMatters}
                          </div>

                          <div className="flex flex-wrap gap-2 pt-2">
                            {stage.keyPoints.map((kp, kIdx) => (
                              <span
                                key={kIdx}
                                className="px-2.5 py-1 rounded-lg bg-muted/50 border border-border/40 text-[11px] font-semibold text-muted-foreground"
                              >
                                {kp}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 9: 90-DAY ACTION PLAN                                     */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="space-y-6">
                <div className="flex items-center gap-2">
                  <span className="w-8 h-8 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-sm">
                    09
                  </span>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black">Your Next 90 Days</h2>
                    <p className="text-xs text-muted-foreground">Concrete, non-overwhelming milestones</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  {/* Next 7 Days */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <div className="inline-block text-xs font-black uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
                      Next 7 Days
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-soft">
                      {result.actionPlan.next7Days.map((a, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next 30 Days */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <div className="inline-block text-xs font-black uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
                      Next 30 Days
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-soft">
                      {result.actionPlan.next30Days.map((a, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Next 90 Days */}
                  <div className="p-6 rounded-3xl bg-card border border-border/80 space-y-4">
                    <div className="inline-block text-xs font-black uppercase tracking-wider text-primary px-3 py-1 rounded-full bg-primary/10">
                      Next 90 Days
                    </div>
                    <ul className="space-y-3 text-xs sm:text-sm text-soft">
                      {result.actionPlan.next90Days.map((a, i) => (
                        <li key={i} className="flex items-start gap-2.5">
                          <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 10: YOUR NEXT BEST MOVE (Single Prioritized Action)       */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <section className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-primary via-[#6528f7] to-purple-900 text-white shadow-2xl space-y-6">
                <div className="max-w-2xl space-y-3">
                  <span className="text-xs font-extrabold uppercase tracking-widest text-white/80 block">
                    Your Next Best Move
                  </span>
                  <h2 className="text-2xl sm:text-4xl font-black leading-tight text-white">
                    {result.nextBestMove.headline}
                  </h2>
                  <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                    {result.nextBestMove.actionText}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link
                    to={result.nextBestMove.primaryCtaLink}
                    className="px-7 py-4 rounded-2xl bg-white text-primary font-black text-sm shadow-xl hover:bg-white/95 hover:scale-[1.02] transition-all flex items-center gap-2"
                  >
                    <span>{result.nextBestMove.primaryCtaLabel}</span>
                    <ArrowRight size={16} />
                  </Link>

                  <Button
                    variant="outline"
                    onClick={() => setCounselingOpen(true)}
                    className="px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border-white/30 text-white font-bold text-sm backdrop-blur"
                  >
                    Talk to a Career Counsellor
                  </Button>
                </div>
              </section>

              {/* ───────────────────────────────────────────────────────────────── */}
              {/* SECTION 11: DISCLAIMERS & ETHICAL TRANSPARENCY                    */}
              {/* ───────────────────────────────────────────────────────────────── */}
              <footer className="pt-8 border-t border-border/50 text-center space-y-2 text-xs text-muted-foreground">
                <p>
                  Career guidance only. Results are based on your self-reported responses and are not a psychological
                  diagnosis, clinical test, or guarantee of career placement or salary.
                </p>
                <p className="text-[11px] text-muted-foreground/80">
                  AI-assisted synthesis may contain occasional inaccuracies. University program fees and eligibility are
                  subject to university regulations. Always confirm details before formal enrollment.
                </p>
              </footer>
            </div>
          </div>
        )}
      </div>

      {/* Career Details Modal */}
      {selectedCareerModal && (
        <Dialog open={!!selectedCareerModal} onOpenChange={() => setSelectedCareerModal(null)}>
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto rounded-3xl p-6 sm:p-8">
            <DialogHeader className="space-y-2">
              <span className="text-xs font-bold text-primary uppercase tracking-wider">
                {selectedCareerModal.cluster}
              </span>
              <DialogTitle className="text-2xl font-black">{selectedCareerModal.title}</DialogTitle>
              <DialogDescription className="text-sm text-soft leading-relaxed">
                {selectedCareerModal.description}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-4">
              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-foreground">Typical Day-to-Day Work</h4>
                <p className="text-xs sm:text-sm text-soft leading-relaxed p-3.5 rounded-2xl bg-muted/40 border border-border/50">
                  {selectedCareerModal.typicalWork}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-foreground">Key Skills in Demand</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedCareerModal.keySkills.map((sk, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-xl bg-primary/10 text-primary text-xs font-bold">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-foreground">Entry Roles</h4>
                <p className="text-xs text-soft leading-relaxed">
                  {selectedCareerModal.entryRoles.join(" • ")}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-foreground">Growth Path</h4>
                <p className="text-xs text-soft leading-relaxed">
                  {selectedCareerModal.growthPath.join(" → ")}
                </p>
              </div>

              <div className="space-y-1.5">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-foreground">Work Style Alignment</h4>
                <p className="text-xs text-soft leading-relaxed italic">
                  {selectedCareerModal.workStyleFit}
                </p>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <Button variant="outline" size="sm" onClick={() => setSelectedCareerModal(null)}>
                  Close
                </Button>
                <Button
                  size="sm"
                  onClick={() => {
                    setSelectedCareerModal(null);
                    setCounselingOpen(true);
                  }}
                  className="bg-primary text-primary-foreground font-bold"
                >
                  Consult a Counselor on this Career
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* How it Works Modal */}
      <Dialog open={howItWorksOpen} onOpenChange={setHowItWorksOpen}>
        <DialogContent className="max-w-lg rounded-3xl p-6 sm:p-8">
          <DialogHeader className="space-y-2">
            <DialogTitle className="text-2xl font-black">How Know Yourself Works</DialogTitle>
            <DialogDescription className="text-sm text-soft leading-relaxed">
              Degree Guru’s adaptive career discovery assessment is built specifically for Indian students and working professionals.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 pt-4 text-xs sm:text-sm text-soft leading-relaxed">
            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                1
              </span>
              <div>
                <span className="font-bold text-foreground">Adaptive Questions: </span>
                You respond to real-world scenario questions, work preferences, and values without stressful time limits.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                2
              </span>
              <div>
                <span className="font-bold text-foreground">Deterministic Scoring: </span>
                We calculate your strengths, work style, and RIASEC interests using an objective scoring model without random AI inventions.
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold flex items-center justify-center shrink-0">
                3
              </span>
              <div>
                <span className="font-bold text-foreground">Personalised Roadmap: </span>
                Receive your unique archetype, matched career paths, skill gap analysis, and a 90-day execution roadmap.
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button
                onClick={() => {
                  setHowItWorksOpen(false);
                  setView("assessment");
                }}
                className="bg-primary text-primary-foreground font-bold"
              >
                Start Assessment Now
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Free Counseling Form Modal */}
      <Dialog open={counselingOpen} onOpenChange={setCounselingOpen}>
        <DialogContent className="max-w-lg p-0 border-0 bg-transparent shadow-none">
          <CounselingForm
            variant="card"
            title="Talk to an Academic Counselor"
            subtitle="100% free guidance on degrees, eligibility, scholarships, and career roadmap"
            onSuccess={() => setCounselingOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default KnowYourself;
