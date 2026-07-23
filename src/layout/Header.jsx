import { Col, Row } from "react-bootstrap"

const Header = () => {
    return (
        <Row className="fixed-top bg-dark py-2 py-md-3 px-2 px-md-3 m-0 align-items-center app-header">
            <Col xs={3} md={3} className="d-flex align-items-center">
                <h6 className="text-danger m-0 header-side-text">FER202</h6>
            </Col>
            <Col xs={6} md={6} className="text-center">
                <h4 className="title text-white m-0 header-title">Quản lý danh bạ</h4>
            </Col>
            <Col xs={3} md={3} className="text-end">
                <h6 className="text-danger m-0 header-side-text">HE180380</h6>
            </Col>
        </Row>
    )
}

export default Header
