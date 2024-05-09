import Button from './Button'
import Modal from './Modal'
import type { InfoModalProps } from '../../../utils/types/shared-types'


/**
 * AlertModalProps
 * @typedef {object} AlertModalProps
 */
type AlertModalProps = InfoModalProps & {
    heading: string,
    message: string,
    type: 'error' | 'info' | 'success'
}


/**
 * Component for rendering modal with various informational / error alerts
 * Props passed down from Auth, AuthHandler, ResetPassword, ProfileHandler,
 *      ProfileInfo, ImageUpload, DeleteUser
 * @param {object} AlertModalProps
 * @returns {React.JSX.Element}
 */
export default function AlertModal({ openModal, heading, message, type, onClear }: AlertModalProps): React.JSX.Element {
    return (
        <Modal onCloseModal={onClear} openModal={openModal}>
            <div id={type === 'error' ? 'error-modal' : 'info-modal'}>
                <h3>{heading}</h3>

                <p id='modal-message'>{message}</p>

                <Button onClick={onClear} type='reset' classId='modal-close-btn'>
                    Close
                </Button>
            </div>
        </Modal>
    )
}
