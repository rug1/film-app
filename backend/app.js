var app = module.exports = {},
    data = require('./film-data.js'),
    request = require('request'),
    client = require("./redis.js");

app.getFilms = function (callback) {
  var randomFilm = Math.floor(Math.random() * (data.length + 1));
  request('http://www.omdbapi.com/?i=' + data[randomFilm], function (error, response, body) {
    if (!error && response.statusCode === 200) {
      callback(body);
    } else {
      callback('error');
    }
  });
};


//FOR THE IMAGES
//EXAMPLE REQUEST:  http://img.omdbapi.com/?i=tt2294629&apikey=261f101c
//API KEY: 261f101c

app.addToWatchlist = function (filmImg, filmTitle, callback) {
  client.hmset('watchlist', filmTitle, filmImg, function(err, reply){
    if (reply === 'OK' && err === null) {
      callback('OK');
    } else {
      callback('error');
    }
  });
};

app.getWatchList = function (callback) {
  client.hgetall('watchlist', function(err, reply){
    if (err === null) {
      callback(reply);
    } else {
      callback('error');
    }
  });
};

app.filter = function (filterOption, callback) {
  var randomFilm = Math.floor(Math.random() * (data.length + 1));
  request('http://www.omdbapi.com/?i=' + data[randomFilm], function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var genre = JSON.parse(body).Genre;
      if (genre.match(filterOption)) {
        callback(body);
      } else {
        app.filter(filterOption, callback);
      }
    } else {
      callback('error');
    }
  });
};
