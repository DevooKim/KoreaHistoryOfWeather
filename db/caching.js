const express = require('express')
const redis = require('redis')
const dotenv = require('dotenv')
const dayjs = require('dayjs')
const CachedCall = require('cached-call')

const cache = new CachedCall()
const everyHour = min => () => dayjs().add(60 - min, 'm').startOf('m').minute(min) - Date.now();
dotenv.config();

const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_ADD
)

client.on('error', (err) => {
    console.log("Error: " + err);
})

exports.isCaching = (getWeather, location) => {
    const test = cache({getWeather, maxAge: everyHour(60)});
    test;
    return test;
}