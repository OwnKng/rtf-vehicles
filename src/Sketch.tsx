import * as THREE from "three"
import Hunter from "./vehicles/Hunter"
import Prey from "./vehicles/Prey"
import { useVehicle } from "./hooks/useVehicle"
import { useCallback, useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { random } from "./utils"

const Sketch = () => {
  const [preyRef, api] = useVehicle({
    position: new THREE.Vector3(5, 5, 5),
    acceleration: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    maxSpeed: 0.1,
    maxForce: 0.01,
    latitude: Math.PI * 0.2,
    longitude: Math.PI * 0.1,
  })

  return (
    <group>
      <Prey ref={preyRef} {...api} />
      <Hunter
        prey={preyRef}
        onCatch={() =>
          api.setPosition([random(0, 20), random(0, 20), random(0, 20)])
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
