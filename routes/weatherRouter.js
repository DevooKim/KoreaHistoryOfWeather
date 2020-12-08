const express = require("express");
const { isCache } = require("./func/cache");
const { getWeathers } = require("./middlewares");
const winston = require("../config/winston");

const router = express.Router();

const weathers = {
  yesterdays: [],
  todays: [],
  tomorrows: [],
  daily: [],
};

//lat, lon: 36.354687/127.420997
router.get("/:lat/:lon", isCache, getWeathers, async (req, res) => {
  // router.post('/', isCache, getWeathers, async (req, res) => {

  let data = [...req.yesterdays, ...req.befores, ...req.forecasts];
  weathers.yesterdays = data.slice(5, 13);
  weathers.todays = data.slice(13, 21);
  weathers.tomorrows = data.slice(21, 30);
  weathers.daily = req.daily;

  res.send(weathers);
});

module.exports = router;
