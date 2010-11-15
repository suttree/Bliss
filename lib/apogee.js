var conn;
var current_id;
var current_lat;
var current_lon;
var text;
var players = [];

var dot = {};
dot.size = 10;
var map = {};
var output_log;
var ZOOM_LEVEL = 13;

$(document).ready(function() {
  map.width = $(window).width();
  map.height = $(window).height();
  output_log = document.getElementById("log");
});

// Convert lat/lon pair to x/y co-ords
function getPoint(lat, lon) {
  x = (180 + lon) * (map.width / 360);
  y = (90 - lat) * (map.height / 180);
  return {x:x,y:y};
}

// Returns longitude in pixels at a certain zoom level
function lonToX(lon, zoom) {
    var offset = 256 << (zoom - 1);
    return Math.floor(offset + (offset * lon / 180));
}
// Returns latitude in pixels at a certain zoom level
function latToY(lat, zoom) {
    var offset = 256 << (zoom - 1);
    return Math.floor(offset - offset/Math.PI * Math.log((1 + Math.sin(lat * Math.PI / 180)) / (1 - Math.sin(lat * Math.PI / 180))) / 2);
}

var socket = new io.Socket(null, {
  rememberTransport: false,
  port: 1975,
  transports: ['websocket', 'htmlfile', 'xhr-multipart', 'xhr-polling', 'flashsocket']
});

socket.on('message', function(evt) {
  event = JSON.parse(evt);
  if (event.type == 'connection') {
    add_player(event);
  } else if (event.type == 'location') {
    update_location(event);
  } else if (event.type == 'score') {
    update_score(event);
  } else if (event.type == 'stats') {
    update_stats(event);
  } else if (event.type == 'disconnection') {
    remove_player(event);
  } else {
    // derp derp derp
  }
});

socket.on('close', function() {});

socket.on('connect', function() {
  navigator.geolocation.getCurrentPosition(track_location, handle_error, {maximumAge:Infinity, timeout:0});

  function track_location(position)
  {
    current_lat = position.coords.latitude;
    current_lon = position.coords.longitude;

    // Centre the map on coordinates of the current player
    map.centre_lon = current_lon;
    map.centre_lat = current_lat;
    map.centre_x = lonToX(map.centre_lon, ZOOM_LEVEL);
    map.centre_y = latToY(map.centre_lat, ZOOM_LEVEL);

    try {
      socket.send(JSON.stringify({
        event_type: 'location',
        lat: current_lat,
        lon: current_lon,
      }));    
    } catch(err) {
      //alert(err);
    }
  }

  // From: http://dev.w3.org/geo/api/spec-source.html
  function handle_error(error)
  {
    switch(error.code) {
      case error.TIMEOUT:
        navigator.geolocation.getCurrentPosition(track_location, handle_error);
        break;
      default:
        $('#loading').remove();
        alert("Can't seem to get your location, do you have wifi enabled?");
        alert(error.code);
        alert(error.message);
    };
  }
});

function add_player(event) {
  current_id = event.id;
  var score = $("<div id='score' class='score'>").html(event.player.score);
  $('#player1').append(score);
  $('#score').fixedCenter();
  $('#debug').html('Player ' + event.id + ' joined');
}

function update_location(event) {
  //log(event, true);
  //var point = getPoint(event.player[id].lat, event.player[id].lon);

  for (var id in event.player) {
    var colour;
    var point = {};

    // Plot each player on the map
    if (id == current_id) {
      colour = 'orange';
      dot.class = 'player1';

      // Centre the map on the current player
      point.x = Math.floor((map.width / 2) - (dot.size / 2));
      point.y = Math.floor((map.height / 2) - (dot.size / 2));
    } else if ($('#' + id).length == 0) {
      colour = 'yellow';
      dot.class = 'dot';

      // Plot each player relevant to the centre co-ords
      var x = lonToX(event.player[id].lon, ZOOM_LEVEL);
      var y = latToY(event.player[id].lat, ZOOM_LEVEL); 
      point.x = Math.floor((map.width / 2) + (map.centre_x - x));
      point.y = Math.floor((map.height / 2) + (map.centre_y - y));
    }

    if (point.x && point.y) {
      // Plot players who would otherwise be off the page at the border
      if (point.y > map.height) {
        point.y = Math.floor(map.height - dot.size * 4);
      }

      if (point.y < 0) {
        point.y = Math.floor(dot.size / 2);
      }

      if (point.x > map.width) {
        point.x = Math.floor(map.width - dot.size * 4);
      }

      if (point.x <= 0) {
        point.x = Math.floor(dot.size / 2);
      }

      // Add player to the page
      dot.meta = id + ' at ' + point.x + ', ' + point.y + ' and ' + event.player[id].lat + ', ' + event.player[id].lon;
      var player_div = '<div id="' + id + '" class="' + dot.class + '" style="position:absolute;width:' + dot.size + 'px;height:' + dot.size + 'px;top:' + point.y + 'px;left:' + point.x + 'px;"><img src="/images/10px-' + colour + '.png" align="middle" valign="middle" alt="' + dot.meta + '" title="' + dot.meta + '" /></div>';
      document.body.innerHTML += player_div;
      $("#" + id).effect("highlight", {}, 1500);
      $('#debug').html('Player ' + id + ' plotted');
    }
  }
  $('#loading').remove();
}

function update_score(event) {
  $('#player1 > #score').html(event.player.score);
}

function update_stats(event) {
  if (event.players_online == 1) {
    $('#stats').html(event.players_online + " player online");
  } else {
    $('#stats').html(event.players_online + " players online");
  }
}

function remove_player(event) {
    $('#debug').html('Player ' + event.id + ' left');
}

window.onload = function() {
  $('#player1').fixedCenter();
  socket.connect();
}
