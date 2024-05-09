import { useCallback } from 'react'
import { useAPIClient } from '../../api/api-hook'
import { useJSON } from '../../utils/json-hook'
import type { DBCategoryResponse, CategoryItemType } from '../../../utils/types/category-types'
import type { HookResponse } from '../../../utils/types/shared-types'


/** Custom useManageCategory hook to handle retrieving and updating category data */
export function useManageCategory() {
    const apiUrl = import.meta.env.VITE_APP_API_URL
    const userId = import.meta.env.VITE_APP_API_USERID
    const urlString = `${apiUrl}/dashboard`

    const { sendAPIRequest } = useAPIClient()
    const { stringifyData } = useJSON()


    /**
     * Callback function to convert category object coming from API
     * to format used by app
     * @param {object} categoryData
     * @returns {object}
     */
    const convertDBCategory = useCallback((categoryData: DBCategoryResponse): CategoryItemType => {
        const categoryItem: CategoryItemType = {
            category_id: categoryData.id!, //API sends 'id' field
            name: categoryData.name,
            displayColor: categoryData.display_color,
            budget: parseFloat(categoryData.budget),
            type: categoryData.type
        }
        return categoryItem
    }, [])


    /**
     * Callback function to convert category object used by app
     * to format used by API
     * @param {object} categoryData
     * @returns {object}
     */
    const convertAppCategory = useCallback((categoryData: CategoryItemType): DBCategoryResponse => {
        const categoryItem: DBCategoryResponse = {
            user: userId,
            name: categoryData.name,
            display_color: categoryData.displayColor,
            budget: categoryData.budget.toString(),
            type: categoryData.type,
        }
        return categoryItem
    }, [userId])


    /**
     * Callback function to retrieve user's categories data from database
     * @returns {object[]}
     */
    const loadCategoryData = useCallback(async (): Promise<CategoryItemType[]> => {
        // Stringify data object
        const userIdData = { 'user': userId }
        const jsonResult = stringifyData(userIdData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve categories from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/categories/user_categories`,
            'POST', stringData)
        if (response.status != 200) { return [] }

        // Convert object type for app
        const categoryItemData = response.message as DBCategoryResponse[]
        const userCategories: CategoryItemType[] = []
        for (const categoryItem of categoryItemData) {
            const categoryData = convertDBCategory(categoryItem)
            userCategories.push(categoryData)
        }
        return userCategories
    }, [sendAPIRequest, urlString, stringifyData, userId, convertDBCategory])


    /**
     * Callback function to retrieve specific category from database by id
     * @param {string} categoryId
     * @returns {object | array}
     */
    const getCategorybyId = useCallback(async (categoryId: string): Promise<CategoryItemType | []> => {
        // Stringify data object
        const categoryData = { 'user': userId, 'category_id': categoryId }
        const jsonResult = stringifyData(categoryData)
        if (jsonResult.status == 400) { return [] }

        // Retrieve category from database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/categories/get_category`, 'POST', stringData)
        if (response.status != 200) { return [] }

        // Convert object type for app
        const dbCategory = response.message as DBCategoryResponse
        const categoryItem = convertDBCategory(dbCategory)
        return categoryItem
    }, [sendAPIRequest, userId, urlString, stringifyData, convertDBCategory])


    /**
     * Callback function to create new category in database
     * @param {object} categoryData
     * @returns {object}
     */
    const createCategory = useCallback(async (categoryData: DBCategoryResponse): Promise<HookResponse> => {
        // Stringify data object
        const jsonResult = stringifyData(categoryData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Create category in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/categories/add_category`, 'POST', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, stringifyData])


    /**
     * Callback function to update category data in database
     * @param {object} categoryData
     * @returns {object}
    */
    const updateCategory = useCallback(async (categoryData: DBCategoryResponse): Promise<HookResponse> => {
        // Remove date_created, field not allowed in PATCH request
        delete categoryData.date_created

        // Stringify data object
        const jsonResult = stringifyData(categoryData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Update category in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/categories/update_category`, 'PATCH', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, stringifyData])


    /**
     * Callback function to delete category in database
     * @param {string} categoryId
     * @returns {object}
    */
    const deleteCategory = useCallback(async (categoryId: string): Promise<HookResponse> => {
        // Stringify data object
        const categoryData = { 'user': userId, 'category_id': categoryId }
        const jsonResult = stringifyData(categoryData)
        if (jsonResult.status == 400) {
            return { status: jsonResult.status, message: jsonResult.message }
        }

        // Delete category in database
        const stringData: string = jsonResult.message as string
        const response = await sendAPIRequest(`${urlString}/categories/remove_category`, 'DELETE', stringData)
        return { status: response.status, message: response.message as string }
    }, [sendAPIRequest, urlString, userId, stringifyData])


    return { loadCategoryData, createCategory, updateCategory, deleteCategory, convertAppCategory, getCategorybyId, convertDBCategory }
}
