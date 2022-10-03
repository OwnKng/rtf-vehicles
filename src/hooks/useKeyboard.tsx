import { useEffect, useState } from "react"

const r = 1

const calculateRotation = (x: number, y: number) => {
  const cx = Math.cos(x) * r
  const cy = Math.sin(y) * r

  return [cx, cy]
}

const useKeyboard = () => {
  const [rotation, setRotation] = useState<any>({
    x: 0,
    y: 0,
  })

  const keys = {
    MetaLeft: "left",
    MetaRight: "right",
  }

  useEffect(() => {
    const handleKeyDown = (e: any) => {
      if (e.code === "ArrowLeft") {
        setRotation(({ x, ...cur }) => ({ ...cur, x: x + 0.2 }))
      }

      if (e.code === "ArrowRight") {
        setRotation(({ x, ...cur }) => ({ ...cur, x: x - 0.2 }))
      }

      if (e.code === "ArrowUp") {
        setRotation(({ y, ...cur }) => ({ ...cur, y: y + 0.5 }))
      }

      if (e.code === "ArrowDown") {
        setRotation(({ y, ...cur }) => ({ ...cur, y: y - 0.5 }))
      }
    }

    document.addEventListener("keydown", handleKeyDown)
  }, [])

  return calculateRotation(rotation.x, rotation.y)
}

export { useKeyboard }
