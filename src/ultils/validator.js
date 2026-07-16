import axios from "axios";

export const validateEmail = (email) => {
    const value = email.trim();

    if (!value) {
        return "Email không được để trống";
    }

    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!gmailRegex.test(value)) {
        return "Email phải là địa chỉ @gmail.com";
    }

    return "";
};

export const validatePhone = (phone) => {
    const value = phone.trim();

    if (!value) {
        return "Số điện thoại không được để trống";
    }

    // Số điện thoại Việt Nam: 10 số, bắt đầu bằng 03, 05, 07, 08, 09
    const phoneRegex = /^(03|05|07|08|09)[0-9]{8}$/;

    if (!phoneRegex.test(value)) {
        return "Số điện thoại Việt Nam phải có 10 chữ số và bắt đầu bằng 03, 05, 07, 08 hoặc 09";
    }

    return "";
};

export const validateFullName = (fullName) => {
    const value = fullName.trim();

    if (!value) {
        return "Họ tên không được để trống";
    }

    if (value.length < 3) {
        return "Họ tên phải có ít nhất 3 ký tự";
    }

    return "";
};

export const validatePassword = (password) => {
    const value = password.trim();

    if (!value) {
        return "Mật khẩu không được để trống";
    }

    if (password !== value) {
        return "Mật khẩu không được có khoảng trắng ở đầu hoặc cuối";
    }

    if (/\s/.test(password)) {
        return "Mật khẩu không được chứa khoảng trắng";
    }

    if (value.length < 6) {
        return "Mật khẩu phải có ít nhất 6 ký tự";
    }

    return "";
};

export const validateConfirmPassword = (password, confirmPassword) => {
    const passwordValue = password.trim();
    const confirmValue = confirmPassword.trim();

    if (!confirmValue) {
        return "Xác nhận mật khẩu không được để trống";
    }

    if (confirmValue !== passwordValue) {
        return "Xác nhận mật khẩu không khớp";
    }

    return "";
};

export const validateRegisterForm = async ({ fullName, email, phoneNumber, password, confirmPassword, isAcceptPolicy }) => {
    const errors = [];
    const API = import.meta.env.VITE_API_BASE_URL;
    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phoneNumber);
    const passwordError = validatePassword(password);
    const confirmPasswordError = validateConfirmPassword(password, confirmPassword);

    if (fullNameError) {
        errors.push({
            errorName: "fullName",
            message: fullNameError
        });
    }

    if (emailError) {
        errors.push({
            errorName: "email",
            message: emailError
        });
    } else {
        try {
            const isExistEmail = await axios.get(`${API}/users?email=${email}`)
            if (isExistEmail.data.length > 0) {
                errors.push({
                    errorName: 'email',
                    message: 'Email đã tồn tại'
                })
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    if (phoneError) {
        errors.push({
            errorName: "phoneNumber",
            message: phoneError
        });
    } else {
        try {
            const isExistPhone = await axios.get(`${API}/users?phone=${phoneNumber}`)
            if (isExistPhone.data.length > 0) {
                errors.push({
                    errorName: 'phoneNumber',
                    message: 'Phone number đã tồn tại'
                })
            }
        } catch (error) {
            console.error(error.message)
        }
    }

    if (passwordError) {
        errors.push({
            errorName: "password",
            message: passwordError
        });
    }

    if (confirmPasswordError) {
        errors.push({
            errorName: "confirmPassword",
            message: confirmPasswordError
        });
    }

    if (isAcceptPolicy === false) {
        errors.push(
            {
                errorName: "policy",
                message: 'Bạn cần đồng ý chính sách và điều khoản để tiếp tục đăng ký'
            }
        )
    }

    return errors;
};


export const validateLoginForm = ({ email, password }) => {
    const errors = [];

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError) errors.push(
        {
            errorName: 'email',
            message: emailError
        }
    );
    if (passwordError) errors.push(
        {
            errorName: 'password',
            message: passwordError
        }
    );
    return errors;
};

export const validateEditOrUpdateForm = ({ fullName, phoneNumber, email }) => {
    const errors = [];

    const fullNameError = validateFullName(fullName)
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phoneNumber);

    if (emailError) errors.push(
        {
            errorName: 'email',
            message: emailError
        }
    );
    if (phoneError) errors.push(
        {
            errorName: 'phone',
            message: phoneError
        }
    );
    if (fullNameError) errors.push(
        {
            errorName: 'fullName',
            message: fullNameError
        }
    );
    return errors;
}
// const API = import.meta.env.VITE_API_BASE_URL
// export const hasAccount = async ({ email, phone }) => {
//     const error = [];

// }