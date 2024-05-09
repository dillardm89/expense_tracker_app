/**
 * CategoryType
 * @typedef {object} CategoryType
 * Enum representaton of Category type (income / expense)
 */
export enum CategoryType { Income, Expense }


/**
 * CategoryPickerType
 * @typedef {object} CategoryPickerType
 * @property {string} name
 * @property {string} id
 */
export type CategoryPickerType = {
    name: string,
    id: string
}


/**
 * CategoryItemType
 * @typedef {object} CategoryItemType
 * @property {string} name
 * @property {string} display_color 7-digit hex color code (including '#')
 * @property {number} budget
 * @property {number} type corresponds to CategoryType enum (0=Income, 1=Expense)
 * @property {string} user (optional) user id for existing categories
 * @property {string} category_id (optional) id for existing categories
 */
export type CategoryItemType = {
    name: string,
    displayColor: string,
    budget: number,
    type: number,
    user?: string,
    category_id?: string
}



/**
 * DBCategoryResponse
 * @typedef {object} DBCategoryResponse
 * @property {string} name
 * @property {string} display_color 7-digit hex color code (including '#')
 * @property {string} budget
 * @property {number} type corresponds to CategoryType enum (0=Income, 1=Expense)
 * @property {number} user id for user
 * @property {string} date_created (optional) Category objects coming from API have 'date_created' field, but field must be removed before updating any categories
 * @property {string} id (optional) Category objects coming from API have 'id' field
 * @property {string} category_id (optional) Category objects being sent to API have 'category_id' field
 */
export type DBCategoryResponse = {
    name: string,
    display_color: string,
    budget: string,
    type: number,
    user: string,
    date_created?: string,
    id?: string,
    category_id?: string
}
