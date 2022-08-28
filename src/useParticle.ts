import * as THREE from "three"

interface particle {
  position: THREE.Vector2
  acceleration: THREE.Vector2
  velocity: THREE.Vector2
  maxSpeed: number
}

//@ts-ignore
const map = (value, start1, stop1, start2, stop2) =>
  ((value - start1) / (stop1 - start1)) * stop2 - start2

const useParticle = (particle: particle) => {
  const { position, acceleration, velocity, maxSpeed } = particle

  const upper = new THREE.Vector2(maxSpeed, maxSpeed)
  const lower = upper.clone().multiplyScalar(-1)

  const applyForce = (force: THREE.Vector2) => acceleration.add(force)

  const updatePosition = () => {
    velocity.add(acceleration)
    velocity.clamp(lower, upper)
    position.add(velocity)
    acceleration.multiplyScalar(0)
  }

  const seek = (target: THREE.Vector2, arrival = false) => {
    let force = target.clone()
    force = force.sub(position)

    let desiredSpeed = maxSpeed
    const r = 1

    if (arrival) {
      let slowRadius = 100
      const d = force.length()

      if (d < r) {
        desiredSpeed = map(d, 0, slowRadius, 0, maxSpeed)
        force.setLength(desiredSpeed)
      } else {
        force.setLength(maxSpeed)
      }
    }

    force.setLength(desiredSpeed)
    force.sub(velocity)
    force.clamp(lower, upper)

    return force
  }

  const arrive = (target: THREE.Vector2) => seek(target, true)

  return { position, applyForce, updatePosition, seek, arrive }
}

export default useParticle
