const express = require('express');
const router = express.Router();
const agencyController = require('../Controllers/AgencyController');

router.post('/', agencyController.createAgency);
router.get('/', agencyController.getAllAgencies);
router.get('/filter', agencyController.filterAgencies);
router.get('/by-email', agencyController.getAgencyByEmail);
router.get('/:id', agencyController.getAgencyById);
router.put('/:id', agencyController.updateAgency);
router.delete('/:id', agencyController.deleteAgency);

module.exports = router;
