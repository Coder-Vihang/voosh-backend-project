const { Op } = require('sequelize');
const User = require('../models/User');


const findUserFromUserId = async (userId, attributesExclude = ['password']) => {
    try {
        const profile = await User.findOne({
            where: {
                userId: userId
            },
            attributes: { exclude: attributesExclude },
            raw: true
        });
        return profile;
    } catch (error) {
        console.error('Error Fetching user:', error);
        throw error;
    }
}

const findUserFromUserEmail = async (emailId, attributesExclude = ['password']) => {
    try {
        const profile = await User.findOne({
            where: {
                email: emailId
            },
            attributes: { exclude: attributesExclude},
            raw: true
        });
        return profile
    } catch (error) {
        console.error('Error Fetching user:', error);
        throw error;
    }
}

const createUser = async (data) => {
    try {
        const user = await User.create(data);
        return user;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
}

const fetchUsersWithCondition = async (customCondition) => {
    try {
        const users = await User.findAll({
            where: customCondition,
            attributes: { exclude: ['password'] },
            raw: true
        });
        return users;
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

const updateUser = async (userId, data) => {
    try {
        const user = await User.update(data, {
            where: {
                userId: userId
            }
        });
        return user;
    } catch (error) {
        console.error('Error updating user:', error);
        throw error;
    }
}

module.exports = {
    findUserFromUserId,
    createUser,
    findUserFromUserEmail,
    updateUser,
    fetchUsersWithCondition
}