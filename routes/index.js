const express = require('express')

//const history = require('./getHistory')
const test = require('./test');

const router = express.Router();


router.use('/test', test);
//router.get('/test', test);

module.exports = router;