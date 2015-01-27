var fs = require('fs');

function route(routes, pathname, response, postData, connections, pendingMessages) {
  var match = routes.match(pathname);
  if (match) {
    match.fn(response, postData, connections, pendingMessages);
  }
  else {
    fs.readFile('public/' + pathname, function (err, data) {
      if (err) {
        response.writeHead(404);
      }
      else{
        response.writeHead(200);
        response.write(data);
      }
    response.end();
    }); 
  }
}

exports.route = route;
