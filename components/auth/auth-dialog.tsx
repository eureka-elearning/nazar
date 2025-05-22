"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SignInForm from "./sign-in-form"
import SignUpForm from "./sign-up-form"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import ForgotPasswordForm from "./forgot-password-form"
import { useTheme } from "@/contexts/theme-context"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  defaultTab?: "signin" | "signup"
}

export default function AuthDialog({ open, onOpenChange, defaultTab = "signin" }: AuthDialogProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<string>(defaultTab)
  const [showForgotPassword, setShowForgotPassword] = useState(false)

  const handleSignInSuccess = () => {
    onOpenChange(false)
  }

  const handleSignUpSuccess = () => {
    onOpenChange(false)
  }

  const handleForgotPassword = () => {
    setShowForgotPassword(true)
  }

  const handleBackToSignIn = () => {
    setShowForgotPassword(false)
  }

  const getDialogTitle = () => {
    if (showForgotPassword) {
      return t("auth.resetPassword")
    }
    return activeTab === "signin" ? t("auth.signIn") : t("auth.signUp")
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
            {getDialogTitle()}
          </DialogTitle>
        </DialogHeader>

        {showForgotPassword ? (
          <ForgotPasswordForm onCancel={handleBackToSignIn} />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="signin" className="tracking-normal">
                {t("auth.signIn")}
              </TabsTrigger>
              <TabsTrigger value="signup" className="tracking-normal">
                {t("auth.signUp")}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <SignInForm onSuccess={handleSignInSuccess} onForgotPassword={handleForgotPassword} />
            </TabsContent>
            <TabsContent value="signup">
              <SignUpForm onSuccess={handleSignUpSuccess} />
            </TabsContent>
          </Tabs>
        )}
      </DialogContent>
    </Dialog>
  )
}
