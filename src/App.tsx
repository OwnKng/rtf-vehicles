import { OrbitControls } from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import Flee from "./examples/Flee"
import Flock from "./examples/Flock"
import PredatorAndPreyFlock from "./examples/PredatorAndPreyFlock"
import Repel from "./examples/Repel"
import { useState } from "react"
import PredatorAndPrey from "./examples/PredatorAndPrey"
import Wander from "./examples/Wander"
import Evade from "./examples/Evade"

const examplesMap = {
  flock: <Flock />,
  flee: <Flee />,
  flockwithPredator: <PredatorAndPreyFlock />,
  repel: <Repel />,
  predator: <PredatorAndPrey />,
  wander: <Wander />,
  evade: <Evade />,
}

const App = () => {
  const [state, setState] = useState<string>("flock")

  return (
    <div>
      <div className='controls'>
        {Object.keys(examplesMap).map((key) => (
          <button key={key} onClick={() => setState(key)}>
            {key}
          </button>
        ))}
      </div>
      <Canvas
        onCreated={({ camera }) => {
          camera.position.setFromSphericalCoords(50, Math.PI / 3, Math.PI / 4)
          camera.lookAt(0, 0, 0)
        }}
        shadows
      >
        <OrbitControls />
        <ambientLight intensity={0.4} />
        <spotLight position={[0, 40, 0]} />

        {
          //@ts-ignore
          examplesMap[state]
        }
      </Canvas>
    </div>
  )
}

export default App
