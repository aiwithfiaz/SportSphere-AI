"use client";

import { useTheme } from "@/components/theme-provider";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const cycle = () => {
    if (theme === "light") setTheme("dark");
    else if (theme === "dark") setTheme("system");
    else setTheme("light");
  };

  const label = theme === "light" ? "\u{1F31E}" : theme === "dark" ? "\u{1F319}" : "\u{1F321}\uFE0F";

  return (
    <button
      onClick={cycle}
      className="flex items-center justify-center h-9 w-9 rounded-md text-lg transition-colors hover:bg-accent hover:text-foreground"
      title={`Theme: ${theme} (click to cycle)`}
      aria-label={`Switch theme (current: ${theme})`}
    >
      <span className="leading-none">{label}</span>
    </button>
  );
}
