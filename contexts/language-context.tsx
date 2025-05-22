"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// Define available languages
export type Language = "en" | "ru" | "be"

// Define the context type
type LanguageContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

// Create the context with default values
const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: (key) => key,
})

// Translation data for all languages
const translations: Record<Language, Record<string, string>> = {
  en: {
    // Header
    "app.title": "3D Model Generator",
    "app.powered": "Powered by Hyper3D Rodin",
    "app.website": "Website",
    "app.docs": "API Docs",

    // Form
    "form.placeholder": "Generate 3D model...",
    "form.dropImages": "Drop images here",
    "form.maxImages": "You can upload a maximum of 5 images",

    // Options
    "options.title": "Options",
    "options.basic": "Basic Settings",
    "options.advanced": "Advanced",
    "options.quality": "Quality",
    "options.quality.high": "High (50k)",
    "options.quality.medium": "Medium (18k)",
    "options.quality.low": "Low (8k)",
    "options.quality.extraLow": "Extra Low (4k)",
    "options.format": "Format",
    "options.useHyper": "Use Hyper",
    "options.useHyper.desc": "Better details",
    "options.taPose": "T/A Pose",
    "options.taPose.desc": "For humans",
    "options.conditionMode": "Condition Mode",
    "options.conditionMode.concat": "Concat (Single object, multiple views)",
    "options.conditionMode.fuse": "Fuse (Multiple objects)",
    "options.material": "Material",
    "options.tier": "Generation Tier",
    "options.tier.regular": "Regular (Quality)",
    "options.tier.sketch": "Sketch (Speed)",
    "options.apply": "Apply Settings",

    // Controls
    "controls.back": "Back",
    "controls.download": "Download",

    // Errors
    "error.status": "Status check failed",
    "error.download": "Failed to download model",
    "error.generation": "Generation task failed",
    "error.noGlb": "No GLB file found in the results",
    "error.noFiles": "No files available for download",

    // Language
    "language.title": "Language",
    "language.en": "English",
    "language.ru": "Русский",
    "language.be": "Беларуская",

    // Theme
    "theme.title": "Theme",
    "theme.switchToLight": "Switch to light theme",
    "theme.switchToDark": "Switch to dark theme",
    "theme.light": "Light",
    "theme.dark": "Dark",

    // Auth
    "auth.signIn": "Sign In",
    "auth.signUp": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Sign Up",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.confirmPassword": "Confirm Password",
    "auth.name": "Name",
    "auth.namePlaceholder": "John Doe",
    "auth.invalidCredentials": "Invalid email or password",
    "auth.signUpError": "Error creating account",
    "auth.signingIn": "Signing in...",
    "auth.signingUp": "Signing up...",
    "auth.signOut": "Sign Out",
    "auth.forgotPassword": "Forgot password?",
    "auth.resetPassword": "Reset Password",
    "auth.sendResetCode": "Send Code",
    "auth.sending": "Sending...",
    "auth.resetCodeSent": "Reset code sent to your email",
    "auth.resetCodeInstructions": "Enter the 6-digit code sent to your email",
    "auth.verificationCode": "Verification Code",
    "auth.verifyCode": "Verify Code",
    "auth.verifying": "Verifying...",
    "auth.codeVerified": "Code verified successfully",
    "auth.invalidCode": "Invalid or expired code",
    "auth.verificationError": "Verification failed",
    "auth.newPassword": "New Password",
    "auth.resetting": "Resetting...",
    "auth.passwordReset": "Password reset successfully",
    "auth.resetError": "Failed to reset password",
    "auth.userNotFound": "User not found",
    "auth.back": "Back",
    "auth.cancel": "Cancel",
    "auth.verifyYourEmail": "Verify Your Email",
    "auth.verifyEmail": "Verify Email",
    "auth.verificationInstructions": "Enter the 6-digit code sent to your email to verify your account",
    "auth.resendCode": "Resend Code",
    "auth.resending": "Resending...",
    "auth.verificationCodeResent": "Verification code resent to your email",
    "auth.resendError": "Failed to resend verification code",
    "auth.emailVerified": "Email verified successfully",
    "auth.invalidVerificationCode": "Invalid verification code",
    "auth.skipVerification": "Skip for now",
    "auth.resetLinkSent": "Password reset link has been sent to your email",
    "auth.resetInstructions": "Enter your email address and we'll send you a link to reset your password",
    "auth.sendResetLink": "Send Reset Link",
    "auth.resetError": "Failed to send reset link",
    "auth.signInError": "Failed to sign in",
    "auth.signUpSuccess": "Account created successfully! You can now sign in.",
    "auth.emailExists": "Email is already registered",
    "auth.emailNotConfirmed": "Email not confirmed. Please check your inbox and confirm your email.",
    "auth.resendConfirmationEmail": "Resend confirmation email",
    "auth.confirmationEmailResent": "Confirmation email has been resent. Please check your inbox.",
    "auth.signUpSuccessConfirmEmail":
      "Account created successfully! Please check your email to confirm your registration.",

    // User
    "user.account": "Account",
    "user.saveModel": "Save Model",
    "user.myModels": "My Models",

    // Save Model
    "saveModel.title": "Save Model",
    "saveModel.name": "Model Name",
    "saveModel.namePlaceholder": "My Awesome Model",
    "saveModel.description": "Description",
    "saveModel.descriptionPlaceholder": "A brief description of your model",
    "saveModel.save": "Save",
    "saveModel.saving": "Saving...",
    "saveModel.cancel": "Cancel",
    "saveModel.error": "Failed to save model",
    "saveModel.noModel": "No model to save",
    "saveModel.nameRequired": "Name is required",

    // Profile
    "profile.title": "Profile",
    "profile.name": "Name",
    "profile.namePlaceholder": "Your name",
    "profile.email": "Email",
    "profile.emailReadOnly": "Email cannot be changed",
    "profile.save": "Save",
    "profile.saving": "Saving...",
    "profile.cancel": "Cancel",
    "profile.updateSuccess": "Profile updated successfully",
    "profile.updateError": "Failed to update profile",
    "profile.nameRequired": "Name is required",

    // Avatar
    "avatar.uploadSuccess": "Avatar uploaded successfully",
    "avatar.uploadError": "Failed to upload avatar",
    "avatar.invalidFileType": "Invalid file type. Please upload an image.",
    "avatar.fileTooLarge": "File is too large. Maximum size is 2MB.",

    // Footer
    "footer.developedBy": "Developed by Nazar Ankudinov © 2025",
  },
  ru: {
    // Header
    "app.title": "Генератор 3D Моделей",
    "app.powered": "Работает на Hyper3D Rodin",
    "app.website": "Веб-сайт",
    "app.docs": "API Документация",

    // Form
    "form.placeholder": "Сгенерировать 3D модель...",
    "form.dropImages": "Перетащите изображения сюда",
    "form.maxImages": "Вы можете загрузить максимум 5 изображений",

    // Options
    "options.title": "Настройки",
    "options.basic": "Основные настройки",
    "options.advanced": "Расширенные",
    "options.quality": "Качество",
    "options.quality.high": "Высокое (50k)",
    "options.quality.medium": "Среднее (18k)",
    "options.quality.low": "Низкое (8k)",
    "options.quality.extraLow": "Очень низкое (4k)",
    "options.format": "Формат",
    "options.useHyper": "Использовать Hyper",
    "options.useHyper.desc": "Лучшие детали",
    "options.taPose": "T/A Поза",
    "options.taPose.desc": "Для людей",
    "options.conditionMode": "Режим условий",
    "options.conditionMode.concat": "Объединение (Один объект, несколько ракурсов)",
    "options.conditionMode.fuse": "Слияние (Несколько объектов)",
    "options.material": "Материал",
    "options.tier": "Уровень генерации",
    "options.tier.regular": "Обычный (Качество)",
    "options.tier.sketch": "Эскиз (Скорость)",
    "options.apply": "Применить настройки",

    // Controls
    "controls.back": "Назад",
    "controls.download": "Скачать",

    // Errors
    "error.status": "Ошибка проверки статуса",
    "error.download": "Не удалось скачать модель",
    "error.generation": "Задача генерации не выполнена",
    "error.noGlb": "GLB файл не найден в результатах",
    "error.noFiles": "Нет доступных файлов для скачивания",

    // Language
    "language.title": "Язык",
    "language.en": "English",
    "language.ru": "Русский",
    "language.be": "Беларуская",

    // Theme
    "theme.title": "Тема",
    "theme.switchToLight": "Переключить на светлую тему",
    "theme.switchToDark": "Переключить на темную тему",
    "theme.light": "Светлая",
    "theme.dark": "Темная",

    // Auth
    "auth.signIn": "Войти",
    "auth.signUp": "Регистрация",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.confirmPassword": "Подтвердите пароль",
    "auth.name": "Имя",
    "auth.namePlaceholder": "Иван Иванов",
    "auth.invalidCredentials": "Неверный email или пароль",
    "auth.signUpError": "Ошибка при создании аккаунта",
    "auth.signingIn": "Вход...",
    "auth.signingUp": "Регистрация...",
    "auth.signOut": "Выйти",
    "auth.forgotPassword": "Забыли пароль?",
    "auth.resetPassword": "Сбросить пароль",
    "auth.sendResetCode": "Отправить код",
    "auth.sending": "Отправка...",
    "auth.resetCodeSent": "Код сброса отправлен на ваш email",
    "auth.resetCodeInstructions": "Введите 6-значный код, отправленный на ваш email",
    "auth.verificationCode": "Код подтверждения",
    "auth.verifyCode": "Проверить код",
    "auth.verifying": "Проверка...",
    "auth.codeVerified": "Код успешно проверен",
    "auth.invalidCode": "Неверный или просроченный код",
    "auth.verificationError": "Ошибка проверки",
    "auth.newPassword": "Новый пароль",
    "auth.resetting": "Сброс...",
    "auth.passwordReset": "Пароль успешно сброшен",
    "auth.resetError": "Не удалось сбросить пароль",
    "auth.userNotFound": "Пользователь не найден",
    "auth.back": "Назад",
    "auth.cancel": "Отмена",
    "auth.verifyYourEmail": "Подтвердите ваш Email",
    "auth.verifyEmail": "Подтвердить Email",
    "auth.verificationInstructions": "Введите 6-значный код, отправленный на ваш email для подтверждения аккаунта",
    "auth.resendCode": "Отправить код повторно",
    "auth.resending": "Отправка...",
    "auth.verificationCodeResent": "Код подтверждения повторно отправлен на ваш email",
    "auth.resendError": "Не удалось повторно отправить код подтверждения",
    "auth.emailVerified": "Email успешно подтвержден",
    "auth.invalidVerificationCode": "Неверный код подтверждения",
    "auth.skipVerification": "Пропустить",
    "auth.resetLinkSent": "Ссылка для сброса пароля была отправлена на ваш email",
    "auth.resetInstructions": "Введите ваш email, и мы отправим вам ссылку для сброса пароля",
    "auth.sendResetLink": "Отправить ссылку для сброса",
    "auth.resetError": "Не удалось отправить ссылку для сброса",
    "auth.signInError": "Не удалось войти",
    "auth.signUpSuccess": "Аккаунт успешно создан! Теперь вы можете войти.",
    "auth.emailExists": "Email уже зарегистрирован",
    "auth.emailNotConfirmed": "Email не подтвержден. Пожалуйста, проверьте вашу почту и подтвердите email.",
    "auth.resendConfirmationEmail": "Отправить письмо с подтверждением повторно",
    "auth.confirmationEmailResent": "Письмо с подтверждением отправлено повторно. Пожалуйста, проверьте вашу почту.",
    "auth.signUpSuccessConfirmEmail":
      "Аккаунт успешно создан! Пожалуйста, проверьте вашу почту для подтверждения регистрации.",

    // User
    "user.account": "Аккаунт",
    "user.saveModel": "Сохранить модель",
    "user.myModels": "Мои модели",

    // Save Model
    "saveModel.title": "Сохранить модель",
    "saveModel.name": "Название модели",
    "saveModel.namePlaceholder": "Моя крутая модель",
    "saveModel.description": "Описание",
    "saveModel.descriptionPlaceholder": "Краткое описание вашей модели",
    "saveModel.save": "Сохранить",
    "saveModel.saving": "Сохранение...",
    "saveModel.cancel": "Отмена",
    "saveModel.error": "Не удалось сохранить модель",
    "saveModel.noModel": "Нет модели для сохранения",
    "saveModel.nameRequired": "Необходимо указать название",

    // Profile
    "profile.title": "Профиль",
    "profile.name": "Имя",
    "profile.namePlaceholder": "Ваше имя",
    "profile.email": "Email",
    "profile.emailReadOnly": "Email нельзя изменить",
    "profile.save": "Сохранить",
    "profile.saving": "Сохранение...",
    "profile.cancel": "Отмена",
    "profile.updateSuccess": "Профиль успешно обновлен",
    "profile.updateError": "Не удалось обновить профиль",
    "profile.nameRequired": "Имя обязательно",

    // Avatar
    "avatar.uploadSuccess": "Аватар успешно загружен",
    "avatar.uploadError": "Не удалось загрузить аватар",
    "avatar.invalidFileType": "Неверный тип файла. Пожалуйста, загрузите изображение.",
    "avatar.fileTooLarge": "Файл слишком большой. Максимальный размер 2МБ.",

    // Footer
    "footer.developedBy": "Разработано Назаром Анкудиновым © 2025",
  },
  be: {
    // Header
    "app.title": "Генератар 3D-мадэляў",
    "app.powered": "Працуе на Hyper3D Rodin",
    "app.website": "Вэб-сайт",
    "app.docs": "API Дакументацыя",

    // Form
    "form.placeholder": "Згенераваць 3D-мадэль...",
    "form.dropImages": "Перацягніце выявы сюды",
    "form.maxImages": "Вы можаце загрузіць максімум 5 выяў",

    // Options
    "options.title": "Налады",
    "options.basic": "Асноўныя налады",
    "options.advanced": "Пашыраныя",
    "options.quality": "Якасць",
    "options.quality.high": "Высокая (50к)",
    "options.quality.medium": "Сярэдняя (18к)",
    "options.quality.low": "Нізкая (8к)",
    "options.quality.extraLow": "Вельмі нізкая (4к)",
    "options.format": "Фармат",
    "options.useHyper": "Выкарыстоўваць Hyper",
    "options.useHyper.desc": "Лепшыя дэталі",
    "options.taPose": "T/A Паза",
    "options.taPose.desc": "Для людзей",
    "options.conditionMode": "Рэжым умоў",
    "options.conditionMode.concat": "Аб'яднанне (Адзін аб'ект, некалькі ракурсаў)",
    "options.conditionMode.fuse": "Зліццё (Некалькі аб'ектаў)",
    "options.material": "Матэрыял",
    "options.tier": "Узровень генерацыі",
    "options.tier.regular": "Звычайны (Якасць)",
    "options.tier.sketch": "Эскіз (Хуткасць)",
    "options.apply": "Ужыць налады",

    // Controls
    "controls.back": "Назад",
    "controls.download": "Спампаваць",

    // Errors
    "error.status": "Памылка праверкі статусу",
    "error.download": "Не атрымалася спампаваць мадэль",
    "error.generation": "Задача генерацыі не выканана",
    "error.noGlb": "GLB файл не знойдзены ў выніках",
    "error.noFiles": "Няма даступных файлаў для спампавання",

    // Language
    "language.title": "Мова",
    "language.en": "English",
    "language.ru": "Русский",
    "language.be": "Беларуская",

    // Theme
    "theme.title": "Тэма",
    "theme.switchToLight": "Пераключыць на светлую тэму",
    "theme.switchToDark": "Пераключыць на цёмную тэму",
    "theme.light": "Светлая",
    "theme.dark": "Цёмная",

    // Auth
    "auth.signIn": "Увайсці",
    "auth.signUp": "Рэгістрацыя",
    "auth.email": "Email",
    "auth.password": "Пароль",
    "auth.confirmPassword": "Пацвердзіце пароль",
    "auth.name": "Імя",
    "auth.namePlaceholder": "Іван Іваноў",
    "auth.invalidCredentials": "Няправільны email або пароль",
    "auth.signUpError": "Памылка пры стварэнні акаўнта",
    "auth.signingIn": "Уваход...",
    "auth.signingUp": "Рэгістрацыя...",
    "auth.signOut": "Выйсці",
    "auth.forgotPassword": "Забылі пароль?",
    "auth.resetPassword": "Скінуць пароль",
    "auth.sendResetCode": "Адправіць код",
    "auth.sending": "Адпраўка...",
    "auth.resetCodeSent": "Код скіду адпраўлены на ваш email",
    "auth.resetCodeInstructions": "Увядзіце 6-значны код, адпраўлены на ваш email",
    "auth.verificationCode": "Код пацверджання",
    "auth.verifyCode": "Праверыць код",
    "auth.verifying": "Праверка...",
    "auth.codeVerified": "Код паспяхова праверан",
    "auth.invalidCode": "Няправільны або пратэрмінаваны код",
    "auth.verificationError": "Памылка праверкі",
    "auth.newPassword": "Новы пароль",
    "auth.resetting": "Скід...",
    "auth.passwordReset": "Пароль паспяхова скінуты",
    "auth.resetError": "Не атрымалася скінуць пароль",
    "auth.userNotFound": "Карыстальнік не знойдзены",
    "auth.back": "Назад",
    "auth.cancel": "Адмена",
    "auth.verifyYourEmail": "Пацвердзіце ваш Email",
    "auth.verifyEmail": "Пацвердзіць Email",
    "auth.verificationInstructions": "Увядзіце 6-значны код, адпраўлены на ваш email для пацверджання акаўнта",
    "auth.resendCode": "Адправіць код паўторна",
    "auth.resending": "Адпраўка...",
    "auth.verificationCodeResent": "Код пацверджання паўторна адпраўлены на ваш email",
    "auth.resendError": "Не атрымалася паўторна адправіць код пацверджання",
    "auth.emailVerified": "Email паспяхова пацверджаны",
    "auth.invalidVerificationCode": "Няправільны код пацверджання",
    "auth.skipVerification": "Прапусціць",
    "auth.resetLinkSent": "Спасылка для скіду пароля была адпраўлена на ваш email",
    "auth.resetInstructions": "Увядзіце ваш email, і мы адправім вам спасылку для скіду пароля",
    "auth.sendResetLink": "Адправіць спасылку для скіду",
    "auth.resetError": "Не атрымалася адправіць спасылку для скіду",
    "auth.signInError": "Не атрымалася ўвайсці",
    "auth.signUpSuccess": "Акаўнт паспяхова створаны! Цяпер вы можаце ўвайсці.",
    "auth.emailExists": "Email ужо зарэгістраваны",
    "auth.emailNotConfirmed": "Email не пацверджаны. Калі ласка, праверце вашу пошту і пацвердзіце email.",
    "auth.resendConfirmationEmail": "Адправіць ліст з пацверджаннем паўторна",
    "auth.confirmationEmailResent": "Ліст з пацверджаннем адпраўлены паўторна. Калі ласка, праверце вашу пошту.",
    "auth.signUpSuccessConfirmEmail":
      "Акаўнт паспяхова створаны! Калі ласка, праверце вашу пошту для пацверджання рэгістрацыі.",

    // User
    "user.account": "Акаўнт",
    "user.saveModel": "Захаваць мадэль",
    "user.myModels": "Мае мадэлі",

    // Save Model
    "saveModel.title": "Захаваць мадэль",
    "saveModel.name": "Назва мадэлі",
    "saveModel.namePlaceholder": "Мая крутая мадэль",
    "saveModel.description": "Апісанне",
    "saveModel.descriptionPlaceholder": "Кароткае апісанне вашай мадэлі",
    "saveModel.save": "Захаваць",
    "saveModel.saving": "Захаванне...",
    "saveModel.cancel": "Адмена",
    "saveModel.error": "Не атрымалася захаваць мадэль",
    "saveModel.noModel": "Няма мадэлі для захавання",
    "saveModel.nameRequired": "Неабходна ўказаць назву",

    // Profile
    "profile.title": "Профіль",
    "profile.name": "Імя",
    "profile.namePlaceholder": "Ваша імя",
    "profile.email": "Email",
    "profile.emailReadOnly": "Email нельга змяніць",
    "profile.save": "Захаваць",
    "profile.saving": "Захаванне...",
    "profile.cancel": "Адмена",
    "profile.updateSuccess": "Профіль паспяхова абноўлены",
    "profile.updateError": "Не атрымалася абнавіць профіль",
    "profile.nameRequired": "Імя абавязкова",

    // Avatar
    "avatar.uploadSuccess": "Аватар паспяхова загружаны",
    "avatar.uploadError": "Не атрымалася загрузіць аватар",
    "avatar.invalidFileType": "Няправільны тып файла. Калі ласка, загрузіце выяву.",
    "avatar.fileTooLarge": "Файл занадта вялікі. Максімальны памер 2МБ.",

    // Footer
    "footer.developedBy": "Распрацавана Назарам Анкудзінавым © 2025",
  },
}

// Provider component
export function LanguageProvider({ children }: { children: React.ReactNode }) {
  // Try to get the language from localStorage, default to 'en'
  const [language, setLanguageState] = useState<Language>("en")

  // Load language preference from localStorage on client side
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && ["en", "ru", "be"].includes(savedLanguage)) {
      setLanguageState(savedLanguage)
    }
  }, [])

  // Set language and save to localStorage
  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    localStorage.setItem("language", lang)
  }

  // Translation function
  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

// Custom hook to use the language context
export function useLanguage() {
  return useContext(LanguageContext)
}
