import React from "react";

export function useArrayState<T>(initialState:T[]):[
    T[],
    React.Dispatch<React.SetStateAction<T[]>>,
    (appendArray: T[], equalsFunction: (a: T, b: T) => boolean) => void
]{
    const [array,setArray] =  React.useState<T[]>(initialState)

    const appendToArray = React.useCallback((appendArray:T[],equalsFunction:(a:T,b:T)=>boolean)=>{
        setArray(array=>{
        const newArray = [...array]
        for(const appendValue of appendArray){
            const indexTest = newArray.findIndex(value=>equalsFunction(value,appendValue))
            if(indexTest === -1){
                newArray.push(appendValue)
            }else {
                newArray[indexTest] = appendValue
            }
        }
        return newArray
    })
    },[])
    
    return [array,setArray,appendToArray]
}