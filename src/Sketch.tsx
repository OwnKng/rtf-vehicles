import * as THREE from "three"
import { random } from "./utils"
import Box from "./Box"
import Wander from "./Wander"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"

const width = 10
const height = 10
const depth = 10

const data = Array.from({ length: 25 }, () => ({
  position: new THREE.Vector3(random(0, width), 0, random(0, height)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: random(0.1, 0.025),
  maxForce: random(0.0005, 0.01),
  wanderTheta: random(-Math.PI * 0.5, Math.PI * 0.5),
  latitude: Math.PI / 2,
  longitude: Math.PI * 2,
  edges: {
    width: width,
    height: height,
    depth: depth,
  },
}))

const Sketch = () => {
  const ref = useRef<THREE.Group>(null!)

  useFrame(({ mouse }) => (ref.current.rotation.y = mouse.x * Math.PI * 0.5))

  return (
    <group ref={ref} position={[0, -5, 0]}>
      <group position={[-5, 0, -5]}>
        {data.map((vehicle, i) => (
          <Wander key={`wander-${i}`} {...vehicle} />
        ))}
      </group>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <boxBufferGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color='#1e2124' />
      </mesh>
      <Box
        width={width + 0.1}
        height={height + 0.1}
        depth={depth + 0.1}
        position={[0, 5, 0]}
      />
    </group>
  )
}

export default Sketch
