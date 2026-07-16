import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputFullName from './InputFullName';
import InputPhoneNumber from './InputPhoneNumber';
import InputEmail from './InputEmail';
import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { validateEditOrUpdateForm } from '../ultils/validator';

const ModalEdit = ({ contactsRaw, isOpenModalEdit, setIsOpenModalEdit, selectedContactEdit, setIsEdited }) => {
    // const selectedContactId = selectedContactEdit.id
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [groupId, setGroupId] = useState(0)

    useEffect(() => {
        if (!selectedContactEdit) return;

        setFullName(selectedContactEdit.fullName ?? '');
        setPhoneNumber(selectedContactEdit.phoneNumber ?? '');
        setEmail(selectedContactEdit.email ?? '');
        setGroupId(selectedContactEdit.groupId ?? 4);
        setErrors([]);
    }, [isOpenModalEdit]);


    // State Error
    const [errors, setErrors] = useState([])
    // handle edit
    const updatedContact = async () => {
        const newInfor = {
            id: selectedContactEdit.id,
            fullName: fullName,
            phoneNumber: phoneNumber,
            email: email,
            groupId: groupId
        }

        const userLogin = JSON.parse(localStorage.getItem("user"))
        // Update new contact's info
        if (validateEditOrUpdateForm(newInfor).length === 0) {
            // setErrors =([]) to reset state
            setErrors([])
            // check duplicate contact (phone, email) => contact can has the same name
            const contactToValidate = contactsRaw.filter((contact) => contact.id !== selectedContactEdit.id)
            const isDuplicateEmail = contactToValidate.find((contact) => contact.email === email)
            const isDuplicatePhoneNumber = contactToValidate.find((contact) => contact.phoneNumber === phoneNumber)
            // If info is duplicate => display errors and return
            if (isDuplicateEmail) {
                setErrors(prevErrors => [
                    ...prevErrors.filter(error => error.errorName !== 'email'),
                    { errorName: 'email', message: `Email này đã được lưu cho ${isDuplicateEmail.fullName}. Vui lòng kiểm tra lại!` }])
            }
            if (isDuplicatePhoneNumber) {
                setErrors(prevErrors => [
                    ...prevErrors.filter(error => error.errorName !== 'phone'),
                    {
                        errorName: 'phone',
                        message: `Số điện thoại này đã được lưu cho ${isDuplicatePhoneNumber.fullName}. Vui lòng kiểm tra lại!`
                    }
                ]);
            }
            // if not duplicate => allow to update
            if (!isDuplicateEmail && !isDuplicatePhoneNumber) {
                // new contacts info to update
                const updatedContacts = contactsRaw.map((contact) => Number(contact.id) === Number(selectedContactEdit.id)
                    ? {
                        ...contact,
                        ...newInfor
                    }
                    : contact)

                try {
                    await axios.patch(`http://localhost:9999/contacts/${userLogin.id}`, {
                        data: updatedContacts
                    })
                } catch (error) {
                    console.log(error.message)
                }
                // close modal
                setIsOpenModalEdit(false)
                // setIsEdited to fetch data again at parent component
                setIsEdited((prev) => !prev)
            }
        } else {
            setErrors(validateEditOrUpdateForm(newInfor))
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
                {/* {console.log(typeof selectedContactEdit.fullName)} */}
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
                                    <button className={`btn ${groupId === 1 ? `btn-primary` : `btn-outline-dark`} w-25 text-center`} onClick={() => setGroupId(1)}>Gia đình</button>
                                    <button className={`btn ${groupId === 2 ? `btn-success` : `btn-outline-dark`} w-25 text-center`} onClick={() => setGroupId(2)}>Bạn bè</button>
                                    <button className={`btn ${groupId === 3 ? `btn-warning` : `btn-outline-dark`} w-25 text-center`} onClick={() => setGroupId(3)}>Công việc</button>
                                    <button className={`btn ${groupId === 4 ? `btn-dark` : `btn-outline-dark`} w-25 text-center`} onClick={() => setGroupId(4)}>Khác</button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer>
                <button onClick={() => setIsOpenModalEdit(false)} className='btn btn-outline-dark'>Hủy</button>
                <button onClick={() => updatedContact()} className='btn btn-outline-warning'>Cập nhật</button>
            </Modal.Footer>
        </Modal >
    );
}

export default ModalEdit