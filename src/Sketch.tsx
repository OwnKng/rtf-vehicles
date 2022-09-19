import { useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import * as THREE from "three"
import { useRepeller } from "./hooks/useRepeller"
import { useVehicle } from "./hooks/useVehicle"
import { random, map } from "./utils"
import { applyForce, vehicleType } from "./utils/vehicle"

const vehicleData = Array.from({ length: 50 }, () => ({
  position: new THREE.Vector3(random(0, 10), 0, random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.3,
  maxForce: 0.01,
}))

const repellerData = {
  position: new THREE.Vector3(0, 0, 0),
  strength: 1,
  radius: 10,
}

const Wanderer = ({ data, repeller }: any) => {
  const [vehicle, api] = useVehicle(data)

  useFrame(() => {
    const seeker = api.wander(20)
    api.applyForce(seeker)

    api.applyRepeller(repeller)
  })

  return (
    <mesh ref={vehicle}>
      <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
      <meshPhongMaterial flatShading shininess={8} color='#5ADBFF' />
    </mesh>
  )
}

const Sketch = () => {
  const ref = useRef<THREE.Mesh>(null!)

  const [repeller] = useRepeller(repellerData)

  return (
    <>
      {vehicleData.map((d, i) => (
        <Wanderer key={`seeker-${i}`} data={d} repeller={repeller} />
      ))}
      <mesh>
        <sphereBufferGeometry args={[repellerData.radius - 2, 8, 8]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[20, 20]} />
        <meshBasicMaterial color='white' wireframe />
      </mesh>
    </>
  )
}

export default Sketch
