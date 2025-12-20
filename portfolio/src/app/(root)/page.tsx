import Intro from "@/components/Intro";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";

export default function Home() {
  return (
    <div className="flex flex-col gap-0 bg-slate-50 text-slate-900">
      <Intro />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
}
