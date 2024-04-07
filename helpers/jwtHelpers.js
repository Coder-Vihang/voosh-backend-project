
const { JWTConstants } = require('../constants/roleConstants')
const { JWTSecretKey } = require('../config');
const jwt = require('jsonwebtoken');
function generateToken(userId) {
    return jwt.sign(
        { userId },
        JWTSecretKey,
        { expiresIn: JWTConstants.EXPIRY }
    );
}

module.exports = {
    generateToken
}