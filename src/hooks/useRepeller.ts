import { useRef } from "react"
import { vehicleType } from "../utils/vehicle"
import { repel, repellerType } from "../utils/repeller"

const useRepeller = (data: repellerType) => {
  const ref = useRef<repellerType>(data)

  const setPosition = (x: number, y: number, z: number) =>
    ref.current.position.set(x, y, z)

  const setRadius = (r: number) => (ref.current.radius = r)

  const setStrength = (s: number) => (ref.current.strength = s)

  return [
    ref,
    {
      repel: (vehicle: vehicleType) => repel(vehicle, ref.current),
      setPosition,
      setRadius,
      setStrength,
    },
  ]
}

export { useRepeller }
