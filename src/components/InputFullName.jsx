import { InputGroup, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

const InputFullName = ({ fullName, setFullName, isRegister }) => {
    return (
        <Row className="mt-1 fw-bold">
            <div className="d-flex justify-content-between">
                <label htmlFor="fullName-input-login">Họ và tên: </label>
                {isRegister && <Link to='/'>Trở lại trang chủ</Link>}
            </div>
            <InputGroup className="mt-1">
                <InputGroup.Text>
                    <i className="bi bi-person"></i>
                </InputGroup.Text>
                <input type="text" className={`form-control`} id="fullName-input-login"
                    placeholder="VD: Nguyễn Văn A"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required></input>
            </InputGroup>
        </Row>
    )
}

export default InputFullName