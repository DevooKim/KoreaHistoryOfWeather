const dayjs = require('dayjs')
const UTC = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');

dayjs.extend(UTC)
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Seoul")
const kor = dayjs().tz();

exports.isUtcUpdate = (req, res, next) =>  {

    if (0 <= kor.hour() && kor.hour() < 9){
        console.log(1);
        req.isUtcUpdate = false;
        next();
        
    } else {
        console.log(2);
        req.isUtcUpdate = true;
        next();
    }

};