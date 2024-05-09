import { useCallback, useState } from 'react'
import { blankExpenseFormState as expenseForm } from '../../utils/forms/blank-form-values'
import { blankCategoryFormState as categoryForm } from '../../utils/forms/blank-form-values'
import { blankExportDataFormState as exportForm } from '../../utils/forms/blank-form-values'
import type { FormState } from '../../utils/types/shared-types'


/** Custom useForm hook for handling forms and form state */
export function useForm() {
    const [formState, setFormState] = useState<FormState>({ inputs: [], isValid: true })


    /**
     * Callback function to initialize formState based current form displayed
     * @param {string} type object name ('category', 'export-data', or 'expense')
    */
    const initializeFormState = useCallback((type: string): void => {
        if (type == 'category') {
            setFormState(categoryForm)
        } else if (type == 'export-data') {
            setFormState(exportForm)
        } else {
            setFormState(expenseForm)
        }
    }, [])


    /**
     * Callback function to handle updating formState upon changes to input field
     * @param {string} name
     * @param {string} value
     * @param {boolean} isValid
    */
    const inputHandler = useCallback((name: string, value: string, isValid: boolean): void => {
        let formisValid = true
        const tempFormState = []
        for (const formItem of formState.inputs) {
            if (name !== formItem.name) {
                tempFormState.push({ ...formItem })
                continue
            } else {
                formItem.value = value.trim()
                formItem.isValid = isValid
                tempFormState.push({ ...formItem })
                formisValid = formisValid && isValid
            }
            setFormState({
                inputs: tempFormState,
                isValid: formisValid
            })
        }
    }, [formState, setFormState])


    /** Callback function to validate entire form
     * @param {FormData} formData
     * @returns {boolean}
     */
    const validateForm = useCallback((formData: FormData): boolean => {
        let formIsValid = true
        for (const formItem of formState.inputs) {
            const value = formData.get(formItem.name)!.toString()
            if (formItem.value == '') {
                if (value != '') {
                    // formData not blank for edit existing item (isValid = true)
                    formIsValid = formIsValid && true
                } else if (value == '' && formItem.isValid == true) {
                    // formData blank but form field not required (isValid = true)
                    formIsValid = formIsValid && true
                }
            } else if (formItem.value != value && value == '') {
                // Verifying no old form data still held in state
                // Old form data held in state but input field is blank (isValid = false)
                formIsValid = formIsValid && false
            } else {
                // No special exceptions, validate normally
                formIsValid = formIsValid && formItem.isValid
            }
        }
        setFormState({
            inputs: [
                ...formState.inputs
            ],
            isValid: formIsValid
        })
        return formIsValid
    }, [formState, setFormState])


    /** Callback function to handle clearing formState */
    const clearFormState = useCallback((): void => {
        setFormState({
            inputs: [],
            isValid: true
        })
    }, [setFormState])


    return { inputHandler, validateForm, clearFormState, initializeFormState }
}
