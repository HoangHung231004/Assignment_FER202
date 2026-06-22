import { InputGroup, Row } from "react-bootstrap"

const InputPassword = ({ password, setPassword, showPassword, setShowPassword, isLogin }) => {
    return (
        <Row className="mt-2 fw-bold">
            <label htmlFor="password-input-login">Password:</label>
            <InputGroup>
                <InputGroup.Text>
                    <i className="bi bi-file-lock2-fill"></i>
                </InputGroup.Text>
                <input type={`${showPassword ? 'text' : 'password'}`}
                    className={`form-control ${isLogin ? 'py-3' : ''}`}
                    placeholder="Mật khẩu tối thiểu 6 ký tự..."
                    id="password-input-login"
                    value={password}
                    onChange={(e) => setPassword(e.target.value.trim())}
                    required></input>
                <InputGroup.Text
                    onClick={() => setShowPassword((prev) => !prev)}>
                    {/* bi-eye-slash */}
                    <i className={`bt ${showPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                </InputGroup.Text>
            </InputGroup>
        </Row>
    )
}

export default InputPassword