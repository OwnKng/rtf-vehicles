import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useVehicles } from "../hooks/useVehicles"
import { random } from "../utils"
import {
  alignVehicles,
  applyForce,
  cohereVehicles,
  separateVehicles,
  vehicleType,
} from "../utils/vehicle"
import { useRepeller } from "../hooks/useRepeller"
import { useRef } from "react"

const numberOfVehicles = 250

const vehiclesData = Array.from({ length: numberOfVehicles }, (_, i) => ({
  position: new THREE.Vector3(random(0, 10), random(0, 10), random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3().random(),
  maxSpeed: 0.3,
  maxForce: 0.01,
  latitude: 0,
  longitude: 0,
  world: {
    width: 50,
    height: 50,
    depth: 50,
  },
}))

const repellerData = [
  {
    position: new THREE.Vector3(10, 18, 10),
    radius: 10,
    strength: 10,
  },
  {
    position: new THREE.Vector3(0, 0, 0),
    radius: 8,
    strength: 10,
  },
  {
    position: new THREE.Vector3(10, 0, 10),
    radius: 5,
    strength: 10,
  },
]

const Repeller = ({ vehicles, ...props }: any) => {
  const ref = useRef<THREE.Mesh>(null!)
  const [repeller, api] = useRepeller(props)

  useFrame(({ clock }) => {
    vehicles.forEach((v: vehicleType) => {
      const force = api.repel(v)

      applyForce(force, v)
    })

    ref.current.position.set(
      repeller.position.x,
      repeller.position.y,
      repeller.position.z
    )
  })

  return (
    <mesh ref={ref}>
      <sphereBufferGeometry args={[props.radius, 8, 8]} />
      <meshBasicMaterial wireframe />
    </mesh>
  )
}

const Flock = () => {
  const [ref, vehicles] = useVehicles(vehiclesData)

  useFrame(() => {
    vehicles.forEach((vehicle: vehicleType) => {
      const separation = separateVehicles(vehicle, vehicles)
      applyForce(separation, vehicle)

      const alignment = alignVehicles(vehicle, vehicles)
      applyForce(alignment, vehicle)

      const coherence = cohereVehicles(vehicle, vehicles)
      applyForce(coherence, vehicle)
    })
  })

  return (
    <>
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, numberOfVehicles]}
        castShadow
        receiveShadow
      >
        <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
        <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
      </instancedMesh>
      {repellerData.map((repel, i) => (
        <Repeller key={`repeller-${i}`} vehicles={vehicles} {...repel} />
      ))}
    </>
  )
}

export default Flock
