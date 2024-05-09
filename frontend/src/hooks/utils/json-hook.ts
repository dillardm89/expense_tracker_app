import { useCallback } from 'react'
import type { HookResponse } from '../../utils/types/shared-types'
import { json_stringify_error } from '../../utils/user/response-messages'


/** Custom useJSON hook */
export function useJSON() {
    /**
     * Callback function for converting objects to JSON format
     * @param {object} data
     * @returns {object}
     */
    const stringifyData = useCallback((data: object): HookResponse => {
        try {
            const stringData = JSON.stringify(data)
            return { status: 200, message: stringData }
        } catch (error) {
            return { status: 400, message: json_stringify_error }
        }
    }, [])

    return { stringifyData }
}
