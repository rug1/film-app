var app = module.exports = {},
    data = require('./film-data.js'),
    request = require('request'),
    // redis = require("redis"),
    // client = redis.createClient();

app.getFilms = function (callback) {
  var randomFilm = Math.floor(Math.random() * (data.length + 1));
  request('http://www.omdbapi.com/?i=' + data[randomFilm], function (error, response, body) {
    if (!error && response.statusCode == 200) {
      callback(body);
    } else {
      callback('error');
    }
  });
};

app.addToWatchlist = function (filmImg, filmTitle, callback) {
  client.hmset('watchlist', filmTitle, filmImg, function(err, reply){
    if (reply === 'OK' && err === null) {
      callback('OK');
    } else {
      callback('error');
    }
  });
};
