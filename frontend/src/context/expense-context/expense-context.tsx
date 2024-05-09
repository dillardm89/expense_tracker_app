import { useContext } from 'react'
import { ExpenseContext } from './create-context'
import type { ExpenseContextValue } from '../../utils/types/expense-types'


/**
 * Custom context hook for task manager related values and callback functions
 * @returns {object}
 */
export function useExpenseContext(): ExpenseContextValue {
    const context = useContext(ExpenseContext)

    if (!context) {
        throw new Error('useExpenseContext must be used within an ExpenseContextProvider.')
    }
    return context
}
