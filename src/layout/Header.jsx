import { Button, Col, Row } from "react-bootstrap"
import '../style/styline.css'

const Header = () => {
    return (
        <Row className="fixed-top py-3 d-flex align-items-center">
            <Col className="text-start ms-2">
                <h5 className="text-danger">Assignment Fer202</h5>
            </Col>
            <Col className="d-flex justify-content-center">
                <h4 className="title text-center">Quản lý danh bạ</h4>
            </Col>
            <Col className="text-end me-2">
                <h5 className="text-danger">HungHQHE180380</h5>
            </Col>
            <hr />
        </Row>
    )
}

export default Header