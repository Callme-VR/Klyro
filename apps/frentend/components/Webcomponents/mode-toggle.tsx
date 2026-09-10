"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    const current = resolvedTheme || theme;
    setTheme(current === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon-sm"
        className="relative border border-zinc-200 text-zinc-400 rounded-lg h-9 w-9"
      >
        <Sun className="h-4 w-4" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={toggleTheme}
      className="relative border border-zinc-200 text-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-300 cursor-pointer rounded-lg h-9 w-9 overflow-hidden"
    >
      <Sun className="h-4 w-4 scale-100 transition-all duration-300 dark:-rotate-90 text-amber-500" />
      <Moon className="absolute h-4 w-4 scale-0 transition-all duration-300 dark:rotate-0 text-blue-400" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
