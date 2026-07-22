import { Col, Row } from "react-bootstrap"
import InputFullName from "../components/InputFullName"
import InputPhoneNumber from "../components/InputPhoneNumber"
import InputEmail from "../components/InputEmail"
import { useEffect, useState } from "react"
import InputPassword from "../components/InputPassword"
import InputConfirmPassword from "../components/InputConfirmPassword"
import { getUserById, updateUser } from "../services/service"
import { validateUpdateProfileForm } from "../ultils/validator"

const SettingProfile = () => {
    const sessionUser = JSON.parse(localStorage.getItem("user") || "null")

    const [profile, setProfile] = useState(null)
    const [fullName, setFullName] = useState('')
    const [phoneNumber, setPhoneNumber] = useState('')
    const [email, setEmail] = useState('')
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [errors, setErrors] = useState([])
    const [success, setSuccess] = useState('')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            if (!sessionUser?.id) return
            try {
                const res = await getUserById(sessionUser.id)
                const user = res.data
                setProfile(user)
                setFullName(user.fullName ?? '')
                setPhoneNumber(user.phoneNumber ?? '')
                setEmail(user.email ?? '')
            } catch {
                setErrors([{ errorName: 'fetch', message: 'Không thể tải thông tin tài khoản' }])
            } finally {
                setLoading(false)
            }
        }
        fetchProfile()
    }, [sessionUser?.id])

    const handleUpdate = async (e) => {
        e.preventDefault()
        setSuccess('')
        if (!profile) return

        const validationErrors = await validateUpdateProfileForm({
            fullName,
            email,
            phoneNumber,
            oldPassword,
            newPassword,
            confirmPassword,
            currentPassword: profile.password,
            userId: profile.id
        })

        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            return
        }

        setErrors([])

        const updatedUser = {
            ...profile,
            fullName: fullName.trim(),
            email: email.trim(),
            phoneNumber: phoneNumber.trim(),
            password: newPassword.trim() ? newPassword : profile.password,
            confirmPassword: newPassword.trim() ? confirmPassword : profile.confirmPassword
        }

        try {
            await updateUser(profile.id, updatedUser)
            setProfile(updatedUser)
            localStorage.setItem("user", JSON.stringify({
                id: updatedUser.id,
                fullName: updatedUser.fullName,
                email: updatedUser.email
            }))
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setSuccess('Cập nhật thông tin thành công')
        } catch {
            setErrors([{ errorName: 'update', message: 'Không thể cập nhật. Vui lòng thử lại.' }])
        }
    }

    if (loading) {
        return (
            <div className="container p-4 text-center text-muted">
                Đang tải thông tin...
            </div>
        )
    }

    return (
        <div className="container p-4">
            <h4 className="fw-bold mb-4">Cài đặt tài khoản</h4>

            {errors.map((er) => er.errorName === 'fetch' || er.errorName === 'update'
                ? <div key={er.errorName} className="alert alert-danger">{er.message}</div>
                : null)}
            {success && <div className="alert alert-success">{success}</div>}

            <Row className="g-4">
                <Col lg={6}>
                    <div className="border rounded p-4 bg-white">
                        <h5 className="fw-bold mb-3">Cập nhật thông tin</h5>
                        <form onSubmit={handleUpdate}>
                            <InputFullName fullName={fullName} setFullName={setFullName} />
                            {errors.map((er) => er.errorName === 'fullName'
                                ? <div key="fullName" className="text-danger">{er.message}</div> : null)}

                            <InputPhoneNumber phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} />
                            {errors.map((er) => er.errorName === 'phone'
                                ? <div key="phone" className="text-danger">{er.message}</div> : null)}

                            <InputEmail email={email} setEmail={setEmail} />
                            {errors.map((er) => er.errorName === 'email'
                                ? <div key="email" className="text-danger">{er.message}</div> : null)}

                            <div className="mt-3 fw-bold">Đổi mật khẩu (để trống nếu không đổi)</div>
                            <InputPassword
                                password={oldPassword}
                                setPassword={setOldPassword}
                                showPassword={showOldPassword}
                                setShowPassword={setShowOldPassword}
                            />
                            {errors.map((er) => er.errorName === 'oldPassword'
                                ? <div key="oldPassword" className="text-danger">{er.message}</div> : null)}

                            <InputPassword
                                password={newPassword}
                                setPassword={setNewPassword}
                                showPassword={showNewPassword}
                                setShowPassword={setShowNewPassword}
                            />
                            {errors.map((er) => er.errorName === 'newPassword'
                                ? <div key="newPassword" className="text-danger">{er.message}</div> : null)}

                            <InputConfirmPassword
                                confirmPassword={confirmPassword}
                                setConfirmPassword={setConfirmPassword}
                                showConfirmPassword={showConfirmPassword}
                                setShowConfirmPassword={setShowConfirmPassword}
                            />
                            {errors.map((er) => er.errorName === 'confirmPassword'
                                ? <div key="confirmPassword" className="text-danger">{er.message}</div> : null)}

                            <button type="submit" className="btn btn-primary mt-3 w-100">
                                Lưu thay đổi
                            </button>
                        </form>
                    </div>
                </Col>

                <Col lg={6}>
                    <div className="border rounded p-4 bg-light">
                        <h5 className="fw-bold mb-3">Thông tin hiện tại</h5>
                        {profile ? (
                            <table className="table table-borderless mb-0">
                                <tbody>
                                    <tr>
                                        <td className="fw-bold text-muted">Họ và tên</td>
                                        <td>{profile.fullName}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-muted">Số điện thoại</td>
                                        <td>{profile.phoneNumber}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-muted">Email</td>
                                        <td>{profile.email}</td>
                                    </tr>
                                    <tr>
                                        <td className="fw-bold text-muted">Mật khẩu</td>
                                        <td>••••••</td>
                                    </tr>
                                </tbody>
                            </table>
                        ) : (
                            <p className="text-muted mb-0">Không có dữ liệu</p>
                        )}
                    </div>
                </Col>
            </Row>
        </div>
    )
}

export default SettingProfile
