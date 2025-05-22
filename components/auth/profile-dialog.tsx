"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import AvatarUpload from "./avatar-upload"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

// Добавим импорт useMediaQuery в начало файла
import { useMediaQuery } from "@/hooks/use-media-query"

interface ProfileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ProfileDialog({ open, onOpenChange }: ProfileDialogProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { profile, updateProfile } = useAuth()
  const [name, setName] = useState(profile?.name || "")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Добавим определение isMobile в компонент ProfileDialog
  const isMobile = useMediaQuery("(max-width: 640px)")

  const handleSave = async () => {
    if (!name.trim()) {
      setError(t("profile.nameRequired"))
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await updateProfile({ name })
      setSuccess(t("profile.updateSuccess"))
      setTimeout(() => {
        setSuccess(null)
      }, 3000)
    } catch (err: any) {
      console.error("Profile update error:", err)
      setError(err.message || t("profile.updateError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={
          theme === "dark"
            ? "bg-black border-[rgba(255,255,255,0.12)] text-white max-w-md"
            : "bg-white border-[rgba(0,0,0,0.12)] text-gray-800 max-w-md"
        }
      >
        <DialogHeader>
          <DialogTitle
            className={`text-xl ${theme === "dark" ? "text-white" : "text-gray-800"} font-mono tracking-normal`}
          >
            {t("profile.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="flex justify-center">
            <AvatarUpload size={isMobile ? "md" : "lg"} className="mb-2" />
          </div>

          <div className="space-y-2">
            <Label className={theme === "dark" ? "text-white" : "text-gray-800"}>{t("profile.name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("profile.namePlaceholder")}
              className={
                theme === "dark"
                  ? "bg-black/50 border-[rgba(255,255,255,0.12)] text-white"
                  : "bg-white/50 border-[rgba(0,0,0,0.12)] text-gray-800"
              }
            />
          </div>

          <div className="space-y-2">
            <Label className={theme === "dark" ? "text-white" : "text-gray-800"}>{t("profile.email")}</Label>
            <Input
              value={profile?.email || ""}
              readOnly
              disabled
              className={
                theme === "dark"
                  ? "bg-black/50 border-[rgba(255,255,255,0.12)] text-gray-400"
                  : "bg-white/50 border-[rgba(0,0,0,0.12)] text-gray-500"
              }
            />
            <p className={`text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>
              {t("profile.emailReadOnly")}
            </p>
          </div>

          {error && (
            <Alert variant="destructive" className="bg-red-900/20 border-red-900 text-red-400">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-900/20 border-green-900 text-green-400">
              <CheckCircle2 className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          <div className="flex justify-end gap-2">
            <Button
              onClick={() => onOpenChange(false)}
              variant="outline"
              className={`${
                theme === "dark"
                  ? "border-white/20 text-white hover:bg-gray-900"
                  : "border-gray-300 text-gray-800 hover:bg-gray-100"
              } button-hover-effect`}
            >
              {t("profile.cancel")}
            </Button>
            <Button
              onClick={handleSave}
              className={`${
                theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-gray-800 text-white hover:bg-gray-700"
              } button-hover-effect button-active-effect`}
              disabled={isLoading}
            >
              {isLoading ? t("profile.saving") : t("profile.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
