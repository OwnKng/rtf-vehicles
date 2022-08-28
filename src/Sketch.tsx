import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import useParticle from "./useParticle"

const particleData = {
  position: new THREE.Vector2(0, 0),
  acceleration: new THREE.Vector2(0, 0),
  velocity: new THREE.Vector2(0, 0),
  maxSpeed: 0.1,
}

const Sketch = () => <Particle {...particleData} />

interface particle {
  position: THREE.Vector2
  acceleration: THREE.Vector2
  velocity: THREE.Vector2
  maxSpeed: number
}

const Particle = (particle: particle) => {
  const targetRef = useRef(new THREE.Vector2(0, 0))

  const { position, seek, applyForce, updatePosition, arrive } =
    useParticle(particle)
  const ref = useRef<THREE.Mesh>(null!)

  useFrame(({ mouse }) => {
    targetRef.current.set(mouse.x * 10, mouse.y * 10)
    const force = arrive(targetRef.current)
    applyForce(force)
    updatePosition()
    ref.current.position.set(position.x, position.y, 0)
  })

  return (
    <mesh ref={ref}>
      <boxBufferGeometry />
      <meshBasicMaterial />
    </mesh>
  )
}

export default Sketch
