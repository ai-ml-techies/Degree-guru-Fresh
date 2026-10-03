import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingAiAdvisor } from "./FloatingAiAdvisor";
import { MobileBottomNav } from "./MobileBottomNav";
import { ReactNode } from "react";
import { useLocation } from "react-router-dom";

export const Layout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const path = (location.pathname || "").toLowerCase();
  const isLandingPage = 
    path.includes("placement-guaranteed") ||
    path.includes("acwm");

  if (isLandingPage) {
    return <>{children}</>;
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
