import { useRef } from "react"
import * as THREE from "three"
import {
  applyForce,
  updatePosition,
  seek,
  arrive,
  wander,
  vehicleType,
} from "../utils/vehicle"

const useVehicle = (particle: vehicleType) => {
  const vehicleRef = useRef(particle)
}

export { useVehicle }
