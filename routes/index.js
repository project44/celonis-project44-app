const express = require('express');
const webhookRoute = require('./webhook');
const config = require('../config/config');

const router = express.Router();

const defaultRoutes = [
  {
    path: '/api/webhook/fromp44',
    route: webhookRoute,
  }, 
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;