import React from 'react'

interface Options<T> {
  initialState: T[]
  orderingFunction?: (array: T[]) => T[]
}

type Returned<T> = [
  T[],
  React.Dispatch<React.SetStateAction<T[]>>,
  (appendArray: T[], equalsFunction: (a: T, b: T) => boolean) => void
]

export function useArrayState<T>(options: Options<T>): Returned<T> {
  const [array, setArray] = React.useState<T[]>(options.initialState)

  const appendToArray = React.useCallback(
    (appendArray: T[], equalsFunction: (a: T, b: T) => boolean) => {
      setArray(array => {
        const newArray = [...array]
        for (const appendValue of appendArray) {
          const indexTest = newArray.findIndex(value =>
            equalsFunction(value, appendValue)
          )
          if (indexTest === -1) {
            newArray.push(appendValue)
          } else {
            newArray[indexTest] = appendValue
          }
        }
        if (options.orderingFunction) {
          return options.orderingFunction(newArray)
        } else return newArray
      })
    },
    []
  )

  return [array, setArray, appendToArray]
}
