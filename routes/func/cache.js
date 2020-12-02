const redis = require('redis')
const dotenv = require('dotenv');

const EX = 10;

dotenv.config();

const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_ADDRESS
);

client.on('error', (err) => {
    console.log("redis Error: " + err);
});

exports.isCache = (req, res, next) => {
    const key = getKey(req.params.lat, req.params.lon);
    req.key = key;

    client.lrange(key, 0, -1, (err, arr) => {
        if (err) throw err;
        if(arr.length !== 0) {
            const weather = parseData(arr);
            console.log("call cache OK");
            res.send(weather);

        } else {
            next();
        }
    })
}

exports.setCache = (key, body, start = 0) => {
    const result = []
    try {
        for (let i = start; i < body.length; i += 3) {
            const data = {
                dt: body[i].dt,
                temp: body[i].temp,
                feels_like: body[i].feels_like,
                clouds: body[i].clouds,
                rain: body[i].rain,
                snow: body[i].snow,
                weather: body[i].weather
            }

            result.push(data);
            client.rpush(key, JSON.stringify(data));
        }
        
        console.log("set Cache OK");
        client.expire(key, EX);
        
    } catch (error) {
        console.error("setCache Error: " + error);
    }

    return result;
}

function parseData(data) {
    console.log("start");
    const weathers = {
        "yesterdays": [],
        "todays": [],
        "tomorrows": [],
    }

    weathers.yesterdays = data.slice(5, 13).map((v) => {
        return JSON.parse(v);
    });
    weathers.todays = data.slice(13, 21).map((v) => {
        return JSON.parse(v);
    });
    weathers.tomorrows = data.slice(21, 30).map((v) => {
        return JSON.parse(v);
    });

    return weathers
}

function getKey(lat, lon) {
    return Number(lat).toFixed(2) + Number(lon).toFixed(2);
}