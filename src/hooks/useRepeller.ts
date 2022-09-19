import { useRef } from "react"
import { map } from "../utils"
import { vehicleType } from "../utils/vehicle"
import * as THREE from "three"

type repellerType = {
  strength: number
  position: THREE.Vector3
  radius: number
}

const repel = (vehicle: vehicleType, repeller: repellerType) => {
  const direction = repeller.position.clone().sub(vehicle.position)
  let distance = direction.length()

  if (distance > repeller.radius) return new THREE.Vector3(0, 0, 0)

  const strength = (repeller.radius - distance) / repeller.radius
  const force = -1 * repeller.strength * strength

  direction.normalize().multiplyScalar(force)
  direction.clampLength(-vehicle.maxSpeed, vehicle.maxSpeed)

  return direction

  //   const strength =
  //     ((repeller.radius - distance) / repeller.radius) * repeller.strength

  //   direction.multiplyScalar(-1 * strength)

  //   return direction.sub(vehicle.velocity)

  //   distance = Math.max(Math.sqrt(distance), distance)
  //   distance = Math.min(distance, 100)

  //   let force = repeller.strength / distance ** 2
  //   force *= -1
  //   console.log(distance, force)

  //   direction.normalize().multiplyScalar(force)

  //   return direction

  //   let steer = new THREE.Vector3(0, 0, 0)

  //   return steer
}

const useRepeller = (data: repellerType) => {
  const ref = useRef(data)

  return [{ repel: (vehicle: vehicleType) => repel(vehicle, ref.current) }]
}

export { useRepeller }
