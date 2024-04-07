const ResponseMessages = {
    ERROR: {
        USER_NOT_FOUND: 'User not found',
        EMAIL_REQUIRED: 'Email is required',
        PASSWORD_REQUIRED: 'Password is required',
        INTERNAL_SERVER_ERROR: 'Internal server error',
        INVALID_PASSWORD: 'Invalid password',
        TOKEN_NOT_FOUND: 'Token not Found',
        AUTH_FAILED: 'Authentication failed',
        FILE_UPLOADED: 'NO FILE UPLOADED',
        INVALID_TOKEN: 'Invalid token',
        TOKEN_EXPIRED: 'Token expired',
        LOGIN_AGAIN: 'Login Again',

    },
    SUCCESS: {
        REGISTERED_SUCCESSFULLY: 'Registered successfully',
        LOGIN_SUCCESS: 'Login successful',
        SIGNOUT_SUCCESS: 'Signout successful',
        PROFILE_UPDATED: 'Profile updated successfully',
        IMAGE_UPLOADED: 'Image uploaded successfully',
        ROLE_UPDATED: 'Role updated successfully',
        PROFILE_FETCHED: 'Profile fetched successfully'
    }
}
const StatusCodes = {
    SUCCESS: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_SERVER_ERROR: 500
}

module.exports = {
    ResponseMessages,
    StatusCodes
}