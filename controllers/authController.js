const bcrypt = require('bcrypt');
const passport = require('passport');
const { AccessRoles } = require('../constants/roleConstants')
const { createUser, findUserFromUserEmail } = require('../dbhelpers/userHelper');
const { invalidateTokenDetails, storeTokenDetails, findTokenDetailsByUserId } = require('../dbhelpers/tokenHelper');
const { generateToken } = require('../helpers/jwtHelpers');
const { validateUserData } = require('../helpers/validationHelper');
const { StatusCodes, ResponseMessages} = require('../constants/messages');


exports.register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const errors = validateUserData({ email, password });

    if (Object.keys(errors).length > 0) {
      console.log('Validation Errors:');
      throw new Error('Validation Errors: ' + JSON.stringify(errors));
    }

    if (!email) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: ResponseMessages.ERROR.EMAIL_REQUIRED, isSuccess: false });
    }

    if (!password) {
      return res.status(StatusCodes.BAD_REQUEST).json({ message: ResponseMessages.ERROR.PASSWORD_REQUIRED, isSuccess: false });
    }

    let userDetails = await findUserFromUserEmail(email, []);

    if (userDetails) {
      const passwordMatch = await bcrypt.compare(password, userDetails.password);
      if (!passwordMatch) {
        return res.status(StatusCodes.BAD_REQUEST).json({ message: ResponseMessages.ERROR.INVALID_PASSWORD, isSuccess: false });
      }
      const tokenReponse = await findTokenDetailsByUserId(userDetails.userId);
      if (tokenReponse?.token) {
        return res.status(StatusCodes.CREATED).json({ token: tokenReponse.token });
      }
    }

    if (!userDetails) {
      const hashedPassword = await bcrypt.hash(password, 10);
      userDetails = await createUser({ email, password: hashedPassword, accessRole: AccessRoles.PUBLIC });
    }


    const token = generateToken(userDetails.userId, userDetails.accessRole);

    await storeTokenDetails(userDetails.userId, token);

    res.status(StatusCodes.CREATED).json({ token });

  } catch (error) {
    if (error.message.startsWith('Validation Errors')) {
      console.error('Validation Errors:', error.message);
      res.status(StatusCodes.BAD_REQUEST).json({ message: error.message, isSuccess: false });
    } else {
      console.error('Error registering user:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error', isSuccess: false });
    }
  }

};
exports.signout = async (req, res) => {
  try {
    const { userId } = req.user;

    const rowsAffected = await invalidateTokenDetails(userId);
    if (rowsAffected > 0) {
      res.status(StatusCodes.SUCCESS).json({ message: ResponseMessages.SUCCESS.SIGNOUT_SUCCESS, isSuccess: true });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: ResponseMessages.ERROR.TOKEN_NOT_FOUND, isSuccess: false });
    }
  } catch (error) {
    console.error('Error signing out:', error);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.ERROR.INTERNAL_SERVER_ERROR, isSuccess: false });
  }
};

exports.googleCallBack = async (req, res) => {
  try {
    const { email, name } = req.user['_json'];

    let userDetails = await findUserFromUserEmail(email, []);

    if (userDetails) {
      const tokenResponse = await findTokenDetailsByUserId(userDetails.userId);

      if (tokenResponse?.token) {
        return res.status(StatusCodes.SUCCESS).json({ message: ResponseMessages.SUCCESS.LOGIN_SUCCESS, token: tokenResponse.token, isSuccess: true });
      } else {
        const token = generateToken(userDetails.userId, userDetails.accessRole);
        await storeTokenDetails(userDetails.userId, token);
        return res.status(StatusCodes.SUCCESS).json({ message: ResponseMessages.SUCCESS.LOGIN_SUCCESS, token, isSuccess: true });
      }
    } else {
      userDetails = await createUser({ email, name, accessRole: AccessRoles.PUBLIC });
      const token = generateToken(userDetails.userId, userDetails.accessRole);
      await storeTokenDetails(userDetails.userId, token);
      return res.status(StatusCodes.CREATED).json({ message: `${ResponseMessages.SUCCESS.REGISTERED_SUCCESSFULLY} ${ResponseMessages.SUCCESS.LOGIN_SUCCESS}`, token, isSuccess: true });
    }
  } catch (error) {
    console.error('Error handling Google callback:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.ERROR.INTERNAL_SERVER_ERROR, isSuccess: false });
  }
};

exports.googleFailure = (req, res) => {
  res.status(StatusCodes.UNAUTHORIZED).json({ message: ResponseMessages.ERROR.AUTH_FAILED, isSuccess: false });
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
      res.status(StatusCodes.NOT_FOUND).json({ message: ResponseMessages.ERROR.TOKEN_NOT_FOUND, isSuccess: false });
    }
  } catch (error) {
    console.error('Error handling Google logout:', error);
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ message: ResponseMessages.ERROR.INTERNAL_SERVER_ERROR, isSuccess: false });
  }
};
