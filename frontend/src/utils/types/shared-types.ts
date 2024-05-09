/**
 * AlertStateType
 * @typedef {object} AlertStateType
 * @property {string} type AlertModal type to display, either success, error, or info
 * @property {string} message message to display in AlertModal
 * @property {string} heading heading to display in AlertModal
 */
export type AlertStateType = {
    type: 'error' | 'info' | 'success',
    message: string,
    heading: string
}


/**
 * InfoModalProps
 * @typedef {object} InfoModalProps
 * @property {boolean} openModal whether to display or hide modal
 * @property {function} onClear callback function for handling closing modal
 */
export type InfoModalProps = {
    openModal: boolean,
    onClear: () => void
}


/**
 * OnInputType
 * @typedef {object} OnInputType
 * @property {function} onInput callback function for handling input field value changes
 */
export type OnInputType = {
    onInput: (id: string, value: string, isValid: boolean) => void
}


/**
 * ValidatorType
 * @typedef {object} ValidatorType
 * @property {string} type validator callback function name
 * @property {number} value (optional) value used in callback function
 */
export type ValidatorType = {
    type: string,
    value?: number
}


/**
 * InputState
 * @typedef {object} InputState
 * @property {string} value input field value
 * @property {boolean} isTouched whether field selected (touched)
 * @property {boolean} isValid whether input field passes validation
 */
export type InputState = {
    value: string,
    isTouched: boolean,
    isValid: boolean
}


/**
 * FormInputs
 * @typedef {object} FormInputs
 * @property {string} name form field name
 * @property {string} value form field value
 * @property {boolean} isValid whether form field passes validation
 */
export type FormInputs = {
    name: string,
    value: string,
    isValid: boolean
}


/**
 * FormState
 * @typedef {object} FormState
 * @property {array} inputs array of type FormInputs
 * @property {boolean} isValid whether entire form passes validation
 */
export type FormState = {
    inputs: FormInputs[],
    isValid: boolean
}



/**
 * DBResponseType
 * Expected response format for API handler functions
 * @typedef {object} DBResponseType
 * @property {unknown} message response text, object, or array of objects
 * @property {number} status http response code
 * @property {string} token (optional) jwt access_token value
 */
export type DBResponseType = {
    message: unknown,
    status: number,
    token?: string
}


/**
 * HookResponse
 * Expected response format for custom hook functions
 * @typedef {object} HookResponse
 * @property {number} status http response code
 * @property {string} message response message text or array of string data
 */
export type HookResponse = {
    status: number,
    message: string | string[]
}


/**
 * HandlerResponse
 * Expected response format for handler functions used to set AlertModal content
 * @typedef {object} HandlerResponse
 * @property {number} status http response code (determines whether AlertModal gets displayed)
 * @property {string} type (optional) AlertModal type to display, either success, error, or info
 * @property {string} message (optional) message to display in AlertModal
 * @property {string} heading (optional) heading to display in AlertModal
 */
export type HandlerResponse = {
    status: number,
    type?: 'success' | 'error' | 'info',
    message?: string,
    heading?: string,
}
