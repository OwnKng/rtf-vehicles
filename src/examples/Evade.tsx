import { useVehicle } from "../hooks/useVehicle"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"
import { Ref, forwardRef } from "react"

const origin = new THREE.Vector3(0, 0, 0)

const Evade = () => {
  const [evader, updateEvader] = useVehicle({
    maxSpeed: 0.5,
    world: {
      width: 10,
      height: 10,
      depth: 10,
    },
  })
  const [wanderer, updateWanderer] = useVehicle({
    world: {
      width: 10,
      height: 10,
      depth: 10,
    },
  })

  useFrame(() => {
    const wander = updateWanderer.wander(20)
    updateWanderer.applyForce(wander)

    const wandererPosition = wanderer.current?.position || origin

    const distanceToWander = updateEvader.distanceTo(wandererPosition)

    const force =
      distanceToWander < 10
        ? updateEvader.evade(wandererPosition)
        : updateEvader.stop()
    updateEvader.applyForce(force)
  })

  return (
    <group>
      <Evader ref={evader} />
      <Wanderer ref={wanderer} />
      <mesh rotation={[-Math.PI * 0.5, 0, 0]} position={[-5, -5, -5]}>
        <planeBufferGeometry args={[40, 40, 5, 5]} />
        <meshBasicMaterial wireframe />
      </mesh>
    </group>
  )
}

const Evader = forwardRef((_, ref: Ref<THREE.Mesh>) => (
  <mesh ref={ref}>
    <cylinderBufferGeometry args={[0, 1, 4, 3]} />
    <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
  </mesh>
))

const Wanderer = forwardRef((_, ref: Ref<THREE.Mesh>) => (
  <mesh ref={ref}>
    <cylinderBufferGeometry args={[0, 1, 4, 3]} />
    <meshPhongMaterial flatShading shininess={1} color='#F15152' />
  </mesh>
))

export default Evade
