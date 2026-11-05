const express = require('express');
const router = express.Router();

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CS3425 Course Project' });
});

// GET another page
router.get('/page', function(req, res, next) {
  res.send('respond with a resource');
});

module.exports = router;
