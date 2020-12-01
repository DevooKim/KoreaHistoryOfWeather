const express = require('express')
const { getYesterdays, getBefores, getFores } = require('./middlewares')
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
}
    
//lat, lon: 36.354687/127.420997
router.get('/:lat/:lon', getYesterdays, async (req, res) => {

    // let data = [...req.yesterdays, ...req.befores, ...req.forecasts]

    // weathers.yesterdays = data.slice(5, 13);
    // weathers.todays = data.slice(13, 21);
    // weathers.tomorrows = data.slice(21, 30);
    
    res.send(req.befores);


});


module.exports = router;
