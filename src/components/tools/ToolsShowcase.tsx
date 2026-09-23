import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Calculator, 
  Compass, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  HelpCircle, 
  Laptop, 
  Sparkles, 
  Percent, 
  ArrowRight,
  Bot,
  Layers
} from "lucide-react";
import { useLeadGate } from "@/context/LeadGateContext";

interface ToolItem {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  badge?: string;
  link: string;
  category: "pre" | "post" | "all";
}

const TOOLS_LIST: ToolItem[] = [
  {
    id: "emi",
    title: "EMI Calculator",
    description: "Calculate 0% interest monthly installments & loan tenure",
    icon: <Calculator size={22} className="text-amber-500" />,
    badge: "0% No-Cost",
    link: "/emi-calculator",
    category: "pre",
  },
  {
    id: "career-finder",
    title: "Career Finder",
    description: "12-dimension strength benchmark & ideal degree match",
    icon: <Compass size={22} className="text-[#6528f7]" />,
    badge: "100% Free",
    link: "/career-finder",
    category: "pre",
  },
  {
    id: "roi",
    title: "Is Your Degree Worth It? (ROI)",
    description: "Salary jump, payback months & career earnings forecast",
    icon: <TrendingUp size={22} className="text-emerald-500" />,
    badge: "+55% Hike",
    link: "/roi-calculator",
    category: "pre",
  },
  {
    id: "resume",
    title: "AI Resume Builder",
    description: "Job-ready ATS-score optimizer & quantifiable achievements",
    icon: <FileText size={22} className="text-purple-500" />,
    badge: "ATS Score",
    link: "/resume-builder",
    category: "post",
  },
  {
    id: "compare",
    title: "Compare Universities",
    description: "Side-by-side fees, exams, approvals & LMS comparison",
    icon: <Layers size={22} className="text-primary" />,
    badge: "Objective",
    link: "/universities/compare",
    category: "pre",
  },
  {
    id: "verify",
    title: "Verify University",
    description: "Statutory UGC-DEB, AICTE & NAAC grade authenticity check",
    icon: <ShieldCheck size={22} className="text-emerald-600" />,
    badge: "Fake Alert",
    link: "/universities",
    category: "pre",
  },
  {
    id: "ai-bot",
    title: "Will AI Take My Job?",
    description: "Evaluate your role's automation risk & upskilling degrees",
    icon: <Bot size={22} className="text-rose-500" />,
    badge: "Future Proof",
    link: "/career-finder",
    category: "pre",
  },
  {
    id: "coupons",
    title: "University Coupons & Grants",
    description: "Check available institutional fee concessions & grants",
    icon: <Percent size={22} className="text-[#6528f7]" />,
    badge: "Up to ₹20k",
    link: "/referral",
    category: "pre",
  },
];

export const ToolsShowcase = () => {
  const [filter, setFilter] = useState<"all" | "pre" | "post">("all");
  const navigate = useNavigate();
  const { requireContact } = useLeadGate();

  const filteredTools = TOOLS_LIST.filter(
    (t) => filter === "all" || t.category === filter || t.category === "all"
  );

  const handleToolClick = (t: ToolItem) => {
    requireContact(
      () => {
        navigate(t.link);
      },
      t.title,
      true // Mandatory for tools!
    );
  };

  return (
    <div className="space-y-8">
      {/* Header with Pre/Post Admission Tabs (College Vidya Inspired) */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-2">
            <Sparkles size={13} /> Decide with Clarity
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-foreground tracking-tight">
            Tools, Calculators & More — All in One Place
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Empowering students with unbiased financial, career, and admission intelligence.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 bg-muted/60 p-1.5 rounded-2xl border border-border shrink-0 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "all"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All Tools
          </button>
          <button
            type="button"
            onClick={() => setFilter("pre")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "pre"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Pre-Admission
          </button>
          <button
            type="button"
            onClick={() => setFilter("post")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
              filter === "post"
                ? "bg-card text-foreground shadow-sm border border-border/80"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Career & Post-Admission
          </button>
        </div>
      </div>

      {/* Tools Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredTools.map((tool) => (
          <div
            key={tool.id}
            onClick={() => handleToolClick(tool)}
            className="p-5 rounded-2xl bg-card border border-border/80 hover:border-primary/60 hover:shadow-lg transition-all flex flex-col justify-between space-y-4 group cursor-pointer"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-11 h-11 rounded-2xl bg-muted/70 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {tool.icon}
                </div>
                {tool.badge && (
                  <span className="px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-extrabold">
                    {tool.badge}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                  {tool.title}
                </h4>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                  {tool.description}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-border/50 flex items-center text-xs font-bold text-primary group-hover:underline gap-1">
              <span>Open Tool</span>
              <ArrowRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ToolsShowcase;
