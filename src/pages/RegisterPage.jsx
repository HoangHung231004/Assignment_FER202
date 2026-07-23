import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Header from "../layout/Header"
import Footer from "../layout/Footer"
import { Form } from "react-bootstrap"
import InputEmail from "../components/InputEmail"
import InputPassword from "../components/InputPassword"
import InputFullName from "../components/InputFullName"
import InputPhoneNumber from "../components/InputPhoneNumber"
import InputConfirmPassword from "../components/InputConfirmPassword"
import { validateRegisterForm } from "../ultils/validator"
import { createUser, createContacts, createTrash } from "../services/service"


// Điều Khoản sử dụng =)))))))
const TERM_OF_USE = 'https://www.google.com/search?q=%C4%91i%E1%BB%81u+kho%E1%BA%A3n+s%E1%BB%AD+d%E1%BB%A5ng+cho+web+qu%E1%BA%A3n+l%C3%BD+danh+b%E1%BA%A1&oq=%C4%91i%E1%BB%81u+kho%E1%BA%A3n+s%E1%BB%AD+d%E1%BB%A5ng+cho+web+qu%E1%BA%A3n+l%C3%BD+danh+b%E1%BA%A1&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRiPAjIHCAMQIRiPAjIHCAQQIRiPAtIBCTE2OTQ4ajBqN6gCALACAA&sourceid=chrome&ie=UTF-8'
// Chính sách bảo mật =)))))))
const PRIVACY_POLICY = 'https://www.google.com/search?q=ch%C3%ADnh+s%C3%A1ch+b%E1%BA%A3o+m%E1%BA%ADt+cho+web+qu%E1%BA%A3n+l%C3%BD+danh+b%E1%BA%A1&oq=ch%C3%ADnh+s%C3%A1ch+b%E1%BA%A3o+m%E1%BA%ADt+cho+web+qu%E1%BA%A3n+l%C3%BD+danh+b%E1%BA%A1&gs_lcrp=EgZjaHJvbWUyBggAEEUYOTIHCAEQIRigATIHCAIQIRiPAjIHCAMQIRiPAjIHCAQQIRiPAtIBCDc4MTBqMGo3qAIAsAIA&sourceid=chrome&ie=UTF-8'


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
        const err = await validateRegisterForm(formRegister)

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
            const res = await createUser({
                fullName: fullName.trim(),
                email: email.trim(),
                phoneNumber: phoneNumber,
                password: password,
                confirmPassword: confirmPassword,
                isAcceptPolicy: isAcceptPolicy
            })

            await Promise.all([
                createContacts(res.data.id),
                createTrash(res.data.id)
            ])

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
        <div className="page-with-header-footer">
            <Header />

            <div className="container-fluid px-3 d-flex justify-content-center">
                <div className="auth-form-wrapper">
                    <div className="border auth-form-card px-4 py-4 w-100">
                        <div className="d-flex justify-content-center py-2">
                            <img src="userImage.jpg" className="auth-form-avatar" alt="User" />
                        </div>
                        <h2 className="text-center h3">Đăng ký tài khoản</h2>
                        <p className="text-center text-muted">Tạo tài khoản mới để bắt đầu quản lý danh bạ của bạn</p>

                        <Form onSubmit={register}>
                            <InputFullName
                                fullName={fullName}
                                setFullName={setFullName}
                                isRegister={true}></InputFullName>
                            {errors.map((err) => err.errorName === 'fullName' ? <div key="fullName" className="text-danger">{err.message}</div> : null)}

                            <InputEmail
                                isLogin={false}
                                email={email}
                                setEmail={setEmail}></InputEmail>
                            {errors.map((err) => err.errorName === 'email' ? <div key="email" className="text-danger">{err.message}</div> : null)}

                            <InputPhoneNumber
                                phoneNumber={phoneNumber}
                                setPhoneNumber={setPhoneNumber}
                            ></InputPhoneNumber>
                            {errors.map((err) => err.errorName === 'phoneNumber' ? <div key="phone" className="text-danger">{err.message}</div> : null)}

                            <InputPassword
                                isLogin={false}
                                password={password}
                                setPassword={setPassword}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}></InputPassword>
                            {errors.map((err) => err.errorName === 'password' ? <div key="password" className="text-danger">{err.message}</div> : null)}

                            <InputConfirmPassword
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
                                showConfirmPassword={showConfirmPassword}
                                setShowConfirmPassword={setShowConfirmPassword}></InputConfirmPassword>
                            {errors.map((err) => err.errorName === 'confirmPassword' ? <div key="confirm" className="text-danger">{err.message}</div> : null)}

                            <div className="d-flex align-items-start gap-2 mt-3">
                                <input
                                    type="checkbox"
                                    className="form-check-input mt-1"
                                    id="accept-policy"
                                    checked={isAcceptPolicy}
                                    onChange={() => setIsAcceptPolicy((prev) => !prev)}
                                />
                                <label htmlFor="accept-policy" className="small">
                                    Tôi đồng ý với <Link to={TERM_OF_USE}>Điều khoản sử dụng</Link> và <Link to={PRIVACY_POLICY}>Chính sách bảo mật</Link>
                                </label>
                            </div>
                            {errors.map((err) => err.errorName === 'policy' ? <div key="policy" className="text-danger">{err.message}</div> : null)}

                            <button className="btn btn-primary w-100 mt-3" type="submit">Đăng ký</button>
                            {errors.map((err) => err.errorName === 'register' ? <div key="register" className="text-danger mt-2">{err.message}</div> : null)}
                        </Form>

                        <div className="text-center mt-3">hoặc</div>
                        <button
                            type="button"
                            className="btn btn-outline-primary w-100 mt-2"
                            onClick={() => navigate('/login')}
                        >
                            Đã có tài khoản? Đăng nhập
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
export default RegisterPage