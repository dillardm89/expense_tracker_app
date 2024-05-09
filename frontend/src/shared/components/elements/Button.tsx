import { ReactNode } from 'react'
import '../../../../public/styles/components/button.css'


/**
 * ButtonProps
 * @typedef {object} ButtonProps
 * @property {ReactNode} children
 * @property {string} classId CSS id attribute
 * @property {string} type (optional) button type either submit, reset, or button
 * @property {string} to (optional) link destination
 * @property {function} onClick (optional) callback function for handling button click
 */
type ButtonProps = {
    children: ReactNode,
    classId: string,
    type?: 'submit' | 'reset' | 'button',
    to?: string,
    target?: string,
    onClick?: () => void,
}


/**
 * Component for rendering either a button or link element
 * Props passed down from all other components / pages
 * @param {object} ButtonProps
 * @returns {React.JSX.Element}
 */
export default function Button({ onClick, classId, children, type, to, target }: ButtonProps): React.JSX.Element {

    if (to) {
        return (
            <a href={to} className={classId} target={target ? target : '_self'} >
                {children}
            </a>
        )
    } else {
        return (
            <button onClick={onClick} type={type} className={classId}>
                {children}
            </button>
        )
    }
}
