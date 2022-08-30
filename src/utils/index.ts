export const random = (min: number, max: number) =>
  (max - min) * Math.random() + min

export const map = (
  value: number,
  start1: number,
  stop1: number,
  start2: number,
  stop2: number
) => ((value - start1) / (stop1 - start1)) * stop2 - start2
