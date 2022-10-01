import { Canvas } from "@react-three/fiber"
import Player from "./Player"
import * as THREE from "three"
import { useVehicle } from "./hooks/useVehicle"
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

const Environment = () => {
  const [ref, api] = useVehicle(playerProps)

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
