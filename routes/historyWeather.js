const rp = require('request-promise-native')
const express = require('express')
const dotenv = require('dotenv');
const { getYesterdays, befores, forecasts } = require('./middlewares')

const router = express.Router();

dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY
const time = 1605745732;

//lat, lon: 36.354687/127.420997
router.get('/:lat/:lon', getYesterdays, befores, forecasts, async (req, res) => {

    // const allWeather = {
    //     yesterdays: res.locals.yesterdays,
    //     befores: res.locals.befores,
    //     todays: res.locals.todays,
    //     tomorrows: res.locals.tomorrows
    // };
    // console.log(req.isUtcUpdate);

    // res.send(allWeather.todays);

    console.log("y");
    console.log(req.yesterdays)
    console.log("b");
    console.log(req.befores);
    console.log("f");
    console.log(req.forecasts);
    res.send(req.forecasts);

});


module.exports = router;