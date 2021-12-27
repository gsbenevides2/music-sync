const defaultColors = [
  ['50', '238,242,255'],
  ['100', '244,231,255'],
  ['200', '199,210,254'],
  ['300', '165,180,252'],
  ['400', '129,140,248'],
  ['500', '99,102,241'],
  ['600', '79,70,229'],
  ['700', '67,56,202'],
  ['800', '55,48,163'],
  ['900', '49,46,129']
]
const lock = '900'
const colorLock = defaultColors.find(color => color[0] === lock) as string[]
const difference = defaultColors.map((color, index) => {
  const colorName = color[0]
  const colorRGB = color[1]
  if (colorName === lock) return [lock, '0,0,0']
  else {
    const color600Rgb = colorLock[1].split(',').map(Number)
    const difference = colorRGB
      .split(',')
      .map(Number)
      .map((value, index) => {
        const value600 = color600Rgb[index]
        if (value600 >= value) {
          return value600 - value
        } else return value - value600
      })
      .join(',')
    return [colorName, difference]
  }
})

export function generateNewColorPallete(newColor: string) {
  const rgbNewColor = newColor.split(',').map(Number)
  return difference.map(color => {
    const colorName = color[0]
    const colorRGB = color[1].split(',').map(Number)
    if (colorName === lock) return [lock, newColor]
    const newGeneratedColor = colorRGB
      .map((color, index) => {
        if (Number(colorName) < 600) {
          return rgbNewColor[index] + color
        } else {
          return rgbNewColor[index] - color
        }
      })
      .map(color => {
        if (color > 255) return 255
        else if (color < 0) return 0
        else return color
      })
      .join(',')
    return [colorName, newGeneratedColor]
  })
}
