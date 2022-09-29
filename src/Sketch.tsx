import { useFrame } from "@react-three/fiber"
import { useMemo } from "react"
import * as THREE from "three"
import { useRepeller } from "./hooks/useRepeller"
import { useVehicles } from "./hooks/useVehicles"
import { random } from "./utils"
import {
  alignVehicles,
  applyForce,
  applyRepeller,
  cohereVehicles,
  separateVehicles,
  vehicleType,
  createVehicleGrid,
} from "./utils/vehicle"

const vehicleData = Array.from({ length: 500 }, (_, i) => ({
  id: i,
  position: new THREE.Vector3(random(0, 10), random(0, 10), random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3().random(),
  maxSpeed: 0.25,
  maxForce: 0.01,
  latitude: 0,
  longitude: 0,
  world: {
    width: 50,
    height: 50,
    depth: 50,
  },
}))

const Sketch = () => {
  const [, { repel }] = useRepeller({
    position: new THREE.Vector3(0, 0, 0),
    strength: 10,
    radius: 5,
  })

  const [, { repel: repel2 }] = useRepeller({
    position: new THREE.Vector3(8, 8, 0),
    strength: 10,
    radius: 5,
  })

  const { placeInCell, getVehiclesInCells } = useMemo(
    () => createVehicleGrid(50, 50, 20, 20),
    []
  )

  const [ref, vehicles] = useVehicles(vehicleData)

  useFrame(() => {
    vehicles.forEach((vehicle: vehicleType) => {
      const cell = placeInCell(vehicle)
      const adjacentVehicleIds = getVehiclesInCells(cell)
      //@ts-ignore
      const adjacentVehicles = vehicles.filter((v) =>
        adjacentVehicleIds.includes(v.id)
      )

      console.log(adjacentVehicles.length)

      //
      const separation = separateVehicles(vehicle, adjacentVehicles)
      applyForce(separation, vehicle)

      //
      const alignment = alignVehicles(vehicle, adjacentVehicles)
      applyForce(alignment, vehicle)

      //
      const coherence = cohereVehicles(vehicle, adjacentVehicles)
      applyForce(coherence, vehicle)

      applyRepeller(repel, vehicle)
      applyRepeller(repel2, vehicle)
    })
  })

  return (
    <>
      <instancedMesh ref={ref} args={[undefined, undefined, 500]}>
        <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
        <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
      </instancedMesh>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[40, 40, 1, 1]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh>
        <sphereBufferGeometry args={[5, 8, 8]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh position={[8, 8, 0]}>
        <sphereBufferGeometry args={[5, 8, 8]} />
        <meshBasicMaterial wireframe />
      </mesh>
    </>
  )
}

export default Sketch
