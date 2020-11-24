const rp = require('request-promise-native')
const dotenv = require('dotenv')
const { response } = require('express')
const express = require('express')
const winston = require('../config/winston')
const { getYesterdays, befores, forecasts } = require('./middlewares')

dotenv.config();
const apiKey = process.env.OPENWEATHER_API_KEY
const router = express.Router();

//lat/lon: 36.354687/127.420997

//let interval = setInterval(async () => {
router.get('/:lat/:lon', getYesterdays, befores, forecasts, async (req, res) => {
    
    //setInterval(async () => {
        winston.info("yester");
        for (let w of req.yesterdays) {
            // winston.info(new Date((w.dt + 32400) * 1000));
            winston.info(new Date(w.dt * 1000));
        }
        winston.info("before");
        for (let w of req.befores) {
            // winston.info(new Date((w.dt + 32400) * 1000));
            winston.info(new Date(w.dt * 1000));
        }
        winston.info("forecast");
        for (let w of req.forecasts) {
            // winston.info(new Date((w.dt + 32400) * 1000));
            winston.info(new Date(w.dt * 1000));
        }
        winston.info("---------------------------")
    //}, 10000);
    
});

module.exports = router;
