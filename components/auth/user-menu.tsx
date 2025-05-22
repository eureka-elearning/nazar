"use client"

import { useState } from "react"
import { User, LogOut, Save, UserCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import AuthDialog from "./auth-dialog"
import ProfileDialog from "./profile-dialog"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useTheme } from "@/contexts/theme-context"
import AvatarUpload from "@/components/upload/avatar-upload"

interface UserMenuProps {
  onSaveModel: () => void
}

export default function UserMenu({ onSaveModel }: UserMenuProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { user, profile, signOut } = useAuth()
  const [showAuthDialog, setShowAuthDialog] = useState(false)
  const [showProfileDialog, setShowProfileDialog] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")

  // Get user initials for avatar
  const getInitials = (name: string) => {
    if (!name) return "U"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2)
  }

  // Для мобильного меню, если пользователь не авторизован
  if (isMobile && !user) {
    return (
      <>
        <Button onClick={() => setShowAuthDialog(true)} variant="ghost" className="button-hover-effect">
          {t("auth.signIn")}
        </Button>

        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    )
  }

  // Для мобильного меню, если пользователь авторизован
  if (isMobile && user) {
    return (
      <>
        <div className="flex flex-col space-y-4">
          <div className="flex items-center gap-3 mb-2">
            <AvatarUpload size="xs" />
            <div className="overflow-hidden">
              <p className={`font-medium truncate max-w-[150px] ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                {profile?.name || user.email?.split("@")[0]}
              </p>
              <p className={`text-xs truncate max-w-[150px] ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
                {user.email}
              </p>
            </div>
          </div>
          <Button
            onClick={() => setShowProfileDialog(true)}
            variant="ghost"
            className={`${
              theme === "dark" ? "text-white hover:text-gray-300" : "text-gray-800 hover:text-gray-600"
            } button-hover-effect p-0 justify-start`}
          >
            {t("profile.title")}
          </Button>
          <Button onClick={signOut} variant="ghost" className="text-red-400 hover:text-red-300 button-hover-effect p-0">
            {t("auth.signOut")}
          </Button>
        </div>

        <ProfileDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />
      </>
    )
  }

  // Для десктопа, если пользователь не авторизован
  if (!user) {
    return (
      <>
        <Button
          onClick={() => setShowAuthDialog(true)}
          variant={theme === "dark" ? "dark" : "outline"}
          className="rounded-full px-4 py-2 flex items-center gap-2 button-hover-effect button-active-effect"
        >
          <User className="h-4 w-4" />
          <span className="tracking-normal">{t("auth.signIn")}</span>
        </Button>

        <AuthDialog open={showAuthDialog} onOpenChange={setShowAuthDialog} />
      </>
    )
  }

  // Для десктопа, если пользователь авторизован
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant={theme === "dark" ? "dark" : "outline"}
            className="rounded-full px-3 py-1.5 flex items-center gap-2 button-hover-effect h-auto"
          >
            <Avatar className="h-6 w-6 md:h-7 md:w-7">
              {profile?.avatar_url ? (
                <AvatarImage src={profile.avatar_url || "/placeholder.svg"} alt={profile.name} />
              ) : (
                <AvatarFallback
                  className={`${theme === "dark" ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"} text-xs flex items-center justify-center`}
                >
                  {profile ? getInitials(profile.name) : getInitials(user.email || "User")}
                </AvatarFallback>
              )}
            </Avatar>
            <span className="tracking-normal text-sm truncate max-w-[100px] md:max-w-[150px]">
              {profile?.name || user.email?.split("@")[0]}
            </span>
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
          <DropdownMenuItem
            className={`tracking-normal ${
              theme === "dark" ? "hover:bg-[#111111] focus:bg-[#111111]" : "hover:bg-[#f5f5f5] focus:bg-[#f5f5f5]"
            } cursor-pointer`}
            onClick={() => setShowProfileDialog(true)}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            <span>{t("profile.title")}</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            className={`tracking-normal ${
              theme === "dark" ? "hover:bg-[#111111] focus:bg-[#111111]" : "hover:bg-[#f5f5f5] focus:bg-[#f5f5f5]"
            } cursor-pointer`}
            onClick={onSaveModel}
          >
            <Save className="mr-2 h-4 w-4" />
            <span>{t("user.saveModel")}</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className={theme === "dark" ? "bg-white/10" : "bg-gray-200"} />
          <DropdownMenuItem
            className={`tracking-normal ${
              theme === "dark" ? "hover:bg-[#111111] focus:bg-[#111111]" : "hover:bg-[#f5f5f5] focus:bg-[#f5f5f5]"
            } cursor-pointer text-red-500`}
            onClick={signOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t("auth.signOut")}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ProfileDialog open={showProfileDialog} onOpenChange={setShowProfileDialog} />
    </>
  )
}
