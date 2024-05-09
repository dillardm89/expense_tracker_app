import { useCallback } from 'react'
import Cookies from 'js-cookie'
import type { DBResponseType } from '../../utils/types/shared-types'
import { send_request_error } from '../../utils/user/response-messages'


/** Custom useAPIClient hook to handle API requests and responses */
export function useAPIClient() {
    const csrfToken = Cookies.get('csrftoken') as string


    /**
     * Callback function to send request to API
     * @param {string} url
     * @param {string} method
     * @param {BodyInit | null} body
     * @param {object} headers
     * @returns {object}
    */
    const sendAPIRequest = useCallback(
        async (url: string, method: string = 'GET', body: BodyInit | null = null,
            headers = {
                'Content-Type': 'application/json',
                'X-XSRFToken': csrfToken
            }) => {
            let responseObject: DBResponseType = { 'message': send_request_error, 'status': 500 }

            await fetch(url, { method, body, headers, })
                .then(async (response) => {
                    const valid_status = [200, 201, 207, 400, 404]
                    const status = response.status
                    const responseData = await response.json()

                    if (valid_status.includes(status)) {
                        responseObject = { 'message': responseData.detail, 'status': status }
                    } else {
                        responseObject = { 'message': responseData.detail, 'status': status }
                        throw new Error(responseData.detail)
                    }
                }).catch(() => {
                    return responseObject
                })
            return responseObject
        }, [csrfToken])

    return { sendAPIRequest }
}
