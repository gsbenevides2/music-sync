import { formatColorPalette } from './colorsPallete'
import { getProximyColor } from './getProximyColor'
import { hexToRgb } from './hexToRgb'
import { setBrowserThemeColor } from './setBrowserThemeColor'
import { setCssVars } from './setCssVars'

export function setAppColor(color: string) {
  const selectedPalette = getProximyColor(hexToRgb(color))
  const colors = formatColorPalette(selectedPalette)
  setCssVars(colors)
  setBrowserThemeColor(colors[6][1])
}
