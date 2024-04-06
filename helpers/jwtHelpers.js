
const { JWTConstants } = require('../constants/roleConstants')
const { secretKey } = require('../config');
const jwt = require('jsonwebtoken');
function generateToken(userId, accessRole, expiry = JWTConstants.EXPIRY) {
    return jwt.sign(
        { userId, accessRole },
        secretKey,
        { expiresIn: expiry }
    );
}

module.exports = {
    generateToken
}