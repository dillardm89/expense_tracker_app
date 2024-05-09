import type { ValidatorType } from '../../types/shared-types'


/**
 * Function for validating input fields based on set parameters, returns isValid = boolean
 * Params passed down from Login, Register, or Input
 * @param {string} value string containing input field value
 * @param {array} validators array of ValidatorType callback functions
 * @returns {boolean}
 */
export function validateInput(value: string, validators: ValidatorType[]): boolean {
    let isValid = true
    for (const validator of validators) {
        if (validator.type == 'REQUIRED') {
            isValid = isValid && value.trim().length > 0
        }

        if (validator.type == 'MIN_LENGTH') {
            isValid = isValid && value.trim().length >= validator.value!
        }

        if (validator.type == 'MAX_LENGTH') {
            isValid = isValid && value.trim().length <= validator.value!
        }

        if (validator.type == 'MIN_VALUE') {
            isValid = isValid && +value >= validator.value!
        }

        if (validator.type == 'MAX_VALUE') {
            isValid = isValid && +value <= validator.value!
        }

        if (validator.type == 'MIN_DATE') {
            const userDate = Date.parse(value)
            const validDate = validator.value!
            const dateValid = (userDate >= validDate)
            isValid = isValid && dateValid
        }

        if (validator.type == 'MAX_DATE') {
            const userDate = Date.parse(value)
            const validDate = validator.value!
            const dateValid = (userDate <= validDate)
            isValid = isValid && dateValid
        }

        if (validator.type == 'VALID_CURRENCY') {
            let currencyValid: boolean
            try {
                const checkDecimal = value.split('.')
                if (checkDecimal[1].length <= 2) {
                    currencyValid = true
                } else {
                    currencyValid = false
                }
            } catch (error) {
                currencyValid = true
            }
            isValid = isValid && currencyValid
        }
    }
    return isValid
}
