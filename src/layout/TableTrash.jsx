import { useState } from "react"
import Modal from "react-bootstrap/Modal"
import { updateContacts, updateTrash } from "../services/service"

const TableTrash = ({ trashContacts, contactsRaw, setReload }) => {
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
    const [selectedDelete, setSelectedDelete] = useState(null)
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const formatDate = (ISODate) => {
        if (!ISODate) return ""
        const arr = ISODate.split("T")[0].split("-")
        return `${arr[2]} / ${arr[1]} / ${arr[0]}`
    }

    const formatGroup = (groupId) => {
        const nGroup = Number(groupId);
        if (nGroup === 1) return <div className="text-center text-group" style={{ background: '#e5eefe', color: '#2472ff' }}>Gia đình</div>
        if (nGroup === 2) return <div className="text-center text-group" style={{ background: '#e7f6eb', color: '#45a85c' }}>Bạn bè</div>
        if (nGroup === 3) return <div className="text-center text-group" style={{ background: '#fff1e9', color: '#fe7f2c' }}>Công việc</div>
        if (nGroup === 4) return <div className="text-center text-group" style={{ background: '#eff1f5', color: '#818aa5' }}>Khác</div>
        return <div className="text-center text-group" style={{ background: 'black', color: 'white' }}>Khác</div>
    }

    const handleRestore = async (contact) => {
        const user = JSON.parse(localStorage.getItem("user"))
        setError('')
        setLoading(true)

        try {
            // Nếu id đã tồn tại trong danh bạ thì tạo id mới
            const existingIds = contactsRaw.map((c) => c.id)
            let restoredContact = { ...contact }
            delete restoredContact.deletedAt
            if (existingIds.includes(contact.id)) {
                const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0
                restoredContact = { ...restoredContact, id: maxId + 1 }
            }
            restoredContact.updatedAt = new Date().toISOString()

            const newTrash = trashContacts.filter((c) => c.id !== contact.id)

            await Promise.all([
                updateContacts(user.id, [...contactsRaw, restoredContact]),
                updateTrash(user.id, newTrash)
            ])

            setReload((prev) => prev + 1)
        } catch {
            setError('Không thể khôi phục liên hệ. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    const openPermanentDelete = (contact) => {
        setSelectedDelete(contact)
        setIsOpenModalDelete(true)
    }

    // Xóa hoàn toàn khỏi thùng rác — không thể khôi phục
    const handlePermanentDelete = async () => {
        if (!selectedDelete || loading) return
        const user = JSON.parse(localStorage.getItem("user"))
        setError('')
        setLoading(true)

        try {
            const newTrash = trashContacts.filter((c) => c.id !== selectedDelete.id)

            await updateTrash(user.id, newTrash)

            setIsOpenModalDelete(false)
            setSelectedDelete(null)
            setReload((prev) => prev + 1)
        } catch {
            setError('Không thể xóa hoàn toàn liên hệ. Vui lòng thử lại.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="mt-3 p-0 work-space-contact border">
            <div className="container mt-3 mb-2">
                <h5 className="fw-bold">Thùng rác</h5>
                <p className="text-muted mb-0">Các liên hệ đã xóa. Nhấn khôi phục để đưa trở lại danh bạ, hoặc xóa hoàn toàn để không thể khôi phục.</p>
                {error && (
                    <div className="alert alert-danger mt-3 mb-0" role="alert">
                        {error}
                    </div>
                )}
            </div>
            <div className="container">
                <table className="table table-stripped table-data mt-3">
                    <thead className="table-primary">
                        <tr>
                            <th>#</th>
                            <th>Họ và tên</th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Nhóm</th>
                            <th className="text-center">Ngày xóa</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {trashContacts.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center text-muted py-4">
                                    Thùng rác trống
                                </td>
                            </tr>
                        ) : (
                            trashContacts.map((contact) => (
                                <tr key={contact.id}>
                                    <td className="fw-bold">{contact.id}</td>
                                    <td>{contact.fullName}</td>
                                    <td>{(contact.phoneNumber || []).map((phone) => <div key={phone}>{phone}</div>)}</td>
                                    <td>{contact.email}</td>
                                    <td>{formatGroup(contact.groupId)}</td>
                                    <td className="text-center">{formatDate(contact.deletedAt || contact.updatedAt)}</td>
                                    <td className="d-flex gap-2">
                                        <button
                                            className="btn btn-outline-success"
                                            disabled={loading}
                                            onClick={() => handleRestore(contact)}
                                        >
                                            <i className="bi bi-arrow-counterclockwise me-1"></i>
                                            Khôi phục
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            disabled={loading}
                                            onClick={() => openPermanentDelete(contact)}
                                        >
                                            <i className="bi bi-trash me-1"></i>
                                            Xóa hoàn toàn
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <Modal
                show={isOpenModalDelete}
                size="lg"
                aria-labelledby="permanent-delete-title"
                centered
            >
                <Modal.Header closeButton onHide={() => setIsOpenModalDelete(false)}>
                    <Modal.Title id="permanent-delete-title">
                        Xác nhận xóa hoàn toàn
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <h4 className="text-danger">Bạn có chắc chắn không?</h4>
                    Liên hệ <strong>{selectedDelete?.fullName}</strong> sẽ bị xóa vĩnh viễn khỏi thùng rác.
                    <div className="fw-bold mt-2">KHÔNG THỂ KHÔI PHỤC</div>
                </Modal.Body>
                <Modal.Footer>
                    <button
                        onClick={() => setIsOpenModalDelete(false)}
                        className="btn btn-outline-dark"
                    >
                        Hủy
                    </button>
                    <button
                        onClick={handlePermanentDelete}
                        className="btn btn-outline-danger"
                        disabled={loading}
                    >
                        Xóa hoàn toàn
                    </button>
                </Modal.Footer>
            </Modal>
        </div>
    )
}

export default TableTrash
