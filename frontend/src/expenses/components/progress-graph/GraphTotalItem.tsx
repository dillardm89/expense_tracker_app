import { useState, useEffect } from 'react'
import { useManageExpense } from '../../../hooks/expenses/expense-hook'
import { ExpenseType, type ExpenseItemType } from '../../../utils/types/expense-types'


/**
 * GraphTotalItemProps
 * @typedef {object} GraphTotalItemProps
 * @property {number} totalBudgetExpenses sum of expense type budgets for all categories
 * @property {number} totalBudgetIncome sum of inocme type budgets for all categories
 * @property {string[]} incomeCategories array of category ID's of type 'Income'
 */
type GraphTotalItemProps = {
    totalBudgetExpenses: number,
    totalBudgetIncome: number,
    incomeCategories: string[]
}


/**
 * Component for rending graph item with total for current month
 * Props passed down from ExpenseGraph
 * @param {object} GraphTotalItemProps
 * @returns {React.JSX.Element}
 */
export default function GraphTotalItem({ totalBudgetExpenses, totalBudgetIncome, incomeCategories }: GraphTotalItemProps): React.JSX.Element {
    const { loadExpenseData } = useManageExpense()

    const [expenseAmount, setExpenseAmount] = useState<number>(0)
    const [incomeAmount, setIncomeAmount] = useState<number>(0)
    const [expensePercent, setExpensePercent] = useState<number>(0)
    const [incomePercent, setIncomePercent] = useState<number>(0)
    const [overExpenseBudget, setOverExpenseBudget] = useState<boolean>(false)
    const [overIncomeBudget, setOverIncoemBudget] = useState<boolean>(false)


    useEffect(() => {
        // useEffect to load user expenses data from API
        const getExpenseData = async (): Promise<void> => {
            const expenseType = 'current'
            const response = await loadExpenseData(expenseType)
            if (response.length != 0) {
                calculateExpenseAmount(response)
            }
        }

        /**
         * Function to calculate total of expense amounts
         * @param {[object]} expenses array of objects (ExpenseItemType)
         */
        const calculateExpenseAmount = (expenses: ExpenseItemType[]): void => {
            let totalBudgetExpenses: number = 0
            let totalBudgetIncome: number = 0
            for (const expense of expenses) {
                let amount: number = 0
                let income: number = 0
                if (incomeCategories.includes(expense.category!)) {
                    if (expense.type == ExpenseType.Deposit) {
                        income = +expense.amount
                    } else {
                        income = -expense.amount
                    }
                } else {
                    if (expense.type == ExpenseType.Deposit) {
                        amount = +expense.amount
                    } else {
                        amount = -expense.amount
                    }
                }
                totalBudgetExpenses += amount
                totalBudgetIncome += income
            }
            const finalTotalExpenses = Math.abs(totalBudgetExpenses)
            const finalTotalIncome = Math.abs(totalBudgetIncome)
            setExpenseAmount(finalTotalExpenses)
            setIncomeAmount(finalTotalIncome)
            calculatePercentBudget(finalTotalExpenses, finalTotalIncome)
        }


        /**
         * Function to calculate amount spent as percent of total budget
         * @param {number} totalExpense array of expense category objects (ExpenseItemType)
         * @param {number} totalIncome array of income category objects (ExpenseItemType)
         */
        const calculatePercentBudget = (totalExpense: number, totalIncome: number): void => {
            // Calcualte percent of expense category budget
            if (totalExpense >= totalBudgetExpenses) {
                setExpensePercent(100)
                setOverExpenseBudget(true)
            } else {
                setOverExpenseBudget(false)
                const percent = Math.floor((totalExpense / totalBudgetExpenses) * 100)
                if (percent < 2) {
                    setExpensePercent(2)
                } else {
                    setExpensePercent(percent)
                }
            }

            // Calcualte percent of income category budget
            if (totalIncome >= totalBudgetIncome) {
                setIncomePercent(100)
                setOverIncoemBudget(true)
            } else {
                setOverIncoemBudget(false)
                const percent = Math.floor((totalIncome / totalBudgetIncome) * 100)
                if (percent < 2) {
                    setIncomePercent(2)
                } else {
                    setIncomePercent(percent)
                }
            }
        }

        getExpenseData()
    }, [loadExpenseData, totalBudgetExpenses, totalBudgetIncome, incomeCategories])


    return (<>
        <li className='expense-graph-item' id='total-budget'>
            <p className='expense-graph-category'>Total Income</p>
            <p className='expense-graph-spent'>
                {incomeAmount.toLocaleString("en-US", {
                    style: "currency", currency: "USD",
                    minimumFractionDigits: 0, maximumFractionDigits: 0
                })}
            </p>
            <div className='expense-graph-progress'>
                <div className={incomePercent == 0 ? 'progress-bar-div-empty' : 'progress-bar-div'}
                    id={overIncomeBudget ? 'over-budget' : 'under-budget'}
                    style={{
                        backgroundColor: '#98fb98',
                        width: `${incomePercent}%`
                    }}>
                </div>
            </div>
            <p className='expense-graph-budget' id={overIncomeBudget ? 'over-budget' : 'under-budget'}>
                {totalBudgetIncome.toLocaleString("en-US", {
                    style: "currency", currency: "USD",
                    minimumFractionDigits: 0, maximumFractionDigits: 0
                })}
            </p>
        </li >

        <li className='expense-graph-item' id='total-budget'>
            <p className='expense-graph-category'>Total Expenses</p>
            <p className='expense-graph-spent'>
                {expenseAmount.toLocaleString("en-US", {
                    style: "currency", currency: "USD",
                    minimumFractionDigits: 0, maximumFractionDigits: 0
                })}
            </p>
            <div className='expense-graph-progress'>
                <div className={expensePercent == 0 ? 'progress-bar-div-empty' : 'progress-bar-div'}
                    id={overExpenseBudget ? 'over-budget' : 'under-budget'}
                    style={{
                        backgroundColor: '#d87093',
                        width: `${expensePercent}%`
                    }}>
                </div>
            </div>
            <p className='expense-graph-budget' id={overExpenseBudget ? 'over-budget' : 'under-budget'}>
                {totalBudgetExpenses.toLocaleString("en-US", {
                    style: "currency", currency: "USD",
                    minimumFractionDigits: 0, maximumFractionDigits: 0
                })}
            </p>
        </li >
    </>
    )
}
