import { useCallback } from 'react'
import { useAPIClient } from '../api/api-hook'
import { useJSON } from '../utils/json-hook'
import type { DBExpenseResponse, ExpenseItemType } from '../../utils/types/expense-types'
import type { HookResponse } from '../../utils/types/shared-types'


/** Custom useManageExpense hook to handle retrieving and updating expense data */
export function useManageExpense() {
    const apiUrl = import.meta.env.VITE_APP_API_URL
    const userId = import.meta.env.VITE_APP_API_USERID
    const urlString = `${apiUrl}/expense`

    const { sendAPIRequest } = useAPIClient()
    const { stringifyData } = useJSON()


    /**
     * Callback function to convert expense object coming from API
     * to format used by app
     * @param {object} expenseData
     * @returns {object}
     */
    const convertDBExpense = useCallback((expenseData: DBExpenseResponse): ExpenseItemType => {
        const expenseItem: ExpenseItemType = {
            expense_id: expenseData.id!, //API sends 'id' field
            vendor: expenseData.vendor,
            description: expenseData.description,
            amount: parseFloat(expenseData.amount),
            type: expenseData.type,
            spendDate: expenseData.spend_date,
            category: expenseData.category ? expenseData.category : '0',
            category_name: expenseData.category_name ? expenseData.category_name : 'Uncategorized'
        }
        return expenseItem
    }, [])


    /**
     * Callback function to convert expense object used by app
     * to format used by API
     * @param {object} expenseData
     * @returns {object}
     */
    const convertAppExpense = useCallback((expenseData: ExpenseItemType): DBExpenseResponse => {
        const getStringFromDate = (jsDate: string): string => {
            // JS ISO string format: YYYY-MM-DDTHH:mm:ss.uuuZ
            const [date, zTime] = jsDate.split('T')
            const time = zTime.slice(0, -1)

            /* Reformat to Django input datetime: YYYY-MM-DD HH:mm:ss
               Django model requires this input format but returns ISO string
               matching JS format so no conversion needed with data coming from API
             */
            const apiDate: string = `${date} ${time}`
            return apiDate
        }

        // Convert due date string format
        const spendDate = getStringFromDate(expenseData.spendDate)
        const expenseItem: DBExpenseResponse = {
            user: userId,
            vendor: expenseData.vendor,
            description: expenseData.description,
            amount: expenseData.amount.toString(),
            spend_date: spendDate,
            type: expenseData.type,
            category: expenseData.category != '0' ? expenseData.category : undefined
        }
        return expenseItem
    }, [userId])


    /**
     * Callback function to retrieve user's expenses data from database
     * @param {string} type either 'current' or 'all' for time period to retrieve
     * @returns {object[]}
     */
    const loadExpenseData = useCallback(async (type: string): Promise<ExpenseItemType[]> => {
        // Stringify data object
        const userIdData = { 'user': userId, 'type': type }
        const jsonResult = stringifyData(userIdData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve user expenses from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/expenses/user_expenses`,
            'POST', stringData)
        if (response.status != 200) { return [] }

        // Convert object type for app
        const expenseItemData = response.message as DBExpenseResponse[]
        const userExpenses: ExpenseItemType[] = []
        for (const expenseItem of expenseItemData) {
            const expenseData = convertDBExpense(expenseItem)
            userExpenses.push(expenseData)
        }
        return userExpenses
    }, [sendAPIRequest, urlString, stringifyData, userId, convertDBExpense])


    /**
     * Callback function to retrieve specific expense by id from database
     * @param {string} category
     * @param {string} type either 'all' or 'current' for which expenses to retrieve
     * @returns {object[]}
    */
    const loadExpensebyCategory = useCallback(async (category: string, type: string): Promise<ExpenseItemType[]> => {
        // Stringify data object
        let categoryId
        if (category == '0') {
            categoryId = null
        } else {
            categoryId = category
        }
        const expenseData = { 'user': userId, 'category_id': categoryId, 'type': type }
        const jsonResult = stringifyData(expenseData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve expenses from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/expenses/category_expenses`, 'POST', stringData)
        if (response.status != 200) { return [] }

        // Convert object type for app
        const dbExpenseArray = response.message as DBExpenseResponse[]
        const expenseArray: ExpenseItemType[] = []
        for (const expenseItem of dbExpenseArray) {
            const expenseData = convertDBExpense(expenseItem)
            expenseArray.push(expenseData)
        }
        return expenseArray
    }, [sendAPIRequest, userId, urlString, stringifyData, convertDBExpense])


    /**
     * Callback function to retrieve array of expenses by status from database
     * @param {string} expenseId
     * @returns {object | array}
     */
    const getExpensebyId = useCallback(async (expenseId: string): Promise<ExpenseItemType | []> => {
        // Stringify data object
        const expenseData = { 'user': userId, 'expense_id': expenseId }
        const jsonResult = stringifyData(expenseData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve expense from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/expenses/get_expense`, 'POST', stringData)
        if (response.status != 200) { return [] }

        // Convert object type for app
        const dbExpense = response.message as DBExpenseResponse
        const expenseItem = convertDBExpense(dbExpense)
        return expenseItem
    }, [sendAPIRequest, userId, urlString, stringifyData, convertDBExpense])


    /**
     * Callback function to retrieve array of expenses by date range
     * @param {string} startDate
     * @param {string} endDate
     * @returns {object | array}
     */
    const getExpensesbyDateRange = useCallback(async (startDate: string, endDate: string): Promise<ExpenseItemType[]> => {
        // Stringify data object
        const expenseData = {
            'user': userId, 'start_date': startDate,
            'end_date': endDate
        }
        const jsonResult = stringifyData(expenseData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve expenses from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/expenses/export_expenses`, 'POST', stringData)
        if (response.status != 200) { return [] }

        // Convert object type for app
        const expenseItemData = response.message as DBExpenseResponse[]
        const userExpenses: ExpenseItemType[] = []
        for (const expenseItem of expenseItemData) {
            const expenseData = convertDBExpense(expenseItem)
            expenseData.spendDate = new Date(expenseData.spendDate).toLocaleDateString(
                'en-US', { day: '2-digit', month: '2-digit', year: 'numeric' })
            userExpenses.push(expenseData)
        }
        return userExpenses
    }, [sendAPIRequest, userId, urlString, stringifyData, convertDBExpense])


    /**
     * Callback function to create new expense in database
     * @param {object} expenseData
     * @returns {object}
     */
    const createExpense = useCallback(async (expenseData: DBExpenseResponse): Promise<HookResponse> => {
        // Stringify data object
        const jsonResult = stringifyData(expenseData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Create expense in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/expenses/add_expense`, 'POST', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, stringifyData])


    /**
     * Callback function to update expense data in database
     * @param {object} expenseData
     * @returns {object}
    */
    const updateExpense = useCallback(async (expenseData: DBExpenseResponse): Promise<HookResponse> => {
        // Remove date_created, field not allowed in PATCH request
        delete expenseData.date_created

        // Stringify data object
        const jsonResult = stringifyData(expenseData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Update expense in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/expenses/update_expense`, 'PATCH', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, stringifyData])


    /**
     * Callback function to delete expense in database
     * @param {string} expenseId
     * @returns {object}
    */
    const deleteExpense = useCallback(async (expenseId: string): Promise<HookResponse> => {
        // Stringify data object
        const expenseData = { 'user': userId, 'expense_id': expenseId }
        const jsonResult = stringifyData(expenseData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Delete expense in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/expenses/remove_expense`, 'DELETE', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, userId, stringifyData])


    /**
     * Callback function to bulk create expenses in database
     * @param {string} expensesFile string of expense data from imported csv
     * @param {boolean} hasHeading whether file data has header row
     * @returns {object}
    */
    const bulkCreateExpenses = useCallback(async (expensesFile: string, hasHeading: boolean): Promise<HookResponse> => {
        // Stringify data object
        const expenseData = {
            'user': userId, 'expense_file': expensesFile,
            'has_heading': hasHeading
        }
        const jsonResult = stringifyData(expenseData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Bulk create expenses in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/expenses/bulk_create`, 'POST', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, userId, stringifyData])


    return { loadExpenseData, createExpense, updateExpense, deleteExpense, loadExpensebyCategory, convertAppExpense, getExpensebyId, convertDBExpense, bulkCreateExpenses, getExpensesbyDateRange }
}
