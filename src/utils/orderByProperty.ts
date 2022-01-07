export function orderByPropety<T>(value: T[], key: keyof T): T[] {
  value.sort((a, b) => {
    if (a[key] > b[key]) {
      return 1
    }
    if (a[key] < b[key]) {
      return -1
    }
    // a must be equal to b
    return 0
  })
  return value
}
