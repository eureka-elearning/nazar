import Rodin from "@/components/rodin"
import { Suspense } from "react"

export default function Home() {
  return (
    <main className="h-[100dvh] w-screen overflow-hidden dark:bg-black dark:bg-radial-gradient-dark bg-white bg-radial-gradient-light bg-transition">
      <Suspense fallback={<div className="h-full w-full flex items-center justify-center">Loading...</div>}>
        <Rodin />
      </Suspense>
    </main>
  )
}
