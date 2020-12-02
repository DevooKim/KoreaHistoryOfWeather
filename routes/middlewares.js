const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const { getYesterdays, getForecasts } = require('./func/request')
const { setCache } = require('./func/cache')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul")

exports.getWeathers = async (req, res, next) => {
    const time = dayjs.tz();
    const offset = 3 - ( time.hour() % 3 );
    const { lat, lon } = req.params;
    const location = { lat: lat, lon: lon };
    const key = req.key;

    const [ yesterdays, befores ] = await getYesterdays(time, location, getUnixTime);
    const forecasts = await getForecasts(location);

    console.log("yesterdays caching...");
    const yData = setCache(key, yesterdays);

    console.log("befores caching...");
    const bData = setCache(key, befores);
    
    console.log("forecasts caching...");
    const fData = setCache(key, forecasts, offset);

    req.yesterdays = yData;
    req.befores = bData;
    req.forecasts = fData;

    next();
}


function getUnixTime(time, offset) {
    // time = time.subtract(2, 'second');
    return Math.floor(time.subtract(offset, 'day') / 1000);
}