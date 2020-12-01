const express = require('express')
const redis = require('redis')
const dotenv = require('dotenv')

dotenv.config();

const client = redis.createClient(
    process.env.REDIS_PORT,
    process.env.REDIS_ADDRESS
)

client.on('error', (err) => {
    console.log("Error: " + err);
})

exports.isCaching = async (key) => {
    console.log("isCaching")

    await client.exists(key, async (err, reply) => {
        if (reply === 1) {
            console.log('존재: ' + key);
            return true;
        } else {
            console.log("없음: " + key);
            return false
        }
    })
    // return true;

}

exports.getCache = async (key) => {
    console.log("getCache")
    let rtn = undefined
    await client.get(key, (err, data) => {
        if(err) throw err
        if(data) {
            console.log("data: " + data);
            // return JSON.parse(data);
            // rtn = JSON.parse(data);
            rtn = data;
            console.log(rtn);
        }
    })
    return rtn;
}

exports.setCache = (key, data) => {
    console.log("setCache")
    try {
        // client.set(key, JSON.stringify(data), 'EX', 3600);
        client.set(key, JSON.stringify(data));
    } catch(err) {
        throw err;
    }

    return "test"
}