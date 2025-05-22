"use client"

import { cn } from "@/lib/utils"
import { useTheme } from "@/contexts/theme-context"

interface ProgressBarProps {
  totalTasks: number
  completedTasks: number
  className?: string
  isIndeterminate?: boolean
}

export default function ProgressBar({
  totalTasks,
  completedTasks,
  className,
  isIndeterminate = false,
}: ProgressBarProps) {
  // Calculate percentage
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
  const { theme } = useTheme()

  return (
    <div
      className={cn(
        "w-full rounded-full h-2 overflow-hidden p-[1px]",
        theme === "dark" ? "bg-black border border-white" : "bg-white border border-gray-300",
        className,
      )}
    >
      {isIndeterminate ? (
        <div className="h-full relative w-full">
          <div
            className={`h-full absolute w-[40%] animate-progress-indeterminate rounded-full ${
              theme === "dark" ? "bg-white" : "bg-gray-800"
            }`}
          />
        </div>
      ) : (
        <div
          className={`h-full transition-all duration-500 rounded-full ${theme === "dark" ? "bg-white" : "bg-gray-800"}`}
          style={{ width: `${percentage}%` }}
        />
      )}
    </div>
  )
}
