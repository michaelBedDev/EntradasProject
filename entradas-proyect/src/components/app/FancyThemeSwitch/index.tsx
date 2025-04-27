"use client";

import { Switch } from "@/components/ui/switch";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function FancyThemeSwitch() {
  const { theme, setTheme } = useTheme();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(theme === "dark");
  }, [theme]);

  const handleChange = (checked: boolean) => {
    setChecked(checked);
    setTheme(checked ? "dark" : "light");
  };

  return (
    <div className="flex items-center space-x-4">
      {/* Sol a la izquierda */}
      <Sun
        className={`h-6 w-6 transition-colors ${
          checked ? "text-gray-400" : "text-yellow-500"
        }`}
      />

      {/* Switch en el centro */}
      <Switch id="theme-switch" checked={checked} onCheckedChange={handleChange} />

      {/* Luna a la derecha */}
      <Moon
        className={`h-6 w-6 transition-colors ${
          checked ? "text-blue-500" : "text-gray-400"
        }`}
      />
    </div>
  );
}
