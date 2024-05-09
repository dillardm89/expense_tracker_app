import { useEffect, useState } from 'react'
import { useManageCategory } from '../../hooks/dashboard/categories/category-hook'
import CategoryManager from '../components/settings/categories/CategoryManager'
import type { CategoryItemType } from '../../utils/types/category-types'
import '../../../public/styles/settings/settings.css'


/**
 * Page for user settings / profile
 * @returns {React.JSX.Element}
 */
export default function ProfileSettings(): React.JSX.Element {
    const { loadCategoryData } = useManageCategory()

    const [categoryData, setCategoryData] = useState<CategoryItemType[]>([])
    const [needLoadData, setNeedLoadData] = useState<boolean>(true)
    const [noCategoryData, setNoCategoryData] = useState<boolean>(false)


    useEffect(() => {
        // useEffect to load user categories data from API
        const getCategoryData = async (): Promise<void> => {
            const response = await loadCategoryData()
            if (response.length == 0) {
                setNoCategoryData(true)
                setCategoryData([])
            } else {
                setNoCategoryData(false)
                setCategoryData(response)
            }
        }
        if (needLoadData) {
            getCategoryData()
            setNeedLoadData(false)
        }
    }, [loadCategoryData, needLoadData])


    return (<>
        <div className='settings-div' id={noCategoryData ? 'no-settings-found' : 'settings-exist'}>
            <div className='category-manager-container'>
                <CategoryManager onModifyCategory={() => setNeedLoadData(true)}
                    categoryData={categoryData} />
            </div>
        </div>
    </>)
}
