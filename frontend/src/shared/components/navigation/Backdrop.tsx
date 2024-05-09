import { createPortal } from 'react-dom'
import '../../../../public/styles/navigation/backdrop.css'


/**
 * BackdropProps
 * @typedef {object} BackdropProps
 * @property {function} onClose callback function to handle close backdrop overlay
 */
type BackdropProps = {
    onClose: () => void
}


/**
 * Component for rendering site overlay when navigation SideDrawer is displayed
 * Props passed down from MainHeader
 * @param {object} BackdropProps
 * @returns {React.JSX.Element}
 */
export default function Backdrop({ onClose }: BackdropProps): React.JSX.Element {
    return createPortal(
        <div className='backdrop' onClick={onClose}></div>, document.getElementById('backdrop-root')!
    )
}
