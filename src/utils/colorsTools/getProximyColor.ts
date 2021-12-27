import { Paletts } from './colorsPallete'
import { deltaE, RGB } from './deltaE'
import { getPrimaryColor } from './getPrimaryColor'
import { hexToRgb } from './hexToRgb'

export function getProximyColor(colorReceived: RGB) {
  const primaryColor = getPrimaryColor()
  let proximyColor = ''
  let resultSaved = 200
  const resultsOfTest: Array<[string, number]> = Object.keys(primaryColor).map(
    key => {
      const colorTest = hexToRgb(primaryColor[key as Paletts])
      const result = deltaE(colorReceived, colorTest)

      return [key, result]
    }
  )
  resultsOfTest.forEach(test => {
    const colorName = test[0]
    const result = test[1]
    if (proximyColor === '') {
      proximyColor = colorName
      resultSaved = result
    } else if (resultSaved > result) {
      proximyColor = colorName
      resultSaved = result
    }
  })
  return proximyColor
}
