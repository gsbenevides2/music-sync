

export function setCssVars(colors: Array<[string, string]>) {
  const r = document.querySelector(':root') as any
  colors.forEach(color => {
    const name = color[0]
    const colorHex = color[1]
    r.style.setProperty(`--app-color-${name}`, colorHex)
  })
}
