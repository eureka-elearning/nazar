"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { CuboidIcon as Cube } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { useTheme } from "next-themes"

interface ARViewProps {
  modelUrl: string | null
}

export default function ARView({ modelUrl }: ARViewProps) {
  const { t } = useLanguage()
  const [isSupported, setIsSupported] = useState(false)
  const [isIOS, setIsIOS] = useState(false)
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { theme } = useTheme()

  useEffect(() => {
    // Check if AR is supported
    const checkARSupport = () => {
      const isIOSDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
      setIsIOS(isIOSDevice)

      // Check for AR support
      const isARSupported =
        // iOS AR Quick Look support
        isIOSDevice ||
        // Android AR support
        (navigator as any).xr !== undefined ||
        (window as any).WebXRPolyfill !== undefined

      setIsSupported(isARSupported)
    }

    checkARSupport()
  }, [])

  const launchAR = () => {
    if (!modelUrl) return

    if (isIOS) {
      // For iOS, we need a USDZ file
      // In a real implementation, we would convert the GLB to USDZ or have a USDZ URL
      const usdzUrl = modelUrl.replace(".glb", ".usdz")

      // Create a link with AR Quick Look data
      const anchor = document.createElement("a")
      anchor.setAttribute("rel", "ar")
      anchor.setAttribute("href", usdzUrl)
      anchor.appendChild(document.createElement("img"))
      anchor.click()
    } else {
      // For Android/WebXR
      // This is a simplified example - a real implementation would use the WebXR API
      alert("AR view is launching. In a real app, this would open WebXR.")
    }
  }

  if (!isSupported || !modelUrl) {
    return null
  }

  return (
    <Button
      onClick={launchAR}
      variant={theme === "dark" ? "dark" : "outline"}
      className="rounded-full px-3 py-2 flex items-center gap-1 h-auto button-hover-effect button-active-effect"
    >
      <Cube className="h-4 w-4" />
      <span className="tracking-normal text-sm">{isMobile ? "AR" : "View in AR"}</span>
    </Button>
  )
}
