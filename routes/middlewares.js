const rp = require('request-promise-native')
const dotenv = require('dotenv')
const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul");
const kor = dayjs().tz();

dotenv.config();
const apiKey = process.env.OPENWEATHER_API_KEY;

exports.getYesterdays = async (req, res, next) => {

    const location = { lat: req.params.lat, lon: req.params.lon };
    const unixTime = getUnixTime(1);
    const yesterdays = 
        await rqHistory(location, unixTime).then((value) => {
            return value;
        });

    console.log(yesterdays);
    if (0 <= kor.hour() && kor.hour() < 9) {
        req.yesterdays = yesterdays
        next();

    } else {
        const unixTime = getUnixTime(2);
        const y2 = await rqHistory(location, unixTime).then((value) => {
            return value;
        })
        
        console.log(y2);
        req.yesterdays = yesterdays
        next();
    }

};

function rqHistory(location, time) {
    return new Promise((resolve, reject) => {
        rp({
            uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
                qs: {
                    lat: location.lat,
                    lon: location.lon,
                    dt: time,
                    appid: apiKey
                }
            }, (error, response, body) => {
                if (error) {
                    return reject(error);
                }
                // const historyWeather = JSON.parse(body);
                // const historys = parse(historyWeather.hourly);

                try {
                    const historyWeather = JSON.parse(body);
                    resolve(parse(historyWeather.hourly));
                } catch (err) {
                    reject(err);
                }
            });
    });
}


function getUnixTime(offset) {
    return Math.floor(kor.subtract(offset, 'day') / 1000);
}

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
        console.error("parse Error: " + error);
    }
    return data;
}