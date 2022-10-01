import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useRef, useLayoutEffect } from "react"
import { avoidEdges, updatePosition } from "../utils/vehicle"
import { v4 as uuidv4 } from "uuid"
import { vehicleType } from "../utils/vehicle"

const tempObject = new THREE.Object3D()

type vehiclesProps = {
  position: THREE.Vector3
  acceleration: THREE.Vector3
  velocity: THREE.Vector3
  maxSpeed: number
  maxForce: number
  latitude: number
  longitude: number
  world: {
    width: number
    height: number
    depth: number
  }
}

const useVehicles = (vehicleArray: vehiclesProps[]): any => {
  const vehicles = useRef<vehicleType[]>(
    vehicleArray.map((v) => ({ id: uuidv4(), ...v }))
  )
  const meshRef = useRef<THREE.InstancedMesh>(null!)

  //* rotate on first load so they follow the direction of travel

  useLayoutEffect(() => {
    meshRef.current.geometry.rotateX(Math.PI / 2)
  }, [])

  const updateVehicles = () => {
    vehicles.current.forEach((v, i) => {
      const { position } = updatePosition(v)

      tempObject.position.set(position.x, position.y, position.z)

      //* Steer away from edges
      const { width, height, depth } = v.world || {
        width: 10,
        height: 10,
        depth: 10,
      }
      avoidEdges({ width, height, depth }, v)

      //* Get 10 frames into the future
      const futurePosition = v.velocity.clone().setLength(10).add(position)
      tempObject.lookAt(futurePosition)

      //* Update the tempObject matrix and apply to instance mesh
      tempObject.updateMatrix()
      meshRef.current.setMatrixAt(i, tempObject.matrix)
    })

    meshRef.current.instanceMatrix.needsUpdate = true
  }

  const at = (index: number) => vehicles.current.at(index)

  useFrame(() => updateVehicles())

  return [
    meshRef,
    vehicles.current,
    {
      at,
    },
  ]
}

export { useVehicles }
