const rp = require('request-promise-native')
const express = require('express')
const { getYesterdays, befores, forecasts } = require('./middlewares')

const router = express.Router();

//lat, lon: 36.354687/127.420997
router.get('/:lat/:lon', getYesterdays, befores, forecasts, async (req, res) => {

    console.log("y");
    console.log(req.yesterdays)
    console.log("b");
    console.log(req.befores);
    console.log("f");
    console.log(req.forecasts);
    
    res.send(req.forecasts);

});


module.exports = router;