"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { useMediaQuery } from "@/hooks/use-media-query"

interface AvatarUploadProps {
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

export default function AvatarUpload({ size = "md", className = "" }: AvatarUploadProps) {
  const { profile } = useAuth()
  const { theme } = useTheme()
  const isMobile = useMediaQuery("(max-width: 640px)")

  // Автоматически уменьшаем размер на мобильных устройствах, если не указан xs
  const autoSize = isMobile && size !== "xs" ? (size === "lg" ? "md" : size === "md" ? "sm" : "xs") : size

  // Размеры аватара в зависимости от параметра size
  const sizeClasses = {
    xs: "h-8 w-8 text-xs",
    sm: "h-10 w-10 text-sm",
    md: "h-16 w-16 text-base",
    lg: "h-24 w-24 text-lg",
  }

  // Получаем инициалы пользователя для аватара
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <Avatar
        className={`${sizeClasses[autoSize]} border-2 ${theme === "dark" ? "border-white/20" : "border-gray-300"}`}
      >
        {profile?.avatar_url ? (
          <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.name} />
        ) : (
          <AvatarFallback
            className={`${
              theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
            } font-medium flex items-center justify-center`}
          >
            {profile ? getInitials(profile.name) : "U"}
          </AvatarFallback>
        )}
      </Avatar>
    </div>
  )
}
