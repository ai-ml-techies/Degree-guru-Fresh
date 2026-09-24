import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { EmiCalculator } from "@/components/tools/EmiCalculator";
import { AppBreadcrumb } from "@/components/AppBreadcrumb";
import { 
  Calculator, 
  ShieldCheck, 
  ArrowRight, 
  HelpCircle, 
  CheckCircle2, 
  Sparkles, 
  Building2,
  Percent,
  Clock,
  FileCheck
} from "lucide-react";

export const EmiCalculatorPage = () => {
  return (
    <>
      <Helmet>
        <title>0% No-Cost EMI Calculator for Online Degrees | Degree Guru</title>
        <meta
          name="description"
          content="Calculate affordable monthly installments for online MBA, MCA, BCA, and BBA degrees. 0% No-cost EMI schemes starting from ₹3,500/month with zero collateral."
        />
        <link rel="canonical" href="https://degreeguru.in/emi-calculator/" />
      </Helmet>

      <div className="container-dg py-8 md:py-14 space-y-12">
        <AppBreadcrumb
          items={[
            { label: "Career Tools" },
            { label: "0% EMI Calculator" },
          ]}
        />

        {/* Page Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-bold">
            <Percent size={14} /> Zero Financial Stress
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
            Online University EMI Calculator
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            Don't let tuition fees hold back your career. Check monthly no-cost installments across Manipal, Amity, NMIMS, LPU, and 50+ UGC-approved universities.
          </p>
        </div>

        {/* The Calculator Tool */}
        <div className="max-w-5xl mx-auto">
          <EmiCalculator />
        </div>

        {/* Benefits Grid */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Percent size={18} />
            </div>
            <h4 className="text-xs font-bold text-foreground">0% Interest Rate</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Leading universities subsidize the entire interest cost for online students.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Clock size={18} />
            </div>
            <h4 className="text-xs font-bold text-foreground">Instant Approval</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Paperless digital verification through Aadhaar & PAN in under 5 minutes.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-[#6528f7]/10 text-[#6528f7] flex items-center justify-center">
              <FileCheck size={18} />
            </div>
            <h4 className="text-xs font-bold text-foreground">No Collateral</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Zero security deposit or guarantor required. Open to working professionals & parents.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/70 space-y-2">
            <div className="w-9 h-9 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <Building2 size={18} />
            </div>
            <h4 className="text-xs font-bold text-foreground">Direct University Pay</h4>
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Funds are disbursed straight to the university registrar for your semester fee.
            </p>
          </div>
        </div>

        {/* FAQs */}
        <div className="max-w-3xl mx-auto space-y-4 pt-6">
          <h3 className="text-xl font-bold text-foreground text-center mb-6">
            Frequently Asked Questions about Online Degree EMIs
          </h3>

          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="text-sm font-bold text-foreground">Is 0% No-Cost EMI really zero interest?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Yes! For eligible online programs, the university absorbs the financing fee. If your total fee is ₹1,20,000 for 12 months, you pay exactly ₹10,000 each month with zero markup.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="text-sm font-bold text-foreground">Which NBFCs and banks partner for these EMIs?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Major education financing partners include LiquiLoans, Eduvanz, GrayQuest, Propelld, and leading credit/debit card issuers (HDFC, ICICI, SBI, Axis).
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card border border-border/80 space-y-2">
            <h4 className="text-sm font-bold text-foreground">Are BOSSE Class 10 and 12 eligible for EMI?</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              No. Open schooling secondary & senior secondary board fees (BOSSE) are strictly direct one-time registration fees and do not support EMI installments.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
export default EmiCalculatorPage;
