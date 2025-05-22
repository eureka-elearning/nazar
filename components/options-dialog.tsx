"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerFooter } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useMediaQuery } from "@/hooks/use-media-query"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useLanguage } from "@/contexts/language-context"
import { useTheme } from "@/contexts/theme-context"

interface OptionsDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  options: {
    condition_mode: "concat" | "fuse"
    quality: "high" | "medium" | "low" | "extra-low"
    geometry_file_format: "glb" | "usdz" | "fbx" | "obj" | "stl"
    use_hyper: boolean
    tier: "Regular" | "Sketch"
    TAPose: boolean
    material: "PBR" | "Shaded"
  }
  onOptionsChange: (options: any) => void
}

export default function OptionsDialog({ open, onOpenChange, options, onOptionsChange }: OptionsDialogProps) {
  const { t } = useLanguage()
  const [localOptions, setLocalOptions] = useState(options)
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { theme } = useTheme()

  // Update local options when props change
  useEffect(() => {
    setLocalOptions(options)
  }, [options])

  const handleChange = (key: string, value: any) => {
    setLocalOptions((prev) => {
      const updated = { ...prev, [key]: value }
      onOptionsChange(updated)
      return updated
    })
  }

  const content = (
    <div className="py-2">
      <Tabs defaultValue="basic" className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="basic" className="tracking-normal">
            {t("options.basic")}
          </TabsTrigger>
          <TabsTrigger value="advanced" className="tracking-normal">
            {t("options.advanced")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white font-mono tracking-normal">{t("options.quality")}</Label>
              <Select value={localOptions.quality} onValueChange={(value) => handleChange("quality", value)}>
                <SelectTrigger className="bg-black border-[rgba(255,255,255,0.12)] text-white tracking-normal">
                  <SelectValue placeholder="Select quality" />
                </SelectTrigger>
                <SelectContent className="bg-black border-[rgba(255,255,255,0.12)] text-white">
                  <SelectItem value="high" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    {t("options.quality.high")}
                  </SelectItem>
                  <SelectItem value="medium" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    {t("options.quality.medium")}
                  </SelectItem>
                  <SelectItem value="low" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    {t("options.quality.low")}
                  </SelectItem>
                  <SelectItem value="extra-low" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    {t("options.quality.extraLow")}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-white font-mono tracking-normal">{t("options.format")}</Label>
              <Select
                value={localOptions.geometry_file_format}
                onValueChange={(value) => handleChange("geometry_file_format", value)}
              >
                <SelectTrigger className="bg-black border-[rgba(255,255,255,0.12)] text-white tracking-normal">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent className="bg-black border-[rgba(255,255,255,0.12)] text-white">
                  <SelectItem value="glb" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    GLB
                  </SelectItem>
                  <SelectItem value="usdz" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    USDZ
                  </SelectItem>
                  <SelectItem value="fbx" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    FBX
                  </SelectItem>
                  <SelectItem value="obj" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    OBJ
                  </SelectItem>
                  <SelectItem value="stl" className="tracking-normal hover:bg-[#111111] focus:bg-[#111111]">
                    STL
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm border-[rgba(255,255,255,0.12)] bg-black/50">
              <div>
                <Label className="text-white font-mono tracking-normal">{t("options.useHyper")}</Label>
                <p className="text-gray-400 text-xs tracking-normal">{t("options.useHyper.desc")}</p>
              </div>
              <Switch
                checked={localOptions.use_hyper}
                onCheckedChange={(checked) => handleChange("use_hyper", checked)}
              />
            </div>

            <div className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm border-[rgba(255,255,255,0.12)] bg-black/50">
              <div>
                <Label className="text-white font-mono tracking-normal">{t("options.taPose")}</Label>
                <p className="text-gray-400 text-xs tracking-normal">{t("options.taPose.desc")}</p>
              </div>
              <Switch checked={localOptions.TAPose} onCheckedChange={(checked) => handleChange("TAPose", checked)} />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="advanced" className="space-y-4">
          <div className="space-y-2">
            <Label className="text-white font-mono tracking-normal">{t("options.conditionMode")}</Label>
            <RadioGroup
              value={localOptions.condition_mode}
              onValueChange={(value) => handleChange("condition_mode", value)}
              className="flex flex-col space-y-1"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="concat" id="concat" className="border-white text-white" />
                <Label htmlFor="concat" className="text-white tracking-normal">
                  {t("options.conditionMode.concat")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="fuse" id="fuse" className="border-white text-white" />
                <Label htmlFor="fuse" className="text-white tracking-normal">
                  {t("options.conditionMode.fuse")}
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-mono tracking-normal">{t("options.material")}</Label>
            <RadioGroup
              value={localOptions.material}
              onValueChange={(value) => handleChange("material", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="PBR" id="pbr" className="border-white text-white" />
                <Label htmlFor="pbr" className="text-white tracking-normal">
                  PBR
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Shaded" id="shaded" className="border-white text-white" />
                <Label htmlFor="shaded" className="text-white tracking-normal">
                  Shaded
                </Label>
              </div>
            </RadioGroup>
          </div>

          <div className="space-y-2">
            <Label className="text-white font-mono tracking-normal">{t("options.tier")}</Label>
            <RadioGroup
              value={localOptions.tier}
              onValueChange={(value) => handleChange("tier", value)}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Regular" id="regular" className="border-white text-white" />
                <Label htmlFor="regular" className="text-white tracking-normal">
                  {t("options.tier.regular")}
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Sketch" id="sketch" className="border-white text-white" />
                <Label htmlFor="sketch" className="text-white tracking-normal">
                  {t("options.tier.sketch")}
                </Label>
              </div>
            </RadioGroup>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="bg-black border-[rgba(255,255,255,0.12)] text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl text-white font-mono tracking-normal">{t("options.title")}</DialogTitle>
          </DialogHeader>
          {content}
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="bg-black border-t border-[rgba(255,255,255,0.12)] text-white">
        <div className="mx-auto w-full max-w-md">
          <DrawerHeader>
            <DrawerTitle className="text-xl text-white font-mono tracking-normal">{t("options.title")}</DrawerTitle>
          </DrawerHeader>
          <div className="px-4">{content}</div>
          <DrawerFooter>
            <Button
              onClick={() => onOpenChange(false)}
              variant={theme === "dark" ? "light" : "dark"}
              className="button-hover-effect button-active-effect"
            >
              {t("options.apply")}
            </Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
