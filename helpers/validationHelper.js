function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
}

function validateUserData(user) {
    const errors = {};

    if (user.email && !validateEmail(user.email)) {
        errors.email = 'Email is not valid';
    }

    if (user.phone && !validatePhone(user.phone)) {
        errors.phone = 'Phone number is not valid';
    }

    if(user.bio && user.bio.length > 200) {
        errors.bio = 'Bio should be less than 200 characters';
    }

    return errors;
}

module.exports={validateUserData}