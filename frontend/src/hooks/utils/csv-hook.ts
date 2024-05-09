import { useCallback } from 'react'
import type { HookResponse } from '../../utils/types/shared-types'
import { csv_create_error } from '../../utils/user/response-messages'
import { type ExpenseItemType, ExpenseType } from '../../utils/types/expense-types'


/** Custom useCSV hook */
export function useCSV() {
    /**
     * Callback function for converting objects to CSV format
     * @param {object[]} data
     * @returns {object}
     */
    const createCSV = useCallback((data: ExpenseItemType[]): HookResponse => {
        const dataArray: string[] = ['Date,Vendor,Amount,Type,Category,']
        try {
            for (const item of data) {
                let amount: string
                if (item.type == 0) {
                    amount = item.amount.toString()
                } else {
                    amount = (-item.amount).toString()
                }
                const dataString: string = (`${item.spendDate.split('T')[0]},${item.vendor},` +
                    `${amount},${ExpenseType[item.type]},${item.category_name},`)
                dataArray.push(dataString)
            }
            return { status: 200, message: dataArray }
        } catch (error) {
            return { status: 400, message: csv_create_error }
        }
    }, [])

    return { createCSV }
}
