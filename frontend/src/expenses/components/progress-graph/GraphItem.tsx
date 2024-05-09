import { useState, useEffect } from 'react'
import { useManageExpense } from '../../../hooks/expenses/expense-hook'
import { ExpenseType, type ExpenseItemType } from '../../../utils/types/expense-types'
import { CategoryItemType } from '../../../utils/types/category-types'
import DetailModal from './DetailModal'


/**
 * GraphItemProps
 * @typedef {object} GraphItemProps
 * @property {object} categoryData object containing category data (CategorygraphType)
 * @property {string[]} incomeCategories array of category ID's of type 'Income'
 */
type GraphItemProps = {
    categoryData: CategoryItemType,
    incomeCategories: string[]
}


/**
 * Component for rending individual budget graph item in list
 * Props passed down from ExpenseGraph
 * @param {object} GraphItemProps
 * @returns {React.JSX.Element}
 */
export default function GraphItem({ categoryData, incomeCategories }: GraphItemProps): React.JSX.Element {
    const { loadExpensebyCategory } = useManageExpense()

    const [expenseData, setExpenseData] = useState<ExpenseItemType[]>([])
    const [spendAmount, setSpendAmount] = useState<number>(0)
    const [percent, setPercent] = useState<number>(0)
    const [overBudget, setOverBudget] = useState<boolean>(false)
    const [openDetailModal, setOpenDetailModal] = useState<boolean>(false)

    /** Function to handle closing modal */
    const handleCloseModal = (): void => {
        document.querySelector('body')!.id = ''
        setOpenDetailModal(false)
    }


    useEffect(() => {
        // useEffect to load user expenses data from API
        const getExpenseData = async (): Promise<void> => {
            // Load user expenses for current month by category
            const type = 'current'
            const response = await loadExpensebyCategory(categoryData.category_id!, type)
            if (response.length != 0) {
                setExpenseData(response)
                calculateSpendAmount(response)
            }
        }

        /**
         * Function to calculate total of expense amounts
         * @param {[object]} expenses array of objects (ExpenseItemType)
         */
        const calculateSpendAmount = (expenses: ExpenseItemType[]): void => {
            let totalSpent: number = 0
            for (const expense of expenses) {
                let amount: number
                if (incomeCategories.includes(expense.category!)) {
                    if (expense.type == ExpenseType.Deposit) {
                        amount = +expense.amount
                    } else {
                        amount = -expense.amount
                    }
                } else {
                    if (expense.type == ExpenseType.Deposit) {
                        amount = -expense.amount
                    } else {
                        amount = +expense.amount
                    }
                }
                totalSpent += amount
            }
            setSpendAmount(totalSpent)
            calculatePercentSpend(totalSpent)
        }

        /**
         * Function to calculate amount spent as percent of category budget
         * @param {number} totalSpent array of objects (ExpenseItemType)
         */
        const calculatePercentSpend = (totalSpent: number): void => {
            const budget = categoryData.budget
            if (totalSpent >= budget) {
                setPercent(100)
                setOverBudget(true)
            } else {
                const percent = Math.floor((totalSpent / budget) * 100)
                if (percent < 0) {
                    setPercent(0)
                } else {
                    setPercent(percent)
                }
                setOverBudget(false)
            }
        }

        getExpenseData()
    }, [loadExpensebyCategory, categoryData, incomeCategories])


    return (<>
        {openDetailModal && (
            <DetailModal name={categoryData.name} amount={spendAmount}
                percent={percent} budget={categoryData.budget} overBudget={overBudget}
                expenses={expenseData} color={categoryData.displayColor}
                openModal={openDetailModal} onCloseModal={handleCloseModal}
            />)}

        <li className='expense-graph-item' id='clickable' onClick={() => setOpenDetailModal(true)}>
            <p className='expense-graph-category'>{categoryData.name}</p>

            <p className='expense-graph-spent'>
                {spendAmount.toLocaleString("en-US", {
                    style: "currency", currency: "USD",
                    minimumFractionDigits: 0, maximumFractionDigits: 0
                })}
            </p>

            <div className='expense-graph-progress'>
                <div className={percent == 0 ? 'progress-bar-div-empty' : 'progress-bar-div'}
                    id={overBudget ? 'over-budget' : 'under-budget'}
                    style={{
                        backgroundColor: `${categoryData.displayColor}`,
                        width: `${percent}%`
                    }}>
                </div>
            </div>

            <p className='expense-graph-budget' id={overBudget ? 'over-budget' : 'under-budget'}>
                {categoryData.budget.toLocaleString("en-US", {
                    style: "currency", currency: "USD",
                    minimumFractionDigits: 0, maximumFractionDigits: 0
                })}
            </p>
        </li >
    </>
    )
}
