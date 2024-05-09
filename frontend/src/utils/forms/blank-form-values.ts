import type { FormState } from '../types/shared-types'


/**
 * Default used to initialize formState in useForm for expenses
 * Required fields that don't have a default value initialize
 * with 'isValid: false' to force user entries
 */
export const blankExpenseFormState: FormState = {
    inputs: [
        { name: 'vendor', value: '', isValid: false },
        { name: 'description', value: '', isValid: true },
        { name: 'amount', value: '', isValid: true },
        { name: 'category', value: '', isValid: true },
        { name: 'spend-date', value: '', isValid: true }
    ],
    isValid: true
}


/**
 * Default used to initialize formState in useForm for
 * exporting expenses to file
 */
export const blankExportDataFormState: FormState = {
    inputs: [
        { name: 'start-date', value: '', isValid: true },
        { name: 'end-date', value: '', isValid: true }
    ],
    isValid: true
}


/**
 * Default used to initialize formState in useForm for categories
 * Required fields that don't have a default value initialize
 * with 'isValid: false' to force user entries
 */
export const blankCategoryFormState: FormState = {
    inputs: [
        { name: 'name', value: '', isValid: false },
        { name: 'display-color', value: '', isValid: true },
        { name: 'budget', value: '', isValid: true }
    ],
    isValid: true
}
