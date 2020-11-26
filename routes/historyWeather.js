const rp = require('request-promise-native')
const express = require('express')
const { getYesterdays, befores, forecasts } = require('./middlewares')
const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul")

const router = express.Router();

//lat, lon: 36.354687/127.420997
router.get('/:lat/:lon', getYesterdays, befores, forecasts, async (req, res) => {

    const weathers = {
        "yesterdays": [],
        "todays": [],
        "tomorrows": [],
    }
    const data = [...req.yesterdays, ...req.befores, ...req.forecasts]

    // weathers.yesterdays = data.slice(5, 13);
    // weathers.todays = data.slice(13, 21);
    // weathers.tomorrows = data.slice(21, 30);

    weathers.yesterdays = print(data.slice(5, 13));
    weathers.todays = print(data.slice(13, 21));
    weathers.tomorrows = print(data.slice(21, 30));
    
    res.send(weathers);

});

function print(arr) {
    for(let i = 0; i < arr.length; i++) {
        arr[i] = dayjs.unix(arr[i].dt).tz().hour()
    }
    return arr;
}

module.exports = router;