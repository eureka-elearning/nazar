"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import type { User } from "@supabase/supabase-js"

// Типы для пользователя и модели
export interface Profile {
  id: string
  name: string
  email: string
  avatar_url: string | null
}

export interface Model {
  id: string
  user_id: string
  name: string
  description: string | null
  model_url: string
  thumbnail_url: string | null
  format: string
  created_at: string
}

// Тип контекста аутентификации
interface AuthContextType {
  user: User | null
  profile: Profile | null
  isLoading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  saveModel: (model: Omit<Model, "id" | "user_id" | "created_at">) => Promise<Model>
  getUserModels: () => Promise<Model[]>
  deleteModel: (modelId: string) => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updatePassword: (password: string) => Promise<void>
  updateProfile: (profile: Partial<Profile>) => Promise<void>
  resendConfirmationEmail: (email: string) => Promise<void>
}

// Создание контекста с начальными значениями
const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  isLoading: true,
  signIn: async () => {},
  signUp: async () => {},
  signOut: async () => {},
  saveModel: async () => ({}) as Model,
  getUserModels: async () => [],
  deleteModel: async () => {},
  resetPassword: async () => {},
  updatePassword: async () => {},
  updateProfile: async () => {},
  resendConfirmationEmail: async () => {},
})

// Хук для использования контекста аутентификации
export const useAuth = () => useContext(AuthContext)

// Провайдер контекста аутентификации
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Загрузка пользователя при инициализации
  useEffect(() => {
    // Получаем текущую сессию
    const getSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Error getting session:", error)
          setIsLoading(false)
          return
        }

        if (data.session) {
          setUser(data.session.user)
          await fetchProfile(data.session.user.id)
        }
      } catch (error) {
        console.error("Error in getSession:", error)
      } finally {
        setIsLoading(false)
      }
    }

    getSession()

    // Подписываемся на изменения аутентификации
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session && session.user) {
        setUser(session.user)
        await fetchProfile(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Получение профиля пользователя
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      if (data) {
        setProfile(data as Profile)
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error)
    }
  }

  // Обновим функцию signIn для обработки ошибки неподтвержденного email
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error signing in:", error)
      throw error
    }
  }

  // Добавим функцию для повторной отправки письма с подтверждением
  const resendConfirmationEmail = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: email,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error resending confirmation email:", error)
      throw error
    }
  }

  // Функция для регистрации
  const signUp = async (name: string, email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      })

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Error signing up:", error)
      throw error
    }
  }

  // Функция для выхода из системы
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error signing out:", error)
      throw error
    }
  }

  // Функция для сохранения модели
  const saveModel = async (model: Omit<Model, "id" | "user_id" | "created_at">) => {
    if (!user) throw new Error("User not authenticated")

    try {
      console.log("Saving model:", model)

      // Проверяем, что URL модели доступен
      if (!model.model_url) {
        throw new Error("Model URL is required")
      }

      // Создаем запись в базе данных
      const { data, error } = await supabase
        .from("models")
        .insert({
          user_id: user.id,
          name: model.name,
          description: model.description || "",
          model_url: model.model_url,
          thumbnail_url: model.thumbnail_url || null,
          format: model.format || "glb",
        })
        .select()
        .single()

      if (error) {
        console.error("Supabase error:", error)
        throw error
      }

      console.log("Model saved successfully:", data)
      return data as Model
    } catch (error) {
      console.error("Error saving model:", error)
      throw error
    }
  }

  // Функция для получения моделей пользователя
  const getUserModels = async (): Promise<Model[]> => {
    if (!user) return []

    try {
      const { data, error } = await supabase
        .from("models")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })

      if (error) {
        throw error
      }

      return data as Model[]
    } catch (error) {
      console.error("Error getting user models:", error)
      throw error
    }
  }

  // Функция для удаления модели
  const deleteModel = async (modelId: string): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const { error } = await supabase.from("models").delete().eq("id", modelId).eq("user_id", user.id)

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error deleting model:", error)
      throw error
    }
  }

  // Функция для запроса сброса пароля
  const resetPassword = async (email: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error resetting password:", error)
      throw error
    }
  }

  // Функция для обновления пароля
  const updatePassword = async (password: string): Promise<void> => {
    try {
      const { error } = await supabase.auth.updateUser({
        password,
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Error updating password:", error)
      throw error
    }
  }

  // Функция для обновления профиля
  const updateProfile = async (profileData: Partial<Profile>): Promise<void> => {
    if (!user) throw new Error("User not authenticated")

    try {
      const { error } = await supabase.from("profiles").update(profileData).eq("id", user.id)

      if (error) {
        throw error
      }

      // Обновляем локальный профиль
      if (profile) {
        setProfile({ ...profile, ...profileData })
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      throw error
    }
  }

  // Обновим объект value, чтобы включить новую функцию
  const value = {
    user,
    profile,
    isLoading,
    signIn,
    signUp,
    signOut,
    saveModel,
    getUserModels,
    deleteModel,
    resetPassword,
    updatePassword,
    updateProfile,
    resendConfirmationEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
