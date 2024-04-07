
const fs = require('fs');
const { Op } = require('sequelize');
const { AccessRoles, AWSConstants } = require('../constants/roleConstants');
const { findUserFromUserId, updateUser, fetchUsersWithCondition } = require('../dbhelpers/userHelper');
const config = require('../config');
const s3 = require('../utils/s3Utils');
const { generateS3KeyFromUserId } = require('../helpers/s3helpers');
const { validateUserData } = require('../helpers/validationHelper')

exports.fetchUsers = async (req, res) => {
    try {
        const { userId } = req.user;

        const user = await findUserFromUserId(userId);

        if (!user?.accessRole) {
            return res.status(404).json({ message: 'User not found', isSuccess: false });
        }

        if (user.accessRole === AccessRoles.ADMIN) {

            const users = await fetchUsersWithCondition({})
            return res.status(200).json({ users });
        } else {
            const profiles = await fetchUsersWithCondition({
                [Op.or]: [
                    { accessRole: AccessRoles.PUBLIC },
                    { userId: userId }
                ]
            }
            );
            return res.status(200).json({ profiles, message: 'success', isSuccess: true });
        }
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Internal server error', isSuccess: false });
    }
};

exports.fetchMyProfile = async (req, res) => {
    try {
        const { userId } = req.user;
        const profile = await findUserFromUserId(userId);

        if (!profile) {
            return res.status(404).json({ message: 'User not found', isSuccess: false });
        }

        return res.status(200).json({ profile, message: 'success', isSuccess: true });
    } catch (error) {
        console.error('Error fetching userProfile:', error);
        res.status(500).json({ message: 'Internal server error', isSuccess: false });
    }
};

exports.editMyProfile = async (req, res) => {
    try {
        const { userId } = req.user;

        let user = await findUserFromUserId(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.body.imageURL) {
            user.imageURL = req.body.imageURL;
        }

        if (req.body.name) {
            user.name = req.body.name;
        }
        if (req.body.bio) {
            user.bio = req.body.bio;
        }
        if (req.body.phone) {
            user.phone = req.body.phone;
        }
        if (req.body.email) {
            user.email = req.body.email;
        }

        const updatedUser = {
            accessRole: user.accessRole,
            imageURL: user.imageURL,
            name: user.name,
            bio: user.bio,
            phone: user.phone,
            email: user.email
        };
        const errors = validateUserData(updatedUser);
        
        if (Object.keys(errors).length > 0) {
            console.log('Validation Errors:');
            throw new Error('Validation Errors: ' + JSON.stringify(errors));
        } 
        
        await updateUser(userId, updatedUser);

        res.status(200).json({ user: updatedUser, message: 'Profile updated successfully', isSuccess: true });
    } catch (error) {
      if (error.message.startsWith('Validation Errors')) {
        console.error('Validation Errors:', error.message);
        res.status(400).json({ message: error.message, isSuccess: false });
    } else {
        console.error('Error editing user profile:', error);
        res.status(500).json({ message: 'Internal server error', isSuccess: false });
    }
    }
};

exports.uploadUserImage = async (req, res) => {
    try {
        const { userId } = req.user;

        let user = await findUserFromUserId(userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (req.file) {
            const fileContent = fs.readFileSync(req.file.path);

            const params = {
                Bucket: config.AWSConfig.ImageS3Bucket,
                Key: generateS3KeyFromUserId(userId, req.file.originalname),
                Body: fileContent,
            };

            const uploadedObject = await s3.upload(params).promise();
            await updateUser(userId, { imageURL: uploadedObject.Location });
            return res.status(200).json({ message: 'Image Uploaded successfully', isSuccess: true });
        }

        res.status(400).json({ message: 'No file uploaded', isSuccess: false });
    } catch (error) {
        console.error('Error uploading user image:', error);
        res.status(500).json({ message: 'Internal server error', isSuccess: false });
    }
}


exports.editRole = async (req, res) => {
    try {
        const { userId } = req.user;
        const { roleId } = req.body;

        let user = await findUserFromUserId(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await updateUser(userId, { accessRole: roleId });

        res.status(200).json({ message: 'Access role updated successfully', isSuccess: true });
    } catch (error) {
        console.error('Error editing user access role:', error);
        res.status(500).json({ message: 'Internal server error', isSuccess: false });
    }
};
