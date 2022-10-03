import { Canvas, useFrame } from "@react-three/fiber"
import Player from "./Player"
import * as THREE from "three"
import { useVehicle } from "./hooks/useVehicle"
import ThirdPersonCamera from "./components/ThirdPersonCamera"
import { useKeyboard } from "./hooks/useKeyboard"
import { applyForce } from "./utils/vehicle"
import { useRef } from "react"

const playerProps = {
  position: new THREE.Vector3(0, 0, 0),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  heading: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.001,
  maxForce: 0.005,
  latitude: 0,
  longitude: 0,
  world: {
    width: 50,
    height: 50,
    depth: 50,
  },
}

const Environment = () => {
  const heading = useKeyboard()

  const [ref, api] = useVehicle(playerProps)

  const headingRef = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    //@ts-ignore
    const h = heading()

    const { x, y, z } = h.current

    ref.current.lookAt(h.current)
  })

  return (
    <>
      <ambientLight intensity={0.4} />
      <spotLight
        intensity={0.8}
        position={[0, 50, 0]}
        lookAt={() => new THREE.Vector3(0, 0, 0)}
      />
      <ThirdPersonCamera target={ref} />
      <Player ref={ref} />
      <mesh>
        <boxBufferGeometry args={[50, 50, 50]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh>
        <sphereBufferGeometry args={[20, 16]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh ref={headingRef}>
        <sphereBufferGeometry args={[0.1, 16]} />
        <meshBasicMaterial color='red' />
      </mesh>
    </>
  )
}

const App = () => {
  return (
    <>
      <Canvas>
        <Environment />
      </Canvas>
    </>
  )
}

export default App
