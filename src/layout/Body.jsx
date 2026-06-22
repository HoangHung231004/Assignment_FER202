
import { useNavigate } from 'react-router-dom'
import '../style/styline.css'

import { Button, Card, Col, Row } from "react-bootstrap"

const Body = () => {

    const navigate = useNavigate()

    return (
        <div className="px-3 d-flex justify-content-center align-items-center min-vh-100">
            <div className='w-100'>
                <Row className="text-center">
                    <h1 className="subTitle">Quản lý danh bạ cá nhân dễ dàng</h1>
                    <div>
                        <div style={
                            {
                                fontSize: '21px',
                                fontWeight: 'revert'
                            }
                        }>Lưu trữ, tìm kiếm và quản lý liên hệ của bạn một cách đơn giản</div>
                        <div className="mt-3">
                            <Button className="btn btn-light btn-outline-dark me-2 fw-bold"
                                onClick={() => navigate("/login")}>Đăng nhập</Button>
                            <Button className="btn btn-primary ms-2 fw-bold"
                                onClick={() => navigate('/register')}>Đăng ký</Button>
                        </div>
                    </div>
                </Row>

                {/*--------------------------*/}
                <Row className='bg-light 
                                d-flex align-items-center justify-content-center 
                                mt-5 py-5  px-4 border'>
                    <Col>
                        <Card className='cardHomePage'>
                            <Card.Img className='cardImgHomePage' src='users-homepage.png'></Card.Img>
                            <Card.Body>
                                <Card.Title>Quản lý liên hệ</Card.Title>
                                <Card.Text>Thêm, sửa, xóa và sắp xếp liên hệ dễ dàng</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cardHomePage'>
                            <Card.Img className='cardImgHomePage' src='users-homepage.png'></Card.Img>
                            <Card.Body>
                                <Card.Title>Quản lý liên hệ</Card.Title>
                                <Card.Text>Thêm, sửa, xóa và sắp xếp liên hệ dễ dàng</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col>
                        <Card className='cardHomePage'>
                            <Card.Img className='cardImgHomePage' src='users-homepage.png'></Card.Img>
                            <Card.Body>
                                <Card.Title>Quản lý liên hệ</Card.Title>
                                <Card.Text>Thêm, sửa, xóa và sắp xếp liên hệ dễ dàng</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    )
}

export default Body