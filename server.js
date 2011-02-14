var sys = require("sys"),
    fs = require("fs"),
    path = require("path"),
    http = require("http"),
    io = require('socket.io');

var node_env = (process.argv[2] == 'staging' ? 'staging' : 'production');
var node_port = (node_env == 'staging' ? '1976' : '1975');

var pidfile = fs.openSync("/var/tmp/node-" + node_env + ".pid", "w");
fs.writeSync(pidfile, process.pid + "");
fs.closeSync(pidfile);

var nlog = require(__dirname + '/lib/logging');
//var demo = require(__dirname + '/lib/demo');
var nearest = require(__dirname + '/lib/nearest');

function log(message) {
  nlog.updateAccessLog(message);
}

function removePlayer(id) {
  var len = players.labels.length;
  for (var x = 0; x < len; x++) {
    if (players.labels[x] === id && x > 0 && x < len) {
      players.labels.splice(x, 1);
      players[id] = null;
      delete players[id];
      break;
    }
  }
}

function handleEvent(id, type, message, client) {
  log("<"+id+"> handling " + type);

  if (type == 'connection') {
    return handleConnection(id, message);
  } else if (type == 'location') {
    return handleLocation(id, message, client);
  } else if (type == 'disconnection') {
    return handleDisconnection(id, message);
  } else if (type == 'stats') {
    return handleStats(id, message);
  } else {
    return JSON.stringify({
      error: "Don't know how to handle 'type'" + type,
    });
  }
}

function handleConnection(id, message) {
  players.labels.push(id);
  players[id] = { id: id }
  return current_status(id, 'connection', players[id]);
}

function handleDisconnection(id, message) {
  return current_status(id, 'disconnection', players[id])
}

function handleLocation(id, message, client) {
  players[id] = {
    id: id,
    lat: message.lat,
    lon: message.lon,
  }

  outbreak(id, players, client)

  return current_status(id, 'location', players);
}

// Find the nearest neighbours
// Lather, rinse, repeat for each subsequent player over the threshold
function outbreak(id, players, client, disrupt, threshold) {
  disrupt = disrupt || 3
  threshold = threshold || 3

  players = nearest.create_geoHash(players);
  nearby_players = nearest.find_nearest_player(players[id], players, disrupt); // disrupt the three nearest to you

  log('Running outbreak for ' + id);
  log('Nearby players hash: ' + JSON.stringify(nearby_players));
  log('Nearby players length: ' + nearby_players.length);

  // Disrupt each of your neighbours
  var len = nearby_players.length;
  for (var i = 0; i < len; i++) {  
    player_id = nearby_players[i]['id']
    //client.send(current_status(player_id, 'score', players[player_id]));

    // Propagate out through the network if we have disrupted enough neighbours
    if (len >= threshold) {
      log('Would recurse into outbreak for ' + player_id);
      //outbreak(player_id, players, client, disrupt, threshold);
    }
  }
}

function handleStats(id, message) {
  var response = {
    id: id,
    type: 'stats',
    players_online:  players.labels.length
  };
  return JSON.stringify(response);
}

function current_status(id, type, player) {
  var message = {
    id: id,
    type: type,
    player: player
  };

  return JSON.stringify(message);
}

var players = {
  labels: []
};

server = http.createServer(function(req, res){ 
  res.writeHead(200, {'Content-Type': 'text/html'}); 
  res.write('<h1>bliss</h1>'); 
  res.close(); 
});

var socket = io.listen(server);

socket.on('connection', function(client) {
  log("<"+client.sessionId+"> connected");

  var response = handleEvent(client.sessionId, 'connection', false, client);
  client.send(response);

  var stats = handleEvent(client.sessionId, 'stats', false, client);
  client.send(stats);
  client.broadcast(stats);

  client.on('message', function(evt) {
    log("<"+client.sessionId+"> "+evt);

    var message = JSON.parse(evt);
    var response = handleEvent(client.sessionId, message['event_type'], message, client);
    client.send(response);
    client.broadcast(response);
  })

  client.on('disconnect', function() {
    log("closed connection: " + client.sessionId);

    var response = handleEvent(client.sessionId, 'disconnection');
    removePlayer(client.sessionId);
    client.broadcast(response);

    var stats = handleEvent(client.sessionId, 'stats', false, client);
    client.broadcast(stats);

    log('Updated players: ' + JSON.stringify(players));
  }) 
});

server.listen(node_port, "173.45.236.98");
