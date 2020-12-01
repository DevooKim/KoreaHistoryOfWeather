const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const { rqHistory, rqForecasts } = require('./func/request')
const { setCache } = require('./func/cache')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul")

exports.getYesterdays = async (req, res, next) => {
    const kor = dayjs.tz();
    const { lat, lon } = req.params;
    const key = "" + lat + lon;
    const location = { lat: lat, lon: lon }

    let unixTime = await getUnixTime(1);
    let yesterdays = await rqHistory(location, unixTime);

    if (kor.add() >= 9) {
        unixTime = await getUnixTime(2);
        const secondYesterdays = await rqHistory(location, unixTime);
        yesterdays = secondYesterdays.concat(yesterdays)
    }
    
    console.log("yesterdays caching...");
    await setCache(key, yesterdays);
    req.yesterdays = yesterdays;
    next();  
}

exports.getBefores = async (req, res, next) => {
    const { lat, lon } = req.params;
    const key = "" + lat + lon;
    const location = { lat: lat, lon: lon }
    const unixTime = await getUnixTime(0);
    const befores = await rqHistory(location, unixTime);

    console.log("befores caching...");
    await setCache(key, befores);
    req.befores = befores;
    next();
}

exports.getForecasts = async (req, res, next) => {
    const { lat, lon } = req.params;
    const key = "" + lat + lon;
    const location = { lat: lat, lon: lon }
    const forecasts = await rqForecasts(location);
    
    const kor = dayjs.tz();
    const start = 3 - ( kor.hour() % 3 );

    console.log("forecasts caching...");
    await setCache(key, forecasts, start);
    req.forecasts = forecasts;
    next();
}

<<<<<<< HEAD
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
        }, (error, response, body) => {
            if (error) throw error;

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
    }, (error, response, body) => {
        if (error) throw error;

        const kor = dayjs.tz();
        const forecastWeather = JSON.parse(body.body);
        const start = 3 - ( kor.hour() % 3 );
        forecasts = parse(forecastWeather.hourly, start);
    });
    return forecasts
}

function getUnixTime(offset) {
=======
async function getUnixTime(offset) {
>>>>>>> redis
    let kor = dayjs.tz();
    kor = kor.subtract(2, 'second');
    return Math.floor(kor.subtract(offset, 'day') / 1000);
}