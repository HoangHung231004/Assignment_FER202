import ListCard from "./ListCard"
import TableContact from "./TableContact"
import TableTrash from "./TableTrash"
import NotificationShare from "./NotificationShare"
import ModalAcceptShare from "../components/ModalAcceptShare"
import { useSearchParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import axios from "axios"
import SettingProfile from "../pages/SettingProfile"

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:9999'

const WorkSpace = () => {
    const [searchParams] = useSearchParams()
    const tab = searchParams.get("tab")

    const [error, setError] = useState()
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem("user") || "null")
    // State
    const [contacts, setContacts] = useState([])
    const [trashContacts, setTrashContacts] = useState([])
    const [groups, setGroups] = useState([])
    const [pendingShares, setPendingShares] = useState([])
    const [activeShare, setActiveShare] = useState(null)
    const [isOpenAcceptModal, setIsOpenAcceptModal] = useState(false)
    // Tăng reload mỗi khi thêm / sửa / xóa / khôi phục / đổi yêu thích / chia sẻ → useEffect fetch lại data
    const [reload, setReload] = useState(0)

    // Fetch data mới nhất khi reload thay đổi
    useEffect(() => {
        if (!user?.id) {
            navigate('/login')
            return
        }
        const fetchData = async () => {
            setError('')
            try {
                const [resContacts, resGroups, resTrash, resShares] = await Promise.all([
                    axios.get(`${API}/contacts/${user.id}`),
                    axios.get(`${API}/groups`),
                    axios.get(`${API}/trash/${user.id}`),
                    axios.get(`${API}/shares?toUserId=${user.id}&status=pending`)
                ])
                setContacts(Array.isArray(resContacts.data?.data) ? resContacts.data.data : [])
                setGroups(Array.isArray(resGroups.data) ? resGroups.data : [])
                setTrashContacts(Array.isArray(resTrash.data?.data) ? resTrash.data.data : [])
                setPendingShares(Array.isArray(resShares.data) ? resShares.data : [])
            } catch (err) {
                const status = err.response?.status
                if (status === 404) {
                    setError('Không tìm thấy dữ liệu danh bạ của tài khoản. Vui lòng liên hệ quản trị viên.')
                } else if (err.code === 'ERR_NETWORK') {
                    setError('Không thể kết nối server. Hãy kiểm tra json-server đang chạy trên port 9999.')
                } else {
                    setError(err.response?.data?.message || err.message || 'Không thể tải dữ liệu.')
                }
                setContacts([])
                setTrashContacts([])
                setGroups([])
                setPendingShares([])
            }
        }
        fetchData()
    }, [reload, user?.id, navigate])

    const handleOpenShare = (share) => {
        setActiveShare(share)
        setIsOpenAcceptModal(true)
    }

    // filter
    const [selectedGroup, setSelectedGroup] = useState('all');
    const [selectedFavourite, setSelectedFavourite] = useState('all');
    const [searchName, setSearchName] = useState('');

    const filteredContacts = contacts.filter((contact) => {
        const matchGroup = selectedGroup === 'all' || Number(contact.groupId) === Number(selectedGroup)
        const matchFavourite = selectedFavourite === 'all' || Number(contact.isFavourite) === Number(selectedFavourite)
        const matchSearch = contact.fullName.toLowerCase().includes(searchName.toLowerCase().trim()) || contact.email.toLowerCase().includes(searchName.trim().toLowerCase())
        return matchFavourite && matchGroup && matchSearch
    });
    //_____Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const CONTACTS_PER_PAGE = 10;
    const totalPage = Math.ceil(filteredContacts.length / CONTACTS_PER_PAGE)
    const itemsPagination = Array.from(
        { length: totalPage },
        ((value, index) => index + 1)
    )
    const startIndexContacts = (currentPage - 1) * CONTACTS_PER_PAGE
    const endIndexContacts = startIndexContacts + CONTACTS_PER_PAGE
    const currenContacts = filteredContacts.slice(startIndexContacts, endIndexContacts)

    //__Set current page = 1 when filter active
    useEffect(() => {
        setCurrentPage(1)
    }, [selectedFavourite, searchName, selectedGroup])

    return (
        <div className="p-0 mt-3">
            {error && (
                <div className="container mb-3">
                    <div className="alert alert-danger d-flex align-items-center justify-content-between mb-0" role="alert">
                        <div>
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                        <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => setReload((prev) => prev + 1)}
                        >
                            Thử lại
                        </button>
                    </div>
                </div>
            )}

            <NotificationShare
                pendingShares={pendingShares}
                onOpenShare={handleOpenShare}
            />

            <ModalAcceptShare
                key={activeShare?.id}
                share={activeShare}
                isOpen={isOpenAcceptModal}
                setIsOpen={setIsOpenAcceptModal}
                contactsRaw={contacts}
                setReload={setReload}
            />

            {tab === 'contacts'
                && <>
                    {/*_________Card */}
                    <ListCard
                        contacts={contacts}
                        groups={groups}>
                    </ListCard>
                    {/*____Table Contact_____ */}
                    <TableContact
                        setReload={setReload}
                        itemsPagination={itemsPagination}
                        contacts={currenContacts}
                        contactsRaw={contacts}
                        currentPage={currentPage}
                        setContacts={setContacts}
                        setCurrentPage={setCurrentPage}
                        groups={groups}
                        selectedGroup={selectedGroup}
                        setSelectedGroup={setSelectedGroup}
                        selectedFavourite={selectedFavourite}
                        setSelectedFavourite={setSelectedFavourite}
                        searchName={searchName}
                        setSearchName={setSearchName}>
                    </TableContact>
                </>
            }
            {tab === 'trash'
                && <>
                    <TableTrash
                        trashContacts={trashContacts}
                        contactsRaw={contacts}
                        setReload={setReload}
                    />
                </>
            }
            {tab === "setting"
                && <>
                    <SettingProfile></SettingProfile>
                </>}

        </div>
    )
}

export default WorkSpace
