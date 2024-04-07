const jwt = require('jsonwebtoken');
const config = require('../config');
const { invalidateToken, findTokenDetailsByUserId } = require('../dbhelpers/tokenHelper');

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[0] === 'Bearer' ? authHeader.split(' ')[1] : null;
    if (!token) {
        return res.status(401).json({ message: 'No token provided', isSuccess: false });
    }

    try {
        const user = await jwt.verify(token, config.JWTSecretKey);
        if (!user) {
            return res.status(401).json({ message: 'Invalid token', isSuccess: false });
        }

        const tokenResponse = await findTokenDetailsByUserId(user.userId);
        if (!tokenResponse) {
            return res.status(401).json({ message: 'Invalid token', isSuccess: false });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(403).json({ message: 'Invalid token', isSuccess: false });
        }
        if (error instanceof jwt.TokenExpiredError) {
            await invalidateToken(token);
            return res.status(401).json({ message: 'Token expired. Please log in again.', isSuccess: false });
        }

        console.error('Error authenticating token:', error.message);
        return res.status(500).json({ message: 'Internal server error', isSuccess: false });
    }
};


exports.isLoggedIn = (req, res, next) => {
    try {
      req.user ? next() : res.status(401).json({ message: 'Token expired', isSuccess: false });
    } catch (error) {
      return res.status(500).json({ message: 'Internal server error', isSuccess: false });
    }
    }

