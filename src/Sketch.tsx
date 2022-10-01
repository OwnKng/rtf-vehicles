import { useVehicles } from "./hooks/useVehicles"
import * as THREE from "three"
import { useVehicle } from "./hooks/useVehicle"
import { ThreeElements, useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import { applyForce, seek, vehicleType, wander } from "./utils/vehicle"
import ThirdPersonCamera from "./components/ThirdPersonCamera"

const playerProps = {
  position: new THREE.Vector3(0, 0, 0),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0.1, 0, 0),
  maxSpeed: 0.4,
  maxForce: 0.005,
  latitude: 0,
  longitude: 0,
  world: {
    width: 50,
    height: 50,
    depth: 50,
  },
}

const Player = () => {
  const [ref, api] = useVehicle(playerProps)

  return (
    <>
      <ThirdPersonCamera target={ref} />
      <mesh ref={ref}>
        <cylinderBufferGeometry args={[0, 2, 8, 3]} />
        <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
      </mesh>
      <mesh>
        <boxBufferGeometry args={[50, 50, 50]} />
        <meshBasicMaterial wireframe />
      </mesh>
    </>
  )
}

const Sketch = () => {
  return (
    <>
      <Player />
    </>
  )
}

export default Sketch
