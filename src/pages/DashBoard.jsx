import { Col, Row } from "react-bootstrap"
import Tabbar from "../layout/Tabbar"
import WorkSpace from "../layout/WorkSpace"

const DashBoard = () => {
    return (
        <>
            <Row className="g-0">
                {/* Tabbar */}
                <Col xs={3} className="border-end min-vh-100 px-0 py-0 d-flex justify-content-center"
                    style={{ width: '400px' }}>
                    <Tabbar></Tabbar>
                </Col>
                <Col xs={9} className="border-end min-vh-100 px-0 py-0 m-0"
                    style={{ width: '1520px', backgroundColor: 'rgb(250, 252, 253)' }}>
                    <WorkSpace></WorkSpace>
                </Col>
            </Row>
        </>
    )
}

export default DashBoard