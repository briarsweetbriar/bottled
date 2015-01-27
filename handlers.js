var fs = require("fs");
var echo = require("./echo");

exports.arrive = function(response, postData) {
  fs.readFile('public/index.html',function (err, data){
    if (err) {
      throw err;
    }
    response.writeHead(200, {'Content-Type': 'text/html','Content-Length':data.length});
    response.write(data);
    response.end();
  });
}

exports.toss = function(response, postData, connections, pendingMessages){
  response.writeHead(200);
  response.end();
  echo.sendMessage(postData, connections, pendingMessages, true);
}
