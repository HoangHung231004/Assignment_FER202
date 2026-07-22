import { useNavigate, useSearchParams } from "react-router-dom"

const ITEM_SELECTED = {
    backgroundColor: '#0d6efd',
    color: 'white'
}

const Tabbar = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const tab = searchParams.get("tab")

    const navigate = useNavigate()

    const handleLogOut = () => {
        localStorage.clear();
        navigate('/')
    }
    return (
        <div className="mt-3">
            <div className="d-flex">
                <div className="brand-logo">
                    <i className="bi bi-people-fill"></i>
                </div>
                <span className="brand-name text-center ms-3">Contact Manager</span>
            </div>
            {/*________Danh bạ__________________________ */}
            <div className="tabbar_item mt-4" style={tab === 'contacts' ? ITEM_SELECTED : {}}
                onClick={() => setSearchParams("tab=contacts")}>
                <div>
                    <i className="tabbar_item_logo bi bi-person"></i>
                </div>
                <span className="text-item-logo">Danh bạ</span>
            </div>
            {/*________Nhóm__________________________ */}
            {/* <div className="tabbar_item" style={tab === 'groups' ? ITEM_SELECTED : {}}
                onClick={() => setSearchParams("tab=groups")}>
                <div>
                    <i className="tabbar_item_logo bi bi-folder"></i>
                </div>
                <span className="text-item-logo">Nhóm</span>
            </div> */}
            {/*________Yêu Thích__________________________ */}
            {/* <div className="tabbar_item" style={tab === 'favourite' ? ITEM_SELECTED : {}}
                onClick={() => setSearchParams("tab=favourite")}>
                <div>
                    <i className="tabbar_item_logo bi bi-bookmark-star"></i>
                </div>
                <span className="text-item-logo">Yêu thích</span>
            </div> */}
            {/*________Thùng rác__________________________ */}
            <div className="tabbar_item" style={tab === 'trash' ? ITEM_SELECTED : {}}
                onClick={() => setSearchParams("tab=trash")}>
                <div>
                    <i className="tabbar_item_logo bi bi-trash"></i>
                </div>
                <span className="text-item-logo">Thùng rác</span>
            </div>
            <hr />
            <div className="tabbar_item" style={tab === 'setting' ? ITEM_SELECTED : {}}
                onClick={() => setSearchParams("tab=setting")}>
                <div>
                    <i className="tabbar_item_logo bi bi-gear"></i>
                </div>
                <span className="text-item-logo">Cài đặt</span>
            </div>

            <div className="tabbar_item" onClick={() => handleLogOut()}>
                <div>
                    <i className="tabbar_item_logo bi bi-box-arrow-left"></i>
                </div>
                <span className="text-item-logo">Đăng xuất</span>
            </div>
        </div >
    )
}

export default Tabbar