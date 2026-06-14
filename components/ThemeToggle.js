"use client";

import { useTheme } from "../contexts/ThemeContext";
import { SunIcon, MoonIcon, ComputerDesktopIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export default function ThemeToggle() {
  const { theme, resolvedTheme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  // Icon component based on current theme
  const ThemeIcon = () => {
    if (theme === "system") {
      return (
        <ComputerDesktopIcon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
      );
    } else if (theme === "dark") {
      return (
        <MoonIcon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
      );
    } else {
      return (
        <SunIcon className="w-5 h-5 text-yellow-600" />
      );
    }
  };

  const getThemeLabel = () => {
    if (theme === "system") return "System";
    if (theme === "dark") return "Dark";
    return "Light";
  };

  return (
    <div className="relative">
      {/* Simple Toggle Button */}
      <button
        onClick={toggleTheme}
        className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label={`Current theme: ${getThemeLabel()}. Click to change.`}
        title={`Theme: ${getThemeLabel()} (${resolvedTheme === "dark" ? "Dark" : "Light"} mode active)`}
      >
        <div className="transition-transform duration-300 hover:scale-110">
          <ThemeIcon />
        </div>
      </button>

      {/* Theme indicator dot */}
      <div
        className={`absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white dark:border-zinc-900 transition-colors duration-300 ${
          theme === "system"
            ? "bg-purple-500"
            : theme === "dark"
            ? "bg-blue-500"
            : "bg-yellow-500"
        }`}
        title={`Active: ${resolvedTheme === "dark" ? "Dark" : "Light"} mode`}
      />
    </div>
  );
}

// Alternative: Dropdown Menu Version (more detailed)
export function ThemeToggleMenu() {
  const { theme, resolvedTheme, setLightTheme, setDarkTheme, setSystemTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);

  const options = [
    {
      value: "light",
      label: "Light",
      icon: SunIcon,
      onClick: setLightTheme,
    },
    {
      value: "dark",
      label: "Dark",
      icon: MoonIcon,
      onClick: setDarkTheme,
    },
    {
      value: "system",
      label: "System",
      icon: ComputerDesktopIcon,
      onClick: setSystemTheme,
    },
  ];

  const currentOption = options.find(opt => opt.value === theme);
  const CurrentIcon = currentOption?.icon || SunIcon;

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        className="relative flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-200 dark:bg-zinc-700 hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Theme menu"
      >
        <CurrentIcon className="w-5 h-5" />
        <span className="text-sm font-medium hidden sm:inline">
          {currentOption?.label}
        </span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${showMenu ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {showMenu && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowMenu(false)}
          />
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-zinc-800 rounded-lg shadow-lg border border-zinc-200 dark:border-zinc-700 z-20 overflow-hidden">
            {options.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              
              return (
                <button
                  key={option.value}
                  onClick={() => {
                    option.onClick();
                    setShowMenu(false);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                    isActive
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-300"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="flex-1 font-medium">{option.label}</span>
                  {isActive && (
                    <svg
                      className="w-5 h-5 text-blue-600 dark:text-blue-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
            
            {/* Current mode indicator */}
            <div className="px-4 py-2 text-xs text-zinc-500 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-700">
              Currently: {resolvedTheme === "dark" ? "🌙 Dark" : "☀️ Light"} mode
            </div>
          </div>
        </>
      )}
    </div>
  );
}