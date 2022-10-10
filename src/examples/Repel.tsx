import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import * as THREE from "three"
import { useRepeller } from "../hooks/useRepeller"
import { useVehicle } from "../hooks/useVehicle"
import { random } from "../utils"

const vehicleData = Array.from({ length: 200 }, () => ({
  position: new THREE.Vector3(random(0, 10), random(0, 10), random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.2,
  maxForce: 0.01,
  world: {
    width: 20,
    height: 20,
    depth: 20,
  },
}))

const colors = ["#F15152", "#5ADBFF", "#F2E863"]

const Wanderer = ({ data, repel }: any) => {
  const [vehicle, api] = useVehicle(data)

  useFrame(() => {
    api.applyRepeller(repel)
  })

  return (
    <mesh ref={vehicle}>
      <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
      <meshPhongMaterial
        flatShading
        shininess={8}
        color={colors[Math.floor(Math.random() * 3)]}
      />
    </mesh>
  )
}

const r = 10

const Repel = () => {
  const ref = useRef<THREE.Mesh>(null!)
  const [repeller, api] = useRepeller({
    position: new THREE.Vector3(0, 0, 0),
    strength: 10,
    radius: r,
  })

  const mouse = useRef(new THREE.Vector3(0, 0, 0))

  useFrame(() => {
    api.setPosition(mouse.current.x, mouse.current.y, mouse.current.z)

    const { x, y, z } = repeller.position
    ref.current.position.set(x, y, z)
  })

  return (
    <>
      {vehicleData.map((d, i) => (
        <Wanderer key={`seeker-${i}`} data={d} repel={api.repel} />
      ))}
      <mesh ref={ref}>
        <sphereBufferGeometry args={[r, 32, 32]} />
        <meshBasicMaterial opacity={0.5} transparent />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        onPointerMove={(e) => (mouse.current = e.point)}
      >
        <planeBufferGeometry args={[100, 100, 10, 10]} />
        <meshBasicMaterial color='white' wireframe />
      </mesh>
    </>
  )
}

export default Repel
