import Modal from 'react-bootstrap/Modal';
import InputFullName from './InputFullName';
import InputPhoneNumber from './InputPhoneNumber';
import InputEmail from './InputEmail';
import { useState } from 'react';
import { updateContacts } from '../services/service';
import { findDuplicatePhonesInContacts, parsePhoneNumbers, validateEditOrUpdateForm } from '../ultils/validator';

const getInitialPhoneNumber = (contact) => {
    if (Array.isArray(contact?.phoneNumber)) {
        return contact.phoneNumber.join(' ')
    }
    return contact?.phoneNumber ?? ''
}

const ModalEdit = ({ contactsRaw, isOpenModalEdit, setIsOpenModalEdit, selectedContactEdit, setReload }) => {
    const [fullName, setFullName] = useState(() => selectedContactEdit?.fullName ?? '')
    const [phoneNumber, setPhoneNumber] = useState(() => getInitialPhoneNumber(selectedContactEdit))
    const [email, setEmail] = useState(() => selectedContactEdit?.email ?? '')
    const [groupId, setGroupId] = useState(() => selectedContactEdit?.groupId ?? 4)
    const [errors, setErrors] = useState([])

    const updatedContact = async () => {
        const parsedPhoneNumbers = parsePhoneNumbers(phoneNumber)
        const newInfor = {
            id: selectedContactEdit.id,
            fullName: fullName,
            phoneNumber: parsedPhoneNumbers,
            email: email,
            groupId: groupId
        }

        const userLogin = JSON.parse(localStorage.getItem("user"))
        const validationErrors = validateEditOrUpdateForm(newInfor)
        if (validationErrors.length === 0) {
            setErrors([])
            const contactToValidate = contactsRaw.filter((contact) => contact.id !== selectedContactEdit.id)
            const isDuplicateEmail = contactToValidate.find((contact) => contact.email === email.trim())
            const duplicatePhones = findDuplicatePhonesInContacts(
                phoneNumber,
                contactToValidate,
                selectedContactEdit.id
            )

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
                const updatedContacts = contactsRaw.map((contact) => Number(contact.id) === Number(selectedContactEdit.id)
                    ? {
                        ...contact,
                        ...newInfor
                    }
                    : contact)

                try {
                    await updateContacts(userLogin.id, updatedContacts)
                    setIsOpenModalEdit(false)
                    setReload((prev) => prev + 1)
                } catch {
                    setErrors([{ errorName: 'submit', message: 'Không thể cập nhật liên hệ. Vui lòng thử lại.' }])
                }
            }
        } else {
            setErrors(validationErrors)
        }
    }

    return (
        <Modal
            show={isOpenModalEdit}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Chỉnh sửa liên hệ
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
                                <div className='modal-group-buttons'>
                                    <button type="button" className={`btn ${groupId === 1 ? `btn-primary` : `btn-outline-dark`}`} onClick={() => setGroupId(1)}>Gia đình</button>
                                    <button type="button" className={`btn ${groupId === 2 ? `btn-success` : `btn-outline-dark`}`} onClick={() => setGroupId(2)}>Bạn bè</button>
                                    <button type="button" className={`btn ${groupId === 3 ? `btn-warning` : `btn-outline-dark`}`} onClick={() => setGroupId(3)}>Công việc</button>
                                    <button type="button" className={`btn ${groupId === 4 ? `btn-dark` : `btn-outline-dark`}`} onClick={() => setGroupId(4)}>Khác</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                {errors.map((er) => er.errorName === 'submit' ? <div className='text-danger'>{er.message}</div> : '')}
            </Modal.Body>
            <Modal.Footer>
                <button type="button" onClick={() => setIsOpenModalEdit(false)} className='btn btn-outline-dark'>Hủy</button>
                <button type="button" onClick={updatedContact} className='btn btn-outline-warning'>Cập nhật</button>
            </Modal.Footer>
        </Modal >
    );
}

export default ModalEdit
