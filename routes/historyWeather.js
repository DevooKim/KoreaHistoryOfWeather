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
    // console.log(data);

    weathers.yesterdays = data.slice(5, 13);
    weathers.todays = data.slice(13, 21);
    weathers.tomorrows = data.slice(21, 30);

    print(weathers.yesterdays)
    console.log("_________________________-");
    print(weathers.todays)
    console.log("_________________________-");
    print(weathers.tomorrows)
    
    res.send(weathers);

});

function print(arr) {
    for (let i = 0; i < arr.length; i++) {
        console.log(dayjs.unix(arr[i].dt).tz().format());
    }
}


module.exports = router;