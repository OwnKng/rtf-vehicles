import { Canvas } from "@react-three/fiber"
import Sketch from "./Sketch"

const App = () => (
  <Canvas
    orthographic
    shadows
    camera={{
      zoom: 80,
    }}
    onCreated={({ camera }) => {
      camera.position.setFromSphericalCoords(10, Math.PI / 3, Math.PI / 4)
      camera.lookAt(0, 0, 0)
    }}
  >
    <ambientLight />
    <spotLight position={[0, 10, 0]} />
    <Sketch />
  </Canvas>
)

export default App
