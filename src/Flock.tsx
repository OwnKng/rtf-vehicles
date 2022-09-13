import { useRef } from "react"
import * as THREE from "three"
import { vehicleProps } from "./hooks/useVehicle"
import { random } from "./utils"
import { useFrame } from "@react-three/fiber"
import { useVehicle } from "./hooks/useVehicle"

const width = 30
const height = 10
const depth = 30

const data = Array.from({ length: 100 }, () => ({
  position: new THREE.Vector3(
    random(0, width),
    random(0, height),
    random(0, depth)
  ),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(random(-5, 5), random(-5, 5), random(-5, 5)),
  maxSpeed: 0.1,
  maxForce: 0.5,
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
        <boxBufferGeometry args={[width, depth - 0.5, 0.1]} />
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
    checkEdges,
    separateVehicles,
    alignVehicles,
    cohereVehicles,
  } = useVehicle(vehicle)

  useFrame(() => {
    const sepForce = separateVehicles(data).multiplyScalar(1.1)
    applyForce(sepForce)

    const alignForce = alignVehicles(data)
    applyForce(alignForce)

    const cohereForce = cohereVehicles(data).multiplyScalar(0.8)
    applyForce(cohereForce)

    updatePosition()
    repeatEdges()

    ref.current.position.set(position.x, position.y, position.z)
  })

  return (
    <mesh ref={ref}>
      <coneBufferGeometry args={[0.2, 0.5, 3]} />
      <meshStandardMaterial color='#20A4F3' />
    </mesh>
  )
}

export default Flock
