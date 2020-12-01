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
    const key = req.key;
    const location = { lat: lat, lon: lon }

    let unixTime = await getUnixTime(1);
    let yesterdays = await rqHistory(location, unixTime);
    console.log(yesterdays.length);

    if (kor.hour() >= 9) {
        unixTime = await getUnixTime(2);
        const secondYesterdays = await rqHistory(location, unixTime);
        yesterdays = yesterdays.concat(secondYesterdays)
    }
    console.log(yesterdays.length);
    
    console.log("yesterdays caching...");
    yesterdays = await setCache(key, yesterdays);
    req.yesterdays = yesterdays;
    next();  
}

exports.getBefores = async (req, res, next) => {
    const { lat, lon } = req.params;
    const key = req.key;

    const location = { lat: lat, lon: lon }
    const unixTime = await getUnixTime(0);
    let befores = await rqHistory(location, unixTime);

    console.log("befores caching...");
    befores = await setCache(key, befores);
    req.befores = befores;
    next();
}

exports.getForecasts = async (req, res, next) => {
    const { lat, lon } = req.params;
    const key = req.key;

    const location = { lat: lat, lon: lon }
    let forecasts = await rqForecasts(location);
    
    const kor = dayjs.tz();
    const start = 3 - ( kor.hour() % 3 );

    console.log("forecasts caching...");
    forecasts = await setCache(key, forecasts, start);
    req.forecasts = forecasts;
    next();
}

async function getUnixTime(offset) {
    let kor = dayjs.tz();
    kor = kor.subtract(2, 'second');
    return Math.floor(kor.subtract(offset, 'day') / 1000);
}