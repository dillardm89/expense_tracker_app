import { useState, useEffect } from 'react'
import { useExpenseContext } from '../../../context/expense-context/expense-context'
import { useManageCategory } from '../../../hooks/dashboard/categories/category-hook'
import { type CategoryItemType, CategoryType } from '../../../utils/types/category-types'
import GraphItem from './GraphItem'
import GraphTotalItem from './GraphTotalItem'
import '../../../../public/styles/expense/expense-graph.css'


/**
 * ExpenseGraphProps
 * @typedef {object} ExpenseGraphProps
 * @property {boolean} needLoadData determines whether graph should be refreshed
 * @property {function} onRefreshComplete callback function to finish refreshing data
 */
type ExpenseGraphProps = {
    needLoadData: boolean,
    onRefreshComplete: () => void
}


/**
 * Component for rendering graph of user monthly budget progress
 * @param {object} ExpenseGraphProps
 * @returns {React.JSX.Element}
 */
export default function ExpenseGraph({ needLoadData, onRefreshComplete }: ExpenseGraphProps): React.JSX.Element {
    const { needRefresh, setNeedRefresh } = useExpenseContext()
    const { loadCategoryData } = useManageCategory()

    const [categoryData, setCategoryData] = useState<CategoryItemType[]>([])
    const [noCategoryData, setNoCategoryData] = useState<boolean>(false)
    const [totalBudgetExpenses, setTotalBudgetExpenses] = useState<number>(0)
    const [totalBudgetIncome, setTotalBudgetIncome] = useState<number>(0)
    const [incomeCategories, setIncomeCategories] = useState<string[]>([])
    const [componentKey, setComponentKey] = useState<number>(0)


    useEffect(() => {
        // useEffect to load user categories data from API
        const getCategoryData = async (): Promise<void> => {
            const response = await loadCategoryData()
            if (response.length == 0) {
                setNoCategoryData(true)
            } else {
                setNoCategoryData(false)
            }
            const data = response
            data.push({
                name: 'Uncategorized',
                type: 1,
                budget: 0,
                displayColor: '#FFFFFF',
                category_id: '0'
            })
            setCategoryData(data)
            calculateTotalBudget(response)
        }

        /**
         * Function to calculate total expenses of category budgets
         * (income budget items excluded)
         * @param {[object]} categories array of objects (CategoryItemType)
         */
        const calculateTotalBudget = (categories: CategoryItemType[]): void => {
            let totalBudgetExpenses: number = 0
            let totalBudgetIncome: number = 0
            const incomeArray: string[] = []
            for (const category of categories) {
                let expense: number = 0
                let income: number = 0
                if (category.type == CategoryType.Income) {
                    incomeArray.push(category.category_id!)
                    income = +category.budget
                } else {
                    expense = +category.budget
                }
                totalBudgetExpenses += expense
                totalBudgetIncome += income
            }
            const finalTotalExpenses = Math.abs(totalBudgetExpenses)
            const finalTotalIncome = Math.abs(totalBudgetIncome)
            setTotalBudgetExpenses(finalTotalExpenses)
            setTotalBudgetIncome(finalTotalIncome)
            setIncomeCategories(incomeArray)
        }

        if (needLoadData && needRefresh) {
            getCategoryData()
            onRefreshComplete()
            setNeedRefresh(false)
            setComponentKey(1)
        }
    }, [loadCategoryData, needLoadData, needRefresh, setNeedRefresh, onRefreshComplete])


    return (<>
        <div className='expense-graph-heading'>
            <h2>Current Month Budget Progress</h2>
        </div>

        <div className='expense-graph-list'>
            <div className='graph-list-heading'>
                <h4 id='category' >Category</h4>
                <h4 id='spent' >Spent</h4>
                <h4 id='progress' >Progress</h4>
                <h4 id='budget'>Budget</h4>
            </div>

            {noCategoryData && (
                <div className='no-expenses-div'>
                    <p>No budget categories found. Click to add some.</p>
                </div>
            )}

            {!noCategoryData && (<>
                <div className='total-expense-div'>
                    <ul key={(componentKey + 1)} className='expense-graph-ul' id='total-budget'>
                        <GraphTotalItem totalBudgetExpenses={totalBudgetExpenses}
                            totalBudgetIncome={totalBudgetIncome}
                            incomeCategories={incomeCategories} />
                    </ul>
                </div>

                <div className='scroller'>
                    <ul key={componentKey} className='expense-graph-ul'>
                        {categoryData.map((category, index) => (
                            <GraphItem key={index} categoryData={category}
                                incomeCategories={incomeCategories}
                            />
                        ))}
                    </ul>
                </div>
            </>)}
        </div>
    </>)
}
