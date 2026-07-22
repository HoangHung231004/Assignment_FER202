import { getUsersByEmail, getUsersByPhoneNumber } from "../services/service";

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
            const isExistEmail = await getUsersByEmail(email)
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
            const isExistPhone = await getUsersByPhoneNumber(phoneNumber)
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

export const parsePhoneNumbers = (phoneInput) => {
    if (Array.isArray(phoneInput)) {
        return phoneInput.map((phone) => phone.trim()).filter((phone) => phone.length > 0);
    }

    return phoneInput.trim().split(/\s+/).filter((phone) => phone.length > 0);
};

export const validatePhoneNumbers = (phoneInput) => {
    const phones = parsePhoneNumbers(phoneInput);

    if (phones.length === 0) {
        return "Số điện thoại không được để trống";
    }

    const invalidMessages = phones
        .map((phone) => {
            const error = validatePhone(phone);
            if (error && error !== "Số điện thoại không được để trống") {
                return `${phone}: ${error}`;
            }
            return "";
        })
        .filter(Boolean);

    if (invalidMessages.length > 0) {
        return invalidMessages.join("; ");
    }

    const duplicatePhones = phones.filter((phone, index) => phones.indexOf(phone) !== index);
    const uniqueDuplicates = [...new Set(duplicatePhones)];

    if (uniqueDuplicates.length > 0) {
        return `Số điện thoại bị trùng lặp trong danh sách: ${uniqueDuplicates.join(", ")}`;
    }

    return "";
};

export const findDuplicatePhonesInContacts = (phoneInput, contacts, excludeContactId = null) => {
    const phones = parsePhoneNumbers(phoneInput);
    const duplicates = [];

    phones.forEach((phone) => {
        const contactWithPhone = contacts.find((contact) => {
            if (excludeContactId !== null && Number(contact.id) === Number(excludeContactId)) {
                return false;
            }

            const contactPhones = Array.isArray(contact.phoneNumber)
                ? contact.phoneNumber
                : [contact.phoneNumber];

            return contactPhones.includes(phone);
        });

        if (contactWithPhone) {
            duplicates.push({
                phone,
                contactName: contactWithPhone.fullName.trim()
            });
        }
    });

    return duplicates;
};

export const findShareContactConflicts = (contactsToAdd, existingContacts) => {
    const conflicts = [];

    contactsToAdd.forEach((contact) => {
        const emailTrimmed = (contact.email ?? '').trim();
        if (emailTrimmed) {
            const duplicateEmail = existingContacts.find(
                (c) => (c.email ?? '').trim() === emailTrimmed
            );
            if (duplicateEmail) {
                conflicts.push(
                    `${contact.fullName}: Email đã được lưu cho ${duplicateEmail.fullName.trim()}`
                );
            }
        }

        const phoneInput = Array.isArray(contact.phoneNumber)
            ? contact.phoneNumber.join(' ')
            : (contact.phoneNumber ?? '');
        const duplicatePhones = findDuplicatePhonesInContacts(phoneInput, existingContacts);
        duplicatePhones.forEach(({ phone, contactName }) => {
            conflicts.push(
                `${contact.fullName}: Số ${phone} đã được lưu cho ${contactName}`
            );
        });
    });

    return conflicts;
};

export const validateEditOrUpdateForm = ({ fullName, phoneNumber, email }) => {
    const errors = [];

    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const phoneError = validatePhoneNumbers(phoneNumber);

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
    }

    if (phoneError) {
        errors.push({
            errorName: "phone",
            message: phoneError
        });
    }

    return errors;
};

export const validateUpdateProfileForm = async ({
    fullName,
    email,
    phoneNumber,
    oldPassword,
    newPassword,
    confirmPassword,
    currentPassword,
    userId
}) => {
    const errors = [];

    const fullNameError = validateFullName(fullName);
    const emailError = validateEmail(email);
    const phoneError = validatePhone(phoneNumber);

    if (fullNameError) {
        errors.push({ errorName: 'fullName', message: fullNameError });
    }

    if (emailError) {
        errors.push({ errorName: 'email', message: emailError });
    } else {
        try {
            const res = await getUsersByEmail(email.trim());
            const duplicate = res.data.find((u) => Number(u.id) !== Number(userId));
            if (duplicate) {
                errors.push({ errorName: 'email', message: 'Email đã được sử dụng bởi tài khoản khác' });
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    if (phoneError) {
        errors.push({ errorName: 'phone', message: phoneError });
    } else {
        try {
            const res = await getUsersByPhoneNumber(phoneNumber.trim());
            const duplicate = res.data.find((u) => Number(u.id) !== Number(userId));
            if (duplicate) {
                errors.push({ errorName: 'phone', message: 'Số điện thoại đã được sử dụng bởi tài khoản khác' });
            }
        } catch (error) {
            console.error(error.message);
        }
    }

    const isChangingPassword = newPassword.trim().length > 0 || confirmPassword.trim().length > 0;

    if (isChangingPassword) {
        if (!oldPassword.trim()) {
            errors.push({ errorName: 'oldPassword', message: 'Vui lòng nhập mật khẩu cũ' });
        } else if (oldPassword !== currentPassword) {
            errors.push({ errorName: 'oldPassword', message: 'Mật khẩu cũ không đúng' });
        }

        const newPasswordError = validatePassword(newPassword);
        if (newPasswordError) {
            errors.push({ errorName: 'newPassword', message: newPasswordError });
        }

        const confirmPasswordError = validateConfirmPassword(newPassword, confirmPassword);
        if (confirmPasswordError) {
            errors.push({ errorName: 'confirmPassword', message: confirmPasswordError });
        }
    }

    return errors;
};
