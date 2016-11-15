'use strict';
import * as express from 'express';
let router = express.Router();

router.use((req, res, next) => {
  next();
});


/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', {
  });
});

module.exports = router;
