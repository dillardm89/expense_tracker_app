import { useEffect, useState } from 'react'
import Button from '../../../../shared/components/elements/Button'
import CategoryItem from './CategoryItem'
import CategoryModal from './CategoryModal'
import type { CategoryItemType } from '../../../../utils/types/category-types'
import sortIcon from '../../../../assets/icons/az-sort-icon.png'
import '../../../../../public/styles/settings/categories/category-manager.css'


/**
 * CategoryManagerProps
 * @typedef {object} CategoryManagerProps
 * @property {array} categoryData CategoryItemType array of objects containing information
 *                          for existing categories
 * @property {function} onModifyCategory callback function to handle modifying categories
 */
type CategoryManagerProps = {
    categoryData: CategoryItemType[],
    onModifyCategory: () => void
}


/**
 * Component for managing list of user categories
 * Props passed down from ProfileSettings
 * @param {object} CategoryManagerProps
 * @returns {React.JSX.Element}
 */
export default function CategoryManager({ categoryData, onModifyCategory }: CategoryManagerProps): React.JSX.Element {
    const [openModal, setOpenModal] = useState<boolean>(false)
    const [sortAZOrder, setSortAZOrder] = useState<boolean>(true)
    const [noCategoryData, setNoCategoryData] = useState<boolean>(false)


    /** Function to handle sorting categories by name field */
    const handleSortCategories = (): void => {
        setSortAZOrder((prevMode) => !prevMode)
        if (sortAZOrder) {
            categoryData.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        } else {
            categoryData.sort((b, a) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()))
        }
    }


    /**
     * Function to handle closing modal and updating category data if needed
     * @param {string} action
     */
    const handleCloseCategoryModal = (action: string): void => {
        document.querySelector('body')!.id = ''
        if (action == 'cancel') {
            setOpenModal(false)
        } else {
            setOpenModal(false)
            onModifyCategory()
        }
    }


    useEffect(() => {
        // useEffect to display message if no category data
        if (categoryData.length == 0) {
            setNoCategoryData(true)
        } else {
            setNoCategoryData(false)
        }
    }, [categoryData])


    return (<>
        {openModal && (
            <CategoryModal openModal={openModal}
                onCloseModal={handleCloseCategoryModal}
                heading='Add New Category' modalType='add'
            />)}

        <div className='category-manager-heading'>
            <h2>Expense Category Manager</h2>

            <div className='category-manager-actions'>
                <Button classId='add-category-btn' type='button' onClick={() => setOpenModal(true)}>
                    Add Category
                </Button>

                <div className='sort-categories-div'>
                    <img src={sortIcon} alt='sort arrow icon'
                        onClick={handleSortCategories}
                    />
                </div>
            </div>
        </div>

        <div className='category-manager-list'>
            <div className='category-list-heading'>
                <h4 className='category-name-heading'>Category Name</h4>
                <h4 className='category-budget-heading'>Monthly Budget</h4>
                <h4 className='category-color-heading'>Display Color</h4>
                <div className='category-icons-heading'>
                    <h4>Edit</h4>
                    <h4>/</h4>
                    <h4>Delete</h4>
                </div>
            </div>

            {noCategoryData && (
                <div className='no-settings-div'>
                    <p>No expense categories found. Click to add some.</p>
                </div>
            )}

            <div className='scroller'>
                <ul className='category-list-ul'>
                    {categoryData.map((category, index) => (
                        <CategoryItem key={index} categoryInfo={category}
                            onModifyCategory={onModifyCategory}
                        />
                    ))}
                </ul>
            </div>
        </div>
    </>)
}
