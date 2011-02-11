var fakes = {
  labels = [],
  {id: 1000, lat: -73.964003, lon: 40.773503}, // Heavysixer, snowed in, New York
  {id: 1001, lat: 51.44737, lon: 0.21926}, // Dartford Station, Dartford
  {id: 1002, lat: 51.5324989, lon: -0.1057899}, // Angel Station, Islington
  {id: 1003, lat: 51.53313578916992, lon: -0.09823322296142578}, // The Island Queen, Islington
  {id: 1004, lat: 51.53649936111712, lon: -0.10364055633544922}, // Screen on the Green, Islington
  {id: 1005, lat: 51.443923918816395, lon: 0.2287602424621582}, // Thirza Road, Dartford
  {id: 1006, lat: 51.45162677603857, lon: 0.21438360214233398}, // Kenwyn Road, Dartford
  {id: 1007, lat: 51.44794935873729, lon: 0.21680831909179688}, // Marks & Spencer, Dartford
}
// Add more players from http://www.doogal.co.uk/london_postcodes.php

var len = fakes.length;
for (var i = 0; i < len; i++) {
  fakes.labels.push(fakes[i].id);
}

exports.add_player = function(client) {
  // Pick a random player and add them
  var connection = handleConnection(id, message);
  var location = handleLocation(id, message, client);
  var stats = handleStats(id, message);
  client.broadcast(stats);
}

export.remove_player = function(client) {
  // Pick a random player and remove them
  var response = handleDisconnection(id, message);
  removePlayer(client.SESSION_ID_GOES_HERE);
  client.broadcast(response);
}
