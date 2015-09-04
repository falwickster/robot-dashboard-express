var express = require('express');
var router = express.Router();

/* GET topics page. */
router.get('/topics', function(req, res, next) {
  res.render('index', { title: 'Lista topików' });
});

module.exports = router;
