const express = require('express')
const redis = require('redis')
const dotenv = require('dotenv')

dotenv.config();

const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_ADD
)

client.on('error', (err) => {
    console.log("Error: " + err);
})

exports.isCaching = (location) => {
    
}