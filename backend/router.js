var handlers = require('./handlers.js');

var routes = {
  '/': handlers.home,
  '/files': handlers.files,
  '/loadFilms': handlers.loadFilms,
  '/addToWatchlist': handlers.addToWatchlist,
  '/getWatchList': handlers.getWatchList,
  '/filter': handlers.filter,
  '404': handlers.notFound,
  '/N/A': handlers.NA,
  '/undefined': handlers.undefined
};

module.exports = function(req, res) {
  console.log(req.url);
  if (routes[req.url]) {
    routes[req.url](req, res);
  } else if (req.url.match('/addToWatchlist')) {
    routes['/addToWatchlist'](req,res);
  } else if (req.url.match('FilterOption')) {
    routes['/filter'](req,res);
  } else if (req.url.match('.')) {
    routes['/files'](req,res);
  } else {
    routes['404'](req, res);
  }
};
