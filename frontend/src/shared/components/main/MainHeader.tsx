import { useState } from 'react'
import Backdrop from '../navigation/Backdrop'
import SideDrawer from '../navigation/SideDrawer'
import NavLinks from '../navigation/NavLinks'
import logo from '../../../assets/main/MD-logo-sm.jpg'
import '../../../../public/styles/navigation/header.css'


/**
 * Component for conditionally rendering site header component for various screen sizes
 * Props passed down from App
 * @returns {React.JSX.Element}
 */
export default function MainHeader(): React.JSX.Element {
    const [drawerOpen, setDrawerOpen] = useState<boolean>(false)


    return (
        <>
            {drawerOpen && <Backdrop onClose={() => setDrawerOpen(false)} />}

            <SideDrawer showDrawer={drawerOpen} onClose={() => setDrawerOpen(false)} />

            <header className='main-header'>
                <div id='header-constant'>
                    <img src={logo} alt='Marianne Logo' />
                    <h1 id='main-header-title'>Expense Tracker</h1>
                </div>

                <div className='main-header-nav'>
                    <NavLinks onClick={() => setDrawerOpen(false)} />
                </div>

                <button className='side-drawer-button' onClick={() => setDrawerOpen(true)}>
                    <span />
                    <span />
                    <span />
                </button>
            </header>
        </>
    )
}
