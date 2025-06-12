import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { Sun, Moon } from "lucide-react";

export default function ThemeSelector({
  text,
  compact = false,
}: {
  text?: string;
  compact?: boolean;
}) {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={`flex items-center gap-3 ${
        compact ? "px-2 py-1.5" : "px-4 py-2.5 w-full"
      }`}>
      <div className="relative flex justify-center w-5 h-5 shrink-0">
        <Sun className="h-5 w-5 text-primary dark:hidden" />
        <Moon className="h-5 w-5 text-primary hidden dark:block" />
      </div>
      {!compact && text && (
        <span className="text-base font-medium text-left">{text}</span>
      )}
    </Button>
  );
}
