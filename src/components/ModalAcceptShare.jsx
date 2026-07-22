import { useState } from 'react'
import Modal from 'react-bootstrap/Modal'
import { updateContacts, updateShare } from '../services/service'
import { findShareContactConflicts } from '../ultils/validator'

const ModalAcceptShare = ({ share, isOpen, setIsOpen, contactsRaw, setReload }) => {
    const [selectedIds, setSelectedIds] = useState(() => share?.contacts.map((c) => c.id) ?? [])
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const handleClose = () => {
        setIsOpen(false)
        setSelectedIds([])
        setError('')
    }

    const toggleContact = (contactId) => {
        setSelectedIds((prev) =>
            prev.includes(contactId)
                ? prev.filter((id) => id !== contactId)
                : [...prev, contactId]
        )
    }

    const toggleSelectAll = () => {
        if (!share) return
        if (selectedIds.length === share.contacts.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(share.contacts.map((c) => c.id))
        }
    }

    const getNextContactId = (contacts) => {
        if (contacts.length === 0) return 1
        return Math.max(...contacts.map((c) => c.id)) + 1
    }

    const addContactsToUser = async (contactsToAdd) => {
        const user = JSON.parse(localStorage.getItem('user'))
        let updatedContacts = [...contactsRaw]
        let nextId = getNextContactId(updatedContacts)

        contactsToAdd.forEach((contact) => {
            const newContact = {
                ...contact,
                id: nextId,
                isFavourite: 0,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
            updatedContacts.push(newContact)
            nextId += 1
        })

        await updateContacts(user.id, updatedContacts)
    }

    const patchShare = async (status, remainingContacts) => {
        await updateShare(share.id, {
            status,
            contacts: remainingContacts
        })
    }

    const handleAccept = async (acceptAll = false) => {
        if (!share || loading) return

        const idsToAccept = acceptAll
            ? share.contacts.map((c) => c.id)
            : selectedIds

        if (idsToAccept.length === 0) return

        const acceptedContacts = share.contacts.filter((c) => idsToAccept.includes(c.id))
        const conflicts = findShareContactConflicts(acceptedContacts, contactsRaw)

        if (conflicts.length > 0) {
            setError(conflicts.join('. '))
            return
        }

        const remainingContacts = share.contacts.filter((c) => !idsToAccept.includes(c.id))

        setError('')
        setLoading(true)
        try {
            await addContactsToUser(acceptedContacts)
            await patchShare(
                remainingContacts.length === 0 ? 'accepted' : 'pending',
                remainingContacts
            )
            setReload((prev) => prev + 1)
            handleClose()
        } catch {
            setError('Không thể chấp nhận liên hệ. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const handleReject = async () => {
        if (!share || loading) return

        setError('')
        setLoading(true)
        try {
            await patchShare('rejected', [])
            setReload((prev) => prev + 1)
            handleClose()
        } catch {
            setError('Không thể từ chối chia sẻ. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    if (!share) return null

    return (
        <Modal show={isOpen} size="lg" centered onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Liên hệ được chia sẻ</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p>
                    <strong>{share.fromUserName}</strong> muốn chia sẻ {share.contacts.length} liên hệ với bạn.
                </p>
                {error && (
                    <div className="alert alert-danger mb-3" role="alert">
                        {error}
                    </div>
                )}
                <table className="table table-striped mt-3">
                    <thead className="table-primary">
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === share.contacts.length && share.contacts.length > 0}
                                    onChange={toggleSelectAll}
                                />
                            </th>
                            <th>Họ và tên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {share.contacts.map((contact) => (
                            <tr key={contact.id}>
                                <td>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(contact.id)}
                                        onChange={() => toggleContact(contact.id)}
                                    />
                                </td>
                                <td>{contact.fullName}</td>
                                <td>
                                    {(contact.phoneNumber || []).map((phone) => (
                                        <div key={phone}>{phone}</div>
                                    ))}
                                </td>
                                <td>{contact.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Modal.Body>
            <Modal.Footer className="d-flex justify-content-between">
                <button
                    className="btn btn-outline-danger"
                    disabled={loading}
                    onClick={handleReject}
                >
                    Từ chối nhận
                </button>
                <div className="d-flex gap-2">
                    <button
                        className="btn btn-outline-success"
                        disabled={loading || selectedIds.length === 0}
                        onClick={() => handleAccept(false)}
                    >
                        Chấp nhận
                    </button>
                    <button
                        className="btn btn-success"
                        disabled={loading}
                        onClick={() => handleAccept(true)}
                    >
                        Chấp nhận tất cả
                    </button>
                </div>
            </Modal.Footer>
        </Modal>
    )
}

export default ModalAcceptShare
