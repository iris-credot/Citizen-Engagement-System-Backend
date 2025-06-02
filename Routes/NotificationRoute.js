
const express = require('express');
const router = express.Router();
const auth = require('../Middleware/authentication');
const {
    notificationController
} = require('../Controllers/NotificationController');


router.get('/getall', auth.superAdminJWT,notificationController.getAllNotifications);
router.get('/get/:id',auth.AuthJWT, notificationController.getNotificationsByUser);
router.get('/getByAgency/:id',auth.AuthJWT, notificationController.getNotificationsByAgency);
router.delete('/delete/:id',auth.AuthJWT, notificationController.deleteNotification);


module.exports = router;
