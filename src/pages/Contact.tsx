import { Reveal } from "@/components/Reveal";
import { Blobs } from "@/components/Blobs";
import { CounselingForm } from "@/components/CounselingForm";
import { Phone, Mail, MapPin, MessageCircle, CalendarCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import contactHero from "@/assets/contact-hero.jpg";

const faqs = [
  { q: "Is career counseling really free?", a: "Yes. Completely free for every student. Our partner universities support our work, so you pay nothing." },
  { q: "Do you offer easy EMI options?", a: "Yes. Most of our partner universities offer no-cost or low-cost EMI plans, so you can spread your fees comfortably." },
  { q: "How does online degree guidance work?", a: "Share your profile, we recommend programs and universities that fit you, and then guide you through the application process." },
  { q: "Can working professionals apply for online bachelors?", a: "Absolutely. Our online programs are designed for both fresh learners and working professionals." },
  { q: "Who can apply for Class 10 or 12 online?", a: "Anyone who missed formal schooling or wants to complete it from home. Talk to us to check your eligibility." },
];

const Contact = () => (
  <>
    <section className="relative py-20 overflow-hidden">
      <Blobs />
      <div className="container-dg relative z-10 grid lg:grid-cols-2 gap-12 items-center">
        <Reveal>
          <p className="overline mb-4">Talk To Us</p>
          <h1 className="text-[40px] md:text-[60px] font-extrabold leading-[1.05] mb-5">
            Free Counseling. Honest Answers.
          </h1>
          <p className="text-soft text-lg">A real human counselor will call you back within 2 hours. No bots. No pressure.</p>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="relative">
            <div className="absolute -inset-6 bg-primary/15 rounded-[40px] blur-2xl" />
            <img
              src={contactHero}
              alt="Friendly Degree Guru counselor on a call"
              className="relative rounded-[28px] w-full object-cover aspect-[4/3] shadow-2xl"
              loading="eager"
            />
          </div>
        </Reveal>
      </div>
    </section>

    <section className="pb-16">
      <div className="container-dg max-w-2xl">
        <Reveal>
          <CounselingForm buttonLabel="Get My Free Counseling Session" />
        </Reveal>
      </div>
    </section>

    <section className="pb-16">
      <div className="container-dg max-w-2xl">
        <Reveal delay={0.05}>
          <div className="grid sm:grid-cols-2 gap-5">
            <a href="tel:9350199001" className="glass glass-hover p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><Phone size={18} className="text-primary" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">Call Us</div>
                <div className="font-bold">9350199001</div>
              </div>
            </a>
            <a href="mailto:admissions@degreeguru.in" className="glass glass-hover p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><Mail size={18} className="text-primary" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">Email</div>
                <div className="font-bold text-sm">admissions@degreeguru.in</div>
              </div>
            </a>
            <a href="https://wa.me/919350199001" target="_blank" rel="noreferrer" className="glass glass-hover p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0"><MessageCircle size={18} className="text-[#25D366]" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">WhatsApp</div>
                <div className="font-bold">Chat instantly</div>
              </div>
            </a>
            <div className="glass p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><CalendarCheck size={18} className="text-primary" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">Availability</div>
                <div className="font-bold">We're available for you 7 days</div>
              </div>
            </div>
            <div className="glass p-6 flex items-center gap-4 sm:col-span-2">
              <div className="w-12 h-12 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0"><MapPin size={18} className="text-primary" /></div>
              <div>
                <div className="text-xs uppercase tracking-wider text-soft">Location</div>
                <div className="font-bold">Gurugram, Haryana, India</div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>

    <section className="py-20">
      <div className="container-dg max-w-3xl">
        <Reveal>
          <h2 className="text-3xl md:text-[40px] font-bold mb-10">Common Questions</h2>
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
