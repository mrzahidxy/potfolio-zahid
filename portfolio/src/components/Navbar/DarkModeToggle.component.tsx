import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

type props = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: props) => {
  const icon = isDarkMode ? faMoon : faSun;

  return (
    <button
      type="button"
      onClick={toggleDarkMode}
      aria-label="Toggle dark mode"
      className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-white/80 text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-200/70 dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-slate-700 dark:focus-visible:ring-sky-900"
    >
      <FontAwesomeIcon
        icon={icon}
        className={isDarkMode ? "text-slate-100" : "text-amber-300"}
      />
    </button>
  );
};
