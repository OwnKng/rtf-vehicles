import { useFrame } from "@react-three/fiber"
import * as THREE from "three"
import { useVehicles } from "./hooks/useVehicles"
import { random } from "./utils"
import { applyForce, wander } from "./utils/vehicle"

const vehicleData = Array.from({ length: 40 }, () => ({
  position: new THREE.Vector3(random(0, 10), random(0, 10), random(0, 10)),
  acceleration: new THREE.Vector3(0, 0, 0),
  velocity: new THREE.Vector3(0, 0, 0),
  maxSpeed: 0.2,
  maxForce: 0.01,
  latitude: 0,
  longitude: 0,
  world: {
    width: 20,
    height: 20,
    depth: 20,
  },
}))

const Sketch = () => {
  const [vehicles, { at }] = useVehicles(vehicleData)

  useFrame(() => {
    const force = wander(20, at(10))
    applyForce(force, at(10))
  })

  return (
    <>
      <instancedMesh
        //@ts-ignore
        ref={vehicles}
        args={[undefined, undefined, 40]}
      >
        <cylinderBufferGeometry args={[0, 0.5, 2, 3]} />
        <meshPhongMaterial flatShading shininess={1} color='#5ADBFF' />
      </instancedMesh>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[40, 40, 5, 5]} />
        <meshBasicMaterial wireframe />
      </mesh>
    </>
  )
}

export default Sketch
