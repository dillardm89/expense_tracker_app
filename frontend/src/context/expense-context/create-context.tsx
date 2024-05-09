import { createContext } from 'react'
import type { ExpenseContextValue } from '../../utils/types/expense-types'


/** Create custom task context */
export const ExpenseContext = createContext<ExpenseContextValue | null>(null)
