var handlers = require('./handlers.js');

var routes = {
  '/': handlers.home,
  '/files': handlers.files,
  '/loadFilms': handlers.loadFilms,
  '404': handlers.notFound
};

module.exports = function(req, res) {
  console.log(req.url);
  if (routes[req.url]) {
    routes[req.url](req, res);
  } else if (req.url.match('.')) {
    routes['/files'](req,res);
  } else {
    routes['404'](req, res);
  }
};
