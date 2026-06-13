import { createContext, useContext, useEffect, useState } from "react";

export const ThemeContext = createContext({
  themeMode: "dark",
  darkTheme: () => {},
  lightTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [themeMode, setThemeMode] = useState("dark");

  const darkTheme = () => setThemeMode("dark");
  const lightTheme = () => setThemeMode("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) setThemeMode(savedTheme);
  }, []);

  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove("dark", "light");
    root.classList.add(themeMode);

    localStorage.setItem("theme", themeMode);
  }, [themeMode]);

  return (
    <ThemeContext.Provider value={{ themeMode, darkTheme, lightTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default function useTheme() {
  return useContext(ThemeContext);
}