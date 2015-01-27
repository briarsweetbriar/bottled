var http = require("http");
var url = require("url");
var sockjs = require("sockjs");
var underscore = require("underscore");
var echo = require("./echo");

function start(route, routes) {
  function onRequest(request, response) {
    var postData = "";
    var pathname = url.parse(request.url).pathname;
    request.setEncoding("utf8");
    request.addListener("data", function(postDataChunk) {
      postData += postDataChunk;
    });
    request.addListener("end", function() {
      route(routes, pathname, response, postData, connections, pendingMessages);
    });
  }
  var connections = [];
  var pendingMessages = [];
  var server = http.createServer(onRequest);
  var sockServer = sockjs.createServer({ sockjs_url: 'http://cdn.jsdelivr.net/sockjs/0.3.4/sockjs.min.js' });
  sockServer.on('connection', function(conn) {
    conn.deactivated = true;
    conn.write(JSON.stringify({ id: conn.id }));
    connections.push(conn);
    conn.on('data', function(message){
      var command = JSON.parse(message).command;
      if (command === "deactivate") {
        conn.deactivated = true;
      }
      else if (command === "activate") {
        conn.deactivated = false;
      }
    });
    conn.on('close', function() {
      connections = underscore.reject(connections, function(connection){
        return conn === connection;
      });
    });
  });
  sockServer.installHandlers(server, {prefix:'/echo'});
  server.listen(4001);
  console.log("listening to 0.0.0.0:4001");
  setInterval(function(){
    pendingMessages.forEach(function(message){
      echo.sendMessage(message, connections, pendingMessages, false);
    });
  }, 10000);
}
exports.start = start;
