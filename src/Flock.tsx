import { useRef } from "react"
import * as THREE from "three"
import { vehicleProps } from "./useVehicle"
import { random } from "./utils"
import { useFrame } from "@react-three/fiber"
import { useVehicle } from "./useVehicle"

const width = 10
const height = 10
const depth = 10

const data = Array.from({ length: 100 }, () => ({
  position: new THREE.Vector3(
    random(0, width),
    random(0, height),
    random(0, depth)
  ),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(random(0, 10), random(0, 10), random(0, 10)),
  maxSpeed: 0.025,
  maxForce: 1,
  wanderTheta: random(-Math.PI * 0.5, Math.PI * 0.5),
  latitude: Math.PI / 2,
  longitude: Math.PI * 2,
  edges: {
    width: width,
    height: height,
    depth: depth,
  },
}))

const Flock = () => {
  return (
    <group position={[0, -5, 0]}>
      <group position={[-5, 0, -5]}>
        {data.map((vehicle, i) => (
          <Vehicle key={`wander-${i}`} {...vehicle} />
        ))}
      </group>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <boxBufferGeometry args={[width, height - 0.5, 0.1]} />
        <meshStandardMaterial color='#1e2124' />
      </mesh>
    </group>
  )
}

const Vehicle = (vehicle: vehicleProps) => {
  const ref = useRef<THREE.Mesh>(null!)

  const {
    position,
    velocity,
    applyForce,
    updatePosition,
    repeatEdges,
    separateVehicles,
  } = useVehicle(vehicle)

  useFrame(() => {
    const force = separateVehicles(data)

    applyForce(force)
    repeatEdges()

    updatePosition()

    ref.current.position.set(position.x, position.y, position.z)
    ref.current.lookAt(velocity)
  })

  return (
    <mesh ref={ref}>
      <coneBufferGeometry args={[0.2, 0.5, 3]} />
      <meshStandardMaterial color='#20A4F3' />
    </mesh>
  )
}

export default Flock
