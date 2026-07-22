import { Col, Row } from "react-bootstrap"
import '../style/styline.css'

const Header = () => {
    return (
        <>
            <Row className="fixed-top bg-dark py-3 px-0 m-0 d-flex align-items-center">
                <Col className=" d-flex justify-content-start align-items-center">
                    <h5 className="text-danger m-0">Assignment Fer202</h5>
                </Col>
                <Col className="d-flex justify-content-center align-items-center">
                    <h4 className="title text-center text-white m-0">Quản lý danh bạ</h4>
                </Col>
                <Col className="d-flex justify-content-end align-items-center">
                    <h5 className="text-danger m-0">HungHQHE180380</h5>
                </Col>
            </Row>
        </>
    )
}

export default Header