const rp = require('request-promise-native')
const dotenv = require('dotenv');
const { response } = require('express');
const winston = require('../config/winston')

const apiKey = process.env.OPENWEATHER_API_KEY
const lat = 36.354687; 
const lon = 127.420997;

//lat/lon: 36.354687/127.420997
//router.get('/:lat/:lon', async (req, res) => {

let interval = setInterval(async () => {
    const W = {
        yesterdays: [],
        befores: [],
        todays: [],
        tomorrows: [],
    }
    const time = conv();
    // winston.info(new Date((time + 32400) * 1000));
    winston.info(new Date(time * 1000));
    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
        qs: {
            lat: lat,
            lon: lon,
            dt: time - 86400,
            appid: apiKey

        }
    }, (response, body) => {
        //hourly => func() => 0, 3, 6, 9..21
        //hourly.dt, temp, feels_like, humidity, clouds, *rain, *snow, [weather]

        const yesterdayWeather = JSON.parse(body.body);
        const yesterdays = parse(yesterdayWeather.hourly)

        W.yesterdays = yesterdays;

    });

    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
        qs: {
            lat: lat,
            lon: lon,
            dt: time,
            appid: apiKey

        }
    }, (response, body) => {
        //hourly => func() => 0, 3, 6, 9..21
        //hourly.dt, temp, feels_like, humidity, clouds, *rain, *snow, [weather]

        const beforeWeather = JSON.parse(body.body);
        const befores = parse(beforeWeather.hourly)
        W.befores = befores;

    });

    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall",
        qs: {
            lat: lat,
            lon: lon,
            exclude: "current,minutely,daily,alerts",
            appid: apiKey
        }
    }, (response, body) => {
        const forecastWeather = JSON.parse(body.body);
        const forecasts = parse(forecastWeather.hourly);
        const todays = forecasts.slice(0, 7);
        const tomorrows = forecasts.slice(8);
        W.todays = todays;
        W.tomorrows = tomorrows;
    });

    const allWeather = {
        yesterdays: W.yesterdays,
        befores: W.befores,
        todays: W.todays,
        tomorrows: W.tomorrows
    };

    winston.info("yester");
    for (let w of allWeather.yesterdays) {
        // winston.info(new Date((w.dt + 32400) * 1000));
        winston.info(new Date(w.dt * 1000));
    }
    winston.info("before");
    for (let w of allWeather.befores) {
        // winston.info(new Date((w.dt + 32400) * 1000));
        winston.info(new Date(w.dt * 1000));
    }
    winston.info("today");
    for (let w of allWeather.todays) {
        // winston.info(new Date((w.dt + 32400) * 1000));
        winston.info(new Date(w.dt * 1000));
    }
    winston.info("tomorrow");
    for (let w of allWeather.tomorrows) {
        // winston.info(new Date((w.dt + 32400) * 1000));
        winston.info(new Date(w.dt * 1000));

    }
    winston.info("---------------------------")
}, 10000);


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
    winston.info("현재" + new Date());  //server time
    return Math.floor(new Date().getTime() / 1000);
}



