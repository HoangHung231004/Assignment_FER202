import { InputGroup, Row } from "react-bootstrap"

const InputPhoneNumber = ({ phoneNumber, setPhoneNumber }) => {
    return (
        <Row className="mt-2 fw-bold">
            <label htmlFor="phone-input-login">Số điện thoại(+84):</label>
            <InputGroup>
                <InputGroup.Text>
                    <i className="bi bi-telephone"></i>
                </InputGroup.Text>
                <input type={`text`}
                    className={`form-control`}
                    placeholder="0123456789"
                    id="phone-input-login"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.trim())}
                    required></input>
            </InputGroup>
        </Row>
    )
}
export default InputPhoneNumber