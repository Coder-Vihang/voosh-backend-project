
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWTSecretKey } = require('../config');
const { AccessRoles, JWTConstants } = require('../constants/roleConstants')
const { createUser, findUserFromUserEmail } = require('../dbhelpers/userHelper');
const { invalidateTokenDetails, storeTokenDetails, findTokenDetailsByUserId } = require('../dbhelpers/tokenHelper');
const { generateToken } = require('../helpers/jwtHelpers');

exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    let userDetails = await findUserFromUserEmail(email, []);

    if (userDetails) {
      const passwordMatch = await bcrypt.compare(password, userDetails.password);
      if (!passwordMatch) {
        return res.status(400).json({ message: 'Invalid password', isSuccess: false });
      }
      const tokenReponse = await findTokenDetailsByUserId(userDetails.userId);
      if(tokenReponse?.token){
        return res.status(201).json({ token: tokenReponse.token });
      }
    }

    if (!userDetails) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userDetails = await createUser({ email, password: hashedPassword, accessRole: AccessRoles.PUBLIC });
    }

   
      const token = generateToken(userDetails.userId, userDetails.accessRole);
      await storeTokenDetails(userDetails.userId, token);
      res.status(201).json({ token });

    
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }

};
exports.signout = async (req, res) => {
  try {
    const { userId } = req.user;

    const rowsAffected = await invalidateTokenDetails(userId);
    if (rowsAffected > 0) {
      res.status(200).json({ message: 'Signout successful', isSuccess: true });
    } else {
      res.status(404).json({ message: 'Token not found for the provided userId' });
    }
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({ message: 'Internal server error', isSuccess: false });
  }
};


exports.registerOauth = async (req, res) => {
  console.log(req.body);
  res.status(200).json({ message: 'Google registration successfully', isSuccess: true });
};

exports.googleCallBack = async (req, res) => {
  console.log(req.user);
  res.status(200).json({ message: 'Google callback successfully', isSuccess: true });
}
