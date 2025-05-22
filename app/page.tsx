import { Suspense } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Rodin from "@/components/rodin"
import LessonPlanner from "@/components/lesson-planner"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  return (
    <main className="h-[100dvh] w-screen overflow-hidden dark:bg-black dark:bg-radial-gradient-dark bg-white bg-radial-gradient-light bg-transition">
      <Tabs defaultValue="3d" className="absolute top-6 left-1/2 -translate-x-1/2 z-10">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="3d" className="tracking-normal">AI-Генератор 3D-моделей</TabsTrigger>
          <TabsTrigger value="lessons" className="tracking-normal">AI-Генератор планов уроков</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
        <div className="h-full" data-tab-content="3d">
          <Rodin />
        </div>
        <div className="h-full" data-tab-content="lessons">
          <LessonPlanner />
        </div>
      </Suspense>
    </main>
  )
}