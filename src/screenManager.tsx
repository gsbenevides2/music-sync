import React from 'react'

type ContextType = React.Dispatch<React.SetStateAction<string>> | null
const ScreensContext = React.createContext<ContextType>(null)
interface ScreenProps {
    name:string
    children:React.ReactNode
}
export const Screen = ({children}:ScreenProps)=>{
        return (<>{children}</>)
    
}

export function ScreensContextProvider({ children}:{children:React.ReactNode}) {
    const [actualScreen, setActualScreen] = React.useState<string>('')
    function loadScreenByAuth() {
        const sessionId = localStorage.getItem('sessionId')
        const token = localStorage.getItem('token')
        if (!sessionId || !token) {
            setActualScreen('Home')
        } else {
            setActualScreen('Dashboard')
        }
    }
    React.useEffect(() => {
        loadScreenByAuth()
    },[])
    return (
        <ScreensContext.Provider value={setActualScreen}>
            {React.Children.map(children, (child, index) => {
                if (React.isValidElement<ScreenProps>(child)) {

                    return <div key={index.toString()} className={child.props.name === actualScreen ? 'block' : 'hidden'}>{React.cloneElement(child)}</div>
                } else
                    return <div key={index.toString()}></div>
            })}
        </ScreensContext.Provider>
    )
}

export function useScreenManager(){
    return  React.useContext(ScreensContext) as React.Dispatch<React.SetStateAction<string>>
}