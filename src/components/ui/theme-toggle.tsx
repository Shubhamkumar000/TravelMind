import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center gap-1 rounded-md border border-border bg-card px-2 py-1">
        <div className="h-4 w-4" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1 rounded-md border border-border bg-card">
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${!isDark ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setTheme("light")}
              title="Light mode"
            >
              <Sun className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`h-7 px-2 ${isDark ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => setTheme("dark")}
              title="Dark mode"
            >
              <Moon className="h-3.5 w-3.5" />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>Switch theme</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

