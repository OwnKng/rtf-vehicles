import { useLayoutEffect, useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useVehicle, vehicleProps } from "./useVehicle"
import * as THREE from "three"

const Wander = (vehicle: vehicleProps) => {
  const { position, velocity, applyForce, updatePosition, wander, checkEdges } =
    useVehicle(vehicle)

  const ref = useRef<THREE.Mesh>(null!)

  useLayoutEffect(() => {
    ref.current.geometry.applyMatrix4(
      new THREE.Matrix4().makeRotationFromEuler(
        new THREE.Euler(Math.PI * 0.5, -Math.PI, -Math.PI, "XYZ")
      )
    )
  })

  useFrame(() => {
    const force = wander(30)
    applyForce(force)
    checkEdges()

    updatePosition()

    ref.current.position.set(position.x, position.y + 0.25, position.z)
    ref.current.lookAt(velocity)
  })

  return (
    <mesh ref={ref}>
      <coneBufferGeometry args={[0.2, 0.5, 3]} />
      <meshStandardMaterial color='#20A4F3' />
    </mesh>
  )
}

export default Wander
