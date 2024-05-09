import { SetStateAction } from 'react'


/**
 * ExpenseType
 * @typedef {object} ExpenseType
 * Enum representaton of expense type (deposit / withdrawal)
 */
export enum ExpenseType { Deposit, Withdrawal }


/**
 * ExpenseItemType
 * @typedef {object} ExpenseItemType
 * @property {string} vendor
 * @property {string} description
 * @property {number} amount
 * @property {number} type corresponds to ExpenseType enum (0=Deposit, 1=Withdrawal)
 * @property {string} spendDate JS Date in ISO string format
 * @property {string} category (optional) string for category id (field not required)
 * @property {string} category_name (optional) Expense objects coming from API have 'category_name' field if value is not null, but field is removed before updating expenses
 *  * @property {string} user (optional) user id for existing expenses
 * @property {string} expense_id (optional) id for existing expenses
 */
export type ExpenseItemType = {
    vendor: string,
    description: string,
    amount: number,
    type: number,
    spendDate: string,
    category?: string,
    category_name?: string,
    user?: string,
    expense_id?: string
}



/**
 * DBExpenseResponse
 * @typedef {object} DBExpenseResponse
 * @property {string} vendor
 * @property {string} description
 * @property {string} amount
 * @property {number} type corresponds to ExpenseType enum (0=Deposit, 1=Withdrawal)
 * @property {string} spend_date Django datetime ISO string format
 * @property {number} user id for user
 * @property {string} category (optional) string for category id(field not required)
 * @property {string} category_name (optional) Expense objects coming from API have 'category_name' field if value is not null, but field is removed before updating expenses
 * @property {string} date_created (optional) Expense objects coming from API have 'date_created' field, but field must be removed before updating any expenses
 * @property {string} id (optional) Expense objects coming from API have 'id' field
 * @property {string} expense_id (optional) Expense objects being sent to API have 'expense_id' field
 */
export type DBExpenseResponse = {
    vendor: string,
    description: string,
    amount: string,
    type: number,
    spend_date: string,
    user: string,
    category?: string,
    category_name?: string,
    date_created?: string,
    id?: string,
    expense_id?: string
}


/**
 * ExpenseContextValue
 * ExpenseContextProvider values
 * @typedef {object} ExpenseContextValue
 * @property {boolean} needRefresh whether expense tracker requires refresh after changes
 * @property {function} setNeedRefresh callback function to update needRefresh state
 */
export type ExpenseContextValue = {
    needRefresh: boolean,
    setNeedRefresh: React.Dispatch<SetStateAction<boolean>>,
}
