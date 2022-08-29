import * as THREE from "three"

interface particle {
  position: THREE.Vector3
  acceleration: THREE.Vector3
  velocity: THREE.Vector3
  maxSpeed: number
  maxForce: number
  wanderTheta: number
  edges: {
    width: number
    height: number
    depth: number
  }
}

//@ts-ignore
const map = (value, start1, stop1, start2, stop2) =>
  ((value - start1) / (stop1 - start1)) * stop2 - start2

const useParticle = (particle: particle) => {
  const {
    position,
    acceleration,
    velocity,
    maxSpeed,
    maxForce,
    wanderTheta,
    edges,
  } = particle

  const upper = new THREE.Vector3(maxSpeed, maxSpeed, maxSpeed)
  const lower = upper.clone().multiplyScalar(-1)

  const applyForce = (force: THREE.Vector3) => acceleration.add(force)

  const updatePosition = () => {
    velocity.add(acceleration)
    velocity.clamp(lower, upper)
    position.add(velocity)
    acceleration.multiplyScalar(0)
  }

  const seek = (target: THREE.Vector3, arrival = false) => {
    let force = target.clone()
    force = force.sub(position)

    let desiredSpeed = maxSpeed
    const r = 1

    if (arrival) {
      let slowRadius = 2
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

  const arrive = (target: THREE.Vector3) => seek(target, true)

  const wander = (theta: number) => {
    const wanderPoint = velocity.clone()
    wanderPoint.setLength(10)
    wanderPoint.add(position)

    const wanderRadius = 10
    const x = wanderRadius * Math.cos(theta)
    const z = wanderRadius * Math.sin(theta)

    wanderPoint.add(new THREE.Vector3(x, 0, z))
    const steer = wanderPoint.sub(position)
    steer.setLength(maxForce)

    return steer
  }

  const checkEdges = () => {
    const { width, height, depth } = edges

    /* prettier-ignore */
    if (position.x < 0) applyForce(new THREE.Vector3(maxSpeed, velocity.y, velocity.z).sub(velocity).clamp(lower, upper))

    /* prettier-ignore */
    if (position.x > width) applyForce(new THREE.Vector3(-maxSpeed, velocity.y, velocity.z).sub(velocity).clamp(lower, upper))

    /* prettier-ignore */
    if (position.y < 0) applyForce(new THREE.Vector3(velocity.x, maxSpeed, velocity.z).sub(velocity).clamp(lower, upper))

    /* prettier-ignore */
    if (position.y > height) applyForce(new THREE.Vector3(velocity.x, -maxSpeed, velocity.z).sub(velocity).clamp(lower, upper))

    /* prettier-ignore */
    if (position.z < 0) applyForce(new THREE.Vector3(velocity.x, velocity.y, maxSpeed).sub(velocity).clamp(lower, upper))

    /* prettier-ignore */
    if (position.z > depth) applyForce(new THREE.Vector3(velocity.x, velocity.y, -maxSpeed).sub(velocity).clamp(lower, upper))
  }

  return {
    position,
    applyForce,
    updatePosition,
    seek,
    arrive,
    wander,
    checkEdges,
  }
}

export default useParticle
