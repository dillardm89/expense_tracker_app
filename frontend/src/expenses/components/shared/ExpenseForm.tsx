import { useState, ChangeEvent } from 'react'
import Input from '../../../shared/components/elements/Input'
import CategoryPicker from './CategoryPicker'
import { type ExpenseItemType, ExpenseType } from '../../../utils/types/expense-types'
import type { OnInputType } from '../../../utils/types/shared-types'
import { expenseVendorValidator, expenseAmountValidator, expenseDescriptionValidator, expenseSpendDateValidator } from '../../../utils/forms/expenses/expense-validators'


/**
 * ExpenseFormProps
 * @typedef {object} ExpenseFormProps
 * @property {function} onSelectCategory callback function to handle category selection
 * @property {object} expenseInfo (optional) ExpenseItemType object containing information
 *                          for existing expense to be edited
 */
type ExpenseFormProps = OnInputType & {
    onSelectCategory: (categoryId: string) => void,
    expenseInfo?: ExpenseItemType
}


/**
 * Component for rendering form to add / edit expense
 * Props passed down from ExpenseModal
 * @param {object} ExpenseFormProps
 * @returns {React.JSX.Element}
 */
export default function ExpenseForm({ expenseInfo, onInput, onSelectCategory }: ExpenseFormProps): React.JSX.Element {
    const [selectType, setSelectType] = useState<string>(
        expenseInfo ? expenseInfo.type.toString() : '1')


    return (
        <div className='expense-form-div'>
            <Input
                element='input' fieldId='spend-date' name='spend-date'
                type='date' label='Date' onInput={onInput}
                initialValue={expenseInfo ? expenseInfo.spendDate.split('T')[0] :
                    new Date().toISOString().split('T')[0]}
                selectedValidators={expenseSpendDateValidator}
                errorText='Enter a valid date (Jan 1, 2020 - Dec 31, 2050).'
            />

            <Input
                name='vendor' fieldId='vendor' label='Vendor'
                element='input' selectedValidators={expenseVendorValidator}
                errorText='Please enter a valid vendor (2-100 characters).'
                onInput={onInput} type='text'
                initialValue={expenseInfo ? expenseInfo.vendor : ''}
            />

            <Input
                element='textarea' fieldId='description' name='description'
                label='Description' onInput={onInput}
                initialValue={expenseInfo ? expenseInfo.description : ''}
                selectedValidators={expenseDescriptionValidator}
                errorText='Enter a valid description (2-250 characters).'
            />

            <Input
                name='amount' fieldId='amount' label='Amount'
                element='input' selectedValidators={expenseAmountValidator}
                errorText='Please enter a positive number (max 10 digits, 2 decimals).' onInput={onInput}
                type='number' min={0.01} max={99999999.99} step={0.01}
                initialValue={expenseInfo ? expenseInfo.amount.toString() : '0.01'}
            />


            <div className='form-input-fields'>
                <div className="input-label">
                    <p>Expense Type</p>
                </div>

                <div className='input-select-div'>
                    <select className='input-field' id='type' name='type'
                        value={selectType}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => setSelectType(event.target.value)}
                    >
                        <option value={ExpenseType.Deposit.toString()} >
                            Deposit
                        </option>
                        <option value={ExpenseType.Withdrawal.toString()} >
                            Withdrawal
                        </option>
                    </select>
                </div>
            </div>

            <div className='form-input-fields'>
                <div className="input-label">
                    <p>Category</p>
                </div>

                <CategoryPicker
                    categoryId={expenseInfo ? expenseInfo.category! : '0'}
                    onSelectCategory={onSelectCategory}
                />
            </div>
        </div>
    )
}
