import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../layout/Header"
import Footer from "../layout/Footer"
import { Col, Form, Row } from "react-bootstrap"
import InputEmail from "../components/InputEmail"
import InputPassword from "../components/InputPassword"
import InputFullName from "../components/InputFullName"
import InputPhoneNumber from "../components/InputPhoneNumber"
import InputConfirmPassword from "../components/InputConfirmPassword"
import { validateRegisterForm } from "../ultils/validator"
import axios from "axios"


// Điều Khoản sử dụng =)))))))
const TERM_OF_USE = 'https://www.google.com/search?q=%C4%91i%E1%BB%81u+kho%E1%BA%A3n+s%E1%BB%AD+d%E1%BB%A5ng+cho+web+qu%E1%BA%A3n+l%C3%BD+danh+b%E1%BA%A1&oq=%C4%91i%E1%BB%81u+kho%E1%BA%A3n+s%E1%BB%AD+d%E1%BB%A5ng+cho+web+qu%E1%BA%A3n+l%C3%BD+danh+b%E1%BA%A1&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRiPAjIHCAMQIRiPAjIHCAQQIRiPAtIBCTE2OTQ4ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8'
// Chính sách bảo mật =)))))))
const PRIVACY_POLICY = 'https://www.google.com/search?q=ch%C3%ADnh+s%C3%A1ch+b%E1%BA%A3o+m%E1%BA%ADt+cho+web+qu%E1%BA%A3n+l%C3%BD+danh+b%E1%BA%A1&oq=ch%C3%ADnh+s%C3%A1ch+b%E1%BA%A3o+m%E1%BA%ADt+cho+web+qu%E1%BA%A3n+l%C3%BD+danh+b%E1%BA%A1&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRiPAjIHCAMQIRiPAjIHCAQQIRiPAtIBCDc4MTBqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8'

// URL API BASE
const API = import.meta.env.VITE_API_BASE_URL

const RegisterPage = () => {
    //____NAVIGATE
    const navigate = useNavigate()
    //____email State
    const [email, setEmail] = useState('')
    //_____password State 
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    //_____fullName State 
    const [fullName, setFullName] = useState('')
    // ____phoneNumber State 
    const [phoneNumber, setPhoneNumber] = useState('')
    //____ConfirmPassword State
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    //___accept policy State
    const [isAcceptPolicy, setIsAcceptPolicy] = useState(false)

    // Error State
    const [errors, setErrors] = useState([])

    // handle Register
    const register = async (e) => {
        e.preventDefault();
        const formRegister = {
            fullName: fullName,
            email: email,
            phoneNumber: phoneNumber,
            password: password,
            confirmPassword: confirmPassword,
            isAcceptPolicy: isAcceptPolicy
        }
        const err = validateRegisterForm(formRegister)

        if (err.length > 0) {
            setErrors(err)
        } else {
            const getDataRegister = await fetchDataRegister(formRegister)
            const isRegisterSuccess = getDataRegister.success && getDataRegister.data
            if (isRegisterSuccess) {
                navigate('/login', {
                    state: {
                        message: 'Register Success'
                    }
                })
            } else {
                setErrors([
                    {
                        errorName: 'register',
                        message: getDataRegister.message
                    }
                ])
            }
        }
    }

    const fetchDataRegister = async ({
        fullName,
        email,
        phoneNumber,
        password,
        confirmPassword,
        isAcceptPolicy
    }) => {
        try {
            const res = await axios.post(`${API}/users`, {
                fullName: fullName.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber,
                password: password,
                confirmPassword: confirmPassword,
                isAcceptPolicy: isAcceptPolicy
            })

            return {
                success: true,
                message: 'Register Successfully',
                data: res.data
            }

        } catch (error) {
            return {
                success: false,
                status: error.response?.status,
                message: error.message,
                data: []
            }
        }
    }


    return (
        <div>
            {/* Header */}
            <Header></Header>

            {/* Register Form */}
            <Col lg={12} md={12} xs={12} className="mt-5
            d-flex justify-content-center align-items-center"
            >
                <div className="border container px-4 py-1"
                    style={
                        {
                            marginTop: '2%',
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
                    <h2 className="text-center">Đăng ký tài khoản</h2>
                    <div className="text-center">Tạo tài khoản mới để bắt đầu quản lý danh bạ của bạn</div>
                    {/*____Register Form____________________________________________ */}
                    <Form onSubmit={register}>
                        {/*____Full Name________________________________________________ */}
                        <InputFullName
                            fullName={fullName}
                            setFullName={setFullName}
                            // isRegister to show 'Trở lại trang chủ =))))'
                            isRegister={true}></InputFullName>
                        {errors.map((err) => err.errorName === 'fullName' ? <div className="text-danger">{err.message}</div> : '')}
                        {/*____Email__________________________________________________ */}
                        <InputEmail
                            isLogin={false}
                            email={email}
                            setEmail={setEmail}></InputEmail>
                        {errors.map((err) => err.errorName === 'email' ? <div className="text-danger">{err.message}</div> : '')}
                        {/*____Phone Number_____________________________________________ */}
                        <InputPhoneNumber
                            phoneNumber={phoneNumber}
                            setPhoneNumber={setPhoneNumber}
                        ></InputPhoneNumber>
                        {errors.map((err) => err.errorName === 'phoneNumber' ? <div className="text-danger">{err.message}</div> : '')}
                        {/*____Password________________________________________________*/}
                        <InputPassword
                            isLogin={false}
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}></InputPassword>
                        {errors.map((err) => err.errorName === 'password' ? <div className="text-danger">{err.message}</div> : '')}
                        {/*___Confirm Password_________________________________________*/}
                        <InputConfirmPassword
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                            showConfirmPassword={showConfirmPassword}
                            setShowConfirmPassword={setShowConfirmPassword}></InputConfirmPassword>
                        {errors.map((err) => err.errorName === 'confirmPassword' ? <div className="text-danger">{err.message}</div> : '')}
                        {/*____Option___________________________________________________ */}
                        <Row className="mt-3">
                            <div className="d-flex justify-content-baseline gap-2">
                                <input type="checkbox" className="form-check"
                                    checked={isAcceptPolicy}
                                    onChange={(e) => setIsAcceptPolicy((prev) => !prev)}></input>
                                <label>Tôi đồng ý với <Link to={TERM_OF_USE}>Điều khoản sử dụng</Link> và <Link to={PRIVACY_POLICY}>Chính sách bảo mật</Link></label>
                            </div>
                        </Row>
                        {errors.map((err) => err.errorName === 'policy' ? <div className="text-danger">{err.message}</div> : '')}
                        {/*__Register Button */}
                        <Row className="mt-3 px-2">
                            <button className="btn btn-primary"
                                type="submit">Đăng ký</button>
                        </Row>
                        {errors.map((err) => err.errorName === 'register' ? <div className="text-danger">{err.message}</div> : '')}
                    </Form>
                    <div className="text-center mt-3 py-0">hoặc</div>
                    {/*__Register Button */}
                    <Row className="mt-3 px-2 mb-3">
                        <button className="btn btn-outline-primary"
                            onClick={() => navigate('/login')}>Có tài khoản chưa? Có rồi à? Đăng nhập nhé!</button>
                    </Row>
                </div>
            </Col >

            {/* Footer */}
            < Footer></Footer >
        </div >
    )
}
export default RegisterPage