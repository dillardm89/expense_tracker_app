// Functions for validating input field values


/**
 * Function to set field as required
 * @callback REQUIRED_VALIDATOR
 * @returns {object}
 */
export const REQUIRED_VALIDATOR = () => ({ type: 'REQUIRED' })


/**
 * Function to set field minimum length
 * @callback MINLENGTH_VALIDATOR
 * @param {number} value number for minimum length required in field
 * @returns {object}
 */
export const MINLENGTH_VALIDATOR = (value: number) => ({
    type: 'MIN_LENGTH',
    value: value
})


/**
 * Function to set field maximum length
 * @callback MAXLENGTH_VALIDATOR
 * @param {number} value number for maximum length required in field
 * @returns {object}
 */
export const MAXLENGTH_VALIDATOR = (value: number) => ({
    type: 'MAX_LENGTH',
    value: value
})


/**
 * Function to set field mininum value
 * @callback MINVALUE_VALIDATOR
 * @param {number} value number for minimum value allowed in field
 * @returns {object}
 */
export const MINVALUE_VALIDATOR = (value: number) => ({
    type: 'MIN_VALUE',
    value: value
})


/**
 * Function to set field maximum value
 * @callback MAXVALUE_VALIDATOR
 * @param {number} value number for maximum value allowed in field
 * @returns {object}
*/
export const MAXVALUE_VALIDATOR = (value: number) => ({
    type: 'MAX_VALUE',
    value: value
})


/**
 * Function to set field mininum date value
 * @callback MINDATE_VALIDATOR
 * @param {number} value number for minimum value allowed in field
 * @returns {object}
 */
export const MINDATE_VALIDATOR = (value: number) => ({
    type: 'MIN_DATE',
    value: value
})


/**
 * Function to set field maximum date value
 * @callback MAXDATE_VALIDATOR
 * @param {number} value number for maximum value allowed in field
 * @returns {object}
*/
export const MAXDATE_VALIDATOR = (value: number) => ({
    type: 'MAX_DATE',
    value: value
})


/**
 * Function to validate field value meets currency requirements
 * @callback CURRENCY_VALIDATOR
 * @returns {object}
 */
export const CURRENCY_VALIDATOR = () => ({ type: 'VALID_CURRENCY' })
