const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const { getHistory, getForecasts } = require('./func/request')
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

    const [ yesterdays, befores ] = await getHistory(time, location, getUnixTime);
    const [ forecasts, daily ] = await getForecasts(location);

    console.log("yesterdays caching...");
    const yData = setCache(dayjs, key, yesterdays);

    console.log("befores caching...");
    const bData = setCache(dayjs, key, befores);
    
    console.log("forecasts caching...");
    const fData = setCache(dayjs, key, forecasts, offset);

    console.log("daily caching");
    const dData = setCache(dayjs, key, daily, 0, 1);
    console.log(dData);

    req.yesterdays = yData;
    req.befores = bData;
    req.forecasts = fData;
    req.daily = dData;

    next();
}


function getUnixTime(time, offset) {
    // time = time.subtract(2, 'second');
    return Math.floor(time.subtract(offset, 'day') / 1000);
}