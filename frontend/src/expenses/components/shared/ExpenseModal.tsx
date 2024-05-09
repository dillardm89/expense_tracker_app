import { ChangeEvent, useEffect, useState } from 'react'
import { useResponseHandler } from '../../../hooks/response-handler/handler-hook'
import { useForm } from '../../../hooks/form/form-hook'
import Modal from '../../../shared/components/elements/Modal'
import Button from '../../../shared/components/elements/Button'
import ExpenseForm from './ExpenseForm'
import type { ExpenseItemType } from '../../../utils/types/expense-types'
import '../../../../public/styles/expense/expense-form.css'


/**
 * ExpenseModalProps
 * @typedef {object} ExpenseModalProps
 * @property {string} type modal form type, either 'add' or 'edit'
 * @property {boolean} openModal determines whether to display modal
 * @property {function} onCloseModal callback function to handle closing modal
 * @property {object} expenseInfo (optional) ExpenseItemType object containing information
 *                          for existing expense to be edited
 */
type ExpenseModalProps = {
    modalType: 'add' | 'edit',
    openModal: boolean,
    heading: string,
    onCloseModal: (action: string, type: string) => void,
    expenseInfo?: ExpenseItemType
}


/**
 * Component for modal to add / edit expenses
 * Props passed down from ActivityItem, ExpenseActivity, or DetailModal
 * @param {object} ExpenseModalProps
 * @returns {React.JSX.Element}
 */
export default function ExpenseModal({ openModal, heading, onCloseModal, expenseInfo, modalType }: ExpenseModalProps): React.JSX.Element {
    const { inputHandler, validateForm, clearFormState, initializeFormState } = useForm()
    const { createHandler, updateHandler } = useResponseHandler()

    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [selectCategory, setSelectCategory] = useState<string>(
        expenseInfo ? expenseInfo.category! : '0')


    /** Function to handle close modal and clear formState */
    const handleCancelModal = (): void => {
        clearFormState()
        onCloseModal('cancel', 'expense')
    }


    /**
     * Function to handle hook response and error messaging
     * @param {number} status
     */
    const handleResponse = (status: number): void => {
        if (status != 200) {
            setErrorMessage('Invalid Inputs. Please correct and try again.')
            setIsError(true)
        } else {
            setIsError(false)
            clearFormState()
            onCloseModal('save', 'expense')
        }
    }


    /**
     * Function to handle saving new or updated categories
     * @param {ChangeEvent<HTMLFormElement>} event
     */
    const handleSaveExpense = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const formIsValid = validateForm(formData)
        if (!formIsValid) {
            handleResponse(400)
            return
        }

        const vendor = formData.get('vendor')!.toString()
        const description = formData.get('description')!.toString()
        const amount = formData.get('amount')!.toString()
        const type = formData.get('type')!.toString()
        const spendDateValue = formData.get('spend-date')!.toString()
        const spendDate = new Date(spendDateValue + 'T00:00:00.000').toISOString()
        const expenseData: ExpenseItemType = {
            vendor, description,
            amount: parseFloat(amount),
            type: parseInt(type, 10),
            category: selectCategory,
            spendDate
        }

        let response
        const handlerType = 'expense'
        if (modalType == 'add') {
            response = await createHandler(expenseData, handlerType)
        } else {
            expenseData.expense_id = expenseInfo!.expense_id
            response = await updateHandler(expenseData, handlerType)
        }
        handleResponse(response.status)
    }


    useEffect(() => {
        // useEffect to initializing formState
        if (openModal) {
            initializeFormState('expense')
        }
    }, [initializeFormState, openModal])


    return (
        <div
            onInputCapture={e => e.stopPropagation()}
            onBeforeInput={e => e.stopPropagation()}
            onInput={e => e.stopPropagation()}
        >
            <Modal openModal={openModal} onCloseModal={handleCancelModal}
                specialClass='expense-modal'>
                <div id='info-modal'>
                    <h3>{heading}</h3>

                    <div className='expense-modal-form'>
                        {isError && (
                            <p className='modal-form-error'>{errorMessage}</p>
                        )}

                        <form onSubmit={handleSaveExpense}>
                            <ExpenseForm expenseInfo={expenseInfo}
                                onInput={inputHandler}
                                onSelectCategory={(categoryId: string) => setSelectCategory(categoryId)}
                            />

                            <div className="modal-btn-div">
                                <Button type='submit' classId='modal-save-btn'>
                                    Save
                                </Button>

                                <Button onClick={handleCancelModal} type='reset' classId='modal-close-btn'>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal >
        </div >
    )
}
