import ChatbotLauncher from "@/components/ChatbotLauncher";
import Experience from "@/components/Experience";
import HomeContactSection from "@/components/HomeContactSection";
import HomeProfileSections from "@/components/HomeProfileSections";
import Navbar from "@/components/Navbar/Navbar";
import PortfolioFooter from "@/components/PortfolioFooter";
import Projects from "@/components/Projects";

export default function ClassicPortfolioPage() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-clip bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-50">
      <Navbar />
      <div className="pt-[7.5rem] sm:pt-32 md:pt-24">
        <HomeProfileSections />
        <Experience />
        <Projects />
        <HomeContactSection />
      </div>
      <PortfolioFooter />
      <ChatbotLauncher />
    </div>
  );
}
