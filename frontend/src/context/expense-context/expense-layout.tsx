import { Outlet } from 'react-router-dom'
import { ExpenseContextProvider } from './context-provider'


/**
 * Layout for limiting ExpenseContext Provider to /expenses route
 * @returns {React.JSX.Element}
 */
export default function ExpenseContextLayout(): React.JSX.Element {
    return (
        <ExpenseContextProvider>
            <Outlet />
        </ExpenseContextProvider>
    )
}
