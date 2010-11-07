function RadToDeg(radians) {
return radians * (180 / Math.PI);
}

function DegToRad(degrees) {
  return degrees * (Math.PI / 180); 
}

function ConvertToBearing(deg) {
  return (deg + 360) % 360;
}

// Calculate bearing, from http://www.sergemeunier.com/blog/finding-the-bearing-between-two-gps-coordinates
function Bearing(lat1, long1, lat2, long2) {
  //Convert input values to radians 
  var lat1 = DegToRad(lat1);
  var long1 = DegToRad(long1);
  var lat2 = DegToRad(lat2);
  var long2 = DegToRad(long2);

  var deltaLong = long2 - long1;

  var y = Math.sin(deltaLong) * Math.cos(lat2);
  var x = Math.cos(lat1) * Math.sin(lat2) -
  Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLong);
  var bearing = Math.atan2(y, x);
  return ConvertToBearing(RadToDeg(bearing));
}

// Calculate distance, from http://github.com/palfrey/nearby_art/blob/master/index.html
if (typeof(Number.prototype.toRad) === "undefined") {
  Number.prototype.toRad = function() {
    return this * Math.PI / 180;
  }
}

// Taken from http://www.movable-type.co.uk/scripts/latlong.html
// Using Haversine formula http://en.wikipedia.org/wiki/Haversine_formula
function longLatDistance(lat1, lon1, lat2, lon2)
{
  var R = 6371; // km
  var dLat = (lat2-lat1).toRad();
  var dLon = (lon2-lon1).toRad(); 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1.toRad()) * Math.cos(lat2.toRad()) * 
      Math.sin(dLon/2) * Math.sin(dLon/2); 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var d = R * c;
  return d;
}
