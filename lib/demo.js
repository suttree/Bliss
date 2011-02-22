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
  {id: 1048, lat: 51.52, lon: -0.103},
  {id: 1049, lat: 51.520874, lon: -0.104983},
  {id: 1050, lat: 51.52, lon: -0.108},
  {id: 1051, lat: 51.525471, lon: -0.107929},
  {id: 1052, lat: 51.527448, lon: -0.095442},
  {id: 1053, lat: 51.523, lon: -0.093},
  {id: 1054, lat: 51.520232, lon: -0.094691},
  {id: 1055, lat: 51.523, lon: -0.085},
  {id: 1056, lat: 51.518, lon: -0.086},
  {id: 1057, lat: 51.519565, lon: -0.096894},
  {id: 1058, lat: 51.517, lon: -0.092},
  {id: 1059, lat: 51.516, lon: -0.093},
  {id: 1060, lat: 51.520875, lon: -0.099838},
  {id: 1061, lat: 51.516282, lon: -0.091746},
  {id: 1062, lat: 51.515, lon: -0.081},
  {id: 1063, lat: 51.512, lon: -0.083},
  {id: 1064, lat: 51.513, lon: -0.079},
  {id: 1065, lat: 51.52, lon: -0.101},
  {id: 1066, lat: 51.512, lon: -0.085},
  {id: 1067, lat: 51.517594, lon: -0.097625},
  {id: 1068, lat: 51.516936, lon: -0.099089},
  {id: 1069, lat: 51.516, lon: -0.107},
  {id: 1070, lat: 51.515, lon: -0.1},
  {id: 1071, lat: 51.517592, lon: -0.099089},
  {id: 1072, lat: 51.512, lon: -0.091},
  {id: 1073, lat: 51.513, lon: -0.1},
  {id: 1074, lat: 51.514, lon: -0.107},
  {id: 1075, lat: 51.52416, lon: -0.096177},
  {id: 1076, lat: 51.513606, lon: -0.149799},
  {id: 1077, lat: 51.521386, lon: -0.104418},
  {id: 1078, lat: 51.512853, lon: -0.206423},
  {id: 1079, lat: 51.5082, lon: -0.233605},
  {id: 1070, lat: 51.513, lon: -0.32},
  {id: 1081, lat: 51.495113, lon: -0.211460},
  {id: 1082, lat: 51.514, lon: -0.139},
  {id: 1083, lat: 51.514, lon: -0.148},
  {id: 1084, lat: 51.513618, lon: -0.135815},
  {id: 1085, lat: 51.513, lon: -0.135},
  {id: 1086, lat: 51.519, lon: -0.147},
  {id: 1087, lat: 51.517, lon: -0.159},
  {id: 1088, lat: 51.507, lon: -0.143},
  {id: 1089, lat: 51.510323, lon: -0.146115},
  {id: 1090, lat: 51.518, lon: -0.149},
  {id: 1091, lat: 51.512298, lon: -0.140970},
  {id: 1092, lat: 51.520184, lon: -0.136582},
  {id: 1093, lat: 51.518197, lon: -0.152755},
  {id: 1094, lat: 51.519518, lon: -0.142444},
  {id: 1095, lat: 51.514879, lon: -0.179972},
  {id: 1096, lat: 51.512054, lon: -0.265367},
  {id: 1097, lat: 51.488439, lon: -0.264433},
  {id: 1098, lat: 51.51331, lon: -0.301519},
  {id: 1099, lat: 51.492458, lon: -0.229095},
  {id: 1100, lat: 51.510602, lon: -0.335402},
  {id: 1101, lat: 51.501048, lon: -0.193827},
  {id: 1102, lat: 51.52799, lon: -0.191827},
  {id: 1103, lat: 51.524142, lon: -0.123356},
  {id: 1104, lat: 51.517, lon: -0.125},
  {id: 1105, lat: 51.520195, lon: -0.125547},
  {id: 1106, lat: 51.520851, lon: -0.129968},
  {id: 1107, lat: 51.524, lon: -0.126},
  {id: 1108, lat: 51.522, lon: -0.12},
  {id: 1109, lat: 51.519, lon: -0.116},
  {id: 1110, lat: 51.517, lon: -0.118},
  {id: 1111, lat: 51.525, lon: -0.116},
  {id: 1112, lat: 1.51232, lon: -0.121123},
  {id: 1113, lat: 51.516, lon: -0.115},
  {id: 1114, lat: 51.51429, lon: -0.119649},
  {id: 1115, lat: 51.512, lon: -0.123},
  {id: 1116, lat: 51.512967, lon: -0.127731},
  {id: 1117, lat: 51.51, lon: -0.125},
  {id: 1118, lat: 51.512, lon: -0.119},
  {id: 1119, lat: 51.446531, lon: 0.206018},
  {id: 1120, lat: 51.444, lon: 0.308},
  {id: 1121, lat: 51.436357, lon: 0.344804},
  {id: 1122, lat: 51.414621, lon: 0.407866},
  {id: 1123, lat: 51.383815, lon: 0.346476},
  {id: 1124, lat: 51.424324, lon: 0.118534},
  {id: 1125, lat: 51.441422, lon: 0.101025},
  {id: 1126, lat: 51.465047, lon: 0.106971},
  {id: 1127, lat: 51.487, lon: 0.149},
  {id: 1128, lat: 51.487302, lon: 0.161395},
  {id: 1129, lat: 51.430654, lon: 0.229322},
  {id: 1130, lat: 51.380714, lon: 0.297088},
  {id: 1131, lat: 51.391, lon: 0.233},
  {id: 1132, lat: 51.436119, lon: 0.146440},
  {id: 1133, lat: 51.45581, lon: 0.142867},
  {id: 1134, lat: 51.467628, lon: 0.149559},
  {id: 1135, lat: 51.479398, lon: 0.179717},
  {id: 1136, lat: 51.44638, lon: 0.281677},
  {id: 1137, lat: 51.495933, lon: -0.093868},
  {id: 1138, lat: 51.484792, lon: 0.000007},
  {id: 1139, lat: 51.488679, lon: -0.110733},
  {id: 1140, lat: 51.442771, lon: 0.028541},
  {id: 1141, lat: 51.45787, lon: -0.010978},
  {id: 1142, lat: 51.476244, lon: -0.041016},
  {id: 1143, lat: 51.470329, lon: -0.064472},
  {id: 1144, lat: 51.496601, lon: -0.054981},
  {id: 1145, lat: 51.488031, lon: -0.093105},
  {id: 1146, lat: 51.480838, lon: 0.072545},
  {id: 1147, lat: 51.41781, lon: -0.087765},
  {id: 1148, lat: 51.489982, lon: 0.118780},
  {id: 1149, lat: 51.411257, lon: -0.059209},
  {id: 1150, lat: 51.44143, lon: -0.087103},
  {id: 1151, lat: 51.452594, lon: -0.070284},
  {id: 1152, lat: 51.444075, lon: -0.049749},
  {id: 1153, lat: 51.451265, lon: -0.099606},
  {id: 1154, lat: 51.396818, lon: -0.076000},
  {id: 1155, lat: 51.428318, lon: -0.052663},
  {id: 1156, lat: 51.43157, lon: -0.100975},
  {id: 1157, lat: 51.501821, lon: 0.105653},
  {id: 1158, lat: 51.469029, lon: 0.023439},
  {id: 1159, lat: 51.460491, lon: -0.036605},
  {id: 1150, lat: 51.47294, lon: -0.093097},
  {id: 1161, lat: 51.436209, lon: -0.013897},
  {id: 1162, lat: 51.484129, lon: 0.035171},
  {id: 1163, lat: 51.479535, lon: -0.030041},
  {id: 1164, lat: 51.446699, lon: 0.055643},
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
      setTimeout(function() {remove_demo_player(socket, this)}, Math.floor((Math.random() * 10) + 1) * 180000);
    });
  }
}

function remove_demo_player(socket, timer) {
  socket.disconnect();
  clearTimeout(timer);
}
