"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";
  return (
    <motion.div whileTap={{ scale: 0.95 }}>
      <Button
        type="button"
        variant="outline"
        onClick={() => setTheme(isDark ? "light" : "dark")}
        aria-label="Toggle theme"
        className="relative"
      >
        <span className="sr-only">Toggle theme</span>
        <Sun className={`h-4 w-4 transition-transform ${!isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"}`} />
        <Moon className={`absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 transition-transform ${isDark ? "rotate-0 scale-100" : "rotate-90 scale-0"}`} />
      </Button>
    </motion.div>
  );
}
