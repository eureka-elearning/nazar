"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { useTheme } from "@/contexts/theme-context"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SaveModelDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  modelUrl: string | null
  thumbnailUrl?: string
}

export default function SaveModelDialog({ open, onOpenChange, modelUrl, thumbnailUrl }: SaveModelDialogProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { saveModel } = useAuth()
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  // Сбрасываем состояние при открытии диалога
  useEffect(() => {
    if (open) {
      setName("")
      setDescription("")
      setError(null)
      setSuccess(null)
    }
  }, [open])

  const handleSave = async () => {
    if (!modelUrl) {
      setError(t("saveModel.noModel"))
      return
    }

    if (!name.trim()) {
      setError(t("saveModel.nameRequired"))
      return
    }

    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      console.log("Saving model with URL:", modelUrl)
      console.log("Thumbnail URL:", thumbnailUrl)

      // Создаем объект модели для сохранения
      const modelData = {
        name: name.trim(),
        description: description.trim(),
        model_url: modelUrl,
        thumbnail_url: thumbnailUrl || null,
        format: modelUrl.split(".").pop() || "glb",
      }

      await saveModel(modelData)

      setSuccess(t("saveModel.success") || "Model saved successfully!")

      // Закрываем диалог через 2 секунды после успешного сохранения
      setTimeout(() => {
        onOpenChange(false)
        setName("")
        setDescription("")
      }, 2000)
    } catch (err: any) {
      console.error("Save model error:", err)
      setError(err.message || t("saveModel.error"))
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
            {t("saveModel.title")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          {thumbnailUrl && (
            <div className="flex justify-center mb-4">
              <img
                src={thumbnailUrl || "/placeholder.svg"}
                alt="Model preview"
                className="h-32 w-32 object-contain rounded-md border border-gray-700"
              />
            </div>
          )}

          <div className="space-y-2">
            <Label className={theme === "dark" ? "text-white" : "text-gray-800"}>{t("saveModel.name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("saveModel.namePlaceholder")}
              className={
                theme === "dark"
                  ? "bg-black/50 border-[rgba(255,255,255,0.12)] text-white"
                  : "bg-white/50 border-[rgba(0,0,0,0.12)] text-gray-800"
              }
            />
          </div>
          <div className="space-y-2">
            <Label className={theme === "dark" ? "text-white" : "text-gray-800"}>{t("saveModel.description")}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("saveModel.descriptionPlaceholder")}
              className={
                theme === "dark"
                  ? "bg-black/50 border-[rgba(255,255,255,0.12)] text-white resize-none h-24"
                  : "bg-white/50 border-[rgba(0,0,0,0.12)] text-gray-800 resize-none h-24"
              }
            />
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
              disabled={isLoading}
            >
              {t("saveModel.cancel")}
            </Button>
            <Button
              onClick={handleSave}
              className={`${
                theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-gray-800 text-white hover:bg-gray-700"
              } button-hover-effect button-active-effect`}
              disabled={isLoading}
            >
              {isLoading ? t("saveModel.saving") : t("saveModel.save")}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
