"use client"

import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import type * as THREE from "three"
import { useTheme } from "@/contexts/theme-context"

export default function LoadingSpinner() {
  const groupRef = useRef<THREE.Group>(null)
  const { theme } = useTheme()

  useFrame(({ clock }) => {
    if (groupRef.current) {
      // Apply smooth, continuous rotation
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.3) * 0.5 + clock.getElapsedTime() * 0.3
      groupRef.current.rotation.x = Math.sin(clock.getElapsedTime() * 0.2) * 0.2
    }
  })

  return (
    <group ref={groupRef}>
      <mesh>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial color={theme === "dark" ? "#ffffff" : "#333333"} wireframe={true} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1, 0.1, 16, 32]} />
        <meshStandardMaterial color={theme === "dark" ? "#ffffff" : "#333333"} wireframe={true} />
      </mesh>
    </group>
  )
}
