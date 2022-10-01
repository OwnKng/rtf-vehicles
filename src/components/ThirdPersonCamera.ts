import { useFrame } from "@react-three/fiber"
import * as THREE from "three"

const calculateIdealOffset = (
  position: THREE.Vector3,
  rotation: THREE.Quaternion
) => {
  const idealOffset = new THREE.Vector3(-3, 8, -15)
  idealOffset.applyQuaternion(rotation)
  idealOffset.add(position)

  return idealOffset
}

const calculateIdealLookat = (
  position: THREE.Vector3,
  rotation: THREE.Quaternion
) => {
  const idealOffset = new THREE.Vector3(0, 5, 10)
  idealOffset.applyQuaternion(rotation)
  idealOffset.add(position)

  return idealOffset
}

const ThirdPersonCamera = ({ target }: any) =>
  useFrame(({ camera }) => {
    const { position, quaternion } = target.current

    const idealOffset = calculateIdealOffset(position, quaternion)

    camera.position.lerp(idealOffset, 0.05)
    const futurePosition = calculateIdealLookat(position, quaternion)
    camera.lookAt(futurePosition)
  })

export default ThirdPersonCamera
