const redis = require('redis')
const dotenv = require('dotenv');
const winston = require('../../config/winston')

const EX = 30;

dotenv.config();

const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_ADDRESS
);

client.on('error', (err) => {
    winston.info("redis Error: " + err);
});

exports.isCache = (req, res, next) => {
    // const key = getKey(req.params.lat, req.params.lon);
    // res.send(req.body);
    const key = getKey(req.body.lat, req.body.lon);
    req.key = key;
    winston.info(`check cache ${key}`)
    client.lrange(key, 0, -1, (err, arr) => {
        if (err) throw err;
        if(arr.length !== 0) {
            const weather = parseData(arr);
            winston.info("call cache OK");
            res.send(weather);

        } else {
            winston.info('not cached')
            next();
        }
    })
}

exports.setCache = (dayjs, key, body, offset = 0, iter = 3) => {
    const result = []
    try {
        for (let i = offset; i < body.length; i += iter) {
            const data = {
                dt: dayjs.unix(body[i].dt).tz().format(),
                temp: body[i].temp,
                feels_like: body[i].feels_like,
                humidity: body[i].humidity,
                clouds: body[i].clouds,
                visibility: body[i].visibility,
                rain: body[i].rain,
                snow: body[i].snow,
                weather: body[i].weather
            }

            result.push(data);
            client.rpush(key, JSON.stringify(data));
        }
        
        winston.info("set Cache OK");
        client.expire(key, EX);
        
    } catch (error) {
        winston.error("setCache Error: " + error);
    }

    return result;
}

function parseData(data) {
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