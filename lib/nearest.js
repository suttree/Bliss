var sys = require("sys");
var geohash = require(__dirname + '/geohash').GeoHash;

// From http://www.synchrosinteractive.com/blog/1-software/38-geohash
exports.create_geoHash = function (players) {
  for (var i in players) {
    players[i].geoHash = geohash.encodeGeoHash(players[i].lat, players[i].lon);
  }
  return players;
};

// From http://www.synchrosinteractive.com/blog/1-software/38-geohash
exports.find_nearest_player = function (current_user, players, limit) {
  var matching = {},
      accuracy = 12,
      boundary = 10,
    match_count = 0;

  while (match_count < limit && accuracy > 0) {
    var cmp_hash = current_user.geoHash.substring(0, accuracy);

    for (var i in players) {
      if (players[i].id == current_user.id) continue; // don't match with yourself
      if (!current_user.lat || !current_user.lon || !players[i].lat || !players[i].lon) continue // don't try matching players with no location
      if (players[i].geoHash in matching) continue; // don't re-check ones that have already matched
      if (longLatDistance(current_user.lat, current_user.lon, players[i].lat, players[i].lon) > boundary) continue; // ignore players too far away
      if (players[i].geoHash.substring(0, accuracy) === cmp_hash) {
        matching[players[i].geoHash] = players[i];
        match_count++;
        if (match_count == limit) break;
      }
    }
    accuracy--;
  }

  var tmp = [];
  for (var geoHash in matching) {
    tmp.push(matching[geoHash]);
  }
  return tmp;
};

// Taken from http://www.movable-type.co.uk/scripts/latlong.html
// Using Haversine formula http://en.wikipedia.org/wiki/Haversine_formula
function longLatDistance (lat1, lon1, lat2, lon2) {
  var R = 6371; // km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  //sys.puts(d.toString() + "km from here");
  return d;
}

// Calculate distance, from http://github.com/palfrey/nearby_art/blob/master/index.html
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}
