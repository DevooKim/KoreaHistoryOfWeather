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

exports.isCaching = (key) => {
    client.exists(key, (err, reply) => {
        if (reply === 1) {
            console.log('존재');
        } else {
            console.log("없음");
        }
        return reply;
    })
}

exports.getCache = (key) => {
    client.get(key, (err, data) => {
        if(err) throw err
        if(data) {
            return data;
        }
    })
}

exports.setCache = (key, data) => {
    try {
        client.set(key, JSON.stringify(data), 'EX', 10);
    } catch(err) {
        throw err;
    }
}