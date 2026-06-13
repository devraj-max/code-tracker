import useTheme from "../contexts/theme";

function ThemeBtn() {
  const { themeMode, darkTheme, lightTheme } = useTheme();

  const toggle = () => {
    if (themeMode === "dark") lightTheme();
    else darkTheme();
  };

  return (
    <button
      onClick={toggle}
      className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-800 text-black dark:text-white"
    >
      {themeMode === "dark" ? "🌙 Dark Mode" : "☀️ Light Mode"}
    </button>
  );
}

export default ThemeBtn;