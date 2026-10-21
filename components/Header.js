"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { categories, visibleCategories } from "../lib/categories";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "unset";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMenuOpen]);

  const navigationItems = [
    { name: "Home", href: "/" },
    ...visibleCategories.map((category) => ({
      name: categories[category].label,
      href: categories[category].href,
    })),
  ];

  const isActiveLink = (href) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <>
      <header
        className={`header-bg sticky top-0 z-50 border-b border-zinc-200 dark:border-zinc-700 transition-all duration-300 ${
          scrolled
            ? "shadow-md backdrop-blur-md bg-white/90 dark:bg-zinc-900/90"
            : "shadow-sm"
        }`}
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <Link href="/" className="flex-shrink-0 relative z-50">
              <div className="flex items-center">
                <div className="rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 active:scale-95">
                  <Image
                    src="/logo1.png"
                    alt="omnicore Logo"
                    width={140}
                    height={40}
                    className="object-cover dark:hidden w-[120px] sm:w-[140px] md:w-[160px] h-auto"
                    priority
                  />
                  <Image
                    src="/logo2.png"
                    alt="omnicore Logo"
                    width={140}
                    height={40}
                    className="object-cover hidden dark:block w-[120px] sm:w-[140px] md:w-[160px] h-auto"
                    priority
                  />
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`relative px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 group ${
                    isActiveLink(item.href)
                      ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100"
                  }`}
                >
                  {item.name}
                  <span
                    className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full transition-all duration-300 ${
                      isActiveLink(item.href) ? "w-6" : "w-0 group-hover:w-4"
                    }`}
                  />
                </Link>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden relative z-50 p-2 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 active:scale-95"
              aria-label="Toggle menu"
              aria-expanded={isMenuOpen}
            >
              <div className="w-6 h-5 flex flex-col justify-center items-center relative">
                <span
                  className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                    isMenuOpen
                      ? "rotate-45 translate-y-0.5"
                      : "-translate-y-1.5"
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                    isMenuOpen ? "opacity-0 scale-0" : "opacity-100"
                  }`}
                />
                <span
                  className={`block h-0.5 w-6 bg-current rounded-full transition-all duration-300 ${
                    isMenuOpen
                      ? "-rotate-45 -translate-y-0.5"
                      : "translate-y-1.5"
                  }`}
                />
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 transition-all duration-300 ${
          isMenuOpen ? "visible" : "invisible"
        }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${
            isMenuOpen ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-14 sm:top-16 left-0 right-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-700 shadow-xl transition-all duration-300 transform ${
            isMenuOpen
              ? "translate-y-0 opacity-100"
              : "-translate-y-4 opacity-0"
          }`}
        >
          <nav className="container mx-auto px-4 py-4 space-y-1">
            {navigationItems.map((item, index) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-200 ${
                  isActiveLink(item.href)
                    ? "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20"
                    : "text-zinc-700 dark:text-zinc-300 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-50 dark:hover:bg-zinc-800 active:bg-zinc-100 dark:active:bg-zinc-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <span>{item.name}</span>
                <div className="flex items-center space-x-2">
                  {isActiveLink(item.href) && (
                    <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full animate-pulse" />
                  )}
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isActiveLink(item.href)
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-zinc-400"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
