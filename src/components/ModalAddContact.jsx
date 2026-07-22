import { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import InputFullName from './InputFullName';
import InputPhoneNumber from './InputPhoneNumber';
import InputEmail from './InputEmail';
import { updateContacts } from '../services/service';
import { findDuplicatePhonesInContacts, parsePhoneNumbers, validateEditOrUpdateForm } from '../ultils/validator';

const ModalAddContact = ({ isOpenAddContactModal, setIsOpenAddContactModal, setReload, contactsRaw }) => {
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [groupId, setGroupId] = useState(4)
    const [errors, setErrors] = useState([])

    const resetForm = () => {
        setFullName('')
        setErrors([])
        setPhoneNumber('')
        setEmail('')
        setGroupId(4)
    }

    const handleClose = () => {
        resetForm()
        setIsOpenAddContactModal(false)
    }

    const handleAddContact = async () => {
        const user = JSON.parse(localStorage.getItem("user"))

        try {
            const newId = contactsRaw.length === 0
                ? 1
                : contactsRaw.toSorted((a, b) => b.id - a.id)[0].id + 1
            const parsedPhoneNumbers = parsePhoneNumbers(phoneNumber)
            const newContact = {
                id: newId,
                fullName: fullName,
                phoneNumber: parsedPhoneNumbers,
                email: email,
                groupId: groupId,
                isFavourite: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }

            const validationErrors = validateEditOrUpdateForm(newContact)
            if (validationErrors.length === 0) {
                setErrors([])
                const contactToValidate = contactsRaw
                const isDuplicateEmail = contactToValidate.find((contact) => contact.email === email.trim())
                const duplicatePhones = findDuplicatePhonesInContacts(phoneNumber, contactToValidate)

                if (isDuplicateEmail) {
                    setErrors(prevErrors => [
                        ...prevErrors.filter(error => error.errorName !== 'email'),
                        { errorName: 'email', message: `Email này đã được lưu cho ${isDuplicateEmail.fullName.trim()}. Vui lòng kiểm tra lại!` }])
                }
                if (duplicatePhones.length > 0) {
                    setErrors(prevErrors => [
                        ...prevErrors.filter(error => error.errorName !== 'phone'),
                        {
                            errorName: 'phone',
                            message: duplicatePhones
                                .map(({ phone, contactName }) => `Số ${phone} đã được lưu cho ${contactName}`)
                                .join(". ")
                        }
                    ]);
                }
                if (!isDuplicateEmail && duplicatePhones.length === 0) {
                    const updatedContacts = [...contactsRaw, newContact]
                    await updateContacts(user.id, updatedContacts)
                    setReload((prev) => prev + 1)
                    handleClose()
                }
            } else {
                setErrors(validationErrors)
            }
        } catch {
            setErrors([{ errorName: 'submit', message: 'Không thể thêm liên hệ. Vui lòng thử lại.' }])
        }
    }

    return (
        <Modal
            show={isOpenAddContactModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            onHide={handleClose}
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thêm liên hệ
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <h4>Nhập thông tin</h4>
                <table className='table'>
                    <tbody>
                        <tr>
                            <td>
                                <InputFullName fullName={fullName} setFullName={setFullName}></InputFullName>
                                {errors.map((er) => er.errorName === 'fullName' ? <div className='text-danger'>{er.message}</div> : '')}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <InputPhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}></InputPhoneNumber>
                                {errors.map((er) => er.errorName === 'phone' ? <div className='text-danger'>{er.message}</div> : '')}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <InputEmail email={email} setEmail={setEmail}></InputEmail>
                                {errors.map((er) => er.errorName === 'email' ? <div className='text-danger'>{er.message}</div> : '')}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <div className='fw-bold'>Phân loại quan hệ</div>
                                <div className='d-flex'>
                                    <button type="button" className={`btn ${groupId === 1 ? `btn-primary` : `btn-outline-dark`} w-25 text-center`} onClick={() => setGroupId(1)}>Gia đình</button>
                                    <button type="button" className={`btn ${groupId === 2 ? `btn-success` : `btn-outline-dark`} w-25 text-center`} onClick={() => setGroupId(2)}>Bạn bè</button>
                                    <button type="button" className={`btn ${groupId === 3 ? `btn-warning` : `btn-outline-dark`} w-25 text-center`} onClick={() => setGroupId(3)}>Công việc</button>
                                    <button type="button" className={`btn ${groupId === 4 ? `btn-dark` : `btn-outline-dark`} w-25 text-center`} onClick={() => setGroupId(4)}>Khác</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {errors.map((er) => er.errorName === 'submit' ? <div className='text-danger'>{er.message}</div> : '')}
            </Modal.Body>
            <Modal.Footer>
                <button type="button" onClick={handleClose} className='btn btn-outline-danger'>Hủy</button>
                <button type="button" onClick={handleAddContact} className='btn btn-outline-success'>Thêm liên hệ</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAddContact
