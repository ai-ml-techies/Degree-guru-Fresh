import { useState } from "react";
import { Plus, Minus } from "lucide-react";
import { Reveal } from "./Reveal";

const DEFAULT_FAQS = [
  {
    q: "Is the counseling really 100% free? What's the catch?",
    a: "Absolutely free, no catch. Degree Guru is supported by our university partners who pay us a placement fee when a student enrolls. You never pay anything — not for counseling, not for comparison, not for guidance. Our incentive is to match you with the right program, not the most expensive one.",
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
    a: "Our counselors typically call within 2 hours of form submission during working hours (9 AM – 8 PM, all 7 days). You can also reach us instantly on WhatsApp for a quicker response.",
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

        <Reveal>
          <div className="mt-10 flex items-center gap-4">
            <p className="text-soft text-sm">Still have questions?</p>
            <a
              href="https://wa.me/919350199001?text=Hi%2C%20I%20have%20a%20question%20about%20online%20degrees"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:shadow-lg hover:shadow-green-500/30 transition-all hover:-translate-y-0.5"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              Ask on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
};
