const rp = require('request-promise-native')
const dotenv = require('dotenv')

dotenv.config();
const apiKey = process.env.OPENWEATHER_API_KEY;

exports.rqHistory = async (location, time) => {
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

exports.rqForecasts = async (location) => {
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