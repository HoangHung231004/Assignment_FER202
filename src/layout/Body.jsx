
import { useNavigate } from 'react-router-dom'
import { Button, Card, Col, Row } from "react-bootstrap"

const Body = () => {
    const navigate = useNavigate()

    const features = [
        { title: 'Quản lý liên hệ', text: 'Thêm, sửa, xóa và sắp xếp liên hệ dễ dàng' },
        { title: 'Lọc & tìm kiếm', text: 'Tìm nhanh theo tên, email, nhóm và yêu thích' },
        { title: 'Chia sẻ danh bạ', text: 'Gửi liên hệ cho người dùng khác trong hệ thống' },
    ]

    return (
        <div className="container-fluid px-3 px-md-4 py-4">
            <Row className="text-center justify-content-center">
                <Col lg={10} xl={8}>
                    <h1 className="subTitle">Quản lý danh bạ cá nhân dễ dàng</h1>
                    <p className="home-hero-text text-muted mt-3">
                        Lưu trữ, tìm kiếm và quản lý liên hệ của bạn một cách đơn giản
                    </p>
                    <div className="d-flex flex-column flex-sm-row justify-content-center gap-2 gap-sm-3 mt-4">
                        <Button
                            className="btn btn-light btn-outline-dark fw-bold btn-cta"
                            onClick={() => navigate("/login")}
                        >
                            Đăng nhập
                        </Button>
                        <Button
                            className="btn btn-primary fw-bold btn-cta"
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký
                        </Button>
                    </div>
                </Col>
            </Row>

            <Row className="bg-light align-items-stretch justify-content-center mt-4 mt-md-5 py-4 py-md-5 px-2 px-md-4 border rounded g-3">
                {features.map((feature) => (
                    <Col key={feature.title} xs={12} md={4}>
                        <Card className="cardHomePage h-100 text-center">
                            <Card.Img className="cardImgHomePage" src="users-homepage.png" alt="" />
                            <Card.Body>
                                <Card.Title>{feature.title}</Card.Title>
                                <Card.Text>{feature.text}</Card.Text>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </div>
    )
}

export default Body
