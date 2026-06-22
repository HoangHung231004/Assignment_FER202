import { InputGroup, Row } from "react-bootstrap"
import { Link } from "react-router-dom"

const InputEmail = ({ email, setEmail, isLogin }) => {
    return (
        <Row className="mt-1 fw-bold">
            <div className="d-flex justify-content-between">
                <label htmlFor="email-input-login">Email: </label>
                {isLogin && <Link to='/'>Trở lại trang chủ</Link>}
            </div>
            <InputGroup className="mt-1">
                <InputGroup.Text>
                    <i className="bi bi-envelope"></i>
                </InputGroup.Text>
                <input type="text" className={`form-control  ${isLogin ? 'py-3' : ''}`} id="email-input-login"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    required></input>
            </InputGroup>
        </Row>
    )
}

export default InputEmail