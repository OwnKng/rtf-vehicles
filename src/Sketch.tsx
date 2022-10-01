import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useVehicles } from "./hooks/useVehicles"
import { random } from "./utils"
import {
  alignVehicles,
  applyForce,
  cohereVehicles,
  separateVehicles,
  vehicleType,
  flee,
  applyRepeller,
  distanceTo,
  seek,
} from "./utils/vehicle"
import { useRepeller } from "./hooks/useRepeller"

const predatorData = Array.from({ length: 5 }, () => ({
  position: new THREE.Vector3(random(0, 10), random(0, 10), random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.4,
  maxForce: 0.005,
  latitude: 0,
  longitude: 0,
  world: {
    width: 50,
    height: 50,
    depth: 50,
  },
}))

const vehiclesData = Array.from({ length: 250 }, (_, i) => ({
  position: new THREE.Vector3(random(0, 10), random(0, 10), random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
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

const r = 8

const Sketch = () => {
  const [predatorRef, predators] = useVehicles(predatorData)
  const [ref, vehicles] = useVehicles(vehiclesData)

  const [, { repel }] = useRepeller({
    position: new THREE.Vector3(0, 0, 0),
    strength: 10,
    radius: r,
  })

  useFrame(() => {
    vehicles.forEach((vehicle: vehicleType) => {
      const separation = separateVehicles(vehicle, vehicles)
      applyForce(separation, vehicle)

      const alignment = alignVehicles(vehicle, vehicles)
      applyForce(alignment, vehicle)

      const coherence = cohereVehicles(vehicle, vehicles)
      applyForce(coherence, vehicle)

      predators.forEach((predator: vehicleType) => {
        if (distanceTo(predator.position, vehicle) < 5) {
          const fleeForce = flee(predator.position, vehicle).multiplyScalar(2)
          applyForce(fleeForce, vehicle)
        }
      })

      applyRepeller(repel, vehicle)
    })

    predators.forEach((predator: vehicleType) => {
      const closestVehicle = vehicles.reduce(
        (acc: vehicleType, cur: vehicleType) =>
          distanceTo(predator.position, cur) <
          distanceTo(predator.position, acc)
            ? cur
            : acc
      )

      const seekForce = seek(closestVehicle.position, predator)
      applyForce(seekForce, predator)

      applyRepeller(repel, predator)
    })
  })

  return (
    <>
      <instancedMesh
        ref={ref}
        args={[undefined, undefined, vehiclesData.length]}
        castShadow
        receiveShadow
      >
        <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
        <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
      </instancedMesh>
      <instancedMesh
        ref={predatorRef}
        args={[undefined, undefined, predatorData.length]}
        castShadow
        receiveShadow
      >
        <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
        <meshPhongMaterial flatShading shininess={1} color='#F15152' />
      </instancedMesh>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[40, 40, 1, 1]} />
        <meshBasicMaterial wireframe />
      </mesh>

      <mesh>
        <sphereBufferGeometry args={[r, 8, 8]} />
        <meshBasicMaterial wireframe />
      </mesh>
    </>
  )
}

export default Sketch
