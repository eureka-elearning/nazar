"use client"

import { useState, useEffect, useRef } from "react"
import { ExternalLink, Download, ArrowLeft, Menu, X, LogOut } from "lucide-react"
import type { FormValues } from "@/lib/form-schema"
import { submitRodinJob, checkJobStatus, downloadModel } from "@/lib/api-service"
import ModelViewer from "./model-viewer"
import Form from "./form"
import StatusIndicator from "./status-indicator"
import OptionsDialog from "./options-dialog"
import { Button } from "@/components/ui/button"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useLanguage } from "@/contexts/language-context"
import LanguageSwitcher from "./language-switcher"
import TextureCustomizer from "./texture-customizer"
import ARView from "./ar-view"
import UserMenu from "./auth/user-menu"
import SaveModelDialog from "./save-model-dialog"
import { useAuth } from "@/contexts/auth-context"
import html2canvas from "html2canvas"
import { Sheet, SheetContent } from "@/components/ui/sheet"
import ThemeSwitcher from "./theme-switcher"
import { useTheme } from "@/contexts/theme-context"
import AvatarUpload from "./auth/avatar-upload"
import { motion, AnimatePresence } from "framer-motion"
import Footer from "./footer"

export default function Rodin() {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { user, signOut, profile } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<any>(null)
  const [isPolling, setIsPolling] = useState(false)
  const [modelUrl, setModelUrl] = useState<string | null>(null)
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null)
  const [jobStatuses, setJobStatuses] = useState<Array<{ uuid: string; status: string }>>([])
  const [showOptions, setShowOptions] = useState(false)
  const [showPromptContainer, setShowPromptContainer] = useState(true)
  const [showSaveDialog, setShowSaveDialog] = useState(false)
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const modelViewerRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const [options, setOptions] = useState({
    condition_mode: "concat" as const,
    quality: "medium" as const,
    geometry_file_format: "glb" as const,
    use_hyper: false,
    tier: "Regular" as const,
    TAPose: false,
    material: "PBR" as const,
  })
  const [showAuthDialog, setShowAuthDialog] = useState(false)

  // Prevent body scroll on mobile
  useEffect(() => {
    if (isMobile) {
      document.body.style.overflow = "hidden"
      document.documentElement.style.overflow = "hidden"

      return () => {
        document.body.style.overflow = ""
        document.documentElement.style.overflow = ""
      }
    }
  }, [isMobile])

  // Блокировка прокрутки при открытом мобильном меню
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      // Возвращаем прокрутку только если не на мобильном устройстве
      if (!isMobile) {
        document.body.style.overflow = ""
      }
    }
  }, [mobileMenuOpen, isMobile])

  const handleOptionsChange = (newOptions: any) => {
    setOptions(newOptions)
  }

  // Inside the Rodin component, add this function to handle texture customization
  const handleTextureCustomization = (settings: any) => {
    console.log("Applying texture settings:", settings)
    // В реальной реализации это обновило бы материал 3D-модели
  }

  async function handleStatusCheck(subscriptionKey: string, taskUuid: string) {
    try {
      setIsPolling(true)

      const data = await checkJobStatus(subscriptionKey)
      console.log("Status response:", data)

      // Check if jobs array exists
      if (!data.jobs || !Array.isArray(data.jobs) || data.jobs.length === 0) {
        throw new Error("No jobs found in status response")
      }

      // Update job statuses
      setJobStatuses(data.jobs)

      // Check status of all jobs
      const allJobsDone = data.jobs.every((job: any) => job.status === "Done")
      const anyJobFailed = data.jobs.some((job: any) => job.status === "Failed")

      if (allJobsDone) {
        setIsPolling(false)

        // Get the download URL using the task UUID
        try {
          const downloadData = await downloadModel(taskUuid)
          console.log("Download response:", downloadData)

          // Check if there's an error in the download response
          if (downloadData.error && downloadData.error !== "OK") {
            throw new Error(`Download error: ${downloadData.error}`)
          }

          // Find the first GLB file to display in the 3D viewer
          if (downloadData.list && downloadData.list.length > 0) {
            const glbFile = downloadData.list.find((file: { name: string }) => file.name.toLowerCase().endsWith(".glb"))

            if (glbFile) {
              const proxyUrl = `/api/proxy-download?url=${encodeURIComponent(glbFile.url)}`
              setModelUrl(proxyUrl)
              setDownloadUrl(glbFile.url)
              setIsLoading(false)
              setShowPromptContainer(false)

              // Создаем скриншот модели для миниатюры после загрузки
              setTimeout(captureModelThumbnail, 2000)
            } else {
              setError(t("error.noGlb"))
              setIsLoading(false)
            }
          } else {
            setError(t("error.noFiles"))
            setIsLoading(false)
          }
        } catch (downloadErr) {
          setError(`${t("error.download")}: ${downloadErr instanceof Error ? downloadErr.message : "Unknown error"}`)
          setIsLoading(false)
        }
      } else if (anyJobFailed) {
        setIsPolling(false)
        setError(t("error.generation"))
        setIsLoading(false)
      } else {
        // Still processing, poll again after a delay
        setTimeout(() => handleStatusCheck(subscriptionKey, taskUuid), 3000)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : t("error.status"))
      setIsPolling(false)
      setIsLoading(false)
    }
  }

  async function handleSubmit(values: FormValues) {
    setIsLoading(true)
    setError(null)
    setResult(null)
    setModelUrl(null)
    setDownloadUrl(null)
    setJobStatuses([])
    setThumbnailUrl(null)

    try {
      const formData = new FormData()

      if (values.images && values.images.length > 0) {
        values.images.forEach((image) => {
          formData.append("images", image)
        })
      }

      if (values.prompt) {
        formData.append("prompt", values.prompt)
      }

      // Add all the advanced options
      formData.append("condition_mode", options.condition_mode)
      formData.append("geometry_file_format", options.geometry_file_format)
      formData.append("material", options.material)
      formData.append("quality", options.quality)
      formData.append("use_hyper", options.use_hyper.toString())
      formData.append("tier", options.tier)
      formData.append("TAPose", options.TAPose.toString())
      formData.append("mesh_mode", "Quad")
      formData.append("mesh_simplify", "true")
      formData.append("mesh_smooth", "true")

      // Make the API call through our server route
      const data = await submitRodinJob(formData)
      console.log("Generation response:", data)

      setResult(data)

      // Start polling for status
      if (data.jobs && data.jobs.subscription_key && data.uuid) {
        handleStatusCheck(data.jobs.subscription_key, data.uuid)
      } else {
        setError("Missing required data for status checking")
        setIsLoading(false)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setIsLoading(false)
    }
  }

  // Обновим функцию handleDownload в компоненте Rodin
  const handleDownload = () => {
    if (downloadUrl) {
      // Сохраняем URL в консоли для отладки
      console.log("Download URL:", downloadUrl)
      window.open(downloadUrl, "_blank")
    }
  }

  // Обновим функцию handleSaveModel в компоненте Rodin
  const handleSaveModel = () => {
    if (!user) {
      // Если пользователь не авторизован, открываем диалог авторизации
      setShowAuthDialog(true)
      return
    }

    if (!modelUrl) {
      setError(t("saveModel.noModel"))
      return
    }

    // Логируем URL модели для отладки
    console.log("Model URL for saving:", modelUrl)
    console.log("Thumbnail URL for saving:", thumbnailUrl)

    setShowSaveDialog(true)
  }

  const handleBack = () => {
    setShowPromptContainer(true)
  }

  // Функция для создания скриншота модели
  const captureModelThumbnail = async () => {
    if (!modelViewerRef.current) return

    try {
      const canvas = await html2canvas(modelViewerRef.current, {
        backgroundColor: null,
        logging: false,
        useCORS: true,
      })
      const dataUrl = canvas.toDataURL("image/png")
      setThumbnailUrl(dataUrl)
    } catch (error) {
      console.error("Failed to capture thumbnail", error)
    }
  }

  const ExternalLinks = () => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-4 sm:space-y-0">
      <a
        href="https://hyper3d.ai"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center ${
          theme === "dark" ? "text-white hover:text-gray-300" : "text-gray-800 hover:text-gray-600"
        } transition-colors tracking-normal`}
      >
        <span className="mr-1">{t("app.website")}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
      <a
        href="https://developer.hyper3d.ai"
        target="_blank"
        rel="noopener noreferrer"
        className={`flex items-center ${
          theme === "dark" ? "text-white hover:text-gray-300" : "text-gray-800 hover:text-gray-600"
        } transition-colors tracking-normal`}
      >
        <span className="mr-1">{t("app.docs")}</span>
        <ExternalLink className="h-4 w-4" />
      </a>
    </div>
  )

  // Анимационные варианты для элементов меню
  const menuItemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1.0],
      },
    }),
    exit: { opacity: 0, x: 20, transition: { duration: 0.3 } },
  }

  // Мобильное меню
  const MobileMenu = () => (
    <>
      <motion.button
        whileTap={{ scale: 0.95 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setMobileMenuOpen(true)}
        className="absolute top-6 right-6 z-20 md:hidden button-hover-effect bg-transparent border-none p-0 m-0 flex items-center justify-center"
        aria-label="Menu"
      >
        <Menu className="h-6 w-6" />
      </motion.button>

      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent
          side="right"
          className={`${
            theme === "dark"
              ? "bg-black border-[rgba(255,255,255,0.12)] text-white"
              : "bg-white border-[rgba(0,0,0,0.12)] text-gray-800"
          } p-6 w-[80vw] max-w-xs overflow-y-auto`}
        >
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                className="flex flex-col h-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="flex justify-between items-center mb-8"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <h2 className="text-xl font-bold">{t("app.title")}</h2>
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    whileHover={{ scale: 1.1 }}
                    onClick={() => setMobileMenuOpen(false)}
                    className="button-hover-effect bg-transparent border-none p-0 m-0 flex items-center justify-center"
                  >
                    <X className="h-5 w-5" />
                  </motion.button>
                </motion.div>

                <div className="space-y-6 flex-1">
                  <motion.div
                    className="space-y-2"
                    custom={0}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuItemVariants}
                  >
                    <h3
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("app.powered")}
                    </h3>
                    <ExternalLinks />
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    custom={1}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuItemVariants}
                  >
                    <h3
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("language.title")}
                    </h3>
                    <div className="pl-1">
                      <LanguageSwitcher />
                    </div>
                  </motion.div>

                  <motion.div
                    className="space-y-2"
                    custom={2}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={menuItemVariants}
                  >
                    <h3
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      } uppercase tracking-wider`}
                    >
                      {t("theme.title")}
                    </h3>
                    <div className="pl-1">
                      <ThemeSwitcher />
                    </div>
                  </motion.div>

                  {user && (
                    <motion.div
                      className="space-y-2"
                      custom={3}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      variants={menuItemVariants}
                    >
                      <h3
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-400" : "text-gray-500"
                        } uppercase tracking-wider`}
                      >
                        {t("user.account")}
                      </h3>
                      <div className="pl-1">
                        <Button
                          variant="ghost"
                          onClick={handleSaveModel}
                          className={`${
                            theme === "dark" ? "text-white hover:bg-white/10" : "text-gray-800 hover:bg-black/10"
                          } px-0 justify-start`}
                          disabled={!modelUrl}
                        >
                          {t("user.saveModel")}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </div>

                <motion.div
                  className="mt-auto pt-6 border-t border-white/10"
                  custom={4}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={menuItemVariants}
                >
                  {user ? (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <AvatarUpload size="xs" />
                        <div>
                          <p
                            className={`font-medium text-sm ${
                              theme === "dark" ? "text-white" : "text-gray-800"
                            } truncate max-w-[120px]`}
                          >
                            {profile?.name || user.email?.split("@")[0]}
                          </p>
                          <p
                            className={`text-xs ${
                              theme === "dark" ? "text-gray-400" : "text-gray-500"
                            } truncate max-w-[120px]`}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={signOut}
                        className={`${
                          theme === "dark" ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-500"
                        } p-2 bg-transparent border-none flex items-center justify-center`}
                      >
                        <LogOut className="h-4 w-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <UserMenu onSaveModel={handleSaveModel} />
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </SheetContent>
      </Sheet>
    </>
  )

  return (
    <div className="relative h-[100dvh] w-full">
      {/* Full-screen canvas */}
      <div className="absolute inset-0 z-0" ref={modelViewerRef}>
        <ModelViewer modelUrl={isLoading ? null : modelUrl} />
      </div>

      {/* Overlay UI */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Logo in top left */}
        <div className="absolute top-6 left-6 pointer-events-auto animation-fade-in">
          <h1
            className={`text-2xl md:text-3xl font-normal tracking-normal ${
              theme === "dark" ? "text-white" : "text-gray-800"
            }`}
          >
            {t("app.title")}
          </h1>
          <p
            className={`${
              theme === "dark" ? "text-gray-400" : "text-gray-500"
            } text-xs md:text-sm mt-1 tracking-normal`}
          >
            {t("app.powered")}
          </p>
        </div>

        {/* Mobile menu button */}
        <div className="pointer-events-auto md:hidden">
          <MobileMenu />
        </div>

        {/* Links in top right - desktop only */}
        {!isMobile && (
          <div className="absolute top-6 right-6 pointer-events-auto flex items-center space-x-4">
            <ExternalLinks />
            <LanguageSwitcher />
            <ThemeSwitcher />
          </div>
        )}

        {/* Loading indicator */}
        <StatusIndicator isLoading={isLoading} jobStatuses={jobStatuses} />

        {/* Error message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`absolute top-20 left-1/2 transform -translate-x-1/2 ${
              theme === "dark" ? "bg-gray-900/80 text-white" : "bg-gray-100/80 text-gray-800 border border-gray-300/50"
            } px-4 py-2 rounded-md tracking-normal max-w-[90vw] text-center`}
          >
            {error}
          </motion.div>
        )}

        {/* Model controls when model is loaded */}
        {!isLoading && modelUrl && !showPromptContainer && (
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-wrap items-center gap-3 pointer-events-auto justify-center max-w-[90vw] stagger-animation">
            <Button
              onClick={handleBack}
              variant={theme === "dark" ? "dark" : "outline"}
              className="rounded-full px-3 py-2 flex items-center gap-1 h-auto button-hover-effect button-active-effect"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="tracking-normal text-sm">{t("controls.back")}</span>
            </Button>

            <TextureCustomizer onApplyTexture={handleTextureCustomization} />

            <ARView modelUrl={modelUrl} />

            <Button
              onClick={handleDownload}
              variant={theme === "dark" ? "light" : "dark"}
              className="rounded-full px-3 py-2 flex items-center gap-1 h-auto button-hover-effect button-active-effect"
            >
              <Download className="h-4 w-4" />
              <span className="tracking-normal text-sm">{t("controls.download")}</span>
            </Button>
          </div>
        )}

        {/* Input field at bottom */}
        {showPromptContainer && (
          <div className="absolute bottom-8 left-0 right-0 mx-auto w-full max-w-3xl px-4 sm:px-0 pointer-events-auto animation-slide-up">
            <div className="flex justify-end mb-4">{!isMobile && <UserMenu onSaveModel={handleSaveModel} />}</div>
            <Form isLoading={isLoading} onSubmit={handleSubmit} onOpenOptions={() => setShowOptions(true)} />
          </div>
        )}

        {/* Добавляем Footer */}
        <div className="pointer-events-auto animation-fade-in" style={{ animationDelay: "0.5s" }}>
          <Footer />
        </div>
      </div>

      {/* Options Dialog/Drawer */}
      <OptionsDialog
        open={showOptions}
        onOpenChange={setShowOptions}
        options={options}
        onOptionsChange={handleOptionsChange}
      />

      {/* Save Model Dialog */}
      <SaveModelDialog
        open={showSaveDialog}
        onOpenChange={setShowSaveDialog}
        modelUrl={modelUrl}
        thumbnailUrl={thumbnailUrl || undefined}
      />
    </div>
  )
}
