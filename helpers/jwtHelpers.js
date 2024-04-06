
const { JWTConstants } = require('../constants/roleConstants')
const { JWTSecretKey } = require('../config');
const jwt = require('jsonwebtoken');
function generateToken(userId, expiry = JWTConstants.EXPIRY) {
    return jwt.sign(
        { userId },
        JWTSecretKey,
        { expiresIn: expiry }
    );
}

module.exports = {
    generateToken
}