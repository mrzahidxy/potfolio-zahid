import Intro from "@/components/Intro";
import "../style/App.css";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

export default function Home() {
  return (
    <div className="space-y-8 lg:">
      <div id="intro" className="lg:h-screen flex items-center justify-center ">
        <Intro />
      </div>
      <div id="about" className="lg:h-screen flex items-center justify-center ">
        <About />
      </div>
      <div id="projects" className="lg:h-screen flex items-center justify-center">
        <Projects />
      </div>
      <div id="contact" className="lg:h-screen flex items-center justify-center ">
        <Contact />
      </div>
    </div>
  );
}
