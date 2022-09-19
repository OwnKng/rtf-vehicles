import { useFrame } from "@react-three/fiber"
import { useRef, useState } from "react"
import * as THREE from "three"
import { useRepeller } from "./hooks/useRepeller"
import { useVehicle } from "./hooks/useVehicle"
import { random } from "./utils"

const vehicleData = Array.from({ length: 50 }, () => ({
  position: new THREE.Vector3(random(0, 10), 0, random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.3,
  maxForce: 0.01,
  world: {
    width: 10,
    height: 5,
    depth: 10,
  },
}))

const repellerData = {
  position: new THREE.Vector3(0, 0, 0),
  strength: 1,
  radius: 10,
}

const Wanderer = ({ data, repel }: any) => {
  const [vehicle, api] = useVehicle(data)

  useFrame(() => {
    const seeker = api.wander(20)
    api.applyForce(seeker)

    api.applyRepeller(repel)
  })

  return (
    <mesh ref={vehicle}>
      <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
      <meshPhongMaterial flatShading shininess={8} color='#5ADBFF' />
    </mesh>
  )
}

const Sketch = () => {
  const ref = useRef<THREE.Mesh>(null!)
  const [repeller, api] = useRepeller(repellerData)
  const [mouse, setMouse] = useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))

  useFrame(({ clock }) => {
    const radius = 5 + (Math.sin(clock.getElapsedTime()) * 0.5 + 0.5) * 5

    api.setRadius(radius)
    api.setPosition(mouse.x, mouse.y, mouse.z)

    ref.current.scale.setScalar(repeller.current.radius)

    const { x, y, z } = repeller.current.position
    ref.current.position.set(x, y, z)
  })

  return (
    <>
      {vehicleData.map((d, i) => (
        <Wanderer key={`seeker-${i}`} data={d} repel={api.repel} />
      ))}
      <mesh ref={ref}>
        <sphereBufferGeometry args={[1, 8, 8]} />
        <meshBasicMaterial wireframe />
      </mesh>
      <mesh
        rotation={[-Math.PI * 0.5, 0, 0]}
        onPointerMove={(e) => setMouse(e.point)}
      >
        <planeBufferGeometry args={[100, 100, 10, 10]} />
        <meshBasicMaterial color='white' wireframe />
      </mesh>
    </>
  )
}

export default Sketch
