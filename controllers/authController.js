const bcrypt = require('bcrypt');
const passport = require('passport');
const { AccessRoles } = require('../constants/roleConstants')
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
      if (tokenReponse?.token) {
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
      res.status(404).json({ message: 'Token not found for the provided userId',isSuccess: false });
    }
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(500).json({ message: 'Internal server error', isSuccess: false });
  }
};

exports.googleCallBack = async (req, res) => {
  try {
    const { email } = req.user['_json'];

    let userDetails = await findUserFromUserEmail(email, []);

    if (userDetails) {
      const tokenResponse = await findTokenDetailsByUserId(userDetails.userId);

      if (tokenResponse?.token) {
        return res.status(200).json({ message: 'User logged in successfully', token: tokenResponse.token, isSuccess: true });
      } else {
        const token = generateToken(userDetails.userId, userDetails.accessRole);
        await storeTokenDetails(userDetails.userId, token);
        return res.status(200).json({ message: 'User logged in successfully', token, isSuccess: true });
      }
    } else {
      userDetails = await createUser({ email, accessRole: AccessRoles.PUBLIC });
      const token = generateToken(userDetails.userId, userDetails.accessRole);
      await storeTokenDetails(userDetails.userId, token);
      return res.status(201).json({ message: 'User registered and logged in successfully', token, isSuccess: true });
    }
  } catch (error) {
    console.error('Error handling Google callback:', error);
    return res.status(500).json({ message: 'Internal server error', isSuccess: false });
  }
};

exports.googleFailure = (req, res) => {
  res.status(401).json({ message: 'Google authentication failed', isSuccess: false });
}
exports.google = passport.authenticate('google', { scope: ['email', 'profile'] })

exports.googleLogout = async (req, res) => {
  try {
    const { email } = req.user['_json'];
 
    let userDetails = await findUserFromUserEmail(email, []);

    const rowsAffected = await invalidateTokenDetails(userDetails.userId);

    if (rowsAffected > 0) {
      req.session.destroy();
      res.redirect('/');
    } else {
      res.status(404).json({ message: 'Token not found for the provided userId' });
    }
  } catch (error) {
    console.error('Error handling Google logout:', error);
    return res.status(500).json({ message: 'Internal server error', isSuccess: false });
  }
};
