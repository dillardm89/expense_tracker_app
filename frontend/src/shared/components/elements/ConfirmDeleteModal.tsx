import Modal from './Modal'
import Button from './Button'


/**
 * ConfirmDeleteModalProps
 * @typedef {object} ConfirmDeleteModalProps
 * @property {boolean} openModal determines whether to display modal
 * @property {string} typeString item type to be deleted for heading and message
 * @property {function} onConfirmDelete callback function to handle deleting item
 * @property {function} onCloseModal callback function to handle closing modal
 */
type ConfirmDeleteModalProps = {
    openModal: boolean,
    typeString: string,
    onConfirmDelete: () => void,
    onCloseModal: () => void,
}


/**
 * Component for modal to confirm item deletion
 * Props passed down from various components
 * @param {object} ConfirmDeleteModalProps
 * @returns {React.JSX.Element}
 */
export default function ConfirmDeleteModal({ typeString, openModal, onCloseModal, onConfirmDelete }: ConfirmDeleteModalProps): React.JSX.Element {
    return (
        <Modal openModal={openModal} onCloseModal={onCloseModal}>
            <div id='error-modal'>
                <h3>Warning: {typeString} may be deleted</h3>

                <p id='modal-message'>
                    Are you sure you want to delete this {typeString}?
                </p>

                <div className="modal-btn-div">
                    <Button onClick={onConfirmDelete} type='button' classId='modal-delete-btn'>
                        Delete
                    </Button>

                    <Button onClick={onCloseModal} type='reset' classId='modal-close-btn'>
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>)
}
