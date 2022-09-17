import { useFrame } from "@react-three/fiber"
import { forwardRef } from "react"
import * as THREE from "three"
import { Ref } from "react"

const Prey = forwardRef((props: any, ref: Ref<THREE.Mesh>) => {
  const { wander, applyForce } = props

  useFrame(() => {
    const force = wander(20)
    applyForce(force)
  })

  return (
    <mesh ref={ref}>
      <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
      <meshPhongMaterial flatShading shininess={8} color='#5ADBFF' />
    </mesh>
  )
})

export default Prey
