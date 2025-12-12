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
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm transition hover:-translate-y-[1px] hover:shadow-md dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
    >
      <FontAwesomeIcon
        icon={icon}
        className={isDarkMode ? "text-slate-100" : "text-amber-400"}
      />
    </button>
  );
};
