import { ChangeEvent, useEffect, useState } from 'react'
import type { InputState } from '../../../utils/types/shared-types'
import { validateInput } from '../../../utils/forms/validation/validate-input'
import type { OnInputType, ValidatorType } from '../../../utils/types/shared-types'
import { REQUIRED_VALIDATOR } from '../../../utils/forms/validation/validators'
import '../../../../public/styles/components/input.css'


/**
 * InputProps
 * @typedef {object} InputProps
 * @property {string} name field name attribute
 * @property {string} fieldId CSS id attribute
 * @property {string} label field label attribute
 * @property {string} element type to render either input or textarea
 * @property {array} selectedValidators array of ValidatorType callback functions
 * @property {string} errorText text to display if field validation fails
 * @property {string} placeholder (optional) field placeholder text attribute
 * @property {string} initialValue (optional) field starting value
 * @property {string} type (optional) input field type attribute (ex: text, password, file)
 * @property {number} rows (optional) rows to display for textarea input type
 * @property {number} step (optional) increment amuount for number input type
 * @property {number} min (optional) smallest value allowed for number input type
 * @property {number} max (optional) largest value allowed for number input type
 * @property {boolean} disabled (optional) whether field is editable
 */
type InputProps = OnInputType & {
    name: string,
    fieldId: string,
    label: string,
    element: 'input' | 'textarea',
    selectedValidators: ValidatorType[],
    errorText: string,
    placeholder?: string,
    initialValue?: string,
    type?: string,
    rows?: number,
    step?: number,
    min?: number,
    max?: number,
    disabled?: boolean,
}


/**
 * Component for rendering input or textarea form element
 * Props passed down from various components
 * @param {object} InputProps
 * @returns {React.JSX.Element}
 */
export default function Input({ name, label, fieldId, element, errorText, selectedValidators, onInput, initialValue, placeholder, ...props }: InputProps): React.JSX.Element {
    const [inputState, setInputState] = useState<InputState>({
        value: '', isTouched: false, isValid: true
    })


    /**
     * Function to handle date time conversion for input field and form validation
     * @param {ChangeEvent<HTMLInputElement>} event
     */
    const dateChangeHandler = (event: ChangeEvent<HTMLInputElement>): void => {
        const dateInputValue: string = event.target.value
        if (dateInputValue == '') { return }

        const dateStringValue: string = new Date((dateInputValue + 'T00:00:00')).toISOString()
        const isValid: boolean = validateInput(dateStringValue, selectedValidators)
        setInputState({
            value: dateStringValue,
            isTouched: false,
            isValid: isValid
        })
    }


    /**
     * Function to handle, validate, and set state with input field during changes
     * @param {ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event
     */
    const changeHandler = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
        if (props.disabled) { return }
        const value = event.target.value.trim()
        if (value == '' && !selectedValidators.includes(REQUIRED_VALIDATOR())) {
            setInputState({
                value: value, isTouched: false, isValid: true
            })
            return
        }

        const fieldIsValid = validateInput(value, selectedValidators)
        setInputState({
            value: value, isTouched: false, isValid: fieldIsValid
        })
    }


    /** Function to handle, validate, and set state for input field after changes */
    const touchHandler = (): void => {
        if (props.disabled) { return }

        setInputState({
            value: inputState.value, isTouched: true, isValid: inputState.isValid
        })
        onInput(name, inputState.value, inputState.isValid)
    }


    /** Function to determining component type to render */
    const elementType = element == 'input' ? (
        <input
            id={fieldId} name={name} placeholder={placeholder}
            className={props.disabled == true ? 'read-only-input-div' : 'input-field'}
            value={props.type == 'date' ? inputState.value.split('T')[0] : inputState.value}
            onBlur={touchHandler}
            onChange={props.type == 'date' ? dateChangeHandler : changeHandler}
            type={props.type}
            disabled={props.disabled}
        />
    ) : (
        <textarea
            id={fieldId} name={name} value={inputState.value}
            className={props.disabled == true ? 'read-only-input-div' : 'input-text-area'}
            onChange={changeHandler} onBlur={touchHandler}
            disabled={props.disabled} {...props}
        ></textarea>
    )


    useEffect(() => {
        // useEffect to load initial values and run validation
        if (initialValue) {
            const isValid = validateInput(initialValue, selectedValidators)
            setInputState({
                value: initialValue, isTouched: true, isValid: isValid
            })
        }
    }, [initialValue, props.disabled, selectedValidators, name])


    return (
        <div className='form-input-fields'>
            <label className='input-label' htmlFor={fieldId}>{label}</label>

            <div className='input-error-div'>
                {elementType}

                {(!inputState.isValid && inputState.isTouched && !props.disabled) && (
                    <p className='error-label'>{errorText}</p>
                )}
            </div>
        </div>)
}
