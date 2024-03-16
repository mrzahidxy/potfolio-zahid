import Image from "next/image";

interface Skill {
  title: string;
  image: string;
}

function SkillCard({ skills, title }: { skills: Skill[]; title: string }) {
  return (
    <div className="space-y-3">
      <h3 className="lg:text-xl font-bold">{title}</h3>
      <div className="grid grid-cols-5">
        {skills.map((skill, index) => (
          <div key={index} className="w-8 h-8 lg:w-14 lg:h-14">
            <Image width={100} height={100} src={skill.image} alt={skill.title} className="" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SkillCard;
