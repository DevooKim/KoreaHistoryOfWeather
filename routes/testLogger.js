const rp = require('request-promise-native')
const express = require('express')
const { getYesterdays, befores, forecasts } = require('./middlewares')
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
router.get('/:lat/:lon', getYesterdays, befores, forecasts, async (req, res) => {

    const kor = dayjs.tz();
    winston.info("now" + kor.format())

    const data = [...req.yesterdays, ...req.befores, ...req.forecasts]

    winston.info("yesterdays");
    weathers.yesterdays = print(data.slice(5, 13));
    winston.info("todays");
    weathers.todays = print(data.slice(13, 21));
    winston.info("tomorrows");
    weathers.tomorrows = print(data.slice(21, 30));

    res.send(weathers);

});

function print(arr) {
    for (let i = 0; i < arr.length; i++) {
        winston.info(dayjs.unix(arr[i].dt).tz().format());
        arr[i] = dayjs.unix(arr[i].dt).tz().hour()
    }

    return arr;
}


module.exports = router;