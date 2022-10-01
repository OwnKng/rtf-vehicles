import { useVehicles } from "./hooks/useVehicles"
import * as THREE from "three"
import { useVehicle } from "./hooks/useVehicle"
import { ThreeElements, useFrame } from "@react-three/fiber"
import { forwardRef, useRef, useState } from "react"
import { applyForce, seek, vehicleType, wander } from "./utils/vehicle"
import ThirdPersonCamera from "./components/ThirdPersonCamera"

const Player = forwardRef((_, ref: any) => (
  <mesh ref={ref}>
    <cylinderBufferGeometry args={[0, 2, 8, 3]} />
    <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
  </mesh>
))

export default Player
