import { useState } from 'react'
import { useResponseHandler } from '../../../hooks/response-handler/handler-hook'
import { useExpenseContext } from '../../../context/expense-context/expense-context'
import ExpenseModal from '../shared/ExpenseModal'
import AlertModal from '../../../shared/components/elements/AlertModal'
import ConfirmDeleteModal from '../../../shared/components/elements/ConfirmDeleteModal'
import type { AlertStateType } from '../../../utils/types/shared-types'
import { ExpenseType, type ExpenseItemType } from '../../../utils/types/expense-types'
import { blankAlert } from '../../../utils/forms/user/user-values'
import editIcon from '../../../assets/icons/edit_icon.png'
import deleteIcon from '../../../assets/icons/delete_icon.png'


/**
 * ExpenseItemProps
 * @typedef {object} ExpenseItemProps
 * @property {object} expenseInfo ExpenseItemType object containing information
 *                          for existing expense
 */
type ExpenseItemProps = {
    expenseInfo: ExpenseItemType,
}


/**
 * Component for rending individual expense item in list
 * Props passed down from ExpenseActivity
 * @param {object} ExpenseItemProps
 * @returns {React.JSX.Element}
 */
export default function ExpenseItem({ expenseInfo }: ExpenseItemProps): React.JSX.Element {
    const { setNeedRefresh } = useExpenseContext()
    const { deleteHandler } = useResponseHandler()

    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [alertContent, setAlertContent] = useState<AlertStateType>(blankAlert)


    /**
     * Function to handle closing modal
     * @param {string} type either 'alert' or 'delete' for modal type
     */
    const handleCloseModal = (type: string): void => {
        document.querySelector('body')!.id = ''
        if (type == 'delete') {
            setOpenDeleteModal(false)
        } else {
            setOpenAlert(false)
        }
    }


    /** Function to handle deleting Expense */
    const handleDeleteExpense = async (): Promise<void> => {
        const handlerType = 'expense'
        const response = await deleteHandler(expenseInfo.expense_id!, handlerType)
        if (response.status != 200) {
            setAlertContent({
                type: response.type!,
                message: response.message!,
                heading: response.heading!
            })
        } else {
            setNeedRefresh(true)
        }
        document.querySelector('body')!.id = ''
        setOpenDeleteModal(false)
    }


    /**
     * Function to handle closing modal and updating expense data if needed
     * @param {string} action
     */
    const handleCloseExpenseModal = (action: string): void => {
        document.querySelector('body')!.id = ''
        setOpenEditModal(false)
        if (action == 'save') {
            setNeedRefresh(true)
        }
    }


    return (<>
        {openAlert && (
            <AlertModal openModal={openAlert} onClear={() => handleCloseModal('alert')}
                heading={alertContent.heading} type={alertContent.type}
                message={alertContent.message}
            />)}

        {openEditModal && (
            <ExpenseModal openModal={openEditModal} onCloseModal={handleCloseExpenseModal}
                expenseInfo={expenseInfo} heading='Edit Expense' modalType='edit'
            />)}

        {openDeleteModal && (
            <ConfirmDeleteModal openModal={openDeleteModal} typeString='expense'
                onCloseModal={() => handleCloseModal('delete')}
                onConfirmDelete={handleDeleteExpense}
            />)}

        <li className='expense-list-item' >
            <p className='expense-item-date'>{expenseInfo.spendDate.split('T')[0]}</p>
            <p className='expense-item-vendor'>{expenseInfo.vendor}</p>
            <p className='expense-item-amount'>{expenseInfo.amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
            <p className='expense-item-type'>{ExpenseType[expenseInfo.type]}</p>
            <p className='expense-item-category'>{expenseInfo.category_name}</p>

            <div className='expense-icons-div'>
                <img className='edit-expense-icon' src={editIcon} alt='edit icon'
                    onClick={() => setOpenEditModal(true)}
                />
                <img className='delete-expense-icon' src={deleteIcon} alt='delete icon'
                    onClick={() => setOpenDeleteModal(true)}
                />
            </div>
        </li >
    </>)
}
