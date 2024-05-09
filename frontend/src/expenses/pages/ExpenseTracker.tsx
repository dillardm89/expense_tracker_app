import { useEffect, useState } from 'react'
import { useManageExpense } from '../../hooks/expenses/expense-hook'
import { useExpenseContext } from '../../context/expense-context/expense-context'
import ExpenseActivity from '../components/transaction-history/ExpenseActivity'
import ExpenseGraph from '../components/progress-graph/ExpenseGraph'
import type { ExpenseItemType } from '../../utils/types/expense-types'
import '../../../public/styles/expense/expense-tracker.css'


/**
 * Page for user settings / profile
 * @returns {React.JSX.Element}
 */
export default function ProfileSettings(): React.JSX.Element {
    const { needRefresh, setNeedRefresh } = useExpenseContext()
    const { loadExpenseData } = useManageExpense()

    const [expenseData, setExpenseData] = useState<ExpenseItemType[]>([])
    const [noExpenseData, setNoExpenseData] = useState<boolean>(false)
    const [needGraphRefresh, setNeedGraphRefresh] = useState<boolean>(false)


    useEffect(() => {
        // useEffect to load user expenses data from API
        const getExpenseData = async (): Promise<void> => {
            const expenseType = 'all'
            const response = await loadExpenseData(expenseType)
            if (response.length == 0) {
                setNoExpenseData(true)
                setExpenseData([])
            } else {
                setNoExpenseData(false)
                setExpenseData(response)
            }
        }
        if (needRefresh) {
            getExpenseData()
            setNeedGraphRefresh(true)
        }
    }, [loadExpenseData, needRefresh, setNeedRefresh])


    return (<>
        <div className='graph-div' id={noExpenseData ? 'no-expenses-found' : 'expenses-exist'}>
            <div className='expense-graph-container'>
                <ExpenseGraph needLoadData={needGraphRefresh}
                    onRefreshComplete={() => setNeedGraphRefresh(false)} />
            </div>
        </div>

        <div className='activity-div' id={noExpenseData ? 'no-expenses-found' : 'expenses-exist'}>
            <div className='expense-activity-container'>
                <ExpenseActivity expenseData={expenseData} />
            </div>
        </div>
    </>)
}
