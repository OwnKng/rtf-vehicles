import { Vector3 } from "three"
import { map, random } from "./index"

export type vehicleType = {
  position: Vector3
  acceleration: Vector3
  velocity: Vector3
  maxSpeed: number
  maxForce: number
  latitude?: number
  longitude?: number
  world?: {
    width: number
    height: number
    depth: number
  }
}

export type wanderType = {
  position: Vector3
  acceleration: Vector3
  velocity: Vector3
  maxSpeed: number
  maxForce: number
  latitude: number
  longitude: number
}

const applyForce = (force: Vector3, vehicle: vehicleType) => {
  vehicle.acceleration.add(force)
  return vehicle
}

const updatePosition = (vehicle: vehicleType) => {
  vehicle.velocity.add(vehicle.acceleration)
  vehicle.position.add(vehicle.velocity)
  vehicle.velocity.clampLength(-vehicle.maxSpeed, vehicle.maxSpeed)
  vehicle.acceleration.multiplyScalar(0)

  return vehicle
}

type repellerType = {
  strength: number
  position: THREE.Vector3
  radius: number
  repel: (vehicle: vehicleType) => THREE.Vector3
}

const applyRepeller = (repeller: repellerType, vehicle: vehicleType) =>
  applyForce(repeller.repel(vehicle), vehicle)

const flee = (target: THREE.Vector3, vehicle: vehicleType) =>
  seek(target, vehicle).multiplyScalar(-1)

const seek = (target: THREE.Vector3, vehicle: vehicleType, arrival = false) => {
  let force = target.clone()
  force = force.sub(vehicle.position)

  let desiredSpeed = vehicle.maxSpeed
  const r = 1

  if (arrival) {
    let slowRadius = 2
    const d = force.length()

    if (d < r) {
      desiredSpeed = map(d, 0, slowRadius, 0, vehicle.maxSpeed)
      force.setLength(desiredSpeed)
    } else {
      force.setLength(vehicle.maxSpeed)
    }
  }

  force.setLength(desiredSpeed)
  force.sub(vehicle.velocity)
  force.clampLength(-vehicle.maxForce, vehicle.maxForce)

  return force
}

const arrive = (target: THREE.Vector3, vehicle: vehicleType) =>
  seek(target, vehicle, true)

const pursue = (target: THREE.Vector3, vehicle: vehicleType) => {
  const { velocity } = vehicle

  return seek(target.clone().add(velocity.clone().multiplyScalar(10)), vehicle)
}

const wander = (radius: number, vehicle: wanderType) => {
  const wanderPoint = vehicle.velocity.clone()
  wanderPoint.setLength(20)
  wanderPoint.add(vehicle.position)

  const wanderRadius = radius
  const x =
    wanderRadius * Math.sin(vehicle.latitude) * Math.cos(vehicle.longitude)
  const y =
    wanderRadius * Math.sin(vehicle.latitude) * Math.sin(vehicle.longitude)
  const z = wanderRadius * Math.cos(vehicle.latitude)

  wanderPoint.add(new Vector3(x, y, z))
  const direction = wanderPoint.sub(vehicle.position)
  direction.setLength(vehicle.maxForce)

  vehicle.latitude += random(-0.2, 0.2)
  vehicle.longitude += random(-0.2, 0.2)

  return direction
}

type dimensionsType = {
  width: number
  height: number
  depth: number
}

const avoidEdges = (dimensions: dimensionsType, vehicle: vehicleType) => {
  const { position, maxSpeed, velocity, maxForce } = vehicle
  const { width, height, depth } = dimensions

  if (position.x < -width * 0.5) {
    const desired = new Vector3(maxSpeed, velocity.y, velocity.z)
    const steer = desired.sub(velocity)
    steer.clampLength(-maxForce, maxForce)

    applyForce(steer, vehicle)
  }

  if (position.x > width * 0.5) {
    const desired = new Vector3(-maxSpeed, velocity.y, velocity.z)
    const steer = desired.sub(velocity)
    steer.clampLength(-maxForce, maxForce)

    applyForce(steer, vehicle)
  }

  if (position.y < -height * 0.5) {
    const desired = new Vector3(velocity.x, maxSpeed, velocity.z)
    const steer = desired.sub(velocity)
    steer.clampLength(-maxForce, maxForce)

    applyForce(steer, vehicle)
  }

  if (position.y > height * 0.5) {
    const desired = new Vector3(velocity.x, -maxSpeed, velocity.z)
    const steer = desired.sub(velocity)
    steer.clampLength(-maxForce, maxForce)

    applyForce(steer, vehicle)
  }

  if (position.z < -depth * 0.5) {
    const desired = new Vector3(velocity.x, velocity.y, maxSpeed)
    const steer = desired.sub(velocity)
    steer.clampLength(-maxForce, maxForce)

    applyForce(steer, vehicle)
  }

  if (position.z > depth * 0.5) {
    const desired = new Vector3(velocity.x, velocity.y, -maxSpeed)
    const steer = desired.sub(velocity)
    steer.clampLength(-maxForce, maxForce)

    applyForce(steer, vehicle)
  }

  return vehicle
}

const checkEdges = (
  dimensions: { width: number; height: number; depth: number },
  vehicle: vehicleType
) => {
  const { width, height, depth } = dimensions
  const { position, velocity } = vehicle

  if (position.x < 1 || position.x > width - 1) velocity.x *= -1
  if (position.y < 1 || position.y > height - 1) velocity.y *= -1
  if (position.z < 1 || position.z > depth - 1) velocity.z *= -1

  return vehicle
}

export {
  applyForce,
  updatePosition,
  checkEdges,
  applyRepeller,
  seek,
  arrive,
  wander,
  avoidEdges,
  flee,
  pursue,
}
