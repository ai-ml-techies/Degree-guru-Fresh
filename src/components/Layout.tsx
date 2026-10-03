import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingAiAdvisor } from "./FloatingAiAdvisor";
import { MobileBottomNav } from "./MobileBottomNav";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const normalizedPath = location.pathname.toLowerCase().replace(/\/+$/, "") || "/";
  const isAcwmPage = 
    normalizedPath === "/placement-guaranteed" ||
    normalizedPath === "/100-placement-guaranteed" ||
    normalizedPath === "/acwm-career-programme" ||
    normalizedPath.startsWith("/placement-guaranteed/") ||
    normalizedPath.startsWith("/100-placement-guaranteed/") ||
    normalizedPath.startsWith("/acwm-career-programme/");

  if (isAcwmPage) {
    return (
      <div className="min-h-screen flex flex-col relative bg-[#F7F5F0]">
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative bg-background">
      <Header />
      <main className="flex-1 pt-[96px] md:pt-[100px]">{children}</main>
      <Footer />
      <FloatingAiAdvisor />
      <MobileBottomNav />
    </div>
  );
};
