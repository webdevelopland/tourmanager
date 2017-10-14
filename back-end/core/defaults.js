var mongodb = require("./mongodb");

module.exports = () => {

  var defaults = {};
  defaults.expressPort = process.env.PORT || 4000;
  defaults.browserSyncPort = 7000;
  
  Object.assign(defaults, mongodb());

  return defaults;

};