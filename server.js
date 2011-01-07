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
var nearest = require(__dirname + '/lib/nearest');

Array.prototype.contains = function(obj) {
  var i = this.length;
  while (i--) {
    if (this[i] === obj) {
      return true;
    }
  }
  return false;
}

Array.prototype.remove = function (subject) {
  var r = new Array();
  for(var i = 0, n = this.length; i < n; i++)
  {
    if(!(this[i] === subject))
    {
      r[r.length] = this[i];
    }
  }
  return r;
}

function handleEvent(id, type, message, client) {
  nlog.updateAccessLog("<"+id+"> handling " + type);

  if (type == 'location') {
    return handleLocation(id, message, client);
  } else if (type == 'connection') {
    return handleConnection(id, message);
  } else if (type == 'disconnection') {
    return handleDisconnection(id, message);
  } else if (type == 'stats') {
    return handleStats(id, message);
  } else if (type == 'scores') {
    return handleScores(id, message);
  } else {
    return JSON.stringify({
      error: "Don't know how to handle 'type'" + type,
    });
  }
}

function handleConnection(id, message) {
  players[id] = {
    id: id,
    score: 0
  }
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

  if (!players[id].score) {
    players[id].score = 0;
  }

  outbreak(id, players, client)

  // Broadcast the new scores to all players {:id => {:id => id, :score => score}}
  var scores = handleScores(id);
  client.send(scores);
  client.broadcast(scores);

  return current_status(id, 'location', players);
}

// Find the nearest neighbours and increase their score
// Lather, rinse, repeat for each subsequent player over the threshold
function outbreak(id, players, client, disrupt, threshold) {
  disrupt = disrupt || 3
  threshold = threshold || 3

  players = nearest.create_geoHash(players);
  nearby_players = nearest.find_nearest_player(players[id], players, disrupt); // disrupt the three nearest to you

  nlog.updateAccessLog('Running outbreak for ' + id);
  nlog.updateAccessLog('Nearby players hash:' + JSON.stringify(nearby_players));
  nlog.updateAccessLog('Nearby players length:' + nearby_players.length);

  for (var i = 0; i < nearby_players.length; i++) {  
    player_id = nearby_players[i]['id']
    players[player_id].score += 1;
    client.send(current_status(player_id, 'score', players[player_id]));

    if (players[player_id].score % threshold == 0) {
      nlog.updateAccessLog('Recursing into outbreak for ' + player_id);
      outbreak(player_id, players, client, disrupt, threshold);
    }
  }
}

function handleStats(id, message) {
  var count = 0;
  for (var player in players) {
    count++;
  }

  var response = {
    id: id,
    type: 'stats',
    players_online:  count
  };
  return JSON.stringify(response);
}

function handleScores(id) {
  var all_scores = {};
  for (var player in players) {
    all_scores[player.id] = {id: player.id, score: player.score}
  }

  var scores = {
    id: id,
    type: 'scores',
    players: all_scores
  }
  return JSON.stringify(scores);
}

function current_status(id, type, player) {
  var message = {
    id: id,
    type: type,
    player: player
  };

  return JSON.stringify(message);
}

var players = {};

// A fake player at Dartford station
players[4] = {
  id: 4,
  score: 0,
  lat: 51.44737,
  lon: 0.21926
};

// A fake player at Angel station
players[5] = {
  id: 5,
  score: 0,
  lat: 51.5324989, 
  lon: -0.1057899
};

server = http.createServer(function(req, res){ 
  res.writeHead(200, {'Content-Type': 'text/html'}); 
  res.write('<h1>bliss</h1>'); 
  res.close(); 
});

var socket = io.listen(server);

socket.on('connection', function(client) {
  nlog.updateAccessLog("<"+client.sessionId+"> connected");

  var response = handleEvent(client.sessionId, 'connection', false, client);
  client.send(response);

  var stats = handleEvent(client.sessionId, 'stats', false, client);
  client.send(stats);
  client.broadcast(stats);

  client.on('message', function(evt) {
    nlog.updateAccessLog("<"+client.sessionId+"> "+evt);

    var message = JSON.parse(evt);
    var response = handleEvent(client.sessionId, message['event_type'], message, client);
    client.send(response);
    client.broadcast(response);
  })

  client.on('disconnect', function() {
    nlog.updateAccessLog("closed connection: " + client.sessionId);

    var response = handleEvent(client.sessionId, 'disconnection');
    client.broadcast(response);

    delete players[client.sessionId]; // do it, do it now...

    var stats = handleEvent(client.sessionId, 'stats', false, client);
    client.broadcast(stats);

    nlog.updateAccessLog("updated players: " + JSON.stringify(players));
  }) 
});

server.listen(node_port, "173.45.236.98");
