import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useExpenseContext } from '../../../context/expense-context/expense-context'
import Button from '../../../shared/components/elements/Button'
import ActivityItem from './ActivityItem'
import ExpenseModal from '../shared/ExpenseModal'
import type { ExpenseItemType } from '../../../utils/types/expense-types'
import sortIcon from '../../../assets/icons/general-sort-icon.png'
import '../../../../public/styles/expense/expense-activity.css'
import ImportCSV from './ImportCSV'
import ExportCSV from './ExportCSV'


/**
 * ExpenseActivityProps
 * @typedef {object} ExpenseActivityProps
 * @property {array} expenseData ExpenseItemType array of objects containing information
 *                          for existing expenses
 */
type ExpenseActivityProps = {
    expenseData: ExpenseItemType[],
}


/**
 * Component for managing list of user expenses
 * Props passed down from ExpenseTracker
 * @param {object} ExpenseActivityProps
 * @returns {React.JSX.Element}
 */
export default function ExpenseActivity({ expenseData }: ExpenseActivityProps): React.JSX.Element {
    const { setNeedRefresh } = useExpenseContext()

    const [openModal, setOpenModal] = useState<boolean>(false)
    const [sortOrder, setSortOrder] = useState<boolean>(true)
    const [noExpenseData, setNoExpenseData] = useState<boolean>(false)
    const [openImportModal, setOpenImportModal] = useState<boolean>(false)
    const [openExportModal, setOpenExportModal] = useState<boolean>(false)


    /**
     * Function to handle sorting expenses by vendor or category
     * @param {string} sortField field name for sorting (field value must be a string)
     */
    const handleSortString = (sortField: string): void => {
        setSortOrder((prevMode) => !prevMode)
        if (sortOrder) {
            expenseData.sort((a, b) => a[sortField as keyof ExpenseItemType]!.toString().toLowerCase().localeCompare(b[sortField as keyof ExpenseItemType]!.toString().toLowerCase()))
        } else {
            expenseData.sort((b, a) => a[sortField as keyof ExpenseItemType]!.toString().toLowerCase().localeCompare(b[sortField as keyof ExpenseItemType]!.toString().toLowerCase()))
        }
    }


    /** Function to handle sorting expenses by date field */
    const handleSortDate = (): void => {
        setSortOrder((prevMode) => !prevMode)
        if (sortOrder) {
            expenseData.sort((a, b) => Date.parse(a.spendDate) - Date.parse(b.spendDate))
        } else {
            expenseData.sort((b, a) => Date.parse(a.spendDate) - Date.parse(b.spendDate))
        }
    }


    /** Function to handle sorting expenses by amount field */
    const handleSortNumber = (): void => {
        setSortOrder((prevMode) => !prevMode)
        if (sortOrder) {
            expenseData.sort((a, b) => a.amount - b.amount)
        } else {
            expenseData.sort((b, a) => a.amount - b.amount)
        }
    }


    /**
     * Function to handle closing modal and updating expense data if needed
     * @param {string} action
     * @param {string} type either 'expense', 'import', or 'export' for modal type
     */
    const handleCloseModal = (action: string, type: string): void => {
        document.querySelector('body')!.id = ''
        if (action == 'save') {
            setNeedRefresh(true)
        }

        if (type == 'expense') {
            setOpenModal(false)
        } else if (type == 'import') {
            setOpenImportModal(false)
        } else {
            setOpenExportModal(false)
        }
    }


    useEffect(() => {
        // useEffect to display message if no expense data
        if (expenseData.length == 0) {
            setNoExpenseData(true)
        } else {
            setNoExpenseData(false)
        }
    }, [expenseData])


    return (<>
        {openModal && (
            <ExpenseModal openModal={openModal} onCloseModal={handleCloseModal}
                heading='Add Expense' modalType='add'
            />)}

        {openImportModal && (
            <ImportCSV openModal={openImportModal} onCloseModal={handleCloseModal}
            />)}

        {openExportModal && (
            <ExportCSV openModal={openExportModal} onCloseModal={handleCloseModal}
            />)}

        <div className='expense-activity-heading'>
            <h2>Transaction History</h2>

            <div className='expense-activity-actions'>
                <Button classId='add-expense-btn' type='button' onClick={() => setOpenModal(true)}>
                    Add Expense
                </Button>
                <NavLink className='add-expense-link' to='/settings'>
                    Add Category
                </NavLink>
            </div>
        </div>

        <div className='expense-activity-list'>
            <div className='expense-list-heading'>
                <div className='sort-expenses-div' id='date'>
                    <h4 className='expense-heading' >Date</h4>
                    <img src={sortIcon} alt='sort arrow icon'
                        onClick={() => handleSortDate()}
                    />
                </div>

                <div className='sort-expenses-div' id='vendor'>
                    <h4 className='expense-heading' >Vendor</h4>
                    <img src={sortIcon} alt='sort arrow icon'
                        onClick={() => handleSortString('vendor')}
                    />
                </div>

                <div className='sort-expenses-div' id='amount'>
                    <h4 className='expense-heading' >Amount</h4>
                    <img src={sortIcon} alt='sort arrow icon'
                        onClick={() => handleSortNumber()}
                    />
                </div>

                <div className='sort-expenses-div' id='type'>
                    <h4 className='expense-heading'>Type</h4>
                    <img src={sortIcon} alt='sort arrow icon'
                        onClick={() => handleSortString('category')}
                    />
                </div>

                <div className='sort-expenses-div' id='category'>
                    <h4 className='expense-heading' >Category</h4>
                    <img src={sortIcon} alt='sort arrow icon'
                        onClick={() => handleSortString('category')}
                    />
                </div>

                <div className='expense-icons-heading'>
                    <h4>Actions</h4>
                </div>
            </div>

            {noExpenseData && (
                <div className='no-expenses-div'>
                    <p>No expense history found. Click to add some.</p>
                </div>
            )}

            <div className='scroller'>
                <ul className='expense-list-ul'>
                    {expenseData.map((expense, index) => (
                        <ActivityItem key={index} expenseInfo={expense} />
                    ))}
                </ul>
            </div>

            <div className='csv-button-div'>
                <Button classId='csv-btn' type='button'
                    onClick={() => setOpenImportModal(true)}>
                    Bulk Import
                </Button>

                <Button classId='csv-btn' type='button'
                    onClick={() => setOpenExportModal(true)}>
                    Export to File
                </Button>
            </div>
        </div>
    </>)
}
