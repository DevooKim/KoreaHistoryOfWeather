const dayjs = require('dayjs')
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

exports.setTimeArea = (req, res, next) =>  {
    dayjs.extend(utc);
    dayjs.extend(timezone);

    dayjs.tz.setDefault("Asia/Seoul");
    console.log(dayjs);
    next();
}