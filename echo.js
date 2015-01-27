var underscore = require("underscore");

exports.sendMessage = function(message, connections, pendingMessages, newMessage){
  var json = JSON.parse(message);
  var reducedCollection = underscore.reject(connections, function(connection){
    return connection.id === json.id || connection.deactivated;
  });
  if (reducedCollection.length > 0) {
    var connection = underscore.sample(reducedCollection);
    connection.write(JSON.stringify({ message: JSON.parse(message).message }));
    if (!newMessage) {
      var index = pendingMessages.indexOf(message);
      if (index > -1) pendingMessages.splice(index, 1);
    }
  }
  else if (newMessage) {
    pendingMessages.push(message);
  }
}
