import { useRef } from 'react'
import { createPortal } from 'react-dom'
import { CSSTransition } from 'react-transition-group'
import Button from '../elements/Button'
import NavLinks from './NavLinks'
import '../../../../public/styles/navigation/side-drawer.css'


/**
 * SideDrawerProps
 * @typedef {object} SideDrawerProps
 * @property {boolean} showDrawer whether to display or hide
 * @property {function} onClose callback function to handle click to close
 */
type SideDrawerProps = {
    showDrawer: boolean,
    onClose: () => void
}


/**
 * Component for rendering navigation side drawer for small screens
 * Props passed down from MainHeader
 * @param {object} SideDrawerProps
 * @returns {React.JSX.Element}
 */
export default function SideDrawer({ showDrawer, onClose }: SideDrawerProps): React.JSX.Element {
    const nodeRef = useRef(null)

    const content = (
        <CSSTransition
            nodeRef={nodeRef} in={showDrawer} timeout={200}
            classNames='slide-in-right' mountOnEnter unmountOnExit
        >
            <aside className='side-drawer'>
                <div id='drawer-close-div'>
                    <Button onClick={onClose} type='button' classId='drawer-close-button'>X</Button>
                </div>
                <nav className='side-drawer-nav'>
                    <NavLinks onClick={onClose} />
                </nav>
            </aside>
        </CSSTransition>
    )


    return createPortal(content, document.getElementById('side-drawer-root')!)
}
