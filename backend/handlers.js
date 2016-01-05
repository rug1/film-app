var handlers = module.exports = {};
var fs = require('fs');
var qs = require('querystring');
var app = require('./app.js');

var headers = {"content-type":"text/html"};

handlers.home = function(req,res){
  var index = fs.readFileSync('index.html');
  res.writeHead(200, headers);
  res.end(index);
};

handlers.files = function(req,res) {
  var file = fs.readFileSync(__dirname + '/../' + req.url);
  var ext = (req.url).split('.')[1];
  res.writeHead(200, {"content-type": "text/" + ext });
  res.end(file);
};

handlers.loadFilms = function(req,res){
  app.getFilms(function(body){
    res.writeHead(200, {"content-type":"text/jpeg"});
    res.end(body);
  });
};

handlers.NA = function(req,res){
  var noImage = fs.readFileSync(__dirname + '/../' + '/img/noImage.png');
  res.writeHead(200, headers);
  res.end(noImage);
};

handlers.undefined = function(req,res){
  res.writeHead(200, headers);
  res.end();
};

handlers.addToWatchlist = function(req,res){
  // var filmImg = req.url.split('filmImg=')[1].split('filmTitle=')[0];
  // var filmTitle = req.url.split('filmTitle=')[1].replace(/%20/g,' ');
  // app.addToWatchlist(filmImg, filmTitle, function(reply){
  //   res.writeHead(200, headers);
  //   res.end(reply);
  // });
  res.end('PENDING');
};

handlers.getWatchList = function(req,res) {

};

handlers.notFound = function(req,res){
  res.writeHead(404, headers);
  res.end("Can't help you there, chum!");
};
