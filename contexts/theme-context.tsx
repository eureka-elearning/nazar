"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Theme = "dark" | "light"

type ThemeContextType = {
  theme: Theme
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
})

export const useTheme = () => useContext(ThemeContext)

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark")
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Загрузка темы из localStorage при инициализации
  useEffect(() => {
    // Проверяем сохраненную тему
    const savedTheme = localStorage.getItem("theme") as Theme

    if (savedTheme && ["dark", "light"].includes(savedTheme)) {
      setTheme(savedTheme)
    } else {
      // Если тема не сохранена, проверяем системные предпочтения
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      setTheme(prefersDark ? "dark" : "light")
    }
  }, [])

  // Применяем класс темы к документу
  useEffect(() => {
    document.documentElement.classList.remove("dark", "light")
    document.documentElement.classList.add(theme)
    localStorage.setItem("theme", theme)
  }, [theme])

  const toggleTheme = () => {
    setIsTransitioning(true)
    setTheme((prevTheme) => (prevTheme === "dark" ? "light" : "dark"))

    // Сбрасываем флаг анимации после завершения перехода
    const transitionDuration =
      Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--theme-transition-duration")) *
        1000 || 500
    setTimeout(() => {
      setIsTransitioning(false)
    }, transitionDuration)
  }

  return <ThemeContext.Provider value={{ theme, toggleTheme }}>{children}</ThemeContext.Provider>
}
