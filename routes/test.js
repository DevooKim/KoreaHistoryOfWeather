const rp = require('request-promise')
const express = require('express')
const dotenv = require('dotenv');

const router = express.Router();

dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY
const lat = 36.354661;
const lon = 127.420958;
const time = 1605578400;
//const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&appid=${apiKey}`
const url = {
    uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
    qs: {
        lat: lat,
        lon: lon,
        dt: time,
        appid: apiKey
    }
};

//const getHistory

router.use('/', async (req, res) => {
    await rp(url, (response, body) => {
        console.log("test1");
        //console.log(body.body);
        res.locals.test = body.body;
    });
    console.log("test2");
    const test = res.locals.test;
    console.log(test);
    res.send(test);
    
});




module.exports = router;