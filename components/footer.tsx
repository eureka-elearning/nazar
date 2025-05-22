"use client"

import { useTheme } from "@/contexts/theme-context"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { theme } = useTheme()

  return (
    <div
      className={`absolute bottom-2 left-1/2 transform -translate-x-1/2 text-xs ${
        theme === "dark" ? "text-gray-400" : "text-gray-600"
      }`}
    >
      <p className="text-center">{useLanguage().t("footer.developedBy")}</p>
    </div>
  )
}
