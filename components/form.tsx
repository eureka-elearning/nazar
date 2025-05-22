"use client"

import type React from "react"

import { useState, useRef } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import type * as z from "zod"
import { Form as UIForm } from "@/components/ui/form"
import { Button } from "@/components/ui/button"
import { ImageIcon, SlidersHorizontal, ArrowUp } from "lucide-react"
import AutoResizeTextarea from "./auto-resize-textarea"
import ImageUploadArea from "./image-upload-area"
import { formSchema } from "@/lib/form-schema"
import { useMediaQuery } from "@/hooks/use-media-query"
import { cn } from "@/lib/utils"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"

interface FormProps {
  isLoading: boolean
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>
  onOpenOptions: () => void
}

export default function Form({ isLoading, onSubmit, onOpenOptions }: FormProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isFocused, setIsFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const dropAreaRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const dragCounter = useRef(0)
  const isMobile = useMediaQuery("(max-width: 768px)")

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      images: [],
      condition_mode: "concat",
      quality: "medium",
      geometry_file_format: "glb",
      use_hyper: false,
      tier: "Regular",
      TAPose: false,
      material: "PBR",
    },
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    addImages(files)
  }

  const addImages = (files: File[]) => {
    if (files.length === 0) return

    // Limit to 5 images total
    const currentImages = form.getValues("images") || []
    const totalImages = currentImages.length + files.length

    if (totalImages > 5) {
      setError(t("form.maxImages"))
      const allowedNewImages = 5 - currentImages.length
      files = files.slice(0, allowedNewImages)

      if (files.length === 0) return
    }

    const newPreviewUrls = files.map((file) => URL.createObjectURL(file))
    const updatedImages = [...currentImages, ...files]

    setPreviewUrls([...previewUrls, ...newPreviewUrls])
    form.setValue("images", updatedImages)
  }

  const removeImage = (index: number) => {
    const currentImages = form.getValues("images") || []
    const newImages = [...currentImages]
    newImages.splice(index, 1)

    const newPreviewUrls = [...previewUrls]
    URL.revokeObjectURL(newPreviewUrls[index])
    newPreviewUrls.splice(index, 1)

    setPreviewUrls(newPreviewUrls)
    form.setValue("images", newImages)
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current += 1
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current -= 1
    if (dragCounter.current === 0) {
      setIsDragging(false)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCounter.current = 0
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      addImages(files)
    }
  }

  const handleFocus = () => {
    setIsFocused(true)
  }

  const handleBlur = () => {
    setIsFocused(false)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // On desktop, Enter submits the form unless Shift is pressed
    // On mobile, Enter creates a new line
    if (e.key === "Enter") {
      if (!isMobile && !e.shiftKey) {
        e.preventDefault()
        formRef.current?.requestSubmit()
      }
    }
  }

  return (
    <div className="absolute bottom-8 left-0 right-0 mx-auto mobile-prompt-container">
      <UIForm {...form}>
        <form ref={formRef} onSubmit={form.handleSubmit(onSubmit)} className="relative w-full">
          <div
            ref={dropAreaRef}
            className={cn(
              "relative backdrop-blur-md rounded-[24px] overflow-hidden transition-all shadow-lg theme-transition",
              theme === "dark"
                ? "bg-black/60 border border-[rgba(255,255,255,0.12)]"
                : "bg-white/60 border border-[rgba(0,0,0,0.12)]",
              isDragging
                ? theme === "dark"
                  ? "ring-2 ring-white"
                  : "ring-2 ring-gray-800"
                : isFocused
                  ? theme === "dark"
                    ? "ring-2 ring-white"
                    : "ring-2 ring-gray-800"
                  : "",
              isLoading && "animate-pulse-loading pointer-events-none opacity-70",
            )}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {/* Image previews */}
            <ImageUploadArea previewUrls={previewUrls} onRemoveImage={removeImage} isLoading={isLoading} />

            <div className="px-2 py-1.5">
              <div className="flex items-center">
                <div className="flex space-x-0">
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={triggerFileInput}
                    className="rounded-full h-10 w-10 ml-0 button-hover-effect"
                    disabled={isLoading}
                  >
                    <ImageIcon className="h-5 w-5" />
                  </Button>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={onOpenOptions}
                    className="rounded-full h-10 w-10 ml-0 button-hover-effect"
                    disabled={isLoading}
                  >
                    <SlidersHorizontal className="h-5 w-5" />
                  </Button>
                </div>

                <AutoResizeTextarea
                  placeholder={t("form.placeholder")}
                  className={`flex-1 bg-transparent border-0 focus:ring-0 ${
                    theme === "dark" ? "text-white placeholder:text-gray-400" : "text-gray-800 placeholder:text-gray-500"
                  } py-2 px-3 resize-none text-base tracking-normal`}
                  {...form.register("prompt")}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  onKeyDown={handleKeyDown}
                  disabled={isLoading}
                />

                <div>
                  <Button
                    type="submit"
                    variant={theme === "dark" ? "light" : "dark"}
                    className="rounded-full h-10 w-10 p-0 flex items-center justify-center button-hover-effect button-active-effect"
                    disabled={isLoading}
                  >
                    <ArrowUp className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {isDragging && (
              <div
                className={`absolute inset-0 ${
                  theme === "dark" ? "bg-black/80" : "bg-white/80"
                } flex items-center justify-center pointer-events-none z-10`}
              >
                <p className={`font-medium tracking-normal text-lg ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {t("form.dropImages")}
                </p>
              </div>
            )}
          </div>

          {error && (
            <div className={`mt-2 text-sm tracking-normal ${theme === "dark" ? "text-red-400" : "text-red-600"}`}>
              {error}
            </div>
          )}
        </form>
      </UIForm>
    </div>
  )
}