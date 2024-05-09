import { useState, ReactNode } from 'react'
import { ExpenseContext } from './create-context'


/**
 * ExpenseContextProviderProps
 * @typedef {object} ExpenseContextProviderProps
 * @property {ReactNode} children
 */
type ExpenseContextProviderProps = {
    children: ReactNode
}


/**
 * Component to set values and callback functions for ExpenseContext Provider
 * @param {object} ExpenseContextProviderProps
 * @returns {React.JSX.Element}
 */
export function ExpenseContextProvider({ children }: ExpenseContextProviderProps): React.JSX.Element {
    const [needRefresh, setNeedRefresh] = useState<boolean>(true)


    const ctxValue = {
        needRefresh,
        setNeedRefresh
    }


    return (
        <ExpenseContext.Provider value={ctxValue}>{children}</ExpenseContext.Provider>
    )
}
