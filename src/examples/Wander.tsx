import { useFrame } from "@react-three/fiber"
import { useVehicle } from "../hooks/useVehicle"

const Wander = () => {
  const [vehicle, api] = useVehicle()

  useFrame(() => {
    const wanderForce = api.wander(20)
    api.applyForce(wanderForce)
  })

  return (
    <mesh ref={vehicle}>
      <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
      <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
    </mesh>
  )
}

export default Wander
