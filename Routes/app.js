const CategoryRoute = require('./CategoryRoute.js');
const UserRoute = require('./UserRoute.js');
const AgencyRoute = require('./AgencyRoute.js');
const ComplaintRoute = require('./ComplaintRoute.js');
const ResponseRoute = require('./ResponseRoute.js');
const NotificationRoute =require('./NotificationRoute.js');


const express = require('express');

const Router= express.Router();
Router.use('/category',CategoryRoute);
Router.use('/user',UserRoute);
Router.use('/agency',AgencyRoute);
Router.use('/complaint',ComplaintRoute);
Router.use('/response',ResponseRoute);
Router.use('/notify',NotificationRoute);



module.exports = Router;