const jwt = require('jsonwebtoken');
const config = require('../config');
const { invalidateToken, findTokenDetailsByUserId } = require('../dbhelpers/tokenHelper');
const {ResponseMessages, StatusCodes} = require('../constants/messages');

exports.authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[0] === 'Bearer' ? authHeader.split(' ')[1] : null;
    if (!token) {
        return res.status(StatusCodes.UNAUTHORIZED).json({ message: ResponseMessages.ERROR.TOKEN_NOT_FOUND, isSuccess: false });
    }

    try {
        const user = await jwt.verify(token, config.JWTSecretKey);
        if (!user) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: ResponseMessages.ERROR.INVALID_TOKEN, isSuccess: false });
        }

        const tokenResponse = await findTokenDetailsByUserId(user.userId);
        if (!tokenResponse) {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: ResponseMessages.ERROR.INVALID_TOKEN, isSuccess: false });
        }

        req.user = user;
        req.token = token;
        next();
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(StatusCodes.FORBIDDEN).json({ message: ResponseMessages.ERROR.INVALID_TOKEN, isSuccess: false });
        }
        if (error instanceof jwt.TokenExpiredError) {
            await invalidateToken(token);
            return res.status(StatusCodes.UNAUTHORIZED).json({ message:`${ResponseMessages.ERROR.TOKEN_EXPIRED} ${ResponseMessages.ERROR.LOGIN_AGAIN}` , isSuccess: false });
        }

        console.error('Error authenticating token:', error.message);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.ERROR.INTERNAL_SERVER_ERROR, isSuccess: false });
    }
};


exports.isLoggedIn = (req, res, next) => {
    try {
      req.user ? next() : res.status(StatusCodes.UNAUTHORIZED).json({ message: ResponseMessages.ERROR.TOKEN_NOT_FOUND, isSuccess: false });
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.ERROR.INTERNAL_SERVER_ERROR, isSuccess: false });
    }
    }

