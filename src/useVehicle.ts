import * as THREE from "three"
import { random, map } from "./utils"

interface vehicleProps {
  position: THREE.Vector3
  acceleration: THREE.Vector3
  velocity: THREE.Vector3
  latitude: number
  longitude: number
  maxSpeed: number
  maxForce: number
  wanderTheta: number
  edges: {
    width: number
    height: number
    depth: number
  }
}

const useVehicle = (particle: vehicleProps) => {
  let {
    position,
    acceleration,
    velocity,
    maxSpeed,
    maxForce,
    latitude,
    longitude,
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

  const separateVehicles = (vehicles: any[]) => {
    let steer = new THREE.Vector3(0, 0, 0)
    const sumOfDistances = new THREE.Vector3(0, 0, 0)
    let numberOfCloseVehicles = 0
    const desiredSeparation = 1

    vehicles.forEach((v) => {
      const distanceToVehicle = position.clone().sub(v.position).length()

      if (distanceToVehicle > 0 && distanceToVehicle < desiredSeparation) {
        const distance = position.clone().sub(v.position)
        distance.normalize()
        distance.divideScalar(distanceToVehicle)
        sumOfDistances.add(distance)
        numberOfCloseVehicles++
      }
    })

    if (numberOfCloseVehicles > 0) {
      sumOfDistances.divideScalar(numberOfCloseVehicles)
      sumOfDistances.setLength(maxSpeed)

      steer = sumOfDistances.clone().sub(velocity)
      steer.clamp(lower, upper)
    }

    return steer
  }

  const wander = (radius: number) => {
    const wanderPoint = velocity.clone()
    wanderPoint.setLength(10)
    wanderPoint.add(position)

    const wanderRadius = radius
    const x = wanderRadius * Math.sin(latitude) * Math.cos(longitude)
    const y = wanderRadius * Math.sin(latitude) * Math.sin(longitude)
    const z = wanderRadius * Math.cos(latitude)

    wanderPoint.add(new THREE.Vector3(x, y, z))
    const direction = wanderPoint.sub(position)
    direction.setLength(maxForce)

    latitude += random(-0.3, 0.3)
    longitude += random(-0.3, 0.3)

    return direction
  }

  const repeatEdges = () => {
    const { width, height, depth } = edges

    /* prettier-ignore */
    if (position.x < 0) position.setX(width)

    /* prettier-ignore */
    if (position.x > width) position.setX(0)

    /* prettier-ignore */
    if (position.y < 0) position.setY(height)

    /* prettier-ignore */
    if (position.y > height) position.setY(0)

    /* prettier-ignore */
    if (position.z < 0) position.setZ(depth)

    /* prettier-ignore */
    if (position.z > depth) position.setZ(0)
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
    velocity,
    applyForce,
    updatePosition,
    seek,
    arrive,
    wander,
    checkEdges,
    separateVehicles,
    repeatEdges,
  }
}

export { useVehicle }
export type { vehicleProps }
