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
    const expiryDate = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day
    res.setHeader('Authorization', `Bearer ${token}`);
    res.cookie('jwt', token, {
        httpOnly: true,
        path: '/',
        expires: expiryDate,
        secure: true,
        sameSite: 'Strict'
    });

    res.status(200).json({ user, token });
});

const logout = asyncWrapper(async (req, res, next) => {
    const token = req.cookies.jwt;
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const secret = process.env.SECRET_KEY;
    jwt.verify(token, secret, (err) => {
        if (err) {
            return res.status(401).json({ error: 'Unauthorized: Invalid token' });
        } else {
            res.clearCookie('jwt');
            res.json({ message: 'Logged out successfully' });
        }
    });
});

module.exports = {
    login_post,
    logout
};
