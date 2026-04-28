import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { CounselingForm } from "@/components/CounselingForm";
import { Phone, Mail, MapPin, Clock, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  { q: "Is career counseling really free?", a: "Yes. Completely free for every student. Our partner universities support our work, so you pay nothing." },
  { q: "How does online degree guidance work?", a: "Share your profile, we recommend programs and universities that fit you, and then guide you through the application process." },
  { q: "Can working professionals apply for online bachelors?", a: "Absolutely. Our online programs are designed for both fresh learners and working professionals." },
  { q: "Who can apply for Class 10 or 12 online?", a: "Anyone who missed formal schooling or wants to complete it from home. Talk to us to check your eligibility." },
];

const Contact = () => (
  <>
    <section className="relative py-20 overflow-hidden">
      <Blobs />
      <div className="container-dg relative z-10 max-w-3xl text-center">
        <Reveal>
          <p className="overline mb-4">Contact</p>
          <h1 className="text-[40px] md:text-[60px] font-extrabold leading-[1.05] mb-5">
            We are Here to Help You Decide
          </h1>
          <p className="text-soft text-lg">Free counseling for online degrees and career moves.</p>
        </Reveal>
      </div>
    </section>

    <section className="pb-24">
      <div className="container-dg grid lg:grid-cols-5 gap-10">
        <Reveal className="lg:col-span-3">
          <CounselingForm buttonLabel="Get My Free Counseling Session" />
        </Reveal>
        <Reveal delay={0.1} className="lg:col-span-2">
          <div className="glass p-8 space-y-5">
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><Phone size={18} className="text-primary" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">Phone</div>
                <div className="font-bold">9350199001</div>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><Mail size={18} className="text-primary" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">Email</div>
                <div className="font-bold">admissions@degreeguru.in</div>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><Clock size={18} className="text-primary" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">Hours</div>
                <div className="font-bold">Mon to Sat, 9 AM to 8 PM IST</div>
                <div className="text-xs text-soft mt-1">We reply within 2 hours</div>
              </div>
            </div>
            <div className="flex gap-4 items-start">
              <div className="w-11 h-11 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><MapPin size={18} className="text-primary" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">Location</div>
                <div className="font-bold">Gurugram, Haryana, India</div>
              </div>
            </div>
            <a
              href="https://wa.me/919350199001"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 bg-[#25D366] text-white rounded-full px-5 py-3 font-semibold text-sm w-full justify-center"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="py-20">
      <div className="container-dg max-w-3xl">
        <Reveal>
          <p className="overline mb-3 text-center">FAQ</p>
          <h2 className="text-3xl md:text-[40px] font-bold text-center mb-10">Common Questions</h2>
          <div className="glass p-4 md:p-8">
            <Accordion type="single" collapsible>
              {faqs.map((f, i) => (
                <AccordionItem key={i} value={`f${i}`} className="border-b border-foreground/10 last:border-0">
                  <AccordionTrigger className="text-left font-semibold hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-soft leading-relaxed">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Reveal>
      </div>
    </section>
  </>
);

export default Contact;
