"use client";
import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import "../components/darkThemeSwitch/darkMode.scss";
import Image from "next/image";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }
  return resolvedTheme === "dark" ? (
    <div
      className="themeSwitch darkMode"
      onClick={() => setTheme("light")}
    ></div>
  ) : resolvedTheme === "light" ? (
    <div
      className="themeSwitch lightMode"
      onClick={() => setTheme("dark")}
    ></div>
  ) : null;
};

export default ThemeSwitch;
