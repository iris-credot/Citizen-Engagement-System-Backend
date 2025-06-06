const express = require('express');
const router = express.Router();
const auth = require('../Middleware/authentication');
const complaintController = require('../Controllers/ComplaintController');

router.post('/create',auth.AuthJWT, complaintController.createComplaint);
router.get('/getall', auth.superAdminJWT,complaintController.getAllComplaints);
router.get('/filter',auth.AuthJWT, complaintController.filterComplaints);
router.get('/getOneAgency/:agencyId', auth.AuthJWT,complaintController.getComplaintsByAgency);
router.get('/getCategories', auth.AuthJWT,complaintController.getComplaintCategories);
router.get('/getOne/:userId', auth.AuthJWT,complaintController.getComplaintsByUser);
router.put('/status/:id', auth.BothJWT, complaintController.changeComplaintStatus);
router.get('/getOneComplaint/:id',auth.AuthJWT, complaintController.getComplaintById);
router.put('/update/:id',auth.AuthJWT, complaintController.updateComplaint);
router.delete('/delete/:id', auth.AuthJWT,complaintController.deleteComplaint);

module.exports = router;
