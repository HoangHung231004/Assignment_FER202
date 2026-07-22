import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import axios from 'axios'
import { validateEmail } from '../ultils/validator'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999'

const ModalShareContact = ({
    isOpen,
    setIsOpen,
    selectedContacts,
    setSelectedContactIds,
    setReload
}) => {
    const [email, setEmail] = useState('')
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const handleClose = () => {
        setIsOpen(false)
        setEmail('')
        setError('')
        setSuccess('')
    }

    const handleShare = async () => {
        setError('')
        setSuccess('')

        const emailError = validateEmail(email)
        if (emailError) {
            setError(emailError)
            return
        }

        const user = JSON.parse(localStorage.getItem('user'))
        const targetEmail = email.trim()

        try {
            const resUsers = await axios.get(`${API}/users?email=${targetEmail}`)
            const targetUser = resUsers.data[0]

            if (!targetUser) {
                setError('Email không tồn tại trong hệ thống')
                return
            }

            if (Number(targetUser.id) === Number(user.id)) {
                setError('Bạn không thể chia sẻ cho chính mình')
                return
            }

            const shareData = {
                fromUserId: user.id,
                fromUserName: user.fullName,
                toUserId: targetUser.id,
                toEmail: targetUser.email,
                status: 'pending',
                contacts: selectedContacts,
                createdAt: new Date().toISOString()
            }

            await axios.post(`${API}/shares`, shareData)

            setSuccess('Đã chia sẻ thành công')
            setSelectedContactIds([])
            setReload((prev) => prev + 1)

            setTimeout(() => {
                handleClose()
            }, 1500)
        } catch {
            setError('Không thể chia sẻ. Vui lòng thử lại.')
        }
    }

    return (
        <Modal show={isOpen} size="lg" centered onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Chia sẻ liên hệ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className="text-muted">
                    Bạn đang chia sẻ <strong>{selectedContacts.length}</strong> liên hệ.
                </p>
                <div className="mb-3">
                    <label className="fw-bold">Email người nhận</label>
                    <input
                        type="text"
                        className="form-control mt-1"
                        placeholder="example@gmail.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value.trim())}
                    />
                </div>
                {error && <p className="text-danger">{error}</p>}
                {success && <p className="text-success fw-bold">{success}</p>}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-outline-dark" onClick={handleClose}>Hủy</button>
                <button className="btn btn-primary" onClick={handleShare}>Chia sẻ</button>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalShareContact
