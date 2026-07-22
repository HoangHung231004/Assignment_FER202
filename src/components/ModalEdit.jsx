import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputFullName from './InputFullName';
import InputPhoneNumber from './InputPhoneNumber';
import InputEmail from './InputEmail';
import { Accordion } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { findDuplicatePhonesInContacts, parsePhoneNumbers, validateEditOrUpdateForm } from '../ultils/validator';

const ModalEdit = ({ contactsRaw, isOpenModalEdit, setIsOpenModalEdit, selectedContactEdit, setReload }) => {
    // const selectedContactId = selectedContactEdit.id
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [groupId, setGroupId] = useState(0)
    const [errors, setErrors] = useState([])

    useEffect(() => {
        if (!selectedContactEdit || !isOpenModalEdit) return;

        setFullName(selectedContactEdit.fullName ?? '');
        setPhoneNumber(
            Array.isArray(selectedContactEdit.phoneNumber)
                ? selectedContactEdit.phoneNumber.join(" ")
                : (selectedContactEdit.phoneNumber ?? '')
        );
        setEmail(selectedContactEdit.email ?? '');
        setGroupId(selectedContactEdit.groupId ?? 4);
        setErrors([]);
    }, [isOpenModalEdit, selectedContactEdit]);


    // handle edit
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
                // Tăng reload để WorkSpace useEffect fetch lại data mới nhất
                setReload((prev) => prev + 1)
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