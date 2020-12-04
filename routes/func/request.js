const rp = require('request-promise-native')
const dotenv = require('dotenv')

dotenv.config();
const apiKey = process.env.OPENWEATHER_API_KEY;

exports.getHistory = async (time, location, callback) => {

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

    const response =  await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall/timemachine",
        qs: {
            lat: location.lat,
            lon: location.lon,
            dt: time,
            appid: apiKey
        }
    });

    const data = JSON.parse(response);

    if (data.hourly === undefined) {
        return [data.current];
    } else {
        return data.hourly;
    }

}

async function rqForecasts (location) {
    const data =  await rp({
        uri: "https://api.openweathermap.org/data/2.5/onecall",
        qs: {
            lat: location.lat,
            lon: location.lon,
            exclude: "current,minutely,alerts",
            appid: apiKey
        }
    });

    const result = JSON.parse(data);
    
    return [ result.hourly, result.daily ];
}