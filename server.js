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
  players.labels.push(id);
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

  log('Running outbreak for ' + id);
  log('Nearby players hash: ' + JSON.stringify(nearby_players));
  log('Nearby players length: ' + nearby_players.length);

  // Disrupt each of your neighbours
  var len = nearby_players.length;
  for (var i = 0; i < len; i++) {  
    player_id = nearby_players[i]['id']
    players[player_id].score += 1;
    client.send(current_status(player_id, 'score', players[player_id]));

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

function handleScores(id) {
  var all_scores = {};
  var len = players.labels.length;

  for (var x = 0; x <len; x++) {
    var player = players[players.labels[x]];
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

var players = {
  labels: []
};

// A fake player at Dartford station
players.labels.push(4);
players[4] = {
  id: 4,
  score: 0,
  lat: 51.44737,
  lon: 0.21926
};

// A fake player at Angel station
players.labels.push(5);
players[5] = {
  id: 5,
  score: 0,
  lat: 51.5324989, 
  lon: -0.1057899
};

// Another fake player in The Island Queen, Islington
players.labels.push(6);
players[6] = {
  id: 6,
  score: 0,
  lat: 51.53313578916992,
  lon: -0.09823322296142578
};

// And another player at the Screen on the Green, Islington
players.labels.push(7);
players[7] = {
  id: 7,
  score: 0,
  lat: 51.53649936111712,
  lon: -0.10364055633544922
};

// Here's a player in Thirza Road, Dartford
players.labels.push(8);
players[8] = {
  id: 8,
  score: 0,
  lat: 51.443923918816395, 
  lon: 0.2287602424621582
}

// Here's a player in Kenwyn Road, Dartford
players.labels.push(9);
players[9] = {
  id: 9,
  score: 0,
  lat: 51.45162677603857, 
  lon: 0.21438360214233398
}

// And one more in the M&S in Dartford
players.labels.push(10);
players[10] = {
  id: 10,
  score: 0,
  lat: 51.44794935873729, 
  lon: 0.21680831909179688
}

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
