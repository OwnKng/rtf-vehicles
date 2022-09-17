import * as THREE from "three"
import Predator from "./vehicles/Predator"
import Prey from "./vehicles/Prey"
import { useVehicle } from "./hooks/useVehicle"
import { random } from "./utils"

const predatorData = {
  position: new THREE.Vector3(random(0, 20), random(0, 20), random(0, 20)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.2,
  maxForce: 0.01,
}

const preyData = {
  position: new THREE.Vector3(5, 5, 5),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.1,
  maxForce: 0.01,
}

const Sketch = () => {
  const [predator, updatePredator] = useVehicle(predatorData)
  const [prey, updatePrey] = useVehicle(preyData)

  return (
    <group>
      <Prey ref={prey} {...updatePrey} predator={predator} />
      <Predator
        ref={predator}
        {...updatePredator}
        prey={prey}
        onCatch={() =>
          updatePrey.setPosition([random(0, 20), random(0, 20), random(0, 20)])
        }
      />
      <mesh position={[0, -5, 0]} rotation={[0, -Math.PI * 0.5, 0]}>
        <boxBufferGeometry args={[100, 0.1, 100]} />
        <meshPhongMaterial flatShading shininess={8} color='#1e2124' />
      </mesh>
    </group>
  )
}

//

export default Sketch
