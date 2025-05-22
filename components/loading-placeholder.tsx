"use client"

import { useTheme } from "@/contexts/theme-context"

export default function LoadingPlaceholder() {
  const { theme } = useTheme()

  return (
    <>
      <mesh>
        <boxGeometry args={[1.5, 1.5, 1.5]} />
        <meshStandardMaterial
          color={theme === "dark" ? "#cccccc" : "#333333"}
          wireframe={true}
          transparent
          opacity={0.5}
        />
      </mesh>

      <mesh>
        <sphereGeometry args={[0.75, 32, 32]} />
        <meshStandardMaterial
          color={theme === "dark" ? "#aaaaaa" : "#555555"}
          wireframe={true}
          transparent
          opacity={0.5}
        />
      </mesh>
    </>
  )
}
