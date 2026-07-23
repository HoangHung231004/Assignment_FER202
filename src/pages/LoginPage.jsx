import { Col, Form, Row } from "react-bootstrap"
import Footer from "../layout/Footer"
import Header from "../layout/Header"
import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import InputEmail from "../components/InputEmail"
import InputPassword from "../components/InputPassword"
import { validateLoginForm } from "../ultils/validator"
import { loginUser } from "../services/service"


const LoginPage = () => {

    const navigate = useNavigate()
    // 
    const location = useLocation();

    const message = location?.state?.message;
    // 

    const [showPassword, setShowPassword] = useState(false)

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    // handle event Login Button
    const [errors, setErrors] = useState([])
    const handleLogin = async (e) => {
        e.preventDefault()

        const formData = {
            email: email.trim(),
            password: password.trim()
        }

        const err = validateLoginForm(formData)
        if (err.length === 0) {
            const getData = await fetchData(formData)
            const isLoginSuccess = getData.success && getData.data.length > 0

            if (isLoginSuccess) {
                //_____Save user's info into local storage
                localStorage.setItem("user", JSON.stringify({ id: getData.data[0].id, fullName: getData.data[0].fullName }))
                navigate("/dashboard?tab=contacts")
            } else {
                setErrors([
                    {
                        errorName: 'information',
                        message: 'Sai email hoặc password'
                    }
                ])
            }

        } else {
            setErrors(err)
        }
    }

    const fetchData = async ({ email, password }) => {
        try {
            const res = await loginUser(email.trim(), password.trim());

            return {
                success: true,
                data: res.data,
            };
        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                message: error.message,
            };
        }
    };

    return (
        <div className="page-with-header-footer">
            <Header />

            <div className="container-fluid px-3 d-flex justify-content-center">
                <div className="auth-form-wrapper">
                    <div className="border bg-light auth-form-card px-4 py-4 w-100">
                        <div className="d-flex justify-content-center py-3">
                            <img src="userImage.jpg" className="auth-form-avatar" alt="User" />
                        </div>
                        <h2 className="text-center h3">Đăng nhập</h2>
                        <Form onSubmit={handleLogin}>
                            <InputEmail
                                isLogin={true}
                                email={email}
                                setEmail={setEmail}></InputEmail>

                            {errors.map((er) => er.errorName === 'email' ? <p key="email" className="text-danger">{er.message}</p> : null)}

                            <InputPassword
                                isLogin={true}
                                password={password}
                                setPassword={setPassword}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}></InputPassword>
                            {errors.map((er) => er.errorName === 'password' ? <p key="password" className="text-danger">{er.message}</p> : null)}

                            <Row className="mt-3 g-2">
                                <Col xs={12} sm={6} className="d-flex align-items-center">
                                    <input type="checkbox" id="remember-me" className="form-check-input me-2" />
                                    <label className="fw-light mb-0" htmlFor="remember-me">Ghi nhớ đăng nhập</label>
                                </Col>
                                <Col xs={12} sm={6} className="text-sm-end fw-light">
                                    <a href="#" onClick={(e) => e.preventDefault()}>Quên mật khẩu?</a>
                                </Col>
                            </Row>
                            {errors.map((err) => err.errorName === 'information' ? <p key="info" className="text-danger">{err.message}</p> : null)}
                            {message && <p className="text-success">{message}</p>}

                            <button className="btn btn-primary w-100 mt-3" type="submit">Đăng nhập</button>
                        </Form>
                        <div className="text-center mt-3">hoặc</div>
                        <button
                            type="button"
                            className="btn btn-outline-primary w-100 mt-2"
                            onClick={() => navigate('/register')}
                        >
                            Đăng ký
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}

export default LoginPage