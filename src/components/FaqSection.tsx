import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "./Reveal";

const DEFAULT_FAQS = [
  {
    q: "Is the counseling really 100% free? What's the catch?",
    a: "Absolutely free, with zero hidden fees. Degree Guru operates as an independent discovery and advisory platform for learners. You never pay anything — not for counseling, not for comparison, not for career tools or resume building. We are not agents of universities; our sole mission is to guide learners to the right accredited programs and career trajectories.",
  },
  {
    q: "Are UGC-DEB online degrees valid for government jobs and higher studies?",
    a: "Yes. Degrees from UGC-DEB approved universities are fully recognized by the Government of India, UPSC, state PSCs, and most private employers. They are equivalent to regular campus degrees for the purpose of job applications and further education like PhD admission.",
  },
  {
    q: "How is an online degree different from a distance learning degree?",
    a: "Online degrees are delivered via a Learning Management System (LMS) with live classes, recorded lectures, digital assignments and proctored online exams. Distance learning typically involves self-study with minimal digital interaction. Online degrees generally have stronger industry recognition today.",
  },
  {
    q: "Can I do an online degree while working full-time?",
    a: "That's exactly who online degrees are designed for. Most programs offer recorded lectures you can watch anytime, weekend live sessions, and flexible assignment deadlines. Many of our students are working professionals who study 10–15 hours per week.",
  },
  {
    q: "What EMI options are available and what is the minimum fee?",
    a: "Most universities offer no-cost EMI through partner banks and NBFCs. Programs start from as low as ₹3,500 per month for a Bachelor's degree. Our counselors will walk you through the exact fee structure, scholarship eligibility, and EMI options specific to each university — at no charge.",
  },
  {
    q: "How long does it take for a counselor to call me back?",
    a: "Our counselors typically connect promptly after form submission during working hours (9 AM – 8 PM, all 7 days). You can also reach us instantly on WhatsApp for immediate guidance.",
  },
  {
    q: "Which universities does Degree Guru work with?",
    a: "We work with 50+ top UGC-DEB approved universities including Amity Online, NMIMS Online, OP Jindal Global University, Lovely Professional University (LPU), Amrita Vishwa Vidyapeetham, Shoolini University, Galgotias University, and more. We help you compare them all honestly.",
  },
];

interface FaqItem { q: string; a: string; }
interface Props { faqs?: FaqItem[]; }

export const FaqSection = ({ faqs }: Props) => {
  const items = faqs && faqs.length > 0 ? faqs : DEFAULT_FAQS;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="py-12 md:py-24 relative">
      <div className="absolute inset-0 dot-grid opacity-40 pointer-events-none" />
      <div className="container-dg relative">
        <Reveal>
          <div className="max-w-2xl mb-8 md:mb-14">
            <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-4">
              Got Questions?
            </span>
            <h2 className="text-3xl md:text-[40px] font-bold mb-4 leading-tight">
              Frequently Asked <span className="text-gradient">Questions</span>
            </h2>
            <p className="text-soft text-lg">Everything you need to know before you enroll.</p>
          </div>
        </Reveal>

        <div className="max-w-3xl space-y-3">
          {items.map((faq, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <div className={`faq-item bg-card ${open === i ? "border-primary/40 shadow-lg shadow-primary/5" : ""}`}>
                <button
                  className="faq-question"
                  onClick={() => setOpen(open === i ? null : i)}
                  aria-expanded={open === i}
                >
                  <span className="pr-4">{faq.q}</span>
                  <span
                    className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
                    style={{
                      background: open === i ? "hsl(var(--primary))" : "hsl(var(--primary) / 0.1)",
                      color: open === i ? "#fff" : "hsl(var(--primary))",
                    }}
                  >
                    {open === i ? <Minus size={14} /> : <Plus size={14} />}
                  </span>
                </button>
                <div
                  style={{
                    maxHeight: open === i ? "400px" : "0",
                    overflow: "hidden",
                    transition: "max-height 0.38s cubic-bezier(0.4,0,0.2,1)",
                  }}
                >
                  <p className="px-6 pb-5 text-soft leading-relaxed text-[15px]">{faq.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};
