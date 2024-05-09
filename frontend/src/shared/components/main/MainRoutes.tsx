import { Navigate, Routes, Route } from 'react-router-dom'
import MainLayout from './MainLayout'
import ProfileSettings from '../../../user/pages/ProfileSettings'
import ExpenseTracker from '../../../expenses/pages/ExpenseTracker'
import ExpenseContextLayout from '../../../context/expense-context/expense-layout'

/**
 * Component for handling route navigation
 * @returns {React.JSX.Element}
 */
export default function MainRoutes(): React.JSX.Element {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<ExpenseContextLayout />}>
                    <Route index element={<ExpenseTracker />} />
                </Route>

                <Route path='/settings' element={<ProfileSettings />} />
                <Route path='/*' element={<Navigate to='/' replace />} />
            </Route>
        </Routes>
    )
}
