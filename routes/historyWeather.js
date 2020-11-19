const rp = require('request-promise')
const express = require('express')
const dotenv = require('dotenv');
const { response } = require('express');

const router = express.Router();

dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY
const time = 1605657600;

//lat: 36.354687, lon: 127.420997
router.get('/:lat/:lon', async (req, res) => {

    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
        qs: {
            lat: req.params.lat,
            lon: req.params.lon,
            dt: time,
            appid: apiKey

        }
    }, (response, body) => {
        //hourly => func() => 0, 3, 6, 9..21
        //hourly.dt, temp, feels_like, humidity, clouds, *rain, *snow, [weather]

        const historyWeather = JSON.parse(body.body);
        const historys = parse(historyWeather.hourly)

        res.locals.historys = historys;

    });

    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall",
        qs: {
            lat: req.params.lat,
            lon: req.params.lon,
            exclude: "current,minutely,daily,alerts",
            appid: apiKey
        }
    }, (response, body) => {
        const forecastWeather = JSON.parse(body.body);
        const forecasts = parse(forecastWeather.hourly);
        const todays = forecasts.slice(0,7);
        const tomorrows = forecasts.slice(8);
        res.locals.todays = todays;
        res.locals.tomorrows = tomorrows;
    });

    const allWeather = {
        historys: res.locals.historys,
        todays: res.locals.todays,
        tomorrows: res.locals.tomorrows
    };

    res.send(allWeather.todays);

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