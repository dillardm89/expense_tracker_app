import { useState } from 'react'
import { ExpenseType, type ExpenseItemType } from '../../../utils/types/expense-types'
import ExpenseModal from '../shared/ExpenseModal'


/**
 * DetailItemProps
 * @typedef {object} DetailItemProps
 * @property {object} expense objects with expense data (ExpenseItemType)
 * @property {function} onModifyExpense callback function to handle modifying expenses
 */
type DetailItemProps = {
    expense: ExpenseItemType,
    onModifyExpense: () => void
}


/**
 * Component for rendering item for category details
 * Props passed down from DetailModal
 * @param {object} DetailItemProps
 * @returns {React.JSX.Element}
 */
export default function DetailItem({ expense, onModifyExpense }: DetailItemProps): React.JSX.Element {
    const [openExpenseModal, setOpenExpenseModal] = useState<boolean>(false)


    /**
     * Function to handle closing modal
     * @param {string} type either 'save' or 'cancel' for close action
     */
    const handleCloseModal = (type: string): void => {
        if (type == 'save') {
            onModifyExpense()
        }
        setOpenExpenseModal(false)
    }


    return (<>
        {openExpenseModal && (
            <ExpenseModal
                openModal={openExpenseModal}
                onCloseModal={handleCloseModal}
                expenseInfo={expense} heading='Edit Expense' modalType='edit'
            />)}

        <li className='detail-list-item'
            onClick={() => setOpenExpenseModal(true)}
        >
            <p className='detail-date'>{expense.spendDate.split('T')[0]}</p>
            <p className='detail-vendor'>{expense.vendor}</p>
            <p className='detail-amount'>{expense.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
            <p className='detail-type'>{ExpenseType[expense.type]}</p>
        </li>

    </>
    )
}
