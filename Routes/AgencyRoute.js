const express = require('express');
const router = express.Router();
const auth = require('../Middleware/authentication');
const agencyController = require('../Controllers/AgencyController');
const checkAdmin = require('../Middleware/CheckSuperAdmin');

router.post('/create',auth.superAdminJWT, agencyController.createAgency);
router.get('/getall', auth.AuthJWT,agencyController.getAllAgencies);
router.get('/filter',auth.AuthJWT, agencyController.filterAgencies);
router.get('/by-email', auth.AuthJWT,agencyController.getAgencyByEmail);
router.get('/getOne/:id',auth.AuthJWT, agencyController.getAgencyById);
router.put('/update/:id',auth.BothJWT, agencyController.updateAgency);
router.delete('/delete/:id', auth.superAdminJWT,agencyController.deleteAgency);

module.exports = router;
