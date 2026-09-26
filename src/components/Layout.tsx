import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingAiAdvisor } from "./FloatingAiAdvisor";
import { MobileBottomNav } from "./MobileBottomNav";
import { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col relative">
    <Header />
    <main className="flex-1 pt-[100px] sm:pt-[114px] md:pt-[132px]">{children}</main>
    <Footer />
    <FloatingAiAdvisor />
    <MobileBottomNav />
  </div>
);
