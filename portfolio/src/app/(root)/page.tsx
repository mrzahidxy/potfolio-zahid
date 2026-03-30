import Intro from "@/components/Intro";
import ProductFocus from "@/components/ProductFocus";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";
import Experience from "@/components/Experience";

export default function Home() {
  return (
    <div className="relative flex flex-col gap-0 bg-transparent text-slate-900 dark:text-slate-50">
      <Intro />
      <ProductFocus />
      <About />
      <Projects />
      <Experience />
      <Contact />
    </div>
  );
}
