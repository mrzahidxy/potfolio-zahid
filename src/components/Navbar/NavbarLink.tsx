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
        className={`cursor-pointer font-semibold ${
          "" === to ? "text-blue-500" : ""
        }`}
        href={`${to}`}
      >
        {label}
      </a>
    </li>
  );
};

export default NavbarLink;
