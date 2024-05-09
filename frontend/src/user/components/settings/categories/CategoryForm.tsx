import { useState, ChangeEvent } from 'react'
import { ColorResult, SketchPicker } from 'react-color'
import Button from '../../../../shared/components/elements/Button'
import Input from '../../../../shared/components/elements/Input'
import { categoryNameValidator, categoryBudgetValidator } from '../../../../utils/forms/expenses/expense-validators'
import { CategoryItemType, CategoryType } from '../../../../utils/types/category-types'
import type { OnInputType } from '../../../../utils/types/shared-types'
import '../../../../../public/styles/settings/categories/category-form.css'


/**
 * CategoryFormProps
 * @typedef {object} CategoryFormProps
 * @property {object} categoryInfo (optional) CategoryItemType object containing information
 *                          for existing category to be edited
 */
type CategoryFormProps = OnInputType & {
    categoryInfo?: CategoryItemType
}


/**
 * Component for rendering form to add / edit category
 * Props passed down from CategoryModal
 * @param {object} CategoryFormProps
 * @returns {React.JSX.Element}
 */
export default function CategoryForm({ categoryInfo, onInput }: CategoryFormProps): React.JSX.Element {
    const [showColorSelect, setShowColorSelect] = useState<boolean>(false)
    const [selectColor, setSelectColor] = useState<string>(
        categoryInfo ? categoryInfo.displayColor : '#000000')
    const [selectType, setSelectType] = useState<string>(
        categoryInfo ? categoryInfo.type.toString() : '0')


    /** Function to handle updating selected color */
    const handleCancelColor = (): void => {
        const oldColor: string = categoryInfo ? categoryInfo.displayColor : '#000000'
        setSelectColor(oldColor)
        setShowColorSelect(false)
    }


    return (
        <div className='category-form-div'>
            <Input
                name='name' fieldId='name' label='Category Name'
                element='input' selectedValidators={categoryNameValidator}
                errorText='Please enter a valid name (2-50 characters).'
                onInput={onInput} type='text'
                initialValue={categoryInfo ? categoryInfo.name : ''}
            />

            <Input
                name='budget' fieldId='budget' label='Monthly Budget'
                element='input' selectedValidators={categoryBudgetValidator}
                errorText='Please enter a positive number (max 10 digits, 2 decimals).' onInput={onInput}
                type='number' min={0.01} max={99999999.99} step={0.01}
                initialValue={categoryInfo ? categoryInfo.budget.toString() : '0.01'}
            />

            <div className='form-input-fields'>
                <div className="input-label">
                    <p>Display Color</p>
                </div>

                <div className='input-select-div'>
                    <input type='hidden' name='display-color' value={selectColor} />
                    {!showColorSelect && (
                        <div className='input-field' id='display-color'
                            style={{ backgroundColor: `${selectColor}` }}
                            onClick={() => setShowColorSelect(true)}>
                        </div>)}
                    {showColorSelect && (
                        <div className='color-select-field' id='display-color'>
                            <SketchPicker
                                color={selectColor}
                                onChangeComplete={(color: ColorResult) => setSelectColor(color.hex)}
                            />
                            <div className='select-color-buttons'>
                                <Button classId='modal-save-btn'
                                    onClick={() => setShowColorSelect(false)}>
                                    Ok
                                </Button>

                                <Button classId='modal-close-btn'
                                    onClick={handleCancelColor}>
                                    Cancel
                                </Button>
                            </div>
                        </div>)}
                </div>
            </div>

            <div className='form-input-fields'>
                <div className="input-label">
                    <p>Category Type</p>
                </div>

                <div className='input-select-div'>
                    <select className='input-field' id='type' name='type'
                        value={selectType}
                        onChange={(event: ChangeEvent<HTMLSelectElement>) => setSelectType(event.target.value)}
                    >
                        <option value={CategoryType.Income.toString()} >
                            Income
                        </option>
                        <option value={CategoryType.Expense.toString()} >
                            Expense
                        </option>
                    </select>
                </div>
            </div>
        </div>
    )
}
