"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Palette } from "lucide-react"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/contexts/language-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"

interface TextureCustomizerProps {
  onApplyTexture: (settings: TextureSettings) => void
}

interface TextureSettings {
  roughness: number
  metalness: number
  color: string
  normalMapIntensity: number
}

export default function TextureCustomizer({ onApplyTexture }: TextureCustomizerProps) {
  const { t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [settings, setSettings] = useState<TextureSettings>({
    roughness: 0.5,
    metalness: 0.5,
    color: "#ffffff",
    normalMapIntensity: 1.0,
  })
  const isMobile = useMediaQuery("(max-width: 768px)")
  const { theme } = useLanguage()

  const handleChange = (key: keyof TextureSettings, value: any) => {
    setSettings((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleApply = () => {
    onApplyTexture(settings)
    setIsOpen(false)
  }

  const content = (
    <div className="space-y-6 py-4">
      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-white font-mono tracking-normal">Color</Label>
          <div className="w-8 h-8 rounded-full border border-white/20" style={{ backgroundColor: settings.color }} />
        </div>
        <div className="flex gap-2">
          <input
            type="color"
            value={settings.color}
            onChange={(e) => handleChange("color", e.target.value)}
            className="w-full h-10 bg-transparent border-none"
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-white font-mono tracking-normal">Roughness</Label>
          <span>{settings.roughness.toFixed(2)}</span>
        </div>
        <Slider
          value={[settings.roughness]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => handleChange("roughness", value[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-white font-mono tracking-normal">Metalness</Label>
          <span>{settings.metalness.toFixed(2)}</span>
        </div>
        <Slider
          value={[settings.metalness]}
          min={0}
          max={1}
          step={0.01}
          onValueChange={(value) => handleChange("metalness", value[0])}
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <div className="flex justify-between">
          <Label className="text-white font-mono tracking-normal">Normal Map Intensity</Label>
          <span>{settings.normalMapIntensity.toFixed(2)}</span>
        </div>
        <Slider
          value={[settings.normalMapIntensity]}
          min={0}
          max={2}
          step={0.01}
          onValueChange={(value) => handleChange("normalMapIntensity", value[0])}
          className="w-full"
        />
      </div>

      {!isMobile && (
        <div className="flex justify-end gap-2">
          <Button onClick={() => setIsOpen(false)} variant="outline" className="button-hover-effect">
            Cancel
          </Button>
          <Button
            onClick={handleApply}
            variant={theme === "dark" ? "light" : "dark"}
            className="button-hover-effect button-active-effect"
          >
            Apply
          </Button>
        </div>
      )}
    </div>
  )

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        variant={theme === "dark" ? "dark" : "outline"}
        className="rounded-full px-3 py-2 flex items-center gap-1 h-auto button-hover-effect button-active-effect"
      >
        <Palette className="h-4 w-4" />
        <span className="tracking-normal text-sm">Customize</span>
      </Button>

      {isMobile ? (
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerContent className="bg-black border-t border-[rgba(255,255,255,0.12)] text-white">
            <div className="mx-auto w-full max-w-md">
              <DrawerHeader>
                <DrawerTitle className="text-xl text-white font-mono tracking-normal">
                  Texture Customization
                </DrawerTitle>
              </DrawerHeader>
              <div className="px-4">{content}</div>
              <DrawerFooter>
                <Button
                  onClick={handleApply}
                  variant={theme === "dark" ? "light" : "dark"}
                  className="button-hover-effect button-active-effect"
                >
                  Apply
                </Button>
                <Button onClick={() => setIsOpen(false)} variant="outline" className="button-hover-effect">
                  Cancel
                </Button>
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      ) : (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="bg-black border-[rgba(255,255,255,0.12)] text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl text-white font-mono tracking-normal">Texture Customization</DialogTitle>
            </DialogHeader>
            {content}
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
