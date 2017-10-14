const express = require("express");

var app = express();

// —————————————————————— Default Values ——————————————————————
const defaults = require( "./back-end/core/defaults" )();

// —————————————————————— Static Files ——————————————————————
require( "./back-end/core/static-files" )(app);

// —————————————————————— POST ——————————————————————
require( "./back-end/core/post" )(app);

// —————————————————————— GET ——————————————————————
require( "./back-end/core/get" )(app);

// —————————————————————— Lauch Server ——————————————————————
var server = app.listen( defaults.expressPort, () => {
  console.log("Express is started: " + defaults.expressPort);
});

// —————————————————————— Export ——————————————————————
module.exports = () => {

  return {
    app: app,
    server: server
  };
  
};