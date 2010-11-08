var conn;
var current_id;
var current_lat;
var current_lon;
var text;
var players = [];

var map_width;
var map_height;
var output_log;
var dot_size = 7;

$(document).ready(function() {
  map_width = $(window).width();
  map_height = $(window).height();
  output_log = document.getElementById("log");
});

// Convert lat/lon pair to x/y co-ords
function getPoint(lat, lon) {
  x = (180 + lon) * (map_width / 360);
  y = (90 - lat) * (map_height / 180);
  return {x:x,y:y};
}

// Returns longitude in pixels at a certain zoom level
function lonToX(lon, zoom) {
    offset = 256 << (zoom-1);
    return Math.round(offset + (offset * lon / 180));
}
// Returns latitude in pixels at a certain zoom level
function latToY(lat, zoom) {
    offset = 256 << (zoom-1);
    return Math.round(offset - offset/Math.PI * Math.log((1 + Math.sin(lat * Math.PI / 180)) / (1 - Math.sin(lat * Math.PI / 180))) / 2);
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
    $('#loading').remove();

    switch(error.code) {
      case error.TIMEOUT:
        navigator.geolocation.getCurrentPosition(track_location, handle_error);
        break;
      default:
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
  $('#loading').remove();

  for (var id in event.player) {
    var colour;
    var point = {};

    if (id == current_id) {
      // The current player should always be plotted in the centre
      colour = '#CD2626';
      point.x = Math.round(map_width / 2);
      point.y = Math.round(map_height / 2);
    } else if ($('#' + id).length == 0) {
      // Add each player to the map, if they aren't already there
      colour = '#228B22';
      point.y = latToY(event.player[id].lat, 3); 
      point.x = lonToX(event.player[id].lon, 3);

      // Plot players who would otherwise be off the page at the border
      if (point.y > map_height) {
        alerting ('bordering');
        point.y = (map_height - dot_size);
      }

      //var point = getPoint(event.player[id].lat, event.player[id].lon);
    }

    alert("Plotting " + id + ' at ' + point.x + ', ' + point.y);
    //alert(point.x);
    //alert(point.y);

    var dot_meta = id + ' at ' + point.x + ', ' + point.y + ' and ' + event.player[id].lon + ', ' + event.player[id].lat;
    var dot = '<div id="' + id + '" style="position:absolute;width:' + dot_size + 'px;height:' + dot_size + 'px;top:' + point.y + 'px;left:' + point.x + 'px;background:' + colour + ' "><img src="/images/1px.png" alt="' + dot_meta + '" title="' + dot_meta + '" /></div>';
    document.body.innerHTML += dot;
    $("#" + id).effect("highlight", {}, 1500);

    $('#debug').html('Player ' + id + ' plotted');
  }
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
