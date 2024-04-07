const jwt = require('jsonwebtoken');
const config = require('../config');
const { invalidateTokenDetails, findTokenDetailsByUserId } = require('../dbhelpers/tokenHelper');

exports.authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) {
            return res.status(401).json({ message: 'No token provided', isSuccess: false });
        }
        const user = await jwt.verify(token, config.JWTSecretKey);
        if (user) {
            const tokenReponse = await findTokenDetailsByUserId(user.userId);
            if(!tokenReponse){
                return res.status(401).json({ message: 'Invalid token', isSuccess: false });
            }
        }
        req.user = user;
        req.token = token;
        next(); 
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token', isSuccess: false });
        }
        if (error.name === 'TokenExpiredError') {
            await invalidateTokenDetails(req.user.userId);
            return res.status(401).json({ message: 'Token expired', isSuccess: false });
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

