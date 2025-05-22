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

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: "Name must be at least 2 characters.",
    }),
    email: z.string().email(),
    password: z.string().min(6, {
      message: "Password must be at least 6 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

interface SignUpFormProps {
  onSuccess: () => void
}

export default function SignUpForm({ onSuccess }: SignUpFormProps) {
  const { t } = useLanguage()
  const { theme } = useTheme()
  const { signUp } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      await signUp(values.name, values.email, values.password)
      setSuccess(t("auth.signUpSuccessConfirmEmail"))
      setTimeout(() => {
        onSuccess()
      }, 3000)
    } catch (err: any) {
      console.error("Sign up error:", err)
      if (err.message.includes("already registered")) {
        setError(t("auth.emailExists"))
      } else {
        setError(err.message || t("auth.signUpError"))
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={theme === "dark" ? "text-white" : "text-gray-800"}>{t("auth.name")}</FormLabel>
              <FormControl>
                <Input
                  placeholder={t("auth.namePlaceholder")}
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
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className={theme === "dark" ? "text-white" : "text-gray-800"}>
                {t("auth.confirmPassword")}
              </FormLabel>
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
        <Button
          type="submit"
          className={`w-full ${
            theme === "dark" ? "bg-white text-black hover:bg-gray-200" : "bg-gray-800 text-white hover:bg-gray-700"
          } button-hover-effect button-active-effect`}
          disabled={isLoading}
        >
          {isLoading ? t("auth.signingUp") : t("auth.signUp")}
        </Button>
      </form>
    </Form>
  )
}
