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

const verificationSchema = z.object({
  code: z.string().min(6).max(6),
})

interface EmailVerificationFormProps {
  onSuccess: () => void
  onCancel: () => void
}

export default function EmailVerificationForm({ onSuccess, onCancel }: EmailVerificationFormProps) {
  const { t } = useLanguage()
  const { resendVerificationEmail, verifyEmail } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      code: "",
    },
  })

  async function onSubmit(values: z.infer<typeof verificationSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await verifyEmail(values.code)
      setSuccess(t("auth.emailVerified"))
      setTimeout(() => {
        onSuccess()
      }, 2000)
    } catch (err) {
      setError(t("auth.invalidVerificationCode"))
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendCode() {
    setIsResending(true)
    setError(null)
    setSuccess(null)

    try {
      await resendVerificationEmail()
      setSuccess(t("auth.verificationCodeResent"))
    } catch (err) {
      setError(t("auth.resendError"))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-sm text-gray-400 mb-2">{t("auth.verificationInstructions")}</div>
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white">{t("auth.verificationCode")}</FormLabel>
              <FormControl>
                <Input
                  placeholder="123456"
                  {...field}
                  className="bg-black/50 border-[rgba(255,255,255,0.12)] text-white"
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
            className="border-white/20 text-white hover:bg-gray-900"
            onClick={handleResendCode}
            disabled={isResending}
          >
            {isResending ? t("auth.resending") : t("auth.resendCode")}
          </Button>
          <Button type="submit" className="bg-white text-black hover:bg-gray-200" disabled={isLoading}>
            {isLoading ? t("auth.verifying") : t("auth.verifyEmail")}
          </Button>
        </div>
        <div className="text-center">
          <Button type="button" variant="link" className="text-gray-400 hover:text-white" onClick={onCancel}>
            {t("auth.skipVerification")}
          </Button>
        </div>
      </form>
    </Form>
  )
}
