-- Создаем бакет для хранения аватаров пользователей, если он не существует
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Проверяем существование бакета avatars
DO $$
BEGIN
    -- Создаем бакет, если он не существует
    IF NOT EXISTS (
        SELECT 1 FROM storage.buckets WHERE id = 'avatars'
    ) THEN
        INSERT INTO storage.buckets (id, name, public)
        VALUES ('avatars', 'avatars', true);
        
        -- Устанавливаем политики доступа для бакета аватаров
        -- Политика для чтения аватаров (публичная)
        EXECUTE 'CREATE POLICY "Avatars are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = ''avatars'')';
        
        -- Политика для загрузки аватаров (только авторизованные пользователи)
        EXECUTE 'CREATE POLICY "Users can upload avatars" ON storage.objects FOR INSERT WITH CHECK (bucket_id = ''avatars'' AND auth.uid() IS NOT NULL)';
        
        -- Политика для обновления аватаров (только владелец)
        EXECUTE 'CREATE POLICY "Users can update their own avatars" ON storage.objects FOR UPDATE USING (bucket_id = ''avatars'' AND auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)';
        
        -- Политика для удаления аватаров (только владелец)
        EXECUTE 'CREATE POLICY "Users can delete their own avatars" ON storage.objects FOR DELETE USING (bucket_id = ''avatars'' AND auth.uid() IS NOT NULL AND (storage.foldername(name))[1] = auth.uid()::text)';
    END IF;
END $$;
