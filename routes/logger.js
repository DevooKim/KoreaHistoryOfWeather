const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc')
const timezone = require('dayjs/plugin/timezone')
const winston = require('../config/winston')

dayjs.extend(UTC);
dayjs.extend(timezone);
dayjs.tz.setDefault("Asia/Seoul")

exports.logger = (weathers) => {
    const kor = dayjs.tz();
    winston.info("now" + kor.format())

    winston.info("yesterdays");
    const yesterdays = print(weathers.yesterdays);
    winston.info("todays");
    const todays = print(weathers.todays);
    winston.info("tomorrows");
    const tomorrows = print(weathers.tomorrows);
    winston.info("daily");
    const daily = print(weathers.daily);

    return {yesterdays: yesterdays, todays: todays, tomorrows: tomorrows, daily: daily}
}

function print(arr) {
    for (let i = 0; i < arr.length; i++) {
        winston.info(arr.dt);
        arr[i] = arr.dt.format().hour();
    }

    return arr;
}