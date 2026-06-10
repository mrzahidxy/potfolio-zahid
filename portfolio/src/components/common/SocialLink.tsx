import Image from "next/image";

interface SocialLinkProps {
  href: string;
  icon: string;
  alt: string;
  label?: string;
}

const SocialLink: React.FC<SocialLinkProps> = ({ href, icon, alt, label }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="block h-5 w-5"
    aria-label={label ?? alt}
  >
    <Image width={100} height={100} src={icon} alt={alt} />
  </a>
);

export default SocialLink;
