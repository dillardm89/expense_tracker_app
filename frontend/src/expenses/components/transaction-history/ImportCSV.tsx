import { ChangeEvent, useRef, useState, useEffect } from 'react'
import { useResponseHandler } from '../../../hooks/response-handler/handler-hook'
import Modal from '../../../shared/components/elements/Modal'
import Button from '../../../shared/components/elements/Button'
import '../../../../public/styles/expense/csv-modals.css'


/**
 * HandleCSVModalProps
 * @typedef {object} HandleCSVModalProps
 * @property {boolean} openModal whether to display modal
 * @property {function} onCloseModal callback function to handle closing modal
 */
export type HandleCSVModalProps = {
    openModal: boolean,
    onCloseModal: (action: string, type: string) => void
}


/**
 * Component to render modal for uploading CSV file of expenses
 * Props passed down from ExpenseActivity
 * @param {object} HandleCSVModalProps
 * @returns {React.JSX.Element}
 */
export default function ImportCSV({ openModal, onCloseModal }: HandleCSVModalProps): React.JSX.Element {
    const { bulkCreateHandler } = useResponseHandler()

    const filePickerRef = useRef<HTMLInputElement>(null)

    const [file, setFile] = useState<Blob>()
    const [fileString, setFileString] = useState<string>('')
    const [fileName, setFileName] = useState<string>('')
    const [isError, setIsError] = useState<boolean>(false)
    const [checked, setChecked] = useState<boolean>(false)


    /** Function to toggle 'heading' checkbox and update state */
    const updateChecked = (): void => {
        const newCheckStatus = !checked
        setChecked(newCheckStatus)
    }


    /**
     * Function to handle file selected and set state
     * @param {ChangeEvent<HTMLInputElement>} event
     */
    const handleSelectFile = (event: ChangeEvent<HTMLInputElement>): void => {
        let pickedFile: File
        if (event.target.files && event.target.files.length == 1) {
            pickedFile = event.target.files[0]
            const name = pickedFile.name
            setFile(pickedFile)
            setFileName(name)
        }
    }


    /** Function to handle saving selected file */
    const handleImportCSV = async (): Promise<void> => {
        const fileTypeString: string = fileName.slice(-3).toLowerCase()
        if (!file || fileString == '' || fileTypeString != 'csv') {
            setIsError(true)
            return
        }

        const handlerType = 'expense'
        const hasHeading: boolean = checked
        const response = await bulkCreateHandler(fileString, hasHeading, handlerType)
        if (response.status != 200) {
            setIsError(true)
        } else {
            onCloseModal('save', 'import')
        }
    }


    useEffect(() => {
        // useEffect to load selected file for saving
        if (!file) { return }

        const fileReader = new FileReader()
        fileReader.onload = (event: ProgressEvent<FileReader>): void => {
            const result = event.target?.result as string
            setFileString(result)
        }
        fileReader.readAsDataURL(file)
    }, [file])


    return (
        <Modal openModal={openModal} onCloseModal={() => onCloseModal('cancel', 'import')}>
            <div id='info-modal'>
                <h3>Import Expenses from File</h3>

                <div className='csv-modal-form'>
                    {isError && (
                        <p className='modal-form-error'>Import failed. Please ensure file is of type 'csv' then try again.</p>
                    )}

                    <input id='select-file-input' name='file' ref={filePickerRef}
                        style={{ display: 'none' }} type='file'
                        accept='.csv' onChange={handleSelectFile}
                    />

                    <div className='file-name-div'>
                        {file ? <p id='file-selected'>{fileName}</p> :
                            <p id='no-file-selected'>Please select a CSV file.</p>}

                    </div>

                    <div className='heading-checkbox-div'>
                        <input name='heading-checkbox' id='heading-checkbox'
                            type='checkbox' checked={checked} onChange={updateChecked} />
                        <label>File contains headings</label>
                    </div>

                    <div className='modal-btn-div'>
                        {!file && (
                            <Button classId='modal-select-btn' type='button'
                                onClick={() => filePickerRef.current?.click()}>
                                Select File
                            </Button>)}

                        {file && (
                            <Button classId='modal-save-btn' type='button'
                                onClick={handleImportCSV}>
                                Import
                            </Button>)}

                        <Button classId='modal-close-btn' type='reset'
                            onClick={() => onCloseModal('cancel', 'import')}>
                            Cancel
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    )
}
