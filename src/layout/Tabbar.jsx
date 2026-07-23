import { useNavigate, useSearchParams } from "react-router-dom"

const ITEM_SELECTED = {
    backgroundColor: '#0d6efd',
    color: 'white'
}

const Tabbar = ({ onItemClick }) => {
    const [searchParams, setSearchParams] = useSearchParams()
    const tab = searchParams.get("tab")

    const navigate = useNavigate()

    const handleTabChange = (tabName) => {
        setSearchParams(`tab=${tabName}`)
        onItemClick?.()
    }

    const handleLogOut = () => {
        localStorage.clear()
        navigate('/')
        onItemClick?.()
    }

    return (
        <div className="tabbar-root">
            <div className="tabbar-brand">
                <div className="brand-logo">
                    <i className="bi bi-people-fill"></i>
                </div>
                <span className="brand-name">Contact Manager</span>
            </div>

            <div
                className="tabbar_item mt-3 mt-lg-4"
                style={tab === 'contacts' || !tab ? ITEM_SELECTED : {}}
                onClick={() => handleTabChange('contacts')}
            >
                <i className="tabbar_item_logo bi bi-person"></i>
                <span className="text-item-logo">Danh bạ</span>
            </div>

            <div
                className="tabbar_item"
                style={tab === 'trash' ? ITEM_SELECTED : {}}
                onClick={() => handleTabChange('trash')}
            >
                <i className="tabbar_item_logo bi bi-trash"></i>
                <span className="text-item-logo">Thùng rác</span>
            </div>

            <hr className="my-2" />

            <div
                className="tabbar_item"
                style={tab === 'setting' ? ITEM_SELECTED : {}}
                onClick={() => handleTabChange('setting')}
            >
                <i className="tabbar_item_logo bi bi-gear"></i>
                <span className="text-item-logo">Cài đặt</span>
            </div>

            <div className="tabbar_item" onClick={handleLogOut}>
                <i className="tabbar_item_logo bi bi-box-arrow-left"></i>
                <span className="text-item-logo">Đăng xuất</span>
            </div>
        </div>
    )
}

export default Tabbar
