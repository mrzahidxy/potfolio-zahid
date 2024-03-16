import SkillCard from "./common/SkillCard";

interface SkillSet {
  title: string;
  image: string;
}
const frontendSkills: SkillSet[] = [
  {
    title: "SASS",
    image: "/icon/sass.png",
  },
  {
    title: "TAILWIND",
    image: "/icon/tailwindcss.png",
  },
  {
    title: "RACET JS",
    image: "/icon/reactjs.png",
  },
  {
    title: "NEXT JS",
    image: "/icon/nextjs.png",
  },
];

const backendSkills: SkillSet[] = [
  {
    title: "NodeJS",
    image: "/icon/node.png",
  },
  {
    title: "ExpressJS",
    image: "/icon/express.png",
  },
  {
    title: "MongoDB",
    image: "/icon/mongodb.png",
  },
  {
    title: "Firebase",
    image: "/icon/firebase.png",
  },
];

const languageSKills: SkillSet[] = [
  {
    title: "Javascript",
    image: "/icon/js.png",
  },
  {
    title: "Typescript",
    image: "/icon/ts.png",
  },
  {
    title: "HTML",
    image: "/icon/html.png",
  },
  {
    title: "CSS",
    image: "/icon/css.png",
  },
];

const otherSKills: SkillSet[] = [
  {
    title: "Git",
    image: "/icon/git.png",
  },
  {
    title: "Figma",
    image: "/icon/git.png",
  },
];

const Skill: React.FC = () => {
  return (
    <div
      id="skills"
      data-scroll-section
      className="container h-screen flex flex-col-reverse lg:grid lg:grid-cols-2 items-center"
    >
      <div className="grid gap-y-10">
        <SkillCard title="Language" skills={languageSKills} />
        <SkillCard title="Frontend" skills={frontendSkills} />
        <SkillCard title="Backend" skills={backendSkills} />
        <SkillCard title="Others" skills={otherSKills} />
      </div>

      <div className="space-y-6">
        <h3 className="text-blue-500 text-2xl lg:text-4xl font-bold">
          &lt;mastered & stack&gt;
        </h3>

        <p className="lg:text-lg text-justify">
          As a dedicated software professional, I have mastered JavaScript and
          related technologies. I use my coding skills to solve real-world
          problems creatively and efficiently. I&apos;m proficient in both frontend
          and backend development, which strengthens my skills in software
          engineering.
        </p>

        <div className="float-right">
          <h3 className="text-blue-500 text-2xl font-bold">
            &lt;mastered & stack/&gt;
          </h3>
        </div>
      </div>
    </div>
  );
};

export default Skill;
