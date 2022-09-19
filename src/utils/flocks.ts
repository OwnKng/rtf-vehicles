// const separateVehicles = (vehicles: any[]) => {
//   let steer = new THREE.Vector3(0, 0, 0)
//   const sumOfDistances = new THREE.Vector3(0, 0, 0)
//   let numberOfCloseVehicles = 0
//   const desiredSeparation = 0.5

//   vehicles.forEach((v) => {
//     const distanceToVehicle = position.clone().sub(v.position).length()

//     if (distanceToVehicle > 0 && distanceToVehicle < desiredSeparation) {
//       const distance = position.clone().sub(v.position)
//       distance.normalize()
//       distance.divideScalar(distanceToVehicle)
//       sumOfDistances.add(distance)
//       numberOfCloseVehicles++
//     }
//   })

//   if (numberOfCloseVehicles > 0) {
//     sumOfDistances.divideScalar(numberOfCloseVehicles)
//     sumOfDistances.setLength(maxSpeed)

//     steer = sumOfDistances.clone().sub(velocity)
//     steer.clamp(lower, upper)
//   }

//   return steer
// }

// const alignVehicles = (vehicles: vehicleProps[]) => {
//   let steer = new THREE.Vector3(0, 0, 0)
//   const neighbourhoodDistance = 5
//   const sumOfVelocity = new THREE.Vector3(0, 0, 0)

//   let numberOfCloseVehicles = 0

//   vehicles.forEach((v) => {
//     const distanceToVehicle = position.clone().sub(v.position).length()

//     if (distanceToVehicle > 0 && distanceToVehicle < neighbourhoodDistance) {
//       sumOfVelocity.add(v.velocity)
//       numberOfCloseVehicles++
//     }
//   })

//   if (numberOfCloseVehicles > 0) {
//     sumOfVelocity.divideScalar(vehicles.length)
//     sumOfVelocity.setLength(maxSpeed)

//     steer = sumOfVelocity.clone().sub(velocity)
//     steer.clamp(lower, upper)
//   }

//   return steer
// }

// const cohereVehicles = (vehicles: vehicleProps[]) => {
//   let steer = new THREE.Vector3(0, 0, 0)
//   const neighbourhoodDistance = 5
//   const sumOfLocations = new THREE.Vector3(0, 0, 0)

//   let numberOfCloseVehicles = 0

//   vehicles.forEach((v) => {
//     const distanceToVehicle = position.clone().sub(v.position).length()

//     if (distanceToVehicle > 0 && distanceToVehicle < neighbourhoodDistance) {
//       sumOfLocations.add(v.position)
//       numberOfCloseVehicles++
//     }
//   })

//   if (numberOfCloseVehicles > 0) {
//     sumOfLocations.divideScalar(vehicles.length)

//     steer = seek(sumOfLocations)
//   }

//   return steer
// }

export default (f: any) => f
