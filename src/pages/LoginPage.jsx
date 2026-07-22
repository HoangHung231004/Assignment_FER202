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
        <div className="">
            {/* Header */}
            <Header></Header>

            {/* Login Form */}
            <Col lg={12} md={12} xs={12} className="mt-5
            d-flex justify-content-center align-items-center"
            >
                <div className="border bg-light container px-4 py-4"
                    style={
                        {
                            marginTop: '3%',
                            width: 'auto',
                            height: 'auto',
                            borderRadius: '10px'
                        }
                    }>
                    {/* ___Image__________________________________________________ */}
                    <Row className="d-flex justify-content-center py-3">
                        <img src='userImage.jpg'
                            style={
                                {
                                    width: '10%',
                                    height: 'auto',
                                    borderRadius: '50px'
                                }
                            }></img>
                    </Row>
                    <h2 className="text-center">Đăng nhập</h2>
                    {/*______FROM SUBMIT */}
                    <Form onSubmit={handleLogin}>
                        {/*____Email__________________________________________________ */}
                        <InputEmail
                            isLogin={true}
                            email={email}
                            setEmail={setEmail}></InputEmail>

                        {errors.map((er) => er.errorName === 'email' ? <p className="text-danger">{er.message}</p> : '')}

                        {/*____Password________________________________________________*/}
                        <InputPassword
                            isLogin={true}
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}></InputPassword>
                        {errors.map((er) => er.errorName === 'password' ? <p className="text-danger">{er.message}</p> : '')}
                        {/*____Option___________________________________________________ */}
                        <Row className="mt-3">
                            <Col className="d-flex">
                                <input type="checkbox" id="remember-me" className="form-check"></input>
                                <label className="ms-2 fw-light" htmlFor="remember-me">Ghi nhớ đăng nhập</label>
                            </Col>
                            <Col className="text-end fw-light">
                                <a href="">Quên mật khẩu?</a>
                            </Col>
                        </Row>
                        {errors.map((err) => err.errorName === 'information' ? <p className="text-danger">{err.message}</p> : '')}
                        {message && <p className="text-success">{message}</p>}
                        {/*__Log in Button */}
                        <Row className="mt-3 px-2">
                            <button className="btn btn-primary"
                                type="submit">Đăng nhập</button>
                        </Row>
                    </Form>
                    <div className="text-center mt-3">hoặc</div>
                    {/*__Register Button */}
                    <Row className="mt-3 px-2">
                        <button className="btn btn-outline-primary"
                            onClick={() => navigate('/register')}>Đăng ký</button>
                    </Row>
                </div>
            </Col >

            {/* Footer */}
            < Footer ></Footer >
        </div >
    )
}

export default LoginPage