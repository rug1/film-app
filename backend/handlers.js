var handlers = module.exports = {};
var fs = require('fs');
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
    res.writeHead(200, headers);
    res.end(body);
  });
};

handlers.notFound = function(req,res){
  res.writeHead(404, headers);
  res.end("Can't help you there, chum!");
};
