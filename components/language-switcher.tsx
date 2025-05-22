"use client"

import { useState } from "react"
import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage, type Language } from "@/contexts/language-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { useTheme } from "@/contexts/theme-context"

export default function LanguageSwitcher() {
  const { language, setLanguage, t } = useLanguage()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const languages: { code: Language; label: string }[] = [
    { code: "en", label: t("language.en") },
    { code: "ru", label: t("language.ru") },
    { code: "be", label: t("language.be") },
  ]

  // Для мобильных устройств используем RadioGroup вместо DropdownMenu
  if (isMobile) {
    return (
      <RadioGroup value={language} onValueChange={(value) => setLanguage(value as Language)} className="space-y-2">
        {languages.map((lang) => (
          <div key={lang.code} className="flex items-center space-x-2">
            <RadioGroupItem
              value={lang.code}
              id={`lang-${lang.code}`}
              className={theme === "dark" ? "border-white text-white" : "border-gray-800 text-gray-800"}
            />
            <Label
              htmlFor={`lang-${lang.code}`}
              className={theme === "dark" ? "text-white tracking-normal" : "text-gray-800 tracking-normal"}
            >
              {lang.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  // Для десктопа используем DropdownMenu
  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className={`${
            theme === "dark" ? "text-white hover:text-gray-300" : "text-gray-800 hover:text-gray-600"
          } hover:bg-transparent rounded-full h-10 w-10`}
        >
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className={
          theme === "dark"
            ? "bg-black border-[rgba(255,255,255,0.12)] text-white"
            : "bg-white border-[rgba(0,0,0,0.12)] text-gray-800"
        }
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            className={`tracking-normal ${
              theme === "dark" ? "hover:bg-[#111111] focus:bg-[#111111]" : "hover:bg-[#f5f5f5] focus:bg-[#f5f5f5]"
            } ${language === lang.code ? (theme === "dark" ? "bg-[#111111]" : "bg-[#f5f5f5]") : ""}`}
            onClick={() => {
              setLanguage(lang.code)
              setOpen(false)
            }}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
