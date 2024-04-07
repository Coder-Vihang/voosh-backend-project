const TokenDetails = require('../models/tokenDetails');

async function invalidateTokenDetails(userId) {
    try {
        const [rowsAffected] = await TokenDetails.update(
            { isActive: false },
            { where: { userId, isActive: true } }
        );
        return rowsAffected ;
    } catch (error) {
        console.error('Error updating token detail:', error);
        throw error;
    }
}

async function storeTokenDetails(userId, token) {
    try {

        const tokenReponse = await TokenDetails.create({
            userId,
            token,
            isActive: true
        }
        );
        return tokenReponse
    } catch (error) {
        console.error('Error updating token detail:', error);
        throw error;
    }
}

async function findTokenDetailsByUserId(userId) {
    try {
        const tokenDetails = await TokenDetails.findOne({ where: { userId, isActive: true }, raw: true });
        return tokenDetails;
    } catch (error) {
        console.error('Error finding token detail:', error);
        throw error;
    }
}

async function invalidateToken(token) {
    try {
        const [rowsAffected] = await TokenDetails.update(
            { isActive: false },
            { where: { token, isActive: true } }
        );
        return rowsAffected ;
    } catch (error) {
        console.error('Error updating token detail:', error);
        throw error;
    }
}


module.exports = { invalidateTokenDetails, storeTokenDetails, findTokenDetailsByUserId, invalidateToken };
