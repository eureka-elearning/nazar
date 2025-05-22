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

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

interface SignInFormProps {
  onSuccess: () => void
  onForgotPassword: () => void
}

export default function SignInForm({ onSuccess, onForgotPassword }: SignInFormProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { signIn, resendConfirmationEmail } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)
    setUnconfirmedEmail(null)

    try {
      await signIn(values.email, values.password)
      onSuccess()
    } catch (err: any) {
      console.error("Sign in error:", err)
      if (err.message === "Invalid login credentials") {
        setError(t("auth.invalidCredentials"))
      } else if (err.message === "Email not confirmed") {
        setError(t("auth.emailNotConfirmed"))
        setUnconfirmedEmail(values.email)
      } else {
        setError(err.message || t("auth.signInError"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  async function handleResendConfirmation() {
    if (!unconfirmedEmail) return

    setIsResending(true)
    setError(null)
    setSuccess(null)

    try {
      await resendConfirmationEmail(unconfirmedEmail)
      setSuccess(t("auth.confirmationEmailResent"))
    } catch (err: any) {
      console.error("Resend confirmation error:", err)
      setError(err.message || t("auth.resendError"))
    } finally {
      setIsResending(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={theme === "dark" ? "text-white" : "text-gray-800"}>{t("auth.password")}</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
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
        {unconfirmedEmail && (
          <div className="flex justify-center">
            <Button
              type="button"
              variant="link"
              className={`${
                theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-500"
              } p-0 h-auto`}
              onClick={handleResendConfirmation}
              disabled={isResending}
            >
              {isResending ? t("auth.resending") : t("auth.resendConfirmationEmail")}
            </Button>
          </div>
        )}
        <div className="flex justify-end">
          <Button
            type="button"
            variant="link"
            className={`${
              theme === "dark" ? "text-gray-400 hover:text-white" : "text-gray-600 hover:text-gray-800"
            } p-0 h-auto`}
            onClick={onForgotPassword}
          >
            {t("auth.forgotPassword")}
          </Button>
        </div>
        <Button
          type="submit"
          className={`w-full ${
            theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-gray-800 text-white hover:bg-gray-700"
          } button-hover-effect button-active-effect`}
          disabled={isLoading}
        >
          {isLoading ? t("auth.signingIn") : t("auth.signIn")}
        </Button>
      </form>
    </Form>
  )
}
