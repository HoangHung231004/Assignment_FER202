import { useState } from "react"
import { Pagination } from "react-bootstrap"
import ModalDelete from "../components/ModalDelete"
import ModalEdit from "../components/ModalEdit"
import ModalAddContact from "../components/ModalAddContact"
import ModalShareContact from "../components/ModalShareContact"
import { updateContacts } from "../services/service"

const TableContact = ({
    setReload,
    contactsRaw,
    itemsPagination,
    currentPage,
    setCurrentPage,
    contacts,
    groups,
    selectedGroup,
    setSelectedGroup,
    selectedFavourite,
    setSelectedFavourite,
    searchName,
    setSearchName,
    sortOrder,
    onToggleSort,
    onResetFilters
}) => {

    const formatDate = (ISODate) => {
        const arr = ISODate.split("T")[0].split("-")
        return `${arr[2]} / ${arr[1]} / ${arr[0]}`
    }

    const formatGroup = (groupId) => {
        const nGroup = Number(groupId);
        if (nGroup === 1) return <div className="text-center text-group" style={{ background: '#e5eefe', color: '#2472ff' }}>Gia đình</div>
        if (nGroup === 2) return <div className="text-center text-group" style={{ background: '#e7f6eb', color: '#45a85c' }}>Bạn bè</div>
        if (nGroup === 3) return <div className="text-center text-group" style={{ background: '#fff1e9', color: '#fe7f2c' }}>Công việc</div>
        if (nGroup === 4) return <div className="text-center text-group" style={{ background: '#eff1f5', color: '#818aa5' }}>Khác</div>
        return <div className="text-center text-group" style={{ background: 'black', color: 'white' }}>Gia đình</div>
    }

    //___Sort by name — xử lý ở WorkSpace, không ghi đè contacts
    const sortIcon = sortOrder === 'asc' ? 'bi-sort-alpha-down' : sortOrder === 'desc' ? 'bi-sort-alpha-up' : 'bi-arrow-down-up'

    // ___Modal dialog delete
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
    // ___Modal dialog edit
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false)
    //___Modal dialog add contact
    const [isOpenAddContactModal, setIsOpenAddContactModal] = useState(false)
    const [addContactKey, setAddContactKey] = useState(0)
    //___Modal dialog share contact
    const [isOpenModalShare, setIsOpenModalShare] = useState(false)
    const [selectedContactIds, setSelectedContactIds] = useState([])
    const [error, setError] = useState('')

    const selectedContacts = contactsRaw.filter((c) => selectedContactIds.includes(c.id))

    const toggleSelectContact = (contactId) => {
        setSelectedContactIds((prev) =>
            prev.includes(contactId)
                ? prev.filter((id) => id !== contactId)
                : [...prev, contactId]
        )
    }

    const toggleSelectAllOnPage = () => {
        const pageIds = contacts.map((c) => c.id)
        const allSelected = pageIds.every((id) => selectedContactIds.includes(id))
        if (allSelected) {
            setSelectedContactIds((prev) => prev.filter((id) => !pageIds.includes(id)))
        } else {
            setSelectedContactIds((prev) => [...new Set([...prev, ...pageIds])])
        }
    }

    const isAllPageSelected = contacts.length > 0 && contacts.every((c) => selectedContactIds.includes(c.id))

    const [selectedContactEdit, setSelectedContactEdit] = useState({})
    //___Handle Edit button
    const handleEdit = (contact) => {
        setIsOpenModalEdit(true)
        setSelectedContactEdit(contact)
    }

    //___Handle Add contact
    const handleAddContact = () => {
        setAddContactKey((prev) => prev + 1)
        setIsOpenAddContactModal(true)
    }

    //__Handle Delete
    const handleDelete = (contact) => {
        setIsOpenModalDelete(true)
        setSelectedContactEdit(contact)
    }

    //__Handle Change Star
    const handleChangeStar = async (contact) => {
        const user = JSON.parse(localStorage.getItem("user"))
        setError('')

        const newDatasToUpdated = contactsRaw.map((c) => c.id === contact.id
            ? {
                ...c,
                isFavourite: c.isFavourite === 1 ? 0 : 1,
                updatedAt: new Date().toISOString()
            }
            :
            c)

        try {
            await updateContacts(user.id, newDatasToUpdated)
            setReload((prev) => prev + 1)
            setSelectedContactEdit(contact)
        } catch {
            setError('Không thể cập nhật yêu thích. Vui lòng thử lại.')
        }
    }


    return (
        <div className="mt-3 p-0 work-space-contact border">
            {error && (
                <div className="container mt-3 mb-0">
                    <div className="alert alert-danger mb-0" role="alert">
                        {error}
                    </div>
                </div>
            )}
            {/* ____Filter */}
            <div className="d-flex align-item-baseline filter-space container">
                {/*____Group */}
                <div className="filter-item">
                    <select className="form-select"
                        value={selectedGroup}
                        onChange={(e) => setSelectedGroup(e.target.value)}>
                        <option value={'all'}>Tất cả nhóm</option>
                        {groups.map((gr) => <option value={gr.id}>{gr.name}</option>)}
                    </select>
                </div>
                {/*___ favourite _________ */}
                <div className="filter-item">
                    <select className="form-select"
                        value={selectedFavourite}
                        onChange={(e) => setSelectedFavourite(e.target.value)}>
                        <option value={'all'}>Tất cả</option>
                        <option value={1}>Yêu thích</option>
                        <option value={0}>Không yêu thích</option>
                    </select>
                </div>
                {/*___Search by name OR email____*/}
                <div className="filter-item">
                    <input type="text" className="form-control"
                        placeholder="Search by NAME or EMAIL"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)} />
                </div>
                {/*__Reset */}
                <div className="filter-item">
                    <button
                        type="button"
                        className="w-75 btn btn-danger btn-outline-black text-center d-flex justify-content-center align-items-center px-3"
                        onClick={() => {
                            onResetFilters()
                            setSelectedContactIds([])
                        }}
                        title="Reset bộ lọc"
                    >
                        <i className="p-0 m-0 bi bi-arrow-repeat"></i>
                    </button>
                </div>
                {/*__Share Contact */}
                <div className="filter-item">
                    <button
                        className="btn btn-outline-success d-flex justify-content-center align-items-center gap-2"
                        disabled={selectedContactIds.length === 0}
                        onClick={() => setIsOpenModalShare(true)}
                    >
                        <div className="fw-bold">Chia sẻ ({selectedContactIds.length})</div>
                        <i className="bi bi-share" style={{ fontSize: '24px' }}></i>
                    </button>
                </div>
                {/*__Add Contact */}
                <div className="filter-item">
                    <button className="btn  btn-outline-primary d-flex justify-content-center align-items-center gap-3"
                        onClick={() => handleAddContact()}>
                        <div className="fw-bold">Thêm liên hệ</div>  <i className="bi bi-journal-plus" style={{ fontSize: '30px' }}></i>
                    </button>
                </div>
            </div>
            {/* <hr /> */}
            <div className="container">
                <table className="table table-stripped table-data mt-3">
                    <thead className="table-primary">
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    checked={isAllPageSelected}
                                    onChange={toggleSelectAllOnPage}
                                />
                            </th>
                            <th>#</th>
                            <th style={{ cursor: 'pointer' }} onClick={onToggleSort}>
                                Họ và tên <i className={`bi ${sortIcon} ms-1`}></i>
                            </th>
                            <th>Số điện thoại</th>
                            <th>Email</th>
                            <th>Nhóm</th>
                            <th className="text-center">Yêu thích</th>
                            <th className="text-center" style={{ cursor: 'pointer' }}>Ngày tạo</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact) => {
                            return (
                                <tr key={contact.id}>
                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={selectedContactIds.includes(contact.id)}
                                            onChange={() => toggleSelectContact(contact.id)}
                                        />
                                    </td>
                                    <td className="fw-bold">{contact.id}</td>
                                    <td>{contact.fullName}</td>
                                    <td>{contact.phoneNumber.map((phone) => <div>{phone}</div>)}</td>
                                    <td>{contact.email}</td>
                                    <td>{formatGroup(contact.groupId)}</td>
                                    <td className="text-center">
                                        {Number(contact.isFavourite) === 1
                                            ?
                                            <i className="bi bi-star-fill" style={{ color: '#ffbb00', cursor: 'pointer' }}
                                                onClick={() => handleChangeStar(contact)}></i>
                                            :
                                            <i className="bi bi-star" style={{ cursor: 'pointer' }}
                                                onClick={() => handleChangeStar(contact)}></i>}
                                    </td>
                                    <td className="text-center">{formatDate(contact.createdAt)}</td>
                                    <td className="d-flex" >
                                        {/*_____Edit button */}
                                        <button className="w-50 h-50 btn btn-outline-warning" style={{ color: 'black' }}
                                            onClick={() => handleEdit(contact)}>
                                            <i className="bi bi-pencil p-0"></i>
                                        </button>
                                        {/*_____Delete button */}
                                        <button className="w-50 h-50 btn btn-outline-danger"
                                            onClick={() => handleDelete(contact)}>
                                            <i className="bi bi-trash p-0"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
                <div>
                    <Pagination className="d-flex justify-content-center">
                        <Pagination.Item disabled={currentPage === 1 ? true : false} onClick={() => setCurrentPage((prev) => prev - 1)}>
                            <i className="bi bi-arrow-left"></i>
                        </Pagination.Item>
                        {itemsPagination.map((item) => {
                            return (
                                <Pagination.Item active={currentPage === item} onClick={() => setCurrentPage(item)}>
                                    {item}
                                </Pagination.Item>)
                        })}
                        <Pagination.Item disabled={currentPage === itemsPagination.length ? true : false} onClick={() => setCurrentPage((prev) => prev + 1)}>
                            <i className="bi bi-arrow-right"></i>
                        </Pagination.Item>
                    </Pagination>
                </div>
            </div>

            {/*_______Modal__________ */}
            <ModalDelete
                isOpenModalDelete={isOpenModalDelete}
                setIsOpenModalDelete={setIsOpenModalDelete}
                contactsRaw={contactsRaw}
                selectedDelete={selectedContactEdit}
                setReload={setReload}
            >
            </ModalDelete>
            <ModalEdit
                key={selectedContactEdit?.id ?? 'edit'}
                setReload={setReload}
                contactsRaw={contactsRaw}
                isOpenModalEdit={isOpenModalEdit}
                setIsOpenModalEdit={setIsOpenModalEdit}
                selectedContactEdit={selectedContactEdit}>
            </ModalEdit>
            <ModalAddContact
                key={addContactKey}
                setReload={setReload}
                contactsRaw={contactsRaw}
                isOpenAddContactModal={isOpenAddContactModal}
                setIsOpenAddContactModal={setIsOpenAddContactModal}>
            </ModalAddContact>
            <ModalShareContact
                isOpen={isOpenModalShare}
                setIsOpen={setIsOpenModalShare}
                selectedContacts={selectedContacts}
                setSelectedContactIds={setSelectedContactIds}
                setReload={setReload}
            />
        </div >
    )
}

export default TableContact