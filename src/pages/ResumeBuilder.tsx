import { useState, useId, useRef } from "react";
import { Link } from "react-router-dom";
import { ResumePaper, ResumeData, DEFAULT_RESUME_DATA, RESUME_THEME_COLORS, RESUME_FONTS } from "@/components/resume/ResumePaper";
import {
  FileText,
  Sparkles,
  Printer,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Plus,
  Trash2,
  Wand2,
  ShieldCheck,
  Target,
  Eye,
  SlidersHorizontal,
  ChevronRight,
  Upload,
  UserCheck,
  Palette,
  Award,
  Languages,
  Briefcase,
  GraduationCap,
  Download,
  Loader2,
  Phone,
  Mail,
  User,
  FileDown,
  Type
} from "lucide-react";
import { submitLead } from "@/lib/api";
import { exportResumeToPdf } from "@/lib/pdfExport";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

export const ResumeBuilder = () => {
  // Onboarding state - default open to allow instant template editing
  const [hasOnboarded, setHasOnboarded] = useState<boolean>(true);
  const [userName, setUserName] = useState<string>("YASH");
  const [userPhone, setUserPhone] = useState<string>("+91 84484 11672");
  const [userEmail, setUserEmail] = useState<string>("kumaryashappy@gmail.com");
  const [uploadFileName, setUploadFileName] = useState<string>("");
  const [isUploading, setIsUploading] = useState<boolean>(false);

  // Stepper state
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [resumeData, setResumeData] = useState<ResumeData>(DEFAULT_RESUME_DATA);
  const [selectedColor, setSelectedColor] = useState<string>("#e24a3b");
  const [selectedFont, setSelectedFont] = useState<string>("Arial, Helvetica, sans-serif");
  const [mobilePreviewOpen, setMobilePreviewOpen] = useState<boolean>(false);

  // Download lead modal state
  const [downloadModalOpen, setDownloadModalOpen] = useState<boolean>(false);
  const [leadName, setLeadName] = useState<string>("");
  const [leadPhone, setLeadPhone] = useState<string>("");
  const [leadEmail, setLeadEmail] = useState<string>("");
  const [isDownloadingPdf, setIsDownloadingPdf] = useState<boolean>(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  // New item inputs
  const [newCertInput, setNewCertInput] = useState<string>("");
  const [newLangName, setNewLangName] = useState<string>("");
  const [newLangLevel, setNewLangLevel] = useState<string>("Fluent / Professional");
  const [newProjectTitle, setNewProjectTitle] = useState<string>("");
  const [newProjectDesc, setNewProjectDesc] = useState<string>("");

  // AI Achievement Builder State
  const [simpleAchievement, setSimpleAchievement] = useState("");
  const [quantMetric, setQuantMetric] = useState("");
  const [aiOptimizedBullet, setAiOptimizedBullet] = useState("");

  // AI ATS Job Matcher State
  const [jobDescription, setJobDescription] = useState("");
  const [atsScore, setAtsScore] = useState<number | null>(null);
  const [missingKeywords, setMissingKeywords] = useState<string[]>([]);

  // Unique IDs for form inputs
  const fullNameId = useId();
  const professionalTitleId = useId();
  const locationId = useId();
  const phoneId = useId();
  const emailId = useId();
  const linkedinId = useId();
  const portfolioId = useId();
  const summaryId = useId();
  const skillsId = useId();
  const certInputId = useId();
  const achievementInputId = useId();
  const metricInputId = useId();
  const jdInputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 13-step flow
  const STEPS = [
    { num: 1, label: "Basic Details" },
    { num: 2, label: "Career Goal" },
    { num: 3, label: "Education" },
    { num: 4, label: "Experience" },
    { num: 5, label: "Skills" },
    { num: 6, label: "Projects" },
    { num: 7, label: "Certifications" },
    { num: 8, label: "Achievements & AI" },
    { num: 9, label: "Languages" },
    { num: 10, label: "Target Job" },
    { num: 11, label: "ATS Optimization" },
    { num: 12, label: "Theme & Palette" },
    { num: 13, label: "Download PDF" },
  ];

  // Handle Onboarding Completion
  const handleCompleteOnboarding = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!userName.trim() || !userPhone.trim()) {
      alert("Please enter your name and phone number to continue.");
      return;
    }

    // Submit lead for counselor / resume review
    try {
      await submitLead({
        name: userName,
        phone: userPhone,
        email: userEmail || `${userName.toLowerCase().replace(/\s+/g, "")}@example.com`,
        programOfInterest: "AI ATS Resume Builder",
      });
    } catch {
      // non-blocking
    }

    // Update resume data with user info
    setResumeData((prev) => ({
      ...prev,
      fullName: userName,
      phone: userPhone,
      email: userEmail || prev.email,
    }));

    setHasOnboarded(true);
  };

  // Handle CV Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadFileName(file.name);
    setIsUploading(true);

    // Simulate AI parsing of existing CV
    setTimeout(() => {
      setIsUploading(false);
      // Preload user name if empty
      const baseName = file.name.replace(/\.[^/.]+$/, "").replace(/[-_]/g, " ");
      if (!userName) setUserName(baseName);
    }, 1200);
  };

  // AI Achievement Transformation
  const handleTransformAchievement = () => {
    if (!simpleAchievement) return;
    const metricStr = quantMetric ? ` by ${quantMetric}` : " by 25-40%";
    const lower = simpleAchievement.toLowerCase();

    let transformed = "";
    if (lower.includes("sales") || lower.includes("revenue")) {
      transformed = `Spearheaded high-impact sales initiatives, accelerating top-line revenue growth${metricStr} through structured consultative client engagements.`;
    } else if (lower.includes("team") || lower.includes("manage") || lower.includes("people")) {
      transformed = `Led and mentored a cross-functional high-performance team, streamlining operational turnaround times${metricStr} while maintaining exceptional delivery standards.`;
    } else if (lower.includes("instagram") || lower.includes("social") || lower.includes("marketing") || lower.includes("views")) {
      transformed = `Orchestrated targeted digital marketing & organic content campaigns, expanding brand reach and organic engagement${metricStr}.`;
    } else if (lower.includes("cpl") || lower.includes("ads") || lower.includes("cost") || lower.includes("budget")) {
      transformed = `Optimized programmatic ad budget allocation and conversion funnels, reducing customer acquisition costs${metricStr} with improved return on ad spend (ROAS).`;
    } else {
      transformed = `Executed core strategic deliverables for ${simpleAchievement}, achieving measurable efficiency improvements${metricStr} aligned with organizational KPIs.`;
    }

    setAiOptimizedBullet(transformed);
  };

  // Add AI bullet to first experience
  const handleAddAIBulletToExperience = () => {
    if (!aiOptimizedBullet) return;
    const updated = [...resumeData.experiences];
    if (updated.length > 0) {
      updated[0].bullets.push(aiOptimizedBullet);
      setResumeData({ ...resumeData, experiences: updated });
    }
    setSimpleAchievement("");
    setQuantMetric("");
    setAiOptimizedBullet("");
  };

  // Add AI bullet to Key Achievements section
  const handleAddAIBulletToAchievements = () => {
    if (!aiOptimizedBullet) return;
    const updatedAch = [...(resumeData.achievements || []), aiOptimizedBullet];
    setResumeData({ ...resumeData, achievements: updatedAch });
    setSimpleAchievement("");
    setQuantMetric("");
    setAiOptimizedBullet("");
  };

  // Add Certification
  const handleAddCertification = () => {
    if (!newCertInput.trim()) return;
    const updated = [...(resumeData.certifications || []), newCertInput.trim()];
    setResumeData({ ...resumeData, certifications: updated });
    setNewCertInput("");
  };

  // Remove Certification
  const handleRemoveCertification = (idx: number) => {
    const updated = [...(resumeData.certifications || [])];
    updated.splice(idx, 1);
    setResumeData({ ...resumeData, certifications: updated });
  };

  // Add Language
  const handleAddLanguage = () => {
    if (!newLangName.trim()) return;
    const newEntry = `${newLangName.trim()} (${newLangLevel})`;
    const current = resumeData.languages ? resumeData.languages.split(" & ") : [];
    current.push(newEntry);
    setResumeData({ ...resumeData, languages: current.join(" & ") });
    setNewLangName("");
  };

  // Add Project
  const handleAddProject = () => {
    if (!newProjectTitle.trim()) return;
    const updated = [
      ...(resumeData.projects || []),
      { title: newProjectTitle.trim(), description: newProjectDesc.trim() || "High-impact portfolio initiative." },
    ];
    setResumeData({ ...resumeData, projects: updated });
    setNewProjectTitle("");
    setNewProjectDesc("");
  };

  // AI ATS Job Match Scoring
  const handleRunAtsCheck = () => {
    if (!jobDescription) {
      setAtsScore(82);
      setMissingKeywords(["Agile Sprint Planning", "P&L Management", "Stakeholder Alignment", "A/B Testing"]);
      return;
    }

    const jdWords = jobDescription.toLowerCase();
    const potentialKeywords = [
      "roi",
      "analytics",
      "leadership",
      "strategy",
      "meta ads",
      "seo",
      "content",
      "budget",
      "kpi",
      "cross-functional",
      "campaigns",
      "conversion",
      "stakeholder",
      "agile",
    ];

    const missing: string[] = [];
    let matchedCount = 0;

    potentialKeywords.forEach((kw) => {
      if (jdWords.includes(kw)) {
        const resumeText = JSON.stringify(resumeData).toLowerCase();
        if (resumeText.includes(kw)) {
          matchedCount++;
        } else {
          missing.push(kw.toUpperCase());
        }
      }
    });

    const calculatedScore = Math.min(96, Math.max(72, Math.round(78 + matchedCount * 3 - missing.length * 2)));
    setAtsScore(calculatedScore);
    setMissingKeywords(missing.slice(0, 5));
  };

  // Open lead collection dialog before PDF download
  const handleOpenDownloadModal = () => {
    setLeadName(resumeData.fullName || userName || "");
    setLeadPhone(resumeData.phone || userPhone || "");
    setLeadEmail(resumeData.email || userEmail || "");
    setDownloadError(null);
    setDownloadModalOpen(true);
  };

  // Confirm download and generate real PDF
  const handleConfirmDownloadPdf = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!leadName.trim()) {
      setDownloadError("Please enter your full name.");
      return;
    }
    const cleanPhone = leadPhone.replace(/\D/g, "");
    if (cleanPhone.length < 10) {
      setDownloadError("Please enter a valid 10-digit mobile number.");
      return;
    }
    if (!leadEmail.trim() || !/\S+@\S+\.\S+/.test(leadEmail)) {
      setDownloadError("Please enter a valid email address.");
      return;
    }

    setDownloadError(null);
    setIsDownloadingPdf(true);

    const trimmedName = leadName.trim();
    const trimmedPhone = leadPhone.trim();
    const trimmedEmail = leadEmail.trim();

    // 1. Sync confirmed details to resumeData so the PDF matches exactly
    setResumeData((prev) => ({
      ...prev,
      fullName: trimmedName,
      phone: trimmedPhone,
      email: trimmedEmail,
    }));
    setUserName(trimmedName);
    setUserPhone(trimmedPhone);
    setUserEmail(trimmedEmail);

    // 2. Submit lead in background for counseling & ATS optimization
    try {
      await submitLead({
        name: trimmedName,
        phone: trimmedPhone,
        email: trimmedEmail,
        programOfInterest: "ATS Resume PDF Download",
      });
    } catch {
      // non-blocking
    }

    // 3. Generate and trigger direct PDF download
    try {
      const cleanFileName = `${trimmedName.replace(/[^a-zA-Z0-9_-]/g, "_")}_Resume.pdf`;
      await exportResumeToPdf({
        elementId: "printable-resume",
        fileName: cleanFileName,
      });
      toast.success("Your ATS Resume PDF downloaded successfully!");
      setDownloadModalOpen(false);
    } catch (err) {
      console.error("PDF generation failed:", err);
      setDownloadError("PDF generation error. You can also print via browser.");
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  // Browser Print Trigger Fallback
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="container-dg py-6 md:py-10">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/70 print:hidden">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 text-xs font-bold mb-1.5">
              <Sparkles size={14} /> AI-Powered ATS Resume Builder
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
              Build a Job-Ready Resume with AI
            </h1>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setMobilePreviewOpen(!mobilePreviewOpen)}
              className="lg:hidden px-4 py-2 rounded-xl bg-card border border-border text-xs font-bold text-foreground flex items-center gap-1.5 shadow-sm"
            >
              <Eye size={15} /> {mobilePreviewOpen ? "Hide Preview" : "Preview Sheet"}
            </button>

            <button
              type="button"
              onClick={handleOpenDownloadModal}
              className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-md"
            >
              <Download size={15} /> Download Resume
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* GATE / ONBOARDING STEP: Name, Phone, Email & Upload CV Option */}
        {/* ========================================================================= */}
        {!hasOnboarded ? (
          <div className="max-w-2xl mx-auto my-10 p-6 sm:p-10 rounded-3xl bg-card border border-border/80 shadow-2xl space-y-8 animate-fade-in print:hidden">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                <UserCheck size={24} />
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-foreground">
                Let's Personalize Your ATS Resume
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
                Enter your details to generate an ATS-formatted CV. You can also upload your existing resume to speed up the process.
              </p>
            </div>

            {/* Upload CV Box */}
            <div className="p-5 rounded-2xl bg-muted/40 border-2 border-dashed border-border hover:border-primary/50 transition-colors text-center space-y-2">
              <Upload size={24} className="mx-auto text-primary" />
              <div className="text-xs font-bold text-foreground">
                {uploadFileName ? `Loaded: ${uploadFileName}` : "Upload Your Current Resume (Optional)"}
              </div>
              <p className="text-[11px] text-muted-foreground">
                Supported formats: PDF, DOCX (Max 10MB). AI will extract your education and experience.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.docx,.doc"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-4 py-2 rounded-xl bg-card border border-border text-xs font-semibold text-foreground hover:bg-muted transition-colors inline-block"
              >
                {isUploading ? "Scanning Resume..." : "Choose File from Device"}
              </button>
            </div>

            {/* Contact Details Form */}
            <form onSubmit={handleCompleteOnboarding} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-foreground mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Mehta"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    WhatsApp Mobile Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 98765 43210"
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-foreground mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. aarav.mehta@example.com"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black text-sm shadow-xl shadow-primary/25 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 pt-3"
              >
                <span>Explore AI Resume Tools</span>
                <ArrowRight size={16} />
              </button>

              <div className="text-center">
                <span className="text-[11px] text-muted-foreground">
                  🔒 100% Free. Your information is strictly used for generating your ATS resume.
                </span>
              </div>
            </form>
          </div>
        ) : null}

        {/* ========================================================================= */}
        {/* MAIN RESUME BUILDER WORKSPACE (When onboarded) */}
        {/* ========================================================================= */}
        <div className={`grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6 ${!hasOnboarded ? "opacity-30 pointer-events-none select-none" : ""}`}>
          {/* Left Form Column (6 cols) */}
          <div className="lg:col-span-6 space-y-6 print:hidden">
            {/* Quick Styling Bar: Color & Font in the Beginning */}
            <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Palette size={15} style={{ color: selectedColor }} />
                  <span>Color Theme:</span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {RESUME_THEME_COLORS.map((col) => {
                    const isSelected = selectedColor.toLowerCase() === col.hex.toLowerCase();
                    return (
                      <button
                        key={col.id}
                        type="button"
                        title={col.name}
                        onClick={() => {
                          setSelectedColor(col.hex);
                          setResumeData({ ...resumeData, themeColor: col.hex });
                        }}
                        className={`w-6 h-6 rounded-full transition-transform flex items-center justify-center ${
                          isSelected
                            ? "ring-2 ring-offset-2 ring-primary scale-110 shadow-sm"
                            : "hover:scale-105 opacity-80 hover:opacity-100"
                        }`}
                        style={{ backgroundColor: col.hex }}
                      >
                        {isSelected && (
                          <span className="text-[10px] text-white font-black">✓</span>
                        )}
                      </button>
                    );
                  })}
                  {/* Custom color picker */}
                  <label className="relative cursor-pointer flex items-center" title="Custom color">
                    <input
                      type="color"
                      value={selectedColor}
                      onChange={(e) => {
                        setSelectedColor(e.target.value);
                        setResumeData({ ...resumeData, themeColor: e.target.value });
                      }}
                      className="w-6 h-6 p-0 rounded-full border-0 cursor-pointer opacity-0 absolute"
                    />
                    <span className="w-6 h-6 rounded-full border border-dashed border-border flex items-center justify-center text-[10px] text-muted-foreground hover:border-primary">
                      +
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2.5 border-t border-border/50">
                <div className="flex items-center gap-1.5 text-xs font-bold text-foreground">
                  <Type size={15} style={{ color: selectedColor }} />
                  <span>Font:</span>
                </div>
                <div className="flex items-center gap-1 flex-wrap">
                  {RESUME_FONTS.slice(0, 6).map((f) => {
                    const isSelected = selectedFont === f.family;
                    return (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => setSelectedFont(f.family)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                          isSelected
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "bg-muted/70 text-foreground hover:bg-muted"
                        }`}
                        style={{ fontFamily: f.family }}
                      >
                        {f.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Step Navigation Bar */}
            <div className="overflow-x-auto pb-2 -mx-2 px-2 scrollbar-none">
              <div className="flex items-center gap-1.5 min-w-max">
                {STEPS.map((s) => {
                  const isActive = currentStep === s.num;
                  const isDone = currentStep > s.num;
                  return (
                    <button
                      key={s.num}
                      type="button"
                      onClick={() => setCurrentStep(s.num)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-105"
                          : isDone
                          ? "bg-muted text-foreground hover:bg-muted/80"
                          : "bg-card border border-border/70 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      <span
                        className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                          isActive
                            ? "bg-primary-foreground text-primary font-black"
                            : isDone
                            ? "bg-emerald-500 text-white"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {isDone ? "✓" : s.num}
                      </span>
                      <span>{s.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step Content Container */}
            <div className="p-6 rounded-3xl bg-card border border-border/80 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-border/60 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-primary">
                  Step {currentStep} of 13: {STEPS[currentStep - 1]?.label}
                </span>
                <span className="text-[11px] text-muted-foreground">Auto-saved to session</span>
              </div>

              {/* Step 1: Basic Details */}
              {currentStep === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-base font-bold text-foreground">Personal & Contact Info</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor={fullNameId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        Full Name
                      </label>
                      <input
                        id={fullNameId}
                        type="text"
                        value={resumeData.fullName}
                        onChange={(e) => setResumeData({ ...resumeData, fullName: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor={professionalTitleId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        Professional Title
                      </label>
                      <input
                        id={professionalTitleId}
                        type="text"
                        placeholder="e.g. Senior Marketing Specialist"
                        value={resumeData.professionalTitle}
                        onChange={(e) => setResumeData({ ...resumeData, professionalTitle: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor={phoneId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        Phone Number
                      </label>
                      <input
                        id={phoneId}
                        type="text"
                        value={resumeData.phone}
                        onChange={(e) => setResumeData({ ...resumeData, phone: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor={emailId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        Email Address
                      </label>
                      <input
                        id={emailId}
                        type="email"
                        value={resumeData.email}
                        onChange={(e) => setResumeData({ ...resumeData, email: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor={locationId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        Location / City
                      </label>
                      <input
                        id={locationId}
                        type="text"
                        placeholder="e.g. Bengaluru, India"
                        value={resumeData.location}
                        onChange={(e) => setResumeData({ ...resumeData, location: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor={linkedinId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        LinkedIn URL
                      </label>
                      <input
                        id={linkedinId}
                        type="text"
                        placeholder="linkedin.com/in/username"
                        value={resumeData.linkedin}
                        onChange={(e) => setResumeData({ ...resumeData, linkedin: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label htmlFor={portfolioId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        Portfolio / Personal Site URL (Optional)
                      </label>
                      <input
                        id={portfolioId}
                        type="text"
                        placeholder="https://yourportfolio.me"
                        value={resumeData.portfolio}
                        onChange={(e) => setResumeData({ ...resumeData, portfolio: e.target.value })}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Career Goal & Summary */}
              {currentStep === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-foreground">Professional Summary</h3>
                    <button
                      type="button"
                      onClick={() =>
                        setResumeData({
                          ...resumeData,
                          professionalSummary:
                            "Accomplished and growth-oriented professional with a strong track record of executing strategic objectives, optimizing workflows, and delivering measurable business impact across cross-functional environments.",
                        })
                      }
                      className="text-xs text-primary hover:underline font-semibold flex items-center gap-1"
                    >
                      <Wand2 size={13} /> Auto-Generate with AI
                    </button>
                  </div>
                  <label htmlFor={summaryId} className="sr-only">Professional Summary</label>
                  <textarea
                    id={summaryId}
                    rows={6}
                    value={resumeData.professionalSummary}
                    onChange={(e) => setResumeData({ ...resumeData, professionalSummary: e.target.value })}
                    className="w-full p-3.5 rounded-xl bg-background border border-border text-xs sm:text-sm leading-relaxed"
                    placeholder="Write a concise 3-4 line summary detailing your experience, core strengths, and quantified outcomes."
                  />
                </div>
              )}

              {/* Step 3: Education */}
              {currentStep === 3 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-foreground">Academic Credentials</h3>
                    <button
                      type="button"
                      onClick={() =>
                        setResumeData({
                          ...resumeData,
                          education: [
                            ...resumeData.education,
                            { degree: "Online MBA", institution: "Recognized Online University", year: "2024", score: "First Class" },
                          ],
                        })
                      }
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Degree
                    </button>
                  </div>

                  {resumeData.education.map((edu, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...resumeData.education];
                          updated.splice(idx, 1);
                          setResumeData({ ...resumeData, education: updated });
                        }}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={15} />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-0.5">Degree / Course</label>
                          <input
                            type="text"
                            value={edu.degree}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].degree = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-0.5">Passing Year</label>
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].year = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-0.5">University / Board</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].institution = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-0.5">Score / CGPA</label>
                          <input
                            type="text"
                            value={edu.score || ""}
                            onChange={(e) => {
                              const updated = [...resumeData.education];
                              updated[idx].score = e.target.value;
                              setResumeData({ ...resumeData, education: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 4: Experience */}
              {currentStep === 4 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex justify-between items-center">
                    <h3 className="text-base font-bold text-foreground">Work History</h3>
                    <button
                      type="button"
                      onClick={() =>
                        setResumeData({
                          ...resumeData,
                          experiences: [
                            {
                              company: "Enterprise Corp",
                              role: "Lead Strategist",
                              duration: "2024 - Present",
                              bullets: ["Spearheaded key business deliverables and improved workflow efficiency by 30%."],
                            },
                            ...resumeData.experiences,
                          ],
                        })
                      }
                      className="text-xs text-primary hover:underline font-bold flex items-center gap-1"
                    >
                      <Plus size={14} /> Add Role
                    </button>
                  </div>

                  {resumeData.experiences.map((exp, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3 relative">
                      <button
                        type="button"
                        onClick={() => {
                          const updated = [...resumeData.experiences];
                          updated.splice(idx, 1);
                          setResumeData({ ...resumeData, experiences: updated });
                        }}
                        className="absolute top-3 right-3 text-muted-foreground hover:text-red-500"
                        aria-label="Delete entry"
                      >
                        <Trash2 size={15} />
                      </button>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-0.5">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const updated = [...resumeData.experiences];
                              updated[idx].company = e.target.value;
                              setResumeData({ ...resumeData, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-0.5">Role / Title</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              const updated = [...resumeData.experiences];
                              updated[idx].role = e.target.value;
                              setResumeData({ ...resumeData, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-semibold text-muted-foreground mb-0.5">Duration</label>
                          <input
                            type="text"
                            value={exp.duration}
                            onChange={(e) => {
                              const updated = [...resumeData.experiences];
                              updated[idx].duration = e.target.value;
                              setResumeData({ ...resumeData, experiences: updated });
                            }}
                            className="w-full px-3 py-1.5 rounded-lg bg-background border border-border text-xs"
                          />
                        </div>
                      </div>

                      {/* Bullets */}
                      <div>
                        <label className="block text-[11px] font-semibold text-muted-foreground mb-1">
                          Bullet Achievements (1 per line)
                        </label>
                        <textarea
                          rows={3}
                          value={exp.bullets.join("\n")}
                          onChange={(e) => {
                            const updated = [...resumeData.experiences];
                            updated[idx].bullets = e.target.value.split("\n").filter((b) => b.trim().length > 0);
                            setResumeData({ ...resumeData, experiences: updated });
                          }}
                          className="w-full p-2.5 rounded-xl bg-background border border-border text-xs font-mono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Step 5: Skills */}
              {currentStep === 5 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-base font-bold text-foreground">Core Competencies & Keywords</h3>
                  <p className="text-xs text-muted-foreground">
                    ATS crawlers parse your skills section for exact matches. Separate skills with commas:
                  </p>
                  <label htmlFor={skillsId} className="sr-only">Skills list</label>
                  <textarea
                    id={skillsId}
                    rows={4}
                    value={resumeData.skills.join(", ")}
                    onChange={(e) =>
                      setResumeData({
                        ...resumeData,
                        skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
                      })
                    }
                    className="w-full p-3 rounded-xl bg-background border border-border text-xs sm:text-sm leading-relaxed"
                  />
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {resumeData.skills.map((s, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Projects */}
              {currentStep === 6 && (
                <div className="space-y-4 animate-fade-in">
                  <h3 className="text-base font-bold text-foreground">Projects & Initiatives</h3>
                  <div className="space-y-3 p-4 rounded-2xl bg-muted/40 border border-border/70">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Project Title</label>
                      <input
                        type="text"
                        placeholder="e.g. Enterprise CRM Automated Migration"
                        value={newProjectTitle}
                        onChange={(e) => setNewProjectTitle(e.target.value)}
                        className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground mb-1">Project Highlights</label>
                      <textarea
                        rows={2}
                        placeholder="e.g. Migrated 12,000 client records with zero downtime; reduced lead sync lag by 80%."
                        value={newProjectDesc}
                        onChange={(e) => setNewProjectDesc(e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-background border border-border text-xs"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleAddProject}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 shadow-sm"
                    >
                      <Plus size={14} /> Add Project
                    </button>
                  </div>

                  {resumeData.projects && resumeData.projects.length > 0 && (
                    <div className="space-y-2 pt-2">
                      <span className="text-xs font-bold text-muted-foreground uppercase">Current Projects:</span>
                      {resumeData.projects.map((p, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-card border border-border flex justify-between items-start">
                          <div>
                            <div className="text-xs font-bold text-foreground">{p.title}</div>
                            <div className="text-[11px] text-muted-foreground mt-0.5">{p.description}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = [...(resumeData.projects || [])];
                              updated.splice(idx, 1);
                              setResumeData({ ...resumeData, projects: updated });
                            }}
                            className="text-muted-foreground hover:text-red-500"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Step 7: Certifications (NEW INTERACTIVE FORM!) */}
              {currentStep === 7 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Award size={16} /> Professional Certifications & Credentials
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add verified industry certifications, cloud certificates, or professional accreditations.
                  </p>

                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3">
                    <label htmlFor={certInputId} className="block text-xs font-semibold text-muted-foreground">
                      Certification Name & Issuing Organization
                    </label>
                    <div className="flex gap-2">
                      <input
                        id={certInputId}
                        type="text"
                        placeholder="e.g. AWS Certified Solutions Architect - Amazon Web Services"
                        value={newCertInput}
                        onChange={(e) => setNewCertInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && handleAddCertification()}
                        className="flex-1 px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddCertification}
                        className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1 hover:bg-primary/90 transition-colors shrink-0"
                      >
                        <Plus size={14} /> Add
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Current Certifications ({resumeData.certifications?.length || 0}):
                    </span>
                    {resumeData.certifications && resumeData.certifications.length > 0 ? (
                      <div className="space-y-2">
                        {resumeData.certifications.map((cert, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-card border border-border/80 flex items-center justify-between gap-3"
                          >
                            <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                              <span>{cert}</span>
                            </div>
                            <button
                              type="button"
                              onClick={() => handleRemoveCertification(idx)}
                              className="text-muted-foreground hover:text-red-500 transition-colors"
                              aria-label="Remove certification"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-4 rounded-xl bg-muted/20 text-center text-xs text-muted-foreground">
                        No certifications added yet. Enter one above!
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 8: AI Achievement Builder & Quantifier */}
              {currentStep === 8 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 via-purple-500/15 to-primary/10 border border-purple-500/20 space-y-2">
                    <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase tracking-wider">
                      <Sparkles size={16} /> AI Achievement Quantifier
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Describe your accomplishments in simple everyday words. Our AI converts it into an ATS-friendly, quantified achievement bullet!
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label htmlFor={achievementInputId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        What did you improve, manage, or accomplish? (Plain English)
                      </label>
                      <input
                        id={achievementInputId}
                        type="text"
                        placeholder="e.g. I led the social media team and increased video views and followers"
                        value={simpleAchievement}
                        onChange={(e) => setSimpleAchievement(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label htmlFor={metricInputId} className="block text-xs font-semibold text-muted-foreground mb-1">
                        Any specific metric or percentage? (Optional: e.g. 15x organic growth / 35% ROAS increase)
                      </label>
                      <input
                        id={metricInputId}
                        type="text"
                        placeholder="e.g. 35% increase in ROAS"
                        value={quantMetric}
                        onChange={(e) => setQuantMetric(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={handleTransformAchievement}
                      className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center gap-2 transition-colors shadow-sm"
                    >
                      <Wand2 size={14} /> Turn into Professional Achievement
                    </button>

                    {aiOptimizedBullet && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-3 mt-3 animate-fade-in">
                        <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">
                          ✓ Generated Professional Bullet:
                        </span>
                        <p className="text-xs sm:text-sm text-foreground font-medium italic">
                          "{aiOptimizedBullet}"
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={handleAddAIBulletToAchievements}
                            className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors"
                          >
                            + Add to Key Achievements Section
                          </button>
                          <button
                            type="button"
                            onClick={handleAddAIBulletToExperience}
                            className="px-3.5 py-1.5 rounded-lg bg-card border border-border hover:bg-muted text-foreground text-xs font-bold transition-colors"
                          >
                            + Insert into First Work Experience
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Current Achievements List */}
                    {resumeData.achievements && resumeData.achievements.length > 0 && (
                      <div className="space-y-2 pt-3 border-t border-border/60">
                        <span className="text-xs font-bold text-muted-foreground uppercase">
                          Saved Key Achievements:
                        </span>
                        {resumeData.achievements.map((ach, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-card border border-border/70 flex justify-between items-start gap-2">
                            <span className="text-xs text-foreground font-medium">{ach}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const updated = [...(resumeData.achievements || [])];
                                updated.splice(idx, 1);
                                setResumeData({ ...resumeData, achievements: updated });
                              }}
                              className="text-muted-foreground hover:text-red-500 shrink-0"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 9: Languages (NEW INTERACTIVE FORM!) */}
              {currentStep === 9 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Languages size={16} /> Languages & Communication Proficiency
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Add languages you speak and specify your proficiency level for domestic and multinational roles.
                  </p>

                  <div className="p-4 rounded-2xl bg-muted/40 border border-border/70 space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Language
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. English, Hindi, German, Spanish"
                          value={newLangName}
                          onChange={(e) => setNewLangName(e.target.value)}
                          className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-muted-foreground mb-1">
                          Proficiency Level
                        </label>
                        <select
                          value={newLangLevel}
                          onChange={(e) => setNewLangLevel(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm font-medium focus:ring-2 focus:ring-primary/40 focus:outline-none"
                        >
                          <option value="Native / Bilingual">Native / Bilingual</option>
                          <option value="Fluent / Professional">Fluent / Professional</option>
                          <option value="Full Working Proficiency">Full Working Proficiency</option>
                          <option value="Conversational">Conversational</option>
                          <option value="Basic / Elementary">Basic / Elementary</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddLanguage}
                      className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm"
                    >
                      <Plus size={14} /> Add Language
                    </button>
                  </div>

                  {/* Current Displayed Languages string */}
                  <div className="p-4 rounded-2xl bg-card border border-border space-y-2">
                    <span className="text-xs font-bold text-muted-foreground uppercase">
                      Current Language Summary on Resume:
                    </span>
                    <input
                      type="text"
                      value={resumeData.languages}
                      onChange={(e) => setResumeData({ ...resumeData, languages: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-background border border-border text-xs sm:text-sm"
                    />
                    <p className="text-[11px] text-muted-foreground">
                      Edit the final text above directly if needed.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 10 & 11: Job Match & ATS Score */}
              {(currentStep === 10 || currentStep === 11) && (
                <div className="space-y-4 animate-fade-in">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Target size={16} /> Job Match & ATS Score Analyzer
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Paste the target job description. We'll scan required keywords, match your credentials, and highlight gaps.
                  </p>

                  <label htmlFor={jdInputId} className="sr-only">Target Job Description</label>
                  <textarea
                    id={jdInputId}
                    rows={4}
                    placeholder="Paste job requirements or key responsibilities from LinkedIn, Naukri, or Company website..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                    className="w-full p-3 rounded-xl bg-background border border-border text-xs sm:text-sm"
                  />

                  <button
                    type="button"
                    onClick={handleRunAtsCheck}
                    className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    <SlidersHorizontal size={14} /> Calculate ATS Match Score
                  </button>

                  {atsScore !== null && (
                    <div className="p-4 rounded-2xl bg-card border border-border/80 shadow-sm space-y-3 animate-fade-in">
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-xs text-muted-foreground">ATS Compatibility Score</span>
                          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                            {atsScore}% Match
                          </div>
                        </div>
                        <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                          Job Ready
                        </span>
                      </div>

                      {missingKeywords.length > 0 && (
                        <div>
                          <p className="text-[11px] font-semibold text-muted-foreground mb-1.5">
                            Recommended Keywords to Consider Adding:
                          </p>
                          <div className="flex flex-wrap gap-1.5">
                            {missingKeywords.map((kw, i) => (
                              <span key={i} className="px-2 py-0.5 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-400 text-[11px] font-bold">
                                + {kw}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 12: Theme & Palette */}
              {currentStep === 12 && (
                <div className="space-y-5 animate-fade-in">
                  <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider">
                    <Palette size={16} /> Choose Accent Color Palette
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Choose an accent color for your resume name, headings, and divider lines.
                  </p>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {RESUME_THEME_COLORS.map((col) => {
                      const isSelected = selectedColor.toLowerCase() === col.hex.toLowerCase();
                      return (
                        <button
                          key={col.id}
                          type="button"
                          onClick={() => {
                            setSelectedColor(col.hex);
                            setResumeData({ ...resumeData, themeColor: col.hex });
                          }}
                          className={`p-3 rounded-2xl border text-left flex items-center gap-3 transition-all ${
                            isSelected
                              ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/30"
                              : "border-border bg-card hover:bg-muted"
                          }`}
                        >
                          <span
                            className="w-5 h-5 rounded-full shrink-0 shadow-sm"
                            style={{ backgroundColor: col.hex }}
                          />
                          <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold text-foreground truncate">{col.name}</span>
                            <span className="text-[10px] text-muted-foreground">{col.hex}</span>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <div className="pt-4 border-t border-border/60">
                    <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider mb-1">
                      <Type size={16} /> ATS Font Selection & Typography
                    </div>
                    <p className="text-xs text-muted-foreground mb-3">
                      Select an ATS-compliant typeface tailored for high readability across recruiter screening systems.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {RESUME_FONTS.map((f) => {
                        const isSelected = selectedFont === f.family;
                        return (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setSelectedFont(f.family)}
                            className={`p-3 rounded-2xl border text-left transition-all space-y-1 ${
                              isSelected
                                ? "border-primary bg-primary/10 shadow-sm ring-2 ring-primary/30"
                                : "border-border bg-card hover:bg-muted"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-foreground" style={{ fontFamily: f.family }}>
                                {f.name}
                              </span>
                              <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-primary/10 text-primary font-bold">
                                {f.badge}
                              </span>
                            </div>
                            <p className="text-[11px] text-muted-foreground leading-snug">
                              {f.description}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 13: Download PDF */}
              {currentStep === 13 && (
                <div className="space-y-4 animate-fade-in text-center p-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                    <Printer size={24} />
                  </div>
                  <h3 className="text-xl font-black text-foreground">Your ATS Resume is Ready!</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto leading-relaxed">
                    Click the button below to open your print dialog. Select <strong>Save as PDF</strong> or <strong>Microsoft Print to PDF</strong> with Paper size set to <strong>A4</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={handleOpenDownloadModal}
                    className="px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs sm:text-sm shadow-xl shadow-emerald-600/25 transition-all inline-flex items-center gap-2"
                  >
                    <Download size={16} /> Download ATS PDF (A4)
                  </button>
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="pt-4 flex items-center justify-between border-t border-border/60">
                <button
                  type="button"
                  disabled={currentStep === 1}
                  onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                  className="px-4 py-2 rounded-xl bg-muted text-foreground text-xs font-semibold disabled:opacity-40 flex items-center gap-1.5 hover:bg-muted/80 transition-colors"
                >
                  <ArrowLeft size={14} /> Previous
                </button>

                {currentStep < 13 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStep(Math.min(13, currentStep + 1))}
                    className="px-5 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-bold flex items-center gap-1.5 hover:bg-primary/90 transition-colors shadow-sm"
                  >
                    Next: {STEPS[currentStep]?.label || "Next"} <ChevronRight size={14} />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleOpenDownloadModal}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 hover:bg-emerald-700 transition-colors shadow-md"
                  >
                    <Download size={15} /> Download PDF
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Live ATS Sheet Preview (Right 6 cols & Mobile Preview) */}
          <div className={`lg:col-span-6 sticky top-24 ${mobilePreviewOpen ? "block" : "hidden lg:block"}`}>
            <div className="p-3 bg-muted/40 rounded-3xl border border-border/80 shadow-xl overflow-auto max-h-[85vh]">
              <div className="flex justify-between items-center px-3 py-2 text-xs font-bold text-muted-foreground print:hidden">
                <span>ATS Resume Sheet (A4 Reference Layout)</span>
                <span className="text-emerald-500 flex items-center gap-1">
                  <ShieldCheck size={14} /> 100% ATS Compliant
                </span>
              </div>
              <div className="bg-white rounded-xl shadow-inner overflow-hidden">
                <ResumePaper data={resumeData} selectedColor={selectedColor} selectedFont={selectedFont} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* LEAD CAPTURE DIALOG BEFORE PDF DOWNLOAD */}
      {/* ========================================================================= */}
      <Dialog open={downloadModalOpen} onOpenChange={setDownloadModalOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl p-6 sm:p-7 border-border/80 shadow-2xl bg-card">
          <DialogHeader className="space-y-2 text-center sm:text-left">
            <div className="w-11 h-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-1">
              <FileDown size={24} />
            </div>
            <DialogTitle className="text-xl font-black text-foreground">
              Download Your ATS Resume
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Enter your basic contact details below to personalize your resume and download the official high-resolution PDF file.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleConfirmDownloadPdf} className="space-y-4 pt-2">
            {downloadError && (
              <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold">
                {downloadError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <User size={13} className="text-primary" /> Full Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Aarav Mehta"
                value={leadName}
                onChange={(e) => setLeadName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Phone size={13} className="text-primary" /> Mobile / WhatsApp Number *
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-muted-foreground">+91</span>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  placeholder="9876543210"
                  value={leadPhone.replace(/^\+91\s*/, "")}
                  onChange={(e) => setLeadPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                  className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs font-medium focus:ring-2 focus:ring-primary focus:outline-none"
                />
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 block">
                We'll also send an ATS backup copy to your WhatsApp.
              </span>
            </div>

            <div>
              <label className="block text-xs font-bold text-foreground mb-1.5 flex items-center gap-1.5">
                <Mail size={13} className="text-primary" /> Email Address *
              </label>
              <input
                type="email"
                required
                placeholder="aarav.mehta@gmail.com"
                value={leadEmail}
                onChange={(e) => setLeadEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-input bg-background text-foreground text-xs focus:ring-2 focus:ring-primary focus:outline-none"
              />
            </div>

            <div className="pt-2 space-y-2">
              <button
                type="submit"
                disabled={isDownloadingPdf}
                className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-black text-xs sm:text-sm flex items-center justify-center gap-2 hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 disabled:opacity-50"
              >
                {isDownloadingPdf ? (
                  <>
                    <Loader2 size={16} className="animate-spin" /> Generating High-Res PDF...
                  </>
                ) : (
                  <>
                    <Download size={16} /> Download Resume (PDF)
                  </>
                )}
              </button>

              <div className="flex items-center justify-between pt-1 text-[11px] text-muted-foreground">
                <button
                  type="button"
                  onClick={() => {
                    setDownloadModalOpen(false);
                    handlePrint();
                  }}
                  className="hover:text-primary transition-colors flex items-center gap-1 underline underline-offset-2"
                >
                  <Printer size={12} /> Or print via system dialog
                </button>
                <button
                  type="button"
                  onClick={() => setDownloadModalOpen(false)}
                  className="hover:text-foreground transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResumeBuilder;
