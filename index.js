var server = require("./server");
var router = require("./router");
var handlers = require("./handlers");

var Routes = require("routes");
var routes = new Routes();
routes.addRoute("/", handlers.arrive);
routes.addRoute("/toss", handlers.toss);

server.start(router.route, routes);
