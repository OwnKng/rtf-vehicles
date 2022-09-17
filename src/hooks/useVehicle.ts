import { useFrame } from "@react-three/fiber"
import { Ref, useLayoutEffect, useRef } from "react"
import * as THREE from "three"
import {
  applyForce,
  updatePosition,
  seek,
  arrive,
  wander,
  avoidEdges,
} from "../utils/vehicle"

type vehicleType = {
  position: THREE.Vector3
  acceleration: THREE.Vector3
  velocity: THREE.Vector3
  maxSpeed: number
  maxForce: number
  latitude?: number
  longitude?: number
}

const useVehicle = ({
  position,
  acceleration,
  velocity,
  maxSpeed,
  maxForce,
  latitude = Math.PI / 2,
  longitude = Math.PI / 2,
}: vehicleType): [Ref<THREE.Mesh>, any] => {
  const vehicleRef = useRef({
    position,
    acceleration,
    velocity,
    maxSpeed,
    maxForce,
    latitude,
    longitude,
  })
  const ref = useRef<THREE.Mesh>(null!)

  useLayoutEffect(() => {
    ref.current.geometry.rotateX(Math.PI / 2)
  }, [])

  const updateVehiclePosition = () => {
    const { position } = updatePosition(vehicleRef.current)
    ref.current.position.set(position.x, position.y, position.z)

    avoidEdges({ width: 20, height: 10, depth: 20 }, vehicleRef.current)

    // Get 10 frames into the future
    const futurePosition = velocity.clone().setLength(10).add(position)
    ref.current.lookAt(futurePosition)
  }

  useFrame(() => updateVehiclePosition())

  const setPosition = (newPosition: [number, number, number]) =>
    vehicleRef.current.position.set(...newPosition)

  return [
    ref,
    {
      applyForce: (force: THREE.Vector3) =>
        applyForce(force, vehicleRef.current),
      seek: (target: THREE.Vector3) => seek(target, vehicleRef.current),
      arrive: (target: THREE.Vector3) => arrive(target, vehicleRef.current),
      wander: (radius: number) => wander(radius, vehicleRef.current),
      setPosition,
    },
  ]
}

export { useVehicle }
