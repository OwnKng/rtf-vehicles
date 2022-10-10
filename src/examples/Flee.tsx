import { useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import * as THREE from "three"
import { useVehicle } from "../hooks/useVehicle"
import { random } from "../utils"

const vehicleData = {
  position: new THREE.Vector3(random(0, 10), random(0, 10), random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.2,
  maxForce: 0.01,
}

type boidProps = {
  home: THREE.Vector3
  predator: THREE.Vector3
}

const Boid = ({ home, predator }: boidProps) => {
  const [vehicle, api] = useVehicle(vehicleData)

  useFrame(() => {
    const distanceToPredator = api.distanceTo(predator)

    const force =
      distanceToPredator > 10 ? api.arrive(home) : api.flee(predator)
    api.applyForce(force)
  })

  return (
    <mesh ref={vehicle}>
      <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
      <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
    </mesh>
  )
}

const r = 10
const homePosition = new THREE.Vector3(0, 1, 0)

const Flee = () => {
  const ref = useRef<THREE.Mesh>(null!)
  const [predPosition, setPredPosition] = useState<THREE.Vector3>(
    new THREE.Vector3(0, 0, 0)
  )

  useFrame(() => {
    const { x, y, z } = predPosition
    ref.current.position.set(x, y, z)
  })

  return (
    <>
      <Boid home={homePosition} predator={predPosition} />
      <mesh position={[homePosition.x, homePosition.y - 1, homePosition.z]}>
        <boxBufferGeometry args={[2, 0.1, 2]} />
        <meshPhongMaterial flatShading shininess={1} color='#F2E863' />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        onPointerMove={(e) => setPredPosition(e.point)}
      >
        <planeBufferGeometry args={[40, 40, 5, 5]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh ref={ref} rotation={[-Math.PI * 0.5, 0, 0]}>
        <circleBufferGeometry args={[r, 16]} />
        <meshBasicMaterial wireframe />
      </mesh>
    </>
  )
}

export default Flee
