import { Col, Row } from "react-bootstrap"
import InputFullName from "../components/InputFullName"
import InputPhoneNumber from "../components/InputPhoneNumber"
import InputEmail from "../components/InputEmail"
import { useState } from "react"
import InputPassword from "../components/InputPassword"
import InputConfirmPassword from "../components/InputConfirmPassword"

const SettingProfile = () => {

    //__State
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    //__Errors
    const [errors, setErrors] = useState([])
    return (
        <Row className="g-0 p-0 m-0">
            <Col xs={3}>
                {/* New profile */}
                <div>
                    <table className='table'>
                        <tbody>
                            <tr>
                                <td>
                                    <InputFullName fullName={fullName} setFullName={setFullName}></InputFullName>
                                    {errors.map((er) => er.errorName === 'fullName' ? <div className='text-danger'>{er.message}</div> : '')}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InputPhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}></InputPhoneNumber>
                                    {errors.map((er) => er.errorName === 'phone' ? <div className='text-danger'>{er.message}</div> : '')}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InputEmail email={email} setEmail={setEmail}></InputEmail>
                                    {errors.map((er) => er.errorName === 'email' ? <div className='text-danger'>{er.message}</div> : '')}
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <InputPassword password={oldPassword} setPassword={setOldPassword} showPassword={false} setShowPassword={() => {}}></InputPassword>
                                    {errors.map((er) => er.errorName === 'password' ? <div className='text-danger'>{er.message}</div> : '')}
                                </td>
                            </tr>

                            <tr>
                                <td>
                                    <InputConfirmPassword confirmPassword={confirmPassword} setConfirmPassword={setConfirmPassword}></InputConfirmPassword>
                                    {errors.map((er) => er.errorName === 'confirmPassword' ? <div className='text-danger'>{er.message}</div> : '')}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </Col>
            {/* Old profile */}
            <Col xs={3}>
                <div></div>
            </Col>
        </Row>
    )
}

export default SettingProfile