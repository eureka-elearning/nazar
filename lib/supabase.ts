import { createClient } from "@supabase/supabase-js"
import type { Database } from "@/types/supabase"

// Создаем клиент для использования на стороне клиента
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Создаем и экспортируем клиент Supabase
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Создаем клиент для использования на стороне сервера
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL!
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient<Database>(supabaseUrl, supabaseServiceKey)
}
