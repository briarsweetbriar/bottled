var underscore = require("underscore");

exports.sendMessage = function(message, connections, pendingMessages, newMessage){
  var json = JSON.parse(message);
  var reducedCollection = underscore.reject(connections, function(connection){
    return connection.id === json.id || connection.deactivated;
  });

  function initiateDelivery() {
    if (reducedCollection.length > 0) {
      deliver();
    }
    else if (newMessage) {
      pendingMessages.push(message);
    }
  }

  function deliver() {
    var connection = underscore.sample(reducedCollection);
    var success = connection.write(JSON.stringify({ message: JSON.parse(message).message }));
    if (success) {
      if (!newMessage) {
        var index = pendingMessages.indexOf(message);
        if (index > -1) pendingMessages.splice(index, 1);
      }
    }
    else {
      removeConnection(connection);
      connection.close();
      initiateDelivery();
    }
  }

  function removeConnection(removeMe) {
    reducedCollection = underscore.reject(reducedCollection, function(connection) {
      return connection === removeMe;
    });
  }

  initiateDelivery();
}
