import HomeContactSection from "@/components/HomeContactSection";
import HomeProfileSections from "@/components/HomeProfileSections";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";

export default function Home() {
  return (
    <div className="relative flex flex-col gap-0 overflow-x-clip bg-transparent text-slate-900 dark:text-slate-50">
      <HomeProfileSections />
      <Experience />
      <Projects />
      <HomeContactSection />
    </div>
  );
}
