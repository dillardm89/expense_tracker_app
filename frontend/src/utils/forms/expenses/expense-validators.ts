import type { ValidatorType } from '../../types/shared-types'
import { REQUIRED_VALIDATOR, MAXLENGTH_VALIDATOR, MINLENGTH_VALIDATOR, MINVALUE_VALIDATOR, CURRENCY_VALIDATOR, MAXDATE_VALIDATOR, MINDATE_VALIDATOR } from '../validation/validators'


/** Array of callback functions for validating category name input field */
export const categoryNameValidator: ValidatorType[] = [REQUIRED_VALIDATOR(), MINLENGTH_VALIDATOR(2), MAXLENGTH_VALIDATOR(50)]


/** Array of callback functions for validating category budget input field */
export const categoryBudgetValidator: ValidatorType[] = [
    REQUIRED_VALIDATOR(), MINVALUE_VALIDATOR(0.01), MAXLENGTH_VALIDATOR(10), CURRENCY_VALIDATOR()
]


/** Array of callback functions for validating expense vendor input field */
export const expenseVendorValidator: ValidatorType[] = [REQUIRED_VALIDATOR(), MINLENGTH_VALIDATOR(2), MAXLENGTH_VALIDATOR(100)]


/** Array of callback functions for validating expense description textarea field */
export const expenseDescriptionValidator: ValidatorType[] = [MINLENGTH_VALIDATOR(2), MAXLENGTH_VALIDATOR(250)]


/** Array of callback functions for validating expense amount input field */
export const expenseAmountValidator: ValidatorType[] = [
    REQUIRED_VALIDATOR(), MINVALUE_VALIDATOR(0.01), MAXLENGTH_VALIDATOR(10), CURRENCY_VALIDATOR()
]


/** Array of callback functions for validating expense spendDate input field */
export const expenseSpendDateValidator: ValidatorType[] = [
    REQUIRED_VALIDATOR(),
    MINDATE_VALIDATOR(new Date('2020-01-01T00:00:00.000').getTime()),
    MAXDATE_VALIDATOR(new Date('2050-12-31T00:00:00.000').getTime())
]
