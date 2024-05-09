import { ChangeEvent, useEffect, useState } from 'react'
import { useForm } from '../../../../hooks/form/form-hook'
import { useResponseHandler } from '../../../../hooks/response-handler/handler-hook'
import CategoryForm from './CategoryForm'
import Modal from '../../../../shared/components/elements/Modal'
import Button from '../../../../shared/components/elements/Button'
import type { CategoryItemType } from '../../../../utils/types/category-types'


/**
 * CategoryModalProps
 * @typedef {object} CategoryModalProps
 * @property {string} type modal form type, either 'add' or 'edit'
 * @property {boolean} openModal determines whether to display modal
 * @property {function} onCloseModal callback function to handle closing modal
 * @property {object} categoryInfo (optional) CategoryItemType object containing information
 *                          for existing category to be edited
 */
type CategoryModalProps = {
    modalType: 'add' | 'edit',
    openModal: boolean,
    heading: string,
    onCloseModal: (action: string) => void,
    categoryInfo?: CategoryItemType
}


/**
 * Component for modal to add / edit categories
 * Props passed down from CategoryItem or CategoryManager
 * @param {object} CategoryModalProps
 * @returns {React.JSX.Element}
 */
export default function CategoryModal({ openModal, heading, onCloseModal, categoryInfo, modalType }: CategoryModalProps): React.JSX.Element {
    const { inputHandler, validateForm, clearFormState, initializeFormState } = useForm()
    const { createHandler, updateHandler } = useResponseHandler()

    const [isError, setIsError] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>('')


    /** Function to handle close modal and clear formState */
    const handleCancelModal = (): void => {
        clearFormState()
        onCloseModal('cancel')
    }


    /**
     * Function to handle hook response and error messaging
     * @param {number} status
     */
    const handleResponse = (status: number): void => {
        if (status != 200) {
            setErrorMessage('Invalid Inputs. Please correct and try again.')
            setIsError(true)
        } else {
            clearFormState()
            setIsError(false)
            onCloseModal('save')
        }
    }


    /**
     * Function to handle saving new or updated categories
     * @param {ChangeEvent<HTMLFormElement>} event
     */
    const handleSaveCategory = async (event: ChangeEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault()
        const formData = new FormData(event.target)
        const formIsValid = validateForm(formData)
        if (!formIsValid) {
            handleResponse(400)
            return
        }

        const name = formData.get('name')!.toString()
        const displayColor = formData.get('display-color')!.toString()
        const budget = formData.get('budget')!.toString()
        const type = formData.get('type')!.toString()
        const categoryData: CategoryItemType = {
            name, displayColor,
            budget: parseFloat(budget),
            type: parseInt(type, 10)
        }

        let response
        const handlerType = 'category'
        if (modalType == 'add') {
            response = await createHandler(categoryData, handlerType)
        } else {
            categoryData.category_id = categoryInfo!.category_id
            response = await updateHandler(categoryData, handlerType)
        }
        handleResponse(response.status)
    }


    useEffect(() => {
        // useEffect to initialize formState
        if (openModal) {
            initializeFormState('category')
        }
    }, [openModal, initializeFormState])


    return (
        <div
            onInputCapture={e => e.stopPropagation()}
            onBeforeInput={e => e.stopPropagation()}
            onInput={e => e.stopPropagation()}
        >
            <Modal openModal={openModal} onCloseModal={handleCancelModal}
                specialClass='category-modal'>
                <div id='info-modal'>
                    <h3>{heading}</h3>

                    <div className='category-modal-form'>
                        {isError && (
                            <p className='modal-form-error'>{errorMessage}</p>
                        )}

                        <form onSubmit={handleSaveCategory}>
                            <CategoryForm categoryInfo={categoryInfo}
                                onInput={inputHandler}
                            />

                            <div className="modal-btn-div">
                                <Button type='submit' classId='modal-save-btn'>
                                    Save
                                </Button>

                                <Button onClick={handleCancelModal}
                                    type='reset' classId='modal-close-btn'>
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
