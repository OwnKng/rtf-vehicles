import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

const r = 10

const useKeyboard = () => {
  const heading = useRef(new THREE.Vector3(0, 0, 0))
  const latitude = useRef<number>(0)
  const longitude = useRef<number>(0)

  const projectSphere = () => {
    const x = r * Math.sin(latitude.current) * Math.cos(longitude.current)
    const y = r * Math.sin(latitude.current) * Math.sin(longitude.current)
    const z = r * Math.cos(latitude.current)

    return new THREE.Vector3(x, y, z)
  }

  const handleKeyDown = (e: any) => {
    if (e.code === "ArrowLeft") latitude.current = 1
    if (e.code === "ArrowRight") latitude.current = 1
  }

  const handleKeyRelease = (e: any) => {
    if (e.code === "ArrowLeft") latitude.current = 0
    if (e.code === "ArrowRight") latitude.current = 0
  }

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("keyup", handleKeyRelease)
  }, [])

  return () => {
    heading.current.add(projectSphere())

    return heading
  }
}

export { useKeyboard }
