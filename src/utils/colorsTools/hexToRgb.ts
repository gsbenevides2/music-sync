import { RGB } from './deltaE'

export function hexToRgb(hex: string): RGB {
  const position1 = hex.slice(1, 3)
  const position2 = hex.slice(3, 5)
  const position3 = hex.slice(5, 7)
  return [
    parseInt(position1, 16),
    parseInt(position2, 16),
    parseInt(position3, 16)
  ]
}
