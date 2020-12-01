const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const { rqHistory, rqForecasts } = require('./func/request')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul")

exports.getYesterdays = async (req, res, next) => {
    const kor = dayjs.tz();
    const { lat, lon } = req.params;
    const location = { lat: lat, lon: lon }

    let unixTime = await getUnixTime(1);
    let yesterdays = await rqHistory(location, unixTime);

    if (kor.add() >= 9) {
        unixTime = await getUnixTime(2);
        const secondYesterdays = await rqHistory(location, unixTime);
        yesterdays = secondYesterdays.concat(yesterdays)
    }
    
    req.yesterdays = yesterdays;
    next();  
}

exports.getBefores = async (req, res, next) => {
    const { lat, lon } = req.params;
    const location = { lat: lat, lon: lon }
    const unixTime = await getUnixTime(0);
    const befores = await rqHistory(location, unixTime);

    console.log(befores);
    req.befores = befores;
    next();
}

exports.getFores = async (req, res, next) => {
    const { lat, lon } = req.params;
    const location = { lat: lat, lon: lon }
    const forecasts = await rqForecasts(location);

    req.forecasts = forecasts;
    next();
}

async function getUnixTime(offset) {
    let kor = dayjs.tz();
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