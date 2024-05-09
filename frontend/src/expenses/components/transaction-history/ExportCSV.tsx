import FileSaver from 'file-saver'
import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from '../../../hooks/form/form-hook'
import { useResponseHandler } from '../../../hooks/response-handler/handler-hook'
import Modal from '../../../shared/components/elements/Modal'
import Button from '../../../shared/components/elements/Button'
import Input from '../../../shared/components/elements/Input'
import { expenseSpendDateValidator } from '../../../utils/forms/expenses/expense-validators'
import type { HandleCSVModalProps } from './ImportCSV'
import '../../../../public/styles/expense/csv-modals.css'


/**
 * Component to render modal for exporting CSV file of expenses
 * Props passed down from ExpenseActivity
 * @param {object} HandleCSVModalProps
 * @returns {React.JSX.Element}
 */
export default function ExportCSV({ openModal, onCloseModal }: HandleCSVModalProps): React.JSX.Element {
    const { initializeFormState, inputHandler, validateForm, clearFormState } = useForm()
    const { exportHandler } = useResponseHandler()

    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')
    const [clicked, setClicked] = useState<boolean>(false)


    /**
     * Function to handle downloading data to user computer
     * @param {string[]} data
     */
    const handleDownloadCSV = (data: string[]): void => {
        const csvData = new Blob([data.join('\n')], { type: 'text/csv;charset=utf-8;' })
        FileSaver.saveAs(csvData, 'expenses.csv')
        handleResponse(200)
    }


    /**
     * Function to handle hook response and error messaging
     * @param {number} status
     */
    const handleResponse = (status: number): void => {
        if (status == 200) {
            setClicked(false)
            setIsError(false)
            clearFormState()
            onCloseModal('save', 'export')
            return
        } else if (status == 400) {
            setErrorMessage('Invalid inputs. Please check inputs and try again.')
        } else if (status == 404) {
            setErrorMessage('No expenses found for selected time period. Please check inputs and try again.')
        } else if (status == 500) {
            setErrorMessage('Maximum range is 60 days. Please correct inputs and try again.')
        }
        setClicked(false)
        setIsError(true)
    }


    /**
     * Function to handle retrieving expense data for date range
     * @param {ChangeEvent<HTMLFormElement>} event
     */
    const handleExportCSV = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        setClicked(true)
        const formData = new FormData(event.target)
        const startDateValue = formData.get('start-date')!.toString()
        const startDate = new Date(startDateValue + 'T00:00:00.000').toISOString()
        const startDateNum = Date.parse(startDate)

        const endDateValue = formData.get('end-date')!.toString()
        const endDate = new Date(endDateValue + 'T00:00:00.000').toISOString()
        const endDateNum = Date.parse(endDate)

        const oneDay = (1000 * 60 * 60 * 24)
        const daysBetween = Math.ceil((endDateNum - startDateNum) / oneDay)
        if (daysBetween > 60) {
            handleResponse(500)
            return
        }

        const formIsValid = validateForm(formData)
        if (!formIsValid) {
            handleResponse(400)
            return
        }

        const handlerType = 'expense'
        const response = await exportHandler(startDate, endDate, handlerType)
        if (response.length == 0) {
            handleResponse(404)
        } else {
            const data: string[] = response
            handleDownloadCSV(data)
        }
    }


    useEffect(() => {
        // useEffect to initializing formState
        if (openModal) {
            initializeFormState('export-data')
        }
    }, [initializeFormState, openModal])


    return (
        <div
            onInputCapture={e => e.stopPropagation()}
            onBeforeInput={e => e.stopPropagation()}
            onInput={e => e.stopPropagation()}
        >
            <Modal openModal={openModal} onCloseModal={() => onCloseModal('cancel', 'export')}>
                <div id='info-modal'>
                    <h3>Export Expenses to File</h3>

                    <div className='export-modal-form'>
                        {isError && (
                            <p className='modal-form-error'>{errorMessage}</p>
                        )}

                        {clicked && (
                            <p className='modal-form-error'>Preparing your file. This may take a few minutes.</p>
                        )}

                        <form onSubmit={handleExportCSV}>
                            <Input
                                element='input' fieldId='start-date' name='start-date'
                                type='date' label='Start Date' onInput={inputHandler}
                                initialValue={new Date().toISOString().split('T')[0]}
                                selectedValidators={expenseSpendDateValidator}
                                errorText='Enter a valid date (Jan 1, 2020 - Dec 31, 2050).'
                            />
                            <Input
                                element='input' fieldId='end-date' name='end-date'
                                type='date' label='End Date' onInput={inputHandler}
                                initialValue={new Date().toISOString().split('T')[0]}
                                selectedValidators={expenseSpendDateValidator}
                                errorText='Enter a valid date (Jan 1, 2020 - Dec 31, 2050).'
                            />

                            <div className='modal-btn-div'>
                                <Button classId='modal-save-btn' type='submit'>
                                    Export
                                </Button>

                                <Button classId='modal-close-btn' type='reset'
                                    onClick={() => onCloseModal('cancel', 'export')}>
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </Modal>
        </div>
    )
}
