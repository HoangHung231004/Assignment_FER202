import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import { getTrash, updateTrash, updateContacts } from '../services/service';

const ModalDelete = ({ isOpenModalDelete, setIsOpenModalDelete, contactsRaw, selectedDelete, setReload }) => {
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setError('')
        setIsOpenModalDelete(false)
    }

    const handleDelete = async () => {
        const user = JSON.parse(localStorage.getItem("user"))
        setError('')
        setLoading(true)

        try {
            const newContacts = contactsRaw.filter((contact) => contact.id !== selectedDelete.id);

            const resTrash = await getTrash(user.id)
            const trashData = resTrash.data.data || []
            const deletedContact = {
                ...selectedDelete,
                deletedAt: new Date().toISOString()
            }

            await Promise.all([
                updateTrash(user.id, [...trashData, deletedContact]),
                updateContacts(user.id, newContacts)
            ])

            setReload((prev) => prev + 1)
            handleClose()
        } catch {
            setError('Không thể xóa liên hệ. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <Modal
            show={isOpenModalDelete}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Xác nhận xóa liên hệ khỏi danh bạ
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className='text-danger'>Bạn có chắc chắn không?</h4>
                Liên hệ sẽ được chuyển vào thùng rác.
                <div className='fw-bold'>Bạn có thể khôi phục lại sau.</div>
                {error && <div className="alert alert-danger mt-3 mb-0">{error}</div>}
            </Modal.Body>
            <Modal.Footer>
                <button onClick={handleClose} className='btn btn-outline-dark' disabled={loading}>Hủy</button>
                <button onClick={handleDelete} className='btn btn-outline-danger' disabled={loading}>Tiếp tục</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDelete
