const express = require('express')
const { isCache } = require('./func/cache')
const { getYesterdays, getBefores, getForecasts } = require('./middlewares')
const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const winston = require('../config/winston')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul")

const router = express.Router();

const weathers = {
    "yesterdays": [],
    "todays": [],
    "tomorrows": [],
}
    
//lat, lon: 36.354687/127.420997
router.get('/:lat/:lon', isCache, getYesterdays, getBefores, getForecasts, async (req, res) => {

    let data = [...req.yesterdays, ...req.befores, ...req.forecasts]
    // weathers.yesterdays = data.slice(5, 13);
    // weathers.todays = data.slice(13, 21);
    // weathers.tomorrows = data.slice(21, 30);

    winston.info('not cached')
    const weathers = await parseData(data);

    res.send(weathers);

});

async function parseData(data) {
    const weathers = {
        "yesterdays": [],
        "todays": [],
        "tomorrows": [],
    }

    winston.info("yesterdays")
    weathers.yesterdays = data.slice(5, 13).map((v) => {
        winston.info(dayjs.unix(v.dt).tz());
        return dayjs.unix(v.dt).tz().hour();
    });
    winston.info("todays")
    weathers.todays = data.slice(13, 21).map((v) => {
        winston.info(dayjs.unix(v.dt).tz());
        return dayjs.unix(v.dt).tz().hour();
    });
    winston.info("tomorrows")
    weathers.tomorrows = data.slice(21, 30).map((v) => {
        winston.info(dayjs.unix(v.dt).tz());
        return dayjs.unix(v.dt).tz().hour();
    });

    return weathers
}


module.exports = router;
