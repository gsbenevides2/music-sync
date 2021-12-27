export function removeSpecialCaractersAndSpaces(txt: string): string {
  const result = txt
    .replace(/[^a-zA-Z ]/g, '')
    .replace(/ /g, '')
    .toLowerCase()
  return result
}
