import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { forwardRef, Ref } from "react"

const Predator = forwardRef((props: any, ref: Ref<THREE.Mesh>) => {
  const { prey, onCatch, wander, seek, applyForce } = props

  useFrame(() => {
    const { position } = prey.current
    const force = !prey ? wander(20) : seek(position)
    applyForce(force)

    //@ts-ignore
    if (ref.current.position.distanceTo(position) < 1) onCatch()
  })

  return (
    <mesh ref={ref}>
      <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
      <meshPhongMaterial flatShading shininess={8} color='#F15152' />
    </mesh>
  )
})

export default Predator
