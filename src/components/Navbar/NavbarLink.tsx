"use client"
import { useRouter } from 'next/navigation'


interface NavbarLinkProps {
  to: string;
  label: string;
  activeSection?: string | null;
}

// Navbar Component
const NavbarLink: React.FC<NavbarLinkProps> = ({ to, label }) => {
  const router  = useRouter()

  return (
    <li>
      <a
        className={`cursor-pointer text-sm font-medium tracking-tight hover:text-sky-500 transition-colors`}
        href={`${to}`}
      >
        {label}
      </a>
    </li>
  );
};

export default NavbarLink;
