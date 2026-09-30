import { Header } from "./Header";
import { Footer } from "./Footer";
import { FloatingAiAdvisor } from "./FloatingAiAdvisor";
import { MobileBottomNav } from "./MobileBottomNav";
import { ReactNode } from "react";

export const Layout = ({ children }: { children: ReactNode }) => (
  <div className="min-h-screen flex flex-col relative bg-background">
    <Header />
    <main className="flex-1 pt-[96px] md:pt-[100px]">{children}</main>
    <Footer />
    <FloatingAiAdvisor />
    <MobileBottomNav />
  </div>
);
