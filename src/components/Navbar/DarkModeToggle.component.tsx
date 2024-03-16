import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

type props = {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
};

export const DarkModeToggle = ({ isDarkMode, toggleDarkMode }: props) => {
  const buttonClasses = `text-xl ${
    isDarkMode ? "text-white" : "text-yellow-300"
  }`;
  const icon = isDarkMode ? faMoon : faSun;

  return (
<label className="relative inline-flex items-center cursor-pointer">
  <input
    type="checkbox"
    value=""
    className="sr-only peer"
    checked={isDarkMode}
    onChange={toggleDarkMode}
  />
  <div className="w-11 h-6 bg-gray-100 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600">
  {isDarkMode ? (
      <FontAwesomeIcon icon={faMoon} className="text-white pl-1" />
    ) : (
      <FontAwesomeIcon icon={faSun} className="text-yellow-300 float-right pt-1 pr-1" />
    )}
  </div>
</label>
  );
};
