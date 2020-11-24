const rp = require('request-promise-native')
const express = require('express')
const dotenv = require('dotenv');
const { getYesterdays } = require('./middlewares')

const router = express.Router();

dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY
const time = 1605745732;

//lat, lon: 36.354687/127.420997
router.get('/:lat/:lon', getYesterdays, async (req, res) => {

    // await rp({
    //         uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
    //         qs: {
    //             lat: req.params.lat,
    //             lon: req.params.lon,
    //             dt: time,
    //             appid: apiKey

    //         }
    //     }, (response, body) => {
    //         //hourly => func() => 0, 3, 6, 9..21
    //         //hourly.dt, temp, feels_like, humidity, clouds, *rain, *snow, [weather]

    //         const beforeWeather = JSON.parse(body.body);
    //         const befores = parse(beforeWeather.hourly)
    //         res.locals.befores = befores;

    //     });

    // await rp({
    //     uri: "https://api.openweathermap.org/data/2.5/onecall",
    //     qs: {
    //         lat: req.params.lat,
    //         lon: req.params.lon,
    //         exclude: "current,minutely,daily,alerts",
    //         appid: apiKey
    //     }
    // }, (response, body) => {
    //     const forecastWeather = JSON.parse(body.body);
    //     const forecasts = parse(forecastWeather.hourly);
    //     const todays = forecasts.slice(0,7);
    //     const tomorrows = forecasts.slice(8);
    //     res.locals.todays = todays;
    //     res.locals.tomorrows = tomorrows;
    // });

    // const allWeather = {
    //     yesterdays: res.locals.yesterdays,
    //     befores: res.locals.befores,
    //     todays: res.locals.todays,
    //     tomorrows: res.locals.tomorrows
    // };
    // console.log(req.isUtcUpdate);

    // res.send(allWeather.todays);
    res.send(req.yesterdays);

});

function parse(body) {

    const data = [];
    try {
        for (let i = 0; i < body.length; i += 3) {
            data.push({
                dt: body[i].dt,
                temp: body[i].temp,
                feels_like: body[i].feels_like,
                clouds: body[i].clouds,
                rain: body[i].rain,
                snow: body[i].snow,
                weather: body[i].weather
            });
        }
    } catch (error) {
        console.error(error);
        done(error);
    }

    return data;
}


module.exports = router;