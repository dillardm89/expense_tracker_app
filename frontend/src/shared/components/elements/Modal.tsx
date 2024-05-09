import { useRef, useEffect, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import Backdrop from '../navigation/Backdrop'
import '../../../../public/styles/components/modal.css'


/**
 * ModalProps
 * @typedef {object} ModalProps
 * @property {ReactNode} children
 * @property {boolean} openModal whether to display or hide modal
 * @property {function} onCloseModal callback function to handle close modal
 */
type ModalProps = {
    children: ReactNode,
    openModal: boolean,
    onCloseModal: () => void,
    specialClass?: string,
}



/**
 * Component for rendering a generic overlay modal
 * Props passed down from AlertModal, AuthErrorModal, CookieModal, CriteriaModal, or DeleteModal
 * @param {object} ModalProps
 * @returns {React.JSX.Element}
 */
export default function Modal({ children, openModal, onCloseModal, specialClass }: ModalProps): React.JSX.Element {
    const dialogRef = useRef<HTMLDialogElement>(null)


    useEffect(() => {
        if (openModal) {
            dialogRef.current?.showModal()
            document.querySelector('body')!.id = 'show-modal'
        } else {
            dialogRef.current?.close()
        }
    }, [openModal])


    return (<>
        {openModal && <Backdrop onClose={onCloseModal} />}

        {createPortal(
            <dialog ref={dialogRef} className={specialClass ? specialClass : 'modal'} onClose={onCloseModal}>
                {children}
            </dialog>,
            document.getElementById('modal-root')!
        )}
    </>)
}
