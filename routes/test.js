const request = require('request');
const express = require('express')
const dotenv = require('dotenv');
const { response } = require('express');

const router = express.Router();

dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY
const lat = 36.354661;
const lon = 127.420958;
const time = 1605539776 ;
const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${time}&appid=${apiKey}`
// const url = {
//     uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
//     qs: {
//         lat: lat,
//         lon: lon,
//         dt: time,
//         appid: apiKey
//     }
// };

//const getHistory

router.use('/', async (req, res) => {
    await request(url, (response, body) => {
        console.log("test1");
        console.log(body.body);
        //next(res);
    });
    //console.log(req);
    //res.render(req);
    
});




module.exports = router;