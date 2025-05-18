const jwt = require('jsonwebtoken');
const asyncWrapper = require('../Middleware/async');
const userModel = require('../Models/UserModel');
const BadRequest = require('../Error/BadRequest');
const NotFound = require('../Error/NotFound');

const login_post = asyncWrapper(async (req, res, next) => {
    const { email, password } = req.body;
    const secret = process.env.SECRET_KEY;

    // Validate required fields
    if (!email || !password) {
        return next(new BadRequest('Email and password are required'));
    }

    // Attempt login
    let user;
    try {
        user = await userModel.login(email, password);
    } catch (error) {
        console.error('Login error:', error.message);
        return next(new NotFound('Invalid email or password'));
    }

    const { _id: userId, username, role } = user;

    // Validate role against allowed list
    const validRoles = ['citizen', 'admin', 'super-admin'];
    if (role && !validRoles.includes(role)) {
        return next(new BadRequest('Invalid user role'));
    }

    // Generate JWT token
    const token = jwt.sign({ userId, username, role }, secret, {
        expiresIn: '1h',
    });

    // Set token in cookie and header
    res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'Lax',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({ user, token });
});


const logout = asyncWrapper(async (req, res, next) => {
  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'Lax',
  });
  res.status(200).json({ message: 'Logged out successfully' });
});

module.exports = {
    login_post,
    logout
};
