"use client"

import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "@/contexts/theme-context"
import { useLanguage } from "@/contexts/language-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { motion } from "framer-motion"

export default function ThemeSwitcher() {
  const { theme, toggleTheme } = useTheme()
  const { t } = useLanguage()
  const isMobile = useMediaQuery("(max-width: 768px)")

  return (
    <Button
      variant={theme === "dark" ? "outline" : "dark"}
      size="icon"
      onClick={toggleTheme}
      className="rounded-full h-10 w-10 button-hover-effect button-active-effect overflow-hidden"
      aria-label={theme === "dark" ? t("theme.switchToLight") : t("theme.switchToDark")}
    >
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 30, opacity: 0 }}
        transition={{ duration: 0.3, type: "spring", stiffness: 200 }}
        key={theme}
        className="absolute"
      >
        {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </motion.div>
    </Button>
  )
}
