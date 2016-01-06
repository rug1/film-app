var client = require('redis').createClient(process.env.REDIS_URL);

module.exports = client;
