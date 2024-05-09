import { Outlet } from 'react-router-dom'
import MainHeader from './MainHeader'
import Footer from './Footer'


/**
 * Primary app layout
 * @returns {React.JSX.Element}
 */
export default function MainLayout(): React.JSX.Element {

  return (<>
    <MainHeader />

    <Outlet />

    <Footer />
  </>)
}
