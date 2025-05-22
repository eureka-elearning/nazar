"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/contexts/language-context"
import { useAuth } from "@/contexts/auth-context"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useTheme } from "@/contexts/theme-context"

const emailSchema = z.object({
  email: z.string().email(),
})

interface ForgotPasswordFormProps {
  onCancel: () => void
}

export default function ForgotPasswordForm({ onCancel }: ForgotPasswordFormProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { resetPassword } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof emailSchema>>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  })

  async function onSubmit(values: z.infer<typeof emailSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await resetPassword(values.email)
      setSuccess(t("auth.resetLinkSent"))
    } catch (err: any) {
      console.error("Reset password error:", err)
      setError(err.message || t("auth.resetError"))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"} mb-2`}>
            {t("auth.resetInstructions")}
          </div>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={theme === "dark" ? "text-white" : "text-gray-800"}>{t("auth.email")}</FormLabel>
                <FormControl>
                  <Input
                    placeholder="email@example.com"
                    {...field}
                    className={
                      theme === "dark"
                        ? "bg-black/50 border-[rgba(255,255,255,0.12)] text-white"
                        : "bg-white/50 border-[rgba(0,0,0,0.12)] text-gray-800"
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
          <div className="flex justify-between">
            <Button
              type="button"
              variant="outline"
              className={`${
                theme === "dark"
                  ? "border-white/20 text-white hover:bg-gray-900"
                  : "border-gray-300 text-gray-800 hover:bg-gray-100"
              } button-hover-effect`}
              onClick={onCancel}
            >
              {t("auth.cancel")}
            </Button>
            <Button
              type="submit"
              className={`${
                theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-gray-800 text-white hover:bg-gray-700"
              } button-hover-effect button-active-effect`}
              disabled={isLoading}
            >
              {isLoading ? t("auth.sending") : t("auth.sendResetLink")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
