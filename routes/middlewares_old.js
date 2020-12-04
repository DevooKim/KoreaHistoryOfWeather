const rp = require('request-promise-native')
const dotenv = require('dotenv')
const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
//const { isCaching, getCache, setCache} = require('../db/caching')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");
// const kor = dayjs().tz();

dotenv.config();
const apiKey = process.env.OPENWEATHER_API_KEY;

exports.getYesterdays = async (req, res, next) => {
    const kor = dayjs.tz();
    const { lat, lon } = req.params;
    const location = { lat: lat, lon: lon };
    const key = "Y" + location.lat + location.lon;
    const isCached = await isCaching(key);
    
    console.log(isCached)
    if (isCached) {
        console.log('=============')
        req.yesterdays = await getCache(key);
        // console.log("yes" + req.yesterdays);
        next()
    } else {
        const unixTime = await getUnixTime(1);
        const yesterdays = await rqHistory(location, unixTime);
    
        if (0 <= kor.hour() && kor.hour() < 9) {
            req.yesterdays = yesterdays;
            await setCache(key, yesterdays);
    
        } else {
            const unixTime = await getUnixTime(2);
            const secondYesterdays = await rqHistory(location, unixTime)
            const newYesterdays = secondYesterdays.concat(yesterdays)
            req.yesterdays = newYesterdays;
            const test = await setCache(key, newYesterdays);
            console.log(test);
        }
        next();
    }
    
    // const unixTime = await getUnixTime(1);
    // const yesterdays = await rqHistory(location, unixTime);

    // if (0 <= kor.hour() && kor.hour() < 9) {
    //     req.yesterdays = yesterdays;
    //     next();

    // } else {
    //     const unixTime = await getUnixTime(2);
    //     const secondYesterdays = await rqHistory(location, unixTime)
    //     const newYesterdays = secondYesterdays.concat(yesterdays)
    //     req.yesterdays = newYesterdays;
    //     next();
    // }

};

exports.befores = async (req, res, next) => {
    const kor = dayjs.tz();
    const location = { lat: req.params.lat, lon: req.params.lon };
    const key = "B" + location.lat + location.lon;

    if (isCaching(key)) {
        req.befores = getCache(key);
        next();
    } else {
        const unixTime = await getUnixTime(0);
        const befores = await rqHistory(location, unixTime);
        setCache(key, befores);
        req.befores = befores;
        next();
    }
}

exports.forecasts = async (req, res, next) => {
    const location = { lat: req.params.lat, lon: req.params.lon };

    //if (isCaching(location) next(data))
    //else caching
    // const key = "" + location.lat + location.lon;

    
    const fores = await rqForecasts(location);

    req.forecasts = fores;
    next();
}

async function rqHistory(location, time) {
    let historys = undefined;
    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
            qs: {
                lat: location.lat,
                lon: location.lon,
                dt: time,
                appid: apiKey
            }
        }, (response, body) => {
            const historyWeather = JSON.parse(body.body);
            if (historyWeather.hourly === undefined) {
                historys = parse([historyWeather.current])  //AM9:00(Seoul) //not verification
            } else {
                historys = parse(historyWeather.hourly);
            }

        });
    return historys;
}

async function rqForecasts(location) {
    let forecasts = undefined;
    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall",
        qs: {
            lat: location.lat,
            lon: location.lon,
            exclude: "current,minutely,daily,alerts",
            appid: apiKey
        }
    }, (response, body) => {
        const kor = dayjs.tz();
        const forecastWeather = JSON.parse(body.body);
        const start = 3 - ( kor.hour() % 3 );
        forecasts = parse(forecastWeather.hourly, start);
        //forecasts = parse(forecastWeather.hourly);
    });
    return forecasts
}

async function getUnixTime(offset) {
    let kor = dayjs.tz();
    // console.log('now-u: ' + kor.format());
    kor = kor.subtract(2, 'second');
    return Math.floor(kor.subtract(offset, 'day') / 1000);
}

function parse(body, start = 0) {
    const data = [];
    try {
        for (let i = start; i < body.length; i += 3) {
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
        console.error("parse Error: " + error);
    }
    return data;
}