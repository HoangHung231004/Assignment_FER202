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

    if (value.length < 2) {
        return "Họ tên phải có ít nhất 2 ký tự";
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

export const validateRegisterForm = ({ fullName, email, phone, password }) => {
    const errors = {};

    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phone);
    const passwordError = validatePassword(password);

    if (fullNameError) errors.fullName = fullNameError;
    if (emailError) errors.email = emailError;
    if (phoneError) errors.phone = phoneError;
    if (passwordError) errors.password = passwordError;

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