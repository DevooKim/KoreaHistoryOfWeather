const rp = require('request-promise-native')
const dotenv = require('dotenv')

dotenv.config();
const apiKey = process.env.OPENWEATHER_API_KEY;

exports.getYesterdays = async (time, location, callback) => {

    const bUnixTime = callback(time, 0);
    const befores = await rqHistory(location, bUnixTime);

    let yUnixTime = callback(time, 1);
    let yesterdays = await rqHistory(location, yUnixTime);

    if (time.hour() >= 9) {
        yUnixTime = callback(time, 2);
        const secondYesterdays = await rqHistory(location, yUnixTime);
        yesterdays = yesterdays.concat(secondYesterdays)
    }
    
    return [ yesterdays, befores ]
}

exports.getForecasts = async (location) => {
    return await rqForecasts(location);
}

async function rqHistory (location, time) {
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

            const data = JSON.parse(body.body);
            if (data.hourly === undefined) {
                historys = [data.current];
            } else {
                historys = data.hourly;
            }
    });

    return historys;
}

async function rqForecasts (location) {
    let fores = undefined;
    await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall",
        qs: {
            lat: location.lat,
            lon: location.lon,
            exclude: "current,minutely,daily,alerts",
            appid: apiKey
        }
    }, (response, body) => {
        const data = JSON.parse(body.body);
        fores = data.hourly;
    });
    return fores;
}