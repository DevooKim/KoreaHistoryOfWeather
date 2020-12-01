const redis = require('redis')
const dotenv = require('dotenv');
const winston = require('../../config/winston')
const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul")

const ext = 60;

dotenv.config();

const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_ADDRESS
);

client.on('error', (err) => {
    console.log("redis Error: " + err);
});

exports.isCache = async (req, res, next) => {
    const key = "" + req.params.lat + req.params.lon;

    await client.lrange(key, 0, -1, async (err, arr) => {
        if (err) throw err;
        if(arr.length !== 0) {
            // console.log(arr[0])
            // const data = JSON.parse(arr);
            winston.info("call cache ok");
            const weathers = await parseData(arr);
            res.send(weathers);

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
        client.expire(key, ext);
        
    } catch (error) {
        console.error("setCache Error: " + error);
    }

    return result;
}

async function parseData(data) {
    const weathers = {
        "yesterdays": [],
        "todays": [],
        "tomorrows": [],
    }

    winston.info("yesterdays")
    weathers.yesterdays = data.slice(5, 13).map((v) => {
        winston.info(dayjs.unix(JSON.parse(v).dt).tz());
        return dayjs.unix(JSON.parse(v).dt).tz().hour();
    });
    winston.info("todays")
    weathers.todays = data.slice(13, 21).map((v) => {
        winston.info(dayjs.unix(JSON.parse(v).dt).tz());
        return dayjs.unix(JSON.parse(v).dt).tz().hour();
    });
    winston.info("tomorrows")
    weathers.tomorrows = data.slice(21, 30).map((v) => {
        winston.info(dayjs.unix(JSON.parse(v).dt).tz());
        return dayjs.unix(JSON.parse(v).dt).tz().hour();
    });

    // weathers.yesterdays = data.map((v) => {
    //     winston.info(dayjs.unix(JSON.parse(v).dt).tz());
    //     return dayjs.unix(JSON.parse(v).dt).tz().hour(); 
    // })

    return weathers
}