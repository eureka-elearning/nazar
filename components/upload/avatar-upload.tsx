"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface AvatarUploadProps {
  size?: "xs" | "sm" | "md" | "lg"
  className?: string
}

export default function AvatarUpload({ size = "md", className = "" }: AvatarUploadProps) {
  const { user, profile, updateProfile } = useAuth()
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(profile?.avatar_url || null)

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

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleUpload = async () => {
    if (!selectedFile) {
      setError(t("avatar.invalidFileType"))
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const fileExt = selectedFile.name.split(".").pop()
      const filePath = `avatars/${user?.id}/${user?.id}.${fileExt}`

      const { data, error: uploadError } = await supabase.storage.from("avatars").upload(filePath, selectedFile, {
        cacheControl: "3600",
        upsert: false,
      })

      if (uploadError) {
        throw uploadError
      }

      const { data: publicUrlData } = supabase.storage.from("avatars").getPublicUrl(filePath)
      const publicUrl = publicUrlData.publicUrl

      await updateProfile({ avatar_url: publicUrl })

      setSuccess(t("avatar.uploadSuccess"))
      setPreviewUrl(publicUrl)
      setTimeout(() => {
        setOpen(false)
        setSuccess(null)
      }, 2000)
    } catch (err: any) {
      console.error("Avatar upload error:", err)
      setError(err.message || t("avatar.uploadError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className={`${className} ${sizeClasses[size || "md"]} rounded-full overflow-hidden relative button-hover-effect`}
          >
            <Avatar
              className={`${sizeClasses[size || "md"]} border-2 ${theme === "dark" ? "border-white/20" : "border-gray-300"}`}
            >
              {previewUrl ? (
                <AvatarImage src={previewUrl || "/placeholder.svg"} alt={profile?.name || "Avatar"} />
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
          </Button>
        </DialogTrigger>
        <DialogContent
          className={`${
            theme === "dark"
              ? "bg-black border-[rgba(255,255,255,0.12)] text-white max-w-md"
              : "bg-white border-[rgba(0,0,0,0.12)] text-gray-800 max-w-md"
          }`}
        >
          <DialogHeader>
            <DialogTitle className="text-xl font-mono tracking-normal">Upload Avatar</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="picture" className="text-right">
                Picture
              </Label>
              <Input type="file" id="picture" accept="image/*" onChange={handleFileChange} className="col-span-3" />
            </div>
            {previewUrl && (
              <div className="flex justify-center">
                <Avatar
                  className={`${sizeClasses["md"]} border-2 ${theme === "dark" ? "border-white/20" : "border-gray-300"}`}
                >
                  <AvatarImage src={previewUrl || "/placeholder.svg"} alt="Preview" />
                  <AvatarFallback>{profile ? getInitials(profile.name) : "U"}</AvatarFallback>
                </Avatar>
              </div>
            )}
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
          </div>
          <div className="flex justify-end">
            <Button type="button" onClick={handleUpload} disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
