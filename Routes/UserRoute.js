const express = require('express');
const Userrouter= express.Router();
const validate= require('../Middleware/validation');
const checkAdmin = require('../Middleware/CheckSuperAdmin');
const auth = require('../Middleware/authentication');
const authController = require('../Controllers/UserController');
const login = require('../Controllers/LoginController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

Userrouter.post('/signup', upload.single('image'),validate,authController.createUser);
Userrouter.post('/signupAdmin', upload.single('image'),validate,auth.superAdminJWT,checkAdmin,authController.createAdminUser);
Userrouter.post('/login', login.login_post);
Userrouter.post('/forgot', authController.ForgotPassword);
Userrouter.post('/verifyotp', authController.OTP);
Userrouter.post('/logout', login.logout);
Userrouter.get('/all' ,auth.superAdminJWT,authController.getAllUsers);
Userrouter.delete('/delete/:id',auth.superAdminJWT, authController.deleteUser);
Userrouter.put('/profile/:id', auth.AuthJWT,authController.updateUser);
Userrouter.put('/password', auth.AuthJWT,authController.UpdatePassword);
Userrouter.post('/resetpassword/:token', authController.ResetPassword);

module.exports = Userrouter;