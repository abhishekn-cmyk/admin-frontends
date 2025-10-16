import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoonIcon, SunIcon } from "lucide-react";
import useThemeStore from "@/store/themeStore";

export default function ThemeToggle() {
  const { theme, setTheme } = useThemeStore();

  const handleThemeChange = (theme: any) => {
    setTheme(theme);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="p-3">
          {theme === "light" ? <SunIcon /> : <MoonIcon />}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {["light", "dark", "system"].map((t) => (
          <DropdownMenuItem
            onClick={() => handleThemeChange(t)}
            className="capitalize"
            key={t}
          >
            {t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
