import React from "react"

export const getSetting = (key:string) =>{
    return localStorage.getItem(key) === 'true'
}

export const getSettingString = (key:string) =>{
    return localStorage.getItem(key)
}
export const setSetting = (key:string,value:string) =>{
    return localStorage.setItem(key,value)
}

type UseSetting = [
    boolean,
    React.Dispatch<React.SetStateAction<boolean>>,
    ()=>void
]

export const useSetting = (key:string):UseSetting=>{
    const [setting,setSetting] = React.useState(false)
    const toogleSetting = React.useCallback(()=>{
        localStorage.setItem(key, String(!setting))
        setSetting(!setting)
    },[setting])
    React.useEffect(()=>{
        setSetting(getSetting(key))
    },[])
    return [setting,setSetting,toogleSetting]
}