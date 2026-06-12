import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Layout } from "@/components/Layout";
import { ScrollToTop } from "@/components/ScrollToTop";

const Index       = lazy(() => import("./pages/Index.tsx"));
const About       = lazy(() => import("./pages/About.tsx"));
const Contact     = lazy(() => import("./pages/Contact.tsx"));
const Privacy     = lazy(() => import("./pages/Privacy.tsx"));
const Class1012   = lazy(() => import("./pages/Class1012.tsx"));
const Recruitment = lazy(() => import("./pages/Recruitment.tsx"));
const ProgramsIndex = lazy(() => import("./pages/ProgramsIndex.tsx"));
const ProgramDetail = lazy(() => import("./pages/ProgramDetail.tsx"));
const Blog        = lazy(() => import("./pages/Blog.tsx"));
const Employer    = lazy(() => import("./pages/jobs/Employer.tsx"));
const JobSeeker   = lazy(() => import("./pages/jobs/JobSeeker.tsx"));
const NotFound    = lazy(() => import("./pages/NotFound.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <ScrollToTop />
          <Layout>
            <Suspense fallback={null}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/class-10-12" element={<Class1012 />} />
                <Route path="/recruitment" element={<Recruitment />} />
                <Route path="/programs" element={<ProgramsIndex />} />
                <Route path="/programs/:slug" element={<ProgramDetail />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/jobs/employer" element={<Employer />} />
                <Route path="/jobs/job-seeker" element={<JobSeeker />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
