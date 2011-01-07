// From http://joshdulac.com/index.php/custom-node-js-modules/
exports.updateAccessLog = function(message) {
  if (message == undefined) {
    message = "undefined";
  }

  var sys = require("sys");
  sys.puts(message.toString());

  var fs = require("fs");
  var path = __dirname + '/../log/access.log';

  var now = new Date();
  var dateAndTime = now.toUTCString();

  stream = fs.createWriteStream(path, {
    'flags': 'a+',
    'encoding': 'utf8',
    'mode': 0644
  });
  stream.write(message + "\n", 'utf8');
  stream.end();

  return true;
}
