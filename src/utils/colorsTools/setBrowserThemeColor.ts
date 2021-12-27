export function setBrowserThemeColor(color: string) {
  const e = document.querySelector(
    'meta[name="theme-color"]'
  ) as HTMLMetaElement
  e.setAttribute('content', color)
}
