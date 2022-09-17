import { useFrame } from "@react-three/fiber"
import { forwardRef } from "react"
import * as THREE from "three"
import { Ref } from "react"

const Prey = forwardRef((props: any, ref: Ref<THREE.Mesh>) => {
  const { wander, applyForce, predator, flee } = props

  useFrame(() => {
    //@ts-ignore
    const distanceToPredator =
      ref.current.position.distanceTo(predator.current.position) || 20

    const force =
      distanceToPredator > 10 ? wander(20) : flee(predator.current.position)
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
