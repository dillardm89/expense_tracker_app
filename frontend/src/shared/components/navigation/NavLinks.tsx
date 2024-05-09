import { NavLink } from 'react-router-dom'
import '../../../../public/styles/navigation/navlinks.css'


/**
 * NavLinksProps
 * @typedef {object} NavLinksProps
 * @property {function} onClick callback function to handle button click
 */
type NavLinksProps = {
    onClick: () => void
}


/**
 * Component for rendering header navigation links
 * @param {NavLinksProps}
 * @returns {React.JSX.Element}
 */
export default function NavLinks({ onClick }: NavLinksProps): React.JSX.Element {
    return (
        <ul className='nav-links'>
            <li onClick={onClick}>
                <NavLink to='/'>Home</NavLink>
            </li>

            <li onClick={onClick}>
                <NavLink to='/settings'>Settings</NavLink>
            </li>
        </ul>
    )
}
