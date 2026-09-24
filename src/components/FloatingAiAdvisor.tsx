import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Sparkles, 
  X, 
  Bot, 
  GraduationCap, 
  Building2, 
  Briefcase, 
  FileText, 
  Calculator, 
  Compass, 
  MessageCircle, 
  ArrowRight,
  Send,
  HelpCircle
} from "lucide-react";
import { askGeminiAdvisor } from "@/services/geminiService";

type Message = {
  id: string;
  sender: "bot" | "user";
  text: string;
  options?: { label: string; action: () => void; link?: string }[];
};

export const FloatingAiAdvisor = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState<boolean>(false);

  // Initial prompt templates
  const resetConversation = () => {
    setMessages([
      {
        id: "m-init-1",
        sender: "bot",
        text: "👋 Hi! I'm Degree Guru AI. What are you interested in exploring today?",
        options: [
          {
            label: "🎓 Online Master's (MBA, MCA, etc.)",
            action: () => handleSelect("Online Master's"),
          },
          {
            label: "🏛️ Online Bachelor's (BCA, BBA, B.Com)",
            action: () => handleSelect("Online Bachelor's"),
          },
          {
            label: "🎯 Class 10 & 12 (Direct Online Exams)",
            action: () => handleSelect("Class 10 & 12"),
          },
          {
            label: "💼 Find Jobs & Career Switch",
            action: () => handleSelect("Jobs & Career"),
          },
          {
            label: "📄 Build ATS Resume (Free)",
            action: () => handleSelect("Resume Builder"),
          },
          {
            label: "💰 Calculate Degree ROI",
            action: () => handleSelect("ROI Calculator"),
          },
        ],
      },
    ]);
  };

  useEffect(() => {
    resetConversation();
  }, []);

  const handleSelect = (choice: string) => {
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: choice,
    };

    let botResponse: Message;

    if (choice === "Online Master's") {
      botResponse = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "Great! Online Master's programs (like Online MBA, Online MCA, and Online M.Com) offer UGC-DEB recognition with 100% remote proctored exams and zero commute. Which degree catches your interest?",
        options: [
          { label: "Online MBA (Top Pick)", action: () => {}, link: "/online-mba" },
          { label: "Online MCA (Tech)", action: () => {}, link: "/online-mca" },
          { label: "Online M.Com (Commerce)", action: () => {}, link: "/online-mcom" },
          { label: "Compare All Universities", action: () => {}, link: "/universities/compare" },
        ],
      };
    } else if (choice === "Online Bachelor's") {
      botResponse = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "Online Bachelor's degrees allow you to build an accredited undergraduate qualification while working or learning practical skills in parallel. Top choices:",
        options: [
          { label: "Online BCA (Software / Coding)", action: () => {}, link: "/online-bca" },
          { label: "Online BBA (Management)", action: () => {}, link: "/online-bba" },
          { label: "Online B.Com (Finance)", action: () => {}, link: "/online-bcom" },
          { label: "Browse All Bachelor's", action: () => {}, link: "/courses" },
        ],
      };
    } else if (choice === "Class 10 & 12") {
      botResponse = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "You can complete recognized Secondary (Class 10) or Senior Secondary (Class 12) through 100% online exams — even if you never attended formal school or lack an 8th/9th marksheet! Please note: One-time fee, strictly no EMI.",
        options: [
          { label: "Class 10 Details & Admission", action: () => {}, link: "/class-10" },
          { label: "Class 12 Details & Streams", action: () => {}, link: "/class-12" },
        ],
      };
    } else if (choice === "Jobs & Career") {
      botResponse = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "Degree Guru provides a 100% free employment marketplace connecting qualified learners directly to employers, plus a scenario-based Career Finder.",
        options: [
          { label: "Explore Job Openings", action: () => {}, link: "/jobs/job-seeker" },
          { label: "Take Free Career Finder", action: () => {}, link: "/career-finder" },
        ],
      };
    } else if (choice === "Resume Builder") {
      botResponse = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "Our AI ATS Resume Builder turns your accomplishments into quantified, recruiter-ready bullet points and formats them into an ATS-friendly A4 layout.",
        options: [
          { label: "Launch AI Resume Builder", action: () => {}, link: "/resume-builder" },
        ],
      };
    } else if (choice === "ROI Calculator") {
      botResponse = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "Estimate how fast your degree pays for itself with salary hike projections, monthly EMI calculations, and estimated payback timelines.",
        options: [
          { label: "Open Degree ROI Calculator", action: () => {}, link: "/roi-calculator" },
        ],
      };
    } else {
      botResponse = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: `Got it! We have comprehensive guides, university comparisons, and free counseling for ${choice}. Would you like to chat with an academic advisor?`,
        options: [
          { label: "Explore Online Degrees", action: () => {}, link: "/courses" },
          { label: "Compare Universities", action: () => {}, link: "/universities/compare" },
        ],
      };
    }

    setMessages((prev) => [...prev, userMsg, botResponse]);
  };

  const handleCustomSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isTyping) return;
    const query = userInput.trim();
    setUserInput("");

    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: query,
    };

    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      const history = messages.map((m) => ({
        role: m.sender === "user" ? ("user" as const) : ("model" as const),
        text: m.text,
      }));

      const aiReply = await askGeminiAdvisor(query, history);

      const botMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: aiReply,
        options: [
          { label: "Explore Online Degrees", action: () => {}, link: "/courses" },
          { label: "Compare Universities", action: () => {}, link: "/universities/compare" },
          { label: "Calculate 0% EMI", action: () => {}, link: "/emi-calculator" },
        ],
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error("Gemini advisor error:", err);
      const fallbackMsg: Message = {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: "I am here to help you discover the right accredited online degree and compare universities across India. Which course or field are you interested in?",
        options: [
          { label: "Explore Online Degrees", action: () => {}, link: "/courses" },
          { label: "Compare Universities", action: () => {}, link: "/universities/compare" },
        ],
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed right-4 sm:right-6 bottom-20 md:bottom-8 z-[90]">
      {/* Bot Chat Window */}
      {isOpen && (
        <div className="mb-3 w-[92vw] sm:w-[380px] max-w-[400px] h-[520px] max-h-[80vh] rounded-3xl bg-card border border-border shadow-2xl flex flex-col overflow-hidden animate-slide-up backdrop-blur-lg">
          {/* Header */}
          <div className="px-5 py-4 bg-gradient-to-r from-[#6528f7] via-[#7c3aed] to-[#551ebd] text-white flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-2xl bg-white/15 flex items-center justify-center font-bold text-white shadow-inner">
                <Bot size={20} />
              </div>
              <div>
                <div className="text-sm font-extrabold flex items-center gap-1.5 leading-tight">
                  Degree Guru AI Advisor
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>
                <div className="text-[11px] text-white/80 font-medium">Powered by Gemini AI • Real-time Guidance</div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
              aria-label="Close AI Advisor"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages Flow */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 text-xs">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`flex flex-col ${m.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] p-3.5 rounded-2xl leading-relaxed whitespace-pre-line ${
                    m.sender === "user"
                      ? "bg-primary text-primary-foreground font-semibold rounded-br-none"
                      : "bg-muted text-foreground border border-border/80 rounded-bl-none shadow-sm"
                  }`}
                >
                  {m.text}
                </div>

                {/* Interactive Option Chips */}
                {m.options && m.options.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2.5 max-w-[95%]">
                    {m.options.map((opt, idx) =>
                      opt.link ? (
                        <Link
                          key={idx}
                          to={opt.link}
                          onClick={() => setIsOpen(false)}
                          className="px-3 py-1.5 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground border border-border text-foreground font-semibold text-[11px] transition-all flex items-center gap-1 shadow-sm"
                        >
                          {opt.label} <ArrowRight size={11} />
                        </Link>
                      ) : (
                        <button
                          key={idx}
                          type="button"
                          onClick={opt.action}
                          className="px-3 py-1.5 rounded-xl bg-card hover:bg-primary hover:text-primary-foreground border border-border text-foreground font-semibold text-[11px] transition-all flex items-center gap-1 text-left shadow-sm"
                        >
                          {opt.label}
                        </button>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex flex-col items-start animate-fade-in">
                <div className="p-3 rounded-2xl bg-muted text-foreground border border-border/80 rounded-bl-none shadow-sm flex items-center gap-2">
                  <Sparkles size={14} className="text-primary animate-spin" />
                  <span className="text-[11px] font-semibold text-muted-foreground">Thinking with Gemini AI...</span>
                </div>
              </div>
            )}
          </div>

          {/* Quick WhatsApp Link & Input */}
          <div className="p-3 border-t border-border/60 bg-muted/30 space-y-2">
            <form onSubmit={handleCustomSend} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Ask e.g. 'Online MBA fees'..."
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-card border border-border text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 text-foreground"
              />
              <button
                type="submit"
                className="w-8 h-8 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shrink-0 hover:bg-primary/90 transition-colors"
                aria-label="Send message"
              >
                <Send size={14} />
              </button>
            </form>

            <div className="flex items-center justify-between text-[10px] text-muted-foreground pt-1">
              <button
                type="button"
                onClick={resetConversation}
                className="hover:underline flex items-center gap-1"
              >
                Reset Chat
              </button>
              <a
                href="https://wa.me/919350199001?text=Hi%20Degree%20Guru%2C%20I%20need%20human%20career%20counseling"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline flex items-center gap-1"
              >
                <MessageCircle size={12} /> Talk to Counselor
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Floating Bot Launch Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close AI Advisor" : "Open AI Career Advisor"}
        className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl text-white group"
        style={{
          background: isOpen
            ? "hsl(0 0% 20%)"
            : "linear-gradient(135deg, #6528f7, #8f62f9)",
          boxShadow: isOpen
            ? "0 8px 24px rgba(0,0,0,0.3)"
            : "0 8px 28px rgba(101, 40, 247, 0.55)",
        }}
      >
        {/* Animated Glow Rings when closed */}
        {!isOpen && (
          <>
            <span className="absolute inset-0 rounded-full animate-ping opacity-30 bg-[#6528f7]" />
            <span className="absolute inset-[-4px] rounded-full border-2 border-primary/40 animate-wa-ping" />
          </>
        )}

        <span className="relative transition-transform duration-300">
          {isOpen ? (
            <X size={24} />
          ) : (
            <div className="flex flex-col items-center justify-center">
              <Bot size={24} className="group-hover:scale-110 transition-transform" />
              <span className="text-[9px] font-black uppercase tracking-wider mt-0.5">Ask AI</span>
            </div>
          )}
        </span>

        {/* Floating Tooltip Label */}
        {!isOpen && (
          <div className="absolute right-[72px] bottom-3 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-full whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity shadow-lg">
            Ask Degree Guru AI
          </div>
        )}
      </button>
    </div>
  );
};
