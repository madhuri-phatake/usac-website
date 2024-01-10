const redis = require('redis');
const config = require("../config/keys");
module.exports = client = redis.createClient({
    host: config.redisHost,
    port: 6379
});