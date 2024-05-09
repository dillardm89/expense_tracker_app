import type { AlertStateType } from '../../types/shared-types'


/** Default values for setting initial AlertModal state in various components */
export const blankAlert: AlertStateType = { type: 'info', message: '', heading: '' }
