import { useState } from "react"
import { Offcanvas } from "react-bootstrap"
import Tabbar from "../layout/Tabbar"
import WorkSpace from "../layout/WorkSpace"
import "../style/styline.css"

const DashBoard = () => {
    const [showSidebar, setShowSidebar] = useState(false)

    return (
        <div className="dashboard-wrapper">
            <div className="dashboard-topbar d-lg-none">
                <button
                    type="button"
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => setShowSidebar(true)}
                    aria-label="Mở menu"
                >
                    <i className="bi bi-list fs-5"></i>
                </button>
                <span className="brand-name mb-0">Contact Manager</span>
            </div>

            <Offcanvas
                show={showSidebar}
                onHide={() => setShowSidebar(false)}
                placement="start"
                className="dashboard-offcanvas"
            >
                <Offcanvas.Header closeButton>
                    <Offcanvas.Title>Menu</Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body className="p-2">
                    <Tabbar onItemClick={() => setShowSidebar(false)} />
                </Offcanvas.Body>
            </Offcanvas>

            <div className="dashboard-body">
                <aside className="dashboard-sidebar d-none d-lg-block">
                    <Tabbar />
                </aside>
                <main className="dashboard-main">
                    <WorkSpace />
                </main>
            </div>
        </div>
    )
}

export default DashBoard
