var nconf = require('nconf');
var fs = require('fs');
var build = fs.readFileSync('.build', "utf8");

var configFile = 'config/config.json';
nconf.argv()
  .env()
  .file({ file:
  configFile
  });

global._logger.logTrace("Environment Config Loaded", {configFile: configFile});

module.exports = function() {

  function getBuild() {
    return build;
  }

  function getSettings() {
    var settings = nconf.get('settings');
    if(!settings) {
      throw "Could not load settings!";
    }
    return settings;
  }

  return {
    getSettings: getSettings,
    getBuild:getBuild
  }

}();