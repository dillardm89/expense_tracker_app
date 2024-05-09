import { useState, useEffect, ChangeEvent } from 'react'
import { useManageCategory } from '../../../hooks/dashboard/categories/category-hook'
import { CategoryPickerType } from '../../../utils/types/category-types'


/**
 * CategoryPickerProps
 * @typedef {object} CategoryPickerProps
 * @property {string} categoryId category id for expenses (default: 0)
 * @property {function} onSelectCategory callback function to handle category selection
 */
type CategoryPickerProps = {
    categoryId: string,
    onSelectCategory: (categoryId: string) => void
}


/**
 * Component for rendering a drop-down selector for expense category
 * Props passed down from ExpenseForm
 * @param {object} ExpenseFormProps
 * @returns {React.JSX.Element}
 */
export default function CategoryPicker({ categoryId, onSelectCategory }: CategoryPickerProps): React.JSX.Element {
    const { loadCategoryData } = useManageCategory()

    const [selectCategoryName, setSelectCategoryName] = useState<string>('Uncategorized')
    const [categoryList, setCategoryList] = useState<CategoryPickerType[]>([])

    /**
     * Function to handle updating selecting category
     * @param {ChangeEvent<HTMLSelectElement>} event
     */
    const handleSelectCategory = (event: ChangeEvent<HTMLSelectElement>): void => {
        const categoryName: string = event.target.value
        const categoryId: string = event.target.options[event.target.selectedIndex].id
        setSelectCategoryName(categoryName)
        onSelectCategory(categoryId)
    }


    useEffect(() => {
        // useEffect to load user categories data from API
        const getCategoryData = async (): Promise<void> => {
            const response = await loadCategoryData()
            if (response.length == 0) {
                setCategoryList([{
                    name: 'Uncategorized', id: '0'
                }])
            } else {
                const categoryArray: CategoryPickerType[] = []
                for (const category of response) {
                    if (categoryId == category.category_id) {
                        categoryArray.push({ name: category.name, id: categoryId })
                        setSelectCategoryName(category.name)
                    } else {
                        const categoryItem: CategoryPickerType = {
                            name: category.name, id: category.category_id!
                        }
                        categoryArray.push(categoryItem)
                    }
                }
                categoryArray.push({
                    name: 'Uncategorized', id: '0'
                })
                setCategoryList(categoryArray)
            }
        }

        getCategoryData()
    }, [loadCategoryData, categoryId])



    return (
        <div className='input-select-div'>
            <select className='input-field' id='category' name='category'
                value={selectCategoryName}
                onChange={handleSelectCategory}
            >
                {categoryList.map((category, index) => (
                    <option key={index} value={category.name} id={category.id}>
                        {category.name}
                    </option>
                ))}
            </select>
        </div>)
}
