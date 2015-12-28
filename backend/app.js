var app = module.exports = {},
    data = require('./film-data.js'),
    request = require('request');
    // redis = require("redis"),
    // client = redis.createClient();

app.getFilms = function (callback) {
  var randomFilm = Math.floor(Math.random() * (data.length + 1));
  request('http://www.omdbapi.com/?i=' + data[randomFilm], function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    }
  });
};
