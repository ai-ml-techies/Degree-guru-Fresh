import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingAiAdvisor } from "./FloatingAiAdvisor";
import { MobileBottomNav } from "./MobileBottomNav";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isAcwmPage = 
    location.pathname === "/placement-guaranteed" ||
    location.pathname === "/100-placement-guaranteed" ||
    location.pathname === "/acwm-career-programme";

  if (isAcwmPage) {
    return (
      <div className="min-h-screen flex flex-col relative bg-[#FAF8F5]">
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
