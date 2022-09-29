import { useFrame } from "@react-three/fiber"
import { Ref, useLayoutEffect, useRef } from "react"
import * as THREE from "three"
import {
  applyForce,
  applyRepeller,
  updatePosition,
  seek,
  arrive,
  wander,
  avoidEdges,
  pursue,
  flee,
  distanceTo,
} from "../utils/vehicle"

type vehicleType = {
  id: number
  position: THREE.Vector3
  acceleration: THREE.Vector3
  velocity: THREE.Vector3
  maxSpeed: number
  maxForce: number
  latitude?: number
  longitude?: number
  world?: {
    width: number
    height: number
    depth: number
  }
}

const useVehicle = ({
  id,
  position,
  acceleration,
  velocity,
  maxSpeed,
  maxForce,
  latitude = Math.PI / 2,
  longitude = Math.PI / 2,
  world = {
    width: 20,
    height: 20,
    depth: 20,
  },
}: vehicleType): [Ref<THREE.Mesh>, any] => {
  const vehicleRef = useRef({
    id,
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

    // Steer away from edges
    const { width, height, depth } = world
    avoidEdges({ width, height, depth }, vehicleRef.current)

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
      flee: (target: THREE.Vector3) => flee(target, vehicleRef.current),
      pursue: (target: THREE.Vector3) => pursue(target, vehicleRef.current),
      setPosition,
      applyRepeller: (repeller: any) =>
        applyRepeller(repeller, vehicleRef.current),
      distanceTo: (target: THREE.Vector3) =>
        distanceTo(target, vehicleRef.current),
    },
  ]
}

export { useVehicle }
