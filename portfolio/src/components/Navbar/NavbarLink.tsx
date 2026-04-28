"use client";

interface NavbarLinkProps {
  to: string;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
  itemClassName?: string;
}

const NavbarLink: React.FC<NavbarLinkProps> = ({
  to,
  label,
  isActive = false,
  onClick,
  className = "",
  itemClassName = "",
}) => {
  return (
    <li className={`shrink-0 ${itemClassName}`}>
      <a
        className={`inline-flex h-10 items-center rounded-full px-3.5 text-[14px] font-medium tracking-tight transition duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70 dark:focus-visible:ring-sky-900 ${
          isActive
            ? "bg-slate-100 text-slate-950 dark:bg-slate-700/90 dark:text-slate-50"
            : "text-slate-600 hover:text-slate-950 dark:text-slate-200 dark:hover:text-slate-50"
        } ${className}`}
        href={to}
        onClick={onClick}
        aria-current={isActive ? "page" : undefined}
      >
        {label}
      </a>
    </li>
  );
};

export default NavbarLink;
