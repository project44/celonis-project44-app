const express = require("express");
const router = express.Router();
const controller = require('../controllers/project44.webhook.controller');

router
  .post('/webhook/from/project44', (req, res, next) => {
    controller.receivePost(req, res, next);
  });
 
router
  .delete('/removefiles', (req, res, next) => {
  controller.receiveDeleteFiles(req, res, next);
});

module.exports = router;