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

async function getUnixTime(offset) {
    let kor = dayjs.tz();
    kor = kor.subtract(2, 'second');
    return Math.floor(kor.subtract(offset, 'day') / 1000);
}