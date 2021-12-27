const fs = require('fs')
const defaultColors = [
  ['50', '#eef2ff'],
  ['100', '#e0e7ff'],
  ['200', '#c7d2fe'],
  ['300', '#a5b4fc'],
  ['400', '#818cf8'],
  ['500', '#6366f1'],
  ['600', '#4f46e5'],
  ['700', '#4338ca'],
  ['800', '#3730a3'],
  ['900', '#312e81']
]
function generateCss() {
  const newColors = defaultColors
  const tags = [
    ['bg', 'background-color'],
    ['text', 'color'],
    ['border', 'border-color']
  ]
  const tons = defaultColors
    .map(color => {
      return `  --app-color-${color[0]}:${color[1].split(',').join(', ')};`
    })
    .join('\n')

  const css = newColors
    .map(color => {
      const ton = color[0]
      const cssTags = tags.map(tag => {
        return `
  .${tag[0]}-app-${ton}{
      ${tag[1]}:var(--app-color-${ton});
  }
  
  .hover\\:${tag[0]}-app-${ton}:hover{
      ${tag[1]}:var(--app-color-${ton});
  }`
      })

      return cssTags.join('')
    })
    .join('')

  return [':root{', tons, '}', css].join('\n')
}
fs.writeFileSync('src/colors.css', generateCss())
