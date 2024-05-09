import { useCallback } from 'react'
import { useManageCategory } from '../dashboard/categories/category-hook'
import { useManageExpense } from '../expenses/expense-hook'
import { useCSV } from '../utils/csv-hook'
import type { CategoryItemType } from '../../utils/types/category-types'
import type { HandlerResponse, HookResponse } from '../../utils/types/shared-types'
import { add_api_error, add_failed_heading, update_api_error, update_failed_heading, delete_failed_heading, delete_api_error } from '../../utils/user/response-messages'
import { ExpenseItemType } from '../../utils/types/expense-types'


/**
 * Custom useResponseHandler hook for handling responses from useManage type hooks
 * that interact with API for creating, updating, and deleting objects
*/
export function useResponseHandler() {
    const { createCategory, updateCategory, deleteCategory, convertAppCategory } = useManageCategory()
    const { createExpense, updateExpense, deleteExpense, convertAppExpense,
        bulkCreateExpenses, getExpensesbyDateRange } = useManageExpense()
    const { createCSV } = useCSV()


    /**
     * Callback function to handle adding object in database
     * @param {object} objectData
     * @param {string} type object name ('category' or 'expense')
     * @returns {object}
     */
    const createHandler = useCallback(async (objectData: object, type: string): Promise<HandlerResponse> => {
        let response: HookResponse
        if (type == 'category') {
            const categoryData = objectData as CategoryItemType
            const categoryItem = convertAppCategory(categoryData)
            response = await createCategory(categoryItem)
        } else {
            const expenseData = objectData as ExpenseItemType
            const expenseItem = convertAppExpense(expenseData)
            response = await createExpense(expenseItem)
        }

        if (response.status != 200) {
            return {
                status: 400, type: 'error', heading: add_failed_heading, message: add_api_error
            }
        }
        return { status: 200 }
    }, [createCategory, convertAppCategory, createExpense, convertAppExpense])


    /**
     * Callback function to handle bulk adding objects in database
     * @param {string} bulkData
     * @param {boolean} hasHeading
     * @param {string} type object name ('category' or 'expense')
     * @returns {object}
     */
    const bulkCreateHandler = useCallback(async (bulkData: string, hasHeading: boolean, type: string): Promise<HandlerResponse> => {
        let response: HookResponse
        if (type == 'expense') {
            response = await bulkCreateExpenses(bulkData, hasHeading)
        } else {
            return {
                status: 400, type: 'error', heading: add_failed_heading, message: add_api_error
            }
        }

        if (response.status != 200) {
            return {
                status: 400, type: 'error', heading: add_failed_heading, message: add_api_error
            }
        }
        return { status: 200 }
    }, [bulkCreateExpenses])


    /**
     * Callback function to handle updating object in database
     * @param {object} objectData
     * @param {string} type object name ('category' or 'expense')
     * @returns {object}
     */
    const updateHandler = useCallback(async (objectData: object, type: string): Promise<HandlerResponse> => {
        let response: HookResponse
        if (type == 'category') {
            const categoryData = objectData as CategoryItemType
            const categoryItem = convertAppCategory(categoryData)
            categoryItem.category_id = categoryData.category_id
            response = await updateCategory(categoryItem)
        } else {
            const expenseData = objectData as ExpenseItemType
            const expenseItem = convertAppExpense(expenseData)
            expenseItem.expense_id = expenseData.expense_id
            response = await updateExpense(expenseItem)
        }

        if (response.status != 200) {
            return {
                status: 400, type: 'error', heading: update_failed_heading, message: update_api_error
            }
        }
        return { status: 200 }
    }, [updateCategory, convertAppCategory, updateExpense, convertAppExpense])


    /**
     * Callback function to handle deleting object in database
     * @param {string} objectId
     * @param {string} type object name ('category' or 'expense')
     * @returns {object}
     */
    const deleteHandler = useCallback(async (objectId: string, type: string): Promise<HandlerResponse> => {
        let response: HookResponse
        if (type == 'category') {
            response = await deleteCategory(objectId)
        } else {
            response = await deleteExpense(objectId)
        }

        if (response.status != 200) {
            return {
                status: 400, type: 'error', heading: delete_failed_heading, message: delete_api_error
            }
        }
        return { status: 200 }
    }, [deleteCategory, deleteExpense])


    /**
     * Callback function to handle retrieving expenses by date range
     * @param {string} startDate
     * @param {string} endDate
     * @param {string} type object name ('category' or 'expense')
     * @returns {object}
     */
    const exportHandler = useCallback(async (startDate: string, endDate: string, type: string): Promise<string[]> => {
        if (type != 'expense') { return [] }

        const response: ExpenseItemType[] = await getExpensesbyDateRange(startDate, endDate)
        if (response.length == 0) { return [] }

        const result = createCSV(response)
        if (result.status != 200) {
            return []
        } else {
            const csvData: string[] = result.message as []
            return csvData
        }
    }, [getExpensesbyDateRange, createCSV])


    return { createHandler, updateHandler, deleteHandler, bulkCreateHandler, exportHandler }
}
