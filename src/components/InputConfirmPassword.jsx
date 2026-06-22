import { InputGroup, Row } from "react-bootstrap"

const InputConfirmPassword = ({ confirmPassword, setConfirmPassword, setShowConfirmPassword, showConfirmPassword }) => {
    return (
        <Row className="mt-2 fw-bold">
            <label htmlFor="confirm-password-input-login">Confirm Password:</label>
            <InputGroup>
                <InputGroup.Text>
                    <i className="bi bi-file-lock2-fill"></i>
                </InputGroup.Text>
                <input type={`${showConfirmPassword ? 'text' : 'password'}`}
                    className={`form-control`}
                    placeholder="Không giống không tính tiền hẹ hẹ hẹ..."
                    id="confirm-password-input-login"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required></input>
                <InputGroup.Text
                    onClick={() => setShowConfirmPassword((prev) => !prev)}>
                    {/* bi-eye-slash */}
                    <i className={`bt ${showConfirmPassword ? 'bi-eye' : 'bi-eye-slash'}`}></i>
                </InputGroup.Text>
            </InputGroup>
        </Row>
    )
}

export default InputConfirmPassword