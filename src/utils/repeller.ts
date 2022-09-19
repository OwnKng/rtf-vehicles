import { vehicleType } from "./vehicle"
import * as THREE from "three"

export type repellerType = {
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

  return direction
    .normalize()
    .multiplyScalar(force)
    .clampLength(-vehicle.maxSpeed, vehicle.maxSpeed)
}

export { repel }
