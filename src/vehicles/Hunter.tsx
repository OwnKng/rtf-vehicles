import { useVehicle } from "../hooks/useVehicle"
import * as THREE from "three"
import { useFrame } from "@react-three/fiber"

const Hunter = ({ prey, onCatch }: any) => {
  const [hunterRef, api] = useVehicle({
    position: new THREE.Vector3(5, 5, 5),
    acceleration: new THREE.Vector3(0, 0, 0),
    velocity: new THREE.Vector3(0, 0, 0),
    maxSpeed: 0.2,
    maxForce: 0.01,
    latitude: Math.PI * 0.2,
    longitude: Math.PI * 0.1,
  })

  useFrame(() => {
    const { position } = prey.current
    const force = !prey ? api.wander(20) : api.seek(position)
    api.applyForce(force)

    //@ts-ignore
    if (hunterRef.current.position.distanceTo(position) < 1) onCatch()
  })

  return (
    <mesh ref={hunterRef}>
      <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
      <meshPhongMaterial flatShading shininess={8} color='#F15152' />
    </mesh>
  )
}

export default Hunter
