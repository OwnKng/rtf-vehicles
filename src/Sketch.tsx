import * as THREE from "three"
import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import useParticle from "./useParticle"

const width = 10
const height = 10

const random = (min: number, max: number) => (max - min) * Math.random() + min

const particleData = Array.from({ length: 50 }, () => ({
  position: new THREE.Vector3(
    random(-width, width) * 0.5,
    0,
    random(-height, height) * 0.5
  ),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.1,
}))

const Sketch = () => {
  const [target, setTarget] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0)
  )

  return (
    <>
      {particleData.map((particle) => (
        <Particle particle={particle} target={target} />
      ))}
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        onPointerMove={(e) => setTarget(e.point)}
      >
        <planeBufferGeometry args={[width, height]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <boxBufferGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial />
      </mesh>
    </>
  )
}

interface particleProps {
  particle: {
    position: THREE.Vector3
    acceleration: THREE.Vector3
    velocity: THREE.Vector3
    maxSpeed: number
  }
  target: THREE.Vector3
}

const Particle = ({ particle, target }: particleProps) => {
  const { position, applyForce, updatePosition, arrive } = useParticle(particle)

  const ref = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    const force = arrive(target)
    applyForce(force)
    updatePosition()
    ref.current.position.set(position.x, position.y + 0.2, position.z)
  })

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color='teal' />
    </mesh>
  )
}

export default Sketch
