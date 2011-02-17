// Add more players from http://www.doogal.co.uk/london_postcodes.php
var fakes = [
  {id: 1000, lat: -73.964003, lon: 40.773503}, // Heavysixer, snowed in, New York
  {id: 1001, lat: 51.44737, lon: 0.21926}, // Dartford Station, Dartford
  {id: 1002, lat: 51.5324989, lon: -0.1057899}, // Angel Station, Islington
  {id: 1003, lat: 51.53313578916992, lon: -0.09823322296142578}, // The Island Queen, Islington
  {id: 1004, lat: 51.53649936111712, lon: -0.10364055633544922}, // Screen on the Green, Islington
  {id: 1005, lat: 51.443923918816395, lon: 0.2287602424621582}, // Thirza Road, Dartford
  {id: 1006, lat: 51.45162677603857, lon: 0.21438360214233398}, // Kenwyn Road, Dartford
  {id: 1007, lat: 51.44794935873729, lon: 0.21680831909179688}, // Marks & Spencer, Dartford
  {id: 1008, lat: 51.444499, lon: 0.209754}, // etc
  {id: 1009, lat: 51.44523, lon: 0.21677},
  {id: 1010, lat: 51.442781, lon: 0.225933},
  {id: 1011, lat: 51.446425, lon: 0.216827},
  {id: 1012, lat: 51.444302, lon: 0.220222},
  {id: 1013, lat: 51.445032, lon: 0.216314},
  {id: 1014, lat: 51.444951, lon: 0.216814},
  {id: 1015, lat: 51.44613, lon: 0.216727},
  {id: 1016, lat: 51.539426, lon: -0.117931},
  {id: 1017, lat: 51.539611, lon: -0.118832},
  {id: 1018, lat: 51.5404, lon: -0.122058},
  {id: 1019, lat: 51.537482, lon: -0.122366},
  {id: 1020, lat: 51.537654, lon: -0.116822},
  {id: 1020, lat: 51.538425, lon: -0.103278},
  {id: 1021, lat: 51.53567, lon: -0.100264},
  {id: 1022, lat: 51.533965, lon: -0.098835},
  {id: 1023, lat: 51.535606, lon: -0.100757},
  {id: 1024, lat: 51.534611, lon: -0.100423},
  {id: 1025, lat: 51.534069, lon: -0.100821},
  {id: 1026, lat: 51.534383, lon: -0.100231},
  {id: 1027, lat: 51.534331, lon: -0.099786},
  {id: 1028, lat: 51.535121, lon: -0.099162},
  {id: 1029, lat: 51.534752, lon: -0.100778},
  {id: 1030, lat: 51.534312, lon: -0.098028},
  {id: 1031, lat: 51.521146, lon: -0.087506},
  {id: 1032, lat: 51.524503, lon: -0.112088},
  {id: 1033, lat: 51.524503, lon: -0.112088},
  {id: 1034, lat: 51.514621, lon: -0.09157},
  {id: 1035, lat: 51.519039, lon: -0.096142},
  {id: 1036, lat: 51.518562, lon: -0.143799},
  {id: 1037, lat: 51.52262, lon: -0.145652},
  {id: 1038, lat: 51.512646, lon: -0.139947},
  {id: 1039, lat: 51.512298, lon: -0.134398},
  {id: 1040, lat: 51.510421, lon: -0.135138},
  {id: 1041, lat: 51.510846, lon: -0.137022},
  {id: 1042, lat: 51.433195, lon: -0.049661},
  {id: 1043, lat: 51.441824, lon: -0.036486},
  {id: 1044, lat: 51.432137, lon: -0.048771},
  {id: 1045, lat: 51.439175, lon: -0.055579},
  {id: 1046, lat: 51.436445, lon: -0.053119},
  {id: 1047, lat: 51.491419, lon: -0.087079},
]
fakes.labels = [];

var len = fakes.length;
for (var i = 0; i < len; i++) {
  fakes.labels.push(fakes[i].id);
}

// Code duplication - mode this into a setting function?
var port;
if (window.location == 'http://bliss-staging.troisen.com/') {
  port = 1976;
} else {
  port = 1975;
}

var demo_timer = setInterval(add_demo_player, 15000);

function add_demo_player() {
  if (Math.floor(Math.random() * 2) % 2 == 0) {
    var rand = Math.floor(Math.random() * fakes.labels.length);
    var player = fakes[rand];

    var socket = new io.Socket(null, {port: port});
    socket.connect();

    socket.send(JSON.stringify({
      event_type: 'location',
      lat: player.lat,
      lon: player.lon
    }));

    socket.on('message', function(evt) {
      try {
        event = JSON.parse(evt);
      } catch(error) {
        log(evt, true);
        log(error, true);
      }
      setTimeout(function() {remove_demo_player(socket, this)}, Math.floor((Math.random() * 10) + 1) * 60000);
    });
  }
}

function remove_demo_player(socket, timer) {
  socket.disconnect();
  clearTimeout(timer);
}
