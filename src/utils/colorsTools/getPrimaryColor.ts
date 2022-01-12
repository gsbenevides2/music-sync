import { colors, Paletts } from './colorsPallete'

type Returned = {
  // eslint-disable-next-line no-unused-vars
  [key in Paletts]: string
}

export function getPrimaryColor(): Returned {
  const entries = Object.keys(colors).map(key => {
    const color = colors[key as Paletts]['600']
    return [key, color]
  })
  return Object.fromEntries(entries)
}
