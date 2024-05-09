import { useState } from 'react'
import { useResponseHandler } from '../../../../hooks/response-handler/handler-hook'
import CategoryModal from './CategoryModal'
import AlertModal from '../../../../shared/components/elements/AlertModal'
import ConfirmDeleteModal from '../../../../shared/components/elements/ConfirmDeleteModal'
import type { CategoryItemType } from '../../../../utils/types/category-types'
import type { AlertStateType } from '../../../../utils/types/shared-types'
import { blankAlert } from '../../../../utils/forms/user/user-values'
import editIcon from '../../../../assets/icons/edit_icon.png'
import deleteIcon from '../../../../assets/icons/delete_icon.png'


/**
 * CategoryItemProps
 * @typedef {object} CategoryItemProps
 * @property {object} categoryInfo CategoryItemType object containing information
 *                          for existing category
 * @property {function} onModifyCategory callback function to handle modifying categories
 */
type CategoryItemProps = {
    categoryInfo: CategoryItemType,
    onModifyCategory: () => void
}


/**
 * Component for rending individual category item in list
 * Props passed down from CategoryManager
 * @param {object} CategoryItemProps
 * @returns {React.JSX.Element}
 */
export default function CategoryItem({ categoryInfo, onModifyCategory }: CategoryItemProps): React.JSX.Element {
    const { deleteHandler } = useResponseHandler()

    const [openEditModal, setOpenEditModal] = useState<boolean>(false)
    const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false)
    const [openAlert, setOpenAlert] = useState<boolean>(false)
    const [alertContent, setAlertContent] = useState<AlertStateType>(blankAlert)


    /** Function to handle deleting category */
    const handleDeleteCategory = async (): Promise<void> => {
        const handlerType = 'category'
        const response = await deleteHandler(categoryInfo.category_id!, handlerType)
        if (response.status != 200) {
            setAlertContent({
                type: response.type!,
                message: response.message!,
                heading: response.heading!
            })
        } else {
            onModifyCategory()
        }
        document.querySelector('body')!.id = ''
        setOpenDeleteModal(false)
    }


    /**
     * Function to handle closing modal and updating category data if needed
     * @param {string} action
     */
    const handleCloseCategoryModal = (action: string): void => {
        document.querySelector('body')!.id = ''
        setOpenEditModal(false)
        if (action == 'save') {
            onModifyCategory()
        }
    }


    /**
     * Function to handle closing modal
     * @param {string} type either 'alert' or 'delete' for modal type
     */
    const handleCloseModal = (type: string): void => {
        document.querySelector('body')!.id = ''
        if (type == 'delete') {
            setOpenDeleteModal(false)
        } else {
            setOpenAlert(false)
        }
    }


    return (<>
        {openAlert && (
            <AlertModal openModal={openAlert} onClear={() => handleCloseModal('alert')}
                heading={alertContent.heading} type={alertContent.type}
                message={alertContent.message}
            />)}

        {openEditModal && (
            <CategoryModal openModal={openEditModal} onCloseModal={handleCloseCategoryModal}
                categoryInfo={categoryInfo} heading='Edit category' modalType='edit'
            />)}

        {openDeleteModal && (
            <ConfirmDeleteModal openModal={openDeleteModal} typeString='category'
                onCloseModal={() => handleCloseModal('delete')}
                onConfirmDelete={handleDeleteCategory}
            />)}

        <li className='category-list-item' >
            <p className='category-item-name'>{categoryInfo.name}</p>
            <p className='category-item-budget'>{categoryInfo.budget.toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
            <div className='category-item-color'>
                <div style={{ backgroundColor: `${categoryInfo.displayColor}` }}></div>
            </div>

            <div className='category-icons-div'>
                <img className='edit-category-icon' src={editIcon} alt='edit icon'
                    onClick={() => setOpenEditModal(true)}
                />
                <img className='delete-category-icon' src={deleteIcon} alt='delete icon'
                    onClick={() => setOpenDeleteModal(true)}
                />
            </div>
        </li >
    </>)
}
