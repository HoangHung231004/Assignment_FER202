import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

const ModalDelete = ({ isOpenModalDelete, setIsOpenModalDelete, contactsRaw, selectedDelete, setIsDeleted }) => {

    console.log("dasf", selectedDelete.id)
    //____handle Delete
    const handleDelete = async () => {
        const newDatas = contactsRaw.filter((contact) => contact.id !== selectedDelete.id);
        const user = JSON.parse(localStorage.getItem("user"))
        await axios.patch(`http://localhost:9999/contacts/${user.id}`, {
            data: newDatas
        })
        setIsDeleted((prev) => !prev)
        setIsOpenModalDelete((prev) => !prev)
    }

    return (
        <Modal
            show={isOpenModalDelete}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Xác nhận xóa liên hệ khỏi danh bạ
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4 className='text-dange'>Bạn có chắc chắn không</h4>
                Liên lạc sẽ bị xóa vĩnh viễn.
                <div className='fw-bold'>KHÔNG THỂ KHÔI PHỤC</div>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => setIsOpenModalDelete(false)} className='btn btn-outline-dark'>Hủy</button>
                <button onClick={() => handleDelete(selectedDelete)} className='btn btn-outline-danger'>Tiếp tục</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalDelete