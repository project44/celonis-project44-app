const express = require("express");
const router = express.Router();
const controller = require('../controllers/project44.webhook.controller');

// router.post('/webhook/from/project44', (req, res, next) => {
//   console.log('Received webhook from project44');
//   console.log(req.body);
//   res.status(200).send('Received webhook from project44');  
// });

router
  .post('/webhook/from/project44', (req, res, next) => {
    controller.receivePost(req, res, next);
  });


module.exports = router;