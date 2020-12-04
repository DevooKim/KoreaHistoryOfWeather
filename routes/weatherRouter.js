const express = require('express')
const { isCache } = require('./func/cache')
const { getWeathers } = require('./middlewares')
const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul")

const router = express.Router();

const weathers = {
    "yesterdays": [],
    "todays": [],
    "tomorrows": [],
    "daily": [],
}
    
//lat, lon: 36.354687/127.420997
router.get('/:lat/:lon', isCache, getWeathers, async (req, res) => {

    let data = [...req.yesterdays, ...req.befores, ...req.forecasts]
    weathers.yesterdays = data.slice(5, 13);
    weathers.todays = data.slice(13, 21);
    weathers.tomorrows = data.slice(21, 30);
    weathers.daily = req.daily;

    res.send(weathers);

});

module.exports = router;