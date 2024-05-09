import { useState } from 'react'
import { useExpenseContext } from '../../../context/expense-context/expense-context'
import Button from '../../../shared/components/elements/Button'
import Modal from '../../../shared/components/elements/Modal'
import DetailItem from './DetailItem'
import { type ExpenseItemType } from '../../../utils/types/expense-types'
import sortIcon from '../../../assets/icons/general-sort-icon.png'
import '../../../../public/styles/expense/detail-modal.css'


/**
 * DetailModalProps
 * @typedef {object} DetailModalProps
 * @property {string} name category name
 * @property {string} color category display color
 * @property {number} amount total of expense amount for current month and category
 * @property {number} budget category budget
 * @property {number} percent amount as percent of budget
 * @property {boolean} overBudget whether amount exceeds budget
 * @property {boolean} openModal determines whether to display modal
 * @property {object} expenses array of objects with expenses data (ExpenseItemType)
 * @property {function} onCloseModal callback function to handle closing modal
 */
type DetailModalProps = {
    name: string,
    color: string,
    amount: number,
    percent: number,
    budget: number,
    overBudget: boolean,
    openModal: boolean,
    expenses: ExpenseItemType[],
    onCloseModal: () => void
}


/**
 * Component for rending modal with category expense details for current month
 * Props passed down from GraphItem
 * @param {object} DetailModalProps
 * @returns {React.JSX.Element}
 */
export default function DetailModal({ name, color, amount, percent, budget, expenses, overBudget, openModal, onCloseModal }: DetailModalProps): React.JSX.Element {
    const { setNeedRefresh } = useExpenseContext()

    const [sortOrder, setSortOrder] = useState<boolean>(true)


    /**
     * Function to handle closing modal
     * @param {string} type action type 'close' or 'save'
     */
    const handleCloseModal = (type: string): void => {
        document.querySelector('body')!.id = ''
        if (type == 'save') {
            setNeedRefresh(true)
        }
        onCloseModal()
    }


    /** Function to handle sorting expenses by vendor */
    const handleSortString = (): void => {
        setSortOrder((prevMode) => !prevMode)
        if (sortOrder) {
            expenses.sort((a, b) => a.vendor!.toLowerCase().localeCompare(b.vendor!.toLowerCase()))
        } else {
            expenses.sort((b, a) => a.vendor!.toLowerCase().localeCompare(b.vendor!.toLowerCase()))
        }
    }


    /** Function to handle sorting expenses by date field */
    const handleSortDate = (): void => {
        setSortOrder((prevMode) => !prevMode)
        if (sortOrder) {
            expenses.sort((a, b) => Date.parse(a.spendDate) - Date.parse(b.spendDate))
        } else {
            expenses.sort((b, a) => Date.parse(a.spendDate) - Date.parse(b.spendDate))
        }
    }



    /** Function to handle sorting expenses by amount field */
    const handleSortNumber = (): void => {
        setSortOrder((prevMode) => !prevMode)
        if (sortOrder) {
            expenses.sort((a, b) => a.amount - b.amount)
        } else {
            expenses.sort((b, a) => a.amount - b.amount)
        }
    }


    return (
        <Modal openModal={openModal} specialClass='expense-detail-modal'
            onCloseModal={() => handleCloseModal('close')}>
            <div id='info-modal'>
                <div className='detail-modal-heading'>
                    <h3>Category Details: {name}</h3>
                    <Button classId='close-detail-btn' type='button'
                        onClick={() => handleCloseModal('close')}>X</Button>
                </div>

                <div className='detail-modal-div'>
                    <div className='detail-modal-graph'
                        style={{ "--category-percent": `${percent}`, "--category-color": `${color}` } as React.CSSProperties}></div>
                    <p className='detail-graph-text' id={overBudget ? 'over-budget' : 'under-budget'}
                        style={{ width: '84px', height: '44px', textAlign: 'center' }}>
                        {percent}%
                    </p>

                    <div className='detail-modal-summary'>
                        <p className='summary-heading'>Current Month Summary</p>
                        <p className='summary-spent'>
                            Spent: {amount.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </p>
                        <p className='summary-budget' id={overBudget ? 'over-budget' : 'under-budget'}>
                            Budget: {budget.toLocaleString("en-US", { style: "currency", currency: "USD" })}
                        </p>
                    </div>
                </div>

                <div className='detail-modal-activity'>
                    <div className='detail-activity-heading'>
                        <div className='sort-detail-div' id='date'>
                            <p id='date'>Date</p>
                            <img className='sort-icon' src={sortIcon} alt='sort arrow icon'
                                onClick={() => handleSortDate()}
                            />
                        </div>

                        <div className='sort-detail-div' id='vendor'>
                            <p id='vendor'>Vendor</p>
                            <img className='sort-icon' src={sortIcon} alt='sort arrow icon'
                                onClick={() => handleSortString()}
                            />
                        </div>

                        <div className='sort-detail-div' id='amount'>
                            <p id='amount'>Amount</p>
                            <img className='sort-icon' src={sortIcon} alt='sort arrow icon'
                                onClick={() => handleSortNumber()}
                            />
                        </div>

                        <div className='sort-detail-div' id='type'>
                            <p id='type'>Type</p>
                        </div>
                    </div>
                    <div className='detail-list-div'>
                        {expenses.length == 0 && (
                            <p className='detail-no-expenses'>No expenses for current month.</p>
                        )}

                        {expenses.length > 0 && (
                            <ul className='detail-scroller'>
                                {expenses.map((expense, index) => (
                                    <DetailItem key={index} expense={expense}
                                        onModifyExpense={() => handleCloseModal('save')} />))}
                            </ul>)}
                    </div>
                </div>
            </div>
        </Modal >
    )
}
