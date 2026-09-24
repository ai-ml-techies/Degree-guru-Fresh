import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingAiAdvisor } from "./FloatingAiAdvisor";
import { MobileBottomNav } from "./MobileBottomNav";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const isNewHome = location.pathname === "/new-home" || location.pathname === "/v2" || location.pathname === "/career-first";

  if (isNewHome) {
    return (
      <div className="min-h-screen flex flex-col relative selection:bg-primary/20 selection:text-primary">
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingAiAdvisor />
        <MobileBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative selection:bg-primary/20 selection:text-primary">
      <Header />
      <main className="flex-1 pt-[96px] sm:pt-[110px] md:pt-[128px] pb-24 md:pb-0">{children}</main>
      <Footer />
      <FloatingAiAdvisor />
      <MobileBottomNav />
    </div>
  );
};
