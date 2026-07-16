import { useEffect, useState } from "react"
import { Pagination } from "react-bootstrap"
import ModalDelete from "../components/ModalDelete"
import ModalEdit from "../components/ModalEdit"
import ModalAddContact from "../components/ModalAddContact"
import axios from "axios"

const TableContact = ({
    isChangeStar, setIsChangeStar,
    isDeleted, setIsDeleted,
    isEdited, setIsEdited,
    isAddContact, setIsAddContact,
    setContacts,
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
    setSearchName
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

    //___Sort by name
    const [isSorted, setIsSorted] = useState(false)
    const handleSortedName = (e) => {
        e.preventDefault
        if (isSorted === true) {
            const arr = contactsRaw.toSorted((a, b) => {
                const arrLengthName = a.fullName.split(" ").length
                const nameA = a.fullName.split(" ")[arrLengthName - 1]
                const arrLengthNameB = b.fullName.split(" ").length
                const nameB = b.fullName.split(" ")[arrLengthNameB - 1]
                return nameA.toLowerCase().localeCompare(nameB.toLowerCase(), "vi")
            })
            setContacts(arr)
        } else {
            const arr = contactsRaw.toSorted((a, b) => {
                const arrLengthName = a.fullName.split(" ").length
                const nameA = a.fullName.split(" ")[arrLengthName - 1]
                const arrLengthNameB = b.fullName.split(" ").length
                const nameB = b.fullName.split(" ")[arrLengthNameB - 1]
                return nameB.toLowerCase().localeCompare(nameA.toLowerCase(), "vi")
            })
            setContacts(arr)
        }
        setIsSorted((prev) => !prev)
    }

    // ___Modal dialog delete
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false)
    // ___Modal dialog edit
    const [isOpenModalEdit, setIsOpenModalEdit] = useState(false)
    //___Modal dialog add contact
    const [isOpenModalAddContact, setIsOpenModalAddContact] = useState(false)

    const [selectedContactEdit, setSelectedContactEdit] = useState({})
    //___Handle Edit button
    const handleEdit = (contact) => {
        setIsOpenModalEdit(true)
        setSelectedContactEdit(contact)
    }

    //___Handle Add contact
    const [isOpenAddContactModal, setIsOpenAddContactModal] = useState(false)
    const handleAddContact = () => {
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
        const newDatasToUpdated = contactsRaw.map((c) => c.id === contact.id
            ? {
                ...c,
                isFavourite: c.isFavourite === 1 ? 0 : 1,
                updatedAt: new Date().toISOString()
            }
            :
            c)
        await axios.patch(` http://localhost:9999/contacts/${user.id}`, {
            data: newDatasToUpdated
        })
        setIsChangeStar((prev) => !prev)
        setSelectedContactEdit(contact)
    }


    return (
        <div className="mt-3 p-0 work-space-contact border">
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
                    <button className="w-75 btn btn-danger btn-outline-black text-center d-flex justify-content-center align-items-center px-3">
                        <i className="p-0 m-0 bi bi-arrow-repeat"></i>
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
                            <th>#</th>
                            <th style={{ cursor: 'pointer' }} onClick={(e) => handleSortedName(e)}>Họ và tên</th>
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
                                <tr>
                                    <td className="fw-bold">{contact.id}</td>
                                    <td>{contact.fullName}</td>
                                    <td>{contact.phoneNumber}</td>
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
                setIsDeleted={setIsDeleted}
            >
            </ModalDelete>
            <ModalEdit
                isEdited={isEdited}
                setIsEdited={setIsEdited}
                contactsRaw={contactsRaw}
                isOpenModalEdit={isOpenModalEdit}
                setIsOpenModalEdit={setIsOpenModalEdit}
                selectedContactEdit={selectedContactEdit}>
            </ModalEdit>
            <ModalAddContact
                isAddContact={isAddContact}
                setIsAddContact={setIsAddContact}
                contactsRaw={contactsRaw}
                isOpenAddContactModal={isOpenAddContactModal}
                setIsOpenAddContactModal={setIsOpenAddContactModal}>
            </ModalAddContact>
        </div >
    )
}

export default TableContact