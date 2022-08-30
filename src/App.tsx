import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"
import * as THREE from "three"

const App = () => (
  <Canvas
    orthographic
    shadows
    camera={{
      zoom: 50,
    }}
    onCreated={({ camera }) => {
      camera.position.setFromSphericalCoords(20, Math.PI / 3, Math.PI / 4)
      camera.lookAt(0, 0, 0)
    }}
  >
    <ambientLight intensity={0.2} />
    <spotLight
      intensity={0.8}
      position={[5, 5, 5]}
      lookAt={() => new THREE.Vector3(0, 0, 0)}
    />
    <Sketch />
  </Canvas>
)

export default App
