"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useTheme } from "@/contexts/theme-context"

const formSchema = z.object({
  topic: z.string().min(1, "Тема урока обязательна"),
  audience: z.string().min(1, "Выберите целевую аудиторию"),
  objectives: z.string().min(1, "Укажите цели и задачи урока"),
  duration: z.string().min(1, "Укажите продолжительность урока"),
  keyTerms: z.string(),
  use3DModels: z.boolean().default(false),
})

export default function LessonPlanner() {
  const { theme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      topic: "",
      audience: "",
      objectives: "",
      duration: "",
      keyTerms: "",
      use3DModels: false,
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    try {
      // Здесь будет логика отправки запроса к GPT API
      console.log(values)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full w-full flex items-center justify-center p-4">
      <div className={`w-full max-w-2xl mx-auto mt-20 p-6 rounded-lg ${
        theme === "dark" 
          ? "bg-black/60 border border-[rgba(255,255,255,0.12)]" 
          : "bg-white/60 border border-[rgba(0,0,0,0.12)]"
      }`}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="topic"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Тема урока</FormLabel>
                  <FormControl>
                    <Input placeholder="Введите тему урока" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="audience"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Целевая аудитория</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите класс/уровень" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="elementary">Начальная школа (1-4 класс)</SelectItem>
                      <SelectItem value="middle">Средняя школа (5-9 класс)</SelectItem>
                      <SelectItem value="high">Старшая школа (10-11 класс)</SelectItem>
                      <SelectItem value="university">Университет</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="objectives"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Цели и задачи урока</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Опишите основные цели и задачи урока"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Продолжительность урока</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Выберите длительность" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="30">30 минут</SelectItem>
                      <SelectItem value="45">45 минут</SelectItem>
                      <SelectItem value="60">60 минут</SelectItem>
                      <SelectItem value="90">90 минут</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="keyTerms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ключевые термины и концепции</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Введите ключевые термины и концепции, разделяя их запятыми"
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="use3DModels"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Использование 3D-моделей</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Предложить использование 3D-моделей в плане урока
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Генерация..." : "Сгенерировать план урока"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}