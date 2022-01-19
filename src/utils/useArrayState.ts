import React from 'react'

interface Options<T> {
  initialState: T[]
  orderingFunction?: (array: T[]) => T[]
  equalsFunction?: (a: T, b: T) => boolean
}

export interface Returned<T> {
  value: T[]
  set: React.Dispatch<React.SetStateAction<T[]>>
  append: (appendArray: T[]) => void
  delete: (value: T) => void
}

export function useArrayState<T>(options: Options<T>): Returned<T> {
  const [value, setValue] = React.useState<T[]>(options.initialState)

  const append = React.useCallback((appendArray: T[]) => {
    setValue(value => {
      let newArray = [...value]

      if (options.equalsFunction !== undefined) {
        for (const appendValue of appendArray) {
          const indexTest = newArray.findIndex(value =>
            options.equalsFunction?.(value, appendValue)
          )
          if (indexTest === -1) newArray.push(appendValue)
          else newArray[indexTest] = appendValue
        }
      } else {
        newArray = [...newArray, ...appendArray]
      }

      if (options.orderingFunction) {
        return options.orderingFunction(newArray)
      } else return newArray
    })
  }, [])

  const deleteValue = React.useCallback((value: T) => {
    setValue(array => {
      return array.filter(test => {
        if (options.equalsFunction) {
          if (options.equalsFunction(value, test) === false) {
            return test
          } else return null
        } else return test
      })
    })
  }, [])

  return { value, set: setValue, append, delete: deleteValue }
}
