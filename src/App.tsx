import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";

import { LeadGateProvider } from "@/context/LeadGateContext";
import { LanguageProvider } from "@/context/LanguageContext";

const Index             = lazy(() => import("./pages/Index.tsx"));
const About             = lazy(() => import("./pages/About.tsx"));
const Contact           = lazy(() => import("./pages/Contact.tsx"));
const Privacy           = lazy(() => import("./pages/Privacy.tsx"));
const Class1012         = lazy(() => import("./pages/Class1012.tsx"));
const Class10           = lazy(() => import("./pages/Class10.tsx"));
const Class12           = lazy(() => import("./pages/Class12.tsx"));
const Recruitment       = lazy(() => import("./pages/Recruitment.tsx"));
const CoursesIndex      = lazy(() => import("./pages/CoursesIndex.tsx"));
const CourseDetail      = lazy(() => import("./pages/CourseDetail.tsx"));
const UniversitiesIndex = lazy(() => import("./pages/UniversitiesIndex.tsx"));
const UniversityDetail  = lazy(() => import("./pages/UniversityDetail.tsx"));
const UniversityCompare = lazy(() => import("./pages/UniversityCompare.tsx"));
const CareerFinder      = lazy(() => import("./pages/CareerFinder.tsx"));
const RoiCalculatorPage = lazy(() => import("./pages/RoiCalculatorPage.tsx"));
const EmiCalculatorPage = lazy(() => import("./pages/EmiCalculatorPage.tsx"));
const ResumeBuilder     = lazy(() => import("./pages/ResumeBuilder.tsx"));
const OfflineCourses    = lazy(() => import("./pages/OfflineCourses.tsx"));
const Referral          = lazy(() => import("./pages/Referral.tsx"));
const Blog              = lazy(() => import("./pages/Blog.tsx"));
const BlogPost          = lazy(() => import("./pages/BlogPost.tsx"));
const AuthorDetail      = lazy(() => import("./pages/AuthorDetail.tsx"));
const Employer          = lazy(() => import("./pages/jobs/Employer.tsx"));
const JobSeeker         = lazy(() => import("./pages/jobs/JobSeeker.tsx"));
const Sitemap           = lazy(() => import("./pages/Sitemap.tsx"));
const NotFound          = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <LeadGateProvider>
          <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <Layout>
              <Suspense fallback={<div className="min-h-[60vh] flex items-center justify-center text-xs text-muted-foreground">Loading Degree Guru...</div>}>
                <Routes>
                  <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/class-10" element={<Class10 />} />
                <Route path="/class-12" element={<Class12 />} />
                <Route path="/class-10-12" element={<Class1012 />} />
                <Route path="/recruitment" element={<Recruitment />} />
                
                {/* Courses Discovery */}
                <Route path="/courses" element={<CoursesIndex />} />
                <Route path="/programs" element={<CoursesIndex />} />
                <Route path="/programs/:courseSlug" element={<CourseDetail />} />

                {/* Universities & Comparison */}
                <Route path="/universities" element={<UniversitiesIndex />} />
                <Route path="/universities/compare" element={<UniversityCompare />} />
                <Route path="/universities/:uniSlug" element={<UniversityDetail />} />
                <Route path="/offline-courses" element={<OfflineCourses />} />

                {/* Career Discovery Tools */}
                <Route path="/career-finder" element={<CareerFinder />} />
                <Route path="/roi-calculator" element={<RoiCalculatorPage />} />
                <Route path="/emi-calculator" element={<EmiCalculatorPage />} />
                <Route path="/resume-builder" element={<ResumeBuilder />} />

                {/* Referral Program */}
                <Route path="/referral" element={<Referral />} />

                {/* Knowledge Hub / Blog Platform */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blogs" element={<Blog />} />
                <Route path="/blog/:postSlug" element={<BlogPost />} />
                <Route path="/author/:authorSlug" element={<AuthorDetail />} />
                <Route path="/authors/:authorSlug" element={<AuthorDetail />} />

                {/* Employment / Job Platform */}
                <Route path="/jobs" element={<JobSeeker />} />
                <Route path="/jobs/job-seeker" element={<JobSeeker />} />
                <Route path="/job-seeker" element={<JobSeeker />} />
                <Route path="/jobs/employer" element={<Employer />} />
                <Route path="/employer" element={<Employer />} />

                {/* Sitemap */}
                <Route path="/sitemap" element={<Sitemap />} />

                {/* Direct Clean SEO Course URLs (e.g. /online-mba, /online-bca, /online-mca) */}
                <Route path="/:courseSlug" element={<CourseDetail />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
        </TooltipProvider>
        </LeadGateProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
