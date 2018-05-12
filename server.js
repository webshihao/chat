var WebSocket = require('ws');
var fs = require('fs');
var WebSocketServer = WebSocket.Server,
    wss = new WebSocketServer({port: 8180});
var uuid = require('node-uuid');

var clients = [];

function wsSend(type, client_uuid, nickname, message,clientcount) {
  console.log('message1',message)
  for(var i=0; i<clients.length; i++) {
    var clientSocket = clients[i].ws;
    if(clientSocket.readyState === WebSocket.OPEN) {
      clientSocket.send(JSON.stringify({
        "type": type,
        "id": client_uuid,
        "nickname": nickname,
        "message": message,
	"clientcount":clientcount,
      }));
    }
  }
}

wss.on('connection', function(ws) {
  var client_uuid = uuid.v4();
  clients.push({"id": client_uuid, "ws": ws});
  console.log('client [%s] connected', client_uuid);
  ws.on('message', function(message) {
    var str = Math.random().toString().slice(3);
    fs.writeFile(str + '.txt', message, (err) => {
      if (err) throw err;
      console.log('It\'s saved!');
    });
      wsSend("message", client_uuid, message,clients.length);
  });



  process.on('SIGINT', function() {
      console.log("Closing things");
      process.exit();
  });
});