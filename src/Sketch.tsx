import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import useParticle from "./useParticle"

const width = 10
const height = 10

const random = (min: number, max: number) => (max - min) * Math.random() + min

const particleData = Array.from({ length: 10 }, () => ({
  position: new THREE.Vector3(random(0, width), 0, random(0, height)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: random(0.1, 0.05),
  maxForce: random(0.0005, 0.01),
  wanderTheta: random(-Math.PI * 0.5, Math.PI * 0.5),
  edges: {
    width: 10,
    height: 2,
    depth: 10,
  },
}))

const Sketch = () => {
  return (
    <>
      <group position={[-5, 0.2, -5]}>
        {particleData.map((particle, i) => (
          <Particle key={i} {...particle} />
        ))}
      </group>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <boxBufferGeometry args={[width, height, 0.1]} />
        <meshStandardMaterial color='#1e2124' />
      </mesh>
    </>
  )
}

interface particleProps {
  position: THREE.Vector3
  acceleration: THREE.Vector3
  velocity: THREE.Vector3
  maxSpeed: number
  maxForce: number
  wanderTheta: number
  edges: {
    width: number
    height: number
    depth: number
  }
}

const Particle = (particle: particleProps) => {
  const { position, applyForce, updatePosition, wander, checkEdges } =
    useParticle(particle)

  const theta = useRef<number>(particle.wanderTheta)

  const ref = useRef<THREE.Mesh>(null!)

  useFrame(() => {
    theta.current += random(-0.3, 0.3)
    const force = wander(theta.current)
    applyForce(force)
    checkEdges()

    updatePosition()

    ref.current.position.set(position.x, position.y, position.z)
  })

  return (
    <mesh ref={ref}>
      <boxBufferGeometry args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial color='#EE5622' />
    </mesh>
  )
}

export default Sketch
