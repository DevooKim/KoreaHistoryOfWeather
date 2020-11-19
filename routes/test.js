const rp = require('request-promise')
const express = require('express')
const dotenv = require('dotenv');
const { response } = require('express');

const router = express.Router();

dotenv.config();

const apiKey = process.env.OPENWEATHER_API_KEY
// const time = 1605745732;

//lat/lon: 36.354687/127.420997
router.get('/:lat/:lon', async (req, res) => {

    const time = conv();
    // const time = conv() - 3600;
    console.log(new Date((time + 32400)*1000));
    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
        qs: {
            lat: req.params.lat,
            lon: req.params.lon,
            dt: time - 86400,
            appid: apiKey

        }
    }, (response, body) => {
        //hourly => func() => 0, 3, 6, 9..21
        //hourly.dt, temp, feels_like, humidity, clouds, *rain, *snow, [weather]

        const yesterdayWeather = JSON.parse(body.body);
        const yesterdays = parse(yesterdayWeather.hourly)

        res.locals.yesterdays = yesterdays;

    });

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

            const beforeWeather = JSON.parse(body.body);
            const befores = parse(beforeWeather.hourly)
            res.locals.befores = befores;

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
        yesterdays: res.locals.yesterdays,
        befores: res.locals.befores,
        todays: res.locals.todays,
        tomorrows: res.locals.tomorrows
    };

    console.log("y");
    for(let w of allWeather.yesterdays) {
        console.log(new Date((w.dt + 32400) * 1000));
    }
    console.log("b");
    for(let w of allWeather.befores) {
        console.log(new Date((w.dt + 32400) * 1000));
    }
    console.log("t");
    for(let w of allWeather.todays) {
        console.log(new Date((w.dt + 32400) * 1000));
    }
    console.log("tomo");
    for(let w of allWeather.tomorrows) {
        console.log(new Date((w.dt + 32400) * 1000));
    }
    res.send(allWeather);

});

function parse(body) {

    const data = [];
    try {
        for (let i = 0; i < body.length; i++) {
            data.push({
                dt: body[i].dt
            })
        }
    } catch (error) {
        console.error(error);
        done(error);    
    }

    return data;
}

function conv() {
    console.log("현재" + new Date());
    return Math.floor(new Date().getTime() / 1000);
}





module.exports = router;