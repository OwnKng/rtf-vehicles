import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"
import * as THREE from "three"
import { OrbitControls } from "@react-three/drei"

const App = () => (
  <Canvas
    onCreated={({ camera }) => {
      camera.position.setFromSphericalCoords(25, Math.PI / 3, Math.PI / 4)
      camera.lookAt(0, 0, 0)
    }}
    shadows
  >
    <OrbitControls />
    <ambientLight intensity={0.4} />
    <spotLight
      intensity={0.8}
      position={[0, 40, 0]}
      lookAt={() => new THREE.Vector3(0, 0, 0)}
    />
    <Sketch />
  </Canvas>
)

export default App
