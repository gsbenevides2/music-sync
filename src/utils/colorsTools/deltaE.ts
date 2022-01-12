export type RGB = [number, number, number]

export function deltaE(rgbA: RGB, rgbB: RGB) {
  let i
  let d = 0

  for (i = 0; i < rgbA.length; i++) {
    d += (rgbA[i] - rgbB[i]) * (rgbA[i] - rgbB[i])
  }
  return Math.sqrt(d)
}
