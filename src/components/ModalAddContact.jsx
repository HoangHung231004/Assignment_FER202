import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import InputFullName from './InputFullName';
import InputPhoneNumber from './InputPhoneNumber';
import InputEmail from './InputEmail';
import axios from 'axios';
import { validateEditOrUpdateForm } from '../ultils/validator';

const ModalAddContact = ({ isOpenAddContactModal, setIsOpenAddContactModal, isAddContact, setIsAddContact, contactsRaw }) => {

    // State
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [groupId, setGroupId] = useState(4)
    // State Error
    const [errors, setErrors] = useState([])

    useEffect(() => {
        setFullName('')
        setErrors([])
        setPhoneNumber('')
        setEmail('')
        setGroupId(4)
    }, [isOpenAddContactModal])
    //_handle add contact
    const handleAddContact = async () => {
        const user = JSON.parse(localStorage.getItem("user"))

        try {
            // get new id
            const newId = contactsRaw.toSorted((a, b) => b.id - a.id)[0].id + 1;
            // console.log(maxId)
            const newContact = {
                id: newId,
                fullName: fullName,
                phoneNumber: phoneNumber,
                email: email,
                groupId: groupId,
                isFavourite: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            //_______Validation_______________________________________________________________________________________
            if (validateEditOrUpdateForm(newContact).length === 0) {
                // setErrors =([]) to reset state
                setErrors([])
                // check duplicate contact (phone, email) => contact can has the same name
                const contactToValidate = contactsRaw
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
                if (!isDuplicateEmail && !isDuplicatePhoneNumber) {
                    // updated contacts
                    const updatedContacts = [...contactsRaw, newContact]
                    console.log(updatedContacts)
                    await axios.patch(`http://localhost:9999/contacts/${user.id}`, { data: updatedContacts })
                    setIsAddContact((prev) => !prev)
                    // close modal
                    setIsOpenAddContactModal((prev) => !prev)
                    setErrors([])
                }
            } else {
                setErrors(validateEditOrUpdateForm(newContact))
            }
        } catch (error) {
            console.log(error.message)
        }
    }
    return (
        <Modal
            show={isOpenAddContactModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    Thêm liên hệ
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
                <button onClick={() => setIsOpenAddContactModal(false)} className='btn btn-outline-danger'>Hủy</button>
                <button onClick={() => handleAddContact()} className='btn btn-outline-success'>Thêm liên hệ</button>
            </Modal.Footer>
        </Modal>
    );
}

export default ModalAddContact