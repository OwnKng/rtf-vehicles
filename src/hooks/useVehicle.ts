import { useFrame } from "@react-three/fiber"
import { RefObject, useLayoutEffect, useRef } from "react"
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
  evade,
  distanceTo,
  stop,
} from "../utils/vehicle"
import { v4 as uuidv4 } from "uuid"

type worldType = {
  width: number
  height: number
  depth: number
}

type vehicleProps = {
  position?: THREE.Vector3
  acceleration?: THREE.Vector3
  velocity?: THREE.Vector3
  maxSpeed?: number
  maxForce?: number
  latitude?: number
  longitude?: number
  world?: worldType
}

type apiType = {
  applyForce: (force: THREE.Vector3) => void
  seek: (target: THREE.Vector3) => THREE.Vector3
  arrive: (target: THREE.Vector3) => THREE.Vector3
  wander: (radius: number) => THREE.Vector3
  flee: (target: THREE.Vector3) => THREE.Vector3
  pursue: (target: THREE.Vector3) => THREE.Vector3
  evade: (target: THREE.Vector3) => THREE.Vector3
  setPosition: (newPosition: [number, number, number]) => void
  stop: () => THREE.Vector3
  applyRepeller: (repeller: any) => void
  distanceTo: (target: THREE.Vector3) => number
}

const useVehicle = (props?: vehicleProps): [RefObject<THREE.Mesh>, apiType] => {
  const vehicleRef = useRef({
    id: uuidv4(),
    position: props?.position || new THREE.Vector3(0, 0, 0),
    acceleration: props?.acceleration || new THREE.Vector3(0, 0, 0),
    velocity: props?.velocity || new THREE.Vector3(0, 0, 0),
    maxSpeed: props?.maxSpeed || 0.2,
    maxForce: props?.maxForce || 0.01,
    latitude: props?.latitude || Math.PI / 2,
    longitude: props?.longitude || Math.PI / 2,
    world: props?.world || { width: 20, height: 20, depth: 20 },
  })
  const ref = useRef<THREE.Mesh>(null!)

  useLayoutEffect(() => {
    ref.current.geometry.rotateX(Math.PI / 2)
  }, [])

  const updateVehiclePosition = () => {
    const { position } = updatePosition(vehicleRef.current)
    ref.current.position.set(position.x, position.y, position.z)

    // Steer away from edges
    const { width, height, depth } = vehicleRef.current.world
    avoidEdges({ width, height, depth }, vehicleRef.current)

    // Get 10 frames into the future
    const futurePosition = vehicleRef.current.velocity
      .clone()
      .setLength(10)
      .add(position)
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
      evade: (target: THREE.Vector3) => evade(target, vehicleRef.current),
      stop: () => stop(vehicleRef.current),
      setPosition,
      applyRepeller: (repeller: any) =>
        applyRepeller(repeller, vehicleRef.current),
      distanceTo: (target: THREE.Vector3) =>
        distanceTo(target, vehicleRef.current),
      ...vehicleRef.current,
    },
  ]
}

export { useVehicle }
