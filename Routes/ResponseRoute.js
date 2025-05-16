const express = require('express');
const Responserouter = express.Router();
const auth = require('../Middleware/authentication');
const responseController = require('../Controllers/ResponseController');

Responserouter.post('/create', auth.BothJWT, responseController.createResponse);
Responserouter.get('/all', auth.BothJWT, responseController.getAllResponses);
Responserouter.get('/get/:id', auth.AuthJWT, responseController.getResponseById);
Responserouter.put('/update/:id', auth.BothJWT, responseController.updateResponse);
Responserouter.delete('/delete/:id', auth.BothJWT, responseController.deleteResponse);
Responserouter.get('/byComplaint/:id', auth.AuthJWT, responseController.getResponsesByComplaint);
Responserouter.get('/byResponser/:id', auth.AuthJWT, responseController.getResponsesByResponder);


module.exports = Responserouter;
